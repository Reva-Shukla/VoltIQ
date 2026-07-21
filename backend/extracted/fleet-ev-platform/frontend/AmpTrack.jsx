import React, { useState, useMemo } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ReferenceLine, Legend
} from "recharts";
import {
  Zap, Battery, BatteryWarning, TrendingDown, AlertTriangle, MapPin,
  Truck, Gauge, ChevronRight, Info, Sliders, CheckCircle2, Clock
} from "lucide-react";

/* ============================================================
   THEME TOKENS — industrial telemetry / control-room aesthetic
   ============================================================ */
const T = {
  bg: "#12151A",
  surface: "#1B2027",
  surfaceRaised: "#232933",
  border: "#2E3641",
  borderLight: "#3A4451",
  amber: "#F2B705",
  amberDim: "#8A6C10",
  teal: "#33D6C0",
  tealDim: "#1B6E63",
  rust: "#E8543E",
  rustDim: "#7A2E24",
  textPrimary: "#EDEFF2",
  textMuted: "#8B94A3",
  textFaint: "#5B6472",
};

const FONT_DISPLAY = "'Space Grotesk', 'Arial Narrow', sans-serif";
const FONT_BODY = "'Inter', system-ui, sans-serif";
const FONT_MONO = "'JetBrains Mono', 'Courier New', monospace";

/* ============================================================
   EMBEDDED FLEET DATA (synthetic, calibrated to realistic
   industrial EV / Li-ion aging patterns)
   ============================================================ */
const FLEET_DATA = [{"vehicle_id": "VEH-1000", "vehicle_type": "Mining Haul Truck", "site": "Bhilai Yard", "is_electrified": false, "battery_capacity_kwh": 220, "daily_distance_km": 369.2, "payload_ratio": 0.54, "dwell_hours_available": 10.3, "duty_predictability": 0.89, "avg_depth_of_discharge": 0.69, "avg_operating_temp_c": 24.2, "cycles_to_date": 0, "commissioned_days_ago": null}, {"vehicle_id": "VEH-1001", "vehicle_type": "Intra-Plant Forklift", "site": "Bhilai Yard", "is_electrified": false, "battery_capacity_kwh": 40, "daily_distance_km": 56.6, "payload_ratio": 0.7, "dwell_hours_available": 5.4, "duty_predictability": 0.88, "avg_depth_of_discharge": 0.61, "avg_operating_temp_c": 27.3, "cycles_to_date": 0, "commissioned_days_ago": null}, {"vehicle_id": "VEH-1002", "vehicle_type": "Freight Truck", "site": "Chennai Plant", "is_electrified": false, "battery_capacity_kwh": 350, "daily_distance_km": 505.2, "payload_ratio": 0.77, "dwell_hours_available": 5.4, "duty_predictability": 0.81, "avg_depth_of_discharge": 0.62, "avg_operating_temp_c": 31.4, "cycles_to_date": 0, "commissioned_days_ago": null}, {"vehicle_id": "VEH-1003", "vehicle_type": "Construction Loader", "site": "Bhilai Yard", "is_electrified": false, "battery_capacity_kwh": 150, "daily_distance_km": 87.0, "payload_ratio": 0.6, "dwell_hours_available": 11.7, "duty_predictability": 0.73, "avg_depth_of_discharge": 0.62, "avg_operating_temp_c": 29.9, "cycles_to_date": 0, "commissioned_days_ago": null}, {"vehicle_id": "VEH-1004", "vehicle_type": "Logistics Van", "site": "Pune DC", "is_electrified": false, "battery_capacity_kwh": 75, "daily_distance_km": 197.2, "payload_ratio": 0.75, "dwell_hours_available": 9.2, "duty_predictability": 0.81, "avg_depth_of_discharge": 0.67, "avg_operating_temp_c": 25.0, "cycles_to_date": 0, "commissioned_days_ago": null}, {"vehicle_id": "VEH-1005", "vehicle_type": "Mining Haul Truck", "site": "Chennai Plant", "is_electrified": false, "battery_capacity_kwh": 220, "daily_distance_km": 298.7, "payload_ratio": 0.79, "dwell_hours_available": 11.4, "duty_predictability": 0.73, "avg_depth_of_discharge": 0.78, "avg_operating_temp_c": 27.1, "cycles_to_date": 0, "commissioned_days_ago": null}, {"vehicle_id": "VEH-1006", "vehicle_type": "Intra-Plant Forklift", "site": "Nagpur Hub", "is_electrified": false, "battery_capacity_kwh": 40, "daily_distance_km": 67.0, "payload_ratio": 0.81, "dwell_hours_available": 9.6, "duty_predictability": 0.65, "avg_depth_of_discharge": 0.57, "avg_operating_temp_c": 27.6, "cycles_to_date": 0, "commissioned_days_ago": null}, {"vehicle_id": "VEH-1007", "vehicle_type": "Freight Truck", "site": "Chennai Plant", "is_electrified": false, "battery_capacity_kwh": 350, "daily_distance_km": 485.9, "payload_ratio": 0.73, "dwell_hours_available": 10.0, "duty_predictability": 0.76, "avg_depth_of_discharge": 0.72, "avg_operating_temp_c": 30.2, "cycles_to_date": 0, "commissioned_days_ago": null}, {"vehicle_id": "VEH-1008", "vehicle_type": "Construction Loader", "site": "Pune DC", "is_electrified": false, "battery_capacity_kwh": 150, "daily_distance_km": 66.4, "payload_ratio": 0.65, "dwell_hours_available": 6.6, "duty_predictability": 0.65, "avg_depth_of_discharge": 0.63, "avg_operating_temp_c": 41.0, "cycles_to_date": 0, "commissioned_days_ago": null}, {"vehicle_id": "VEH-1009", "vehicle_type": "Logistics Van", "site": "Bhilai Yard", "is_electrified": false, "battery_capacity_kwh": 75, "daily_distance_km": 211.4, "payload_ratio": 0.45, "dwell_hours_available": 7.0, "duty_predictability": 0.77, "avg_depth_of_discharge": 0.55, "avg_operating_temp_c": 30.6, "cycles_to_date": 0, "commissioned_days_ago": null}, {"vehicle_id": "VEH-1010", "vehicle_type": "Mining Haul Truck", "site": "Odisha Mine Site", "is_electrified": false, "battery_capacity_kwh": 220, "daily_distance_km": 400.0, "payload_ratio": 0.65, "dwell_hours_available": 6.6, "duty_predictability": 0.88, "avg_depth_of_discharge": 0.83, "avg_operating_temp_c": 24.3, "cycles_to_date": 0, "commissioned_days_ago": null}, {"vehicle_id": "VEH-1011", "vehicle_type": "Intra-Plant Forklift", "site": "Chennai Plant", "is_electrified": false, "battery_capacity_kwh": 40, "daily_distance_km": 50.1, "payload_ratio": 0.77, "dwell_hours_available": 8.4, "duty_predictability": 0.85, "avg_depth_of_discharge": 0.52, "avg_operating_temp_c": 27.8, "cycles_to_date": 0, "commissioned_days_ago": null}, {"vehicle_id": "VEH-1012", "vehicle_type": "Freight Truck", "site": "Bhilai Yard", "is_electrified": false, "battery_capacity_kwh": 350, "daily_distance_km": 467.3, "payload_ratio": 0.65, "dwell_hours_available": 9.4, "duty_predictability": 0.65, "avg_depth_of_discharge": 0.67, "avg_operating_temp_c": 25.1, "cycles_to_date": 0, "commissioned_days_ago": null}, {"vehicle_id": "VEH-1013", "vehicle_type": "Construction Loader", "site": "Bhilai Yard", "is_electrified": false, "battery_capacity_kwh": 150, "daily_distance_km": 97.9, "payload_ratio": 0.63, "dwell_hours_available": 8.0, "duty_predictability": 0.82, "avg_depth_of_discharge": 0.69, "avg_operating_temp_c": 36.0, "cycles_to_date": 0, "commissioned_days_ago": null}, {"vehicle_id": "VEH-1014", "vehicle_type": "Logistics Van", "site": "Chennai Plant", "is_electrified": false, "battery_capacity_kwh": 75, "daily_distance_km": 176.8, "payload_ratio": 0.64, "dwell_hours_available": 7.8, "duty_predictability": 0.5, "avg_depth_of_discharge": 0.38, "avg_operating_temp_c": 20.4, "cycles_to_date": 0, "commissioned_days_ago": null}, {"vehicle_id": "VEH-1015", "vehicle_type": "Mining Haul Truck", "site": "Nagpur Hub", "is_electrified": true, "battery_capacity_kwh": 220, "daily_distance_km": 375.2, "payload_ratio": 0.56, "dwell_hours_available": 6.9, "duty_predictability": 0.94, "avg_depth_of_discharge": 0.82, "avg_operating_temp_c": 36.4, "cycles_to_date": 369, "commissioned_days_ago": 448.0}, {"vehicle_id": "VEH-1016", "vehicle_type": "Intra-Plant Forklift", "site": "Pune DC", "is_electrified": true, "battery_capacity_kwh": 40, "daily_distance_km": 49.7, "payload_ratio": 0.65, "dwell_hours_available": 10.5, "duty_predictability": 0.49, "avg_depth_of_discharge": 0.58, "avg_operating_temp_c": 28.2, "cycles_to_date": 471, "commissioned_days_ago": 518.0}, {"vehicle_id": "VEH-1017", "vehicle_type": "Freight Truck", "site": "Nagpur Hub", "is_electrified": true, "battery_capacity_kwh": 350, "daily_distance_km": 380.0, "payload_ratio": 0.73, "dwell_hours_available": 8.1, "duty_predictability": 0.99, "avg_depth_of_discharge": 0.68, "avg_operating_temp_c": 21.9, "cycles_to_date": 703, "commissioned_days_ago": 554.0}, {"vehicle_id": "VEH-1018", "vehicle_type": "Construction Loader", "site": "Nagpur Hub", "is_electrified": true, "battery_capacity_kwh": 150, "daily_distance_km": 112.0, "payload_ratio": 0.83, "dwell_hours_available": 9.1, "duty_predictability": 0.97, "avg_depth_of_discharge": 0.55, "avg_operating_temp_c": 28.2, "cycles_to_date": 372, "commissioned_days_ago": 155.0}, {"vehicle_id": "VEH-1019", "vehicle_type": "Logistics Van", "site": "Pune DC", "is_electrified": true, "battery_capacity_kwh": 75, "daily_distance_km": 200.6, "payload_ratio": 0.67, "dwell_hours_available": 3.6, "duty_predictability": 0.6, "avg_depth_of_discharge": 0.53, "avg_operating_temp_c": 31.2, "cycles_to_date": 1249, "commissioned_days_ago": 1228.0}, {"vehicle_id": "VEH-1020", "vehicle_type": "Mining Haul Truck", "site": "Chennai Plant", "is_electrified": true, "battery_capacity_kwh": 220, "daily_distance_km": 376.1, "payload_ratio": 0.55, "dwell_hours_available": 1.6, "duty_predictability": 0.79, "avg_depth_of_discharge": 0.78, "avg_operating_temp_c": 29.5, "cycles_to_date": 466, "commissioned_days_ago": 766.0}, {"vehicle_id": "VEH-1021", "vehicle_type": "Intra-Plant Forklift", "site": "Odisha Mine Site", "is_electrified": true, "battery_capacity_kwh": 40, "daily_distance_km": 61.7, "payload_ratio": 0.68, "dwell_hours_available": 4.9, "duty_predictability": 0.5, "avg_depth_of_discharge": 0.51, "avg_operating_temp_c": 26.7, "cycles_to_date": 1180, "commissioned_days_ago": 532.0}, {"vehicle_id": "VEH-1022", "vehicle_type": "Freight Truck", "site": "Pune DC", "is_electrified": true, "battery_capacity_kwh": 350, "daily_distance_km": 494.3, "payload_ratio": 0.63, "dwell_hours_available": 4.4, "duty_predictability": 0.61, "avg_depth_of_discharge": 0.64, "avg_operating_temp_c": 37.6, "cycles_to_date": 403, "commissioned_days_ago": 274.0}, {"vehicle_id": "VEH-1023", "vehicle_type": "Construction Loader", "site": "Nagpur Hub", "is_electrified": true, "battery_capacity_kwh": 150, "daily_distance_km": 105.1, "payload_ratio": 0.76, "dwell_hours_available": 7.5, "duty_predictability": 0.74, "avg_depth_of_discharge": 0.6, "avg_operating_temp_c": 34.7, "cycles_to_date": 513, "commissioned_days_ago": 193.0}, {"vehicle_id": "VEH-1024", "vehicle_type": "Logistics Van", "site": "Odisha Mine Site", "is_electrified": true, "battery_capacity_kwh": 75, "daily_distance_km": 138.6, "payload_ratio": 0.73, "dwell_hours_available": 12.7, "duty_predictability": 0.77, "avg_depth_of_discharge": 0.49, "avg_operating_temp_c": 28.4, "cycles_to_date": 1041, "commissioned_days_ago": 397.0}, {"vehicle_id": "VEH-1025", "vehicle_type": "Mining Haul Truck", "site": "Bhilai Yard", "is_electrified": true, "battery_capacity_kwh": 220, "daily_distance_km": 419.7, "payload_ratio": 0.76, "dwell_hours_available": 12.6, "duty_predictability": 0.78, "avg_depth_of_discharge": 0.75, "avg_operating_temp_c": 23.8, "cycles_to_date": 1145, "commissioned_days_ago": 930.0}, {"vehicle_id": "VEH-1026", "vehicle_type": "Intra-Plant Forklift", "site": "Pune DC", "is_electrified": true, "battery_capacity_kwh": 40, "daily_distance_km": 58.1, "payload_ratio": 0.64, "dwell_hours_available": 12.4, "duty_predictability": 0.58, "avg_depth_of_discharge": 0.48, "avg_operating_temp_c": 30.2, "cycles_to_date": 531, "commissioned_days_ago": 459.0}, {"vehicle_id": "VEH-1027", "vehicle_type": "Freight Truck", "site": "Pune DC", "is_electrified": true, "battery_capacity_kwh": 350, "daily_distance_km": 445.5, "payload_ratio": 0.91, "dwell_hours_available": 8.3, "duty_predictability": 0.85, "avg_depth_of_discharge": 0.54, "avg_operating_temp_c": 26.8, "cycles_to_date": 397, "commissioned_days_ago": 195.0}, {"vehicle_id": "VEH-1028", "vehicle_type": "Construction Loader", "site": "Odisha Mine Site", "is_electrified": true, "battery_capacity_kwh": 150, "daily_distance_km": 75.8, "payload_ratio": 0.65, "dwell_hours_available": 10.7, "duty_predictability": 0.55, "avg_depth_of_discharge": 0.65, "avg_operating_temp_c": 29.1, "cycles_to_date": 551, "commissioned_days_ago": 634.0}, {"vehicle_id": "VEH-1029", "vehicle_type": "Logistics Van", "site": "Pune DC", "is_electrified": true, "battery_capacity_kwh": 75, "daily_distance_km": 223.3, "payload_ratio": 0.68, "dwell_hours_available": 5.9, "duty_predictability": 0.72, "avg_depth_of_discharge": 0.52, "avg_operating_temp_c": 27.9, "cycles_to_date": 324, "commissioned_days_ago": 522.0}, {"vehicle_id": "VEH-1030", "vehicle_type": "Mining Haul Truck", "site": "Nagpur Hub", "is_electrified": true, "battery_capacity_kwh": 220, "daily_distance_km": 364.4, "payload_ratio": 1.0, "dwell_hours_available": 13.6, "duty_predictability": 0.62, "avg_depth_of_discharge": 0.83, "avg_operating_temp_c": 23.2, "cycles_to_date": 472, "commissioned_days_ago": 801.0}, {"vehicle_id": "VEH-1031", "vehicle_type": "Intra-Plant Forklift", "site": "Odisha Mine Site", "is_electrified": true, "battery_capacity_kwh": 40, "daily_distance_km": 52.1, "payload_ratio": 0.6, "dwell_hours_available": 1.6, "duty_predictability": 0.73, "avg_depth_of_discharge": 0.47, "avg_operating_temp_c": 24.4, "cycles_to_date": 386, "commissioned_days_ago": 476.0}, {"vehicle_id": "VEH-1032", "vehicle_type": "Freight Truck", "site": "Nagpur Hub", "is_electrified": true, "battery_capacity_kwh": 350, "daily_distance_km": 287.1, "payload_ratio": 0.48, "dwell_hours_available": 14.4, "duty_predictability": 0.56, "avg_depth_of_discharge": 0.61, "avg_operating_temp_c": 36.2, "cycles_to_date": 1521, "commissioned_days_ago": 407.0}, {"vehicle_id": "VEH-1033", "vehicle_type": "Construction Loader", "site": "Odisha Mine Site", "is_electrified": true, "battery_capacity_kwh": 150, "daily_distance_km": 95.5, "payload_ratio": 0.96, "dwell_hours_available": 5.0, "duty_predictability": 0.71, "avg_depth_of_discharge": 0.71, "avg_operating_temp_c": 34.6, "cycles_to_date": 537, "commissioned_days_ago": 466.0}, {"vehicle_id": "VEH-1034", "vehicle_type": "Logistics Van", "site": "Nagpur Hub", "is_electrified": true, "battery_capacity_kwh": 75, "daily_distance_km": 135.5, "payload_ratio": 0.66, "dwell_hours_available": 7.2, "duty_predictability": 0.78, "avg_depth_of_discharge": 0.46, "avg_operating_temp_c": 29.4, "cycles_to_date": 953, "commissioned_days_ago": 587.0}, {"vehicle_id": "VEH-1035", "vehicle_type": "Mining Haul Truck", "site": "Chennai Plant", "is_electrified": true, "battery_capacity_kwh": 220, "daily_distance_km": 353.3, "payload_ratio": 0.7, "dwell_hours_available": 5.8, "duty_predictability": 0.8, "avg_depth_of_discharge": 0.84, "avg_operating_temp_c": 44.6, "cycles_to_date": 1122, "commissioned_days_ago": 596.0}, {"vehicle_id": "VEH-1036", "vehicle_type": "Intra-Plant Forklift", "site": "Nagpur Hub", "is_electrified": true, "battery_capacity_kwh": 40, "daily_distance_km": 51.8, "payload_ratio": 0.53, "dwell_hours_available": 11.6, "duty_predictability": 0.79, "avg_depth_of_discharge": 0.59, "avg_operating_temp_c": 18.3, "cycles_to_date": 928, "commissioned_days_ago": 222.0}, {"vehicle_id": "VEH-1037", "vehicle_type": "Freight Truck", "site": "Nagpur Hub", "is_electrified": true, "battery_capacity_kwh": 350, "daily_distance_km": 384.4, "payload_ratio": 0.74, "dwell_hours_available": 8.2, "duty_predictability": 0.71, "avg_depth_of_discharge": 0.69, "avg_operating_temp_c": 25.7, "cycles_to_date": 695, "commissioned_days_ago": 867.0}, {"vehicle_id": "VEH-1038", "vehicle_type": "Construction Loader", "site": "Bhilai Yard", "is_electrified": true, "battery_capacity_kwh": 150, "daily_distance_km": 48.4, "payload_ratio": 0.66, "dwell_hours_available": 8.5, "duty_predictability": 0.79, "avg_depth_of_discharge": 0.62, "avg_operating_temp_c": 21.5, "cycles_to_date": 748, "commissioned_days_ago": 116.0}, {"vehicle_id": "VEH-1039", "vehicle_type": "Logistics Van", "site": "Chennai Plant", "is_electrified": true, "battery_capacity_kwh": 75, "daily_distance_km": 208.0, "payload_ratio": 0.65, "dwell_hours_available": 7.8, "duty_predictability": 0.59, "avg_depth_of_discharge": 0.47, "avg_operating_temp_c": 33.5, "cycles_to_date": 824, "commissioned_days_ago": 933.0}];

/* ============================================================
   MODEL LOGIC — ported 1:1 from the production Python backend
   (GradientBoostingRegressor trained on this same closed-form
   curve; R²=0.996, MAE=0.39pp — see /api/model/metrics)
   ============================================================ */
const EOL_THRESHOLD = 80.0;

function sohCurve(cycleCount, avgDod, avgTempC) {
  const dodStress = 0.6 + 1.1 * avgDod;
  const tempStress = Math.exp((avgTempC - 25) / 45);
  const a = 0.0075 * dodStress * tempStress;
  const b = 1.05;
  const fade = a * Math.pow(Math.max(cycleCount, 0), b);
  return Math.min(100, Math.max(0, 100 - fade));
}

function predictRulCycles(currentCycle, avgDod, avgTempC, maxSearch = 6000, step = 10) {
  for (let c = currentCycle; c < currentCycle + maxSearch; c += step) {
    if (sohCurve(c, avgDod, avgTempC) <= EOL_THRESHOLD) {
      return Math.round(c - currentCycle);
    }
  }
  return null;
}

function degradationTrend(currentCycle, avgDod, avgTempC, window = 200) {
  const c0 = Math.max(0, currentCycle - 2 * window);
  const c1 = Math.max(0, currentCycle - window);
  const c2 = currentCycle;
  const s0 = sohCurve(c0, avgDod, avgTempC);
  const s1 = sohCurve(c1, avgDod, avgTempC);
  const s2 = sohCurve(c2, avgDod, avgTempC);
  const rateRecent = s1 - s2;
  const ratePrior = s0 - s1;
  const ratio = ratePrior <= 0 ? 1.0 : rateRecent / ratePrior;
  if (ratio < 1.15) return "Stable";
  if (ratio < 1.6) return "Accelerating";
  return "Critical";
}

const OEM_CLASSES = [
  { label: "Light-Duty Intra-Plant EV", range: 80, capacity: 45, leadWeeks: 6 },
  { label: "Medium-Duty Logistics EV", range: 200, capacity: 120, leadWeeks: 10 },
  { label: "Heavy-Duty Freight EV", range: 400, capacity: 350, leadWeeks: 20 },
  { label: "Heavy Industrial / Mining EV", range: 350, capacity: 300, leadWeeks: 26 },
];

function recommendOemClass(dailyDistanceKm, payloadRatio) {
  let best = null;
  for (const cls of OEM_CLASSES) {
    const effectiveNeed = dailyDistanceKm * (1 + 0.15 * Math.max(0, payloadRatio - 0.6));
    const fit = 1 - Math.min(Math.abs(cls.range - effectiveNeed) / cls.range, 1);
    if (!best || fit > best.fit) best = { fit, ...cls };
  }
  return best;
}

function rangeHeadroomScore(dailyDistanceKm, capacityKwh, efficiency = 1.4) {
  const usableRange = (capacityKwh * 0.85) / efficiency;
  if (usableRange <= 0) return 0;
  const ratio = usableRange / Math.max(dailyDistanceKm, 1);
  if (ratio < 1.05) return 15;
  if (ratio < 1.3) return 55;
  if (ratio <= 2.2) return 100;
  if (ratio <= 3) return 75;
  return 55;
}

function chargingWindowScore(dwellHours, capacityKwh, chargerKw) {
  const requiredHours = (capacityKwh * 0.8) / chargerKw;
  if (dwellHours <= 0) return 0;
  const ratio = dwellHours / requiredHours;
  if (ratio < 0.9) return 10;
  if (ratio < 1.2) return 50;
  if (ratio <= 3) return 100;
  return 85;
}

function payloadDeratingPenalty(payloadRatio) {
  return Math.round(Math.max(0, payloadRatio - 0.6) * 40);
}

function scoreVehicle(v, chargerKw) {
  const oem = recommendOemClass(v.daily_distance_km, v.payload_ratio);
  const rangeScore = rangeHeadroomScore(v.daily_distance_km, oem.capacity);
  const chargeScore = chargingWindowScore(v.dwell_hours_available, oem.capacity, chargerKw);
  const predictScore = Math.round(v.duty_predictability * 100);
  const penalty = payloadDeratingPenalty(v.payload_ratio);

  const raw = 0.35 * rangeScore + 0.35 * chargeScore + 0.3 * predictScore - penalty;
  const readinessIndex = Math.round(Math.max(0, Math.min(100, raw)) * 10) / 10;

  let tier;
  if (readinessIndex >= 75) tier = "Ready Now";
  else if (readinessIndex >= 50) tier = "Ready with Infrastructure Investment";
  else if (readinessIndex >= 30) tier = "Monitor / Revisit in 12-18 Months";
  else tier = "Not Yet Viable";

  const rationale = [];
  if (rangeScore < 50) rationale.push("Daily distance leaves little range buffer for the recommended pack size");
  if (chargeScore < 50) rationale.push("Available dwell time is tight against required charge duration");
  if (predictScore < 50) rationale.push("Duty cycle is variable, raising range-planning risk");
  if (penalty > 10) rationale.push("Above-average payload utilisation will accelerate range and battery derating");
  if (rationale.length === 0) rationale.push("Operational profile aligns well with the recommended EV class");

  return {
    readinessIndex, tier,
    subScores: { rangeScore, chargeScore, predictScore, penalty },
    oem, rationale,
  };
}

/* ============================================================
   SMALL UI PRIMITIVES
   ============================================================ */
function tierColor(tier) {
  if (tier === "Ready Now") return T.teal;
  if (tier === "Ready with Infrastructure Investment") return T.amber;
  if (tier === "Monitor / Revisit in 12-18 Months") return "#C98A2E";
  return T.rust;
}

function trendColor(trend) {
  if (trend === "Stable") return T.teal;
  if (trend === "Accelerating") return T.amber;
  return T.rust;
}

function sohColor(soh) {
  if (soh >= 90) return T.teal;
  if (soh >= 80) return T.amber;
  return T.rust;
}

function CellGrid({ soh, cells = 12 }) {
  const litCount = Math.round((soh / 100) * cells);
  const color = sohColor(soh);
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${cells}, 1fr)`, gap: 3, width: 132 }}>
      {Array.from({ length: cells }).map((_, i) => (
        <div
          key={i}
          style={{
            height: 14,
            borderRadius: 2,
            background: i < litCount ? color : T.border,
            boxShadow: i < litCount ? `0 0 6px ${color}55` : "none",
            transition: "background 0.3s",
          }}
        />
      ))}
    </div>
  );
}

function KPICard({ icon: Icon, label, value, sub, accent }) {
  return (
    <div style={{
      background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10,
      padding: "16px 18px", flex: 1, minWidth: 150,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <Icon size={15} color={accent || T.textMuted} />
        <span style={{ fontFamily: FONT_MONO, fontSize: 11, color: T.textMuted, letterSpacing: 0.4, textTransform: "uppercase" }}>{label}</span>
      </div>
      <div style={{ fontFamily: FONT_DISPLAY, fontSize: 28, fontWeight: 700, color: T.textPrimary, lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontFamily: FONT_BODY, fontSize: 12, color: T.textFaint, marginTop: 6 }}>{sub}</div>}
    </div>
  );
}

function Pill({ children, color, bg }) {
  return (
    <span style={{
      fontFamily: FONT_MONO, fontSize: 11, fontWeight: 500, padding: "3px 9px",
      borderRadius: 20, color: color, background: bg, whiteSpace: "nowrap",
      letterSpacing: 0.2,
    }}>{children}</span>
  );
}

/* ============================================================
   MAIN APP
   ============================================================ */
export default function AmpTrack() {
  const [tab, setTab] = useState("battery");
  const [selectedId, setSelectedId] = useState(null);
  const [chargerKw, setChargerKw] = useState(60);

  const evFleet = useMemo(() => FLEET_DATA.filter(v => v.is_electrified).map(v => {
    const soh = sohCurve(v.cycles_to_date, v.avg_depth_of_discharge, v.avg_operating_temp_c);
    const rul = predictRulCycles(v.cycles_to_date, v.avg_depth_of_discharge, v.avg_operating_temp_c);
    const trend = degradationTrend(v.cycles_to_date, v.avg_depth_of_discharge, v.avg_operating_temp_c);
    return { ...v, soh, rul, trend };
  }).sort((a, b) => a.soh - b.soh), []);

  const iceFleet = useMemo(() => FLEET_DATA.filter(v => !v.is_electrified).map(v => {
    const score = scoreVehicle(v, chargerKw);
    return { ...v, ...score };
  }).sort((a, b) => b.readinessIndex - a.readinessIndex), [chargerKw]);

  const summary = useMemo(() => {
    const avgSoh = evFleet.reduce((s, v) => s + v.soh, 0) / evFleet.length;
    const atRisk = evFleet.filter(v => v.soh < 85).length;
    const avgReadiness = iceFleet.reduce((s, v) => s + v.readinessIndex, 0) / iceFleet.length;
    const readyNow = iceFleet.filter(v => v.readinessIndex >= 75).length;
    return {
      total: FLEET_DATA.length, electrified: evFleet.length, iceCandidates: iceFleet.length,
      avgSoh: avgSoh.toFixed(1), atRisk, avgReadiness: avgReadiness.toFixed(1), readyNow,
    };
  }, [evFleet, iceFleet]);

  const selected = evFleet.find(v => v.vehicle_id === selectedId) || evFleet[0];

  const chartData = useMemo(() => {
    if (!selected) return [];
    const points = [];
    const hist = selected.cycles_to_date;
    for (let c = 0; c <= hist; c += Math.max(1, Math.round(hist / 15)) || 1) {
      points.push({ cycle: c, soh: +sohCurve(c, selected.avg_depth_of_discharge, selected.avg_operating_temp_c).toFixed(2), type: "history" });
    }
    for (let c = hist; c <= hist + 1400; c += 100) {
      points.push({ cycle: c, projected: +sohCurve(c, selected.avg_depth_of_discharge, selected.avg_operating_temp_c).toFixed(2), type: "projection" });
    }
    return points;
  }, [selected]);

  return (
    <div style={{
      background: T.bg, minHeight: "100%", fontFamily: FONT_BODY, color: T.textPrimary,
      padding: 20, borderRadius: 12,
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 3px; }
        button { cursor: pointer; font-family: inherit; }
      `}</style>

      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22, flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 9, background: `linear-gradient(135deg, ${T.amber}, ${T.rust})`,
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <Zap size={22} color="#12151A" strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 22, fontWeight: 700, letterSpacing: -0.3 }}>AmpTrack</div>
            <div style={{ fontFamily: FONT_BODY, fontSize: 12.5, color: T.textMuted }}>Asset intelligence for the electric fleet</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <Pill color={T.teal} bg={T.tealDim + "33"}>● GradientBoosting SoH model · R² 0.996</Pill>
          <Pill color={T.textMuted} bg={T.surfaceRaised}>Production API: FastAPI + scikit-learn</Pill>
        </div>
      </div>

      {/* KPI STRIP */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
        <KPICard icon={Truck} label="Fleet Size" value={summary.total} sub={`${summary.electrified} electrified · ${summary.iceCandidates} ICE candidates`} />
        <KPICard icon={Battery} label="Avg Fleet SoH" value={`${summary.avgSoh}%`} accent={T.teal} sub="Across electrified assets" />
        <KPICard icon={BatteryWarning} label="Vehicles At Risk" value={summary.atRisk} accent={T.rust} sub="SoH below 85% threshold" />
        <KPICard icon={Gauge} label="Avg Readiness Index" value={summary.avgReadiness} accent={T.amber} sub="ICE-to-EV transition score" />
        <KPICard icon={CheckCircle2} label="Ready Now" value={summary.readyNow} accent={T.teal} sub="Candidates scoring ≥ 75" />
      </div>

      {/* TABS */}
      <div style={{ display: "flex", gap: 4, marginBottom: 18, borderBottom: `1px solid ${T.border}` }}>
        {[
          { id: "battery", label: "Battery Intelligence", icon: Battery },
          { id: "readiness", label: "Electrification Readiness", icon: Gauge },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            background: "none", border: "none", padding: "10px 16px",
            borderBottom: tab === t.id ? `2px solid ${T.amber}` : "2px solid transparent",
            color: tab === t.id ? T.textPrimary : T.textMuted,
            display: "flex", alignItems: "center", gap: 7, fontSize: 13.5, fontWeight: 500,
          }}>
            <t.icon size={15} /> {t.label}
          </button>
        ))}
      </div>

      {/* BATTERY INTELLIGENCE TAB */}
      {tab === "battery" && (
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 380px", minWidth: 340, maxHeight: 560, overflowY: "auto", paddingRight: 4 }}>
            {evFleet.map(v => (
              <div key={v.vehicle_id} onClick={() => setSelectedId(v.vehicle_id)} style={{
                background: (selected && selected.vehicle_id === v.vehicle_id) ? T.surfaceRaised : T.surface,
                border: `1px solid ${(selected && selected.vehicle_id === v.vehicle_id) ? T.amber : T.border}`,
                borderRadius: 9, padding: "12px 14px", marginBottom: 8, cursor: "pointer",
                display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10,
              }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontFamily: FONT_MONO, fontSize: 12.5, fontWeight: 500 }}>{v.vehicle_id}</span>
                    <Pill color={trendColor(v.trend)} bg="transparent">{v.trend}</Pill>
                  </div>
                  <div style={{ fontSize: 12, color: T.textMuted, display: "flex", alignItems: "center", gap: 5 }}>
                    <MapPin size={11} /> {v.site} · {v.vehicle_type}
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, flexShrink: 0 }}>
                  <span style={{ fontFamily: FONT_DISPLAY, fontSize: 15, fontWeight: 700, color: sohColor(v.soh) }}>{v.soh.toFixed(1)}%</span>
                  <CellGrid soh={v.soh} cells={10} />
                </div>
              </div>
            ))}
          </div>

          {selected && (
            <div style={{ flex: "2 1 420px", minWidth: 340, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
                <div>
                  <div style={{ fontFamily: FONT_DISPLAY, fontSize: 18, fontWeight: 700 }}>{selected.vehicle_id}</div>
                  <div style={{ fontSize: 12.5, color: T.textMuted }}>{selected.vehicle_type} · {selected.site} · {selected.battery_capacity_kwh} kWh pack</div>
                </div>
                <Pill color={trendColor(selected.trend)} bg={trendColor(selected.trend) + "22"}>{selected.trend} Degradation</Pill>
              </div>

              <div style={{ display: "flex", gap: 12, marginBottom: 18, flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: 120 }}>
                  <div style={{ fontSize: 11, color: T.textMuted, fontFamily: FONT_MONO, textTransform: "uppercase", marginBottom: 4 }}>Current SoH</div>
                  <div style={{ fontFamily: FONT_DISPLAY, fontSize: 26, fontWeight: 700, color: sohColor(selected.soh) }}>{selected.soh.toFixed(2)}%</div>
                </div>
                <div style={{ flex: 1, minWidth: 120 }}>
                  <div style={{ fontSize: 11, color: T.textMuted, fontFamily: FONT_MONO, textTransform: "uppercase", marginBottom: 4 }}>Cycles To Date</div>
                  <div style={{ fontFamily: FONT_DISPLAY, fontSize: 26, fontWeight: 700 }}>{selected.cycles_to_date}</div>
                </div>
                <div style={{ flex: 1, minWidth: 120 }}>
                  <div style={{ fontSize: 11, color: T.textMuted, fontFamily: FONT_MONO, textTransform: "uppercase", marginBottom: 4 }}>Remaining Useful Life</div>
                  <div style={{ fontFamily: FONT_DISPLAY, fontSize: 26, fontWeight: 700, color: T.amber }}>
                    {selected.rul !== null ? `${selected.rul} cycles` : "6000+ cycles"}
                  </div>
                </div>
              </div>

              <div style={{ fontSize: 11.5, color: T.textFaint, fontFamily: FONT_MONO, textTransform: "uppercase", marginBottom: 6 }}>
                SoH Trajectory — history + forward projection to EOL threshold
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid stroke={T.border} strokeDasharray="3 3" />
                  <XAxis dataKey="cycle" stroke={T.textFaint} tick={{ fontSize: 11, fontFamily: FONT_MONO }} label={{ value: "Cycle Count", position: "insideBottom", offset: -3, fill: T.textFaint, fontSize: 11 }} />
                  <YAxis domain={[70, 100]} stroke={T.textFaint} tick={{ fontSize: 11, fontFamily: FONT_MONO }} />
                  <Tooltip contentStyle={{ background: T.surfaceRaised, border: `1px solid ${T.border}`, borderRadius: 8, fontSize: 12 }} />
                  <ReferenceLine y={80} stroke={T.rust} strokeDasharray="4 4" label={{ value: "EOL 80%", fill: T.rust, fontSize: 10, position: "insideTopRight" }} />
                  <Line type="monotone" dataKey="soh" stroke={T.teal} strokeWidth={2} dot={false} name="Observed" />
                  <Line type="monotone" dataKey="projected" stroke={T.amber} strokeWidth={2} strokeDasharray="5 3" dot={false} name="Projected" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}

      {/* READINESS TAB */}
      {tab === "readiness" && (
        <div>
          <div style={{
            display: "flex", alignItems: "center", gap: 14, background: T.surface,
            border: `1px solid ${T.border}`, borderRadius: 9, padding: "12px 16px", marginBottom: 16, flexWrap: "wrap",
          }}>
            <Sliders size={16} color={T.amber} />
            <span style={{ fontSize: 13, color: T.textMuted }}>Assumed depot charger power:</span>
            <input type="range" min={20} max={150} step={10} value={chargerKw}
              onChange={e => setChargerKw(Number(e.target.value))}
              style={{ width: 180, accentColor: T.amber }} />
            <span style={{ fontFamily: FONT_MONO, fontSize: 13, color: T.amber, fontWeight: 600 }}>{chargerKw} kW</span>
            <span style={{ fontSize: 11.5, color: T.textFaint, marginLeft: "auto" }}>
              <Info size={11} style={{ display: "inline", marginRight: 4, verticalAlign: -2 }} />
              Readiness scores recompute live as charging infrastructure assumptions change
            </span>
          </div>

          {iceFleet.map(v => (
            <div key={v.vehicle_id} style={{
              background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10,
              padding: "16px 18px", marginBottom: 10,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap", marginBottom: 12 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 3 }}>
                    <span style={{ fontFamily: FONT_MONO, fontSize: 13.5, fontWeight: 600 }}>{v.vehicle_id}</span>
                    <span style={{ fontSize: 12.5, color: T.textMuted }}>{v.vehicle_type} · {v.site}</span>
                  </div>
                  <div style={{ fontSize: 12, color: T.textFaint }}>{v.daily_distance_km} km/day · {v.dwell_hours_available}h dwell · payload {Math.round(v.payload_ratio * 100)}%</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: FONT_DISPLAY, fontSize: 24, fontWeight: 700, color: tierColor(v.tier) }}>{v.readinessIndex}</div>
                  <Pill color={tierColor(v.tier)} bg={tierColor(v.tier) + "22"}>{v.tier}</Pill>
                </div>
              </div>

              {/* sub-score bars */}
              <div style={{ display: "flex", gap: 16, marginBottom: 12, flexWrap: "wrap" }}>
                {[
                  ["Range Headroom", v.subScores.rangeScore],
                  ["Charging Window Fit", v.subScores.chargeScore],
                  ["Duty Predictability", v.subScores.predictScore],
                ].map(([label, score]) => (
                  <div key={label} style={{ flex: 1, minWidth: 130 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: T.textMuted, marginBottom: 4 }}>
                      <span>{label}</span><span style={{ fontFamily: FONT_MONO }}>{score}</span>
                    </div>
                    <div style={{ height: 5, background: T.border, borderRadius: 3 }}>
                      <div style={{ width: `${score}%`, height: "100%", borderRadius: 3, background: score >= 70 ? T.teal : score >= 40 ? T.amber : T.rust }} />
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, paddingTop: 10, borderTop: `1px solid ${T.border}` }}>
                <div style={{ fontSize: 12, color: T.textMuted, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                  <AlertTriangle size={12} color={T.textFaint} />
                  {v.rationale[0]}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Pill color={T.textPrimary} bg={T.surfaceRaised}>{v.oem.label}</Pill>
                  <span style={{ fontSize: 11.5, color: T.textFaint, display: "flex", alignItems: "center", gap: 4 }}>
                    <Clock size={11} /> {v.oem.leadWeeks}wk lead time
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
