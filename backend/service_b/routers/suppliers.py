"""
Suppliers Router - Manage supplier data and alternatives
"""
from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from database.postgres_client import postgres_client
from database.neo4j_client import neo4j_client

router = APIRouter()

@router.get("/all")
def get_all_suppliers() -> List[Dict[str, Any]]:
    """Get all suppliers"""
    try:
        return postgres_client.get_all_suppliers()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/alternatives/{node_id}")
def get_alternative_suppliers(node_id: str) -> List[Dict[str, Any]]:
    """Find alternative suppliers for a given node"""
    try:
        alternatives = neo4j_client.get_alternative_suppliers(node_id)
        if not alternatives:
            return {"alternatives": [], "message": "No alternative suppliers found"}
        return {"alternatives": alternatives}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/reliability-score")
def get_supplier_reliability_scores() -> List[Dict[str, Any]]:
    """Get supplier reliability rankings"""
    try:
        return postgres_client.get_supplier_reliability_scores()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/capacity")
def get_supplier_capacity() -> Dict[str, Any]:
    """Get supplier capacity information"""
    try:
        suppliers = postgres_client.get_all_suppliers()
        total_capacity = sum(s.get('capacity', 0) for s in suppliers)
        return {
            "total_capacity": total_capacity,
            "suppliers_count": len(suppliers),
            "average_capacity": total_capacity //  len(suppliers) if suppliers else 0,
            "suppliers": suppliers
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
