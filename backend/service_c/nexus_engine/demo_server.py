import uvicorn
import os
import threading
import time
import requests
from app.main import app
from app.core.config import settings
from app.core.database import Base, engine
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Override database URL to use SQLite for demo
settings.SQLALCHEMY_DATABASE_URI = "sqlite:///./demo_nexus.db"

# Re-create engine with new URI
engine = create_engine(settings.SQLALCHEMY_DATABASE_URI, connect_args={"check_same_thread": False})
Base.metadata.bind = engine

# Patch SessionLocal to use the new engine
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Override get_db dependency
def override_get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

from app.core.database import get_db
app.dependency_overrides[get_db] = override_get_db


# Create tables
print("Creating database tables...")
Base.metadata.create_all(bind=engine)
print("Tables created.")

def run_server():
    uvicorn.run(app, host="127.0.0.1", port=8003, log_level="info")

if __name__ == "__main__":
    # Start server in a separate thread
    server_thread = threading.Thread(target=run_server)
    server_thread.daemon = True
    server_thread.start()
    
    print("Server started on http://127.0.0.1:8003")
    time.sleep(5)  # Wait for server to start
    
    # Test endpoints
    print("\n--- Testing Endpoints ---")
    
    try:
        # 1. Root
        print("\n1. GET /")
        resp = requests.get("http://127.0.0.1:8003/")
        print(f"Status: {resp.status_code}")
        print(f"Response: {resp.json()}")
        
        # 2. Risk Analysis (Resilience Gap)
        print("\n2. GET /api/v1/nexus/risk-analysis/resilience-gap")
        resp = requests.get("http://127.0.0.1:8003/api/v1/nexus/risk-analysis/resilience-gap")
        print(f"Status: {resp.status_code}")
        print(f"Response: {resp.json()}")
        
        # 3. Run Simulation
        print("\n3. POST /api/v1/nexus/simulations/run")
        resp = requests.post("http://127.0.0.1:8003/api/v1/nexus/simulations/run", json={"rainfall": 120})
        print(f"Status: {resp.status_code}")
        print(f"Response: {resp.json()}")
        
        # 4. Analytics (Accuracy Metrics)
        print("\n4. GET /api/v1/nexus/analytics/accuracy-metrics")
        resp = requests.get("http://127.0.0.1:8003/api/v1/nexus/analytics/accuracy-metrics")
        print(f"Status: {resp.status_code}")
        print(f"Response: {resp.json()}")

    except Exception as e:
        print(f"Error testing endpoints: {e}")
    
    print("\n--- Demo Complete ---")
