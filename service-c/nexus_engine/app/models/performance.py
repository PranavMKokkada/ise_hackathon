from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.sql import func
from app.core.database import Base

class ModelPerformance(Base):
    __tablename__ = "model_performance"

    id = Column(Integer, primary_key=True, index=True)
    model_type = Column(String, index=True)
    accuracy = Column(Float)
    precision = Column(Float)
    recall = Column(Float)
    mae = Column(Float)
    rmse = Column(Float)
    training_date = Column(DateTime(timezone=True))
    evaluation_date = Column(DateTime(timezone=True), server_default=func.now())
