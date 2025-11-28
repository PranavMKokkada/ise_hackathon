from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter()

class RequestCreate(BaseModel):
    hospital_id: str
    item: str
    quantity: int
    priority: str

class RequestResponse(BaseModel):
    id: str
    hospital: str
    item: str
    quantity: int
    status: str
    time: str

@router.get("/network")
def get_hospital_network():
    return [
        {"id": "H001", "name": "City General Hospital", "location": "Mumbai, Central", "capacity": "85%", "status": "critical"},
        {"id": "H002", "name": "Apollo Indraprastha", "location": "Delhi, South", "capacity": "60%", "status": "stable"},
        {"id": "H003", "name": "Fortis Malar", "location": "Chennai, Adyar", "capacity": "45%", "status": "stable"},
    ]

@router.get("/requests", response_model=List[RequestResponse])
def get_active_requests():
    return [
        {"id": "REQ-1023", "hospital": "City General Hospital", "item": "Oseltamivir (Tamiflu)", "quantity": 5000, "status": "urgent", "time": "2h ago"},
        {"id": "REQ-1022", "hospital": "St. Mary's Medical Center", "item": "IV Fluids (Saline)", "quantity": 2000, "status": "pending", "time": "4h ago"},
        {"id": "REQ-1021", "hospital": "Community Health Clinic", "item": "Dengue Test Kits", "quantity": 500, "status": "fulfilled", "time": "1d ago"},
    ]

@router.post("/requests")
def create_request(request: RequestCreate):
    return {"message": "Request created successfully", "id": "REQ-NEW-001"}

@router.post("/fulfill/{request_id}")
def fulfill_request(request_id: str):
    return {"message": f"Request {request_id} fulfilled successfully"}
