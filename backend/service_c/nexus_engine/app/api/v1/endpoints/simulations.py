from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.schemas.simulation import SimulationResult

router = APIRouter()

@router.post("/run")
def run_simulation(parameters: dict, db: Session = Depends(get_db)):
    from app.services.impact_simulation import run_monte_carlo_simulation
    import uuid
    
    simulation_id = str(uuid.uuid4())
    results = run_monte_carlo_simulation(parameters)
    
    # Store results (mock)
    # In real app, save to DB
    
    return {
        "simulation_id": simulation_id,
        "status": "COMPLETED",
        "results": {
            "predicted_cases": results["predicted_outcomes"]["average_cases"],
            "new_hotspots": 3,
            "supply_shortages": 12,
            "system_impact_score": 78
        }
    }

@router.get("/results/{simulation_id}")
def get_simulation_results(simulation_id: str, db: Session = Depends(get_db)):
    # Fetch from DB
    return {"simulation_id": simulation_id, "results": {}}

@router.get("/scenarios")
def get_scenarios(db: Session = Depends(get_db)):
    return [
        {"id": "scenario_1", "name": "High Rainfall"},
        {"id": "scenario_2", "name": "Supply Chain Strike"}
    ]

@router.delete("/{simulation_id}")
def delete_simulation(simulation_id: str, db: Session = Depends(get_db)):
    # In real implementation: db.query(SimulationResult).filter(...).delete()
    return {"message": f"Simulation {simulation_id} deleted"}

@router.post("/scenarios")
def save_scenario(scenario: dict, db: Session = Depends(get_db)):
    # Mock save
    return {"message": "Scenario saved successfully", "id": "SCN-001"}
