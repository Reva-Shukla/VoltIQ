import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid } from 'recharts';
import { Thermometer, Flame } from 'lucide-react';
import { Card } from '../ui/Card';

const thermalData = [
  { fleet: 'Urban Logistics', avgTemp: 28.4, maxTemp: 34.2, thermalAlerts: 2 },
  { fleet: 'Heavy Haul', avgTemp: 36.8, maxTemp: 44.5, thermalAlerts: 7 },
  { fleet: 'Bus Transit', avgTemp: 31.2, maxTemp: 38.0, thermalAlerts: 3 },
  { fleet: 'Regional Delivery', avgTemp: 27.9, maxTemp: 33.1, thermalAlerts: 1 },
];

const hourlyThermalGradient = [
  { time: '00:00', temp: 24.1, chargingLoadKw: 120 },
  { time: '04:00', temp: 22.8, chargingLoadKw: 350 },
  { time: '08:00', temp: 29.4, chargingLoadKw: 800 },
  { time: '12:00', temp: 38.2, chargingLoadKw: 450 },
  { time: '16:00', temp: 41.5, chargingLoadKw: 950 },
  { time: '20:00', temp: 32.7, chargingLoadKw: 600 },
];

export const ThermalHeatmap: React.FC = () => {
  return (
    <Card className="border-charcoal-600/40 p-5 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-charcoal-700/40">
        <div className="flex items-center gap-2">
          <Thermometer className="w-5 h-5 text-amber-400" />
          <h3 className="text-base font-display font-bold text-slate-100">
            Sub-Fleet Thermal Distribution & Hourly Gradient
          </h3>
        </div>
        <span className="text-xs font-mono text-slate-400">
          Peak Thermal: 44.5 °C (Heavy Haul)
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
        {/* Sub-fleet thermal comparison bar chart */}
        <div>
          <p className="text-xs font-mono text-slate-400 mb-3 uppercase tracking-wider">Average & Peak Temp by Fleet Subgroup (°C)</p>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={thermalData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222B3A" />
                <XAxis dataKey="fleet" stroke="#94A3B8" fontSize={10} fontFamily="JetBrains Mono" />
                <YAxis stroke="#94A3B8" fontSize={10} fontFamily="JetBrains Mono" unit="°C" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0B0D12', borderColor: '#3D4D68', borderRadius: '12px', fontSize: '11px', fontFamily: 'JetBrains Mono' }}
                />
                <Bar dataKey="avgTemp" name="Avg Temp °C" fill="#00E5FF" radius={[4, 4, 0, 0]} />
                <Bar dataKey="maxTemp" name="Max Temp °C" fill="#EF4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Hourly Thermal Gradient Area Chart */}
        <div>
          <p className="text-xs font-mono text-slate-400 mb-3 uppercase tracking-wider">24-Hour Diurnal Ambient & Charging Thermal Gradient</p>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyThermalGradient}>
                <defs>
                  <linearGradient id="tempGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#222B3A" />
                <XAxis dataKey="time" stroke="#94A3B8" fontSize={10} fontFamily="JetBrains Mono" />
                <YAxis stroke="#94A3B8" fontSize={10} fontFamily="JetBrains Mono" unit="°C" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0B0D12', borderColor: '#3D4D68', borderRadius: '12px', fontSize: '11px', fontFamily: 'JetBrains Mono' }}
                />
                <Area type="monotone" dataKey="temp" name="Pack Temp °C" stroke="#F59E0B" fillOpacity={1} fill="url(#tempGlow)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </Card>
  );
};
