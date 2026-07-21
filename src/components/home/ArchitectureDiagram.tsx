import React, { useState } from 'react';
import { ArrowRight, Server, Cpu, Database, LayoutDashboard, Code, ShieldCheck } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface Stage {
  id: string;
  title: string;
  subtitle: string;
  tech: string;
  icon: React.ReactNode;
  details: string[];
}

const STAGES: Stage[] = [
  {
    id: 'frontend',
    title: '1. React Frontend Layer',
    subtitle: 'Vite + React 19 + TypeScript',
    tech: 'Client State & UX',
    icon: <Code className="w-5 h-5 text-[#26D7E7]" />,
    details: [
      'Responsive React 19 component hierarchy',
      'Real-time FleetContext telemetry sync',
      'Interactive SVG North India corridor visualization',
      'Sub-second Sonner alert sentinel feeds'
    ]
  },
  {
    id: 'backend',
    title: '2. FastAPI Backend Service',
    subtitle: 'Asynchronous Python Server',
    tech: 'CORS & Schema Validation',
    icon: <Server className="w-5 h-5 text-[#6EE7F7]" />,
    details: [
      'High-throughput async endpoint routing',
      'Pydantic v2 strict request & response models',
      'Startup event model pre-warming into RAM',
      'Sub-500ms guaranteed API execution latency'
    ]
  },
  {
    id: 'ml',
    title: '3. Scikit-Learn ML Pipeline',
    subtitle: 'Random Forest & Gradient Boosting',
    tech: 'Trained Model Corpora',
    icon: <Cpu className="w-5 h-5 text-[#31C48D]" />,
    details: [
      'Battery SOH & RUL Gradient Boosted Regressor',
      'Predictive Maintenance Risk Classifier',
      'NASA PCoE battery prognostics regression models',
      'Serialized .joblib binaries loaded on startup'
    ]
  },
  {
    id: 'xai',
    title: '4. Perturbation XAI Engine',
    subtitle: 'Local Feature Sensitivity',
    tech: 'Explainable AI',
    icon: <Database className="w-5 h-5 text-[#FBBF24]" />,
    details: [
      'Local perturbation feature attributions',
      'Marginal delta calculations against baseline dataset',
      'Structured natural language driver summaries',
      'Sub-second transparent point allocations'
    ]
  },
  {
    id: 'dashboard',
    title: '5. Mission Control Payoff',
    subtitle: 'Real-time Fleet Control Room',
    tech: '300 EV Telemetry',
    icon: <LayoutDashboard className="w-5 h-5 text-[#26D7E7]" />,
    details: [
      'Live vehicle table with cell-level CANbus telemetry',
      'Real-time thermal heatmap distribution',
      'Actionable AI Recommendations Feed',
      'CSV export & executive audit reports'
    ]
  }
];

export const ArchitectureDiagram: React.FC = () => {
  const [activeStage, setActiveStage] = useState<Stage>(STAGES[0]);

  return (
    <Card className="p-6 md:p-10 border-[#26D7E7]/30 bg-[#10264F]/50 backdrop-blur-xl relative overflow-hidden space-y-8">
      {/* Background blueprint grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-15 pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
        <div>
          <div className="flex items-center gap-2.5">
            <Server className="w-6 h-6 text-[#26D7E7]" />
            <h3 className="text-2xl md:text-3xl font-display font-extrabold text-[#F8FAFC]">
              Enterprise System Architecture
            </h3>
            <Badge variant="teal" size="sm">UNIFIED PIPELINE</Badge>
          </div>
          <p className="text-xs text-[#94A3B8] font-mono mt-1">
            End-to-end data flow from client telemetry to Scikit-Learn inference and XAI output
          </p>
        </div>
      </div>

      {/* Interactive Flowchart Diagram */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 relative z-10">
        {STAGES.map((stage, idx) => {
          const isSelected = activeStage.id === stage.id;
          return (
            <div
              key={stage.id}
              onClick={() => setActiveStage(stage)}
              className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-3 ${
                isSelected
                  ? 'bg-[#081A3A] border-[#26D7E7] shadow-[0_0_20px_rgba(38,215,231,0.3)] scale-[1.02]'
                  : 'bg-[#081A3A]/60 border-[#18346B] hover:border-[#26D7E7]/40 hover:bg-[#081A3A]/90'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-xl bg-[#10264F] border border-[#18346B]">
                  {stage.icon}
                </div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#10264F] text-[#26D7E7]">
                  {stage.tech}
                </span>
              </div>

              <div>
                <h4 className="font-display font-bold text-[#F8FAFC] text-sm">{stage.title}</h4>
                <p className="text-[11px] text-[#94A3B8] font-mono mt-0.5">{stage.subtitle}</p>
              </div>

              {idx < STAGES.length - 1 && (
                <div className="hidden lg:flex items-center justify-end text-[#26D7E7]/40">
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Active Stage Inspector Detail Panel */}
      <div className="p-6 rounded-2xl bg-[#081A3A] border border-[#26D7E7]/20 relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#31C48D]" />
            <h4 className="font-display font-bold text-[#F8FAFC] text-lg">{activeStage.title} Inspector</h4>
          </div>
          <p className="text-xs text-[#94A3B8] font-mono">{activeStage.subtitle} • Tech Stack: {activeStage.tech}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full md:w-auto">
          {activeStage.details.map((detail, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs font-mono text-[#CBD5E1] bg-[#10264F]/80 p-2.5 rounded-xl border border-[#18346B]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#26D7E7]" />
              <span>{detail}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
