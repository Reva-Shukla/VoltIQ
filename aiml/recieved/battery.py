from pydantic import BaseModel, Field
from typing import List, Union, Any

class BatterySohRequest(BaseModel):
    """
    Request model containing telemetry metrics used to estimate Battery SOH.
    """
    charge_cycles: int = Field(..., ge=0, description="Total charge-discharge cycles experienced by the battery", examples=[150])
    avg_temp_c: float = Field(..., description="Average battery temperature during operation in Celsius", examples=[25.5])
    max_temp_c: float = Field(..., description="Maximum battery temperature during operation in Celsius", examples=[35.2])
    internal_resistance_ohm: float = Field(..., gt=0.0, description="Internal resistance of the battery cell in ohms", examples=[0.08])
    voltage_drop_v: float = Field(..., description="Voltage drop under load in volts", examples=[0.15])
    discharge_rate_c: float = Field(..., gt=0.0, description="C-rate representing speed of discharge", examples=[1.5])
    capacity_throughput_kwh: float = Field(..., ge=0.0, description="Total energy throughput in kWh over its lifetime", examples=[12000.0])

class FeatureExplanation(BaseModel):
    """
    Itemized explanation details showing local sensitivity (impact) of a single feature.
    """
    feature: str = Field(..., description="Name of the feature")
    value: Any = Field(..., description="Actual value of the feature for the sample")
    baseline_value: Any = Field(..., description="Typical / average baseline value of the feature in the dataset")
    impact: float = Field(..., description="Impact of the feature value on the prediction outcome")
    direction: str = Field(..., description="Direction of impact ('increases', 'decreases', or 'neutral')")

class BatterySohResponse(BaseModel):
    """
    Response schema returning the predicted SOH and corresponding explanations.
    """
    predicted_soh: float = Field(..., description="Estimated Battery State of Health in percentage (0-100%)", examples=[92.45])
    baseline_soh: float = Field(..., description="Average Battery SOH prediction of the baseline reference profile", examples=[98.2])
    soh_difference: float = Field(..., description="Difference between predicted SOH and the baseline SOH", examples=[-5.75])
    explanations: List[FeatureExplanation] = Field(..., description="Ranked list of explanations for the prediction")


class NasaBatteryRequest(BaseModel):
    """
    Request model containing telemetry metrics matching the NASA Battery dataset schema.
    """
    temperature: float = Field(..., description="Battery cell temperature in Celsius", examples=[32.5])
    voltage: float = Field(..., description="Battery terminal voltage under discharge in Volts", examples=[3.65])
    current: float = Field(..., description="Battery current draw during discharge in Amperes", examples=[2.0])
    cycle_count: int = Field(..., ge=0, description="The current cycle index of the battery cell", examples=[80])
    capacity: float = Field(..., gt=0.0, description="The measured discharge capacity of the cell in Ah", examples=[1.62])
    internal_resistance: float = Field(..., gt=0.0, description="The internal resistance of the cell in Ohms", examples=[0.12])


class FactorAttribution(BaseModel):
    """
    Structured feature attribution description for Explainable AI output.
    """
    feature: str = Field(..., description="Name of the feature")
    impact_pct: float = Field(..., description="Impact of the feature on the SOH score in percentage points")
    description: str = Field(..., description="Human-readable natural language descriptor of the contribution")


class NasaBatteryResponse(BaseModel):
    """
    Response model returning remaining life prognostic forecasts, replacement recommendations, and explainable AI diagnostics.
    """
    battery_health: float = Field(..., description="Predicted battery health percentage (State of Health)", examples=[81.0])
    remaining_useful_life: float = Field(..., description="Predicted remaining useful life of the battery in cycles", examples=[85.0])
    capacity_fade: float = Field(..., description="Calculated capacity fade of the battery in Ah", examples=[0.38])
    remaining_cycles: float = Field(..., description="Estimated operational cycles remaining before failure", examples=[85.0])
    expected_failure_time: str = Field(..., description="Projected failure time descriptor", examples=["85 days"])
    confidence: float = Field(..., description="Confidence score of prediction in percentage (0-100%)", examples=[94.2])
    feature_importance: dict = Field(..., description="Precomputed global feature importances for SOH regression model")
    recommendation: str = Field(..., description="Recommendation based on current state ('Healthy', 'Monitor', 'Replace Soon', 'Critical')", examples=["Monitor"])
    top_contributing_factors: List[FactorAttribution] = Field(..., description="Ranked list of all contributing factors by absolute impact")
    positive_factors: List[FactorAttribution] = Field(..., description="List of positive contributing factors (stabilizing health)")
    negative_factors: List[FactorAttribution] = Field(..., description="List of negative contributing factors (degrading health)")
    natural_language_explanation: str = Field(..., description="Narrative natural language summary explaining the prediction", examples=["Battery capacity fade is the primary driver..."])


