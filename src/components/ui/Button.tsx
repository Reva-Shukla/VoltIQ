import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '../../utils/cn';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  children,
  className,
  ...props
}) => {
  const baseStyles = 'relative inline-flex items-center justify-center font-display font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-400/50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer overflow-hidden';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3.5 text-base gap-2.5',
  };

  const variantStyles = {
    primary: 'bg-gradient-to-r from-teal-500 to-cyan-400 text-graphite-950 font-semibold hover:from-teal-400 hover:to-cyan-300 shadow-[0_0_20px_rgba(0,229,255,0.3)] hover:shadow-[0_0_30px_rgba(0,229,255,0.5)]',
    secondary: 'bg-charcoal-700/80 text-slate-100 hover:bg-charcoal-600 border border-charcoal-500/50 hover:border-teal-500/40',
    outline: 'bg-transparent text-teal-300 border border-teal-500/40 hover:bg-teal-500/10 hover:border-teal-400',
    danger: 'bg-rust/20 text-red-400 border border-rust/40 hover:bg-rust/30 hover:border-rust shadow-[0_0_15px_rgba(239,68,68,0.2)]',
    ghost: 'bg-transparent text-slate-400 hover:text-slate-100 hover:bg-charcoal-700/40',
  };

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      whileHover={{ scale: 1.02 }}
      className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </motion.button>
  );
};
