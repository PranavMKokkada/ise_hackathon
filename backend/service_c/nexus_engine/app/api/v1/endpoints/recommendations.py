from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.recommendation import Recommendation as RecommendationModel
from app.schemas.recommendation import Recommendation as RecommendationSchema

router = APIRouter()

@router.get("/hospitals/{hospital_id}", response_model=List[RecommendationSchema])
def get_hospital_recommendations(hospital_id: str, db: Session = Depends(get_db)):
    return db.query(RecommendationModel).filter(
        RecommendationModel.target_entity_type == "HOSPITAL",
        RecommendationModel.target_entity_id == hospital_id
    ).all()

@router.get("/suppliers", response_model=List[RecommendationSchema])
def get_supplier_recommendations(db: Session = Depends(get_db)):
    return db.query(RecommendationModel).filter(RecommendationModel.target_entity_type == "SUPPLIER").all()

@router.get("/government", response_model=List[RecommendationSchema])
def get_government_recommendations(db: Session = Depends(get_db)):
    return db.query(RecommendationModel).filter(RecommendationModel.target_entity_type == "GOVERNMENT").all()

@router.get("/redistribution")
def get_redistribution_plan(db: Session = Depends(get_db)):
    from app.services.optimization import optimize_redistribution
    # Mock data
    return optimize_redistribution([], [])
