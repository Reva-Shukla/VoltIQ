import { Vehicle, FleetKPIs } from '../types';

const API_BASE_URL = 'http://localhost:8000';

export async function checkBackendHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/health`);
    return res.ok;
  } catch (err) {
    return false;
  }
}

export async function fetchFleetVehicles(): Promise<any[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/fleet`);
    if (!res.ok) throw new Error('Failed to fetch fleet vehicles');
    return await res.json();
  } catch (err) {
    console.warn('Backend API unavailable, using fallback telemetry data:', err);
    return [];
  }
}

export async function fetchFleetSummary(): Promise<any> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/fleet/summary`);
    if (!res.ok) throw new Error('Failed to fetch fleet summary');
    return await res.json();
  } catch (err) {
    console.warn('Backend API unavailable, using fallback summary:', err);
    return null;
  }
}

export async function fetchVehicleBatteryHealth(vehicleId: string): Promise<any> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/vehicle/${vehicleId}/battery-health`);
    if (!res.ok) throw new Error('Failed to fetch battery health');
    return await res.json();
  } catch (err) {
    console.warn(`Backend API error for vehicle ${vehicleId}:`, err);
    return null;
  }
}

export async function predictBatterySOH(payload: {
  charge_cycles: number;
  avg_temp_c: number;
  max_temp_c: number;
  internal_resistance_ohm: number;
  voltage_drop_v: number;
  discharge_rate_c: number;
  capacity_throughput_kwh: number;
}): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/api/v1/battery/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Battery SOH prediction failed');
  return await res.json();
}

export async function predictNasaBattery(payload: {
  temperature: number;
  voltage: number;
  current: number;
  cycle_count: number;
  capacity: number;
  internal_resistance: number;
}): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/api/battery/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('NASA battery prognostics prediction failed');
  return await res.json();
}

export async function predictIntelligentMaintenance(payload: {
  mileage: number;
  vehicle_age: number;
  engine_hours: number;
  battery_health: number;
  maintenance_frequency: number;
  downtime: number;
  operating_conditions: 'Normal' | 'Severe' | 'Extreme';
}): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/api/v1/maintenance/intelligent-predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Intelligent maintenance prediction failed');
  return await res.json();
}

export async function evaluateRuleReadiness(payload: {
  vehicle_age: number;
  mileage: number;
  payload: number;
  daily_route_distance: number;
  idle_time: number;
  fuel_consumption: number;
  maintenance_cost: number;
  charging_infrastructure: 'Available' | 'Planned' | 'None';
  terrain: 'Flat' | 'Hilly' | 'Mountainous';
  weather: 'Mild' | 'Cold' | 'Extreme';
  operating_region: 'Urban' | 'Mixed' | 'Highway';
}): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/api/readiness/score`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Readiness evaluation failed');
  return await res.json();
}
