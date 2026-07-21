import os
import datetime
import pandas as pd
from typing import Optional
from models.maintenance import (
    MaintenanceRequest, 
    MaintenanceResponse, 
    IntelligentMaintenanceRequest, 
    IntelligentMaintenanceResponse
)
from models.battery import FeatureExplanation
from ml.utils.helpers import load_model, logger
from ml.explainability.explainer import PerturbationExplainer

class MaintenanceService:
    _instance: Optional['MaintenanceService'] = None

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super(MaintenanceService, cls).__new__(cls, *args, **kwargs)
            cls._instance.initialized = False
        return cls._instance

    def initialize(self, base_dir: str) -> None:
        """
        Loads classification models and instantiates explainers in memory.
        """
        if self.initialized:
            return
        
        logger.info("Initializing Predictive Maintenance Service (loading models)...")
        model_path = os.path.join(base_dir, "trained_models", "maintenance_model.joblib")
        preprocessor_path = os.path.join(base_dir, "trained_models", "maintenance_preprocessor.joblib")
        data_path = os.path.join(base_dir, "datasets", "maintenance_dataset.csv")
        
        # Load standard maintenance model
        if not (os.path.exists(model_path) and os.path.exists(preprocessor_path)):
            raise FileNotFoundError("Maintenance model files are missing. Train the model first.")
            
        self.model = load_model(model_path)
        self.preprocessor = load_model(preprocessor_path)
        
        if not os.path.exists(data_path):
            raise FileNotFoundError(f"Maintenance dataset missing at {data_path}")
        self.baseline_data = pd.read_csv(data_path).drop(columns=['failure'], errors='ignore')
        
        self.explainer = PerturbationExplainer(
            model=self.model,
            preprocessor=self.preprocessor,
            baseline_data=self.baseline_data,
            predict_fn=self.model.predict_proba
        )
        
        # Load Intelligent Maintenance classifier model
        logger.info("Initializing Intelligent Maintenance classification models...")
        intel_model_path = os.path.join(base_dir, "trained_models", "intelligent_maintenance_model.joblib")
        intel_prep_path = os.path.join(base_dir, "trained_models", "intelligent_maintenance_preprocessor.joblib")
        intel_data_path = os.path.join(base_dir, "datasets", "intelligent_maintenance_dataset.csv")
        
        if not (os.path.exists(intel_model_path) and os.path.exists(intel_prep_path)):
            raise FileNotFoundError("Intelligent Maintenance model files are missing. Train them first.")
            
        self.intel_model = load_model(intel_model_path)
        self.intel_preprocessor = load_model(intel_prep_path)
        
        if not os.path.exists(intel_data_path):
            raise FileNotFoundError(f"Intelligent Maintenance dataset missing at {intel_data_path}")
            
        self.intel_baseline_data = pd.read_csv(intel_data_path).drop(columns=['failure'], errors='ignore')
        
        self.intel_explainer = PerturbationExplainer(
            model=self.intel_model,
            preprocessor=self.intel_preprocessor,
            baseline_data=self.intel_baseline_data,
            predict_fn=self.intel_model.predict_proba
        )
        
        self.initialized = True
        logger.info("Predictive Maintenance Service initialized successfully.")

    def predict(self, request: MaintenanceRequest) -> MaintenanceResponse:
        """
        Runs preprocessor, predicts failure probability (class 1), flags threshold, and explains predictions.
        """
        if not self.initialized:
            raise RuntimeError("Predictive Maintenance Service has not been initialized.")
            
        input_dict = request.model_dump()
        sample_df = pd.DataFrame([input_dict])
        
        explanation_result = self.explainer.explain(sample_df, target_class=1)
        
        prob_failure = explanation_result["prediction"]
        warning_threshold = 0.5
        failure_warning = 1 if prob_failure >= warning_threshold else 0
        
        return MaintenanceResponse(
            failure_probability=prob_failure,
            failure_warning=failure_warning,
            baseline_probability=explanation_result["baseline_prediction"],
            probability_difference=explanation_result["prediction_difference"],
            explanations=explanation_result["explanations"]
        )

    def predict_intelligent_maintenance(self, request: IntelligentMaintenanceRequest) -> IntelligentMaintenanceResponse:
        """
        Predicts fleet breakdown probability, projects calendar maintenance scheduling, and generates explanations.
        """
        if not self.initialized:
            raise RuntimeError("Predictive Maintenance Service has not been initialized.")
            
        input_dict = request.model_dump()
        sample_df = pd.DataFrame([input_dict])
        
        # Run XAI explainer on the intelligent classifier (evaluating probability of class 1)
        explanation_result = self.intel_explainer.explain(sample_df, target_class=1)
        prob_failure = explanation_result["prediction"]
        
        # Determine risk levels, calendar dates, and priority classes
        # Current local date from metadata is July 20, 2026
        current_date = datetime.date(2026, 7, 20)
        
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
        
        # Translate feature terms for structured explanations
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
            
            # Since standard perturbation output is on raw probability scale, convert to percentage points (e.g. +12%)
            impact_pct = round(impact * 100.0, 2)
            desc_name = FEAT_MAP.get(feat, feat)
            
            if impact_pct > 0.0:
                desc = f"{desc_name} (value: {val}) increased failure probability by +{impact_pct:.1f}%"
            elif impact_pct < 0.0:
                desc = f"{desc_name} (value: {val}) reduced failure probability by {abs(impact_pct):.1f}%"
            else:
                desc = f"{desc_name} (value: {val}) had no significant effect"
                
            formatted_explanations.append(FeatureExplanation(
                feature=desc_name,
                value=str(val),
                baseline_value=str(exp["baseline_value"]),
                impact=impact_pct,
                direction="increases" if impact_pct > 0 else ("decreases" if impact_pct < 0 else "neutral")
            ))
            
        # Compile natural language recommendations
        # Find the top drivers
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
