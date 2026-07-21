import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '../../utils/cn';

interface CardProps extends HTMLMotionProps<'div'> {
  hoverEffect?: boolean;
  glowColor?: 'teal' | 'amber' | 'rust' | 'none';
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  hoverEffect = false,
  glowColor = 'none',
  children,
  className,
  ...props
}) => {
  const glowStyles = {
    teal: 'hover:border-teal-500/50 hover:shadow-[0_0_30px_rgba(0,229,255,0.2)]',
    amber: 'hover:border-amber-500/50 hover:shadow-[0_0_30px_rgba(245,158,11,0.2)]',
    rust: 'hover:border-rust/50 hover:shadow-[0_0_30px_rgba(239,68,68,0.2)]',
    none: '',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'relative rounded-2xl glass-panel p-6 overflow-hidden transition-all duration-300',
        hoverEffect && 'hover:-translate-y-1 hover:border-teal-500/40 cursor-pointer',
        glowStyles[glowColor],
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};
