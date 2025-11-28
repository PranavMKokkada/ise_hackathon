from fastapi import APIRouter
from app.api.v1.endpoints import risk_analysis, recommendations, simulations, predictions, analytics

api_router = APIRouter()
api_router.include_router(risk_analysis.router, prefix="/risk-analysis", tags=["risk-analysis"])
api_router.include_router(recommendations.router, prefix="/recommendations", tags=["recommendations"])
api_router.include_router(simulations.router, prefix="/simulations", tags=["simulations"])
api_router.include_router(predictions.router, prefix="/predictions", tags=["predictions"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["analytics"])
