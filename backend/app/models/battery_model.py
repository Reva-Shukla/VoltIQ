"""
Battery Asset Performance Management (APM) model.

Trains a gradient-boosted regressor to predict State-of-Health (SoH %) from
(cycle_count, avg_depth_of_discharge, avg_operating_temp_c), then derives:
  - Remaining Useful Life (RUL) in cycles until SoH crosses the 80% EOL
    threshold (industry-standard end-of-life definition for traction packs)
  - A degradation trend classification (Stable / Accelerating / Critical)
    based on the second derivative of the fitted curve near the current
    operating point.

This mirrors how APM is done for rotating industrial machinery (vibration
trend -> RUL), applied to a battery asset instead.
"""

import os
import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, r2_score

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data")
MODEL_PATH = os.path.join(os.path.dirname(__file__), "soh_model.joblib")

EOL_THRESHOLD = 80.0  # % SoH considered end-of-life for industrial traction packs
FEATURES = ["cycle_count", "avg_depth_of_discharge", "avg_operating_temp_c"]


def train():
    df = pd.read_csv(os.path.join(DATA_DIR, "battery_training_corpus.csv"))
    X = df[FEATURES]
    y = df["soh_percent"]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    model = GradientBoostingRegressor(
        n_estimators=250, max_depth=3, learning_rate=0.05, random_state=42
    )
    model.fit(X_train, y_train)

    preds = model.predict(X_test)
    mae = mean_absolute_error(y_test, preds)
    r2 = r2_score(y_test, preds)
    print(f"Validation MAE: {mae:.3f} pp SoH | R^2: {r2:.4f}")

    joblib.dump(model, MODEL_PATH)
    return model, {"mae": round(mae, 3), "r2": round(r2, 4)}


def _load_model():
    if not os.path.exists(MODEL_PATH):
        train()
    return joblib.load(MODEL_PATH)


_MODEL = None


def get_model():
    global _MODEL
    if _MODEL is None:
        _MODEL = _load_model()
    return _MODEL


def predict_soh(cycle_count, avg_dod, avg_temp_c):
    model = get_model()
    X = pd.DataFrame([{
        "cycle_count": cycle_count,
        "avg_depth_of_discharge": avg_dod,
        "avg_operating_temp_c": avg_temp_c,
    }])
    return float(model.predict(X)[0])


def predict_rul_cycles(current_cycle, avg_dod, avg_temp_c, max_search=6000, step=10):
    """
    Search forward along the predicted degradation curve to find the cycle
    count at which SoH crosses the EOL threshold, then return cycles
    remaining from today.
    """
    model = get_model()
    cycles = np.arange(current_cycle, current_cycle + max_search, step)
    X = pd.DataFrame({
        "cycle_count": cycles,
        "avg_depth_of_discharge": [avg_dod] * len(cycles),
        "avg_operating_temp_c": [avg_temp_c] * len(cycles),
    })
    preds = model.predict(X)
    below = np.where(preds <= EOL_THRESHOLD)[0]
    if len(below) == 0:
        return None  # doesn't reach EOL within search horizon
    eol_cycle = cycles[below[0]]
    return int(eol_cycle - current_cycle)


def degradation_trend(current_cycle, avg_dod, avg_temp_c, window=200):
    """
    Classify degradation trend by comparing fade rate over the last `window`
    cycles vs. the fade rate over the window before that (acceleration
    signal), the same logic used for vibration-trend RUL in rotating
    machinery APM.
    """
    c0 = max(0, current_cycle - 2 * window)
    c1 = max(0, current_cycle - window)
    c2 = current_cycle

    s0 = predict_soh(c0, avg_dod, avg_temp_c)
    s1 = predict_soh(c1, avg_dod, avg_temp_c)
    s2 = predict_soh(c2, avg_dod, avg_temp_c)

    rate_recent = (s1 - s2)
    rate_prior = (s0 - s1)

    if rate_prior <= 0:
        ratio = 1.0
    else:
        ratio = rate_recent / rate_prior

    if ratio < 1.15:
        return "Stable"
    elif ratio < 1.6:
        return "Accelerating"
    else:
        return "Critical"


if __name__ == "__main__":
    train()
