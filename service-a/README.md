# Service A: Biological Weather Engine

This service aggregates environmental and social data to predict disease outbreaks using an ensemble of Prophet and LSTM models.

## Tech Stack
- **Framework**: FastAPI
- **Database**: MySQL 8.0
- **Caching**: Redis
- **ML**: Prophet, TensorFlow (LSTM)

## Setup & Run (Local)

Since this project is configured for a local environment (Docker optional), follow these steps:

1. **Prerequisites**: 
   - Python 3.9+
   - MySQL (`brew install mysql`)
   - Redis (`brew install redis`)

2. **Start Services**:
   ```bash
   brew services start mysql
   brew services start redis
   ```

3. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```
   *Note: If you have issues with `tensorflow` or `prophet` on your machine, the code is designed to run with mock models if these libraries are missing.*

4. **Seed Data**:
   Populate the database with mock data:
   ```bash
   export PYTHONPATH=$PYTHONPATH:.
   python seed.py
   ```

5. **Run API**:
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload
   ```

## API Endpoints

- **Documentation**: [http://localhost:8001/docs](http://localhost:8001/docs)
- `GET /forecast/{days}`: Get outbreak forecast for N days.
- `GET /outbreak-predictions/current`: Get latest risk prediction.
- `POST /simulate`: Simulate outbreak risk based on environmental changes.
- `GET /outbreak-predictions/report`: Download PDF report.

## Testing

To run tests:
```bash
export PYTHONPATH=$PYTHONPATH:.
pytest
```
