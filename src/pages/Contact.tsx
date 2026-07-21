import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { MapPin, Globe, Send, Building, GraduationCap } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

const contactSchema = z.object({
  fullName: z.string().min(2, 'Full Name must be at least 2 characters.'),
  workEmail: z.string().email('Please enter a valid work email address.'),
  companyName: z.string().min(2, 'Company name is required.'),
  fleetSize: z.string().min(1, 'Please select your current EV fleet size.'),
  message: z.string().min(10, 'Message must be at least 10 characters.'),
});

type ContactFormData = z.infer<typeof contactSchema>;

export const Contact: React.FC = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = (data: ContactFormData) => {
    toast.success('Enterprise Inquiry Transmitted!', {
      description: `Thank you ${data.fullName}. Team Ctrl Freaks will contact ${data.workEmail} promptly.`,
    });
    reset();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="teal" size="sm">ENTERPRISE INQUIRIES & TELEMETRY PILOTS</Badge>
        <h1 className="text-4xl sm:text-5xl font-display font-extrabold text-[#F8FAFC]">
          Connect with VoltIQ Engineers
        </h1>
        <p className="text-sm sm:text-base text-[#CBD5E1] leading-relaxed">
          Request an enterprise pilot deployment for your heavy commercial EV fleet or schedule a technical deep-dive with our AI architects.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Form Column */}
        <div className="lg:col-span-7">
          <Card className="p-6 sm:p-8 border-[#18346B] bg-[#10264F]/50 backdrop-blur-xl space-y-6">
            <div>
              <h2 className="text-xl font-display font-bold text-[#F8FAFC]">Request Telemetry Pilot Demo</h2>
              <p className="text-xs text-[#94A3B8] mt-1 font-mono">Fill out the validated form below to connect with our enterprise team.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-[#CBD5E1]">Full Name *</label>
                  <input
                    type="text"
                    {...register('fullName')}
                    placeholder="Fleet Manager Name"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#081A3A] border border-[#18346B] text-[#F8FAFC] placeholder-[#94A3B8] focus:outline-none focus:border-[#26D7E7]"
                  />
                  {errors.fullName && <p className="text-[10px] font-mono text-[#EF4444]">{errors.fullName.message}</p>}
                </div>

                {/* Work Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-[#CBD5E1]">Work Email *</label>
                  <input
                    type="email"
                    {...register('workEmail')}
                    placeholder="manager@logistics.com"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#081A3A] border border-[#18346B] text-[#F8FAFC] placeholder-[#94A3B8] focus:outline-none focus:border-[#26D7E7]"
                  />
                  {errors.workEmail && <p className="text-[10px] font-mono text-[#EF4444]">{errors.workEmail.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Company Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-[#CBD5E1]">Company / Organization *</label>
                  <input
                    type="text"
                    {...register('companyName')}
                    placeholder="North India Logistics Corp"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#081A3A] border border-[#18346B] text-[#F8FAFC] placeholder-[#94A3B8] focus:outline-none focus:border-[#26D7E7]"
                  />
                  {errors.companyName && <p className="text-[10px] font-mono text-[#EF4444]">{errors.companyName.message}</p>}
                </div>

                {/* Fleet Size */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-[#CBD5E1]">EV Fleet Size *</label>
                  <select
                    {...register('fleetSize')}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#081A3A] border border-[#18346B] text-[#F8FAFC] focus:outline-none focus:border-[#26D7E7] cursor-pointer"
                  >
                    <option value="">Select Fleet Size...</option>
                    <option value="1-25">1 – 25 Commercial EVs</option>
                    <option value="26-100">26 – 100 Commercial EVs</option>
                    <option value="101-500">101 – 500 Commercial EVs</option>
                    <option value="500+">500+ Enterprise Fleet</option>
                  </select>
                  {errors.fleetSize && <p className="text-[10px] font-mono text-[#EF4444]">{errors.fleetSize.message}</p>}
                </div>
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-[#CBD5E1]">Technical Requirements / Message *</label>
                <textarea
                  rows={4}
                  {...register('message')}
                  placeholder="Tell us about your fleet composition, route corridors, depot charging infrastructure, and primary goals..."
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#081A3A] border border-[#18346B] text-[#F8FAFC] placeholder-[#94A3B8] focus:outline-none focus:border-[#26D7E7]"
                />
                {errors.message && <p className="text-[10px] font-mono text-[#EF4444]">{errors.message.message}</p>}
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                disabled={isSubmitting}
                icon={<Send className="w-4 h-4" />}
              >
                Transmit Enterprise Request
              </Button>
            </form>
          </Card>
        </div>

        {/* VoltIQ Development Network Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="relative rounded-2xl glass-panel p-5 border-[#26D7E7]/30 bg-[#10264F]/50 backdrop-blur-xl space-y-3">
            <h3 className="font-display font-bold text-[#F8FAFC] text-lg flex items-center gap-2">
              <Globe className="w-5 h-5 text-[#26D7E7]" /> VoltIQ Development Network
            </h3>
            <p className="text-xs text-[#CBD5E1] leading-relaxed">
              Designed and engineered at Chitkara University while focusing on solving North India's electric fleet intelligence challenges through AI, predictive analytics, and battery health research.
            </p>
          </div>

          <div className="space-y-4">
            {/* Primary Development Center - Chitkara University */}
            <div className="p-5 rounded-2xl bg-[#081A3A] border-2 border-[#26D7E7] shadow-[0_0_25px_rgba(38,215,231,0.25)] space-y-2 transition-transform duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <p className="font-display font-bold text-[#F8FAFC] text-base flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-[#26D7E7]" /> Chitkara University Innovation Hub
                </p>
                <Badge variant="teal" size="sm">Primary R&D Center</Badge>
              </div>
              <p className="text-xs font-mono text-[#26D7E7] font-semibold">Rajpura, Punjab</p>
              <p className="text-xs text-[#CBD5E1] leading-relaxed font-sans pt-1">
                Home of VoltIQ's product design, frontend development, FastAPI backend engineering, AI integration, dashboard architecture, and overall platform development for the Economic Times AI Hackathon 2026.
              </p>
            </div>

            {/* Other Regional Development Hubs */}
            {[
              {
                name: 'Ludhiana Industrial Fleet',
                location: 'Ludhiana, Punjab',
                icon: Building,
                desc: 'Inspired the industrial fleet monitoring, predictive maintenance workflows, logistics operations, and real-world commercial EV use cases represented throughout VoltIQ.',
              },
              {
                name: 'Chandigarh Smart Mobility Hub',
                location: 'Chandigarh',
                icon: MapPin,
                desc: 'Represents urban electric mobility, battery analytics, charging infrastructure, and intelligent transportation systems integrated into the VoltIQ platform.',
              },
              {
                name: 'Delhi NCR Fleet Operations',
                location: 'Delhi NCR',
                icon: Globe,
                desc: 'Demonstrates large-scale commercial fleet intelligence, enterprise deployment scenarios, predictive maintenance operations, and AI-powered fleet management.',
              },
            ].map((hub) => {
              const IconComponent = hub.icon;
              return (
                <div
                  key={hub.name}
                  className="p-4 rounded-xl bg-[#081A3A] border border-[#18346B] hover:border-[#26D7E7]/50 space-y-1.5 transition-all duration-300 hover:-translate-y-0.5"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-display font-bold text-[#F8FAFC] text-sm flex items-center gap-2">
                      <IconComponent className="w-4 h-4 text-[#26D7E7]" /> {hub.name}
                    </p>
                    <span className="text-[10px] font-mono text-[#94A3B8]">{hub.location}</span>
                  </div>
                  <p className="text-xs text-[#CBD5E1] leading-relaxed font-sans">
                    {hub.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
