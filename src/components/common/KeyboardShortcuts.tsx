import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from '../ui/Modal';
import { useFleet } from '../../contexts/FleetContext';
import { Keyboard, CornerDownLeft } from 'lucide-react';

export const KeyboardShortcuts: React.FC = () => {
  const { isShortcutsOpen, setIsShortcutsOpen, setIsCommandPaletteOpen } = useFleet();
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore key shortcuts if user is typing inside input or textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key === '?') {
        e.preventDefault();
        setIsShortcutsOpen(!isShortcutsOpen);
      } else if (e.key.toLowerCase() === 'd') {
        navigate('/dashboard');
      } else if (e.key.toLowerCase() === 'f') {
        navigate('/features');
      } else if (e.key.toLowerCase() === 'a') {
        navigate('/analytics');
      } else if (e.key.toLowerCase() === 'h') {
        navigate('/');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isShortcutsOpen, setIsShortcutsOpen, navigate]);

  const shortcutList = [
    { key: 'Ctrl + K', desc: 'Open Command Palette & VIN Search' },
    { key: 'D', desc: 'Navigate to Fleet Dashboard' },
    { key: 'F', desc: 'Navigate to Features Overview' },
    { key: 'A', desc: 'Navigate to Battery Analytics' },
    { key: 'H', desc: 'Navigate to Home Landing Page' },
    { key: '?', desc: 'Toggle Keyboard Shortcuts Guide' },
    { key: 'ESC', desc: 'Close open Modals & Drawers' },
  ];

  return (
    <Modal
      isOpen={isShortcutsOpen}
      onClose={() => setIsShortcutsOpen(false)}
      title={
        <span className="flex items-center gap-2">
          <Keyboard className="w-5 h-5 text-teal-400" />
          Platform Keyboard Shortcuts
        </span>
      }
      subtitle="Quick keybindings for control room navigation"
      maxWidth="md"
    >
      <div className="space-y-3">
        {shortcutList.map((sc) => (
          <div
            key={sc.key}
            className="flex items-center justify-between p-3 rounded-xl bg-charcoal-800/50 border border-charcoal-600/40"
          >
            <span className="text-xs font-sans text-slate-300">{sc.desc}</span>
            <kbd className="px-2.5 py-1 text-xs font-mono font-bold bg-graphite-900 text-teal-300 border border-teal-500/30 rounded-lg shadow-inner flex items-center gap-1">
              {sc.key}
              <CornerDownLeft className="w-3 h-3 text-slate-500" />
            </kbd>
          </div>
        ))}
      </div>
    </Modal>
  );
};
