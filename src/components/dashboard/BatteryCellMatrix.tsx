import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Thermometer, Zap, Activity, Info, ShieldAlert } from 'lucide-react';
import { BatteryCell, Vehicle } from '../../types';
import { Card } from '../ui/Card';
import { Modal } from '../ui/Modal';
import { Badge } from '../ui/Badge';
import { cn } from '../../utils/cn';

interface BatteryCellMatrixProps {
  vehicle: Vehicle;
}

export const BatteryCellMatrix: React.FC<BatteryCellMatrixProps> = ({ vehicle }) => {
  const [selectedCell, setSelectedCell] = useState<BatteryCell | null>(null);

  // Status counters
  const optimalCount = vehicle.cells.filter((c) => c.status === 'optimal').length;
  const warningCount = vehicle.cells.filter((c) => c.status === 'warning').length;
  const criticalCount = vehicle.cells.filter((c) => c.status === 'critical').length;
  const balancingCount = vehicle.cells.filter((c) => c.status === 'balancing').length;

  return (
    <Card className="border-charcoal-600/40 p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-charcoal-700/40">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-teal-400" />
            <h3 className="text-base font-display font-bold text-slate-100">
              800V Pack Architecture — 96 Cell Modules Matrix
            </h3>
          </div>
          <p className="text-xs font-mono text-slate-400 mt-0.5">
            Vehicle ID: {vehicle.id} ({vehicle.vin}) • Real-Time CANbus Resolution
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 flex-wrap text-[11px] font-mono">
          <span className="flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400" /> Optimal ({optimalCount})
          </span>
          <span className="flex items-center gap-1 text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
            <span className="w-2 h-2 rounded-full bg-amber-400" /> Warning ({warningCount})
          </span>
          <span className="flex items-center gap-1 text-red-400 bg-rust-500/10 px-2 py-0.5 rounded border border-rust-500/20">
            <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" /> Critical ({criticalCount})
          </span>
          <span className="flex items-center gap-1 text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
            <span className="w-2 h-2 rounded-full bg-cyan-400" /> Balancing ({balancingCount})
          </span>
        </div>
      </div>

      {/* Grid of 96 Cells */}
      <div className="grid grid-cols-8 sm:grid-cols-12 md:grid-cols-16 gap-1.5 p-3 rounded-xl bg-graphite-900 border border-charcoal-700/50 max-h-72 overflow-y-auto">
        {vehicle.cells.map((cell) => {
          let bgClass = 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/40';
          if (cell.status === 'critical') {
            bgClass = 'bg-rust/30 border-rust text-red-300 animate-pulse hover:bg-rust/50';
          } else if (cell.status === 'warning') {
            bgClass = 'bg-amber-500/30 border-amber-500/50 text-amber-300 hover:bg-amber-500/50';
          } else if (cell.status === 'balancing') {
            bgClass = 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/40';
          }

          return (
            <button
              key={cell.id}
              onClick={() => setSelectedCell(cell)}
              className={cn(
                'flex flex-col items-center justify-center p-1.5 rounded-lg border text-[10px] font-mono transition-all cursor-pointer select-none aspect-square',
                bgClass
              )}
              title={`Cell #${cell.id}: ${cell.voltage}V | ${cell.temp}°C`}
            >
              <span className="font-bold opacity-80">#{cell.id}</span>
              <span className="text-[9px] font-semibold">{cell.temp}°C</span>
            </button>
          );
        })}
      </div>

      <div className="mt-3 flex items-center justify-between text-xs font-mono text-slate-400">
        <span>Pack Minimum: {vehicle.minCellTemp}°C • Pack Maximum: {vehicle.maxCellTemp}°C</span>
        <span>Click any cell for micro-diagnostic breakdown</span>
      </div>

      {/* Cell Detail Modal */}
      <Modal
        isOpen={!!selectedCell}
        onClose={() => setSelectedCell(null)}
        title={
          <span className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-teal-400" />
            Cell Module #{selectedCell?.id} Diagnostic Inspection
          </span>
        }
        subtitle={`Vehicle: ${vehicle.id} (${vehicle.vin})`}
        maxWidth="md"
      >
        {selectedCell && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-charcoal-800/60 border border-charcoal-600/40">
                <p className="text-[10px] font-mono text-slate-400">CELL VOLTAGE</p>
                <p className="text-xl font-mono font-bold text-teal-300 mt-1">{selectedCell.voltage} V</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Nominal: 3.650 V (Δ {(selectedCell.voltage - 3.65).toFixed(3)} V)</p>
              </div>

              <div className="p-3.5 rounded-xl bg-charcoal-800/60 border border-charcoal-600/40">
                <p className="text-[10px] font-mono text-slate-400">TEMPERATURE</p>
                <p className="text-xl font-mono font-bold text-amber-400 mt-1">{selectedCell.temp} °C</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Target Range: 25.0 – 35.0 °C</p>
              </div>

              <div className="p-3.5 rounded-xl bg-charcoal-800/60 border border-charcoal-600/40">
                <p className="text-[10px] font-mono text-slate-400">CELL STATE OF HEALTH</p>
                <p className="text-xl font-mono font-bold text-emerald-400 mt-1">{selectedCell.soh} %</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Estimated RUL: 8.4 Years</p>
              </div>

              <div className="p-3.5 rounded-xl bg-charcoal-800/60 border border-charcoal-600/40">
                <p className="text-[10px] font-mono text-slate-400">BALANCING STATUS</p>
                <p className="text-base font-mono font-bold text-slate-200 uppercase mt-1">{selectedCell.status}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Shunt Resistor Active</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-graphite-900 border border-charcoal-700/50 text-xs space-y-1.5 font-mono text-slate-300">
              <p className="font-semibold text-teal-400">BMS Recommendation:</p>
              <p className="text-slate-400 leading-relaxed">
                {selectedCell.status === 'critical'
                  ? 'High thermal anomaly detected. Initiate contactor isolation and schedule coolant flushing.'
                  : (selectedCell.status === 'warning'
                    ? 'Voltage divergence exceeds 120mV. Passive balancing active during next overnight charge.'
                    : 'Cell operating within optimal electro-thermal parameters.')}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </Card>
  );
};
