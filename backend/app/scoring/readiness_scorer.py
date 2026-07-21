"""
Fleet Electrification Readiness & Procurement Intelligence.

Produces a 0-100 "Transition Readiness Index" for each ICE vehicle being
evaluated for EV conversion, based on operational fit — NOT just a generic
TCO calculation. The logic mirrors how procurement/ops teams actually reason
about EV suitability:

  - Daily distance vs. realistic EV range headroom
  - Dwell time available for charging vs. required charge time
  - Duty cycle predictability (fixed routes are far easier to electrify
    than ad-hoc dispatch)
  - Payload ratio (heavier duty cycles reduce effective range and stress
    the pack harder -> factored as a derating penalty)

Each vehicle also gets a confidence-scored OEM class recommendation and a
plain-language rationale, so the output reads like a procurement brief, not
just a number.
"""

OEM_CLASSES = [
    # (label, suitable_daily_range_km, typical_capacity_kwh, indicative_lead_time_weeks)
    ("Light-Duty Intra-Plant EV", 80, 45, 6),
    ("Medium-Duty Logistics EV", 200, 120, 10),
    ("Heavy-Duty Freight EV", 400, 350, 20),
    ("Heavy Industrial / Mining EV", 350, 300, 26),
]


def _range_headroom_score(daily_distance_km, capacity_kwh, efficiency_kwh_per_km=1.4):
    """How much buffer exists between daily distance need and realistic usable range."""
    usable_range = (capacity_kwh * 0.85) / efficiency_kwh_per_km  # 85% usable window
    if usable_range <= 0:
        return 0
    headroom_ratio = usable_range / max(daily_distance_km, 1)
    # sweet spot: 1.3x-2x headroom scores best; too little is risky, too much is over-spec'd (wasted capex)
    if headroom_ratio < 1.05:
        return 15
    elif headroom_ratio < 1.3:
        return 55
    elif headroom_ratio <= 2.2:
        return 100
    elif headroom_ratio <= 3:
        return 75
    else:
        return 55  # over-provisioned battery = unnecessary capex


def _charging_window_score(dwell_hours_available, capacity_kwh, charger_kw=60):
    required_hours = (capacity_kwh * 0.8) / charger_kw
    if dwell_hours_available <= 0:
        return 0
    ratio = dwell_hours_available / required_hours
    if ratio < 0.9:
        return 10
    elif ratio < 1.2:
        return 50
    elif ratio <= 3:
        return 100
    else:
        return 85


def _predictability_score(duty_predictability):
    return round(duty_predictability * 100)


def _payload_derating_penalty(payload_ratio):
    # heavier average payload -> more stress, more derating risk
    return round(max(0, payload_ratio - 0.6) * 40)


def recommend_oem_class(daily_distance_km, payload_ratio):
    best = None
    for label, suit_range, capacity, lead_time in OEM_CLASSES:
        effective_need = daily_distance_km * (1 + 0.15 * max(0, payload_ratio - 0.6))
        fit = 1 - min(abs(suit_range - effective_need) / suit_range, 1)
        if best is None or fit > best[0]:
            best = (fit, label, capacity, lead_time)
    _, label, capacity, lead_time = best
    return {
        "recommended_class": label,
        "recommended_capacity_kwh": capacity,
        "indicative_lead_time_weeks": lead_time,
    }


def score_vehicle(vehicle: dict, charger_kw: int = 60):
    """
    vehicle: dict with keys daily_distance_km, dwell_hours_available,
    duty_predictability, payload_ratio (as produced by fleet_vehicles.csv)
    """
    oem = recommend_oem_class(vehicle["daily_distance_km"], vehicle["payload_ratio"])
    capacity = oem["recommended_capacity_kwh"]

    range_score = _range_headroom_score(vehicle["daily_distance_km"], capacity)
    charge_score = _charging_window_score(vehicle["dwell_hours_available"], capacity, charger_kw)
    predict_score = _predictability_score(vehicle["duty_predictability"])
    penalty = _payload_derating_penalty(vehicle["payload_ratio"])

    # weighted composite - range headroom and charging window are the two
    # hard operational constraints, predictability is a softer risk factor
    raw = (0.35 * range_score) + (0.35 * charge_score) + (0.30 * predict_score) - penalty
    readiness_index = round(max(0, min(100, raw)), 1)

    if readiness_index >= 75:
        tier = "Ready Now"
    elif readiness_index >= 50:
        tier = "Ready with Infrastructure Investment"
    elif readiness_index >= 30:
        tier = "Monitor / Revisit in 12-18 Months"
    else:
        tier = "Not Yet Viable"

    rationale = []
    if range_score < 50:
        rationale.append("daily distance leaves little range buffer for the recommended pack size")
    if charge_score < 50:
        rationale.append("available dwell time is tight against required charge duration")
    if predict_score < 50:
        rationale.append("duty cycle is variable, raising range-planning risk")
    if penalty > 10:
        rationale.append("above-average payload utilisation will accelerate range and battery derating")
    if not rationale:
        rationale.append("operational profile aligns well with the recommended EV class")

    return {
        "readiness_index": readiness_index,
        "readiness_tier": tier,
        "sub_scores": {
            "range_headroom": range_score,
            "charging_window_fit": charge_score,
            "duty_predictability": predict_score,
            "payload_derating_penalty": penalty,
        },
        "procurement_recommendation": oem,
        "rationale": rationale,
    }
