"""
Synthetic data generator for the Fleet Electrification Readiness & Battery
Intelligence Platform.

We generate two datasets:
  1. fleet_vehicles.csv   - static + operational profile of each vehicle
                            (works for both ICE vehicles being evaluated for
                            EV conversion, and vehicles already electrified)
  2. battery_cycles.csv   - time-series charge/discharge cycle log per
                            electrified vehicle, used to train the battery
                            State-of-Health (SoH) / Remaining-Useful-Life
                            (RUL) model.

The degradation curve is modeled on patterns widely reported in Li-ion
battery aging literature (e.g. NASA PCoE battery dataset, Oxford Battery
Degradation Dataset): SoH decays roughly exponentially with cycle count,
accelerated by higher average depth-of-discharge (DoD) and higher operating
temperature, with realistic sensor noise layered on top.
"""

import numpy as np
import pandas as pd
import os

RNG = np.random.default_rng(42)

OUTPUT_DIR = os.path.dirname(__file__)

VEHICLE_TYPES = [
    ("Mining Haul Truck", 220, 350, 0.85),      # (type, base_capacity_kwh, daily_km, base_dod)
    ("Intra-Plant Forklift", 40, 60, 0.55),
    ("Freight Truck", 350, 420, 0.70),
    ("Construction Loader", 150, 90, 0.65),
    ("Logistics Van", 75, 180, 0.50),
]

N_VEHICLES = 40
N_ICE_CANDIDATES = 15  # vehicles not yet electrified, being evaluated

FLEET_SITES = ["Odisha Mine Site", "Chennai Plant", "Pune DC", "Bhilai Yard", "Nagpur Hub"]


def generate_fleet_vehicles():
    rows = []
    for i in range(N_VEHICLES):
        vtype, base_cap, base_km, base_dod = VEHICLE_TYPES[i % len(VEHICLE_TYPES)]
        is_ev = i >= N_ICE_CANDIDATES
        daily_distance = max(15, RNG.normal(base_km, base_km * 0.18))
        payload_ratio = np.clip(RNG.normal(0.7, 0.15), 0.2, 1.0)
        dwell_hours = np.clip(RNG.normal(8, 3), 1, 18)  # hours parked/available to charge
        duty_predictability = np.clip(RNG.normal(0.75, 0.15), 0.2, 0.99)  # route repeatability
        avg_dod = np.clip(RNG.normal(base_dod, 0.08), 0.3, 0.95)
        avg_temp_c = RNG.normal(32, 6) if "Mining" in vtype or "Construction" in vtype else RNG.normal(27, 5)
        cycles_to_date = int(max(0, RNG.normal(650, 300))) if is_ev else 0

        rows.append({
            "vehicle_id": f"VEH-{1000+i}",
            "vehicle_type": vtype,
            "site": RNG.choice(FLEET_SITES),
            "is_electrified": is_ev,
            "battery_capacity_kwh": round(base_cap, 1),
            "daily_distance_km": round(daily_distance, 1),
            "payload_ratio": round(payload_ratio, 2),
            "dwell_hours_available": round(dwell_hours, 1),
            "duty_predictability": round(duty_predictability, 2),
            "avg_depth_of_discharge": round(avg_dod, 2),
            "avg_operating_temp_c": round(avg_temp_c, 1),
            "cycles_to_date": cycles_to_date,
            "commissioned_days_ago": int(max(1, RNG.normal(500, 250))) if is_ev else None,
        })
    return pd.DataFrame(rows)


def soh_curve(cycle_count, avg_dod, avg_temp_c, noise=True):
    """
    Physics-informed SoH degradation curve.
    SoH(n) = 100 - a * n^b, accelerated by DoD and temperature stress factors.
    Loosely calibrated so that ~1000 cycles at moderate stress -> ~80% SoH
    (the conventional EOL threshold for automotive/industrial packs).
    """
    dod_stress = 0.6 + 1.1 * avg_dod          # higher DoD -> faster fade
    temp_stress = np.exp((avg_temp_c - 25) / 45)  # Arrhenius-like acceleration
    a = 0.0075 * dod_stress * temp_stress
    b = 1.05
    fade = a * (np.maximum(cycle_count, 0) ** b)
    soh = 100 - fade
    if noise:
        soh = soh + RNG.normal(0, 0.35, size=np.shape(soh))
    return np.clip(soh, 0, 100)


def generate_battery_cycles(fleet_df):
    """For each electrified vehicle, generate a full cycle-history log."""
    records = []
    ev_rows = fleet_df[fleet_df["is_electrified"]]
    for _, v in ev_rows.iterrows():
        max_cycles = v["cycles_to_date"]
        step = max(1, max_cycles // 60)  # ~60 log points per vehicle
        cycle_points = np.arange(0, max_cycles + 1, step)
        soh_series = soh_curve(cycle_points, v["avg_depth_of_discharge"], v["avg_operating_temp_c"])
        for c, s in zip(cycle_points, soh_series):
            records.append({
                "vehicle_id": v["vehicle_id"],
                "cycle_count": int(c),
                "avg_depth_of_discharge": v["avg_depth_of_discharge"],
                "avg_operating_temp_c": v["avg_operating_temp_c"],
                "soh_percent": round(float(s), 2),
            })
    return pd.DataFrame(records)


def generate_training_set(n_synthetic_vehicles=400):
    """
    Larger synthetic corpus purely for model training (broader coverage of
    cycle/DoD/temp combinations than the demo fleet alone provides).
    """
    records = []
    for i in range(n_synthetic_vehicles):
        avg_dod = np.clip(RNG.normal(0.65, 0.18), 0.25, 0.98)
        avg_temp = np.clip(RNG.normal(29, 7), 10, 50)
        max_cycles = int(RNG.integers(20, 2200))
        cycle_points = np.linspace(0, max_cycles, 12).astype(int)
        soh_series = soh_curve(cycle_points, avg_dod, avg_temp)
        for c, s in zip(cycle_points, soh_series):
            records.append({
                "cycle_count": int(c),
                "avg_depth_of_discharge": round(avg_dod, 3),
                "avg_operating_temp_c": round(avg_temp, 1),
                "soh_percent": round(float(s), 2),
            })
    return pd.DataFrame(records)


def main():
    fleet_df = generate_fleet_vehicles()
    cycles_df = generate_battery_cycles(fleet_df)
    training_df = generate_training_set()

    fleet_df.to_csv(os.path.join(OUTPUT_DIR, "fleet_vehicles.csv"), index=False)
    cycles_df.to_csv(os.path.join(OUTPUT_DIR, "battery_cycles.csv"), index=False)
    training_df.to_csv(os.path.join(OUTPUT_DIR, "battery_training_corpus.csv"), index=False)

    print(f"Generated {len(fleet_df)} vehicles ({fleet_df['is_electrified'].sum()} electrified)")
    print(f"Generated {len(cycles_df)} battery cycle log rows")
    print(f"Generated {len(training_df)} training corpus rows")


if __name__ == "__main__":
    main()
