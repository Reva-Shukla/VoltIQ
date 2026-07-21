import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, ShieldCheck, Cpu, Globe, ArrowRight, CheckCircle2, Sparkles, Activity, Layers, Database, LayoutDashboard, Brain, Server, Share2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { NorthIndiaMap } from '../components/home/NorthIndiaMap';
import { BreathingBattery } from '../components/home/BreathingBattery';
import { ArchitectureDiagram } from '../components/home/ArchitectureDiagram';
import { TEAM_MEMBERS_DATA } from './Team';

export const Home: React.FC = () => {
  const capabilities = [
    {
      title: 'Battery Intelligence',
      desc: 'Cell-level physics AI predicting State of Health (SOH) and Remaining Useful Life (RUL) under active thermal stress.',
      icon: Cpu,
      badge: 'ML Regressor',
    },
    {
      title: 'Predictive Maintenance',
      desc: '30-day early failure warning algorithms targeting drivetrain, cooling loops, and high-voltage inverter wear.',
      icon: ShieldCheck,
      badge: 'Prognostics',
    },
    {
      title: 'Explainable AI (XAI)',
      desc: 'Transparent perturbation attributions explaining exactly why predictions occurred for non-technical judges & fleet operators.',
      icon: Brain,
      badge: 'XAI Engine',
    },
    {
      title: 'Fleet Monitoring',
      desc: '1,000 Hz sub-second CANbus telemetry tracking cell thermal gradients, voltage drop, and active charging states.',
      icon: Activity,
      badge: '1,000 Hz Stream',
    },
    {
      title: 'Electrification Readiness',
      desc: 'Rule-based and ML suitability scoring for ICE commercial vehicle candidates transitioning to electric platforms.',
      icon: Layers,
      badge: 'ICE → EV Scoring',
    },
    {
      title: 'Regional Fleet Intelligence',
      desc: 'Corridor monitoring across key logistics routes in North India (Delhi NCR, Jaipur, Chandigarh, Lucknow, Dehradun, Agra).',
      icon: Globe,
      badge: 'North India Map',
    },
  ];

  return (
    <div className="space-y-24 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-16 px-4 sm:px-8 max-w-7xl mx-auto overflow-hidden">
        {/* Dark Viewport Cyan Ambient Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-gradient-to-tr from-[#26D7E7]/20 via-[#2FAEAE]/10 to-[#6EE7F7]/10 blur-[130px] rounded-full pointer-events-none -z-10" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">
          {/* Left Column: Hero Copy */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#10264F]/80 border border-[#26D7E7]/30 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-[#26D7E7] animate-ping" />
              <span className="text-xs font-mono text-[#6EE7F7] font-semibold tracking-wide">
                VOLTIQ AI PLATFORM • FASTAPI & SCIKIT-LEARN INTEGRATED
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-extrabold text-[#F8FAFC] leading-[1.1] tracking-tight">
              Intelligence Behind <br />
              <span className="bg-gradient-to-r from-[#26D7E7] via-[#6EE7F7] to-[#2FAEAE] bg-clip-text text-transparent text-cyan-glow">
                Every Electric Mile.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#CBD5E1] max-w-2xl leading-relaxed font-sans">
              VoltIQ empowers electric fleet operators with explainable AI, predictive battery analytics, and intelligent maintenance insights—transforming complex EV data into actionable decisions.
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <a href="#capabilities">
                <Button variant="primary" size="lg" icon={<Sparkles className="w-5 h-5" />}>
                  Explore Platform
                </Button>
              </a>
              <Link to="/dashboard">
                <Button variant="outline" size="lg" icon={<Zap className="w-5 h-5 text-[#26D7E7]" />}>
                  View Dashboard
                </Button>
              </Link>
            </div>

            {/* Micro KPI Counters */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-[#18346B]">
              <div>
                <p className="text-2xl sm:text-3xl font-display font-black text-[#26D7E7]">300</p>
                <p className="text-xs font-mono text-[#94A3B8] mt-0.5">Active Fleet EVs</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-display font-black text-[#6EE7F7]">sub-500ms</p>
                <p className="text-xs font-mono text-[#94A3B8] mt-0.5">FastAPI Inference</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-display font-black text-[#31C48D]">99.6%</p>
                <p className="text-xs font-mono text-[#94A3B8] mt-0.5">SOH Validation R²</p>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Breathing Battery Preview */}
          <div className="lg:col-span-5 relative">
            <div className="p-6 rounded-3xl glass-panel border-[#26D7E7]/30 shadow-2xl space-y-4 relative overflow-hidden">
              <div className="flex items-center justify-between pb-3 border-b border-[#18346B]">
                <div className="flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-[#26D7E7]" />
                  <span className="font-display font-bold text-[#F8FAFC] text-sm">
                    800V Pack Physics Twin
                  </span>
                </div>
                <Badge variant="teal" size="sm">FASTAPI LIVE</Badge>
              </div>

              {/* Pulsing Pack Battery Cell Matrix */}
              <div className="w-full h-44 rounded-2xl bg-[#081A3A] p-4 border border-[#18346B] flex flex-col justify-center items-center relative overflow-hidden animate-battery-pulse">
                <div className="grid grid-cols-8 gap-2 w-full">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-8 rounded bg-gradient-to-t from-[#2FAEAE] to-[#6EE7F7] opacity-80 animate-pulse"
                      style={{ animationDelay: `${(i % 8) * 0.15}s` }}
                    />
                  ))}
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-[#081A3A]/60 backdrop-blur-xs">
                  <div className="text-center">
                    <p className="text-3xl font-display font-extrabold text-[#F8FAFC] text-cyan-glow">94.02% SOH</p>
                    <p className="text-[10px] font-mono uppercase text-[#26D7E7]">Optimal Thermal Equilibrium</p>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#081A3A] border border-[#18346B] flex items-center justify-between text-xs font-mono">
                <span className="text-[#94A3B8] flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-[#26D7E7] animate-pulse" /> Telemetry Stream: 1,000 Hz
                </span>
                <span className="text-[#31C48D] font-bold">HEALTHY</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PROBLEM STATEMENT */}
      <section className="px-4 sm:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <Badge variant="amber" size="sm">THE ELECTRIFICATION GAP</Badge>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-[#F8FAFC]">
            Commercial EV Fleets Need Intelligent Analytics
          </h2>
          <p className="text-sm text-[#CBD5E1]">
            Transitioning commercial fleets to electric power brings unprecedented operational complexity. Traditional hardware BMS units only trigger error codes after damage has occurred.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 border-[#EF4444]/30 bg-[#EF4444]/5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#EF4444]/20 border border-[#EF4444]/40 flex items-center justify-center text-[#EF4444] font-bold">
              01
            </div>
            <h3 className="font-display font-bold text-[#F8FAFC] text-lg">Unpredictable Battery Degradation</h3>
            <p className="text-xs text-[#CBD5E1] leading-relaxed">
              Fast charging and extreme ambient temperatures cause non-linear capacity fade, risking unexpected pack failure.
            </p>
          </Card>

          <Card className="p-6 border-[#FBBF24]/30 bg-[#FBBF24]/5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#FBBF24]/20 border border-[#FBBF24]/40 flex items-center justify-center text-[#FBBF24] font-bold">
              02
            </div>
            <h3 className="font-display font-bold text-[#F8FAFC] text-lg">Costly Unplanned Downtime</h3>
            <p className="text-xs text-[#CBD5E1] leading-relaxed">
              Component breakdowns in high-voltage inverters or cooling loops cost up to $45,000 per commercial truck in lost revenue.
            </p>
          </Card>

          <Card className="p-6 border-[#26D7E7]/30 bg-[#26D7E7]/5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#26D7E7]/20 border border-[#26D7E7]/40 flex items-center justify-center text-[#26D7E7] font-bold">
              03
            </div>
            <h3 className="font-display font-bold text-[#F8FAFC] text-lg">Opaque Black-Box Decision Making</h3>
            <p className="text-xs text-[#CBD5E1] leading-relaxed">
              Fleet operators cannot act on raw telemetry without transparent explainable AI driver attributions and point allocations.
            </p>
          </Card>
        </div>
      </section>

      {/* 3. WHY VOLTIQ */}
      <section className="px-4 sm:px-8 max-w-7xl mx-auto space-y-8">
        <div className="p-8 md:p-12 rounded-3xl glass-panel border-[#26D7E7]/30 bg-[#10264F]/50 relative overflow-hidden space-y-6">
          <Badge variant="teal" size="sm">THE VOLTIQ SOLUTION</Badge>
          <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-[#F8FAFC] max-w-2xl">
            Physics-AI & Machine Learning Layer for EV Fleets
          </h2>
          <p className="text-sm sm:text-base text-[#CBD5E1] max-w-3xl leading-relaxed">
            VoltIQ bridges the gap between raw CANbus telemetry and fleet decision-making. By combining trained Random Forests, NASA prognostics models, rule-based readiness scoring, and local perturbation XAI, VoltIQ transforms complex battery data into precise recommendations.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-[#18346B]">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#31C48D]" />
              <span className="text-xs font-mono text-[#F8FAFC]">Trained Scikit-Learn Models</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#31C48D]" />
              <span className="text-xs font-mono text-[#F8FAFC]">FastAPI Asynchronous Microservices</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#31C48D]" />
              <span className="text-xs font-mono text-[#F8FAFC]">Perturbation Explainable AI</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PLATFORM CAPABILITIES */}
      <section id="capabilities" className="px-4 sm:px-8 max-w-7xl mx-auto space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <Badge variant="teal" size="sm">CORE SYSTEM FEATURES</Badge>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-[#F8FAFC]">
            Platform Capabilities
          </h2>
          <p className="text-sm text-[#CBD5E1]">
            Six core intelligence modules engineered for enterprise commercial fleets
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {capabilities.map((cap) => {
            const Icon = cap.icon;
            return (
              <Card key={cap.title} hoverEffect className="p-6 border-[#18346B] bg-[#10264F]/40 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-xl bg-[#081A3A] border border-[#26D7E7]/30 text-[#26D7E7]">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-md bg-[#081A3A] text-[#6EE7F7] border border-[#26D7E7]/20">
                      {cap.badge}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-[#F8FAFC] text-xl">{cap.title}</h3>
                  <p className="text-xs text-[#94A3B8] leading-relaxed font-sans">{cap.desc}</p>
                </div>

                <div className="pt-3 border-t border-[#18346B]/60 flex items-center text-xs font-mono text-[#26D7E7] font-semibold">
                  <span>Operational Active</span>
                  <ArrowRight className="w-4 h-4 ml-auto" />
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* 5. NORTH INDIA FLEET NETWORK */}
      <section className="px-4 sm:px-8 max-w-7xl mx-auto">
        <NorthIndiaMap />
      </section>

      {/* 6. BATTERY INTELLIGENCE CENTERPIECE */}
      <section className="px-4 sm:px-8 max-w-7xl mx-auto">
        <BreathingBattery />
      </section>

      {/* 7. EXPLAINABLE AI */}
      <section className="px-4 sm:px-8 max-w-7xl mx-auto space-y-8">
        <div className="p-8 md:p-10 rounded-3xl glass-panel border-[#26D7E7]/30 bg-[#10264F]/50 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <Badge variant="teal" size="sm">TRANSPARENT REASONING</Badge>
              <h2 className="text-3xl font-display font-extrabold text-[#F8FAFC] mt-2">
                Perturbation Explainable AI (XAI)
              </h2>
              <p className="text-xs text-[#94A3B8] font-mono mt-1">
                Every prediction is accompanied by local feature attribution and human-readable natural language descriptors.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-[#081A3A] border border-[#18346B] space-y-3">
              <h4 className="font-display font-bold text-[#6EE7F7] text-sm">Battery SOH Feature Sensitivity</h4>
              <p className="text-xs text-[#94A3B8]">
                Calculates local marginal impact by perturbing individual telemetry metrics back to baseline dataset means.
              </p>
              <div className="p-3 rounded-xl bg-[#10264F] border border-[#18346B] text-xs font-mono text-[#CBD5E1]">
                <p className="text-[#31C48D] font-bold">internal_resistance_ohm (0.08 Ω)</p>
                <p className="text-[#94A3B8]">Increased predicted SOH by +15.71% due to low internal cell impedance.</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#081A3A] border border-[#18346B] space-y-3">
              <h4 className="font-display font-bold text-[#6EE7F7] text-sm">NASA Prognostics Narrative</h4>
              <p className="text-xs text-[#94A3B8]">
                Generates actionable recommendations and remaining useful life (RUL) cycle counts.
              </p>
              <div className="p-3 rounded-xl bg-[#10264F] border border-[#18346B] text-xs font-mono text-[#CBD5E1]">
                <p className="text-[#FBBF24] font-bold">Recommendation: Monitor</p>
                <p className="text-[#94A3B8]">Battery SOH is 81.0% with RUL of 82 cycles. Capacity fade is 0.38 Ah.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. MISSION CONTROL DASHBOARD PAYOFF */}
      <section className="px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="p-8 md:p-12 rounded-3xl glass-panel border-[#26D7E7]/40 bg-gradient-to-br from-[#10264F] to-[#081A3A] text-center space-y-6 relative overflow-hidden shadow-2xl">
          <Badge variant="teal" size="sm">THE DASHBOARD PAYOFF</Badge>
          <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-[#F8FAFC] max-w-3xl mx-auto">
            Ready to Inspect the Fleet Control Room?
          </h2>
          <p className="text-sm sm:text-base text-[#CBD5E1] max-w-2xl mx-auto">
            Experience the full live dashboard with interactive vehicle maps, thermal heatmaps, AI recommendations feed, alert sentinel timeline, and 300-vehicle CANbus telemetry table.
          </p>
          <div>
            <Link to="/dashboard">
              <Button variant="primary" size="lg" icon={<LayoutDashboard className="w-5 h-5" />}>
                Launch Mission Control Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 9. TECHNICAL ARCHITECTURE DIAGRAM */}
      <section className="px-4 sm:px-8 max-w-7xl mx-auto">
        <ArchitectureDiagram />
      </section>

      {/* 10. MEET THE MINDS BEHIND VOLTIQ (TEAM) */}
      <section className="px-4 sm:px-8 max-w-7xl mx-auto space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <Badge variant="teal" size="sm">CRAFTED BY TEAM CTRL FREAKS</Badge>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-[#F8FAFC]">
            Meet the Minds Behind VoltIQ
          </h2>
          <p className="text-sm text-[#CBD5E1]">
            Economic Times AI Hackathon 2026 Engineering & Design Team
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TEAM_MEMBERS_DATA.map((member) => (
            <motion.div
              key={member.id}
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <Card hoverEffect glowColor="teal" className="p-6 border-[#26D7E7]/20 bg-[#10264F]/50 backdrop-blur-xl space-y-5 flex flex-col justify-between h-full">
                <div className="space-y-4">
                  {/* Uploaded Team Photo */}
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-[#26D7E7]/30 shadow-lg">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute top-3 right-3">
                      <Badge variant="teal" size="sm">
                        {member.badge}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-display font-bold text-[#F8FAFC] text-xl">{member.name}</h3>
                    <p className="text-xs font-mono text-[#26D7E7] font-semibold mt-1">{member.role}</p>
                  </div>

                  <p className="text-xs text-[#CBD5E1] leading-relaxed">
                    {member.bio}
                  </p>
                </div>

                {/* Specialty & Social Links */}
                <div className="pt-4 border-t border-[#18346B] flex items-center justify-between">
                  <span className="text-[11px] font-mono text-[#94A3B8]">{member.specialty}</span>
                  <div className="flex items-center gap-3">
                    <a
                      href={member.github}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-lg bg-[#081A3A] border border-[#18346B] text-[#CBD5E1] hover:text-[#26D7E7] hover:border-[#26D7E7]/50 transition-colors"
                      title="GitHub"
                    >
                      <Globe className="w-4 h-4" />
                    </a>
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-lg bg-[#081A3A] border border-[#18346B] text-[#CBD5E1] hover:text-[#26D7E7] hover:border-[#26D7E7]/50 transition-colors"
                      title="LinkedIn"
                    >
                      <Share2 className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};
