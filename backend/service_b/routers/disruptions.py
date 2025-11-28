"""
Disruptions Router - Track supply chain disruptions
"""
from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from database.postgres_client import postgres_client

router = APIRouter()

@router.get("/current")
def get_current_disruptions() -> List[Dict[str, Any]]:
    """Get all active disruptions"""
    try:
        return postgres_client.get_current_disruptions()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/by-region/{region_id}")
def get_disruptions_by_region(region_id: str) -> List[Dict[str, Any]]:
    """Get disruptions affecting a specific region"""
    try:
        return postgres_client.get_disruptions_by_region(region_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/predicted")
def get_predicted_disruptions() -> List[Dict[str, Any]]:
    """Get predicted future disruptions (mock data for now)"""
    # This would integrate with ML models in production
    return [
        {
            "node_id": "F006",
            "node_type": "Factory",
            "disruption_type": "seasonal_shutdown",
            "severity": "Medium",
            "predicted_start_date": "2025-12-25",
            "probability": 0.75,
            "description": "New Year factory maintenance shutdown expected"
        }
    ]

@router.get("/history")
def get_disruption_history(limit: int = 50) -> List[Dict[str, Any]]:
    """Get historical disruptions"""
    try:
        disruptions = postgres_client.get_current_disruptions()
        return disruptions[:limit]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

from pydantic import BaseModel

class DisruptionReport(BaseModel):
    node_id: str
    node_type: str
    disruption_type: str
    severity: str
    description: str
    source_url: str

@router.post("/report")
def report_disruption(report: DisruptionReport) -> Dict[str, Any]:
    """Report a new disruption manually"""
    try:
        result = postgres_client.report_disruption(
            report.node_id,
            report.node_type,
            report.disruption_type,
            report.severity,
            report.description,
            report.source_url
        )
        return {"success": True, "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
