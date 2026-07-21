import React from 'react';
import { ShieldAlert, CheckCircle2, Bell, Clock, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { useFleet } from '../../contexts/FleetContext';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

export const AlertTimeline: React.FC = () => {
  const { alerts, resolveAlert } = useFleet();

  const handleResolve = (id: string, msg: string) => {
    resolveAlert(id);
    toast.success(`Alert ${id} Marked Resolved`, {
      description: `BMS diagnostic log updated for: "${msg}"`,
    });
  };

  return (
    <Card className="border-charcoal-600/40 p-5 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-charcoal-700/40">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-rust animate-pulse" />
          <h3 className="text-base font-display font-bold text-slate-100">
            Control Room Live Alert Sentinel Feed
          </h3>
        </div>
        <span className="text-xs font-mono text-slate-400">
          {alerts.length} Active Warnings
        </span>
      </div>

      {alerts.length === 0 ? (
        <div className="p-8 text-center text-slate-400 font-mono text-xs flex flex-col items-center gap-2">
          <CheckCircle2 className="w-8 h-8 text-emerald-400" />
          <p>Zero active critical warnings. All 300 fleet battery packs are balanced and within thermal thresholds.</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="p-3.5 rounded-xl bg-charcoal-900 border border-charcoal-700/60 flex items-start justify-between gap-3"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-rust/20 text-red-400 border border-rust/40 shrink-0 mt-0.5">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono font-bold text-slate-200 text-xs">{alert.id}</span>
                    <Badge variant={alert.severity === 'critical' ? 'critical' : 'amber'} size="sm">
                      {alert.category}
                    </Badge>
                    <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {alert.timestamp}
                    </span>
                  </div>
                  <p className="text-xs font-mono text-slate-300 mt-1">{alert.message}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Vehicle VIN: <span className="text-teal-400">{alert.vin}</span> ({alert.vehicleModel})
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleResolve(alert.id, alert.message)}
                className="px-2.5 py-1 rounded-lg text-xs font-mono bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30 transition-colors shrink-0 cursor-pointer"
              >
                Resolve
              </button>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};
