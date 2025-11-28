from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ModelPerformanceBase(BaseModel):
    model_type: str
    accuracy: float
    precision: float
    recall: float
    mae: float
    rmse: float
    training_date: Optional[datetime] = None

class ModelPerformanceCreate(ModelPerformanceBase):
    pass

class ModelPerformance(ModelPerformanceBase):
    id: int
    evaluation_date: datetime

    class Config:
        from_attributes = True
