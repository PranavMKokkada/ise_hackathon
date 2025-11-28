from fastapi import FastAPI
from .routes import router
from .database import engine, Base

app = FastAPI(title="Service A: Biological Weather Engine")

@app.on_event("startup")
def startup_event():
    # Create tables on startup
    Base.metadata.create_all(bind=engine)

app.include_router(router, prefix="/api/v1/biological-weather")

@app.get("/health")
def health_check():
    return {"status": "healthy"}
