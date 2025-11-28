#!/bin/bash

# BioNexus - Seed All Databases Script

echo "🌱 Starting database seeding..."
echo ""

# Check if virtual environment exists
if [ ! -d "backend/venv" ]; then
    echo "Creating Python virtual environment..."
    python -m venv backend/venv
fi

# Activate virtual environment
source backend/venv/Scripts/activate 2>/dev/null || source backend/venv/bin/activate

# Install dependencies if needed
if [ ! -f "backend/venv/.installed" ]; then
    echo "Installing Python dependencies..."
    pip install -r backend/requirements.txt > /dev/null 2>&1
    touch backend/venv/.installed
fi

# Copy .env.example to .env if .env doesn't exist
if [ ! -f "backend/.env" ]; then
    echo "Creating backend/.env from .env.example..."
    cp backend/.env.example backend/.env
fi

echo "Waiting for databases to be ready..."
sleep 5

echo ""
echo "📊 Seeding Neo4j (Supply Chain Graph)..."
python backend/seed_data/seed_graph.py

echo ""
echo "📊 Seeding PostgreSQL (Disruptions, Inventory, Suppliers)..."
python backend/seed_data/seed_postgres.py

echo ""
echo "✅ All databases seeded successfully!"
echo ""
echo "You can now start the backend services with: ./run_backend.sh"
