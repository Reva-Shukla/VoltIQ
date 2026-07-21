from fastapi import APIRouter, HTTPException, status
from app.models.battery import BatterySohRequest, BatterySohResponse, NasaBatteryRequest, NasaBatteryResponse
from app.services.battery_service import BatteryService

router = APIRouter(
    prefix="/api/v1/battery",
    tags=["Battery Intelligence"]
)

nasa_router = APIRouter(
    prefix="/api/battery",
    tags=["NASA Battery Prognostics"]
)

@router.post(
    "/predict", 
    response_model=BatterySohResponse, 
    status_code=status.HTTP_200_OK,
    summary="Estimate Battery State of Health (SOH)",
    description="Calculates estimated battery state of health (0-100%) and provides local perturbation feature explanations."
)
async def predict_soh(request: BatterySohRequest):
    try:
        service = BatteryService()
        return service.predict(request)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error: {str(e)}")

@nasa_router.post(
    "/predict",
    response_model=NasaBatteryResponse,
    status_code=status.HTTP_200_OK,
    summary="Predict NASA Battery Remaining Useful Life and Health",
    description="Loads trained NASA regression models to predict SOH %, RUL, capacity fade, and outputs confidence metrics."
)
async def predict_nasa(request: NasaBatteryRequest):
    try:
        service = BatteryService()
        return service.predict_nasa_health(request)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error: {str(e)}")
