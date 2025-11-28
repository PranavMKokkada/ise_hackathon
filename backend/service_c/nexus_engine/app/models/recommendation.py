from sqlalchemy import Column, Integer, String, Float, DateTime, JSON
from sqlalchemy.sql import func
from app.core.database import Base

class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(Integer, primary_key=True, index=True)
    target_entity_type = Column(String)  # HOSPITAL, SUPPLIER, GOVERNMENT
    target_entity_id = Column(String, index=True)
    recommendation_type = Column(String)
    priority = Column(String)  # LOW, MEDIUM, HIGH
    action_items = Column(JSON)  # List of actions
    expected_impact = Column(String)
    status = Column(String, default="PENDING")  # PENDING, IMPLEMENTED, DISMISSED
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    expires_at = Column(DateTime(timezone=True))
