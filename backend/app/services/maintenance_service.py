import os
import sys
import datetime
import pandas as pd
from typing import Optional

import app.ml as ml
import app.ml.preprocessing as ml_prep
import app.ml.preprocessing.preprocessor as ml_prep_proc

sys.modules['ml'] = ml
sys.modules['ml.preprocessing'] = ml_prep
sys.modules['ml.preprocessing.preprocessor'] = ml_prep_proc
from app.models.maintenance import (
    MaintenanceRequest, 
    MaintenanceResponse, 
    IntelligentMaintenanceRequest, 
    IntelligentMaintenanceResponse
)
from app.models.battery import FeatureExplanation
from app.ml.utils.helpers import load_model, logger
from app.ml.explainability.explainer import PerturbationExplainer

class MaintenanceService:
    _instance: Optional['MaintenanceService'] = None

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super(MaintenanceService, cls).__new__(cls, *args, **kwargs)
            cls._instance.initialized = False
        return cls._instance

    def initialize(self, base_dir: str) -> None:
        if self.initialized:
            return
        
        logger.info("Initializing Predictive Maintenance Service (loading models)...")
        models_dir = os.path.join(base_dir, "trained_models") if os.path.exists(os.path.join(base_dir, "trained_models")) else os.path.join(base_dir, "app", "trained_models")
        datasets_dir = os.path.join(base_dir, "datasets") if os.path.exists(os.path.join(base_dir, "datasets")) else os.path.join(base_dir, "app", "datasets")

        model_path = os.path.join(models_dir, "maintenance_model.joblib")
        preprocessor_path = os.path.join(models_dir, "maintenance_preprocessor.joblib")
        data_path = os.path.join(datasets_dir, "maintenance_dataset.csv")
        
        if os.path.exists(model_path) and os.path.exists(preprocessor_path):
            self.model = load_model(model_path)
            self.preprocessor = load_model(preprocessor_path)
            if os.path.exists(data_path):
                self.baseline_data = pd.read_csv(data_path).drop(columns=['failure'], errors='ignore')
                self.explainer = PerturbationExplainer(
                    model=self.model,
                    preprocessor=self.preprocessor,
                    baseline_data=self.baseline_data,
                    predict_fn=getattr(self.model, 'predict_proba', self.model.predict)
                )
        
        # Load Intelligent Maintenance classifier model
        logger.info("Initializing Intelligent Maintenance classification models...")
        intel_model_path = os.path.join(models_dir, "intelligent_maintenance_model.joblib")
        intel_prep_path = os.path.join(models_dir, "intelligent_maintenance_preprocessor.joblib")
        intel_data_path = os.path.join(datasets_dir, "intelligent_maintenance_dataset.csv")
        
        if os.path.exists(intel_model_path) and os.path.exists(intel_prep_path):
            self.intel_model = load_model(intel_model_path)
            self.intel_preprocessor = load_model(intel_prep_path)
            if os.path.exists(intel_data_path):
                self.intel_baseline_data = pd.read_csv(intel_data_path).drop(columns=['failure'], errors='ignore')
                self.intel_explainer = PerturbationExplainer(
                    model=self.intel_model,
                    preprocessor=self.intel_preprocessor,
                    baseline_data=self.intel_baseline_data,
                    predict_fn=getattr(self.intel_model, 'predict_proba', self.intel_model.predict)
                )
        
        self.initialized = True
        logger.info("Predictive Maintenance Service initialized successfully.")

    def predict(self, request: MaintenanceRequest) -> MaintenanceResponse:
        if not hasattr(self, 'explainer'):
            raise RuntimeError("Predictive Maintenance Service models are not initialized.")
            
        input_dict = request.model_dump()
        sample_df = pd.DataFrame([input_dict])
        
        explanation_result = self.explainer.explain(sample_df)
        prob_failure = float(explanation_result["prediction"])
        if prob_failure > 1.0:
            prob_failure = round(prob_failure / 100.0, 4)
        failure_warning = 1 if prob_failure >= 0.5 else 0
        
        formatted_explanations = [
            FeatureExplanation(
                feature=exp["feature"],
                value=exp["value"],
                baseline_value=exp["baseline_value"],
                impact=exp["impact"],
                direction=exp["direction"]
            )
            for exp in explanation_result["explanations"]
        ]
        
        return MaintenanceResponse(
            failure_probability=prob_failure,
            failure_warning=failure_warning,
            baseline_probability=round(float(explanation_result["baseline_prediction"]) / (100.0 if explanation_result["baseline_prediction"] > 1.0 else 1.0), 4),
            probability_difference=round(float(explanation_result["prediction_difference"]) / (100.0 if abs(explanation_result["prediction_difference"]) > 1.0 else 1.0), 4),
            explanations=formatted_explanations
        )

    def predict_intelligent_maintenance(self, request: IntelligentMaintenanceRequest) -> IntelligentMaintenanceResponse:
        if not hasattr(self, 'intel_explainer'):
            raise RuntimeError("Intelligent Maintenance model is not initialized.")
            
        input_dict = request.model_dump()
        sample_df = pd.DataFrame([input_dict])
        
        explanation_result = self.intel_explainer.explain(sample_df, target_class=1)
        prob_failure = explanation_result["prediction"]
        
        current_date = datetime.date(2026, 7, 21)
        
        if prob_failure < 0.15:
            risk_level = "Low Risk"
            maintenance_priority = "Low"
            days_to_maintenance = 90
        elif prob_failure < 0.40:
            risk_level = "Medium Risk"
            maintenance_priority = "Medium"
            days_to_maintenance = 30
        elif prob_failure < 0.75:
            risk_level = "High Risk"
            maintenance_priority = "High"
            days_to_maintenance = 7
        else:
            risk_level = "Critical"
            maintenance_priority = "Immediate"
            days_to_maintenance = 1
            
        next_maintenance_date = (current_date + datetime.timedelta(days=days_to_maintenance)).strftime("%Y-%m-%d")
        
        FEAT_MAP = {
            "mileage": "Odometer mileage",
            "vehicle_age": "Vehicle age",
            "engine_hours": "Engine operating hours",
            "battery_health": "Battery health degradation",
            "maintenance_frequency": "Maintenance service frequency",
            "downtime": "Historical downtime hours",
            "operating_conditions": "Operating environment stress"
        }
        
        formatted_explanations = []
        for exp in explanation_result["explanations"]:
            feat = exp["feature"]
            val = exp["value"]
            impact = exp["impact"]
            impact_pct = round(impact * 100.0, 2)
            desc_name = FEAT_MAP.get(feat, feat)
            
            formatted_explanations.append(FeatureExplanation(
                feature=desc_name,
                value=str(val),
                baseline_value=str(exp["baseline_value"]),
                impact=impact_pct,
                direction="increases" if impact_pct > 0 else ("decreases" if impact_pct < 0 else "neutral")
            ))
            
        top_increases = [exp for exp in formatted_explanations if exp.impact > 0]
        top_increases.sort(key=lambda x: x.impact, reverse=True)
        
        if risk_level == "Critical":
            driver_str = f" due to extreme {top_increases[0].feature.lower()} impact" if top_increases else ""
            rec = f"Critical breakdown risk detected! Dispatch vehicle for immediate garage inspection within 24 hours{driver_str}."
        elif risk_level == "High Risk":
            driver_str = f" primarily driven by high {top_increases[0].feature.lower()}" if top_increases else ""
            rec = f"High failure risk alert. Schedule workshop maintenance check within 7 days{driver_str}."
        elif risk_level == "Medium Risk":
            driver_str = f" to monitor {top_increases[0].feature.lower()}" if top_increases else ""
            rec = f"Schedule routine PM inspection within 30 days{driver_str}."
        else:
            rec = "Vehicle operating parameters are healthy. Schedule standard maintenance in 90 days."
            
        return IntelligentMaintenanceResponse(
            failure_probability=round(prob_failure, 4),
            risk_level=risk_level,
            next_maintenance_date=next_maintenance_date,
            maintenance_priority=maintenance_priority,
            recommendation=rec,
            explanations=formatted_explanations
        )
