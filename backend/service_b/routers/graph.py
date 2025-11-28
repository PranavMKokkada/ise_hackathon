"""
Graph Data Router - Supply Chain Network Endpoints
"""
from fastapi import APIRouter, HTTPException
from typing import Dict, Any
from database.neo4j_client import neo4j_client

router = APIRouter()

@router.get("/full-graph")
def get_full_graph() -> Dict[str, Any]:
    """Get complete supply chain graph with all nodes and relationships"""
    try:
        return neo4j_client.get_full_graph()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/disease/{disease_id}")
def get_disease_supply_chain(disease_id: str) -> Dict[str, Any]:
    """Get supply chain network for a specific disease"""
    try:
        result = neo4j_client.get_disease_supply_chain(disease_id)
        if not result["nodes"]:
            raise HTTPException(status_code=404, detail="Disease not found")
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/node/{node_id}")
def get_node_details(node_id: str) -> Dict[str, Any]:
    """Get details for a specific node in the graph"""
    try:
        node = neo4j_client.get_node_details(node_id)
        if not node:
            raise HTTPException(status_code=404, detail="Node not found")
        return node
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/path/{start_id}/{end_id}")
def find_path_between_nodes(start_id: str, end_id: str) -> Dict[str, Any]:
    """Find shortest path between two nodes"""
    try:
        path = neo4j_client.find_path(start_id, end_id)
        if not path:
            return {"path": [], "message": "No path found between nodes"}
        return {"path": path}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/fragility-score")
def get_fragility_score() -> Dict[str, Any]:
    """Calculate overall supply chain fragility score"""
    try:
        score = neo4j_client.calculate_fragility_score()
        return {
            "fragility_score": score,
            "status": "Critical" if score > 70 else "High" if score > 40 else "Medium" if score > 20 else "Low",
            "description": f"{score}% of supply chain nodes have single-source dependencies"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
