import React from 'react';
import { RefreshCw, Radio, Download } from 'lucide-react';
import { toast } from 'sonner';
import { FleetOverview } from '../components/dashboard/FleetOverview';
import { FleetMap } from '../components/dashboard/FleetMap';
import { VehicleTable } from '../components/dashboard/VehicleTable';
import { AIRecommendationsFeed } from '../components/dashboard/AIRecommendationsFeed';
import { AlertTimeline } from '../components/dashboard/AlertTimeline';
import { ThermalHeatmap } from '../components/dashboard/ThermalHeatmap';
import { VehicleDetailModal } from '../components/dashboard/VehicleDetailModal';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useFleet } from '../contexts/FleetContext';

export const Dashboard: React.FC = () => {
  const { exportCSV, isBackendOnline, syncApiData } = useFleet();

  const handleRefresh = async () => {
    await syncApiData();
    toast.success('Telemetry Stream Re-synchronized', {
      description: isBackendOnline 
        ? 'Connected to VoltIQ FastAPI backend. Fetched sub-second CANbus telemetry.'
        : 'Telemetry re-synchronized for active fleet vehicles.',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 space-y-6">
      {/* Control Room Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-charcoal-700/50">
        <div>
          <div className="flex items-center gap-2.5">
            <Radio className="w-5 h-5 text-teal-400 animate-pulse" />
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-100 tracking-tight">
              Fleet Battery Control Room
            </h1>
            <Badge variant={isBackendOnline ? "teal" : "amber"} size="sm">
              {isBackendOnline ? "FASTAPI LIVE" : "TELEMETRY DEMO"}
            </Badge>
          </div>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Real-time CANbus telemetry • 300 Commercial Electric Vehicles • 1,000 Hz Sampling
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm" icon={<RefreshCw className="w-3.5 h-3.5" />} onClick={handleRefresh}>
            Re-sync Stream
          </Button>
          <Button variant="primary" size="sm" icon={<Download className="w-3.5 h-3.5" />} onClick={exportCSV}>
            Export Telemetry
          </Button>
        </div>
      </div>

      {/* 1. Fleet KPI Overview Cards */}
      <FleetOverview />

      {/* 2. Live Interactive SVG Mission Control Map */}
      <FleetMap />

      {/* 3. AI Copilot Advisory & Live Alert Sentinel Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <AIRecommendationsFeed />
        </div>
        <div className="lg:col-span-5">
          <AlertTimeline />
        </div>
      </div>

      {/* 4. Thermal Distribution & Degradation Charts */}
      <ThermalHeatmap />

      {/* 5. 300 Vehicle Telemetry Table */}
      <VehicleTable />

      {/* Vehicle Inspection Detail Modal */}
      <VehicleDetailModal />
    </div>
  );
};
