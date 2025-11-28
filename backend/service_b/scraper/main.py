import os
import time
import random
import sys
from datetime import datetime
import psycopg2
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv

# Add parent directory to path to import modules if needed
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

load_dotenv()

# Database connection
def get_db_connection():
    return psycopg2.connect(
        host=os.getenv('POSTGRES_HOST', 'localhost'),
        port=int(os.getenv('POSTGRES_PORT', 5432)),
        database=os.getenv('POSTGRES_DB', 'bionexus'),
        user=os.getenv('POSTGRES_USER', 'bionexus'),
        password=os.getenv('POSTGRES_PASSWORD', 'bionexus123')
    )

# Mock data sources
DISRUPTION_TYPES = [
    'Factory Fire', 'Port Strike', 'Raw Material Shortage', 
    'Customs Delay', 'Power Outage', 'Labor Dispute', 
    'Transport Accident', 'Regulatory Ban'
]

SEVERITIES = ['Low', 'Medium', 'High', 'Critical']

SOURCES = [
    'Reuters Supply Chain', 'Bloomberg Logistics', 'Local News', 
    'Port Authority Feed', 'Trade Winds', 'Global Trade Review'
]

def generate_mock_disruption(conn):
    """Generate and insert a random disruption event"""
    with conn.cursor(cursor_factory=RealDictCursor) as cursor:
        # Get a random node to disrupt
        # For simplicity, we'll just pick a random node ID from a predefined list or query existing nodes if possible
        # Since we don't have easy access to Neo4j here, we'll use some static IDs that likely exist or generic ones
        node_ids = ['F001', 'F002', 'F003', 'S001', 'S002', 'R001', 'R002', 'R003']
        node_id = random.choice(node_ids)
        node_type = 'Factory' if node_id.startswith('F') else 'Supplier' if node_id.startswith('S') else 'Region'
        
        disruption_type = random.choice(DISRUPTION_TYPES)
        severity = random.choice(SEVERITIES)
        source = random.choice(SOURCES)
        
        description = f"Reports of {disruption_type.lower()} affecting {node_type} {node_id}. Expected delays in shipments."
        source_url = f"https://{source.lower().replace(' ', '')}.com/news/{random.randint(10000, 99999)}"
        
        print(f"[{datetime.now()}] DETECTED: {disruption_type} at {node_id} ({severity}) - Source: {source}")
        
        cursor.execute("""
            INSERT INTO disruption_events 
            (node_id, node_type, disruption_type, severity, description, source_url, verified, start_date, created_at)
            VALUES (%s, %s, %s, %s, %s, %s, false, NOW(), NOW())
            RETURNING id
        """, (node_id, node_type, disruption_type, severity, description, source_url))
        
        conn.commit()
        return cursor.fetchone()['id']

def run_scraper():
    print("Starting Mock Data Collection Pipeline...")
    print("Monitoring global news feeds for supply chain disruptions...")
    
    conn = get_db_connection()
    
    try:
        while True:
            # Simulate finding a disruption every 10-30 seconds
            if random.random() < 0.3:  # 30% chance each cycle
                try:
                    event_id = generate_mock_disruption(conn)
                    print(f"   -> Logged event ID: {event_id}")
                except Exception as e:
                    print(f"Error generating disruption: {e}")
                    conn.rollback()
            
            time.sleep(5)
            
    except KeyboardInterrupt:
        print("\nStopping scraper...")
    finally:
        conn.close()

if __name__ == "__main__":
    run_scraper()
