from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_read_main():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to Nexus Intelligence Engine (Service C)"}

def test_risk_analysis_endpoints():
    response = client.get("/api/v1/nexus/risk-analysis/resilience-gap")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_simulation_run():
    response = client.post("/api/v1/nexus/simulations/run", json={"infection_rate": 1.2})
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "COMPLETED"
    assert "simulation_id" in data
