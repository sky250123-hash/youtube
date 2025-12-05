import React from 'react';
import { AnalysisPoint, AnalysisMetric } from '../types';
import { BrainCircuit, Zap, Activity, Eye } from 'lucide-react';

const iconMap = {
  [AnalysisMetric.HOOK]: Zap,
  [AnalysisMetric.PACING]: Activity,
  [AnalysisMetric.TONE]: BrainCircuit,
  [AnalysisMetric.RETENTION]: Eye,
};

const colorMap = {
  [AnalysisMetric.HOOK]: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  [AnalysisMetric.PACING]: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  [AnalysisMetric.TONE]: "text-purple-400 bg-purple-400/10 border-purple-400/20",
  [AnalysisMetric.RETENTION]: "text-green-400 bg-green-400/10 border-green-400/20",
};

export const AnalysisCard: React.FC<{ point: AnalysisPoint }> = ({ point }) => {
  const Icon = iconMap[point.metric] || Zap;
  const colorClass = colorMap[point.metric] || colorMap[AnalysisMetric.HOOK];

  return (
    <div className={`p-4 rounded-xl border ${colorClass} transition-all duration-300 hover:scale-[1.02]`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon className="w-5 h-5" />
          <span className="font-semibold text-sm tracking-wider opacity-90">{point.metric}</span>
        </div>
        <div className="text-xs font-bold px-2 py-1 rounded-full bg-white/10">
          Impact: {point.score}/10
        </div>
      </div>
      <p className="text-sm opacity-90 leading-relaxed">
        {point.description}
      </p>
    </div>
  );
};