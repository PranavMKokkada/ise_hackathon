import json
import re
from pathlib import Path
from datetime import datetime

import numpy as np
import pandas as pd

# ---------------------------------------------------------
# STEP 1: LOAD THE DATASET
# ---------------------------------------------------------
# This dataset is in JSON format, which Pandas handles natively.
DATA_PATH = Path(__file__).with_name("pharmacy_inventory.js")


def _load_js_inventory(path: Path) -> pd.DataFrame:
    raw_text = path.read_text(encoding="utf-8")

    match = re.search(r"=\s*(\[\s*[\s\S]*?\])\s*;?\s*(?:module\.|export|$)", raw_text)
    if not match:
        raise ValueError("Inventory array not found in JS module.")

    array_text = match.group(1)
    array_text = re.sub(r"(?m)^\s*//.*$", "", array_text)
    array_text = re.sub(r"/\*[\s\S]*?\*/", "", array_text)

    def _quote_keys(match_obj: re.Match) -> str:
        leading = match_obj.group(1)
        key = match_obj.group(2)
        return f'{leading}"{key}":'

    array_text = re.sub(r"(?m)^(\s*)([A-Za-z_][A-Za-z0-9_]*)\s*:", _quote_keys, array_text)
    array_text = re.sub(r",(\s*[}\]])", r"\1", array_text)

    data = json.loads(array_text)
    return pd.DataFrame(data)


def load_inventory() -> pd.DataFrame:
    if DATA_PATH.exists():
        try:
            return _load_js_inventory(DATA_PATH)
        except (ValueError, json.JSONDecodeError) as err:
            print(f"⚠️ Failed to parse '{DATA_PATH.name}': {err}")

    print("⚠️ Dataset not found. Generating sample data with EXPIRY DATES...")
    data = [
        {"drugName": "Aspirin 100mg", "countInStock": 5, "expiryDate": "2024-12-01"},
        {"drugName": "Vitamin C", "countInStock": 200, "expiryDate": "2026-05-20"},
        {"drugName": "Antibiotic X", "countInStock": 100, "expiryDate": "2024-11-30"},
        {"drugName": "Bandages", "countInStock": 2, "expiryDate": "2028-01-01"},
    ]
    return pd.DataFrame(data)


df = load_inventory()

# ---------------------------------------------------------
# STEP 2: PREPROCESS DATES
# ---------------------------------------------------------
# Normalise differing expiry column spellings from the JS source
if 'expiryDate' not in df.columns:
    alt_expiry = next((col for col in df.columns if col.lower() == 'expirydate'), None)
    if alt_expiry:
        df['expiryDate'] = df[alt_expiry]

if 'countInStock' not in df.columns:
    alt_stock = next((col for col in df.columns if col.lower() == 'countinstock'), None)
    if alt_stock:
        df['countInStock'] = df[alt_stock]

# Convert string dates to actual datetime objects
df['expiryDate'] = pd.to_datetime(df['expiryDate'], errors='coerce')
df = df.dropna(subset=['expiryDate']).copy()

df['countInStock'] = pd.to_numeric(df['countInStock'], errors='coerce')
df = df.dropna(subset=['countInStock']).copy()
df['countInStock'] = df['countInStock'].astype(int)

current_date = pd.to_datetime(datetime.now())

# Calculate "Days Until Expiry"
df['days_until_expiry'] = (df['expiryDate'] - current_date).dt.days

# ---------------------------------------------------------
# STEP 3: CALCULATE URGENCY SCORE (The "Prediction")
# ---------------------------------------------------------

def calculate_restock_priority(row):
    stock = row['countInStock']
    days_left = row['days_until_expiry']
    
    # --- FACTOR 1: STOCK SCARCITY (0 to 100) ---
    # If stock is 0, Score is 100. If stock is > 50, Score drops to 0.
    if stock <= 0:
        stock_score = 100
    elif stock >= 50:
        stock_score = 0
    else:
        # Linear scaling: 50 stock = 0 score, 1 stock = ~98 score
        stock_score = 100 - (stock * 2)

    # --- FACTOR 2: EXPIRY URGENCY (0 to 100) ---
    # If expiring in < 30 days, we URGENTLY need *fresh* stock.
    if days_left <= 0:
        expiry_score = 100 # Expired! Need new stock immediately.
    elif days_left > 180:
        expiry_score = 0   # Safe for 6 months
    else:
        # Scale: 1 day left = 100 score, 180 days left = 0 score
        expiry_score = 100 - (days_left * (100/180))

    # --- FINAL WEIGHTED SCORE ---
    # You can adjust weights. Here: 60% Stock, 40% Expiry
    # (We prioritize running out of stock slightly over expiry)
    final_score = (0.6 * stock_score) + (0.4 * expiry_score)
    
    return min(100, max(0, final_score)) # Clamp between 0-100

df['restock_confidence_score'] = df.apply(calculate_restock_priority, axis=1)

# ---------------------------------------------------------
# STEP 4: GENERATE RECOMMENDATION TEXT
# ---------------------------------------------------------
def get_action(score):
    if score >= 80: return "🔴 CRITICAL: ACQUIRE IMMEDIATELY"
    if score >= 50: return "🟡 HIGH: Order Soon"
    if score >= 20: return "🔵 MEDIUM: Monitor"
    return "🟢 LOW: Stock Healthy"

df['action_plan'] = df['restock_confidence_score'].apply(get_action)

# Sort by urgency (Highest score first)
final_output = df[['drugName', 'countInStock', 'days_until_expiry', 'restock_confidence_score', 'action_plan']].sort_values(by='restock_confidence_score', ascending=False)

print("-" * 60)
print("📦 STOCK ACQUISITION PREDICTION MODEL")
print("-" * 60)
print(final_output.head(10).to_string(index=False))

# Export for your project
final_output.to_csv("restock_predictions.csv", index=False)