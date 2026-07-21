import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Command, LayoutDashboard, Zap, BarChart3, Users, HelpCircle, Sun, Moon, Download, ShieldAlert, ChevronRight } from 'lucide-react';
import { useFleet } from '../../contexts/FleetContext';
import { useTheme } from '../../contexts/ThemeContext';

export const CommandPalette: React.FC = () => {
  const { isCommandPaletteOpen, setIsCommandPaletteOpen, vehicles, setSelectedVehicle, exportCSV } = useFleet();
  const { theme, toggleTheme } = useTheme();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(!isCommandPaletteOpen);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, setIsCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const filteredVehicles = vehicles
    .filter((v) =>
      v.vin.toLowerCase().includes(query.toLowerCase()) ||
      v.model.toLowerCase().includes(query.toLowerCase()) ||
      v.driver.toLowerCase().includes(query.toLowerCase()) ||
      v.id.toLowerCase().includes(query.toLowerCase())
    )
    .slice(0, 5);

  const pages = [
    { label: 'Control Room Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Platform Features & Modules', path: '/features', icon: Zap },
    { label: 'Deep Battery Analytics', path: '/analytics', icon: BarChart3 },
    { label: 'Engineering & Executive Team', path: '/team', icon: Users },
    { label: 'About VoltIQ Mission', path: '/about', icon: HelpCircle },
  ].filter((p) => p.label.toLowerCase().includes(query.toLowerCase()));

  const handleSelectVehicle = (vehicle: typeof vehicles[0]) => {
    setSelectedVehicle(vehicle);
    setIsCommandPaletteOpen(false);
    navigate('/dashboard');
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsCommandPaletteOpen(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsCommandPaletteOpen(false)}
          className="fixed inset-0 bg-graphite-950/80 backdrop-blur-md"
        />

        {/* Command Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ type: 'spring', damping: 26, stiffness: 320 }}
          className="relative w-full max-w-xl z-10 glass-panel rounded-2xl border border-teal-500/30 shadow-2xl overflow-hidden"
        >
          {/* Input field */}
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-charcoal-700/50 bg-charcoal-900/60">
            <Search className="w-5 h-5 text-teal-400 shrink-0" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type a command, search VIN, driver, or navigate..."
              className="w-full bg-transparent text-slate-100 placeholder-slate-400 text-sm focus:outline-none font-sans"
            />
            <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono bg-charcoal-700 text-slate-400 rounded border border-charcoal-600">
              <Command className="w-3 h-3" /> ESC
            </kbd>
          </div>

          {/* Results section */}
          <div className="max-h-96 overflow-y-auto p-2 space-y-4">
            {/* Quick Actions */}
            <div>
              <p className="px-3 py-1 text-[10px] font-mono uppercase tracking-widest text-slate-400">Quick Actions</p>
              <div className="space-y-1 mt-1">
                <button
                  onClick={() => {
                    toggleTheme();
                    setIsCommandPaletteOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-display text-slate-300 hover:text-slate-100 hover:bg-charcoal-700/60 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2.5">
                    {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-teal-400" />}
                    Toggle {theme === 'dark' ? 'Light' : 'Dark'} Theme Mode
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">Action</span>
                </button>

                <button
                  onClick={() => {
                    exportCSV();
                    setIsCommandPaletteOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-display text-slate-300 hover:text-slate-100 hover:bg-charcoal-700/60 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2.5">
                    <Download className="w-4 h-4 text-teal-400" />
                    Export 300 Fleet Telemetry Records (CSV)
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">Data</span>
                </button>
              </div>
            </div>

            {/* Pages Navigation */}
            {pages.length > 0 && (
              <div>
                <p className="px-3 py-1 text-[10px] font-mono uppercase tracking-widest text-slate-400">Navigation</p>
                <div className="space-y-1 mt-1">
                  {pages.map((page) => {
                    const Icon = page.icon;
                    return (
                      <button
                        key={page.path}
                        onClick={() => handleNavigate(page.path)}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-display text-slate-300 hover:text-teal-300 hover:bg-teal-500/10 transition-colors cursor-pointer"
                      >
                        <span className="flex items-center gap-2.5">
                          <Icon className="w-4 h-4 text-teal-400" />
                          {page.label}
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Vehicle Search Results */}
            {filteredVehicles.length > 0 && (
              <div>
                <p className="px-3 py-1 text-[10px] font-mono uppercase tracking-widest text-slate-400">Vehicles Matching ({filteredVehicles.length})</p>
                <div className="space-y-1 mt-1">
                  {filteredVehicles.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => handleSelectVehicle(v)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-left text-slate-300 hover:text-teal-300 hover:bg-charcoal-700/60 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <ShieldAlert className="w-4 h-4 text-slate-400" />
                        <div>
                          <p className="font-mono font-semibold text-slate-100">{v.id} — {v.vin}</p>
                          <p className="text-[10px] text-slate-400">{v.model} • Driver: {v.driver}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-mono text-[11px] text-teal-400">{v.soh}% SOH</span>
                        <p className="text-[10px] text-slate-500">{v.status}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="px-4 py-2 border-t border-charcoal-700/40 bg-charcoal-900/40 text-[11px] text-slate-400 font-mono flex items-center justify-between">
            <span>Press <kbd className="text-teal-400">Ctrl+K</kbd> anywhere to open</span>
            <span>VoltIQ Enterprise Command v2.4</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
