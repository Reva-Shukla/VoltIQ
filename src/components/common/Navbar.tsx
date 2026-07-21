import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sun, Moon, Keyboard, Menu, X, ShieldAlert, Activity, ChevronRight } from 'lucide-react';
import { Logo } from './Logo';
import { useTheme } from '../../contexts/ThemeContext';
import { useFleet } from '../../contexts/FleetContext';
import { cn } from '../../utils/cn';

export const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { setIsCommandPaletteOpen, setIsShortcutsOpen, alerts } = useFleet();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Features', path: '/features' },
    { name: 'Dashboard', path: '/dashboard', badge: 'Live' },
    { name: 'Analytics', path: '/analytics' },
    { name: 'About', path: '/about' },
    { name: 'Team', path: '/team' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-40 transition-all duration-300 px-4 sm:px-8 py-3.5',
        isScrolled
          ? 'bg-graphite-950/85 backdrop-blur-xl border-b border-charcoal-700/50 shadow-2xl py-2.5'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <Logo size="md" />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-charcoal-900/60 p-1.5 rounded-2xl border border-charcoal-700/40 backdrop-blur-md">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  cn(
                    'relative px-3.5 py-1.5 text-xs font-display font-medium rounded-xl transition-all flex items-center gap-1.5 cursor-pointer',
                    isActive
                      ? 'text-teal-300 font-semibold'
                      : 'text-slate-300 hover:text-slate-100 hover:bg-charcoal-800/40'
                  )
                }
              >
                {link.name}
                {link.badge && (
                  <span className="px-1.5 py-0.2 text-[9px] font-mono font-bold uppercase rounded-md bg-teal-500/20 text-teal-300 border border-teal-500/30 animate-pulse">
                    {link.badge}
                  </span>
                )}
                {isActive && (
                  <motion.div
                    layoutId="navbarActiveIndicator"
                    className="absolute inset-0 bg-charcoal-700/80 rounded-xl border border-teal-500/30 shadow-[0_0_15px_rgba(0,229,255,0.15)] -z-10"
                    transition={{ type: 'spring', duration: 0.4 }}
                  />
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Actions (Command Palette, Theme, Shortcuts, Mobile Menu) */}
        <div className="flex items-center gap-2.5">
          {/* Live Status indicator */}
          <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-charcoal-900/80 border border-charcoal-700/50 text-[11px] font-mono">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
            </span>
            <span className="text-slate-300 font-medium">300 VEHS ONLINE</span>
          </div>

          {/* Command Palette Button */}
          <button
            onClick={() => setIsCommandPaletteOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-charcoal-800/60 hover:bg-charcoal-700/80 border border-charcoal-600/40 text-slate-300 text-xs font-mono transition-colors cursor-pointer"
            title="Command Palette (Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5 text-teal-400" />
            <span className="hidden sm:inline">Search</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] bg-graphite-900 border border-charcoal-600 rounded text-slate-400">
              Ctrl+K
            </kbd>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-charcoal-800/60 hover:bg-charcoal-700/80 border border-charcoal-600/40 text-slate-300 hover:text-teal-300 transition-colors cursor-pointer"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-teal-400" />}
          </button>

          {/* Shortcuts Modal trigger */}
          <button
            onClick={() => setIsShortcutsOpen(true)}
            className="hidden sm:flex p-2 rounded-xl bg-charcoal-800/60 hover:bg-charcoal-700/80 border border-charcoal-600/40 text-slate-300 hover:text-teal-300 transition-colors cursor-pointer"
            title="Keyboard Shortcuts (?)"
          >
            <Keyboard className="w-4 h-4 text-slate-400 hover:text-slate-100" />
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-charcoal-800/60 border border-charcoal-600/40 text-slate-200"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden mt-3 pt-3 pb-4 border-t border-charcoal-700/50 bg-graphite-900/95 backdrop-blur-xl rounded-2xl p-4 space-y-2 border border-charcoal-600/40 shadow-2xl"
          >
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-display transition-colors',
                  location.pathname === link.path
                    ? 'bg-teal-500/20 text-teal-300 font-semibold border border-teal-500/30'
                    : 'text-slate-300 hover:bg-charcoal-800/60'
                )}
              >
                <span>{link.name}</span>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
