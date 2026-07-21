import numpy as np
import pandas as pd
from typing import Any, Dict, List, Callable, Optional

def _to_native(val: Any) -> Any:
    if hasattr(val, 'item'):
        return val.item()
    if isinstance(val, (np.integer, np.int64, np.int32)):
        return int(val)
    if isinstance(val, (np.floating, np.float64, np.float32)):
        return float(val)
    return val

class PerturbationExplainer:
    """
    Explainability engine that calculates feature attributions via local perturbation
    against dataset baseline means.
    """
    def __init__(
        self, 
        model: Any, 
        preprocessor: Any, 
        baseline_data: pd.DataFrame, 
        predict_fn: Optional[Callable] = None
    ):
        self.model = model
        self.preprocessor = preprocessor
        self.baseline_data = baseline_data
        
        self.numeric_cols = baseline_data.select_dtypes(include=[np.number]).columns.tolist()
        self.baseline_means = baseline_data[self.numeric_cols].mean().to_dict()
        
        if predict_fn is not None:
            self.predict_fn = predict_fn
        else:
            self.predict_fn = self.model.predict

    def _get_pred(self, df: pd.DataFrame, target_class: Optional[int] = None) -> float:
        processed = self.preprocessor.transform(df) if self.preprocessor else df
        res = self.predict_fn(processed)
        if target_class is not None and len(res.shape) > 1 and res.shape[1] > target_class:
            val = float(res[0][target_class])
        elif isinstance(res, np.ndarray) and res.ndim > 1:
            val = float(res[0][0])
        else:
            val = float(res[0])
        return val

    def explain(self, sample_df: pd.DataFrame, target_class: Optional[int] = None) -> Dict[str, Any]:
        baseline_df = sample_df.copy()
        for col in self.numeric_cols:
            if col in baseline_df.columns:
                baseline_df[col] = self.baseline_means.get(col, baseline_df[col].iloc[0])
                
        actual_pred = self._get_pred(sample_df, target_class)
        baseline_pred = self._get_pred(baseline_df, target_class)
        pred_diff = actual_pred - baseline_pred
        
        explanations: List[Dict[str, Any]] = []
        
        for col in sample_df.columns:
            if col not in self.numeric_cols:
                continue
                
            perturbed_df = sample_df.copy()
            perturbed_df[col] = self.baseline_means.get(col, sample_df[col].iloc[0])
            perturbed_pred = self._get_pred(perturbed_df, target_class)
            
            impact = actual_pred - perturbed_pred
            direction = "increases" if impact > 0.001 else ("decreases" if impact < -0.001 else "neutral")
            
            explanations.append({
                "feature": str(col),
                "value": _to_native(sample_df[col].iloc[0]),
                "baseline_value": round(float(self.baseline_means.get(col, 0.0)), 2),
                "impact": round(float(impact), 4),
                "direction": direction
            })
            
        explanations.sort(key=lambda x: abs(x["impact"]), reverse=True)
        
        return {
            "prediction": round(float(actual_pred), 4),
            "baseline_prediction": round(float(baseline_pred), 4),
            "prediction_difference": round(float(pred_diff), 4),
            "explanations": explanations
        }
