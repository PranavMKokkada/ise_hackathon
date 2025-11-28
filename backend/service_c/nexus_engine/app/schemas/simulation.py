from pydantic import BaseModel
from typing import Optional, List, Any, Dict
from datetime import datetime

class SimulationResultBase(BaseModel):
    simulation_id: str
    scenario_type: str
    parameters: Dict[str, Any]
    predicted_outcomes: Dict[str, Any]
    impact_summary: Dict[str, Any]
    confidence_score: float

class SimulationResultCreate(SimulationResultBase):
    pass

class SimulationResult(SimulationResultBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
