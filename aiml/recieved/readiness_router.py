from fastapi import APIRouter, HTTPException, status
from models.readiness import (
    ReadinessRequest, 
    ReadinessResponse, 
    RuleBasedReadinessRequest, 
    RuleBasedReadinessResponse
)
from services.readiness_service import ReadinessService

# Router for ML-based transition index
router = APIRouter(
    prefix="/api/v1/readiness",
    tags=["Electrification Readiness"]
)

# Router for rule-based configurable scoring engine
score_router = APIRouter(
    prefix="/api/readiness",
    tags=["Fleet Electrification Readiness Engine"]
)

@router.post(
    "/predict", 
    response_model=ReadinessResponse, 
    status_code=status.HTTP_200_OK,
    summary="Estimate Fleet Electrification Readiness & Savings",
    description="Estimates vehicle electrification suitability score (0-100), calculates potential cost savings, and provides explainability diagnostics."
)
async def predict_suitability(request: ReadinessRequest):
    try:
        service = ReadinessService()
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
            detail=f"An error occurred during evaluation: {str(e)}"
        )

@score_router.post(
    "/predict",
    response_model=RuleBasedReadinessResponse,
    status_code=status.HTTP_200_OK,
    summary="Evaluate Fleet Electrification Readiness (Rule-Based)",
    description="Calculates a weighted suitability score (0-100), categories readiness, and generates natural language explanations."
)
async def score_readiness(request: RuleBasedReadinessRequest):
    try:
        service = ReadinessService()
        response = service.evaluate_rule_based_readiness(request)
        return response
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred during rule-based evaluation: {str(e)}"
        )
