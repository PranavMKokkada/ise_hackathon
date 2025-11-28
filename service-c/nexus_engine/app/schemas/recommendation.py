from pydantic import BaseModel
from typing import Optional, List, Any
from datetime import datetime

class RecommendationBase(BaseModel):
    target_entity_type: str
    target_entity_id: str
    recommendation_type: str
    priority: str
    action_items: List[Any]
    expected_impact: Optional[str] = None
    status: str = "PENDING"
    expires_at: Optional[datetime] = None

class RecommendationCreate(RecommendationBase):
    pass

class Recommendation(RecommendationBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
