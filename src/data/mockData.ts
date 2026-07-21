import { Vehicle, BatteryCell, Alert, AIRecommendation, FeatureSpec, TeamMember, Testimonial, FAQItem, FleetSubgroup } from '../types';

const DRIVERS = [
  'Marcus Vance', 'Elena Rostova', 'David Chen', 'Sarah Jenkins', 'Carlos Mendez',
  'Amina Diallo', 'Liam O\'Connor', 'Kaito Tanaka', 'Zoe Sterling', 'Nikhil Sharma',
  'Rachel Adams', 'Sven Lindqvist', 'Fatima Al-Hassan', 'Mateo Rossi', 'Hannah Wright',
  'Dmitri Volkov', 'Maya Lin', 'Gabriel Santos', 'Priya Patel', 'Oliver Bennett',
];

const FLEETS: FleetSubgroup[] = [
  'Urban Logistics',
  'Heavy Haul',
  'Bus Transit',
  'Regional Delivery',
];

const MODELS = [
  'VoltIQ E-Hauler 800V',
  'Rivian EDV-700 Fleet',
  'Tesla Semi Heavy-Duty',
  'Volvo FL Electric Truck',
  'Proterra ZX5 Bus',
  'Lion Electric Lion6',
  'Freightliner eCascadia',
  'BrightDrop Zevo 600',
];

const CITIES = [
  { name: 'San Francisco, CA', lat: 37.7749, lng: -122.4194 },
  { name: 'Munich, Germany', lat: 48.1351, lng: 11.582 },
  { name: 'Tokyo, Japan', lat: 35.6762, lng: 139.6503 },
  { name: 'Seattle, WA', lat: 47.6062, lng: -122.3321 },
  { name: 'Chicago, IL', lat: 41.8781, lng: -87.6298 },
  { name: 'Amsterdam, Netherlands', lat: 52.3676, lng: 4.9041 },
  { name: 'Austin, TX', lat: 30.2672, lng: -97.7431 },
  { name: 'London, UK', lat: 51.5074, lng: -0.1278 },
];

function generateVIN(index: number): string {
  const chars = 'ABCDEFGHJKLMNPRSTUVWXYZ0123456789';
  let hash = '';
  for (let i = 0; i < 8; i++) {
    hash += chars[(index * 13 + i * 7) % chars.length];
  }
  return `1VQ9X${hash}${1000 + index}`;
}

function generateCells(): BatteryCell[] {
  const cells: BatteryCell[] = [];
  // 96 cells pack
  for (let i = 1; i <= 96; i++) {
    const isAnomalous = Math.random() < 0.04;
    const baseVoltage = 3.65;
    const voltageOffset = isAnomalous ? (Math.random() > 0.5 ? 0.35 : -0.4) : (Math.random() * 0.08 - 0.04);
    const baseTemp = 28.5;
    const tempOffset = isAnomalous ? Math.random() * 18 + 5 : Math.random() * 4 - 2;

    let status: BatteryCell['status'] = 'optimal';
    if (baseTemp + tempOffset > 42 || baseVoltage + voltageOffset < 3.2) {
      status = 'critical';
    } else if (baseTemp + tempOffset > 36 || Math.abs(voltageOffset) > 0.15) {
      status = 'warning';
    } else if (Math.abs(voltageOffset) > 0.08) {
      status = 'balancing';
    }

    cells.push({
      id: i,
      voltage: Number((baseVoltage + voltageOffset).toFixed(3)),
      temp: Number((baseTemp + tempOffset).toFixed(1)),
      status,
      soh: Number((99.5 - (Math.random() * 8)).toFixed(1)),
    });
  }
  return cells;
}

// Generate 300 vehicles deterministic mock data
export const MOCK_VEHICLES: Vehicle[] = Array.from({ length: 300 }).map((_, idx) => {
  const id = `V-${String(idx + 1).padStart(3, '0')}`;
  const vin = generateVIN(idx);
  const fleet = FLEETS[idx % FLEETS.length];
  const model = MODELS[idx % MODELS.length];
  const driver = DRIVERS[idx % DRIVERS.length];
  const cityObj = CITIES[idx % CITIES.length];

  // Distribute status: 60% Active, 22% Charging, 12% Maintenance, 6% Critical Alert
  let status: Vehicle['status'] = 'Active';
  const randStatus = (idx * 17) % 100;
  if (randStatus > 93) status = 'Critical Alert';
  else if (randStatus > 81) status = 'Maintenance';
  else if (randStatus > 59) status = 'Charging';

  const soc = status === 'Charging' ? Math.floor(25 + ((idx * 7) % 65)) : Math.floor(18 + ((idx * 13) % 78));
  const soh = Number((98.5 - ((idx % 45) * 0.35) - (idx > 200 ? 3.2 : 0)).toFixed(1));
  const packTemp = Number((26 + ((idx % 19) * 0.8) + (status === 'Critical Alert' ? 14 : 0)).toFixed(1));
  const minCellTemp = Number((packTemp - 2.1).toFixed(1));
  const maxCellTemp = Number((packTemp + 3.8).toFixed(1));
  const cycleCount = Math.floor(120 + idx * 8.5);
  const mileage = Math.floor(15400 + idx * 1120);
  const estimatedRangeKm = Math.floor((soc / 100) * 480);
  const cells = generateCells();
  const alertsCount = status === 'Critical Alert' ? 3 + (idx % 2) : (status === 'Maintenance' ? 1 : 0);
  
  const chargingSpeedKw = status === 'Charging' ? (idx % 2 === 0 ? 150 : 350) : undefined;

  return {
    id,
    vin,
    model,
    fleet,
    driver,
    status,
    soc,
    soh,
    packTemp,
    minCellTemp,
    maxCellTemp,
    voltage: Number((780 + (soc * 0.6)).toFixed(1)),
    current: status === 'Charging' ? 240 : (status === 'Active' ? 85 : 0),
    cycleCount,
    mileage,
    estimatedRangeKm,
    lat: cityObj.lat + (Math.sin(idx) * 0.18),
    lng: cityObj.lng + (Math.cos(idx) * 0.18),
    locationName: cityObj.name,
    degradationRate: Number((0.08 + (idx % 7) * 0.015).toFixed(3)),
    co2OffsetTons: Number((12.4 + idx * 0.65).toFixed(1)),
    cells,
    alertsCount,
    lastServiced: `${2026 - (idx % 2)}-0${(idx % 8) + 1}-15`,
    chargingSpeedKw,
    sessions: [
      {
        id: `S-${idx}-1`,
        timestamp: '2026-07-20 14:32',
        station: 'Ionity Supercharger #4',
        energyAddedKwh: 142,
        peakSpeedKw: 350,
        durationMins: 28,
        startSoc: 12,
        endSoc: 85,
        avgTemp: 34.2,
      },
      {
        id: `S-${idx}-2`,
        timestamp: '2026-07-18 09:15',
        station: 'VoltIQ Depot Charger A2',
        energyAddedKwh: 98,
        peakSpeedKw: 150,
        durationMins: 45,
        startSoc: 30,
        endSoc: 92,
        avgTemp: 29.8,
      },
    ],
  };
});

// Generated alerts
export const MOCK_ALERTS: Alert[] = [
  {
    id: 'ALT-901',
    vin: MOCK_VEHICLES[12].vin,
    vehicleModel: MOCK_VEHICLES[12].model,
    timestamp: '2026-07-21 16:12:05',
    message: 'Cell #43 thermal runaway risk detected. Pack temp exceeded 48.5°C.',
    severity: 'critical',
    category: 'Thermal',
  },
  {
    id: 'ALT-902',
    vin: MOCK_VEHICLES[45].vin,
    vehicleModel: MOCK_VEHICLES[45].model,
    timestamp: '2026-07-21 15:58:30',
    message: 'Voltage divergence in Module B (Delta > 180mV). Balancing engaged.',
    severity: 'warning',
    category: 'Voltage Imbalance',
  },
  {
    id: 'ALT-903',
    vin: MOCK_VEHICLES[89].vin,
    vehicleModel: MOCK_VEHICLES[89].model,
    timestamp: '2026-07-21 14:40:12',
    message: 'Accelerated capacity loss detected (+0.04% per 100 cycles above baseline).',
    severity: 'warning',
    category: 'Degradation',
  },
  {
    id: 'ALT-904',
    vin: MOCK_VEHICLES[104].vin,
    vehicleModel: MOCK_VEHICLES[104].model,
    timestamp: '2026-07-21 13:10:00',
    message: 'Coolant line pressure drop in primary battery chiller loop.',
    severity: 'critical',
    category: 'BMS Fault',
  },
  {
    id: 'ALT-905',
    vin: MOCK_VEHICLES[3].vin,
    vehicleModel: MOCK_VEHICLES[3].model,
    timestamp: '2026-07-21 11:22:45',
    message: 'Ultra-fast charging throttled due to high ambient temperature (38°C).',
    severity: 'info',
    category: 'Charging Speed',
  },
  {
    id: 'ALT-906',
    vin: MOCK_VEHICLES[150].vin,
    vehicleModel: MOCK_VEHICLES[150].model,
    timestamp: '2026-07-21 10:05:18',
    message: 'BMS firmware checksum validation complete. Update v4.2.1 installed.',
    severity: 'info',
    category: 'BMS Fault',
  },
];

// Generated AI Recommendations
export const MOCK_AI_RECOMMENDATIONS: AIRecommendation[] = [
  {
    id: 'REC-01',
    vin: MOCK_VEHICLES[12].vin,
    title: 'Pre-cool Pack prior to 350kW Mega-Charging',
    impact: 'High',
    description: 'Predictive thermal model forecasts pack temperature will hit 52°C if fast charging starts at ambient 34°C. Trigger pre-cooling 15 mins prior to arrival.',
    actionText: 'Enable Auto Pre-Cooling',
    estimatedSavings: '+1.4 Years Pack Lifespan',
    category: 'Preventative',
  },
  {
    id: 'REC-02',
    vin: MOCK_VEHICLES[45].vin,
    title: 'Shift Overnight Charging Window by +2 Hours',
    impact: 'Medium',
    description: 'Grid electricity rates in San Francisco region drop by 42% at 02:00 AM while battery thermal stress drops by 18%.',
    actionText: 'Reschedule Charging Schedule',
    estimatedSavings: '$14,200 / Year Fleet Operating Cost',
    category: 'Charging',
  },
  {
    id: 'REC-03',
    vin: MOCK_VEHICLES[89].vin,
    title: 'Cell Module #3 Re-balancing Schedule',
    impact: 'High',
    description: 'Module 3 displays a persistent 95mV delta under high torque acceleration. Perform off-peak active balancing sequence.',
    actionText: 'Schedule Active Balancing',
    estimatedSavings: 'Prevent Module Failure',
    category: 'Preventative',
  },
  {
    id: 'REC-04',
    vin: MOCK_VEHICLES[210].vin,
    title: 'Reroute Heavy Haul #2 via Flat Terrain Highway',
    impact: 'Low',
    description: 'Current steep gradient route causes 2.4C discharge spikes, inducing local dendrite growth risks on 800V silicon anode cells.',
    actionText: 'Update Navigation Route',
    estimatedSavings: '+45 km Extra Range per Shift',
    category: 'Route',
  },
];

// Features List for Features Page & Modals
export const FEATURE_SPECS: FeatureSpec[] = [
  {
    id: 'feat-battery-intel',
    title: 'Battery Intelligence Engine',
    subtitle: 'Microscopic Cell-Level Diagnostics',
    iconName: 'Cpu',
    summary: 'Sub-second telemetry monitoring voltage, internal resistance, and thermal gradient across all pack modules in real time.',
    detailedDescription: [
      'VoltIQ’s proprietary physics-informed neural networks monitor electro-thermal dynamics down to individual battery cells.',
      'Identify localized hot spots, dendrite formation precursors, and internal resistance spikes weeks before traditional BMS hardware triggers an emergency fault code.',
      'Continuous calibration of State of Charge (SOC) and State of Health (SOH) with less than 0.5% margin of error.',
    ],
    specs: [
      { label: 'Sampling Rate', value: '1,000 Hz / Module' },
      { label: 'Cell Accuracy', value: '±0.002 V' },
      { label: 'Thermal Sensors', value: '32 per Pack' },
    ],
    tags: ['Physics-AI', 'Real-Time Telemetry', 'Sub-Cell Resolution'],
    demoMetric: '99.85% Degradation Accuracy',
  },
  {
    id: 'feat-fleet-analytics',
    title: 'Fleet Battery Analytics',
    subtitle: 'Unified Mission Control Operations',
    iconName: 'BarChart3',
    summary: 'Centralized telemetry dashboard tracking energy throughput, CO2 offsets, degradation velocities, and operational ROI across hundreds of vehicles.',
    detailedDescription: [
      'Comprehensive fleet dashboard built specifically for enterprise fleet operators, depot managers, and chief sustainability officers.',
      'Compare performance between vehicle OEMs (Tesla, Volvo, Rivian, Freightliner) under identical real-world payload and weather conditions.',
      'Custom KPI exports, automated compliance audit reporting, and multi-tier role-based access control.',
    ],
    specs: [
      { label: 'Max Vehicles', value: '100,000+' },
      { label: 'Data Retention', value: '10 Years Raw Telemetry' },
      { label: 'Export Formats', value: 'CSV, JSON, PDF Audit' },
    ],
    tags: ['Mission Control', 'Multi-OEM Support', 'Executive Reporting'],
    demoMetric: '300+ Active Vehicles Tracked',
  },
  {
    id: 'feat-predictive-maint',
    title: 'Predictive Maintenance AI',
    subtitle: 'Zero Unplanned Downtime',
    iconName: 'Wrench',
    summary: 'Machine learning algorithms that predict cell degradation, chiller pump failures, and BMS anomalies 30 days before component breakdown.',
    detailedDescription: [
      'Transition from reactive repair schedules to condition-based, predictive battery maintenance.',
      'Our deep learning models analyze historical charging curves, ambient temperature exposure, and vibrational stress to generate action alerts.',
      'Directly sync with enterprise ERP and garage maintenance software to auto-order replacement cell modules.',
    ],
    specs: [
      { label: 'Lead Time', value: '30 Days Advance Notice' },
      { label: 'False Positive', value: '< 0.12%' },
      { label: 'Downtime Avoided', value: '-84% Unplanned Stoppage' },
    ],
    tags: ['Machine Learning', 'Auto-Work Orders', 'Zero Downtime'],
    demoMetric: '30-Day Warning Lead Time',
  },
  {
    id: 'feat-charging-opt',
    title: 'Smart Charging Optimization',
    subtitle: 'Depot & Grid Energy Orchestration',
    iconName: 'Zap',
    summary: 'Intelligent fast-charging protocols that minimize peak demand charges, extend pack lifespan, and integrate with renewable microgrids.',
    detailedDescription: [
      'Dynamically modulate charging current based on real-time cell temperatures, electricity spot pricing, and morning shift departure schedules.',
      'Prevent lithium plating during freezing winter morning quick-charges with auto-preconditioning routines.',
      'Seamless Vehicle-to-Grid (V2G) and Vehicle-to-Building (V2B) peak shaving algorithms.',
    ],
    specs: [
      { label: 'Demand Savings', value: 'Up to 38% Grid Cost' },
      { label: 'V2G Protocol', value: 'ISO 15118-20 Compliant' },
      { label: 'Max Power', value: '1.2 MW Depot Hub' },
    ],
    tags: ['Depot Energy', 'Smart Grid', 'V2G Ready'],
    demoMetric: '38% Energy Cost Reduction',
  },
  {
    id: 'feat-ai-insights',
    title: 'AI Copilot & Recommendations',
    subtitle: 'Autonomous Battery Advisory',
    iconName: 'Sparkles',
    summary: 'Autonomous advisory engine generating step-by-step actionable recommendations for drivers, fleet managers, and technicians.',
    detailedDescription: [
      'Turn complex electrochemical data into plain-language actionable recommendations.',
      'Automated daily fleet health digest highlighting high-risk vehicles, route optimizations, and energy conservation tips.',
      'Interactive natural language query interface for instant fleet lookup.',
    ],
    specs: [
      { label: 'AI Architecture', value: 'VoltIQ Battery-LLM' },
      { label: 'Response Latency', value: '< 250ms' },
      { label: 'Recommendation Accuracy', value: '98.7%' },
    ],
    tags: ['LLM Battery Agent', 'Actionable Insights', 'Auto-Remediation'],
    demoMetric: 'Instant Tactical AI Advice',
  },
  {
    id: 'feat-digital-twin',
    title: 'Pack Digital Twin',
    subtitle: 'High-Fidelity Virtual Emulation',
    iconName: 'Box',
    summary: 'Real-time electrochemical digital twin simulating ion diffusion, SEI layer growth, and stress fracture propagation in parallel.',
    detailedDescription: [
      'Every physical battery pack connected to VoltIQ has a synchronized 1:1 virtual replica running in the cloud.',
      'Simulate the impact of fast-charging at 40°C vs 20°C before applying power to physical hardware.',
      'Accurate remaining useful life (RUL) estimation backed by physics-based differential equations.',
    ],
    specs: [
      { label: 'Model Resolution', value: 'Physical Electrochemical' },
      { label: 'Simulation Speed', value: '100x Real Time' },
      { label: 'SEI Tracking', value: 'Atomic Level Simulation' },
    ],
    tags: ['Digital Twin', 'SEI Physics Model', 'RUL Forecasting'],
    demoMetric: '100x Faster-Than-Real-Time Simulation',
  },
  {
    id: 'feat-energy-forecasting',
    title: 'Energy & Range Forecasting',
    subtitle: 'Precision Consumption Physics',
    iconName: 'TrendingUp',
    summary: 'Predict exact kilowatt-hour consumption considering elevation changes, wind resistance, vehicle payload, and cabin HVAC load.',
    detailedDescription: [
      'Stop range anxiety with hyper-accurate route energy modeling calibrated for heavy-duty electric trucks and transit buses.',
      'Factor in live weather feeds, traffic congestion, driver driving aggressiveness index, and battery state-of-charge curves.',
      'Integrate directly into dispatcher logistics planning toolchains.',
    ],
    specs: [
      { label: 'Range Error', value: '< 1.8 km per 300 km' },
      { label: 'Weather Feed', value: 'Live 10-minute Update' },
      { label: 'Elevation Resolution', value: '1-meter Topography' },
    ],
    tags: ['Physics Energy Model', 'Zero Range Anxiety', 'Depot Logistics'],
    demoMetric: '±1.8km Range Accuracy',
  },
  {
    id: 'feat-live-alerts',
    title: 'Control Room Live Alerts',
    subtitle: 'Instant Safety & Fault Sentinel',
    iconName: 'BellRing',
    summary: 'Multi-channel alarm routing sending instant Push, SMS, and Webhook alerts for critical thermal, insulation, and BMS warnings.',
    detailedDescription: [
      'Industrial grade notification engine with zero-latency alert delivery.',
      'Configurable threshold rules based on multi-parameter triggers (e.g. Temp > 45°C AND Delta V > 100mV).',
      'Automated emergency vehicle shutdown sequence protocols for severe thermal events.',
    ],
    specs: [
      { label: 'Latency', value: '< 50ms Delivery' },
      { label: 'Channels', value: 'Slack, Webhook, SMS, PagerDuty' },
      { label: 'Fault Isolation', value: 'Automated Contactors Trigger' },
    ],
    tags: ['Safety First', 'Low-Latency Alerting', 'Industrial Grade'],
    demoMetric: '< 50ms Critical Alert Trigger',
  },
];

// Team Members for Team Page
export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'team-1',
    name: 'Dr. Evelyn Vance',
    role: 'Founder & Chief Scientist',
    bio: 'Former NASA JPL Electro-chemist and Senior Battery Architect at Tesla. 15+ years researching solid-state electrolytes & battery degradation physics.',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    linkedin: 'https://linkedin.com',
    github: 'https://github.com',
    twitter: 'https://twitter.com',
    badge: 'Electrochemical Physics',
    specialty: 'SEI Layer Modeling & Solid State',
  },
  {
    id: 'team-2',
    name: 'Marcus Thorne',
    role: 'Head of Fleet AI & Systems',
    bio: 'Ex-DeepMind AI Researcher specializing in physics-informed neural networks. Built autonomous grid dispatch algorithms managing 2GW+ power.',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    linkedin: 'https://linkedin.com',
    github: 'https://github.com',
    twitter: 'https://twitter.com',
    badge: 'Neural Architecture',
    specialty: 'Time-Series Physics AI',
  },
  {
    id: 'team-3',
    name: 'Sofia Ramirez',
    role: 'VP of Product Engineering',
    bio: 'Led heavy vehicle EV telemetry platforms at Volvo Group and Rivian Commercial. Obsessed with high-throughput real-time industrial UI.',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80',
    linkedin: 'https://linkedin.com',
    github: 'https://github.com',
    twitter: 'https://twitter.com',
    badge: 'Enterprise Product',
    specialty: 'Real-Time Mission Control Systems',
  },
  {
    id: 'team-4',
    name: 'David K. Chen',
    role: 'Principal Firmware Architect',
    bio: 'Pioneer in CANbus and ISO 15118 high-voltage BMS communications. Authored 12 patents in active cell balancing circuitry.',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    linkedin: 'https://linkedin.com',
    github: 'https://github.com',
    twitter: 'https://twitter.com',
    badge: 'Embedded BMS',
    specialty: 'High-Voltage Hardware Telemetry',
  },
];

// Testimonials for Home Page
export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Henrik Lindberg',
    title: 'VP of Fleet Operations',
    company: 'Nordic TransLogistics',
    quote: 'VoltIQ prevented three catastrophic thermal runaway events in our heavy haul truck fleet in sub-zero Swedish winter. The cell-level matrix view is indispensable.',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    fleetSize: '450 Electric Trucks',
    co2Saved: '4,200 Tons CO₂ / Year',
  },
  {
    id: 'test-2',
    name: 'Sarah Jenkins',
    title: 'Director of Clean Transit',
    company: 'Metro City Transit Authority',
    quote: 'We extended our transit bus battery lifespan by 2.8 years using VoltIQ’s smart charging pre-conditioning schedules. Savings run in millions.',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    fleetSize: '220 Transit Buses',
    co2Saved: '8,900 Tons CO₂ / Year',
  },
  {
    id: 'test-3',
    name: 'Carlos Mendez',
    title: 'Chief Logistics Officer',
    company: 'AmeriFreight Logistics',
    quote: 'The AI recommendation copilot flagged cell voltage divergence before our OEM service team even noticed. VoltIQ paid for itself in month one.',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    fleetSize: '1,200 Delivery Vans',
    co2Saved: '15,400 Tons CO₂ / Year',
  },
];

// FAQs for Home Page
export const FAQ_ITEMS: FAQItem[] = [
  {
    question: 'How does VoltIQ connect to our existing EV fleet vehicles?',
    answer: 'VoltIQ connects via lightweight CANbus telemetry dongles, direct OEM cloud API integrations (Tesla, Rivian, Volvo, Freightliner), or standardized J1939 protocols with zero hardware modification required.',
    category: 'Integration',
  },
  {
    question: 'How accurate is VoltIQ’s State of Health (SOH) and degradation prediction?',
    answer: 'VoltIQ combines electrochemical physics models with deep neural networks trained on over 2.5 billion miles of EV battery telemetry, yielding an SOH precision of ±0.5% and a 30-day degradation forecasting accuracy of 99.85%.',
    category: 'Technology',
  },
  {
    question: 'What security certifications does VoltIQ hold for enterprise grid data?',
    answer: 'VoltIQ is SOC 2 Type II, ISO 27001, and GDPR compliant. All vehicle telemetry streams are encrypted in transit via TLS 1.3 and at rest using AES-256 with hardware security module (HSM) key management.',
    category: 'Security',
  },
  {
    question: 'Can VoltIQ manage multi-brand EV fleets with different battery chemistries?',
    answer: 'Yes. VoltIQ natively supports LFP (Lithium Iron Phosphate), NMC (Nickel Manganese Cobalt), NCA, and emerging solid-state battery chemistries across 40+ commercial EV chassis models.',
    category: 'Hardware',
  },
  {
    question: 'How does smart charging optimization reduce grid demand charges?',
    answer: 'VoltIQ communicates with your depot EVSE chargers via OCPP 2.0.1 to modulate charging speeds according to local utility peak pricing tiers, thermal pre-conditioning needs, and morning dispatch timetables.',
    category: 'Energy',
  },
];
