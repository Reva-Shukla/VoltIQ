import React from 'react';
import { ShieldCheck, Cpu, Layers, GitBranch, Terminal, Globe, Zap } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { ArchitectureDiagram } from '../components/home/ArchitectureDiagram';

const timelineEvents = [
  {
    year: '01',
    title: 'Problem Identification',
    desc: "Identified the need for an AI-powered platform to monitor EV battery health, predict maintenance, and improve fleet readiness for North India's growing electric mobility ecosystem.",
  },
  {
    year: '02',
    title: 'Design & Development',
    desc: 'Designed and developed VoltIQ using React, TypeScript, FastAPI, machine learning models, explainable AI, and an interactive analytics dashboard at Chitkara University.',
  },
  {
    year: '03',
    title: 'Economic Times AI Hackathon 2026',
    desc: 'Successfully integrated battery State of Health prediction, predictive maintenance, fleet intelligence, electrification readiness analysis, and a premium product experience into the final VoltIQ platform for the Economic Times AI Hackathon 2026.',
  },
];

export const About: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-16">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="teal" size="sm">COMPANY MISSION & SYSTEM ARCHITECTURE</Badge>
        <h1 className="text-4xl sm:text-5xl font-display font-extrabold text-[#F8FAFC]">
          The Science Behind VoltIQ
        </h1>
        <p className="text-sm sm:text-base text-[#CBD5E1] leading-relaxed">
          Combining electrochemical physics with enterprise AI to accelerate the commercial transition to zero-emission heavy fleets.
        </p>
      </div>

      {/* Mission & Vision Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="p-6 border-[#26D7E7]/30 bg-[#10264F]/50 backdrop-blur-xl space-y-3">
          <div className="p-3 rounded-xl bg-[#081A3A] text-[#26D7E7] border border-[#26D7E7]/30 w-fit">
            <Zap className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-display font-bold text-[#F8FAFC]">Our Mission</h2>
          <p className="text-xs text-[#CBD5E1] leading-relaxed">
            Eliminate battery uncertainty for heavy electric fleets by providing real-time cell-level diagnostics, zero unplanned downtime, and maximum battery pack asset longevity.
          </p>
        </Card>

        <Card className="p-6 border-[#26D7E7]/30 bg-[#10264F]/50 backdrop-blur-xl space-y-3">
          <div className="p-3 rounded-xl bg-[#081A3A] text-[#6EE7F7] border border-[#26D7E7]/30 w-fit">
            <Globe className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-display font-bold text-[#F8FAFC]">Our Vision</h2>
          <p className="text-xs text-[#CBD5E1] leading-relaxed">
            A world where every commercial electric truck, transit bus, and depot operates with 100% renewable energy integration, explainable AI diagnostics, and 2nd-life battery sustainability.
          </p>
        </Card>
      </div>

      {/* Interactive System Architecture Diagram */}
      <ArchitectureDiagram />

      {/* Timeline Section */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <Badge variant="teal" size="sm">R&D EVOLUTION</Badge>
          <h2 className="text-2xl font-display font-bold text-[#F8FAFC]">
            Milestones & Hackathon Development
          </h2>
        </div>

        <div className="space-y-4 max-w-3xl mx-auto">
          {timelineEvents.map((event) => (
            <div key={event.year} className="flex items-start gap-4 p-5 rounded-2xl glass-panel border border-[#18346B] bg-[#10264F]/40">
              <span className="px-3.5 py-1 rounded-xl bg-[#081A3A] text-[#26D7E7] font-mono font-bold text-sm shrink-0 border border-[#26D7E7]/30">
                {event.year}
              </span>
              <div>
                <h4 className="font-display font-bold text-[#F8FAFC] text-sm">{event.title}</h4>
                <p className="text-xs text-[#CBD5E1] mt-1 leading-relaxed">{event.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
