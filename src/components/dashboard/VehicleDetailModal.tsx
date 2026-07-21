import React from 'react';
import { Zap, ShieldCheck, Cpu, MapPin, Calendar, Clock, Activity, Battery, Wrench } from 'lucide-react';
import { useFleet } from '../../contexts/FleetContext';
import { Modal } from '../ui/Modal';
import { Badge } from '../ui/Badge';
import { BatteryCellMatrix } from './BatteryCellMatrix';

export const VehicleDetailModal: React.FC = () => {
  const { selectedVehicle, setSelectedVehicle } = useFleet();

  if (!selectedVehicle) return null;

  return (
    <Modal
      isOpen={!!selectedVehicle}
      onClose={() => setSelectedVehicle(null)}
      title={
        <span className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-teal-400" />
          Vehicle Telemetry Inspection — {selectedVehicle.id}
        </span>
      }
      subtitle={`VIN: ${selectedVehicle.vin} • Driver: ${selectedVehicle.driver}`}
      maxWidth="4xl"
    >
      <div className="space-y-6">
        {/* KPI Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-charcoal-800/60 border border-charcoal-600/40">
            <p className="text-[10px] font-mono text-slate-400">STATE OF HEALTH (SOH)</p>
            <p className="text-2xl font-mono font-bold text-emerald-400 mt-1">{selectedVehicle.soh}%</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Degradation: {selectedVehicle.degradationRate}%/1k</p>
          </div>

          <div className="p-3.5 rounded-xl bg-charcoal-800/60 border border-charcoal-600/40">
            <p className="text-[10px] font-mono text-slate-400">STATE OF CHARGE (SOC)</p>
            <p className="text-2xl font-mono font-bold text-teal-300 mt-1">{selectedVehicle.soc}%</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Est. Range: {selectedVehicle.estimatedRangeKm} km</p>
          </div>

          <div className="p-3.5 rounded-xl bg-charcoal-800/60 border border-charcoal-600/40">
            <p className="text-[10px] font-mono text-slate-400">PACK TEMPERATURE</p>
            <p className="text-2xl font-mono font-bold text-amber-400 mt-1">{selectedVehicle.packTemp}°C</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Range: {selectedVehicle.minCellTemp} - {selectedVehicle.maxCellTemp}°C</p>
          </div>

          <div className="p-3.5 rounded-xl bg-charcoal-800/60 border border-charcoal-600/40">
            <p className="text-[10px] font-mono text-slate-400">TOTAL CYCLE COUNT</p>
            <p className="text-2xl font-mono font-bold text-slate-100 mt-1">{selectedVehicle.cycleCount}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Mileage: {selectedVehicle.mileage.toLocaleString()} km</p>
          </div>
        </div>

        {/* Battery Cell Matrix */}
        <BatteryCellMatrix vehicle={selectedVehicle} />

        {/* Vehicle Metadata & Charging History */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* General Specs */}
          <div className="p-4 rounded-xl bg-charcoal-900 border border-charcoal-700/60 space-y-2 text-xs font-mono">
            <h4 className="font-display font-semibold text-slate-100 text-sm flex items-center gap-1.5 mb-3">
              <Cpu className="w-4 h-4 text-teal-400" /> OEM & Hardware Specifications
            </h4>
            <div className="flex justify-between py-1 border-b border-charcoal-800">
              <span className="text-slate-400">Model Chassis</span>
              <span className="text-slate-200 font-bold">{selectedVehicle.model}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-charcoal-800">
              <span className="text-slate-400">Fleet Subgroup</span>
              <span className="text-slate-200">{selectedVehicle.fleet}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-charcoal-800">
              <span className="text-slate-400">Nominal Voltage</span>
              <span className="text-teal-400 font-bold">{selectedVehicle.voltage} V</span>
            </div>
            <div className="flex justify-between py-1 border-b border-charcoal-800">
              <span className="text-slate-400">Current Draw / Charge</span>
              <span className="text-amber-400 font-bold">{selectedVehicle.current} A</span>
            </div>
            <div className="flex justify-between py-1 border-b border-charcoal-800">
              <span className="text-slate-400">Depot Station Location</span>
              <span className="text-slate-200">{selectedVehicle.locationName}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Last Service Date</span>
              <span className="text-slate-200">{selectedVehicle.lastServiced}</span>
            </div>
          </div>

          {/* Recent Charging Sessions */}
          <div className="p-4 rounded-xl bg-charcoal-900 border border-charcoal-700/60 space-y-2 text-xs font-mono">
            <h4 className="font-display font-semibold text-slate-100 text-sm flex items-center gap-1.5 mb-3">
              <Zap className="w-4 h-4 text-amber-400" /> Recent Fast-Charging Logs
            </h4>
            {selectedVehicle.sessions.map((s) => (
              <div key={s.id} className="p-2.5 rounded-lg bg-charcoal-800/60 border border-charcoal-700/40 space-y-1">
                <div className="flex justify-between text-slate-200 font-bold">
                  <span>{s.station}</span>
                  <span className="text-teal-400">+{s.energyAddedKwh} kWh</span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>{s.timestamp}</span>
                  <span>{s.startSoc}% → {s.endSoc}% ({s.durationMins} mins @ {s.peakSpeedKw} kW)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};
