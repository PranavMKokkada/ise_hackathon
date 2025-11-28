from sqlalchemy import Column, Integer, String, Float, DateTime, JSON
from sqlalchemy.sql import func
from app.core.database import Base

class SimulationResult(Base):
    __tablename__ = "simulation_results"

    id = Column(Integer, primary_key=True, index=True)
    simulation_id = Column(String, unique=True, index=True)
    scenario_type = Column(String)
    parameters = Column(JSON)
    predicted_outcomes = Column(JSON)
    impact_summary = Column(JSON)
    confidence_score = Column(Float)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
