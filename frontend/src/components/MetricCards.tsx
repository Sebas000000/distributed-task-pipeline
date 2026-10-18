import React from 'react';
import {
  CheckCircle2,
  Clock,
  Layers,
  TrendingUp,
  Zap,
} from 'lucide-react';
import type { ClusterMetrics } from '../types';

interface MetricCardsProps {
  metrics: ClusterMetrics | null;
  avgLatencyMs?: number;
}

export const MetricCards: React.FC<MetricCardsProps> = ({
  metrics,
  avgLatencyMs = 486,
}) => {
  const summary = metrics?.summary || {
    throughputOpsPerSec: 4850,
    waitingJobs: 142,
    failureRatePercentage: 1.6,
  };

  const successRate = (100 - (summary.failureRatePercentage || 1.6)).toFixed(1);
  const formattedThroughput = Number(summary.throughputOpsPerSec || 4850).toLocaleString(
    undefined,
    { maximumFractionDigits: 0 },
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 p-6 bg-[#0c0d12]">
      {/* 1. Task Duration / Latency */}
      <div className="bg-[#15181e] border border-zinc-800/80 rounded-xl p-4 relative overflow-hidden group hover:border-zinc-700/80 transition-all shadow-sm">
        <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
          <span className="font-medium tracking-tight flex items-center space-x-2">
            <Clock className="w-4 h-4 text-emerald-400" />
            <span className="text-zinc-200">Task Duration</span>
          </span>
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-800/40">
            Within target
          </span>
        </div>

        <div className="flex items-baseline space-x-1.5 mb-2">
          <span className="text-2xl font-bold font-mono text-zinc-100 tracking-tight">
            {avgLatencyMs}
          </span>
          <span className="text-xs font-mono text-zinc-500">ms avg</span>
        </div>

        {/* Mini progress bar */}
        <div className="w-full bg-zinc-800/80 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-emerald-400 h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, (avgLatencyMs / 1000) * 100)}%` }}
          ></div>
        </div>

        <div className="mt-2 text-[11px] font-mono text-zinc-500 flex items-center justify-between">
          <span>Target: &lt; 600ms</span>
          <span className="text-emerald-400/90 font-medium">92% fast paths</span>
        </div>
      </div>

      {/* 2. Throughput */}
      <div className="bg-[#15181e] border border-zinc-800/80 rounded-xl p-4 relative overflow-hidden group hover:border-zinc-700/80 transition-all shadow-sm">
        <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
          <span className="font-medium tracking-tight flex items-center space-x-2">
            <Zap className="w-4 h-4 text-teal-400" />
            <span className="text-zinc-200">Throughput</span>
          </span>
          <span className="flex items-center text-[11px] font-mono text-emerald-400 bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-800/40">
            <TrendingUp className="w-3 h-3 mr-0.5" />
            +8.2%
          </span>
        </div>

        <div className="flex items-baseline space-x-1.5 mb-2">
          <span className="text-2xl font-bold font-mono text-zinc-100 tracking-tight">
            {formattedThroughput}
          </span>
          <span className="text-xs font-mono text-zinc-500">ops/s</span>
        </div>

        <div className="w-full bg-zinc-800/80 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-teal-400 h-full rounded-full transition-all duration-500"
            style={{ width: '84%' }}
          ></div>
        </div>

        <div className="mt-2 text-[11px] font-mono text-zinc-500 flex items-center justify-between">
          <span>Cluster capacity</span>
          <span className="text-zinc-300">84% peak</span>
        </div>
      </div>

      {/* 3. Queue Backlog */}
      <div className="bg-[#15181e] border border-zinc-800/80 rounded-xl p-4 relative overflow-hidden group hover:border-zinc-700/80 transition-all shadow-sm">
        <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
          <span className="font-medium tracking-tight flex items-center space-x-2">
            <Layers className="w-4 h-4 text-sky-400" />
            <span className="text-zinc-200">Queue Backlog</span>
          </span>
          <span className="text-[11px] font-mono text-zinc-400 bg-zinc-800/60 px-1.5 py-0.5 rounded">
            3 queues
          </span>
        </div>

        <div className="flex items-baseline space-x-1.5 mb-2">
          <span className="text-2xl font-bold font-mono text-zinc-100 tracking-tight">
            {summary.waitingJobs}
          </span>
          <span className="text-xs font-mono text-zinc-500">queued</span>
        </div>

        <div className="w-full bg-zinc-800/80 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-sky-400 h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, (summary.waitingJobs / 300) * 100)}%` }}
          ></div>
        </div>

        <div className="mt-2 text-[11px] font-mono text-zinc-500 flex items-center justify-between">
          <span>Buffer capacity</span>
          <span className="text-zinc-300">~120ms wait</span>
        </div>
      </div>

      {/* 4. Success Rate */}
      <div className="bg-[#15181e] border border-zinc-800/80 rounded-xl p-4 relative overflow-hidden group hover:border-zinc-700/80 transition-all shadow-sm">
        <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
          <span className="font-medium tracking-tight flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="text-zinc-200">Success Rate</span>
          </span>
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-800/40">
            Resolved
          </span>
        </div>

        <div className="flex items-baseline space-x-1.5 mb-2">
          <span className="text-2xl font-bold font-mono text-emerald-400 tracking-tight">
            {successRate}%
          </span>
          <span className="text-xs font-mono text-zinc-500">ratio</span>
        </div>

        <div className="w-full bg-zinc-800/80 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-emerald-400 h-full rounded-full transition-all duration-500"
            style={{ width: `${successRate}%` }}
          ></div>
        </div>

        <div className="mt-2 text-[11px] font-mono text-zinc-500 flex items-center justify-between">
          <span>Reliability</span>
          <span className="text-zinc-300">Without failure</span>
        </div>
      </div>
    </div>
  );
};
