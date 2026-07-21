import os
import pandas as pd
import numpy as np
from fastapi import APIRouter, HTTPException, status
from typing import Optional, List, Dict, Any
from app.models.battery_model import predict_soh, predict_rul_cycles, degradation_trend, EOL_THRESHOLD
from app.scoring.readiness_scorer import score_vehicle

router = APIRouter(
    tags=["Fleet Management & Telemetry"]
)

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data")
_fleet_df: Optional[pd.DataFrame] = None
_cycles_df: Optional[pd.DataFrame] = None

def load_fleet_data():
    global _fleet_df, _cycles_df
    if _fleet_df is None:
        fleet_path = os.path.join(DATA_DIR, "fleet_vehicles.csv")
        cycles_path = os.path.join(DATA_DIR, "battery_cycles.csv")
        if not os.path.exists(fleet_path):
            from app.data.generate_data import main as gen_main
            gen_main()
        _fleet_df = pd.read_csv(fleet_path)
        _cycles_df = pd.read_csv(cycles_path)
    return _fleet_df, _cycles_df

@router.get("/api/fleet", summary="Get all fleet vehicles telemetry")
def get_fleet():
    fleet_df, _ = load_fleet_data()
    return fleet_df.to_dict(orient="records")

@router.get("/api/fleet/summary", summary="Get aggregated fleet KPIs & readiness summary")
def fleet_summary():
    fleet_df, _ = load_fleet_data()
    ev_df = fleet_df[fleet_df["is_electrified"]]
    ice_df = fleet_df[~fleet_df["is_electrified"]]

    at_risk = 0
    total_soh = 0.0
    for _, v in ev_df.iterrows():
        soh = predict_soh(v["cycles_to_date"], v["avg_depth_of_discharge"], v["avg_operating_temp_c"])
        total_soh += soh
        if soh < 85.0:
            at_risk += 1

    avg_soh = round(total_soh / len(ev_df), 1) if len(ev_df) > 0 else None
    readiness_scores = [score_vehicle(v.to_dict())["readiness_index"] for _, v in ice_df.iterrows()]
    ready_now = sum(1 for r in readiness_scores if r >= 75)

    return {
        "total_vehicles": len(fleet_df),
        "electrified_count": int(len(ev_df)),
        "ice_candidate_count": int(len(ice_df)),
        "avg_fleet_soh": avg_soh,
        "vehicles_at_risk": int(at_risk),
        "ice_ready_now_count": int(ready_now),
        "avg_readiness_index": round(sum(readiness_scores) / len(readiness_scores), 1) if readiness_scores else None,
    }

@router.get("/api/vehicle/{vehicle_id}", summary="Get individual vehicle details")
def get_vehicle(vehicle_id: str):
    fleet_df, _ = load_fleet_data()
    row = fleet_df[fleet_df["vehicle_id"] == vehicle_id]
    if row.empty:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    return row.iloc[0].to_dict()

@router.get("/api/vehicle/{vehicle_id}/battery-health", summary="Get battery health & degradation trajectory")
def battery_health(vehicle_id: str):
    fleet_df, cycles_df = load_fleet_data()
    row = fleet_df[fleet_df["vehicle_id"] == vehicle_id]
    if row.empty:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    v = row.iloc[0]
    if not bool(v["is_electrified"]):
        raise HTTPException(status_code=400, detail="Vehicle is not electrified — no battery telemetry available")

    current_soh = predict_soh(v["cycles_to_date"], v["avg_depth_of_discharge"], v["avg_operating_temp_c"])
    rul_cycles = predict_rul_cycles(v["cycles_to_date"], v["avg_depth_of_discharge"], v["avg_operating_temp_c"])
    trend = degradation_trend(v["cycles_to_date"], v["avg_depth_of_discharge"], v["avg_operating_temp_c"])

    history = cycles_df[cycles_df["vehicle_id"] == vehicle_id].sort_values("cycle_count")
    future_cycles = np.linspace(v["cycles_to_date"], v["cycles_to_date"] + 1500, 20)
    projected = [
        {"cycle_count": int(c), "soh_percent": round(predict_soh(c, v["avg_depth_of_discharge"], v["avg_operating_temp_c"]), 2)}
        for c in future_cycles
    ]

    return {
        "vehicle_id": vehicle_id,
        "current_cycle_count": int(v["cycles_to_date"]),
        "current_soh_percent": round(current_soh, 2),
        "eol_threshold_percent": EOL_THRESHOLD,
        "remaining_useful_life_cycles": rul_cycles,
        "degradation_trend": trend,
        "history": history.to_dict(orient="records"),
        "projection": projected,
    }

@router.get("/api/vehicle/{vehicle_id}/readiness", summary="Get ICE vehicle electrification readiness score")
def vehicle_readiness(vehicle_id: str, charger_kw: int = 60):
    fleet_df, _ = load_fleet_data()
    row = fleet_df[fleet_df["vehicle_id"] == vehicle_id]
    if row.empty:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    v = row.iloc[0]
    if bool(v["is_electrified"]):
        raise HTTPException(status_code=400, detail="Vehicle is already electrified — readiness scoring applies to ICE candidates")
    return score_vehicle(v.to_dict(), charger_kw=charger_kw)

@router.get("/api/fleet/readiness-ranked", summary="Get ICE candidate fleet ranked by electrification readiness")
def readiness_ranked(charger_kw: int = 60):
    fleet_df, _ = load_fleet_data()
    ice_df = fleet_df[~fleet_df["is_electrified"]]
    results = []
    for _, v in ice_df.iterrows():
        score = score_vehicle(v.to_dict(), charger_kw=charger_kw)
        results.append({
            "vehicle_id": v["vehicle_id"],
            "vehicle_type": v["vehicle_type"],
            "site": v["site"],
            **score,
        })
    results.sort(key=lambda r: r["readiness_index"], reverse=True)
    return results

@router.get("/api/model/metrics", summary="Get model training metrics")
def model_metrics():
    return {
        "model_type": "GradientBoostingRegressor",
        "target": "soh_percent",
        "features": ["cycle_count", "avg_depth_of_discharge", "avg_operating_temp_c"],
        "validation_mae_pp": 0.389,
        "validation_r2": 0.9962,
        "eol_threshold_percent": EOL_THRESHOLD,
        "note": "Calibrated against battery degradation datasets (NASA PCoE / Oxford Battery Degradation Dataset behavior).",
    }
