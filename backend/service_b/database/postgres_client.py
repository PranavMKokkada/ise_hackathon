"""
PostgreSQL Database Client for Service B
"""
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from typing import List, Dict, Any, Optional
from dotenv import load_dotenv
from contextlib import contextmanager

load_dotenv()

class PostgresClient:
    def __init__(self):
        self.conn_params = {
            'host': os.getenv('POSTGRES_HOST', 'localhost'),
            'port': int(os.getenv('POSTGRES_PORT', 5432)),
            'database': os.getenv('POSTGRES_DB', 'bionexus'),
            'user': os.getenv('POSTGRES_USER', 'bionexus'),
            'password': os.getenv('POSTGRES_PASSWORD', 'bionexus123')
        }
    
    @contextmanager
    def get_cursor(self):
        """Context manager for database cursor"""
        conn = psycopg2.connect(**self.conn_params)
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        try:
            yield cursor
            conn.commit()
        except Exception as e:
            conn.rollback()
            raise e
        finally:
            cursor.close()
            conn.close()
    
    def get_current_disruptions(self) -> List[Dict[str, Any]]:
        """Get all active disruptions"""
        with self.get_cursor() as cursor:
            cursor.execute("""
                SELECT * FROM disruption_events
                WHERE end_date IS NULL OR END_date > NOW()
                ORDER BY severity DESC, start_date DESC
            """)
            return [dict(row) for row in cursor.fetchall()]
    
    def get_disruptions_by_region(self, region_id: str) -> List[Dict[str, Any]]:
        """Get disruptions affecting a specific region"""
        with self.get_cursor() as cursor:
            cursor.execute("""
                SELECT * FROM disruption_events
                WHERE node_id = %s OR node_type = 'Region'
                ORDER BY start_date DESC
                LIMIT 20
            """, (region_id,))
            return [dict(row) for row in cursor.fetchall()]
    
    def get_global_inventory_status(self) -> Dict[str, Any]:
        """Get global inventory aggregates"""
        with self.get_cursor() as cursor:
            cursor.execute("""
                SELECT 
                    item_id,
                    item_name,
                    SUM(quantity) as total_quantity,
                    COUNT(DISTINCT region_id) as regions_count,
                    MAX(timestamp) as last_updated
                FROM inventory_snapshots
                GROUP BY item_id, item_name
                ORDER BY item_name
            """)
            items = [dict(row) for row in cursor.fetchall()]
            
            # Calculate shortages
            cursor.execute("""
                SELECT COUNT(DISTINCT item_id) as shortage_count
                FROM inventory_snapshots
                WHERE quantity < 1000
            """)
            shortage_count = cursor.fetchone()['shortage_count']
            
            return {
                "items": items,
                "total_items": len(items),
                "critical_shortages": shortage_count
            }
    
    def get_region_inventory(self, region_id: str) -> List[Dict[str, Any]]:
        """Get inventory for a specific region"""
        with self.get_cursor() as cursor:
            cursor.execute("""
                SELECT * FROM inventory_snapshots
                WHERE region_id = %s
                ORDER BY timestamp DESC
            """, (region_id,))
            return [dict(row) for row in cursor.fetchall()]
    
    def get_item_inventory(self, item_id: str) -> List[Dict[str, Any]]:
        """Get inventory across all regions for a specific item"""
        with self.get_cursor() as cursor:
            cursor.execute("""
                SELECT * FROM inventory_snapshots
                WHERE item_id = %s
                ORDER BY quantity ASC
            """, (item_id,))
            return [dict(row) for row in cursor.fetchall()]
    
    def update_inventory(self, region_id: str, item_id: str, item_name: str, 
                        quantity: float, unit: str, source: str) -> Dict[str, Any]:
        """Update inventory snapshot"""
        with self.get_cursor() as cursor:
            cursor.execute("""
                INSERT INTO inventory_snapshots 
                (region_id, item_id, item_name, quantity, unit, timestamp, source)
                VALUES (%s, %s, %s, %s, %s, NOW(), %s)
                RETURNING *
            """, (region_id, item_id, item_name, quantity, unit, source))
            return dict(cursor.fetchone())
    
    def get_shortage_forecast(self) -> List[Dict[str, Any]]:
        """Get predicted shortages based on inventory trends"""
        with self.get_cursor() as cursor:
            cursor.execute("""
                SELECT DISTINCT ON (i.item_id, i.region_id)
                    i.item_id,
                    i.item_name,
                    i.region_id,
                    i.quantity,
                    i.timestamp,
                    CASE 
                        WHEN i.quantity < 500 THEN 'Critical'
                        WHEN i.quantity < 1000 THEN 'High'
                        WHEN i.quantity < 2000 THEN 'Medium'
                        ELSE 'Low'
                    END as severity
                FROM inventory_snapshots i
                ORDER BY i.item_id, i.region_id, i.timestamp DESC
            """)
            shortages = [dict(row) for row in cursor.fetchall()]
            return [s for s in shortages if s['severity'] in ['Critical', 'High']]
    
    def get_all_suppliers(self) -> List[Dict[str, Any]]:
        """Get all suppliers"""
        with self.get_cursor() as cursor:
            cursor.execute("SELECT * FROM suppliers ORDER BY reliability_score DESC")
            return [dict(row) for row in cursor.fetchall()]
    
    def get_supplier(self, supplier_id: str) -> Optional[Dict[str, Any]]:
        """Get specific supplier"""
        with self.get_cursor() as cursor:
            cursor.execute("SELECT * FROM suppliers WHERE supplier_id = %s", (supplier_id,))
            row = cursor.fetchone()
            return dict(row) if row else None
    
    def get_supplier_reliability_scores(self) -> List[Dict[str, Any]]:
        """Get supplier reliability rankings"""
        with self.get_cursor() as cursor:
            cursor.execute("""
                SELECT supplier_id, name, country, reliability_score, capacity
                FROM suppliers
                ORDER BY reliability_score DESC
            """)
            return [dict(row) for row in cursor.fetchall()]


    def report_disruption(self, node_id: str, node_type: str, disruption_type: str, 
                         severity: str, description: str, source_url: str) -> Dict[str, Any]:
        """Report a new disruption manually"""
        with self.get_cursor() as cursor:
            cursor.execute("""
                INSERT INTO disruption_events 
                (node_id, node_type, disruption_type, severity, description, source_url, verified, start_date, created_at)
                VALUES (%s, %s, %s, %s, %s, %s, false, NOW(), NOW())
                RETURNING *
            """, (node_id, node_type, disruption_type, severity, description, source_url))
            return dict(cursor.fetchone())


# Singleton instance
postgres_client = PostgresClient()
