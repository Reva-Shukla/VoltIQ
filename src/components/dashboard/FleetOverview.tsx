import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Zap, AlertTriangle, Leaf, Gauge, BatteryCharging } from 'lucide-react';
import { useFleet } from '../../contexts/FleetContext';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

export const FleetOverview: React.FC = () => {
  const { fleetKPIs } = useFleet();

  const stats = [
    {
      label: 'Fleet Health (SOH)',
      value: `${fleetKPIs.avgSOH}%`,
      sub: 'Optimal (>95% SOH)',
      icon: ShieldCheck,
      color: 'teal',
      badge: '+0.4% vs benchmark',
      glow: 'teal' as const,
    },
    {
      label: 'Active Energy Throughput',
      value: `${fleetKPIs.totalEnergyMwh} MWh`,
      sub: `${fleetKPIs.activeVehicles} on road • ${fleetKPIs.chargingVehicles} charging`,
      icon: Zap,
      color: 'amber',
      badge: 'Peak 350kW Mega-Charge',
      glow: 'amber' as const,
    },
    {
      label: 'Active Telemetry Alerts',
      value: fleetKPIs.activeAlerts.toString(),
      sub: `${fleetKPIs.criticalVehicles} Critical • ${fleetKPIs.maintenanceVehicles} Pending Service`,
      icon: AlertTriangle,
      color: 'rust',
      badge: fleetKPIs.criticalVehicles > 0 ? 'Requires Action' : 'Stable',
      glow: 'rust' as const,
    },
    {
      label: 'Lifetime CO₂ Offset',
      value: `${fleetKPIs.co2OffsetTons} Tons`,
      sub: 'Equivalent to 84,000 trees planted',
      icon: Leaf,
      color: 'emerald',
      badge: 'Clean Energy Fleet',
      glow: 'teal' as const,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.label} hoverEffect glowColor={stat.glow} className="p-5 border-charcoal-600/40">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-xl bg-charcoal-800/80 border border-charcoal-600/50 text-teal-400">
                <Icon className="w-5 h-5" />
              </div>
              <Badge variant={stat.color === 'rust' ? 'critical' : (stat.color === 'amber' ? 'amber' : 'teal')} size="sm">
                {stat.badge}
              </Badge>
            </div>

            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-slate-400">{stat.label}</p>
              <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-100 mt-1">
                {stat.value}
              </h3>
              <p className="text-[11px] font-mono text-slate-400 mt-1.5 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                {stat.sub}
              </p>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
