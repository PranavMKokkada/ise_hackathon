from sqlalchemy import Column, Integer, String, Float, DateTime, Date
from .database import Base

class OutbreakPrediction(Base):
    __tablename__ = "outbreak_predictions"

    id = Column(Integer, primary_key=True, index=True)
    prediction_date = Column(Date, index=True)
    risk_score = Column(Float)
    location = Column(String(255))
    model_version = Column(String(50))
    created_at = Column(DateTime)

class EnvironmentalData(Base):
    __tablename__ = "environmental_data"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, index=True)
    temperature = Column(Float)
    humidity = Column(Float)
    precipitation = Column(Float)
    location = Column(String(255))

class SocialSignal(Base):
    __tablename__ = "social_signals"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, index=True)
    sentiment_score = Column(Float)
    topic = Column(String(255))
    source = Column(String(50))
