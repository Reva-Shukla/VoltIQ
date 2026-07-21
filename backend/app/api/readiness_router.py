from fastapi import APIRouter, HTTPException, status
from app.models.readiness import (
    ReadinessRequest, 
    ReadinessResponse, 
    RuleBasedReadinessRequest, 
    RuleBasedReadinessResponse
)
from app.services.readiness_service import ReadinessService

router = APIRouter(
    prefix="/api/v1/readiness",
    tags=["Electrification Readiness"]
)

rule_router = APIRouter(
    prefix="/api/readiness",
    tags=["Rule-Based Readiness Engine"]
)

@router.post(
    "/predict", 
    response_model=ReadinessResponse, 
    status_code=status.HTTP_200_OK,
    summary="Predict Electrification Suitability Score",
    description="Loads trained ML model to calculate suitability score (0-100), estimates financial savings, and returns feature explanations."
)
async def predict_readiness(request: ReadinessRequest):
    try:
        service = ReadinessService()
        return service.predict(request)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error: {str(e)}")

@rule_router.post(
    "/score",
    response_model=RuleBasedReadinessResponse,
    status_code=status.HTTP_200_OK,
    summary="Evaluate Rule-Based Electrification Readiness",
    description="Calculates transparent weighted readiness score, assigns readiness category, and generates XAI point breakdown."
)
async def evaluate_readiness_score(request: RuleBasedReadinessRequest):
    try:
        service = ReadinessService()
        return service.evaluate_rule_based_readiness(request)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error: {str(e)}")
