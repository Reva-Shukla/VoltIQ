import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Compass, Radio, Maximize2 } from 'lucide-react';
import { useFleet } from '../../contexts/FleetContext';
import { Vehicle } from '../../types';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { cn } from '../../utils/cn';

export const FleetMap: React.FC = () => {
  const { filteredVehicles, setSelectedVehicle, selectedVehicle } = useFleet();
  const [hoveredVehicle, setHoveredVehicle] = useState<Vehicle | null>(null);

  // Map viewport dimensions
  const mapWidth = 900;
  const mapHeight = 440;

  // Simple Mercator-like projection mapping Lat/Lng to SVG canvas space
  const projectCoords = (lat: number, lng: number) => {
    const x = ((lng + 180) / 360) * mapWidth;
    const y = ((90 - lat) / 180) * mapHeight;
    return { x, y };
  };

  const visibleVehicles = filteredVehicles.slice(0, 75); // Display top 75 pins for performance

  return (
    <Card className="relative p-5 border-charcoal-600/40 overflow-hidden">
      {/* Map Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-3 border-b border-charcoal-700/40">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-teal-400 animate-pulse" />
            <h3 className="text-base font-display font-bold text-slate-100">
              Live Fleet Telemetry Map & Depot Stations
            </h3>
          </div>
          <p className="text-xs font-mono text-slate-400 mt-0.5">
            Mission Control Position • Displaying {visibleVehicles.length} Active Vehicles
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Active
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-400" /> Charging
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Maintenance
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400 animate-ping" /> Alert
          </span>
        </div>
      </div>

      {/* SVG Canvas Map Container */}
      <div className="relative w-full h-[380px] bg-graphite-900 rounded-2xl border border-charcoal-700/50 overflow-hidden">
        {/* Background Grid & Radar Sweep */}
        <div className="absolute inset-0 bg-cyber-grid opacity-40 pointer-events-none" />
        
        {/* Rotating Radar Sweep Beam */}
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] -mt-[300px] -ml-[300px] pointer-events-none">
          <div className="w-full h-full rounded-full border border-teal-500/20 animate-radar-sweep origin-center bg-[conic-gradient(from_0deg,transparent_0_300deg,rgba(0,229,255,0.15)_360deg)]" />
        </div>

        {/* Global World Map Paths (Simplified Futuristic Contour Outlines) */}
        <svg viewBox={`0 0 ${mapWidth} ${mapHeight}`} className="w-full h-full relative z-10">
          {/* North America */}
          <path
            d="M 120 100 Q 180 60 260 90 T 320 180 T 220 280 T 150 200 Z"
            fill="rgba(30, 41, 59, 0.5)"
            stroke="rgba(0, 229, 255, 0.2)"
            strokeWidth="1"
          />
          {/* Europe & Asia */}
          <path
            d="M 450 80 Q 580 40 750 90 T 820 220 T 680 280 T 520 200 Z"
            fill="rgba(30, 41, 59, 0.5)"
            stroke="rgba(0, 229, 255, 0.2)"
            strokeWidth="1"
          />
          {/* South America */}
          <path
            d="M 280 290 Q 320 320 300 400 T 260 360 Z"
            fill="rgba(30, 41, 59, 0.4)"
            stroke="rgba(0, 229, 255, 0.15)"
            strokeWidth="1"
          />

          {/* Depot Hub Target Rings */}
          {[
            { name: 'SF Depot', lat: 37.77, lng: -122.41 },
            { name: 'Munich Depot', lat: 48.13, lng: 11.58 },
            { name: 'Tokyo Depot', lat: 35.67, lng: 139.65 },
          ].map((depot) => {
            const { x, y } = projectCoords(depot.lat, depot.lng);
            return (
              <g key={depot.name} transform={`translate(${x}, ${y})`}>
                <circle r="18" fill="none" stroke="rgba(0, 229, 255, 0.2)" strokeDasharray="3 3" />
                <circle r="4" fill="#00E5FF" />
                <text y="-10" textAnchor="middle" fill="#94A3B8" fontSize="9" fontFamily="JetBrains Mono">
                  {depot.name}
                </text>
              </g>
            );
          })}

          {/* Vehicle Markers */}
          {visibleVehicles.map((vehicle) => {
            const { x, y } = projectCoords(vehicle.lat, vehicle.lng);
            const isSelected = selectedVehicle?.id === vehicle.id;

            let color = '#10B981'; // Active
            if (vehicle.status === 'Charging') color = '#00E5FF';
            else if (vehicle.status === 'Maintenance') color = '#F59E0B';
            else if (vehicle.status === 'Critical Alert') color = '#EF4444';

            return (
              <g
                key={vehicle.id}
                transform={`translate(${x}, ${y})`}
                className="cursor-pointer transition-transform hover:scale-125"
                onClick={() => setSelectedVehicle(vehicle)}
                onMouseEnter={() => setHoveredVehicle(vehicle)}
                onMouseLeave={() => setHoveredVehicle(null)}
              >
                {/* Ping Pulse animation */}
                <circle r={isSelected ? 10 : 6} fill={color} opacity="0.3" className="animate-ping" />
                <circle r={isSelected ? 6 : 4} fill={color} stroke="#0B0D12" strokeWidth="1.5" />
              </g>
            );
          })}
        </svg>

        {/* Hovered Vehicle Quick Tooltip */}
        {hoveredVehicle && (
          <div className="absolute top-4 right-4 z-20 p-3.5 rounded-xl glass-panel border border-teal-500/40 bg-graphite-950/90 text-xs font-mono max-w-xs space-y-1 shadow-2xl">
            <p className="font-bold text-slate-100 flex items-center justify-between">
              <span>{hoveredVehicle.id} ({hoveredVehicle.vin})</span>
              <Badge size="sm" variant={hoveredVehicle.status === 'Critical Alert' ? 'critical' : 'teal'}>
                {hoveredVehicle.status}
              </Badge>
            </p>
            <p className="text-slate-300">{hoveredVehicle.model}</p>
            <p className="text-slate-400">Driver: {hoveredVehicle.driver}</p>
            <div className="pt-1.5 flex items-center justify-between text-[11px] text-teal-400 border-t border-charcoal-700">
              <span>SOH: {hoveredVehicle.soh}%</span>
              <span>SOC: {hoveredVehicle.soc}%</span>
              <span>{hoveredVehicle.packTemp}°C</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
