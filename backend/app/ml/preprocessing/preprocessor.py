import pandas as pd
import numpy as np
from typing import Any

class DataPreprocessor:
    """
    DataPreprocessor class used by serialized ML model preprocessors (.joblib).
    """
    def __init__(self, *args, **kwargs):
        pass

    def transform(self, X: Any) -> Any:
        if hasattr(self, 'preprocessor') and self.preprocessor is not None:
            return self.preprocessor.transform(X)
        if hasattr(self, 'scaler') and self.scaler is not None:
            return self.scaler.transform(X)
        if hasattr(self, 'pipeline') and self.pipeline is not None:
            return self.pipeline.transform(X)
        return X

    def fit_transform(self, X: Any, y: Any = None) -> Any:
        return self.transform(X)
