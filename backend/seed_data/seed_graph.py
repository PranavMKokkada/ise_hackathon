"""
Seed Neo4j database with supply chain graph data
"""
import os
from neo4j import GraphDatabase
from dotenv import load_dotenv

load_dotenv()

class Neo4jSeeder:
    def __init__(self):
        self.driver = GraphDatabase.driver(
            os.getenv("NEO4J_URI", "bolt://localhost:7687"),
            auth=(os.getenv("NEO4J_USER", "neo4j"), os.getenv("NEO4J_PASSWORD", "bionexus123"))
        )
    
    def close(self):
        self.driver.close()
    
    def clear_database(self):
        """Clear all nodes and relationships"""
        with self.driver.session() as session:
            session.run("MATCH (n) DETACH DELETE n")
            print("✓ Cleared existing data")
    
    def seed_diseases(self):
        """Create disease nodes"""
        diseases = [
            {"id": "D001", "name": "Dengue Fever", "category": "Vector-borne", "seasonality": "Monsoon"},
            {"id": "D002", "name": "Malaria", "category": "Vector-borne", "seasonality": "Year-round"},
            {"id": "D003", "name": "Influenza", "category": "Respiratory", "seasonality": "Winter"},
            {"id": "D004", "name": "Typhoid", "category": "Waterborne", "seasonality": "Summer"},
        ]
        
        with self.driver.session() as session:
            for disease in diseases:
                session.run("""
                    CREATE (d:Disease {
                        id: $id, name: $name, category: $category, seasonality: $seasonality
                    })
                """, **disease)
            print(f"✓ Created {len(diseases)} disease nodes")
    
    def seed_treatments(self):
        """Create treatment nodes"""
        treatments = [
            {"id": "T001", "name": "Paracetamol IV", "type": "Antipyretic", "dosage_form": "Injection"},
            {"id": "T002", "name": "Artemisinin Combo", "type": "Antimalarial", "dosage_form": "Tablet"},
            {"id": "T003", "name": "Oseltamivir", "type": "Antiviral", "dosage_form": "Capsule"},
            {"id": "T004", "name": "Ciprofloxacin", "type": "Antibiotic", "dosage_form": "Tablet"},
            {"id": "T005", "name": "IV Fluids (Saline)", "type": "Rehydration", "dosage_form": "Solution"},
            {"id": "T006", "name": "Azithromycin", "type": "Antibiotic", "dosage_form": "Tablet"},
        ]
        
        with self.driver.session() as session:
            for treatment in treatments:
                session.run("""
                    CREATE (t:Treatment {
                        id: $id, name: $name, type: $type, dosage_form: $dosage_form
                    })
                """, **treatment)
            print(f"✓ Created {len(treatments)} treatment nodes")
    
    def seed_active_ingredients(self):
        """Create active ingredient nodes"""
        ingredients = [
            {"id": "AI001", "name": "Paracet Careful API", "chemical_formula": "C8H9NO2", "source_type": "Synthetic"},
            {"id": "AI002", "name": "Artemisinin", "chemical_formula": "C15H22O5", "source_type": "Plant-derived"},
            {"id": "AI003", "name": "Oseltamivir Phosphate", "chemical_formula": "C16H28N2O4", "source_type": "Synthetic"},
            {"id": "AI004", "name": "Ciprofloxacin HCl", "chemical_formula": "C17H18FN3O3", "source_type": "Synthetic"},
            {"id": "AI005", "name": "Sodium Chloride", "chemical_formula": "NaCl", "source_type": "Mineral"},
            {"id": "AI006", "name": "Azithromycin", "chemical_formula": "C38H72N2O12", "source_type": "Fermentation"},
        ]
        
        with self.driver.session() as session:
            for ingredient in ingredients:
                session.run("""
                    CREATE (ai:ActiveIngredient {
                        id: $id, name: $name, chemical_formula: $chemical_formula, source_type: $source_type
                    })
                """, **ingredient)
            print(f"✓ Created {len(ingredients)} active ingredient nodes")
    
    def seed_factories(self):
        """Create factory nodes"""
        factories = [
            {"id": "F001", "name": "PharmaCorp India", "location": "Mumbai, India", "capacity": 50000, "certifications": ["WHO-GMP", "ISO"]},
            {"id": "F002", "name": "VietMed Pharma", "location": "Hanoi, Vietnam", "capacity": 30000, "certifications": ["WHO-GMP"]},
            {"id": "F003", "name": "Swiss Generic AG", "location": "Basel, Switzerland", "capacity": 80000, "certifications": ["FDA", "EMA"]},
            {"id": "F004", "name": "Kenya Lifesciences", "location": "Nairobi, Kenya", "capacity": 20000, "certifications": ["WHO-GMP"]},
            {"id": "F005", "name": "BrazilPharma SA", "location": "São Paulo, Brazil", "capacity": 45000, "certifications": ["ANVISA"]},
            {"id": "F006", "name": "ChinaMed Industries", "location": "Guangzhou, China", "capacity": 100000, "certifications": ["CFDA", "WHO-GMP"]},
        ]
        
        with self.driver.session() as session:
            for factory in factories:
                session.run("""
                    CREATE (f:Factory {
                        id: $id, name: $name, location: $location, 
                        capacity: $capacity, certifications: $certifications
                    })
                """, **factory)
            print(f"✓ Created {len(factories)} factory nodes")
    
    def seed_raw_materials(self):
        """Create raw material nodes"""
        materials = [
            {"id": "RM001", "name": "Acetic Anhydride", "origin": "China", "availability": "High"},
            {"id": "RM002", "name": "Artemisia Annua Extract", "origin": "Vietnam", "availability": "Seasonal"},
            {"id": "RM003", "name": "Shikimic Acid", "origin": "China", "availability": "Medium"},
            {"id": "RM004", "name": "Quinoline", "origin": "India", "availability": "Medium"},
            {"id": "RM005", "name": "Rock Salt", "origin": "Pakistan", "availability": "High"},
        ]
        
        with self.driver.session() as session:
            for material in materials:
                session.run("""
                    CREATE (rm:RawMaterial {
                        id: $id, name: $name, origin: $origin, availability: $availability
                    })
                """, **material)
            print(f"✓ Created {len(materials)} raw material nodes")
    
    def seed_regions(self):
        """Create region nodes"""
        regions = [
            {"id": "R001", "name": "Maharashtra", "country": "India", "coordinates": [19.0760, 72.8777]},
            {"id": "R002", "name": "Hanoi Region", "country": "Vietnam", "coordinates": [21.0285, 105.8542]},
            {"id": "R003", "name": "Basel-Stadt", "country": "Switzerland", "coordinates": [47.5596, 7.5886]},
            {"id": "R004", "name": "Nairobi County", "country": "Kenya", "coordinates": [-1.2864, 36.8172]},
            {"id": "R005", "name": "São Paulo State", "country": "Brazil", "coordinates": [-23.5505, -46.6333]},
            {"id": "R006", "name": "Guangdong", "country": "China", "coordinates": [23.1291, 113.2644]},
            {"id": "R007", "name": "Punjab", "country": "Pakistan", "coordinates": [31.5204, 74.3587]},
        ]
        
        with self.driver.session() as session:
            for region in regions:
                session.run("""
                    CREATE (r:Region {
                        id: $id, name: $name, country: $country, coordinates: $coordinates
                    })
                """, **region)
            print(f"✓ Created {len(regions)} region nodes")
    
    def seed_suppliers(self):
        """Create supplier nodes"""
        suppliers = [
            {"id": "S001", "name": "Global ChemSource", "reliability_score": 85, "lead_time_days": 30},
            {"id": "S002", "name": "Vietnam Botanicals Ltd", "reliability_score": 72, "lead_time_days": 45},
            {"id": "S003", "name": "SwissChem AG", "reliability_score": 95, "lead_time_days": 21},
            {"id": "S004", "name": "East Africa Trading Co", "reliability_score": 68, "lead_time_days": 60},
            {"id": "S005", "name": "BrasilCorp Exports", "reliability_score": 78, "lead_time_days": 40},
            {"id": "S006", "name": "China Raw Materials Hub", "reliability_score": 70, "lead_time_days": 35},
            {"id": "S007", "name": "Pak Minerals Ltd", "reliability_score": 65, "lead_time_days": 50},
        ]
        
        with self.driver.session() as session:
            for supplier in suppliers:
                session.run("""
                    CREATE (s:Supplier {
                        id: $id, name: $name, reliability_score: $reliability_score, 
                        lead_time_days: $lead_time_days
                    })
                """, **supplier)
            print(f"✓ Created {len(suppliers)} supplier nodes")
    
    def create_relationships(self):
        """Create relationships between nodes"""
        relationships = [
            # Disease -> Treatment
            ("D001", "TREATED_BY", "T001", {"dosage": "1g/6hr", "effectiveness": 0.85}),
            ("D001", "TREATED_BY", "T005", {"dosage": "1L/day", "effectiveness": 0.90}),
            ("D002", "TREATED_BY", "T002", {"dosage": "4tabs/day", "effectiveness": 0.95}),
            ("D003", "TREATED_BY", "T003", {"dosage": "75mg/12hr", "effectiveness": 0.80}),
            ("D004", "TREATED_BY", "T004", {"dosage": "500mg/12hr", "effectiveness": 0.88}),
            ("D004", "TREATED_BY", "T006", {"dosage": "500mg/day", "effectiveness": 0.85}),
            
            # Treatment -> ActiveIngredient
            ("T001", "CONTAINS", "AI001", {"quantity": 1000, "unit": "mg"}),
            ("T002", "CONTAINS", "AI002", {"quantity": 120, "unit": "mg"}),
            ("T003", "CONTAINS", "AI003", {"quantity": 75, "unit": "mg"}),
            ("T004", "CONTAINS", "AI004", {"quantity": 500, "unit": "mg"}),
            ("T005", "CONTAINS", "AI005", {"quantity": 9000, "unit": "mg"}),
            ("T006", "CONTAINS", "AI006", {"quantity": 500, "unit": "mg"}),
            
            # ActiveIngredient -> Factory
            ("AI001", "MANUFACTURED_AT", "F001", {"capacity": 50000, "lead_time": 30}),
            ("AI002", "MANUFACTURED_AT", "F002", {"capacity": 30000, "lead_time": 45}),
            ("AI003", "MANUFACTURED_AT", "F003", {"capacity": 80000, "lead_time": 21}),
            ("AI004", "MANUFACTURED_AT", "F001", {"capacity": 40000, "lead_time": 28}),
            ("AI005", "MANUFACTURED_AT", "F006", {"capacity": 100000, "lead_time": 14}),
            ("AI006", "MANUFACTURED_AT", "F005", {"capacity": 45000, "lead_time": 35}),
            
            # Factory -> Region
            ("F001", "LOCATED_IN", "R001", {}),
            ("F002", "LOCATED_IN", "R002", {}),
            ("F003", "LOCATED_IN", "R003", {}),
            ("F004", "LOCATED_IN", "R004", {}),
            ("F005", "LOCATED_IN", "R005", {}),
            ("F006", "LOCATED_IN", "R006", {}),
            
            # RawMaterial -> Factory
            ("RM001", "SUPPLIED_TO", "F001", {"quantity": 10000, "frequency": "monthly"}),
            ("RM002", "SUPPLIED_TO", "F002", {"quantity": 5000, "frequency": "quarterly"}),
            ("RM003", "SUPPLIED_TO", "F003", {"quantity": 15000, "frequency": "monthly"}),
            ("RM004", "SUPPLIED_TO", "F001", {"quantity": 8000, "frequency": "monthly"}),
            ("RM005", "SUPPLIED_TO", "F006", {"quantity": 50000, "frequency": "weekly"}),
            
            # Supplier -> RawMaterial
            ("S001", "SUPPLIES", "RM001", {"reliability": 0.85, "lead_time": 30}),
            ("S002", "SUPPLIES", "RM002", {"reliability": 0.72, "lead_time": 45}),
            ("S003", "SUPPLIES", "RM003", {"reliability": 0.95, "lead_time": 21}),
            ("S001", "SUPPLIES", "RM004", {"reliability": 0.88, "lead_time": 25}),
            ("S007", "SUPPLIES", "RM005", {"reliability": 0.65, "lead_time": 50}),
            ("S006", "SUPPLIES", "RM001", {"reliability": 0.70, "lead_time": 35}),
        ]
        
        with self.driver.session() as session:
            for start_id, rel_type, end_id, props in relationships:
                session.run(f"""
                    MATCH (a {{id: $start_id}}), (b {{id: $end_id}})
                    CREATE (a)-[r:{rel_type} $props]->(b)
                """, start_id=start_id, end_id=end_id, props=props)
            print(f"✓ Created {len(relationships)} relationships")
    
    def seed_all(self):
        """Run all seed operations"""
        print("\n🌱 Seeding Neo4j Supply Chain Graph...\n")
        self.clear_database()
        self.seed_diseases()
        self.seed_treatments()
        self.seed_active_ingredients()
        self.seed_factories()
        self.seed_raw_materials()
        self.seed_regions()
        self.seed_suppliers()
        self.create_relationships()
        print("\n✅ Neo4j seeding complete!\n")


if __name__ == "__main__":
    seeder = Neo4jSeeder()
    try:
        seeder.seed_all()
    finally:
        seeder.close()
