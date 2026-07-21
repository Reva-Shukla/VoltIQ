import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../utils/cn';

interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
  category?: string;
}

interface AccordionProps {
  items: AccordionItem[];
  defaultOpenId?: string;
  className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({ items, defaultOpenId, className }) => {
  const [openId, setOpenId] = useState<string | null>(defaultOpenId || null);

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className={cn('space-y-3', className)}>
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div
            key={item.id}
            className="rounded-2xl glass-panel border border-charcoal-600/40 overflow-hidden transition-colors"
          >
            <button
              onClick={() => toggle(item.id)}
              className="w-full p-5 flex items-center justify-between text-left cursor-pointer hover:bg-charcoal-800/40 transition-colors"
            >
              <div className="flex items-center gap-3 pr-4">
                {item.category && (
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono uppercase bg-teal-500/10 text-teal-400 border border-teal-500/20 shrink-0">
                    {item.category}
                  </span>
                )}
                <span className="font-display font-medium text-slate-100 text-sm sm:text-base">
                  {item.title}
                </span>
              </div>
              <ChevronDown
                className={cn('w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300', isOpen && 'rotate-180 text-teal-400')}
              />
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  <div className="px-5 pb-5 pt-1 text-sm text-slate-300 leading-relaxed border-t border-charcoal-700/30">
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};
