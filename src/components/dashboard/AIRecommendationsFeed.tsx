import React from 'react';
import { Sparkles, ArrowRight, TrendingUp, ShieldAlert, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { useFleet } from '../../contexts/FleetContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

export const AIRecommendationsFeed: React.FC = () => {
  const { recommendations } = useFleet();

  const handleApply = (title: string, impact: string) => {
    toast.success(`Applied AI Protocol: ${title}`, {
      description: `Optimizing thermal and battery charging parameters. Impact: ${impact}.`,
    });
  };

  return (
    <Card className="border-charcoal-600/40 p-5 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-charcoal-700/40">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
          <h3 className="text-base font-display font-bold text-slate-100">
            Autonomous AI Battery Advisory Engine
          </h3>
        </div>
        <Badge variant="amber" size="sm">
          VoltIQ Copilot Active
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className="p-4 rounded-xl bg-charcoal-900/80 border border-charcoal-700/60 hover:border-amber-500/40 transition-colors flex flex-col justify-between gap-3"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  {rec.category} • VIN: {rec.vin}
                </span>
                <Badge variant={rec.impact === 'High' ? 'critical' : 'teal'} size="sm">
                  {rec.impact} Impact
                </Badge>
              </div>

              <h4 className="font-display font-semibold text-slate-100 text-sm">{rec.title}</h4>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{rec.description}</p>
            </div>

            <div className="pt-3 border-t border-charcoal-800 flex items-center justify-between gap-2">
              <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> {rec.estimatedSavings}
              </span>

              <Button
                variant="outline"
                size="sm"
                className="text-xs font-mono py-1 px-3"
                onClick={() => handleApply(rec.title, rec.impact)}
              >
                {rec.actionText} <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
