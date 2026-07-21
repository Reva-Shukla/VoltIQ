import os
import joblib
import numpy as np

def test_models_exist():
    assert os.path.exists("trained_models/battery_model.joblib")
    assert os.path.exists("trained_models/maintenance_model.joblib")

def test_battery_model_prediction():
    model = joblib.load("trained_models/battery_model.joblib")
    # Features: age, mileage, temperature, fast_charging_freq
    features = np.array([[5.0, 100000, 25.0, 2]])
    prediction = model.predict(features)[0]
    assert 0 <= prediction <= 100

def test_maintenance_model_prediction():
    model = joblib.load("trained_models/maintenance_model.joblib")
    # Features: age, mileage, road_conditions, payload
    features = np.array([[5.0, 100000, 3, 2000]])
    prediction = model.predict(features)[0]
    assert 0 <= prediction <= 100
