# Architecture Diagram

```mermaid
graph TD
    Client(Client Apps / Hackathon UI)
    
    subapi[FastAPI Routing Layer\nsrc/api/main.py]
    Client -->|HTTP POST JSON| subapi
    
    subgraph FastAPI Application
        subapi
        Schema[Pydantic Models\nsrc/models/schemas.py]
        Logger[Logging Utility\nsrc/utils/logger.py]
        
        subapi <--> Schema
        subapi <--> Logger
        
        subgraph ML Pipeline
            BM[Battery Predictor\nRandom Forest Regressor]
            MM[Maintenance Predictor\nRandom Forest Regressor]
        end
        
        subgraph AI Services
            RE[Readiness Engine]
            SE[Simulation Engine]
            PE[Procurement Engine]
            RC[RAG Copilot]
        end
        
        subapi -->|In-memory| BM
        subapi -->|In-memory| MM
        
        subapi --> RE
        subapi --> SE
        subapi --> PE
        subapi --> RC
    end
    
    DB[(Trained Models\ntrained_models/*.joblib)]
    DB -->|Loaded at Startup| ML Pipeline
```

## Data Flow
1. **Startup Event**: `main.py` reads `battery_model.joblib` and `maintenance_model.joblib` from disk into memory. It also initializes the Readiness, Simulation, and Procurement engines.
2. **Request Validation**: Incoming requests are captured by Pydantic in `schemas.py`, rejecting malformed JSON instantly.
3. **Execution**: 
   - Requests routed to the **ML Pipeline** execute inference natively on the pre-loaded Random Forests, guaranteeing sub-500ms latency.
   - Requests routed to **AI Services** evaluate transparent logic or query OpenAI (for Copilot).
4. **Response**: Outputs are serialized back to standardized JSON and logged via `logger.py`.
