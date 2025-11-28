# Start all services in new windows
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'backend/gateway'; uvicorn main:app --reload --port 8000"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'backend/service_a'; uvicorn app.main:app --reload --port 8001"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'backend/service_b'; uvicorn main:app --reload --port 8002"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'backend/service_c'; python nexus_engine/run_local.py"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'frontend'; npm run dev"

Write-Host "All services started in separate windows."
