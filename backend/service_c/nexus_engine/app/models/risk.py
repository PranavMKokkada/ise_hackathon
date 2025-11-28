from sqlalchemy import Column, Integer, String, Float, DateTime, JSON
from sqlalchemy.sql import func
from app.core.database import Base

class RiskCalculation(Base):
    __tablename__ = "risk_calculations"

    id = Column(Integer, primary_key=True, index=True)
    region_id = Column(String, index=True)
    item_id = Column(String, index=True)
    predicted_demand = Column(Float)
    available_supply = Column(Float)
    gap = Column(Float)
    risk_score = Column(Float)
    alert_severity = Column(String)  # LOW, MEDIUM, HIGH, CRITICAL
    calculation_date = Column(DateTime(timezone=True), server_default=func.now())
    forecast_date = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
