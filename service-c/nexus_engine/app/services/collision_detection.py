from sqlalchemy.orm import Session
from app.models.risk import RiskCalculation
from app.schemas.risk import RiskCalculationCreate
import requests
from app.core.config import settings

def fetch_outbreak_forecasts():
    try:
        response = requests.get(f"{settings.SERVICE_A_URL}/outbreak-predictions/forecast/7")
        if response.status_code == 200:
            return response.json()
    except Exception as e:
        print(f"Error fetching Service A data: {e}")
    return []

def fetch_supply_status():
    try:
        response = requests.get(f"{settings.SERVICE_B_URL}/inventory/global-status")
        if response.status_code == 200:
            return response.json()
    except Exception as e:
        print(f"Error fetching Service B data: {e}")
    return []

def detect_collisions(db: Session):
    forecasts = fetch_outbreak_forecasts()
    supplies = fetch_supply_status()
    
    # Placeholder logic: Compare forecast demand with supply
    # This assumes some mapping between disease/region and supply items
    
    # Example logic
    collisions = []
    for forecast in forecasts:
        region_id = forecast.get("region_id")
        disease = forecast.get("disease_type")
        predicted_cases = forecast.get("predicted_cases", 0)
        
        # Estimate demand (e.g., 1 treatment per case)
        demand = predicted_cases * 1.0
        
        # Find supply for this region (mock logic)
        supply_level = 0
        for item in supplies:
            if item.get("region_id") == region_id: # and item matches disease treatment
                supply_level += item.get("quantity", 0)
        
        gap = demand - supply_level
        if gap > 0:
            risk_score = min(100, (gap / demand) * 100) if demand > 0 else 0
            severity = "LOW"
            if risk_score > 80: severity = "CRITICAL"
            elif risk_score > 50: severity = "HIGH"
            elif risk_score > 20: severity = "MEDIUM"
            
            collision = RiskCalculation(
                region_id=region_id,
                item_id=f"treatment_for_{disease}",
                predicted_demand=demand,
                available_supply=supply_level,
                gap=gap,
                risk_score=risk_score,
                alert_severity=severity
            )
            db.add(collision)
            collisions.append(collision)
    
    db.commit()
    return collisions
