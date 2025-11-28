from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class RiskCalculationBase(BaseModel):
    region_id: str
    item_id: str
    predicted_demand: float
    available_supply: float
    gap: float
    risk_score: float
    alert_severity: str
    forecast_date: Optional[datetime] = None

class RiskCalculationCreate(RiskCalculationBase):
    pass

class RiskCalculation(RiskCalculationBase):
    id: int
    calculation_date: datetime
    created_at: datetime

    class Config:
        from_attributes = True
