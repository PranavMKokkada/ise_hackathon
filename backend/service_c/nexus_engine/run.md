# 🏃‍♂️ How to Use Nexus Intelligence Engine (Service C)

The server is now running locally! Here is how you can interact with it.

## 🔗 Access Links
- **Interactive API Docs (Swagger UI)**: [http://127.0.0.1:8003/docs](http://127.0.0.1:8003/docs)
- **Alternative Docs (ReDoc)**: [http://127.0.0.1:8003/redoc](http://127.0.0.1:8003/redoc)

## 🧪 Things to Try

### 1. Check Risk Analysis
See if there are any gaps between supply and demand.
- **Endpoint**: `GET /api/v1/nexus/risk-analysis/resilience-gap`
- **Try it**: [Click here to view raw JSON](http://127.0.0.1:8003/api/v1/nexus/risk-analysis/resilience-gap)
- **Expected Result**: An empty list `[]` (initially) or a list of risk calculations if data exists.

### 2. Run a Simulation
Simulate a "High Rainfall" scenario to see predicted disease outbreaks.
- **Go to Swagger UI**: [http://127.0.0.1:8003/docs#/simulations/run_simulation_api_v1_nexus_simulations_run_post](http://127.0.0.1:8003/docs#/simulations/run_simulation_api_v1_nexus_simulations_run_post)
- **Click**: `Try it out`
- **Enter Request Body**:
  ```json
  {
    "rainfall_increase": 20,
    "mobility_factor": 1.5
  }
  ```
- **Click**: `Execute`
- **Expected Result**: A JSON response with a `simulation_id` and `results`.

### 3. Check Analytics
View model performance metrics.
- **Endpoint**: `GET /api/v1/nexus/analytics/accuracy-metrics`
- **Try it**: [Click here to view raw JSON](http://127.0.0.1:8003/api/v1/nexus/analytics/accuracy-metrics)

### 4. Get Recommendations
See what the system recommends for hospitals.
- **Endpoint**: `GET /api/v1/nexus/recommendations/hospitals/HOSP_001`
- **Try it**: [Click here to view raw JSON](http://127.0.0.1:8003/api/v1/nexus/recommendations/hospitals/HOSP_001)

## 🛑 How to Stop
To stop the server, go to the terminal where it is running and press `Ctrl+C`.
