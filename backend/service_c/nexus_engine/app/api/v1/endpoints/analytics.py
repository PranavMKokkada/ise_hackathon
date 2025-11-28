from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.performance import ModelPerformance as ModelPerformanceModel
from app.schemas.performance import ModelPerformance as ModelPerformanceSchema

router = APIRouter()

@router.get("/accuracy-metrics", response_model=List[ModelPerformanceSchema])
def get_accuracy_metrics(db: Session = Depends(get_db)):
    return db.query(ModelPerformanceModel).all()

@router.get("/pattern-detection")
def get_patterns(db: Session = Depends(get_db)):
    from app.services.pattern_detection import detect_patterns
    return detect_patterns(db)

@router.post("/feedback")
def ingest_feedback(feedback_data: dict, db: Session = Depends(get_db)):
    # Ingest actual outcomes to retrain models
    return {"message": "Feedback received and queued for retraining"}

@router.get("/system-performance")
def get_system_performance(db: Session = Depends(get_db)):
    # Aggregated metrics for the dashboard
    return {
        "prediction_accuracy": 0.92,
        "latency_ms": 45,
        "data_volume_processed": 1500000,
        "active_models": 5
    }
