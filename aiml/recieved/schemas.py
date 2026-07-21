from pydantic import BaseModel, Field
from typing import Dict, Any, Optional

class ReadinessRequest(BaseModel):
    vehicle_age: float = Field(..., description="Age of the vehicle in years")
    mileage: float = Field(..., description="Total mileage of the vehicle")
    payload: float = Field(..., description="Average payload in kg")
    daily_route_distance: float = Field(..., description="Daily route distance in km")
    idle_time: float = Field(..., description="Daily idle time in hours")
    fuel_consumption: float = Field(..., description="Fuel consumption in L/100km")
    maintenance_cost: float = Field(..., description="Annual maintenance cost")
    charging_infrastructure: int = Field(..., description="Charging availability score (0-10)")
    terrain: int = Field(1, description="Terrain difficulty score (1-5)")
    weather: int = Field(1, description="Weather extremity score (1-5)")
    operating_region: Optional[str] = Field("Unknown", description="Operating region name")

class SimulationRequest(BaseModel):
    base_vehicle: Dict[str, Any] = Field(..., description="Current vehicle state dictionary")
    modifications: Dict[str, Any] = Field(..., description="Modifications to apply for the simulation")

class ProcurementRequest(BaseModel):
    fleet_readiness: float = Field(..., description="Overall fleet EV readiness score (0-100)")
    maintenance_risk: float = Field(..., description="Current maintenance risk score (0-100)")
    battery_prediction: float = Field(..., description="Predicted battery suitability/health (0-100)")
    operating_cost: float = Field(..., description="Annual operating cost")
    fuel_consumption: float = Field(..., description="Fuel consumption in L/100km")

class ChatRequest(BaseModel):
    query: str = Field(..., description="User's natural language query")

class BatteryPredictRequest(BaseModel):
    vehicle_age: float = Field(..., description="Age of the vehicle in years")
    mileage: float = Field(..., description="Total mileage of the vehicle")
    temperature: float = Field(20.0, description="Average operating temperature (C)")
    fast_charging_frequency: int = Field(0, description="Number of fast charges per week")

class MaintenancePredictRequest(BaseModel):
    vehicle_age: float = Field(..., description="Age of the vehicle in years")
    mileage: float = Field(..., description="Total mileage of the vehicle")
    road_conditions: int = Field(1, description="Road condition score (1-5)")
    payload: float = Field(..., description="Average payload in kg")
