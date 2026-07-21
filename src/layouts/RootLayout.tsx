import React from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { ParticleBackground } from '../components/common/ParticleBackground';
import { CommandPalette } from '../components/common/CommandPalette';
import { KeyboardShortcuts } from '../components/common/KeyboardShortcuts';

export const RootLayout: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-graphite-950 text-slate-100 flex flex-col font-sans antialiased overflow-x-hidden selection:bg-teal-500/30 selection:text-teal-300">
      {/* Canvas ambient energy particles */}
      <ParticleBackground />

      {/* Global Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 pt-20">
        <Outlet />
      </main>

      {/* Global Command Palette (Ctrl+K) */}
      <CommandPalette />

      {/* Keyboard Shortcuts Modal (?) */}
      <KeyboardShortcuts />

      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        theme="dark"
        toastOptions={{
          style: {
            background: '#161B26',
            color: '#F8FAFC',
            border: '1px solid rgba(0, 229, 255, 0.3)',
            borderRadius: '16px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          },
        }}
      />

      {/* Global Footer */}
      <Footer />
    </div>
  );
};
