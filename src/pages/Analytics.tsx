import React, { useState } from 'react';
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, BarChart, Bar } from 'recharts';
import { BarChart3, Download, TrendingUp, Calendar, Zap, ShieldCheck, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

const sohDegradationData = [
  { cycles: 0, lfpChemistry: 100, nmcChemistry: 100, physicsAIModel: 100 },
  { cycles: 500, lfpChemistry: 98.2, nmcChemistry: 96.5, physicsAIModel: 98.0 },
  { cycles: 1000, lfpChemistry: 95.8, nmcChemistry: 92.1, physicsAIModel: 95.4 },
  { cycles: 1500, lfpChemistry: 93.1, nmcChemistry: 87.4, physicsAIModel: 92.8 },
  { cycles: 2000, lfpChemistry: 90.4, nmcChemistry: 82.0, physicsAIModel: 89.9 },
  { cycles: 2500, lfpChemistry: 87.5, nmcChemistry: 76.2, physicsAIModel: 86.8 },
  { cycles: 3000, lfpChemistry: 84.1, nmcChemistry: 70.5, physicsAIModel: 83.5 },
];

const thermalEfficiencyData = [
  { temp: -10, chargingEfficiency: 68, thermalStress: 85 },
  { temp: 0, chargingEfficiency: 78, thermalStress: 60 },
  { temp: 15, chargingEfficiency: 92, thermalStress: 25 },
  { temp: 25, chargingEfficiency: 99, thermalStress: 15 },
  { temp: 35, chargingEfficiency: 91, thermalStress: 55 },
  { temp: 45, chargingEfficiency: 74, thermalStress: 92 },
];

const monthlySavingsData = [
  { month: 'Jan', baselineCost: 84000, optimizedCost: 52000, netSaved: 32000 },
  { month: 'Feb', baselineCost: 89000, optimizedCost: 55000, netSaved: 34000 },
  { month: 'Mar', baselineCost: 92000, optimizedCost: 56000, netSaved: 36000 },
  { month: 'Apr', baselineCost: 95000, optimizedCost: 58000, netSaved: 37000 },
  { month: 'May', baselineCost: 98000, optimizedCost: 60000, netSaved: 38000 },
  { month: 'Jun', baselineCost: 104000, optimizedCost: 64000, netSaved: 40000 },
];

export const Analytics: React.FC = () => {
  const [forecastingModel, setForecastingModel] = useState<'Physics-AI' | 'Conservative' | 'Aggressive'>('Physics-AI');
  const [selectedTimeframe, setSelectedTimeframe] = useState('6 Months');

  const handleExportReport = () => {
    toast.success('Generating Executive Battery Report (PDF)', {
      description: 'Compiled SOH degradation curves and monthly cost audit for Q3 2026.',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 space-y-6">
      {/* Title & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-charcoal-700/50">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-teal-400" />
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-100">
              Deep Battery & Energy Analytics
            </h1>
          </div>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Electrochemical degradation forecasting & depot utility cost optimization
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="px-3 py-2 text-xs font-mono rounded-xl bg-charcoal-900 border border-charcoal-600 text-slate-200 focus:outline-none"
          >
            <option value="1 Month">1 Month</option>
            <option value="6 Months">6 Months</option>
            <option value="1 Year">1 Year</option>
            <option value="Lifetime">Lifetime</option>
          </select>

          <Button variant="primary" size="sm" icon={<Download className="w-3.5 h-3.5" />} onClick={handleExportReport}>
            Download PDF Audit Report
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5 border-charcoal-600/40">
          <p className="text-xs font-mono text-slate-400">AVERAGE DEGRADATION RATE</p>
          <p className="text-3xl font-display font-bold text-teal-300 mt-1">0.082 %</p>
          <p className="text-[11px] font-mono text-slate-400 mt-1">Per 1,000 charge cycles (42% better than OEM baseline)</p>
        </Card>

        <Card className="p-5 border-charcoal-600/40">
          <p className="text-xs font-mono text-slate-400">NET DEPOT ENERGY SAVED</p>
          <p className="text-3xl font-display font-bold text-amber-400 mt-1">$217,000</p>
          <p className="text-[11px] font-mono text-slate-400 mt-1">Cumulated peak shaving savings over 6 months</p>
        </Card>

        <Card className="p-5 border-charcoal-600/40">
          <p className="text-xs font-mono text-slate-400">PROJECTED PACK LIFESPAN EXTENSION</p>
          <p className="text-3xl font-display font-bold text-emerald-400 mt-1">+ 2.8 Years</p>
          <p className="text-[11px] font-mono text-slate-400 mt-1">Backed by VoltIQ active pre-conditioning routines</p>
        </Card>
      </div>

      {/* 1. SOH Degradation Curve Chart */}
      <Card className="p-6 border-charcoal-600/40 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-display font-bold text-slate-100">
              State of Health (SOH) Capacity Loss vs Cycle Count
            </h3>
            <p className="text-xs font-mono text-slate-400">Comparing LFP, NMC, and VoltIQ Physics-AI Predictive Trajectory</p>
          </div>

          {/* Model Selector */}
          <div className="flex items-center gap-1 bg-charcoal-900 p-1 rounded-xl border border-charcoal-700/50">
            {(['Physics-AI', 'Conservative', 'Aggressive'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setForecastingModel(m)}
                className={`px-3 py-1 text-xs font-mono rounded-lg transition-colors cursor-pointer ${
                  forecastingModel === m ? 'bg-teal-500/20 text-teal-300 font-bold border border-teal-500/30' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sohDegradationData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#222B3A" />
              <XAxis dataKey="cycles" stroke="#94A3B8" fontSize={11} fontFamily="JetBrains Mono" unit=" cycles" />
              <YAxis stroke="#94A3B8" fontSize={11} fontFamily="JetBrains Mono" domain={[65, 100]} unit="%" />
              <Tooltip contentStyle={{ backgroundColor: '#0B0D12', borderColor: '#3D4D68', borderRadius: '12px', fontSize: '11px', fontFamily: 'JetBrains Mono' }} />
              <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'JetBrains Mono' }} />
              <Line type="monotone" dataKey="lfpChemistry" name="LFP Chemistry Baseline" stroke="#10B981" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="nmcChemistry" name="NMC Chemistry Baseline" stroke="#EF4444" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="physicsAIModel" name="VoltIQ Physics-AI Model" stroke="#00E5FF" strokeWidth={3} dot={{ r: 4, fill: '#00E5FF' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* 2. Grid & Financial Savings Bar Chart */}
      <Card className="p-6 border-charcoal-600/40 space-y-4">
        <div>
          <h3 className="text-base font-display font-bold text-slate-100">
            Monthly Depot Utility Costs & Net Shaving Savings ($ USD)
          </h3>
          <p className="text-xs font-mono text-slate-400">Baseline unmanaged charging vs VoltIQ smart charging orchestration</p>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlySavingsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#222B3A" />
              <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} fontFamily="JetBrains Mono" />
              <YAxis stroke="#94A3B8" fontSize={11} fontFamily="JetBrains Mono" />
              <Tooltip contentStyle={{ backgroundColor: '#0B0D12', borderColor: '#3D4D68', borderRadius: '12px', fontSize: '11px', fontFamily: 'JetBrains Mono' }} />
              <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'JetBrains Mono' }} />
              <Bar dataKey="baselineCost" name="Unmanaged Baseline ($)" fill="#37435B" radius={[4, 4, 0, 0]} />
              <Bar dataKey="optimizedCost" name="VoltIQ Managed ($)" fill="#00E5FF" radius={[4, 4, 0, 0]} />
              <Bar dataKey="netSaved" name="Net Saved ($)" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};
