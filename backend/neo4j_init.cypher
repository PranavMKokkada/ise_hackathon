// BioNexus Neo4j Initialization Script
// Run this after database is created

// Create constraints for unique IDs
CREATE CONSTRAINT disease_id IF NOT EXISTS FOR (d:Disease) REQUIRE d.id IS UNIQUE;
CREATE CONSTRAINT treatment_id IF NOT EXISTS FOR (t:Treatment) REQUIRE t.id IS UNIQUE;
CREATE CONSTRAINT ingredient_id IF NOT EXISTS FOR (ai:ActiveIngredient) REQUIRE ai.id IS UNIQUE;
CREATE CONSTRAINT factory_id IF NOT EXISTS FOR (f:Factory) REQUIRE f.id IS UNIQUE;
CREATE CONSTRAINT material_id IF NOT EXISTS FOR (rm:RawMaterial) REQUIRE rm.id IS UNIQUE;
CREATE CONSTRAINT region_id IF NOT EXISTS FOR (r:Region) REQUIRE r.id IS UNIQUE;
CREATE CONSTRAINT supplier_id IF NOT EXISTS FOR (s:Supplier) REQUIRE s.id IS UNIQUE;

// Create indexes for performance
CREATE INDEX disease_name IF NOT EXISTS FOR (d:Disease) ON (d.name);
CREATE INDEX treatment_name IF NOT EXISTS FOR (t:Treatment) ON (t.name);
CREATE INDEX factory_location IF NOT EXISTS FOR (f:Factory) ON (f.location);
CREATE INDEX region_country IF NOT EXISTS FOR (r:Region) ON (r.country);
CREATE INDEX supplier_name IF NOT EXISTS FOR (s:Supplier) ON (s.name);
