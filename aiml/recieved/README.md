# Fleet Electrification AI Platform

This repository contains a production-ready, highly modular AI backend designed for fleet electrification analytics. It serves a variety of transparent rules-based engines alongside trained Machine Learning models (Random Forest) via a unified asynchronous FastAPI interface.

## Quick Start

### 1. Installation
Install the necessary Python dependencies:
```bash
pip install fastapi uvicorn pydantic scikit-learn joblib numpy openai
```

*(Optional for development/testing)*
```bash
pip install pytest httpx
```

### 2. Training the ML Models
Before running the API, you must train and serialize the Machine Learning models (Battery Health and Maintenance Risk Predictors).
```bash
python3 -m src.ml.train
```
This generates `.joblib` files in the `trained_models/` directory.

### 3. Running the Server
You must run the API as a module from the root directory to ensure imports map correctly.
*(If you want to use the Copilot RAG API, ensure you export your OpenAI API Key first: `export OPENAI_API_KEY="..."`)*

```bash
python3 -m src.api.main
```

The server will launch on `http://localhost:8000`.

## Documentation & API Endpoints
FastAPI auto-generates interactive OpenAPI Swagger documentation. Open your browser to:
**http://localhost:8000/docs**

Available Endpoints:
- `/api/readiness/score`: Explicit transparent rules for EV readiness.
- `/api/simulate`: What-if simulation calculations without retraining models.
- `/api/procurement/recommend`: Financial and ESG recommendation engine.
- `/api/battery/predict`: Random Forest Regressor predicting battery health based on operational parameters.
- `/api/maintenance/predict`: Random Forest Regressor predicting maintenance risk based on asset wear.
- `/api/chat`: In-memory RAG pipeline Copilot restricted solely to fleet data context.

## Testing
To run the automated test suite guaranteeing sub-500ms latency and integration correctness:
```bash
python3 -m pytest tests/
```
