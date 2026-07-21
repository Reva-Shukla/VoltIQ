from pydantic import BaseModel, Field
from typing import List, Literal, Any
from models.battery import FeatureExplanation

class ReadinessRequest(BaseModel):
    """
    Request model containing metrics of an existing ICE vehicle to evaluate electrification suitability.
    """
    daily_distance_km: float = Field(..., gt=0.0, description="Average daily travel distance in km", examples=[120.5])
    max_payload_kg: float = Field(..., gt=0.0, description="Maximum payload capacity requirement in kg", examples=[1200.0])
    route_type: Literal['urban', 'mixed', 'highway'] = Field(..., description="Predominant type of operational route", examples=["urban"])
    depot_grid_capacity_kw: float = Field(..., gt=0.0, description="Available charging grid capacity at depot in kW", examples=[150.0])
    annual_fuel_cost_usd: float = Field(..., ge=0.0, description="Current annual fuel spend of the ICE vehicle in USD", examples=[12500.0])
    annual_maintenance_cost_usd: float = Field(..., ge=0.0, description="Current annual maintenance spend of the ICE vehicle in USD", examples=[2800.0])
    charger_availability_on_route: int = Field(..., ge=0, le=1, description="Binary flag indicating public charging access along standard route", examples=[1])

class ReadinessResponse(BaseModel):
    """
    Response schema returning suitability predictions, financial savings estimates, and explanations.
    """
    predicted_suitability_score: float = Field(..., description="Overall electrification suitability score (0-100)", examples=[88.5])
    baseline_suitability_score: float = Field(..., description="Baseline average electrification score of the reference fleet", examples=[62.1])
    suitability_difference: float = Field(..., description="Difference between vehicle suitability score and baseline", examples=[26.4])
    estimated_annual_savings_usd: float = Field(..., description="Estimated annual cost savings (fuel + maintenance) after switching to EV", examples=[9520.0])
    explanations: List[FeatureExplanation] = Field(..., description="Ranked list of feature explanations for the suitability prediction")


from typing import Dict, Optional

class ReadinessFactorScore(BaseModel):
    """
    Structured point score breakdown for an electrification readiness factor.
    """
    factor: str = Field(..., description="Name of the evaluated factor")
    score: float = Field(..., description="Raw score of the factor (0-100)")
    weight: float = Field(..., description="Weight parameter allocated to this factor")
    contribution: float = Field(..., description="Weighted point contribution to the final score")
    explanation: str = Field(..., description="Natural language description of the factor evaluation")


class RuleBasedReadinessRequest(BaseModel):
    """
    Request model containing vehicle lifecycle, operation, and location properties for rule-based evaluation.
    """
    vehicle_age: float = Field(..., ge=0.0, description="Age of the vehicle in years", examples=[5.5])
    mileage: float = Field(..., ge=0.0, description="Total odometer mileage of the vehicle in km", examples=[150000.0])
    payload: float = Field(..., ge=0.0, description="Average operational cargo payload in kg", examples=[1500.0])
    daily_route_distance: float = Field(..., ge=0.0, description="Average daily operating distance in km", examples=[120.0])
    idle_time: float = Field(..., ge=0.0, description="Average idle hours or minutes per day", examples=[45.0])
    fuel_consumption: float = Field(..., ge=0.0, description="Average fuel consumption in L/100km", examples=[14.5])
    maintenance_cost: float = Field(..., ge=0.0, description="Annual maintenance cost of the vehicle in USD", examples=[3500.0])
    charging_infrastructure: Literal['Available', 'Planned', 'None'] = Field(..., description="Status of grid charging infrastructure")
    terrain: Literal['Flat', 'Hilly', 'Mountainous'] = Field(..., description="Primary operating terrain characteristics")
    weather: Literal['Mild', 'Cold', 'Extreme'] = Field(..., description="Primary weather environment conditions")
    operating_region: Literal['Urban', 'Mixed', 'Highway'] = Field(..., description="Predominant operational region")
    weights: Optional[Dict[str, float]] = Field(
        None, 
        description="Optional custom weights that must sum to 1.0 (keys: daily_distance, charging_infrastructure, economic_savings, operating_environment, asset_lifecycle)"
    )


class RuleBasedReadinessResponse(BaseModel):
    """
    Response model returning rule-based readiness scores, categories, and XAI point breakdowns.
    """
    readiness_score: float = Field(..., description="Aggregated electrification readiness score (0-100)", examples=[87.0])
    category: Literal['Ready', 'Moderately Ready', 'Needs Review', 'Not Recommended'] = Field(..., description="Electrification suitability category")
    explanation: str = Field(..., description="Automated natural language summary of the points allocation")
    factor_breakdown: List[ReadinessFactorScore] = Field(..., description="Detailed factor-by-factor scoring breakdown")

