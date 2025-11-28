from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.risk import RiskCalculation as RiskCalculationModel
from app.schemas.risk import RiskCalculation as RiskCalculationSchema

router = APIRouter()

@router.get("/resilience-gap", response_model=List[RiskCalculationSchema])
def get_resilience_gap(db: Session = Depends(get_db)):
    return db.query(RiskCalculationModel).all()

@router.get("/collision-points")
def get_collision_points(db: Session = Depends(get_db)):
    collisions = db.query(RiskCalculationModel).filter(RiskCalculationModel.gap > 0).all()
    return collisions

@router.get("/critical-alerts")
def get_critical_alerts(db: Session = Depends(get_db)):
    alerts = db.query(RiskCalculationModel).filter(RiskCalculationModel.alert_severity == "CRITICAL").all()
    return alerts

@router.post("/calculate")
def trigger_calculation(db: Session = Depends(get_db)):
    # In a real scenario, this would trigger the Celery task
    from app.tasks.data_ingestion import run_collision_detection
    run_collision_detection.delay()
    return {"message": "Calculation triggered in background"}

@router.get("/timeline/{days}")
def get_timeline(days: int, db: Session = Depends(get_db)):
    # Placeholder for time-series data
    return {"message": f"Timeline for {days} days"}
