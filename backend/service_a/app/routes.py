from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from datetime import date, datetime
import pandas as pd
from io import BytesIO
from fastapi.responses import StreamingResponse
from fpdf import FPDF

from .database import get_db
from .models import OutbreakPrediction, EnvironmentalData
from .ml.ml_engine import EnsembleForecaster

router = APIRouter()

# Pydantic models
class ForecastResponse(BaseModel):
    days: int
    forecast: List[float]
    model: str = "ensemble-prophet-lstm"

class PredictionResponse(BaseModel):
    id: int
    prediction_date: date
    risk_score: float
    location: str
    model_version: str

class SimulationRequest(BaseModel):
    temperature_offset: float
    humidity_offset: float

class SimulationResponse(BaseModel):
    original_risk: float
    simulated_risk: float
    parameters: SimulationRequest

# Global forecaster instance (lazy loaded in real app, initialized here for simplicity)
forecaster = EnsembleForecaster()
# Flag to check if trained
is_trained = False

def train_models_if_needed(db: Session):
    global is_trained
    if not is_trained:
        # Fetch data
        data = db.query(EnvironmentalData).order_by(EnvironmentalData.timestamp).all()
        if not data:
            return # Cannot train without data
            
        df = pd.DataFrame([{
            'timestamp': d.timestamp,
            'temperature': d.temperature,
            'humidity': d.humidity
        } for d in data])
        
        forecaster.train(df)
        is_trained = True

@router.get("/forecast/{days}", response_model=ForecastResponse)
def get_forecast(days: int, db: Session = Depends(get_db)):
    train_models_if_needed(db)
    if not is_trained:
        raise HTTPException(status_code=503, detail="Models not trained (insufficient data)")
        
    predictions = forecaster.forecast(days)
    return ForecastResponse(days=days, forecast=predictions)

@router.get("/outbreak-predictions/current", response_model=PredictionResponse)
def get_current_prediction(db: Session = Depends(get_db)):
    # Get the latest prediction
    prediction = db.query(OutbreakPrediction).order_by(OutbreakPrediction.prediction_date.desc()).first()
    if not prediction:
        raise HTTPException(status_code=404, detail="No predictions found")
    
    return PredictionResponse(
        id=prediction.id,
        prediction_date=prediction.prediction_date,
        risk_score=prediction.risk_score,
        location=prediction.location,
        model_version=prediction.model_version
    )

@router.post("/simulate", response_model=SimulationResponse)
def simulate_outbreak(request: SimulationRequest, db: Session = Depends(get_db)):
    # Simple simulation logic: higher temp/humidity increases risk slightly
    # In a real app, this would use the ML model with perturbed inputs
    
    current = db.query(OutbreakPrediction).order_by(OutbreakPrediction.prediction_date.desc()).first()
    base_risk = current.risk_score if current else 0.5
    
    # Mock simulation logic
    risk_change = (request.temperature_offset * 0.01) + (request.humidity_offset * 0.005)
    simulated_risk = min(max(base_risk + risk_change, 0.0), 1.0)
    
    return SimulationResponse(
        original_risk=base_risk,
        simulated_risk=simulated_risk,
        parameters=request
    )

@router.get("/outbreak-predictions/report")
def get_report():
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=12)
    pdf.cell(200, 10, txt="Biological Weather Report", ln=1, align="C")
    pdf.cell(200, 10, txt=f"Generated on: {datetime.now()}", ln=1, align="L")
    pdf.cell(200, 10, txt="Risk Level: Moderate", ln=1, align="L")
    pdf.cell(200, 10, txt="Forecast: Stable", ln=1, align="L")
    
    # Output to buffer
    buffer = BytesIO()
    # FPDF output returns a string in older versions or bytes in newer. 
    # We'll use output(dest='S').encode('latin-1') for string return or just output() if it supports bytes.
    # For safety with standard FPDF:
    pdf_content = pdf.output(dest='S').encode('latin-1')
    buffer.write(pdf_content)
    buffer.seek(0)
    
    return StreamingResponse(buffer, media_type="application/pdf", headers={"Content-Disposition": "attachment; filename=report.pdf"})

# --- Missing Endpoints Implementation (Mocked for Integration) ---

@router.get("/outbreak-predictions/region/{region_id}")
def get_region_forecast(region_id: str):
    return {
        "region_id": region_id,
        "risk_score": 0.75,
        "predicted_cases": 150,
        "trend": "increasing"
    }

@router.get("/outbreak-predictions/timeline")
def get_timeline():
    return [
        {"date": "2023-11-01", "cases": 10},
        {"date": "2023-11-02", "cases": 15},
        {"date": "2023-11-03", "cases": 25}
    ]

@router.get("/environmental-drivers/weather/{region_id}")
def get_weather(region_id: str):
    return {
        "region_id": region_id,
        "temperature": 28.5,
        "humidity": 65,
        "rainfall": 12.0,
        "aqi": 150
    }

@router.get("/environmental-drivers/mobility/{region_id}")
def get_mobility(region_id: str):
    return {
        "region_id": region_id,
        "mobility_index": 85,
        "trend": "stable"
    }

@router.get("/environmental-drivers/breeding-zones")
def get_breeding_zones():
    return [
        {"lat": 19.0760, "lng": 72.8777, "risk": "high"},
        {"lat": 28.7041, "lng": 77.1025, "risk": "medium"}
    ]

@router.get("/social-signals/sentiment")
def get_sentiment():
    return {"sentiment_score": -0.4, "dominant_emotion": "fear"}

@router.get("/social-signals/trends")
def get_trends():
    return ["fever", "dengue", "hospital shortage"]

@router.get("/social-signals/news-triggers")
def get_news_triggers():
    return [
        {"title": "Dengue cases rise in Mumbai", "source": "Local News", "date": "2023-11-28"}
    ]

@router.get("/heatmap-data/geojson")
def get_heatmap_geojson():
    return {
        "type": "FeatureCollection",
        "features": []
    }

@router.get("/heatmap-data/hotspots")
def get_hotspots():
    return [
        {"region": "Mumbai", "risk_score": 0.9},
        {"region": "Delhi", "risk_score": 0.85}
    ]

# --- Dashboard Support ---

@router.get("/dashboard/alerts")
def get_dashboard_alerts():
    return [
        {
            "id": 1,
            "type": "Critical Alert",
            "message": "Dengue spike detected in Mumbai Region",
            "detail": "Predicted +40% cases in 7 days.",
            "time": "2m ago",
            "severity": "high"
        },
        {
            "id": 2,
            "type": "Warning",
            "message": "High Malaria risk in Coastal Zones",
            "detail": "Due to recent heavy rainfall.",
            "time": "1h ago",
            "severity": "medium"
        },
        {
            "id": 3,
            "type": "Info",
            "message": "Vaccination drive scheduled for Delhi",
            "detail": "Starting next Monday.",
            "time": "3h ago",
            "severity": "low"
        }
    ]

@router.get("/dashboard/insights")
def get_dashboard_insights():
    return {
        "title": "Supply chain disruption risk is High for Artemisinin due to flooding in Vietnam.",
        "action": "View Recommendations",
        "severity": "high"
    }

# --- HealthCast Support ---

@router.get("/health-cast/local-weather")
def get_local_weather(lat: float = 19.0760, lng: float = 72.8777):
    # Mock data based on coords
    return {
        "location": "Mumbai, Bandra",
        "temperature": 28,
        "condition": "Partly Cloudy",
        "feels_like": 32,
        "aqi": 156,
        "safety_score": 85,
        "updated": "5m ago"
    }

@router.get("/health-cast/alerts")
def get_health_cast_alerts():
    return [
        {"id": 1, "type": "critical", "title": "Dengue Outbreak Alert", "message": "High mosquito activity detected in your area (Zone 4). Use repellent and wear long sleeves.", "time": "10m ago"},
        {"id": 2, "type": "warning", "title": "Air Quality Warning", "message": "AQI is 156 (Unhealthy). Sensitive groups should avoid outdoor exertion.", "time": "1h ago"},
        {"id": 3, "type": "info", "title": "Vaccination Drive", "message": "Free flu shots available at City Center Mall this weekend.", "time": "3h ago"}
    ]

@router.get("/health-cast/safe-zones")
def get_safe_zones(lat: float = 19.0760, lng: float = 72.8777):
    return [
        {
            "id": 1,
            "name": "City Pharmacy",
            "distance": "0.8 km",
            "status": "Open",
            "features": ["Masks Available", "Repellent Stocked"]
        },
        {
            "id": 2,
            "name": "Community Health Center",
            "distance": "1.2 km",
            "status": "Open",
            "features": ["Emergency Care", "Testing Lab"]
        }
    ]
