import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Zap, ArrowLeft, Home } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 sm:px-8 py-12 text-center">
      <div className="max-w-md w-full space-y-6">
        {/* Animated Battery Disconnect Visual */}
        <div className="relative mx-auto w-24 h-24 rounded-3xl bg-rust/10 border border-rust/40 flex items-center justify-center shadow-[0_0_40px_rgba(239,68,68,0.2)] animate-pulse">
          <ShieldAlert className="w-12 h-12 text-rust" />
        </div>

        <div className="space-y-2">
          <Badge variant="critical" size="sm">404 HIGH VOLTAGE DISCONNECT</Badge>
          <h1 className="text-4xl font-display font-extrabold text-slate-100 tracking-tight">
            Telemetry Route Lost
          </h1>
          <p className="text-xs font-mono text-slate-400 leading-relaxed">
            The requested control room endpoint or vehicle ID does not exist in the active CANbus stream matrix.
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/dashboard">
            <Button variant="primary" size="md" icon={<Zap className="w-4 h-4" />}>
              Return to Control Room
            </Button>
          </Link>
          <Link to="/">
            <Button variant="outline" size="md" icon={<Home className="w-4 h-4" />}>
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
