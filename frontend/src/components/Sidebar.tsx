import React from 'react';
import {
  Activity,
  AlertOctagon,
  BarChart3,
  Cpu,
  Layers,
  Radio,
  Search,
  Send,
  Server,
  Settings,
  ShieldCheck,
} from 'lucide-react';

export type ActiveNavTab =
  | 'dashboard'
  | 'queues'
  | 'workers'
  | 'dispatcher'
  | 'stream'
  | 'errors'
  | 'deadletter';

interface SidebarProps {
  activeTab: ActiveNavTab;
  onSelectTab: (tab: ActiveNavTab) => void;
  waitingCount: number;
  activeWorkersCount: number;
  failedCount: number;
  onOpenDispatch: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  waitingCount,
  activeWorkersCount,
  failedCount,
  onOpenDispatch,
}) => {
  return (
    <aside className="w-64 bg-[#0f1115] border-r border-zinc-800/80 flex flex-col shrink-0 select-none">
      {/* 1. Header & Cluster Logo */}
      <div className="p-4 border-b border-zinc-800/80 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-sm shadow-emerald-950">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-bold text-sm text-zinc-100 tracking-tight">Voxbase</span>
              <span className="text-[10px] font-mono font-medium px-1.5 py-0.2 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">
                v2.4
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 font-mono">cluster-node-01</p>
          </div>
        </div>
      </div>

      {/* 2. Quick Search Bar */}
      <div className="p-3 border-b border-zinc-800/60">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-zinc-500" />
          <input
            type="text"
            placeholder="Quick search ( / )..."
            className="w-full bg-[#15181e] border border-zinc-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-zinc-300 placeholder:text-zinc-600 outline-hidden focus:border-emerald-500/60 transition-colors"
          />
        </div>
      </div>

      {/* 3. Navigation Sections */}
      <div className="flex-1 overflow-y-auto p-3 space-y-6">
        {/* Section: General */}
        <div className="space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 px-2 font-semibold">
            General
          </span>

          <button
            onClick={() => onSelectTab('dashboard')}
            className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'dashboard'
                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#15181e]'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <BarChart3 className="w-4 h-4" />
              <span>Dashboard</span>
            </div>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          </button>

          <button
            onClick={() => onSelectTab('queues')}
            className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'queues'
                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#15181e]'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <Layers className="w-4 h-4" />
              <span>Queues</span>
            </div>
            {waitingCount > 0 && (
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                {waitingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => onSelectTab('workers')}
            className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'workers'
                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#15181e]'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <Cpu className="w-4 h-4" />
              <span>Workers</span>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
              {activeWorkersCount} online
            </span>
          </button>

          <button
            onClick={onOpenDispatch}
            className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium text-zinc-400 hover:text-emerald-300 hover:bg-[#15181e] transition-all group"
          >
            <div className="flex items-center space-x-2.5">
              <Send className="w-4 h-4 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
              <span>Dispatcher</span>
            </div>
            <span className="text-[10px] font-mono text-zinc-500">+ Job</span>
          </button>
        </div>

        {/* Section: Telemetry & Observability */}
        <div className="space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 px-2 font-semibold">
            Telemetry
          </span>

          <button
            onClick={() => onSelectTab('stream')}
            className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'stream'
                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#15181e]'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <Activity className="w-4 h-4 text-teal-400" />
              <span>Live Stream</span>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </button>

          <button
            onClick={() => onSelectTab('errors')}
            className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'errors'
                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#15181e]'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <AlertOctagon className="w-4 h-4 text-rose-400" />
              <span>Error Logs</span>
            </div>
            {failedCount > 0 && (
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-rose-950/80 text-rose-300 border border-rose-800/60">
                {failedCount}
              </span>
            )}
          </button>

          <button
            onClick={() => onSelectTab('deadletter')}
            className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'deadletter'
                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#15181e]'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <Server className="w-4 h-4" />
              <span>Dead-Letter</span>
            </div>
            <span className="text-[10px] font-mono text-zinc-500">DLQ</span>
          </button>
        </div>
      </div>

      {/* 4. Operator Profile & Footer */}
      <div className="p-3 border-t border-zinc-800/80 bg-[#12141a] flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-mono text-xs font-bold text-zinc-300">
            OP
          </div>
          <div className="text-left">
            <div className="flex items-center space-x-1">
              <span className="text-xs font-semibold text-zinc-200">Admin Operator</span>
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
            </div>
            <p className="text-[10px] font-mono text-zinc-500">ops@cluster.io</p>
          </div>
        </div>

        <button
          title="Account Settings"
          className="text-zinc-500 hover:text-zinc-300 p-1 rounded-lg hover:bg-zinc-800 transition-colors"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
