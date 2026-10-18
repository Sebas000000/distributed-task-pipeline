import React, { useEffect, useState } from 'react';
import {
  Activity,
  Calendar,
  ChevronRight,
  Download,
  Plus,
  RefreshCw,
} from 'lucide-react';
import type { JobDetail } from '../types';

interface TopBarProps {
  selectedJob: JobDetail | null;
  currentQueue: string;
  onOpenDispatch: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  autoRefresh: boolean;
  onToggleAutoRefresh: () => void;
  onExportDump: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  selectedJob,
  currentQueue,
  onOpenDispatch,
  onRefresh,
  isRefreshing,
  autoRefresh,
  onToggleAutoRefresh,
  onExportDump,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        }),
      );
    };

    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="h-14 bg-[#111318] border-b border-zinc-800/80 px-6 flex items-center justify-between select-none shrink-0">
      {/* 1. Breadcrumbs */}
      <div className="flex items-center space-x-2 text-xs">
        <span className="text-zinc-400 font-medium hover:text-zinc-200 cursor-pointer">
          Queues
        </span>
        <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
        <span className="font-mono text-zinc-300 bg-[#171a22] px-2 py-0.5 rounded border border-zinc-700/60">
          {selectedJob?.queueName || currentQueue || 'cluster-wide'}
        </span>
        {selectedJob && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
            <span className="font-mono font-semibold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
              {selectedJob.jobId} [{selectedJob.status.toUpperCase()}]
            </span>
          </>
        )}
      </div>

      {/* 2. Actions & Live Clock */}
      <div className="flex items-center space-x-4">
        {/* Live Clock */}
        <div className="hidden md:flex items-center space-x-1.5 text-xs font-mono text-zinc-400 bg-[#171a22] px-2.5 py-1 rounded border border-zinc-800">
          <Calendar className="w-3.5 h-3.5 text-zinc-500" />
          <span>{currentTime || '12:00:00'}</span>
          <span className="text-emerald-400 text-[10px] ml-1 font-semibold">UTC</span>
        </div>

        {/* Polling / Live indicator */}
        <button
          onClick={onToggleAutoRefresh}
          className={`flex items-center space-x-1.5 px-2.5 py-1 text-xs font-mono rounded border transition-colors ${
            autoRefresh
              ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/60 hover:bg-emerald-900/40'
              : 'bg-zinc-900 text-zinc-500 border-zinc-800 hover:text-zinc-300'
          }`}
          title={autoRefresh ? 'Live Polling active (3s)' : 'Polling paused'}
        >
          <Activity className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{autoRefresh ? 'STREAMING' : 'PAUSED'}</span>
        </button>

        {/* Manual Refresh */}
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="p-1.5 rounded-lg bg-[#171a22] border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-all active:scale-[0.96] disabled:opacity-50"
          title="Force telemetry refresh"
        >
          <RefreshCw
            className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`}
          />
        </button>

        {/* Export Telemetry Dump */}
        <button
          onClick={onExportDump}
          className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 bg-[#171a22] hover:bg-zinc-800 text-zinc-300 border border-zinc-700/80 rounded-lg text-xs font-medium transition-colors"
        >
          <Download className="w-3.5 h-3.5 text-zinc-400" />
          <span>Dump</span>
        </button>

        {/* Primary Action Button: Dispatch Job */}
        <button
          onClick={onOpenDispatch}
          className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-zinc-950 font-semibold text-xs rounded-lg transition-all shadow-md shadow-emerald-950/50"
        >
          <Plus className="w-4 h-4" />
          <span>Dispatch Job</span>
        </button>
      </div>
    </header>
  );
};
