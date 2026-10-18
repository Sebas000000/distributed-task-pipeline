import React from 'react';
import { Layers } from 'lucide-react';
import type { ClusterMetrics } from '../types';

interface QueuesViewProps {
  metrics: ClusterMetrics | null;
  onSelectQueue: (queueName: string) => void;
}

export const QueuesView: React.FC<QueuesViewProps> = ({
  metrics,
  onSelectQueue,
}) => {
  const queues = metrics?.queues || [
    {
      queueName: 'report-gen',
      waiting: 34,
      active: 5,
      completed: 1240,
      failed: 0,
      delayed: 0,
      paused: false,
    },
    {
      queueName: 'data-ingest',
      waiting: 85,
      active: 9,
      completed: 2750,
      failed: 1,
      delayed: 0,
      paused: false,
    },
    {
      queueName: 'webhooks',
      waiting: 23,
      active: 4,
      completed: 860,
      failed: 1,
      delayed: 0,
      paused: false,
    },
  ];

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-zinc-800/80">
        <div>
          <h2 className="text-base font-bold text-zinc-100 font-sans tracking-tight">
            Cluster BullMQ Queues
          </h2>
          <p className="text-xs text-zinc-500 font-mono mt-0.5">
            Active partitions & stream pipelines registered in Redis broker
          </p>
        </div>
        <span className="text-xs font-mono text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-800/50">
          3 Active Queues
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {queues.map((q) => (
          <div
            key={q.queueName}
            onClick={() => onSelectQueue(q.queueName)}
            className="bg-[#15181e] border border-zinc-800/80 rounded-xl p-5 hover:border-emerald-500/40 transition-all cursor-pointer group shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <Layers className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-mono text-sm font-bold text-zinc-100 group-hover:text-emerald-300 transition-colors">
                    {q.queueName}
                  </span>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              </div>

              {/* Counts Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono mb-4">
                <div className="bg-[#0c0d12] p-2 rounded-lg border border-zinc-800/80">
                  <span className="text-[10px] text-zinc-500 block">WAITING</span>
                  <span className="text-sm font-bold text-amber-400">{q.waiting}</span>
                </div>
                <div className="bg-[#0c0d12] p-2 rounded-lg border border-zinc-800/80">
                  <span className="text-[10px] text-zinc-500 block">ACTIVE</span>
                  <span className="text-sm font-bold text-emerald-400">{q.active}</span>
                </div>
                <div className="bg-[#0c0d12] p-2 rounded-lg border border-zinc-800/80">
                  <span className="text-[10px] text-zinc-500 block">COMPLETED</span>
                  <span className="text-sm font-bold text-zinc-200">{q.completed}</span>
                </div>
                <div className="bg-[#0c0d12] p-2 rounded-lg border border-zinc-800/80">
                  <span className="text-[10px] text-zinc-500 block">FAILED</span>
                  <span className="text-sm font-bold text-rose-400">{q.failed}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs font-mono text-zinc-500">
              <span>Status: Active</span>
              <span className="text-emerald-400 group-hover:underline">Inspect stream &rarr;</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
