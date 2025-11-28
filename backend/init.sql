-- BioNexus PostgreSQL Initialization Script

-- Disruption Events Table
CREATE TABLE IF NOT EXISTS disruption_events (
    id SERIAL PRIMARY KEY,
    node_id VARCHAR(100) NOT NULL,
    node_type VARCHAR(50) NOT NULL,
    disruption_type VARCHAR(50) NOT NULL,
    severity VARCHAR(20) NOT NULL,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP,
    description TEXT,
    source_url TEXT,
    verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_disruption_node ON disruption_events(node_id);
CREATE INDEX idx_disruption_type ON disruption_events(disruption_type);
CREATE INDEX idx_disruption_severity ON disruption_events(severity);

-- Inventory Snapshots Table
CREATE TABLE IF NOT EXISTS inventory_snapshots (
    id SERIAL PRIMARY KEY,
    region_id VARCHAR(100) NOT NULL,
    item_id VARCHAR(100) NOT NULL,
    item_name VARCHAR(200) NOT NULL,
    quantity DECIMAL(12, 2) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    source VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_inventory_region ON inventory_snapshots(region_id);
CREATE INDEX idx_inventory_item ON inventory_snapshots(item_id);
CREATE INDEX idx_inventory_timestamp ON inventory_snapshots(timestamp);

-- Suppliers Table
CREATE TABLE IF NOT EXISTS suppliers (
    id SERIAL PRIMARY KEY,
    supplier_id VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    country VARCHAR(100) NOT NULL,
    contact_info JSONB,
    reliability_score DECIMAL(5, 2),
    capacity INTEGER,
    specialization TEXT[],
    certifications TEXT[],
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_supplier_id ON suppliers(supplier_id);
CREATE INDEX idx_supplier_country ON suppliers(country);

-- News Scraping Log Table (Nice-to-have)
CREATE TABLE IF NOT EXISTS scraping_log (
    id SERIAL PRIMARY KEY,
    url TEXT NOT NULL,
    source VARCHAR(100) NOT NULL,
    keywords_found TEXT[],
    relevance_score DECIMAL(5, 2),
    processed BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_scraping_processed ON scraping_log(processed);

-- Risk Calculations Table (for Mock Service C)
CREATE TABLE IF NOT EXISTS risk_calculations (
    id SERIAL PRIMARY KEY,
    region_id VARCHAR(100) NOT NULL,
    item_id VARCHAR(100),
    predicted_demand INTEGER,
    available_supply INTEGER,
    gap INTEGER,
    risk_score DECIMAL(5, 2),
    alert_severity VARCHAR(20),
    calculation_date TIMESTAMP NOT NULL,
    forecast_date TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_risk_region ON risk_calculations(region_id);
CREATE INDEX idx_risk_forecast ON risk_calculations(forecast_date);

-- Recommendations Table (for Mock Service C)
CREATE TABLE IF NOT EXISTS recommendations (
    id SERIAL PRIMARY KEY,
    target_entity_type VARCHAR(50) NOT NULL,
    target_entity_id VARCHAR(100) NOT NULL,
    recommendation_type VARCHAR(50) NOT NULL,
    priority INTEGER,
    action_items JSONB,
    expected_impact TEXT,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP
);

CREATE INDEX idx_recommendations_target ON recommendations(target_entity_id);
CREATE INDEX idx_recommendations_status ON recommendations(status);

-- Simulation Results Table (for Mock Service C)
CREATE TABLE IF NOT EXISTS simulation_results (
    id SERIAL PRIMARY KEY,
    simulation_id VARCHAR(100) UNIQUE NOT NULL,
    scenario_type VARCHAR(100) NOT NULL,
    parameters JSONB,
    predicted_outcomes JSONB,
    impact_summary TEXT,
    confidence_score DECIMAL(5, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_simulation_id ON simulation_results(simulation_id);

-- Model Performance Table (for Mock Service C)
CREATE TABLE IF NOT EXISTS model_performance (
    id SERIAL PRIMARY KEY,
    model_type VARCHAR(100) NOT NULL,
    accuracy DECIMAL(5, 4),
    precision_score DECIMAL(5, 4),
    recall_score DECIMAL(5, 4),
    mae DECIMAL(10, 4),
    rmse DECIMAL(10, 4),
    training_date TIMESTAMP,
    evaluation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users Table (for Authentication)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(200),
    role VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);

-- Insert default users for testing
INSERT INTO users (email, password_hash, full_name, role) VALUES
    ('admin@test.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYSw5Z8.K6q', 'Admin User', 'admin'),
    ('analyst@test.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYSw5Z8.K6q', 'Analyst User', 'analyst'),
    ('hospital@test.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYSw5Z8.K6q', 'Hospital User', 'hospital')
ON CONFLICT (email) DO NOTHING;

-- All passwords are hashed version of: 'password123'
