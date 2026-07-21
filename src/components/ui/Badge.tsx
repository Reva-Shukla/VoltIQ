import React from 'react';
import { cn } from '../../utils/cn';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'active' | 'charging' | 'maintenance' | 'critical' | 'teal' | 'amber' | 'neutral' | 'outline';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  className,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center gap-1.5 font-mono font-medium rounded-full transition-all';
  
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-xs',
  };

  const variantStyles = {
    active: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]',
    charging: 'bg-teal-500/15 text-teal-300 border border-teal-500/30 shadow-[0_0_10px_rgba(0,229,255,0.2)]',
    maintenance: 'bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.2)]',
    critical: 'bg-rust-500/15 text-rust text-red-400 border border-rust-500/40 shadow-[0_0_12px_rgba(239,68,68,0.3)] animate-pulse',
    teal: 'bg-teal-500/10 text-teal-300 border border-teal-500/30',
    amber: 'bg-amber-500/10 text-amber-300 border border-amber-500/30',
    neutral: 'bg-charcoal-700/60 text-slate-300 border border-charcoal-600/40',
    outline: 'bg-transparent text-slate-300 border border-charcoal-500/50',
  };

  return (
    <span
      className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
      {...props}
    >
      {children}
    </span>
  );
};
