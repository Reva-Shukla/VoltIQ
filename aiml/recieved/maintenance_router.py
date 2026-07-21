from fastapi import APIRouter, HTTPException, status
from models.maintenance import (
    MaintenanceRequest, 
    MaintenanceResponse, 
    IntelligentMaintenanceRequest, 
    IntelligentMaintenanceResponse
)
from services.maintenance_service import MaintenanceService

# Router for standard telematics sensor warnings
router = APIRouter(
    prefix="/api/v1/maintenance",
    tags=["Predictive Maintenance"]
)

# Router for fleet maintenance schedule diagnostics
intel_router = APIRouter(
    prefix="/api/maintenance",
    tags=["Intelligent Maintenance"]
)

@router.post(
    "/predict", 
    response_model=MaintenanceResponse, 
    status_code=status.HTTP_200_OK,
    summary="Predict Vehicle Failure Probability",
    description="Estimates vehicle failure probabilities and flags warnings alongside local feature attribution explanation vectors."
)
async def predict_failure(request: MaintenanceRequest):
    try:
        service = MaintenanceService()
        response = service.predict(request)
        return response
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail=str(e)
        )
    except RuntimeError as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE, 
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=f"An error occurred during prediction: {str(e)}"
        )

@intel_router.post(
    "/predict",
    response_model=IntelligentMaintenanceResponse,
    status_code=status.HTTP_200_OK,
    summary="Intelligent Maintenance Failure Prediction & Dynamic Calendaring",
    description="Loads trained Intelligent Maintenance classifier to predict breakdown probability, risk level, next service date, and priority class."
)
async def predict_intelligent(request: IntelligentMaintenanceRequest):
    try:
        service = MaintenanceService()
        response = service.predict_intelligent_maintenance(request)
        return response
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except RuntimeError as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred during intelligent maintenance evaluation: {str(e)}"
        )
