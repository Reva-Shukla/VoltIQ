import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Logo } from './Logo';
import { ArrowUp, Send, ShieldCheck, Globe, Share2 } from 'lucide-react';
import { useFleet } from '../../contexts/FleetContext';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const { fleetKPIs } = useFleet();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid work email address.');
      return;
    }
    toast.success('Subscribed to VoltIQ Intelligence Briefings!', {
      description: 'You will receive monthly battery health research & fleet case studies.',
    });
    setEmail('');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#081A3A] border-t border-[#26D7E7]/20 text-[#CBD5E1] pt-16 pb-12 overflow-hidden z-10">
      {/* Background blueprint grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#18346B]">
          {/* Column 1 & 2: Branding & Tagline */}
          <div className="lg:col-span-2 space-y-6">
            <Logo size="lg" />
            <p className="text-sm font-display text-[#26D7E7] font-semibold text-cyan-glow tracking-wide">
              Intelligence Behind Every Electric Mile.
            </p>
            <p className="text-xs text-[#94A3B8] max-w-sm leading-relaxed">
              VoltIQ empowers electric fleet operators with explainable AI, predictive battery analytics, and intelligent maintenance insights—transforming complex EV data into actionable decisions.
            </p>

            {/* Live Stats Pill */}
            <div className="grid grid-cols-3 gap-3 p-3.5 rounded-2xl glass-panel border border-[#26D7E7]/20 bg-[#10264F]/60 max-w-md">
              <div>
                <p className="text-[10px] font-mono uppercase text-[#94A3B8]">Active Fleet</p>
                <p className="text-sm font-mono font-bold text-[#26D7E7]">300 Vehicles</p>
              </div>
              <div>
                <p className="text-[10px] font-mono uppercase text-[#94A3B8]">Energy</p>
                <p className="text-sm font-mono font-bold text-[#FBBF24]">{fleetKPIs.totalEnergyMwh} MWh</p>
              </div>
              <div>
                <p className="text-[10px] font-mono uppercase text-[#94A3B8]">CO₂ Offset</p>
                <p className="text-sm font-mono font-bold text-[#31C48D]">{fleetKPIs.co2OffsetTons} Tons</p>
              </div>
            </div>
          </div>

          {/* Column 3: Platform Navigation */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#F8FAFC] font-bold">Platform</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/" className="hover:text-[#26D7E7] transition-colors">Home & Overview</Link>
              </li>
              <li>
                <Link to="/features" className="hover:text-[#26D7E7] transition-colors">Platform Capabilities</Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-[#26D7E7] transition-colors">Mission Control Dashboard</Link>
              </li>
              <li>
                <Link to="/analytics" className="hover:text-[#26D7E7] transition-colors">Deep Degradation Analytics</Link>
              </li>
              <li>
                <Link to="/team" className="hover:text-[#26D7E7] transition-colors">Engineering & Research Team</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Intelligence Solutions */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#F8FAFC] font-bold">AI Intelligence</h4>
            <ul className="space-y-2.5 text-xs text-[#94A3B8]">
              <li><span className="hover:text-[#F8FAFC] transition-colors cursor-pointer">Battery State of Health (SOH)</span></li>
              <li><span className="hover:text-[#F8FAFC] transition-colors cursor-pointer">NASA Prognostics & RUL</span></li>
              <li><span className="hover:text-[#F8FAFC] transition-colors cursor-pointer">Predictive Maintenance Risk</span></li>
              <li><span className="hover:text-[#F8FAFC] transition-colors cursor-pointer">Electrification Readiness Score</span></li>
              <li><span className="hover:text-[#F8FAFC] transition-colors cursor-pointer">Perturbation Explainable AI</span></li>
            </ul>
          </div>

          {/* Column 5: Newsletter CTA */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#F8FAFC] font-bold">Fleet Intelligence Briefing</h4>
            <p className="text-xs text-[#94A3B8]">
              Monthly research on EV battery degradation models, thermal safety, and depot smart charging.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="fleet.lead@company.com"
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#10264F] border border-[#18346B] text-[#F8FAFC] placeholder-[#94A3B8] focus:outline-none focus:border-[#26D7E7]"
                />
              </div>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#26D7E7] text-[#081A3A] text-xs font-display font-bold hover:bg-[#6EE7F7] transition-colors cursor-pointer"
              >
                <span>Subscribe Briefing</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#94A3B8]">
          <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#31C48D]/10 text-[#31C48D] border border-[#31C48D]/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              Operational Telemetry (1,000 Hz)
            </span>
            <span className="text-slate-300">
              Crafted by <strong className="text-[#F8FAFC]">Team Ctrl Freaks</strong> for the Economic Times AI Hackathon 2026.
            </span>
          </div>

          <div className="flex items-center gap-6">
            <span>© 2026 VoltIQ</span>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-xl bg-[#10264F] hover:bg-[#18346B] border border-[#26D7E7]/20 text-[#CBD5E1] hover:text-[#6EE7F7] transition-colors cursor-pointer"
              title="Back to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
