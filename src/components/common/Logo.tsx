import React from 'react';
import { cn } from '../../utils/cn';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({ className, size = 'md' }) => {
  const imageSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <div className={cn('inline-flex items-center gap-3 font-display font-bold tracking-tight select-none', className)}>
      <div className={cn('relative rounded-xl overflow-hidden shadow-[0_0_20px_rgba(38,215,231,0.35)] border border-[#26D7E7]/30 transition-transform duration-300 hover:scale-105', imageSizes[size])}>
        <img
          src="/assets/voltiq-logo.png"
          alt="VoltIQ Logo"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex flex-col">
        <span className={cn('font-extrabold text-[#F8FAFC] flex items-center gap-1.5 leading-none tracking-tight', textSizes[size])}>
          VOLT<span className="text-[#26D7E7] font-black text-cyan-glow">IQ</span>
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#26D7E7] animate-pulse" />
        </span>
        <span className="text-[9px] font-mono tracking-widest uppercase text-[#94A3B8] mt-0.5">
          EV Fleet Intelligence
        </span>
      </div>
    </div>
  );
};
