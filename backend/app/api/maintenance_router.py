from fastapi import APIRouter, HTTPException, status
from app.models.maintenance import (
    MaintenanceRequest, 
    MaintenanceResponse, 
    IntelligentMaintenanceRequest, 
    IntelligentMaintenanceResponse
)
from app.services.maintenance_service import MaintenanceService

router = APIRouter(
    prefix="/api/v1/maintenance",
    tags=["Predictive Maintenance"]
)

intel_router = APIRouter(
    prefix="/api/v1/maintenance",
    tags=["Intelligent Maintenance Risk Scheduling"]
)

@router.post(
    "/predict", 
    response_model=MaintenanceResponse, 
    status_code=status.HTTP_200_OK,
    summary="Predict Vehicle Component Failure Risk",
    description="Loads trained Random Forest classifier to predict vehicle failure probability and provides local explanations."
)
async def predict_maintenance(request: MaintenanceRequest):
    try:
        service = MaintenanceService()
        return service.predict(request)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error: {str(e)}")

@intel_router.post(
    "/intelligent-predict",
    response_model=IntelligentMaintenanceResponse,
    status_code=status.HTTP_200_OK,
    summary="Predict Breakdown Risk and Intelligent Maintenance Schedule",
    description="Predicts fleet breakdown probability, projects next calendar maintenance date, and returns risk recommendations."
)
async def predict_intelligent_maintenance(request: IntelligentMaintenanceRequest):
    try:
        service = MaintenanceService()
        return service.predict_intelligent_maintenance(request)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error: {str(e)}")
