import React, { useState } from 'react';
import { Radio, Zap, Navigation, ShieldCheck, MapPin } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface Hub {
  id: string;
  name: string;
  state: string;
  vehicles: number;
  avgSoh: number;
  gridPower: string;
  cx: number;
  cy: number;
}

const HUBS: Hub[] = [
  { id: 'delhi', name: 'Delhi NCR Hub', state: 'Delhi / Haryana', vehicles: 120, avgSoh: 92.4, gridPower: '450 kW Fast', cx: 340, cy: 220 },
  { id: 'jaipur', name: 'Jaipur Logistics Hub', state: 'Rajasthan', vehicles: 45, avgSoh: 89.8, gridPower: '240 kW Fast', cx: 200, cy: 310 },
  { id: 'chandigarh', name: 'Chandigarh Transit Hub', state: 'Punjab / Haryana', vehicles: 35, avgSoh: 94.1, gridPower: '180 kW Fast', cx: 310, cy: 110 },
  { id: 'lucknow', name: 'Lucknow Fleet Depot', state: 'Uttar Pradesh', vehicles: 50, avgSoh: 90.5, gridPower: '300 kW Fast', cx: 560, cy: 290 },
  { id: 'dehradun', name: 'Dehradun Mountain Corridor', state: 'Uttarakhand', vehicles: 25, avgSoh: 88.2, gridPower: '120 kW Normal', cx: 430, cy: 120 },
  { id: 'agra', name: 'Agra Freight Depot', state: 'Uttar Pradesh', vehicles: 25, avgSoh: 91.0, gridPower: '150 kW Fast', cx: 390, cy: 290 },
];

export const NorthIndiaMap: React.FC = () => {
  const [selectedHub, setSelectedHub] = useState<Hub>(HUBS[0]);

  return (
    <Card className="p-6 md:p-8 border-[#26D7E7]/20 bg-[#10264F]/50 backdrop-blur-xl relative overflow-hidden space-y-6">
      {/* Background blueprint grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-15 pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
        <div>
          <div className="flex items-center gap-2.5">
            <Radio className="w-5 h-5 text-[#26D7E7] animate-pulse" />
            <h3 className="text-xl md:text-2xl font-display font-extrabold text-[#F8FAFC]">
              North India Fleet Intelligence Corridor
            </h3>
            <Badge variant="teal" size="sm">LIVE SVG TELEMETRY</Badge>
          </div>
          <p className="text-xs text-[#94A3B8] font-mono mt-1">
            Real-time grid loading & fleet telemetry across key North Indian EV logistics routes
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono text-[#CBD5E1]">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#081A3A] border border-[#26D7E7]/30">
            <span className="w-2 h-2 rounded-full bg-[#26D7E7] animate-ping" />
            Active Hubs: 6 Cities
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#081A3A] border border-[#31C48D]/30 text-[#31C48D]">
            300 Commercial EVs Connected
          </span>
        </div>
      </div>

      {/* Main Interactive Map & Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        {/* SVG Regional Vector Map (8 columns) */}
        <div className="lg:col-span-8 relative bg-[#081A3A]/90 rounded-2xl border border-[#18346B] p-4 min-h-[380px] flex items-center justify-center shadow-inner">
          <svg viewBox="0 0 700 450" className="w-full h-auto max-h-[420px] select-none">
            <defs>
              {/* Radial Glow Gradient */}
              <radialGradient id="hubGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#6EE7F7" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#26D7E7" stopOpacity="0" />
              </radialGradient>
              {/* Route Line Gradient */}
              <linearGradient id="routeLine" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#26D7E7" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#2FAEAE" stopOpacity="0.3" />
              </linearGradient>
            </defs>

            {/* Stylized Regional State Outlines */}
            <path
              d="M 120 80 L 280 40 L 480 50 L 620 180 L 650 360 L 480 410 L 280 390 L 100 320 L 80 180 Z"
              fill="#10264F"
              fillOpacity="0.4"
              stroke="#18346B"
              strokeWidth="2"
              strokeDasharray="6 4"
            />

            {/* Connecting Telemetry Routes */}
            {/* Delhi to Chandigarh */}
            <line x1="340" y1="220" x2="310" y2="110" stroke="url(#routeLine)" strokeWidth="2.5" strokeDasharray="5 5" className="animate-pulse" />
            {/* Delhi to Jaipur */}
            <line x1="340" y1="220" x2="200" y2="310" stroke="url(#routeLine)" strokeWidth="2.5" strokeDasharray="5 5" className="animate-pulse" />
            {/* Delhi to Agra */}
            <line x1="340" y1="220" x2="390" y2="290" stroke="url(#routeLine)" strokeWidth="2.5" />
            {/* Agra to Lucknow */}
            <line x1="390" y1="290" x2="560" y2="290" stroke="url(#routeLine)" strokeWidth="2" strokeDasharray="4 4" />
            {/* Delhi to Dehradun */}
            <line x1="340" y1="220" x2="430" y2="120" stroke="url(#routeLine)" strokeWidth="2" />

            {/* Interactive Hub Markers */}
            {HUBS.map((hub) => {
              const isSelected = selectedHub.id === hub.id;
              return (
                <g
                  key={hub.id}
                  onClick={() => setSelectedHub(hub)}
                  className="cursor-pointer group"
                >
                  {/* Outer Pulsing Ring */}
                  <circle
                    cx={hub.cx}
                    cy={hub.cy}
                    r={isSelected ? "22" : "14"}
                    fill="url(#hubGlow)"
                    className={isSelected ? "animate-ping opacity-75" : "opacity-30 group-hover:opacity-75"}
                  />
                  {/* Outer Border Circle */}
                  <circle
                    cx={hub.cx}
                    cy={hub.cy}
                    r={isSelected ? "12" : "8"}
                    fill={isSelected ? "#26D7E7" : "#10264F"}
                    stroke={isSelected ? "#6EE7F7" : "#26D7E7"}
                    strokeWidth={isSelected ? "3" : "2"}
                    className="transition-all duration-300"
                  />
                  {/* Center Dot */}
                  <circle
                    cx={hub.cx}
                    cy={hub.cy}
                    r="4"
                    fill={isSelected ? "#081A3A" : "#6EE7F7"}
                  />
                  {/* Hub City Name Label */}
                  <text
                    x={hub.cx}
                    y={hub.cy - 16}
                    textAnchor="middle"
                    fill={isSelected ? "#6EE7F7" : "#CBD5E1"}
                    fontSize={isSelected ? "13" : "11"}
                    fontFamily="Space Grotesk"
                    fontWeight={isSelected ? "700" : "500"}
                    className="transition-all duration-300"
                  >
                    {hub.name.replace(' Hub', '').replace(' Corridor', '').replace(' Fleet Depot', '').replace(' Logistics', '')}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Selected Hub Telemetry Inspector (4 columns) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-2xl bg-[#081A3A] border border-[#26D7E7]/30 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#18346B]">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#26D7E7]" />
                <h4 className="font-display font-bold text-[#F8FAFC] text-base">{selectedHub.name}</h4>
              </div>
              <Badge variant="teal" size="sm">{selectedHub.state}</Badge>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between items-center py-1 border-b border-[#18346B]/50">
                <span className="text-[#94A3B8]">Active Fleets:</span>
                <span className="text-[#F8FAFC] font-bold text-sm">{selectedHub.vehicles} EVs</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-[#18346B]/50">
                <span className="text-[#94A3B8]">Average SOH:</span>
                <span className="text-[#31C48D] font-bold text-sm">{selectedHub.avgSoh}%</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-[#18346B]/50">
                <span className="text-[#94A3B8]">Depot Grid Infrastructure:</span>
                <span className="text-[#FBBF24] font-bold">{selectedHub.gridPower}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-[#94A3B8]">CANbus Sampling:</span>
                <span className="text-[#26D7E7]">1,000 Hz Sub-Second</span>
              </div>
            </div>

            <div className="pt-2">
              <p className="text-[11px] text-[#94A3B8] leading-relaxed">
                Connected to VoltIQ central telemetry pipeline. Continuous cell thermal balance and state of charge stream active.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
