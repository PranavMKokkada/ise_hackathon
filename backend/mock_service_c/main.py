"""
Mock Service C: Nexus Intelligence Engine
Provides mock data for risk analysis, recommendations, simulations, and analytics.
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import random
import uuid
from datetime import datetime

app = FastAPI(title="BioNexus Mock Service C", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"service": "Mock Service C", "status": "running"}

# --- Risk Analysis ---

@app.get("/risk-analysis/critical-alerts")
def get_critical_alerts(region: Optional[str] = None):
    """Get high-priority alerts"""
    alerts = [
        {
            "id": "ALT-001",
            "type": "Outbreak Spike",
            "region": "Maharashtra, India",
            "severity": "Critical",
            "timestamp": datetime.now().isoformat(),
            "message": "Dengue cases projected to rise 40% in next 7 days."
        },
        {
            "id": "ALT-002",
            "type": "Supply Disruption",
            "region": "Hanoi, Vietnam",
            "severity": "High",
            "timestamp": datetime.now().isoformat(),
            "message": "Flood warning affecting Artemisinin transport routes."
        },
        {
            "id": "ALT-003",
            "type": "Inventory Low",
            "region": "Nairobi, Kenya",
            "severity": "Medium",
            "timestamp": datetime.now().isoformat(),
            "message": "Paracetamol stock below 15 days coverage."
        }
    ]
    if region:
        return [a for a in alerts if region in a["region"]]
    return alerts

@app.get("/risk-analysis/resilience-gap")
def get_resilience_gap():
    """Get overall system resilience metrics"""
    return {
        "global_score": 72,
        "gap_trend": "improving",
        "vulnerable_nodes": 12
    }

# --- Recommendations ---

@app.get("/recommendations/hospitals")
def get_hospital_recommendations(hospital_id: Optional[str] = None):
    """Get actionable recommendations for hospitals"""
    return [
        {
            "id": "REC-001",
            "type": "Stockpile",
            "item": "Paracetamol IV",
            "quantity": 5000,
            "priority": "High",
            "reason": "Predicted demand spike in 10 days"
        },
        {
            "id": "REC-002",
            "type": "Protocol",
            "action": "Activate Dengue Ward B",
            "priority": "Medium",
            "reason": "Case load exceeding 80% capacity"
        }
    ]

# --- Simulations ---

class SimulationParams(BaseModel):
    scenario: str
    rainfall_change: float
    mobility_change: float
    infection_rate: float
    supply_disruption: float

@app.post("/simulations/run")
def run_simulation(params: SimulationParams):
    """Run a what-if simulation"""
    sim_id = str(uuid.uuid4())
    return {
        "simulation_id": sim_id,
        "status": "completed",
        "results": {
            "predicted_cases_change": "+15%",
            "new_hotspots": ["R003", "R007"],
            "additional_shortages": 3,
            "affected_population": "2.5M",
            "impact_score": 85
        }
    }

@app.get("/simulations/scenarios")
def get_scenarios():
    """Get pre-defined scenarios"""
    return [
        {"id": "SCN-001", "name": "Monsoon Surge", "description": "Heavy rainfall + 50%"},
        {"id": "SCN-002", "name": "Port Strike", "description": "Major export hub closure"},
        {"id": "SCN-003", "name": "New Variant", "description": "High transmission viral strain"}
    ]

# --- Analytics ---

@app.get("/analytics/accuracy-metrics")
def get_accuracy_metrics():
    """Get model performance metrics"""
    return {
        "overall_accuracy": 0.87,
        "precision": 0.82,
        "recall": 0.89,
        "history": [
            {"date": "2023-11-01", "accuracy": 0.85},
            {"date": "2023-11-08", "accuracy": 0.86},
            {"date": "2023-11-15", "accuracy": 0.88},
            {"date": "2023-11-22", "accuracy": 0.87},
        ]
    }

@app.get("/analytics/system-performance")
def get_system_performance():
    """Get system performance metrics"""
    return {
        "prediction_accuracy": 0.92,
        "avg_latency": 45,
        "data_points_processed": 1500000,
        "active_models": 12
    }

@app.get("/predictions/impact-score")
def get_impact_score():
    """Get combined impact scores for regions"""
    return [
        {"region_id": "R001", "score": 78, "trend": "up"},
        {"region_id": "R002", "score": 85, "trend": "up"},
        {"region_id": "R003", "score": 45, "trend": "stable"},
    ]
