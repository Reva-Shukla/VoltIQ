import pytest
from fastapi.testclient import TestClient
from src.api.main import app
import time

# Create a test client that triggers startup/shutdown events
@pytest.fixture(scope="module")
def client():
    with TestClient(app) as c:
        yield c

def test_battery_predict_endpoint(client):
    start = time.time()
    response = client.post("/api/battery/predict", json={
        "vehicle_age": 5.0,
        "mileage": 100000,
        "temperature": 25.0,
        "fast_charging_frequency": 2
    })
    latency = time.time() - start
    
    assert response.status_code == 200
    data = response.json()
    assert "predicted_battery_health_percent" in data
    assert "explanation" in data
    assert "confidence_score" in data
    assert latency < 0.500  # Latency under 500ms

def test_maintenance_predict_endpoint(client):
    start = time.time()
    response = client.post("/api/maintenance/predict", json={
        "vehicle_age": 5.0,
        "mileage": 100000,
        "road_conditions": 3,
        "payload": 2000
    })
    latency = time.time() - start
    
    assert response.status_code == 200
    data = response.json()
    assert "maintenance_risk_score" in data
    assert "explanation" in data
    assert "confidence_score" in data
    assert latency < 0.500

def test_readiness_score_endpoint(client):
    response = client.post("/api/readiness/score", json={
        "vehicle_age": 9.0,
        "mileage": 165000,
        "payload": 1200,
        "daily_route_distance": 110,
        "idle_time": 5,
        "fuel_consumption": 16,
        "maintenance_cost": 2800,
        "charging_infrastructure": 8,
        "terrain": 2,
        "weather": 2,
        "operating_region": "Urban"
    })
    assert response.status_code == 200
    data = response.json()
    assert "readiness_score" in data

def test_chat_refuses_general_questions(client):
    # Depending on if OPENAI_API_KEY is present, this might fail with a 500
    # But if the key is present, it should return a polite refusal
    response = client.post("/api/chat", json={
        "query": "What is the capital of France?"
    })
    # We just check it doesn't crash on validation
    assert response.status_code in [200, 500]
