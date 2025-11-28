#!/bin/bash

# BioNexus - Start All Backend Services

echo "🚀 Starting BioNexus Backend Services..."
echo ""

# Activate virtual environment
source backend/venv/Scripts/activate 2>/dev/null || source backend/venv/bin/activate

# Copy .env if needed
if [ ! -f "backend/.env" ]; then
    cp backend/.env.example backend/.env
    echo "✓ Created backend/.env"
fi

# Start services in background
echo "Starting Service B (Supply Chain Engine) on port 8002..."
cd backend/service_b && uvicorn main:app --host 0.0.0.0 --port 8002 --reload &
SERVICE_B_PID=$!

sleep 2

echo "Starting Mock Service A (Biological Weather) on port 8003..."
cd ../mock_service_a && uvicorn main:app --host 0.0.0.0 --port 8003 --reload &
MOCK_A_PID=$!

sleep 2

echo "Starting Mock Service C (Nexus Intelligence) on port 8004..."
cd ../mock_service_c && uvicorn main:app --host 0.0.0.0 --port 8004 --reload &
MOCK_C_PID=$!

sleep 2

echo "Starting API Gateway on port 8000..."
cd ../gateway && uvicorn main:app --host 0.0.0.0 --port 8000 --reload &
GATEWAY_PID=$!

echo ""
echo "✅ All backend services started!"
echo ""
echo "Services running:"
echo "  - API Gateway:        http://localhost:8000"
echo "  - Service B:          http://localhost:8002"
echo "  - Mock Service A:     http://localhost:8003"
echo "  - Mock Service C:     http://localhost:8004"
echo ""
echo "API Documentation:"
echo "  - Gateway Docs:       http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait and handle shutdown gracefully
trap "kill $SERVICE_B_PID $MOCK_A_PID $MOCK_C_PID $GATEWAY_PID 2>/dev/null; echo 'Services stopped.'; exit" INT TERM

wait
