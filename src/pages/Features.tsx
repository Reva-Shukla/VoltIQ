import React, { useState } from 'react';
import { Cpu, BarChart3, Wrench, Zap, Sparkles, Box, TrendingUp, BellRing, ArrowRight } from 'lucide-react';
import { FEATURE_SPECS } from '../data/mockData';
import { FeatureSpec } from '../types';
import { Card } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

const iconMap: Record<string, React.ElementType> = {
  Cpu,
  BarChart3,
  Wrench,
  Zap,
  Sparkles,
  Box,
  TrendingUp,
  BellRing,
};

export const Features: React.FC = () => {
  const [activeModalFeature, setActiveModalFeature] = useState<FeatureSpec | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-12">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="teal" size="sm">ENTERPRISE PLATFORM CAPABILITIES</Badge>
        <h1 className="text-4xl sm:text-5xl font-display font-extrabold text-[#F8FAFC]">
          Industrial Battery Intelligence Suite
        </h1>
        <p className="text-sm sm:text-base text-[#CBD5E1] leading-relaxed">
          Explore VoltIQ’s 8 core modules designed specifically for heavy EV fleets, transit authorities, and energy managers. Click any card to inspect full technical specifications.
        </p>
      </div>

      {/* Grid of 8 Feature Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {FEATURE_SPECS.map((feature) => {
          const Icon = iconMap[feature.iconName] || Cpu;
          return (
            <Card
              key={feature.id}
              hoverEffect
              glowColor="teal"
              className="p-6 border-[#18346B] bg-[#10264F]/50 backdrop-blur-xl flex flex-col justify-between space-y-4 cursor-pointer"
              onClick={() => setActiveModalFeature(feature)}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-2xl bg-[#081A3A] text-[#26D7E7] border border-[#26D7E7]/30">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono text-[#6EE7F7] px-2 py-0.5 rounded bg-[#081A3A] border border-[#26D7E7]/20 font-semibold">
                    {feature.demoMetric}
                  </span>
                </div>

                <div>
                  <h3 className="font-display font-bold text-[#F8FAFC] text-lg leading-snug">
                    {feature.title}
                  </h3>
                  <p className="text-xs font-mono text-[#94A3B8] mt-1">{feature.subtitle}</p>
                </div>

                <p className="text-xs text-[#CBD5E1] leading-relaxed">
                  {feature.summary}
                </p>
              </div>

              <div className="pt-3 border-t border-[#18346B] flex items-center justify-between text-xs font-mono text-[#26D7E7] group">
                <span>Inspect Technical Specs</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Card>
          );
        })}
      </div>

      {/* Feature Deep-Dive Detail Modal */}
      <Modal
        isOpen={!!activeModalFeature}
        onClose={() => setActiveModalFeature(null)}
        title={
          <span className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-[#26D7E7]" />
            {activeModalFeature?.title}
          </span>
        }
        subtitle={activeModalFeature?.subtitle}
        maxWidth="2xl"
      >
        {activeModalFeature && (
          <div className="space-y-6">
            {/* Summary Tag Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {activeModalFeature.tags.map((tag) => (
                <Badge key={tag} variant="teal" size="sm">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Detailed Description */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-[#94A3B8]">Technical Overview</h4>
              {activeModalFeature.detailedDescription.map((paragraph, i) => (
                <p key={i} className="text-xs text-[#CBD5E1] leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Specs Grid */}
            <div className="p-4 rounded-xl bg-[#081A3A] border border-[#18346B] space-y-2">
              <h4 className="text-xs font-mono uppercase tracking-wider text-[#94A3B8] mb-3">Performance Specifications</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {activeModalFeature.specs.map((spec) => (
                  <div key={spec.label} className="p-3 rounded-lg bg-[#10264F]/80 border border-[#18346B]">
                    <p className="text-[10px] font-mono text-[#94A3B8]">{spec.label}</p>
                    <p className="text-sm font-mono font-bold text-[#26D7E7] mt-1">{spec.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button variant="primary" size="sm" onClick={() => setActiveModalFeature(null)}>
                Close Module Inspection
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
