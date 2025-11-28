"""
Service B: Deep-Tier Supply Chain Engine
Main FastAPI Application
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

# Import routers
from routers import graph, disruptions, inventory, suppliers, routing

load_dotenv()

app = FastAPI(
    title="BioNexus Service B - Supply Chain Engine",
    description="Deep-tier supply chain tracking and optimization",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "http://localhost:5173").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(graph.router, prefix="/graph-data", tags=["Graph"])
app.include_router(disruptions.router, prefix="/disruptions", tags=["Disruptions"])
app.include_router(inventory.router, prefix="/inventory", tags=["Inventory"])
app.include_router(suppliers.router, prefix="/suppliers", tags=["Suppliers"])
app.include_router(routing.router, prefix="/routing", tags=["Routing"])

@app.get("/")
def root():
    return {
        "service": "BioNexus Service B",
        "description": "Deep-Tier Supply Chain Engine",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "service_b"}
