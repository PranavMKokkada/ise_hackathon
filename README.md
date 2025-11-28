# BioNexus: AI-Powered Supply Chain & Health Resilience Platform

BioNexus is a comprehensive platform designed to predict disease outbreaks, monitor supply chain resilience, and provide actionable intelligence for healthcare logistics. It integrates biological weather forecasting with deep-tier supply chain mapping to ensure critical medical resources reach where they are needed most.

## 🚀 Key Features

*   **Global Bio-Surveillance:** Real-time monitoring of disease outbreaks using AI-driven prediction models.
*   **Supply Chain Mapping:** Interactive 3D and 2D visualization of multi-tier pharmaceutical supply chains.
*   **Resilience Analysis:** "What-if" simulation engine to stress-test supply chains against disruptions.
*   **Hospital Collaboration:** Peer-to-peer inventory sharing and resource coordination for hospitals.
*   **Public Health Cast:** Mobile-first alerts and behavioral nudges for the general public.

## 🛠️ System Architecture

The platform consists of three main microservices and a modern frontend:

1.  **Service A (Biological Weather Engine):**
    *   **Role:** Predicts disease outbreaks based on weather, mobility, and social signals.
    *   **Tech:** FastAPI, Prophet, LSTM.
    *   **Port:** `8001`

2.  **Service B (Supply Chain Engine):**
    *   **Role:** Manages supply chain graph, tracks disruptions, and optimizes inventory.
    *   **Tech:** FastAPI, Neo4j, PostgreSQL.
    *   **Port:** `8002`

3.  **Service C (Nexus Intelligence Engine):**
    *   **Role:** Central intelligence unit for risk analysis, simulations, and recommendations.
    *   **Tech:** FastAPI, Reinforcement Learning, NetworkX.
    *   **Port:** `8005`

4.  **Frontend:**
    *   **Role:** Interactive dashboard and user interface.
    *   **Tech:** React, TypeScript, Tailwind CSS, Framer Motion, Three.js.
    *   **Port:** `5173`

5.  **API Gateway:**
    *   **Role:** Unified entry point routing requests to appropriate services.
    *   **Port:** `8000`

## 📦 Installation & Setup

### Prerequisites
*   Python 3.9+
*   Node.js 16+
*   Docker & Docker Compose (for Neo4j, PostgreSQL, Redis)

### 1. Start Infrastructure
```bash
docker-compose up -d
```

### 2. Start Backend Services
You can run each service in a separate terminal:

**API Gateway:**
```bash
uvicorn backend.gateway.main:app --reload --port 8000
```

**Service A:**
```bash
uvicorn backend.service_a.app.main:app --reload --port 8001
```

**Service B:**
```bash
uvicorn backend.service_b.main:app --reload --port 8002
```

**Service C:**
```bash
cd backend/service_c/nexus_engine
uvicorn app.main:app --reload --port 8005
```

### 3. Start Frontend
```bash
cd frontend
npm install
npm run dev
```

## 🧪 API Documentation

Once services are running, you can access the interactive API docs:
*   **Gateway:** http://localhost:8000/docs
*   **Service A:** http://localhost:8001/docs
*   **Service B:** http://localhost:8002/docs
*   **Service C:** http://localhost:8005/docs

## 👥 Team
*   **Pranav:** Frontend Lead & Supply Chain Engine (Service B)
*   **Prasoon:** Biological Weather Engine (Service A)
*   **Nithish:** Nexus Intelligence Engine (Service C)