import React from 'react';
import {
  AlertTriangle,
  ArrowUpRight,
  Clock,
  Cpu,
  Zap,
} from 'lucide-react';
import type { ClusterMetrics as ClusterMetricsType } from '../types';

interface ClusterMetricsProps {
  metrics: ClusterMetricsType | null;
}

export const ClusterMetrics: React.FC<ClusterMetricsProps> = ({ metrics }) => {
  const summary = metrics?.summary || {
    throughputOpsPerSec: 4850,
    activeJobs: 18,
    waitingJobs: 142,
    failedJobs: 2,
    failureRatePercentage: 0.04,
  };

  const formattedThroughput = Number(summary.throughputOpsPerSec || 0).toLocaleString(undefined, {
    maximumFractionDigits: 1,
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-4 bg-[#09090b]">
      {/* 1. Throughput */}
      <div className="bg-[#111113] border border-zinc-800/80 rounded p-3 relative overflow-hidden group hover:border-zinc-700/80 transition-colors">
        <div className="flex items-center justify-between text-zinc-400 text-xs mb-1.5">
          <span className="font-medium tracking-tight flex items-center space-x-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Throughput</span>
          </span>
          <span className="flex items-center text-[11px] font-mono text-emerald-400 bg-emerald-950/40 px-1 py-0.5 rounded border border-emerald-800/40">
            <ArrowUpRight className="w-3 h-3 mr-0.5" />
            +8.2%
          </span>
        </div>
        <div className="flex items-baseline space-x-1.5">
          <span className="text-xl font-bold font-mono text-zinc-100 tracking-tight">
            {formattedThroughput}
          </span>
          <span className="text-xs font-mono text-zinc-500">ops/sec</span>
        </div>
        <div className="mt-2 text-[11px] text-zinc-500 flex items-center justify-between">
          <span>Target: 5,000 ops/s</span>
          <span className="text-zinc-400 font-mono">97.0% cap</span>
        </div>
      </div>

      {/* 2. In-Flight Jobs */}
      <div className="bg-[#111113] border border-zinc-800/80 rounded p-3 relative overflow-hidden group hover:border-zinc-700/80 transition-colors">
        <div className="flex items-center justify-between text-zinc-400 text-xs mb-1.5">
          <span className="font-medium tracking-tight flex items-center space-x-1.5">
            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
            <span>In-Flight Jobs</span>
          </span>
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
        </div>
        <div className="flex items-baseline space-x-1.5">
          <span className="text-xl font-bold font-mono text-indigo-400 tracking-tight">
            {summary.activeJobs}
          </span>
          <span className="text-xs font-mono text-zinc-500">running</span>
        </div>
        <div className="mt-2 text-[11px] text-zinc-500 flex items-center justify-between">
          <span>Active Nodes</span>
          <span className="text-zinc-400 font-mono">4 workers assigned</span>
        </div>
      </div>

      {/* 3. Backlog / Queued */}
      <div className="bg-[#111113] border border-zinc-800/80 rounded p-3 relative overflow-hidden group hover:border-zinc-700/80 transition-colors">
        <div className="flex items-center justify-between text-zinc-400 text-xs mb-1.5">
          <span className="font-medium tracking-tight flex items-center space-x-1.5">
            <Clock className="w-3.5 h-3.5 text-sky-400" />
            <span>Backlog / Queued</span>
          </span>
          <span className="text-[11px] font-mono text-zinc-400 bg-zinc-800/50 px-1 py-0.5 rounded">
            3 queues
          </span>
        </div>
        <div className="flex items-baseline space-x-1.5">
          <span className="text-xl font-bold font-mono text-zinc-100 tracking-tight">
            {summary.waitingJobs}
          </span>
          <span className="text-xs font-mono text-zinc-500">waiting</span>
        </div>
        <div className="mt-2 text-[11px] text-zinc-500 flex items-center justify-between">
          <span>Avg Wait Latency</span>
          <span className="text-zinc-400 font-mono">~120ms</span>
        </div>
      </div>

      {/* 4. Dead-Letter / Failed */}
      <div className="bg-[#111113] border border-zinc-800/80 rounded p-3 relative overflow-hidden group hover:border-zinc-700/80 transition-colors">
        <div className="flex items-center justify-between text-zinc-400 text-xs mb-1.5">
          <span className="font-medium tracking-tight flex items-center space-x-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            <span>Dead-Letter / Failed</span>
          </span>
          <span
            className={`text-[11px] font-mono px-1 py-0.5 rounded border ${
              summary.failedJobs > 0
                ? 'text-rose-400 bg-rose-950/40 border-rose-800/40'
                : 'text-zinc-500 bg-zinc-900 border-zinc-800'
            }`}
          >
            {summary.failureRatePercentage}% rate
          </span>
        </div>
        <div className="flex items-baseline space-x-1.5">
          <span
            className={`text-xl font-bold font-mono tracking-tight ${
              summary.failedJobs > 0 ? 'text-rose-400' : 'text-zinc-100'
            }`}
          >
            {summary.failedJobs}
          </span>
          <span className="text-xs font-mono text-zinc-500">failed</span>
        </div>
        <div className="mt-2 text-[11px] text-zinc-500 flex items-center justify-between">
          <span>Retry Policy</span>
          <span className="text-zinc-400 font-mono">Exponential (3x)</span>
        </div>
      </div>
    </div>
  );
};
