import React from 'react';
import {
  Activity,
  Cpu,
  Database,
  Plus,
  RefreshCw,
} from 'lucide-react';

interface ClusterHeaderProps {
  onOpenDispatchModal: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  autoRefresh: boolean;
  onToggleAutoRefresh: () => void;
}

export const ClusterHeader: React.FC<ClusterHeaderProps> = ({
  onOpenDispatchModal,
  onRefresh,
  isRefreshing,
  autoRefresh,
  onToggleAutoRefresh,
}) => {
  return (
    <header className="h-[52px] bg-[#111113] border-b border-zinc-800/80 px-4 flex items-center justify-between select-none">
      {/* Cluster Navigation & Breadcrumbs */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center justify-center w-7 h-7 rounded bg-zinc-900 border border-zinc-800 text-indigo-400">
          <Cpu className="w-4 h-4" />
        </div>
        <div className="flex items-center space-x-2 text-xs">
          <span className="font-semibold text-zinc-100 tracking-tight">Cluster</span>
          <span className="text-zinc-600">/</span>
          <span className="text-zinc-400 font-medium">Worker Queues</span>
          <span className="text-zinc-600">/</span>
          <span className="text-zinc-300 font-mono bg-zinc-800/60 px-1.5 py-0.5 rounded border border-zinc-700/50">
            Ingestion Pipeline
          </span>
        </div>
      </div>

      {/* Cluster Status & Actions */}
      <div className="flex items-center space-x-4">
        {/* Redis Health Indicator */}
        <div className="hidden sm:flex items-center space-x-2 text-xs bg-zinc-900/90 border border-zinc-800/80 px-2.5 py-1 rounded">
          <Database className="w-3.5 h-3.5 text-zinc-400" />
          <span className="text-zinc-400">Redis Broker:</span>
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-dot"></span>
            <span className="font-medium text-emerald-400">Healthy</span>
            <span className="text-zinc-500 font-mono text-[11px]">(2ms ping)</span>
          </div>
        </div>

        {/* Polling / Auto-refresh Toggle */}
        <div className="flex items-center space-x-1.5">
          <button
            onClick={onToggleAutoRefresh}
            title={autoRefresh ? 'Auto-refresh active (3s)' : 'Auto-refresh paused'}
            className={`px-2 py-1 text-xs font-mono rounded border transition-colors flex items-center space-x-1 ${
              autoRefresh
                ? 'bg-indigo-950/40 text-indigo-300 border-indigo-800/60 hover:bg-indigo-900/40'
                : 'bg-zinc-900 text-zinc-500 border-zinc-800 hover:text-zinc-300'
            }`}
          >
            <Activity className="w-3 h-3" />
            <span className="hidden md:inline">{autoRefresh ? 'LIVE 3s' : 'PAUSED'}</span>
          </button>

          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            title="Manual refresh"
            className="p-1.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-all active:scale-[0.96] disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-indigo-400' : ''}`} />
          </button>
        </div>

        {/* Dispatch Job Action Button */}
        <button
          onClick={onOpenDispatchModal}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white text-xs font-medium rounded transition-all shadow-sm shadow-indigo-950 border border-indigo-400/30"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Dispatch Job</span>
        </button>
      </div>
    </header>
  );
};
