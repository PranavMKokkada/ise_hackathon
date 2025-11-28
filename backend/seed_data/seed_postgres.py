"""
Seed PostgreSQL database with disruptions, inventory, and supplier data
"""
import os
import psycopg2
from datetime import datetime, timedelta
from dotenv import load_dotenv
import random

load_dotenv()

class PostgresSeeder:
    def __init__(self):
        self.conn = psycopg2.connect(
            host=os.getenv("POSTGRES_HOST", "localhost"),
            port=os.getenv("POSTGRES_PORT", 5432),
            database=os.getenv("POSTGRES_DB", "bionexus"),
            user=os.getenv("POSTGRES_USER", "bionexus"),
            password=os.getenv("POSTGRES_PASSWORD", "bionexus123")
        )
        self.cursor = self.conn.cursor()
    
    def close(self):
        self.cursor.close()
        self.conn.close()
    
    def clear_data(self):
        """Clear existing seed data"""
        tables = ['disruption_events', 'inventory_snapshots', 'suppliers', 
                 'risk_calculations', 'recommendations', 'simulation_results']
        for table in tables:
            self.cursor.execute(f"TRUNCATE TABLE {table} RESTART IDENTITY CASCADE")
        self.conn.commit()
        print("✓ Cleared existing data")
    
    def seed_disruptions(self):
        """Seed disruption events"""
        disruptions = [
            ("F001", "Factory", "strike", "High", datetime.now() - timedelta(days=10), None, 
             "Labor strike at PharmaCorp India affecting paracetamol production", "https://news.example.com/1", True),
            ("F002", "Factory", "flood", "Critical", datetime.now() - timedelta(days=5), datetime.now() + timedelta(days=30),
             "Monsoon flooding in Vietnam disrupting Artemisinin supply", "https://news.example.com/2", True),
            ("S007", "Supplier", "export_ban", "Critical", datetime.now() - timedelta(days=2), None,
             "Pakistan export restrictions on salt due to domestic shortage", "https://news.example.com/3", True),
            ("F003", "Factory", "power_outage", "Medium", datetime.now() - timedelta(days=15), datetime.now() - timedelta(days=12),
             "Power grid issues in Basel resolved", "https://news.example.com/4", True),
            ("R002", "Region", "typhoon", "High", datetime.now() - timedelta(days=7), datetime.now() + timedelta(days=14),
             "Typhoon affecting logistics in Hanoi region", "https://news.example.com/5", True),
        ]
        
        for disruption in disruptions:
            self.cursor.execute("""
                INSERT INTO disruption_events 
                (node_id, node_type, disruption_type, severity, start_date, end_date, description, source_url, verified)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, disruption)
        
        self.conn.commit()
        print(f"✓ Created {len(disruptions)} disruption events")
    
    def seed_inventory(self):
        """Seed inventory snapshots"""
        regions = ["R001", "R002", "R003", "R004", "R005", "R006", "R007"]
        items = [
            ("ITEM001", "Paracetamol IV 1g"),
            ("ITEM002", "Artemisinin Combo Tablets"),
            ("ITEM003", "Oseltamivir 75mg"),
            ("ITEM004", "Ciprofloxacin 500mg"),
            ("ITEM005", "IV Saline 1L"),
        ]
        
        inventory_data = []
        for region in regions:
            for item_id, item_name in items:
                # Create varied inventory levels
                quantity = random.randint(100, 10000)
                inventory_data.append((
                    region, item_id, item_name, quantity, "units",
                    datetime.now() - timedelta(hours=random.randint(1, 48)),
                    "hospital_report"
                ))
        
        for inventory in inventory_data:
            self.cursor.execute("""
                INSERT INTO inventory_snapshots 
                (region_id, item_id, item_name, quantity, unit, timestamp, source)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """, inventory)
        
        self.conn.commit()
        print(f"✓ Created {len(inventory_data)} inventory snapshots")
    
    def seed_suppliers(self):
        """Seed supplier metadata"""
        suppliers = [
            ("S001", "Global ChemSource", "India", '{"email": "contact@globalchem.com"}', 85.5, 50000, 
             ["APIs", "Raw Materials"], ["ISO-9001", "WHO-GMP"]),
            ("S002", "Vietnam Botanicals Ltd", "Vietnam", '{"email": "info@vnbotanicals.com"}', 72.0, 30000,
             ["Plant Extracts"], ["WHO-GMP"]),
            ("S003", "SwissChem AG", "Switzerland", '{"email": "sales@swisschem.ch"}', 95.0, 80000,
             ["Fine Chemicals", "APIs"], ["FDA", "EMA", "ISO-9001"]),
            ("S004", "East Africa Trading Co", "Kenya", '{"email": "trade@eatc.ke"}', 68.0, 20000,
             ["Raw Materials"], ["WHO-GMP"]),
            ("S005", "BrasilCorp Exports", "Brazil", '{"email": "export@brasilcorp.br"}', 78.0, 45000,
             ["Antibiotics"], ["ANVISA"]),
            ("S006", "China Raw Materials Hub", "China", '{"email": "info@chinarm.cn"}', 70.0, 100000,
             ["Bulk Chemicals", "Salt"], ["CFDA"]),
            ("S007", "Pak Minerals Ltd", "Pakistan", '{"email": "sales@pakminerals.pk"}', 65.0, 25000,
             ["Minerals", "Salt"], ["ISO-9001"]),
        ]
        
        for supplier in suppliers:
            self.cursor.execute("""
                INSERT INTO suppliers 
                (supplier_id, name, country, contact_info, reliability_score, capacity, specialization, certifications)
                VALUES (%s, %s, %s, %s::jsonb, %s, %s, %s, %s)
            """, supplier)
        
        self.conn.commit()
        print(f"✓ Created {len(suppliers)} supplier records")
    
    def seed_risk_calculations(self):
        """Seed mock risk calculations for Service C"""
        regions = ["R001", "R002", "R003", "R004", "R005"]
        items = ["ITEM001", "ITEM002", "ITEM003", "ITEM004", "ITEM005"]
        
        risk_data = []
        for region in regions:
            for item in items:
                demand = random.randint(1000, 5000)
                supply = random.randint(500, 6000)
                gap = demand - supply
                risk_score = min(100, max(0, (gap / demand) * 100)) if demand > 0 else 0
                severity = "Critical" if risk_score > 70 else "High" if risk_score > 40 else "Medium" if risk_score > 20 else "Low"
                
                risk_data.append((
                    region, item, demand, supply, gap, risk_score, severity,
                    datetime.now(), datetime.now() + timedelta(days=7)
                ))
        
        for risk in risk_data:
            self.cursor.execute("""
                INSERT INTO risk_calculations 
                (region_id, item_id, predicted_demand, available_supply, gap, risk_score, alert_severity, calculation_date, forecast_date)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, risk)
        
        self.conn.commit()
        print(f"✓ Created {len(risk_data)} risk calculations")
    
    def seed_recommendations(self):
        """Seed recommendations"""
        recommendations = [
            ("hospital", "H001", "stockpile", 1, '["Increase Paracetamol stock by 2000 units", "Order Artemisinin from alternative supplier"]',
             "Prevent shortage in next 2 weeks", "active", datetime.now() + timedelta(days=14)),
            ("supplier", "S002", "diversification", 2, '["Develop backup cultivation areas", "Increase storage capacity"]',
             "Reduce disruption risk by 30%", "active", datetime.now() + timedelta(days=30)),
            ("government", "R002", "policy", 1, '["Expedite emergency import approvals", "Allocate emergency funds for procurement"]',
             "Mitigate flood impact on medical supply", "active", datetime.now() + timedelta(days=21)),
        ]
        
        for rec in recommendations:
            self.cursor.execute("""
                INSERT INTO recommendations 
                (target_entity_type, target_entity_id, recommendation_type, priority, action_items, expected_impact, status, expires_at)
                VALUES (%s, %s, %s, %s, %s::jsonb, %s, %s, %s)
            """, rec)
        
        self.conn.commit()
        print(f"✓ Created {len(recommendations)} recommendations")
    
    def seed_all(self):
        """Run all seed operations"""
        print("\n🌱 Seeding PostgreSQL Database...\n")
        self.clear_data()
        self.seed_disruptions()
        self.seed_inventory()
        self.seed_suppliers()
        self.seed_risk_calculations()
        self.seed_recommendations()
        print("\n✅ PostgreSQL seeding complete!\n")


if __name__ == "__main__":
    seeder = PostgresSeeder()
    try:
        seeder.seed_all()
    finally:
        seeder.close()
