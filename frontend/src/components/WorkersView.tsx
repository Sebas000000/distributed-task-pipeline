import React from 'react';
import { Cpu } from 'lucide-react';

interface WorkerNode {
  id: string;
  name: string;
  status: 'ONLINE' | 'BUSY' | 'DRAINING';
  concurrency: number;
  activeJobs: number;
  completedTotal: number;
  uptime: string;
  memoryUsage: string;
  queues: string[];
}

export const WorkersView: React.FC = () => {
  const workers: WorkerNode[] = [
    {
      id: 'node-us-east-1a',
      name: 'worker-01',
      status: 'ONLINE',
      concurrency: 5,
      activeJobs: 3,
      completedTotal: 1840,
      uptime: '14h 22m',
      memoryUsage: '64.2 MB',
      queues: ['report-gen', 'data-ingest', 'webhooks'],
    },
    {
      id: 'node-us-east-1b',
      name: 'worker-02',
      status: 'ONLINE',
      concurrency: 5,
      activeJobs: 2,
      completedTotal: 1420,
      uptime: '14h 22m',
      memoryUsage: '58.7 MB',
      queues: ['report-gen', 'data-ingest'],
    },
    {
      id: 'node-us-east-1c',
      name: 'worker-03',
      status: 'BUSY',
      concurrency: 5,
      activeJobs: 5,
      completedTotal: 980,
      uptime: '8h 14m',
      memoryUsage: '82.1 MB',
      queues: ['data-ingest'],
    },
    {
      id: 'node-us-east-1d',
      name: 'worker-04',
      status: 'ONLINE',
      concurrency: 5,
      activeJobs: 1,
      completedTotal: 610,
      uptime: '4h 02m',
      memoryUsage: '49.4 MB',
      queues: ['webhooks'],
    },
  ];

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-zinc-800/80">
        <div>
          <h2 className="text-base font-bold text-zinc-100 font-sans tracking-tight">
            Distributed Worker Nodes
          </h2>
          <p className="text-xs text-zinc-500 font-mono mt-0.5">
            Decoupled consumers listening to BullMQ queues across Redis cluster
          </p>
        </div>
        <span className="text-xs font-mono text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-800/50">
          4 Nodes Healthy
        </span>
      </div>

      <div className="bg-[#15181e] border border-zinc-800/80 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs font-mono border-collapse">
          <thead>
            <tr className="border-b border-zinc-800/80 bg-[#111318] text-zinc-400 text-[11px] uppercase tracking-wider">
              <th className="py-3 px-4 font-semibold">Worker Node</th>
              <th className="py-3 px-3 font-semibold">Status</th>
              <th className="py-3 px-3 font-semibold">Concurrency</th>
              <th className="py-3 px-3 font-semibold">Active Jobs</th>
              <th className="py-3 px-3 font-semibold">Processed</th>
              <th className="py-3 px-3 font-semibold">Memory</th>
              <th className="py-3 px-3 font-semibold">Uptime</th>
              <th className="py-3 px-4 font-semibold">Bound Queues</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50 text-zinc-300">
            {workers.map((worker) => (
              <tr key={worker.id} className="hover:bg-zinc-800/30 transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-2">
                    <Cpu className="w-4 h-4 text-emerald-400" />
                    <div>
                      <span className="font-bold text-zinc-100">{worker.name}</span>
                      <span className="text-[10px] text-zinc-500 block">{worker.id}</span>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-3">
                  <span
                    className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-semibold ${
                      worker.status === 'ONLINE'
                        ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                        : 'bg-amber-950/60 text-amber-400 border border-amber-800/40'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    <span>{worker.status}</span>
                  </span>
                </td>
                <td className="py-3 px-3 text-zinc-200">{worker.concurrency} slots</td>
                <td className="py-3 px-3">
                  <span className="text-emerald-400 font-bold">{worker.activeJobs}</span> / {worker.concurrency}
                </td>
                <td className="py-3 px-3 text-zinc-200">{worker.completedTotal.toLocaleString()}</td>
                <td className="py-3 px-3 text-zinc-400">{worker.memoryUsage}</td>
                <td className="py-3 px-3 text-zinc-400">{worker.uptime}</td>
                <td className="py-3 px-4">
                  <div className="flex flex-wrap gap-1">
                    {worker.queues.map((q) => (
                      <span
                        key={q}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-[#0c0d12] border border-zinc-800 text-zinc-300"
                      >
                        {q}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
