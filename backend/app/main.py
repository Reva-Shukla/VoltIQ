import os
import sys
from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

# Add parent directory to path so imports work smoothly
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import app.ml as ml
import app.ml.preprocessing as ml_prep
import app.ml.preprocessing.preprocessor as ml_prep_proc

sys.modules['ml'] = ml
sys.modules['ml.preprocessing'] = ml_prep
sys.modules['ml.preprocessing.preprocessor'] = ml_prep_proc

from app.api import battery_router, maintenance_router, readiness_router, fleet_router
from app.services.battery_service import BatteryService
from app.services.maintenance_service import MaintenanceService
from app.services.readiness_service import ReadinessService
from app.models.battery_model import get_model
from app.ml.utils.helpers import logger

app = FastAPI(
    title="VoltIQ EV Fleet Intelligence & Battery AI Platform Backend",
    version="1.0.0",
    description="Enterprise AI service providing battery State of Health estimations, predictive failure warnings, electrification readiness scoring, and vehicle prognostics."
)

# Enable CORS for React frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register All API Routers
app.include_router(fleet_router.router)
app.include_router(battery_router.router)
app.include_router(battery_router.nasa_router)
app.include_router(maintenance_router.router)
app.include_router(maintenance_router.intel_router)
app.include_router(readiness_router.router)
app.include_router(readiness_router.rule_router)

@app.on_event("startup")
async def startup_event():
    """
    On startup, load all machine learning models into memory to ensure low latency.
    """
    logger.info("Initializing VoltIQ ML Services and pre-loading models into memory...")
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    
    try:
        BatteryService().initialize(base_dir)
        MaintenanceService().initialize(base_dir)
        ReadinessService().initialize(base_dir)
        get_model() # Warm battery APM model
        logger.info("All VoltIQ ML models successfully loaded and ready for inference.")
    except Exception as e:
        logger.error(f"Critical failure during ML model initialization on startup: {e}")

@app.get("/", tags=["General"])
async def root():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    
    battery_status = "Loaded" if BatteryService().initialized else "Unavailable"
    maintenance_status = "Loaded" if MaintenanceService().initialized else "Unavailable"
    readiness_status = "Loaded" if ReadinessService().initialized else "Unavailable"
    
    return {
        "platform_name": "VoltIQ EV Fleet Intelligence Platform",
        "api_version": "1.0.0",
        "status": "healthy",
        "model_status": {
            "battery_soh_model": battery_status,
            "maintenance_classifier": maintenance_status,
            "electrification_readiness_model": readiness_status
        }
    }

@app.get("/health", tags=["General"])
async def health_check():
    all_ready = (
        BatteryService().initialized and
        MaintenanceService().initialized and
        ReadinessService().initialized
    )
    
    if all_ready:
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"status": "healthy", "details": "All ML models are loaded and operational."}
        )
    else:
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={"status": "degraded", "details": "One or more ML models failed to load on startup."}
        )
