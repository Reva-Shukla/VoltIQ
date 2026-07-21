import os
import sys
import pandas as pd
from typing import Optional, Dict, List

import app.ml as ml
import app.ml.preprocessing as ml_prep
import app.ml.preprocessing.preprocessor as ml_prep_proc

sys.modules['ml'] = ml
sys.modules['ml.preprocessing'] = ml_prep
sys.modules['ml.preprocessing.preprocessor'] = ml_prep_proc
from app.models.readiness import (
    ReadinessRequest, 
    ReadinessResponse, 
    RuleBasedReadinessRequest, 
    RuleBasedReadinessResponse, 
    ReadinessFactorScore
)
from app.models.battery import FeatureExplanation
from app.ml.utils.helpers import load_model, logger
from app.ml.explainability.explainer import PerturbationExplainer

class ReadinessService:
    _instance: Optional['ReadinessService'] = None

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super(ReadinessService, cls).__new__(cls, *args, **kwargs)
            cls._instance.initialized = False
        return cls._instance

    def initialize(self, base_dir: str) -> None:
        if self.initialized:
            return
        
        logger.info("Initializing Electrification Readiness Service (loading models)...")
        models_dir = os.path.join(base_dir, "trained_models") if os.path.exists(os.path.join(base_dir, "trained_models")) else os.path.join(base_dir, "app", "trained_models")
        datasets_dir = os.path.join(base_dir, "datasets") if os.path.exists(os.path.join(base_dir, "datasets")) else os.path.join(base_dir, "app", "datasets")

        model_path = os.path.join(models_dir, "readiness_model.joblib")
        preprocessor_path = os.path.join(models_dir, "readiness_preprocessor.joblib")
        data_path = os.path.join(datasets_dir, "readiness_dataset.csv")
        
        if os.path.exists(model_path) and os.path.exists(preprocessor_path):
            self.model = load_model(model_path)
            self.preprocessor = load_model(preprocessor_path)
            if os.path.exists(data_path):
                self.baseline_data = pd.read_csv(data_path).drop(columns=['suitability_score'], errors='ignore')
                self.explainer = PerturbationExplainer(
                    model=self.model,
                    preprocessor=self.preprocessor,
                    baseline_data=self.baseline_data,
                    predict_fn=self.model.predict
                )
        self.initialized = True
        logger.info("Electrification Readiness Service initialized successfully.")

    def calculate_savings(self, request: ReadinessRequest) -> float:
        fuel_cost = request.annual_fuel_cost_usd
        maint_cost = request.annual_maintenance_cost_usd
        route = request.route_type
        
        if route == 'urban':
            ev_fuel_factor = 0.22
        elif route == 'mixed':
            ev_fuel_factor = 0.28
        else:
            ev_fuel_factor = 0.36
            
        ev_maint_factor = 0.45 
        ev_annual_fuel_cost = fuel_cost * ev_fuel_factor
        ev_annual_maint_cost = maint_cost * ev_maint_factor
        savings = (fuel_cost - ev_annual_fuel_cost) + (maint_cost - ev_annual_maint_cost)
        return round(float(savings), 2)

    def predict(self, request: ReadinessRequest) -> ReadinessResponse:
        if not hasattr(self, 'explainer'):
            raise RuntimeError("Electrification Readiness Service model is not initialized.")
            
        input_dict = request.model_dump()
        sample_df = pd.DataFrame([input_dict])
        
        explanation_result = self.explainer.explain(sample_df)
        estimated_savings = self.calculate_savings(request)
        
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
        
        return ReadinessResponse(
            predicted_suitability_score=explanation_result["prediction"],
            baseline_suitability_score=explanation_result["baseline_prediction"],
            suitability_difference=explanation_result["prediction_difference"],
            estimated_annual_savings_usd=estimated_savings,
            explanations=formatted_explanations
        )

    def evaluate_rule_based_readiness(self, request: RuleBasedReadinessRequest) -> RuleBasedReadinessResponse:
        default_weights = {
            "daily_distance": 0.30,
            "charging_infrastructure": 0.20,
            "economic_savings": 0.20,
            "operating_environment": 0.15,
            "asset_lifecycle": 0.15
        }
        
        user_weights = request.weights or {}
        merged_weights = {k: float(user_weights.get(k, default_weights[k])) for k in default_weights}
        total_w = sum(merged_weights.values())
        if total_w <= 0.0:
            merged_weights = default_weights
            total_w = 1.0
        normalized_weights = {k: v / total_w for k, v in merged_weights.items()}
        
        factor_breakdown: List[ReadinessFactorScore] = []
        
        # 1. Daily Distance Suitability
        dist = request.daily_route_distance
        if dist <= 140.0:
            dist_score = 100.0
            dist_expl = f"Daily route distance of {dist:.1f} km is well within standard EV range, requiring no mid-day charging."
        elif dist <= 260.0:
            dist_score = 80.0
            dist_expl = f"Daily route distance of {dist:.1f} km is suitable, but may require overnight depot chargers."
        elif dist <= 360.0:
            dist_score = 50.0
            dist_expl = f"Daily route distance of {dist:.1f} km is close to typical EV range limits, requiring careful route scheduling."
        else:
            dist_score = 10.0
            dist_expl = f"Daily route distance of {dist:.1f} km exceeds standard single-charge EV range, posing range risks."
            
        w_dist = normalized_weights["daily_distance"]
        factor_breakdown.append(ReadinessFactorScore(
            factor="Daily Distance Suitability",
            score=dist_score,
            weight=w_dist,
            contribution=round(dist_score * w_dist, 2),
            explanation=dist_expl
        ))
        
        # 2. Charging Infrastructure Availability
        infra = request.charging_infrastructure
        if infra == "Available":
            infra_score = 100.0
            infra_expl = "Grid charging infrastructure is already active and available."
        elif infra == "Planned":
            infra_score = 60.0
            infra_expl = "Grid charging infrastructure is planned or scheduled, reducing long-term deployment barriers."
        else:
            infra_score = 10.0
            infra_expl = "No charging infrastructure available, representing a high deployment barrier."
            
        w_infra = normalized_weights["charging_infrastructure"]
        factor_breakdown.append(ReadinessFactorScore(
            factor="Charging Infrastructure Availability",
            score=infra_score,
            weight=w_infra,
            contribution=round(infra_score * w_infra, 2),
            explanation=infra_expl
        ))
        
        # 3. Economic Potential / Savings
        fuel = request.fuel_consumption
        maint = request.maintenance_cost
        
        fuel_score = 100.0 if fuel > 16.0 else (75.0 if fuel >= 11.0 else 40.0)
        maint_score = 100.0 if maint > 4000.0 else (70.0 if maint >= 1800.0 else 40.0)
        econ_score = (fuel_score * 0.6) + (maint_score * 0.4)
        econ_expl = f"High potential savings due to fuel consumption of {fuel:.1f} L/100km and annual maintenance cost of ${maint:.2f}."
        
        w_econ = normalized_weights["economic_savings"]
        factor_breakdown.append(ReadinessFactorScore(
            factor="Economic Savings Potential",
            score=econ_score,
            weight=w_econ,
            contribution=round(econ_score * w_econ, 2),
            explanation=econ_expl
        ))
        
        # 4. Operating Environment Stress
        region = request.operating_region
        terrain = request.terrain
        weather = request.weather
        
        region_base = 100.0 if region == 'Urban' else (80.0 if region == 'Mixed' else 40.0)
        terrain_penalty = 1.0 if terrain == 'Flat' else (0.8 if terrain == 'Hilly' else 0.5)
        weather_penalty = 1.0 if weather == 'Mild' else (0.75 if weather == 'Cold' else 0.5)
        env_score = region_base * terrain_penalty * weather_penalty
        
        env_expl = f"Operating region is {region} (base score: {region_base}), adjusted for terrain ({terrain}) and weather ({weather}) factors."
        
        w_env = normalized_weights["operating_environment"]
        factor_breakdown.append(ReadinessFactorScore(
            factor="Operating Environment Stress",
            score=env_score,
            weight=w_env,
            contribution=round(env_score * w_env, 2),
            explanation=env_expl
        ))
        
        # 5. Asset Lifecycle / Replacement Priority
        age = request.vehicle_age
        mileage = request.mileage
        
        if age > 7.0 or mileage > 220000.0:
            lifecycle_score = 100.0
            lifecycle_expl = "Asset is near end of lifecycle; high priority for replacement."
        elif age >= 4.0 or mileage >= 100000.0:
            lifecycle_score = 75.0
            lifecycle_expl = "Asset is mid-lifecycle; candidate for scheduled transition."
        else:
            lifecycle_score = 35.0
            lifecycle_expl = "Asset is relatively new; low capital replacement urgency."
            
        w_life = normalized_weights["asset_lifecycle"]
        factor_breakdown.append(ReadinessFactorScore(
            factor="Asset Replacement Priority",
            score=lifecycle_score,
            weight=w_life,
            contribution=round(lifecycle_score * w_life, 2),
            explanation=lifecycle_expl
        ))
        
        readiness_score = sum(f.contribution for f in factor_breakdown)
        readiness_score = round(max(0.0, min(100.0, readiness_score)), 1)
        
        if readiness_score >= 80.0:
            category = "Ready"
        elif readiness_score >= 60.0:
            category = "Moderately Ready"
        elif readiness_score >= 40.0:
            category = "Needs Review"
        else:
            category = "Not Recommended"
            
        top_positive = [f for f in factor_breakdown if f.score >= 70.0]
        top_positive.sort(key=lambda x: x.contribution, reverse=True)
        top_negative = [f for f in factor_breakdown if f.score < 50.0]
        top_negative.sort(key=lambda x: x.contribution)
        
        narrative_parts = [
            f"Vehicle achieves a readiness score of {readiness_score:.1f}/100, placing it in the '{category}' category."
        ]
        
        if top_positive:
            pos_phrases = [f"{f.factor.lower()} (+{f.contribution:.1f} pts)" for f in top_positive[:2]]
            narrative_parts.append("Positive drivers include " + " and ".join(pos_phrases) + ".")
            
        if top_negative:
            neg_phrases = [f"{f.factor.lower()} ({f.contribution:.1f} pts)" for f in top_negative[:2]]
            narrative_parts.append("Suitability barriers are " + " and ".join(neg_phrases) + ".")
            
        explanation = " ".join(narrative_parts)
        
        return RuleBasedReadinessResponse(
            readiness_score=readiness_score,
            category=category,
            explanation=explanation,
            factor_breakdown=factor_breakdown
        )
