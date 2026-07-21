import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Share2 } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

export interface TeamMemberData {
  id: string;
  name: string;
  role: string;
  badge: string;
  specialty: string;
  bio: string;
  image: string;
  github: string;
  linkedin: string;
}

export const TEAM_MEMBERS_DATA: TeamMemberData[] = [
  {
    id: 'reva-shukla',
    name: 'Reva Shukla',
    role: 'Frontend Developer • UI/UX Designer • Product Designer',
    badge: 'Product & UI Lead',
    specialty: 'UX Architecture & Design System',
    bio: 'Architected the VoltIQ user experience, design system, interactive North India fleet corridor, breathing battery centerpiece, and responsive control room dashboard.',
    image: '/images/reva.jpeg',
    github: 'https://github.com/Reva-Shukla',
    linkedin: 'https://www.linkedin.com/in/reva-shukla-a32271366/',
  },
  {
    id: 'tanishqa-bhagat',
    name: 'Tanishqa Bhagat',
    role: 'AI/ML Engineer',
    badge: 'AI & Prognostics',
    specialty: 'Scikit-Learn ML & XAI Attributions',
    bio: 'Trained Random Forest and Gradient Boosting regression models for SOH forecasting, NASA battery prognostics, and Perturbation Explainable AI engines.',
    image: '/images/tanishqa.jpeg',
    github: 'https://github.com/tanishqa-207',
    linkedin: 'https://www.linkedin.com/in/tanishqa-bhagat-025935395',
  },
  {
    id: 'jiya-anand',
    name: 'Jiya Anand',
    role: 'Backend Developer',
    badge: 'FastAPI Architect',
    specialty: 'API Endpoints & Model Loaders',
    bio: 'Designed the unified FastAPI backend architecture, Pydantic schemas, sub-second API endpoint routes, and low-latency startup model warming pipeline.',
    image: '/images/jiya.jpeg',
    github: 'https://github.com/JiyaAnand2608',
    linkedin: 'https://www.linkedin.com/in/jiya-anand-a3a492216',
  },
];

export const Team: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="teal" size="sm">CRAFTED BY TEAM CTRL FREAKS</Badge>
        <h1 className="text-4xl sm:text-5xl font-display font-extrabold text-[#F8FAFC]">
          Meet the Minds Behind VoltIQ
        </h1>
        <p className="text-sm sm:text-base text-[#CBD5E1] leading-relaxed font-sans">
          Built for the Economic Times AI Hackathon 2026. Combining AI innovation, battery physics analytics, high-performance FastAPI microservices, and design excellence.
        </p>
      </div>

      {/* Team Cards Grid */}
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
    </div>
  );
};
