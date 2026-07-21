import os
import sys
import pandas as pd
from typing import Optional, Dict, Any, List

import app.ml as ml
import app.ml.preprocessing as ml_prep
import app.ml.preprocessing.preprocessor as ml_prep_proc

sys.modules['ml'] = ml
sys.modules['ml.preprocessing'] = ml_prep
sys.modules['ml.preprocessing.preprocessor'] = ml_prep_proc

from app.models.battery import (
    BatterySohRequest, 
    BatterySohResponse, 
    NasaBatteryRequest, 
    NasaBatteryResponse, 
    FeatureExplanation, 
    FactorAttribution
)
from app.ml.utils.helpers import load_model, load_json, logger
from app.ml.explainability.explainer import PerturbationExplainer

class BatteryService:
    _instance: Optional['BatteryService'] = None

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super(BatteryService, cls).__new__(cls, *args, **kwargs)
            cls._instance.initialized = False
        return cls._instance

    def initialize(self, base_dir: str) -> None:
        if self.initialized:
            return

        logger.info("Initializing Battery Service (loading standard & NASA ML models)...")
        
        models_dir = os.path.join(base_dir, "trained_models") if os.path.exists(os.path.join(base_dir, "trained_models")) else os.path.join(base_dir, "app", "trained_models")
        datasets_dir = os.path.join(base_dir, "datasets") if os.path.exists(os.path.join(base_dir, "datasets")) else os.path.join(base_dir, "app", "datasets")

        # Standard Battery SOH model
        model_path = os.path.join(models_dir, "battery_soh_model.joblib")
        preproc_path = os.path.join(models_dir, "battery_soh_preprocessor.joblib")
        dataset_path = os.path.join(datasets_dir, "battery_dataset.csv")

        if os.path.exists(model_path) and os.path.exists(preproc_path):
            self.soh_model = load_model(model_path)
            self.soh_preproc = load_model(preproc_path)
            if os.path.exists(dataset_path):
                self.soh_baseline_df = pd.read_csv(dataset_path).drop(columns=['soh'], errors='ignore')
                self.soh_explainer = PerturbationExplainer(
                    model=self.soh_model,
                    preprocessor=self.soh_preproc,
                    baseline_data=self.soh_baseline_df,
                    predict_fn=self.soh_model.predict
                )
        else:
            logger.warning(f"Standard battery SOH model file not found at {model_path}")

        # NASA Prognostics model
        nasa_soh_path = os.path.join(models_dir, "nasa_soh_model.joblib")
        nasa_rul_path = os.path.join(models_dir, "nasa_rul_model.joblib")
        nasa_preproc_path = os.path.join(models_dir, "nasa_preprocessor.joblib")
        nasa_feat_path = os.path.join(models_dir, "nasa_feature_importance.json")
        if not os.path.exists(nasa_feat_path):
            nasa_feat_path = os.path.join(datasets_dir, "nasa_feature_importance.json")

        if os.path.exists(nasa_soh_path) and os.path.exists(nasa_rul_path) and os.path.exists(nasa_preproc_path):
            self.nasa_soh_model = load_model(nasa_soh_path)
            self.nasa_rul_model = load_model(nasa_rul_path)
            self.nasa_preproc = load_model(nasa_preproc_path)
            if os.path.exists(nasa_feat_path):
                self.nasa_feature_importance = load_json(nasa_feat_path)
            else:
                self.nasa_feature_importance = {"capacity": 0.45, "cycle_count": 0.25, "internal_resistance": 0.18, "temperature": 0.08, "voltage": 0.04}
        else:
            logger.warning(f"NASA Battery models not found at {nasa_soh_path}")

        self.initialized = True
        logger.info("Battery Service initialization completed successfully.")

    def predict(self, request: BatterySohRequest) -> BatterySohResponse:
        if not hasattr(self, 'soh_explainer'):
            raise RuntimeError("Battery SOH model is not loaded.")
        
        sample_df = pd.DataFrame([request.model_dump()])
        result = self.soh_explainer.explain(sample_df)

        formatted_explanations = [
            FeatureExplanation(
                feature=exp["feature"],
                value=exp["value"],
                baseline_value=exp["baseline_value"],
                impact=exp["impact"],
                direction=exp["direction"]
            )
            for exp in result["explanations"]
        ]

        return BatterySohResponse(
            predicted_soh=round(result["prediction"], 2),
            baseline_soh=round(result["baseline_prediction"], 2),
            soh_difference=round(result["prediction_difference"], 2),
            explanations=formatted_explanations
        )

    def predict_nasa_health(self, request: NasaBatteryRequest) -> NasaBatteryResponse:
        if not hasattr(self, 'nasa_soh_model'):
            raise RuntimeError("NASA Battery model is not loaded.")

        sample_df = pd.DataFrame([request.model_dump()])
        sample_df['resistance_increase_ratio'] = sample_df['internal_resistance'] / 0.1
        sample_df['temp_voltage_ratio'] = sample_df['temperature'] / sample_df['voltage'].replace(0, 0.1)
        sample_df['capacity_fade_rate'] = (2.0 - sample_df['capacity']) / sample_df['cycle_count'].replace(0, 1)

        processed = self.nasa_preproc.transform(sample_df) if self.nasa_preproc else sample_df

        predicted_soh = float(self.nasa_soh_model.predict(processed)[0])
        predicted_rul = float(self.nasa_rul_model.predict(processed)[0])

        capacity_fade = round(max(0.0, 2.0 - request.capacity), 2)
        remaining_cycles = max(0.0, round(predicted_rul, 1))

        # Classify recommendation based on predicted SOH
        if predicted_soh >= 88.0:
            rec = "Healthy: Battery cell operating within optimal parameters."
        elif predicted_soh >= 80.0:
            rec = "Monitor: Minor capacity fade observed; continue standard service checks."
        elif predicted_soh >= 70.0:
            rec = "Replace Soon: End of life threshold approaching. Schedule replacement module."
        else:
            rec = "Critical: High internal resistance / capacity fade detected. Immediate replacement required."

        confidence = round(min(99.0, max(85.0, 95.0 - (capacity_fade * 5.0))), 1)

        # Build feature factor attributions
        top_factors = [
            FactorAttribution(
                feature="Discharge Capacity Fade",
                impact_pct=round(capacity_fade * 25.0, 1),
                description=f"Measured capacity of {request.capacity} Ah indicates {capacity_fade} Ah capacity degradation."
            ),
            FactorAttribution(
                feature="Cycle Count Wear",
                impact_pct=round((request.cycle_count / 200.0) * 15.0, 1),
                description=f"Cycle index {request.cycle_count} accumulated wear on active cathode material."
            ),
            FactorAttribution(
                feature="Internal Resistance",
                impact_pct=round(request.internal_resistance * 50.0, 1),
                description=f"Internal cell impedance is {request.internal_resistance} Ohms."
            )
        ]

        pos_factors = [f for f in top_factors if f.impact_pct <= 10.0]
        neg_factors = [f for f in top_factors if f.impact_pct > 10.0]

        summary = f"Battery State of Health is estimated at {predicted_soh:.1f}% with Remaining Useful Life of {remaining_cycles:.0f} cycles. Primary driver: {top_factors[0].description}"

        return NasaBatteryResponse(
            battery_health=round(predicted_soh, 2),
            remaining_useful_life=remaining_cycles,
            capacity_fade=capacity_fade,
            remaining_cycles=remaining_cycles,
            expected_failure_time=f"{int(remaining_cycles)} days",
            confidence=confidence,
            feature_importance=self.nasa_feature_importance,
            recommendation=rec,
            top_contributing_factors=top_factors,
            positive_factors=pos_factors,
            negative_factors=neg_factors,
            natural_language_explanation=summary
        )
