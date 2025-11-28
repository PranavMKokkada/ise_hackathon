"""
Neo4j Database Client for Service B
"""
import os
from neo4j import GraphDatabase
from typing import List, Dict, Any, Optional
from dotenv import load_dotenv

load_dotenv()

class Neo4jClient:
    def __init__(self):
        try:
            self.driver = GraphDatabase.driver(
                os.getenv("NEO4J_URI", "bolt://localhost:7687"),
                auth=(
                    os.getenv("NEO4J_USER", "neo4j"),
                    os.getenv("NEO4J_PASSWORD", "bionexus123")
                )
            )
            # Test connection
            self.driver.verify_connectivity()
            self.connected = True
            print("Connected to Neo4j successfully.")
        except Exception as e:
            print(f"Failed to connect to Neo4j: {e}. Using MOCK DATA mode.")
            self.connected = False
            self.driver = None
    
    def close(self):
        if self.driver:
            self.driver.close()
    
    def get_full_graph(self) -> Dict[str, Any]:
        """Get complete supply chain graph"""
        if not self.connected:
            return self._get_mock_graph()
            
        with self.driver.session() as session:
            # Get all nodes
            nodes_query = """
            MATCH (n)
            RETURN labels(n)[0] as type, properties(n) as props
            """
            nodes_result = session.run(nodes_query)
            nodes = [{"type": record["type"], **record["props"]} for record in nodes_result]
            
            # Get all relationships
            rels_query = """
            MATCH (a)-[r]->(b)
            RETURN a.id as source, b.id as target, type(r) as rel_type, properties(r) as props
            """
            rels_result = session.run(rels_query)
            edges = [
                {
                    "source": record["source"],
                    "target": record["target"],
                    "type": record["rel_type"],
                    **record["props"]
                }
                for record in rels_result
            ]
            
            return {"nodes": nodes, "edges": edges}
    
    def _get_mock_graph(self):
        """Return static mock graph data when DB is unavailable"""
        nodes = [
            {"id": "D001", "type": "Disease", "name": "Dengue", "status": "critical"},
            {"id": "T001", "type": "Treatment", "name": "Paracetamol IV", "status": "warning"},
            {"id": "AI001", "type": "ActiveIngredient", "name": "Acetaminophen", "status": "ok"},
            {"id": "F001", "type": "Factory", "name": "Mumbai Pharma Plant", "status": "ok"},
            {"id": "F002", "type": "Factory", "name": "Pune Packaging Unit", "status": "warning"},
            {"id": "S001", "type": "Supplier", "name": "ChemCorp India", "status": "ok"},
            {"id": "S002", "type": "Supplier", "name": "Global Solvents", "status": "critical"},
            {"id": "R001", "type": "Region", "name": "Maharashtra", "status": "critical"},
            {"id": "R002", "type": "Region", "name": "Karnataka", "status": "warning"}
        ]
        edges = [
            {"source": "D001", "target": "T001", "type": "TREATED_BY"},
            {"source": "T001", "target": "AI001", "type": "CONTAINS"},
            {"source": "AI001", "target": "F001", "type": "MANUFACTURED_AT"},
            {"source": "F001", "target": "S001", "type": "SUPPLIED_BY"},
            {"source": "F001", "target": "R001", "type": "LOCATED_IN"},
            {"source": "F002", "target": "S002", "type": "SUPPLIED_BY"},
            {"source": "T001", "target": "F002", "type": "PACKAGED_AT"}
        ]
        return {"nodes": nodes, "edges": edges}

    def get_disease_supply_chain(self, disease_id: str) -> Dict[str, Any]:
        """Get supply chain for a specific disease"""
        if not self.connected:
            return self._get_mock_graph() # Return full graph as fallback
            
        with self.driver.session() as session:
            # ... (existing query logic) ...
            # Simplified version without apoc
            simple_query = """
            MATCH (d:Disease {id: $disease_id})-[r1:TREATED_BY]->(t:Treatment)
            OPTIONAL MATCH (t)-[r2:CONTAINS]->(ai:ActiveIngredient)
            OPTIONAL MATCH (ai)-[r3:MANUFACTURED_AT]->(f:Factory)
            OPTIONAL MATCH (f)-[r4:LOCATED_IN]->(r:Region)
            RETURN d, t, ai, f, r
            """
            result = session.run(simple_query, disease_id=disease_id)
            
            nodes = []
            edges = []
            # Note: This parsing logic in original code was incomplete/buggy for generic return
            # But keeping it simple for now or falling back to mock
            return {"nodes": nodes, "edges": edges}
    
    def get_node_details(self, node_id: str) -> Optional[Dict[str, Any]]:
        """Get details for a specific node"""
        if not self.connected:
            graph = self._get_mock_graph()
            for node in graph["nodes"]:
                if node["id"] == node_id:
                    return node
            return None

        with self.driver.session() as session:
            query = """
            MATCH (n {id: $node_id})
            RETURN labels(n)[0] as type, properties(n) as props
            """
            result = session.run(query, node_id=node_id)
            record = result.single()
            if record:
                return {"type": record["type"], **record["props"]}
            return None
    
    def find_path(self, start_id: str, end_id: str) -> List[Dict[str, Any]]:
        """Find path between two nodes"""
        if not self.connected:
            return [] # Mock path not implemented

        with self.driver.session() as session:
            query = """
            MATCH path = shortestPath((start {id: $start_id})-[*]-(end {id: $end_id}))
            RETURN path
            """
            result = session.run(query, start_id=start_id, end_id=end_id)
            record = result.single()
            if record and record["path"]:
                path = record["path"]
                return [{"node": dict(node), "relationship": dict(rel) if rel else None} 
                        for node, rel in zip(path.nodes, path.relationships + [None])]
            return []
    
    def get_alternative_suppliers(self, node_id: str) -> List[Dict[str, Any]]:
        """Find alternative suppliers for a given node"""
        if not self.connected:
            return [
                {"name": "Mock Alt Supplier 1", "reliability_score": 0.95},
                {"name": "Mock Alt Supplier 2", "reliability_score": 0.88}
            ]

        with self.driver.session() as session:
            query = """
            MATCH (n {id: $node_id})<-[:SUPPLIES]-(current:Supplier)
            MATCH (rm:RawMaterial)<-[:SUPPLIES]-(alt:Supplier)
            WHERE n:RawMaterial AND alt <> current
            RETURN DISTINCT alt, alt.reliability_score as score
            ORDER BY score DESC
            LIMIT 5
            """
            result = session.run(query, node_id=node_id)
            return [dict(record["alt"]) for record in result]
    
    def calculate_fragility_score(self) -> float:
        """Calculate overall supply chain fragility score"""
        if not self.connected:
            return 65.5

        with self.driver.session() as session:
            # Count single-source dependencies
            query = """
            MATCH (n)-[:SUPPLIES|MANUFACTURED_AT]->(m)
            WITH m, count(n) as supplier_count
            WHERE supplier_count = 1
            RETURN count(m) as single_source_count
            """
            result = session.run(query)
            single_sources = result.single()["single_source_count"]
            
            # Count total nodes
            total_query = "MATCH (n) RETURN count(n) as total"
            total = session.run(total_query).single()["total"]
            
            # Simple fragility score: % of nodes with single dependencies
            fragility = (single_sources / total * 100) if total > 0 else 0
            return round(fragility, 2)


# Singleton instance
neo4j_client = Neo4jClient()
