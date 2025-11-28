"""
Mock Service A: Biological Weather Engine
Provides mock data for outbreak predictions, environmental drivers, and social signals.
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Any
import random
from datetime import datetime, timedelta

app = FastAPI(title="BioNexus Mock Service A", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mock Data Generators
def generate_risk_score():
    return round(random.uniform(10, 95), 1)

def generate_weather(region_id):
    base_temp = 28 if "R001" in region_id or "R002" in region_id else 15
    return {
        "temperature": round(base_temp + random.uniform(-5, 5), 1),
        "humidity": random.randint(40, 90),
        "rainfall": random.randint(0, 50),
        "wind_speed": random.randint(5, 30)
    }

REGIONS = ["R001", "R002", "R003", "R004", "R005", "R006", "R007"]
DISEASES = ["Dengue", "Malaria", "Influenza", "Typhoid"]

@app.get("/")
def root():
    return {"service": "Mock Service A", "status": "running"}

# --- Outbreak Predictions ---

@app.get("/outbreak-predictions/current")
def get_current_outbreaks():
    """Get current outbreak risk scores for all regions"""
    return [
        {
            "region_id": r,
            "disease": random.choice(DISEASES),
            "risk_score": generate_risk_score(),
            "status": "High" if random.random() > 0.7 else "Medium"
        }
        for r in REGIONS
    ]

@app.get("/outbreak-predictions/forecast/{days}")
def get_forecast(days: int):
    """Get forecast for N days"""
    forecast = []
    start_date = datetime.now()
    for i in range(days):
        date = (start_date + timedelta(days=i)).strftime("%Y-%m-%d")
        forecast.append({
            "date": date,
            "global_risk_index": round(random.uniform(40, 70), 1),
            "predicted_cases": random.randint(1000, 5000)
        })
    return forecast

@app.get("/outbreak-predictions/region/{region_id}")
def get_region_forecast(region_id: str):
    """Get detailed forecast for a specific region"""
    return {
        "region_id": region_id,
        "current_risk": generate_risk_score(),
        "diseases": [
            {
                "name": d,
                "risk_score": generate_risk_score(),
                "trend": random.choice(["increasing", "stable", "decreasing"]),
                "predicted_cases_next_7_days": random.randint(50, 500)
            }
            for d in DISEASES[:2]
        ]
    }

# --- Environmental Drivers ---

@app.get("/environmental-drivers/weather/{region_id}")
def get_weather(region_id: str):
    """Get current weather and environmental factors"""
    return {
        "region_id": region_id,
        "current": generate_weather(region_id),
        "forecast": [generate_weather(region_id) for _ in range(5)]
    }

@app.get("/environmental-drivers/breeding-zones")
def get_breeding_zones():
    """Get mosquito breeding zone hotspots (mock geo data)"""
    return [
        {"lat": 19.0760, "lng": 72.8777, "intensity": 0.8, "radius": 20}, # Mumbai
        {"lat": 21.0285, "lng": 105.8542, "intensity": 0.9, "radius": 25}, # Hanoi
        {"lat": -1.2864, "lng": 36.8172, "intensity": 0.6, "radius": 15}, # Nairobi
    ]

# --- Social Signals ---

@app.get("/social-signals/sentiment")
def get_sentiment():
    """Get social media sentiment analysis"""
    return {
        "overall_sentiment": "negative",
        "fear_index": 65,
        "trending_keywords": ["fever", "shortage", "hospital", "delay"],
        "recent_posts": [
            {"text": "Can't find paracetamol anywhere!", "sentiment": -0.8, "platform": "Twitter"},
            {"text": "Hospitals are getting crowded.", "sentiment": -0.6, "platform": "Reddit"}
        ]
    }

# --- Heatmap Data ---

@app.get("/heatmap-data/hotspots")
def get_hotspots():
    """Get top critical regions for map visualization"""
    return [
        {"region_id": "R001", "lat": 19.0760, "lng": 72.8777, "severity": "Critical"},
        {"region_id": "R002", "lat": 21.0285, "lng": 105.8542, "severity": "High"},
        {"region_id": "R005", "lat": -23.5505, "lng": -46.6333, "severity": "Medium"},
    ]
