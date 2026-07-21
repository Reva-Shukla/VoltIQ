import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

interface TabItem {
  id: string;
  label: string;
  count?: number;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onChange, className }) => {
  return (
    <div className={cn('flex flex-wrap items-center gap-1 bg-charcoal-900/60 p-1.5 rounded-2xl border border-charcoal-700/40', className)}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              'relative px-4 py-2 text-xs font-display font-medium rounded-xl transition-colors flex items-center gap-2 cursor-pointer z-10',
              isActive ? 'text-teal-300 font-semibold' : 'text-slate-400 hover:text-slate-200'
            )}
          >
            {tab.icon && <span>{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={cn(
                  'px-1.5 py-0.5 rounded-full text-[10px] font-mono',
                  isActive ? 'bg-teal-500/20 text-teal-300' : 'bg-charcoal-700 text-slate-400'
                )}
              >
                {tab.count}
              </span>
            )}

            {isActive && (
              <motion.div
                layoutId="activeTabPill"
                className="absolute inset-0 bg-charcoal-700/80 rounded-xl border border-teal-500/30 shadow-[0_0_12px_rgba(0,229,255,0.15)] -z-10"
                transition={{ type: 'spring', duration: 0.4 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
};
