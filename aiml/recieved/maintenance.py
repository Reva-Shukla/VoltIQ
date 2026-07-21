from pydantic import BaseModel, Field
from typing import List, Any, Literal
from models.battery import FeatureExplanation

class MaintenanceRequest(BaseModel):
    """
    Request model containing telemetry metrics used to predict potential vehicle failures.
    """
    coolant_temp_c: float = Field(..., description="Coolant temperature in Celsius", examples=[92.4])
    vibration_amplitude_mm: float = Field(..., ge=0.0, description="Vibration amplitude of the motor/drivetrain in mm", examples=[0.08])
    battery_temp_c: float = Field(..., description="Battery pack temperature in Celsius", examples=[32.5])
    motor_temp_c: float = Field(..., description="Electric motor temperature in Celsius", examples=[78.0])
    vehicle_age_months: int = Field(..., ge=0, description="Age of the vehicle in months", examples=[24])
    mileage_km: float = Field(..., ge=0.0, description="Odometer mileage of the vehicle in km", examples=[54000.0])
    average_speed_kmh: float = Field(..., ge=0.0, description="Average operational speed in km/h", examples=[52.5])
    brake_wear_index: float = Field(..., ge=0.0, le=1.0, description="Brake wear wear factor (0.0=New, 1.0=Worn)", examples=[0.35])

class MaintenanceResponse(BaseModel):
    """
    Response schema returning failure predictions, hazard classifications, and explanations.
    """
    failure_probability: float = Field(..., description="Probability of vehicle failure (0.0 to 1.0)", examples=[0.125])
    failure_warning: int = Field(..., description="Binary failure flag warning (1 = Action Required, 0 = Normal)", examples=[0])
    baseline_probability: float = Field(..., description="Baseline probability of failure across the fleet", examples=[0.05])
    probability_difference: float = Field(..., description="Difference between predicted probability and the baseline", examples=[0.075])
    explanations: List[FeatureExplanation] = Field(..., description="Ranked list of feature explanations for the prediction")


class IntelligentMaintenanceRequest(BaseModel):
    """
    Request model for the Intelligent Maintenance Prediction module.
    """
    mileage: float = Field(..., ge=0.0, description="Odometer mileage of the vehicle in km", examples=[120000.0])
    vehicle_age: float = Field(..., ge=0.0, description="Age of the vehicle in months", examples=[36.0])
    engine_hours: float = Field(..., ge=0.0, description="Cumulative engine hours", examples=[3500.0])
    battery_health: float = Field(..., ge=0.0, le=100.0, description="Battery State of Health percentage", examples=[78.5])
    maintenance_frequency: int = Field(..., ge=1, description="Number of maintenance services performed per year", examples=[2])
    downtime: float = Field(..., ge=0.0, description="Cumulative historical downtime in hours", examples=[18.0])
    operating_conditions: Literal['Normal', 'Severe', 'Extreme'] = Field(..., description="Operational stress environment", examples=["Severe"])


class IntelligentMaintenanceResponse(BaseModel):
    """
    Response model for the Intelligent Maintenance Prediction module containing alerts and prognostic scheduling.
    """
    failure_probability: float = Field(..., description="Predicted breakdown probability within the next 30 days (0.0 to 1.0)", examples=[0.425])
    risk_level: Literal['Low Risk', 'Medium Risk', 'High Risk', 'Critical'] = Field(..., description="Hazard risk level classification")
    next_maintenance_date: str = Field(..., description="Dynamic calendar date for the next inspection (YYYY-MM-DD)", examples=["2026-07-27"])
    maintenance_priority: Literal['Low', 'Medium', 'High', 'Immediate'] = Field(..., description="Action priority class")
    recommendation: str = Field(..., description="Automated natural language advisory warning", examples=["Schedule maintenance within 7 days..."])
    explanations: List[FeatureExplanation] = Field(..., description="Explainable AI local attributions detailing feature impacts")

