import os
import random
from datetime import datetime, timedelta
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models import Base, OutbreakPrediction, EnvironmentalData, SocialSignal
from app.database import DATABASE_URL

# Ensure we can import app modules
import sys
sys.path.append(os.getcwd())

def seed_data():
    engine = create_engine(DATABASE_URL)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    # Check if data exists
    if db.query(EnvironmentalData).count() > 0:
        print("Data already exists. Skipping seed.")
        return

    print("Seeding data...")
    
    base_date = datetime.now()
    locations = ["New York", "London", "Tokyo", "Mumbai", "Sydney"]
    
    for i in range(50):
        timestamp = base_date - timedelta(days=i)
        
        # Environmental Data
        env_data = EnvironmentalData(
            timestamp=timestamp,
            temperature=random.uniform(10.0, 35.0),
            humidity=random.uniform(30.0, 90.0),
            precipitation=random.uniform(0.0, 20.0),
            location=random.choice(locations)
        )
        db.add(env_data)
        
        # Social Signals
        social_signal = SocialSignal(
            timestamp=timestamp,
            sentiment_score=random.uniform(-1.0, 1.0),
            topic="flu symptoms",
            source="twitter"
        )
        db.add(social_signal)
        
        # Outbreak Predictions (Historical)
        prediction = OutbreakPrediction(
            prediction_date=timestamp.date(),
            risk_score=random.uniform(0.0, 1.0),
            location=random.choice(locations),
            model_version="v1.0",
            created_at=timestamp
        )
        db.add(prediction)

    db.commit()
    db.close()
    print("Seeding complete.")

if __name__ == "__main__":
    seed_data()
