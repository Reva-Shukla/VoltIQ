export type VehicleStatus = 'Active' | 'Charging' | 'Maintenance' | 'Critical Alert';

export type FleetSubgroup = 'Urban Logistics' | 'Heavy Haul' | 'Bus Transit' | 'Regional Delivery';

export interface BatteryCell {
  id: number;
  voltage: number; // in Volts e.g. 3.65
  temp: number; // in Celsius e.g. 28.4
  status: 'optimal' | 'warning' | 'critical' | 'balancing';
  soh: number; // percentage e.g. 98.2
}

export interface VehicleChargingSession {
  id: string;
  timestamp: string;
  station: string;
  energyAddedKwh: number;
  peakSpeedKw: number;
  durationMins: number;
  startSoc: number;
  endSoc: number;
  avgTemp: number;
}

export interface Vehicle {
  id: string;
  vin: string;
  model: string;
  fleet: FleetSubgroup;
  driver: string;
  status: VehicleStatus;
  soc: number; // %
  soh: number; // %
  packTemp: number; // °C
  minCellTemp: number;
  maxCellTemp: number;
  voltage: number; // V
  current: number; // A
  cycleCount: number;
  mileage: number; // km
  estimatedRangeKm: number;
  lat: number;
  lng: number;
  locationName: string;
  degradationRate: number; // % per 1k cycles
  co2OffsetTons: number;
  cells: BatteryCell[];
  alertsCount: number;
  lastServiced: string;
  chargingSpeedKw?: number;
  sessions: VehicleChargingSession[];
}

export type AlertSeverity = 'info' | 'warning' | 'critical';

export interface Alert {
  id: string;
  vin: string;
  vehicleModel: string;
  timestamp: string;
  message: string;
  severity: AlertSeverity;
  category: 'Thermal' | 'Voltage Imbalance' | 'Degradation' | 'BMS Fault' | 'Charging Speed';
  resolved?: boolean;
}

export interface AIRecommendation {
  id: string;
  vin: string;
  title: string;
  impact: 'High' | 'Medium' | 'Low';
  description: string;
  actionText: string;
  estimatedSavings: string;
  category: 'Preventative' | 'Charging' | 'Route';
}

export interface FleetKPIs {
  totalVehicles: number;
  activeVehicles: number;
  chargingVehicles: number;
  maintenanceVehicles: number;
  criticalVehicles: number;
  avgSOH: number;
  avgSOC: number;
  totalEnergyMwh: number;
  co2OffsetTons: number;
  activeAlerts: number;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatarUrl: string;
  linkedin: string;
  github: string;
  twitter: string;
  badge: string;
  specialty: string;
}

export interface FeatureSpec {
  id: string;
  title: string;
  subtitle: string;
  iconName: string;
  summary: string;
  detailedDescription: string[];
  specs: { label: string; value: string }[];
  tags: string[];
  demoMetric: string;
}

export interface Testimonial {
  id: string;
  name: string;
  title: string;
  company: string;
  quote: string;
  avatarUrl: string;
  fleetSize: string;
  co2Saved: string;
}

export interface FAQItem {
  question: string;
  answer: string;
  category: string;
}
