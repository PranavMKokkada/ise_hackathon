from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db

router = APIRouter()

@router.get("/shortage-probability")
def get_shortage_probability(db: Session = Depends(get_db)):
    # Mock probability
    return {"item_id": "item_123", "probability": 0.75}

@router.get("/demand-spike")
def get_demand_spike(db: Session = Depends(get_db)):
    return {"region_id": "region_A", "spike_magnitude": "High"}

@router.get("/supply-drop")
def get_supply_drop(db: Session = Depends(get_db)):
    return {"supplier_id": "supplier_X", "drop_magnitude": "Medium"}

@router.get("/impact-score")
def get_impact_score(db: Session = Depends(get_db)):
    return {"region_id": "region_A", "impact_score": 85}
