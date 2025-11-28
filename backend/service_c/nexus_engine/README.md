# Nexus Intelligence Engine (Service C)

## Overview
The **Nexus Intelligence Engine** is the central brain of the Biological Weather & Supply Chain system. It aggregates data from Service A (Biological Weather) and Service B (Supply Chain) to provide risk analysis, recommendations, simulations, and analytics.

**Base URL**: `http://localhost:8003/api/v1/nexus`

## Tech Stack
- **Backend**: FastAPI (Python 3.10+)
- **Database**: PostgreSQL (SQLAlchemy ORM)
- **Caching/Queue**: Redis, RabbitMQ (Celery)
- **ML/Analytics**: Scikit-learn (Clustering), Scipy (Optimization), NumPy
- **Containerization**: Docker, Docker Compose

---

## 🚀 Quick Start

### Option 1: Docker (Production/Full Integration)
Recommended for running the full stack with background jobs.
```bash
cd nexus_engine
docker-compose up -d
alembic upgrade head
```

### Option 2: Local Demo (No Docker)
Recommended for quick frontend testing without setting up Postgres/Redis.
```bash
# From project root
python3 nexus_engine/run_local.py
```
Server starts at `http://127.0.0.1:8003`.

---

## 🔌 Integration Guide (For Frontend)

### 1. Global Dashboard (`/dashboard`)
*   **Critical Alerts Feed**:
    *   **Endpoint**: `GET /risk-analysis/critical-alerts`
    *   **Usage**: Fetch high-priority alerts (e.g., "Supply Collision in Region X").
*   **Quick Action - Run Simulation**:
    *   **Endpoint**: `POST /simulations/run`
    *   **Body**: `{"rainfall_increase": 20, "mobility_factor": 1.5}`
    *   **Usage**: Triggers a simulation and redirects to Simulation Mode.

### 2. Region Drill-Down (`/region/{id}`)
*   **Action Recommendations**:
    *   **Endpoint**: `GET /recommendations/hospitals?region={region_id}` (Note: Filter logic to be applied on frontend or backend query param)
    *   **Usage**: Populates "Top Items to Stock" and "Routing Suggestions".

### 3. Simulation Mode (`/simulation`)
*   **Run Simulation**:
    *   **Endpoint**: `POST /simulations/run`
    *   **Response**: `{"simulation_id": "uuid", "results": {...}}`
*   **Get Results**:
    *   **Endpoint**: `GET /simulations/results/{simulation_id}`
*   **List Scenarios**:
    *   **Endpoint**: `GET /simulations/scenarios`

### 4. Hospital Dashboard (`/hospital`)
*   **Local Warnings**:
    *   **Endpoint**: `GET /risk-analysis/critical-alerts` (Filter by region on client if needed)
*   **Predictive Insights**:
    *   **Endpoint**: `GET /recommendations/hospitals/{hospital_id}`
    *   **Usage**: Shows specific stockpile recommendations for the logged-in hospital.

### 5. Analytics & Reports (`/analytics`)
*   **Prediction Accuracy**:
    *   **Endpoint**: `GET /analytics/accuracy-metrics`
    *   **Usage**: Populates the "Prediction Accuracy Chart".
*   **Pattern Detection**:
    *   **Endpoint**: `GET /analytics/pattern-detection`
    *   **Usage**: Shows discovered correlations (e.g., "Rainfall -> Malaria Spike").

### 6. Public Health Cast (Mobile)
*   **Hyper-local Warnings**:
    *   **Endpoint**: `GET /risk-analysis/critical-alerts`
*   **Behavioral Advice**:
    *   **Endpoint**: `GET /recommendations/government` (or specific public endpoint)

---

## 📡 API Reference

### Risk Analysis
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/risk-analysis/resilience-gap` | Calculate gap between demand and supply. |
| `GET` | `/risk-analysis/collision-points` | Identify specific regions where demand > supply. |
| `GET` | `/risk-analysis/critical-alerts` | Get high-severity alerts. |
| `POST` | `/risk-analysis/calculate` | Trigger a fresh risk analysis (Async). |

### Recommendations
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/recommendations/hospitals/{id}` | Actions for a specific hospital. |
| `GET` | `/recommendations/suppliers` | Opportunities for suppliers. |
| `GET` | `/recommendations/redistribution` | Optimal stock redistribution plan (Linear Programming). |

### Simulations
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/simulations/run` | Run Monte Carlo simulation. |
| `GET` | `/simulations/results/{id}` | Get simulation results. |
| `DELETE`| `/simulations/{id}` | Delete a simulation. |

### Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/analytics/accuracy-metrics` | Model performance stats (MAE, RMSE). |
| `GET` | `/analytics/pattern-detection` | ML-detected patterns (Clustering). |
| `POST` | `/analytics/feedback` | Submit actual outcomes for retraining. |

---

## 🧠 ML Models Implemented

1.  **Collision Detection**:
    *   **Logic**: Compares forecasted disease cases (Service A) with inventory levels (Service B).
    *   **Threshold**: triggers alerts if `Demand > Supply`.

2.  **Optimization (Redistribution)**:
    *   **Algorithm**: Linear Programming (`scipy.optimize.linprog`).
    *   **Objective**: Minimize transportation cost and shortages.
    *   **Constraints**: Supplier capacity, Hospital demand.

3.  **Pattern Detection**:
    *   **Algorithm**: K-Means Clustering (`sklearn.cluster.KMeans`).
    *   **Goal**: Group historical events to find patterns like "High Rainfall -> Outbreak".

4.  **Impact Simulation**:
    *   **Algorithm**: Monte Carlo Simulation.
    *   **Goal**: Generate probability distributions for outcomes by varying input parameters (e.g., infection rate, mobility).
