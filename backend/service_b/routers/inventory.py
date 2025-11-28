"""
Inventory Router - Manage inventory tracking
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any
from database.postgres_client import postgres_client

router = APIRouter()

class InventoryUpdate(BaseModel):
    region_id: str
    item_id: str
    item_name: str
    quantity: float
    unit: str
    source: str = "manual_entry"

@router.get("/global-status")
def get_global_inventory_status() -> Dict[str, Any]:
    """Get global inventory status and aggregates"""
    try:
        return postgres_client.get_global_inventory_status()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/region/{region_id}")
def get_region_inventory(region_id: str) -> List[Dict[str, Any]]:
    """Get inventory for a specific region"""
    try:
        return postgres_client.get_region_inventory(region_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/item/{item_id}")
def get_item_inventory(item_id: str) -> List[Dict[str, Any]]:
    """Get inventory across all regions for a specific item"""
    try:
        return postgres_client.get_item_inventory(item_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/update")
def update_inventory(update: InventoryUpdate) -> Dict[str, Any]:
    """Update inventory snapshot"""
    try:
        result = postgres_client.update_inventory(
            update.region_id,
            update.item_id,
            update.item_name,
            update.quantity,
            update.unit,
            update.source
        )
        return {"success": True, "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/shortage-forecast")
def get_shortage_forecast() -> List[Dict[str, Any]]:
    """Get predicted shortages based on current inventory levels"""
    try:
        return postgres_client.get_shortage_forecast()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
