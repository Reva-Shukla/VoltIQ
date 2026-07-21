import os
import sys
from fastapi import FastAPI, status
from fastapi.responses import JSONResponse

# Add parent directory to path so we can import modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from api import battery_router, maintenance_router, readiness_router
from services.battery_service import BatteryService
from services.maintenance_service import MaintenanceService
from services.readiness_service import ReadinessService
from ml.utils.helpers import logger

app = FastAPI(
    title="Fleet Electrification Readiness & Battery Intelligence Platform AI Backend",
    version="1.0.0",
    description="Enterprise AI service providing battery State of Health estimations, predictive failure warnings, and vehicle suitability indices for fleet transition to electric vehicles."
)

# Include Routers
app.include_router(battery_router.router)
app.include_router(battery_router.nasa_router)
app.include_router(maintenance_router.router)
app.include_router(maintenance_router.intel_router)
app.include_router(readiness_router.router)

@app.on_event("startup")
async def startup_event():
    """
    On startup, load all machine learning models into memory to minimize latency.
    """
    logger.info("Initializing ML Services and pre-loading models into memory...")
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    
    try:
        # Load Battery models
        BatteryService().initialize(base_dir)
        
        # Load Maintenance models
        MaintenanceService().initialize(base_dir)
        
        # Load Readiness models
        ReadinessService().initialize(base_dir)
        
        logger.info("All ML models successfully loaded and ready for inference.")
    except Exception as e:
        logger.error(f"Critical failure during ML initialization on startup: {e}")
        # We do not crash the app, but log the critical error. 
        # Endpoints will return 503 Service Unavailable until models load.

@app.get("/", tags=["General"])
async def root():
    """
    Returns API metadata and model status indicators.
    """
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    
    battery_status = "Loaded" if BatteryService().initialized else "Unavailable"
    maintenance_status = "Loaded" if MaintenanceService().initialized else "Unavailable"
    readiness_status = "Loaded" if ReadinessService().initialized else "Unavailable"
    
    return {
        "platform_name": "Fleet Electrification Readiness & Battery Intelligence AI Platform",
        "api_version": "1.0.0",
        "endpoints": {
            "battery_soh_predict": "/api/v1/battery/predict",
            "predictive_maintenance_predict": "/api/v1/maintenance/predict",
            "electrification_readiness_predict": "/api/v1/readiness/predict"
        },
        "model_status": {
            "battery_soh_model": battery_status,
            "maintenance_classifier": maintenance_status,
            "electrification_readiness_model": readiness_status
        }
    }

@app.get("/health", tags=["General"])
async def health_check():
    """
    Standard health check endpoint.
    """
    all_ready = (
        BatteryService().initialized and
        MaintenanceService().initialized and
        ReadinessService().initialized
    )
    
    if all_ready:
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"status": "healthy", "details": "All ML models are loaded and healthy."}
        )
    else:
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={"status": "degraded", "details": "One or more ML models failed to load on startup."}
        )
