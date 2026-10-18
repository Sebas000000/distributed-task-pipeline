import React, { useMemo, useState } from 'react';
import {
  Check,
  Copy,
  Cpu,
  Download,
  Search,
} from 'lucide-react';
import type { JobDetail, JobItem } from '../types';

export interface StructuredLogEntry {
  id: string;
  timestamp: string;
  level: 'INFO' | 'DEBUG' | 'ERROR';
  source: string;
  category: string;
  message: string;
  details: Record<string, unknown>;
}

interface LogsConsoleProps {
  jobs: JobItem[];
  selectedJob: JobDetail | null;
  onSelectJob?: (jobId: string) => void;
}

export const LogsConsole: React.FC<LogsConsoleProps> = ({
  jobs,
  selectedJob,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState<'ALL' | 'INFO' | 'DEBUG' | 'ERROR'>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  // Compile structured log entries from all jobs or selected job
  const structuredLogs = useMemo(() => {
    const entries: StructuredLogEntry[] = [];

    const targetJobs = selectedJob ? [selectedJob] : jobs;

    targetJobs.forEach((job) => {
      const logs = (job as JobDetail).logs || [];
      const worker = job.assignedWorker || 'worker-01';
      const category = job.queueName;

      if (logs.length > 0) {
        logs.forEach((logLine, idx) => {
          let level: 'INFO' | 'DEBUG' | 'ERROR' = 'INFO';
          if (logLine.includes('[ALERT]') || logLine.includes('FAIL') || logLine.includes('503')) {
            level = 'ERROR';
          } else if (logLine.includes('Step 1') || logLine.includes('Resolving') || logLine.includes('Parsing')) {
            level = 'DEBUG';
          }

          // Extract timestamp if enclosed in brackets
          const timeMatch = logLine.match(/\[(\d{2}:\d{2}:\d{2}\.\d{3})\]/);
          const timeStr = timeMatch ? timeMatch[1] : new Date(job.createdAt).toLocaleTimeString([], { hour12: false });

          entries.push({
            id: `${job.jobId}-${idx}`,
            timestamp: timeStr,
            level,
            source: worker,
            category,
            message: logLine.replace(/\[\d{2}:\d{2}:\d{2}\.\d{3}\]\s*\[.*?\]\s*/, ''),
            details: {
              jobId: job.jobId,
              queue: job.queueName,
              handler: job.payloadType,
              progress: `${job.progress}%`,
              latency: job.latency ? `${job.latency}ms` : 'in-flight',
            },
          });
        });
      } else {
        // Synthesize single summary entry for jobs with no discrete steps yet
        entries.push({
          id: `${job.jobId}-root`,
          timestamp: new Date(job.createdAt).toLocaleTimeString([], { hour12: false }),
          level: job.status === 'failed' ? 'ERROR' : job.status === 'active' ? 'INFO' : 'DEBUG',
          source: worker,
          category,
          message: `Job ${job.jobId} [${job.payloadType}] registered with state ${job.status.toUpperCase()}`,
          details: {
            jobId: job.jobId,
            queue: job.queueName,
            status: job.status,
          },
        });
      }
    });

    return entries;
  }, [jobs, selectedJob]);

  // Apply filters
  const filteredLogs = useMemo(() => {
    return structuredLogs.filter((entry) => {
      const matchesLevel = levelFilter === 'ALL' || entry.level === levelFilter;
      const matchesCategory =
        categoryFilter === 'ALL' || entry.category === categoryFilter;
      const matchesSearch =
        entry.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.id.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesLevel && matchesCategory && matchesSearch;
    });
  }, [structuredLogs, levelFilter, categoryFilter, searchQuery]);

  const handleExportLogs = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(filteredLogs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `telemetry-logs-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const getLevelBadge = (level: 'INFO' | 'DEBUG' | 'ERROR') => {
    switch (level) {
      case 'INFO':
        return (
          <span className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/40">
            <span>INFO</span>
          </span>
        );
      case 'DEBUG':
        return (
          <span className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold text-purple-400 bg-purple-950/60 border border-purple-800/40">
            <span>DEBUG</span>
          </span>
        );
      case 'ERROR':
        return (
          <span className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold text-rose-400 bg-rose-950/60 border border-rose-800/40">
            <span>ERROR</span>
          </span>
        );
    }
  };

  return (
    <div className="px-6 pb-8">
      <div className="bg-[#15181e] border border-zinc-800/80 rounded-xl overflow-hidden shadow-sm">
        {/* 1. Toolbar */}
        <div className="p-4 border-b border-zinc-800/80 bg-[#12141a] flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-zinc-500" />
              <input
                type="text"
                placeholder="Filter logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#0c0d12] border border-zinc-800 rounded-lg pl-8 pr-3 py-1 text-xs text-zinc-200 placeholder:text-zinc-600 outline-hidden focus:border-emerald-500/60 w-44 sm:w-56"
              />
            </div>

            {/* Level Selector */}
            <div className="flex items-center space-x-1 bg-[#0c0d12] border border-zinc-800 rounded-lg p-0.5 text-xs font-mono">
              {(['ALL', 'INFO', 'DEBUG', 'ERROR'] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setLevelFilter(lvl)}
                  className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                    levelFilter === lvl
                      ? 'bg-zinc-800 text-zinc-100 font-semibold shadow-xs'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>

            {/* Category Selector */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-[#0c0d12] border border-zinc-800 text-zinc-300 text-xs font-mono rounded-lg px-2.5 py-1 outline-hidden focus:border-emerald-500/60"
            >
              <option value="ALL">All Queues</option>
              <option value="report-gen">report-gen</option>
              <option value="data-ingest">data-ingest</option>
              <option value="webhooks">webhooks</option>
            </select>
          </div>

          {/* Right Toolbar Actions */}
          <div className="flex items-center space-x-3">
            <span className="text-xs font-mono text-zinc-500">
              <span className="text-zinc-200 font-semibold">{filteredLogs.length}</span> events
            </span>

            <button
              onClick={handleExportLogs}
              className="flex items-center space-x-1.5 px-3 py-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 rounded-lg text-xs font-medium transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-zinc-400" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* 2. Dense Logs Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead>
              <tr className="border-b border-zinc-800/80 bg-[#171a22]/80 text-zinc-400 text-[11px] uppercase tracking-wider">
                <th className="py-2.5 px-4 font-semibold w-28">Time</th>
                <th className="py-2.5 px-3 font-semibold w-20">Level</th>
                <th className="py-2.5 px-4 font-semibold w-36">Worker / Source</th>
                <th className="py-2.5 px-4 font-semibold">Message</th>
                <th className="py-2.5 px-4 font-semibold w-72">Details (JSON)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/40 text-zinc-300">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-zinc-500 italic">
                    No log events match the selected criteria.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((entry) => (
                  <tr
                    key={entry.id}
                    className="hover:bg-zinc-800/30 transition-colors group"
                  >
                    {/* Time */}
                    <td className="py-2.5 px-4 text-zinc-500 whitespace-nowrap text-[11px]">
                      {entry.timestamp}
                    </td>

                    {/* Level */}
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      {getLevelBadge(entry.level)}
                    </td>

                    {/* Worker / Source */}
                    <td className="py-2.5 px-4 text-zinc-400 whitespace-nowrap">
                      <div className="flex items-center space-x-1.5">
                        <Cpu className="w-3.5 h-3.5 text-emerald-400/80" />
                        <span className="text-zinc-200">{entry.source}</span>
                      </div>
                    </td>

                    {/* Message */}
                    <td className="py-2.5 px-4 text-zinc-200 font-sans text-xs max-w-md break-words">
                      {entry.message}
                    </td>

                    {/* Details JSON Card */}
                    <td className="py-2.5 px-4">
                      <div className="bg-[#0c0d12] border border-zinc-800/90 rounded-md p-1.5 flex items-center justify-between text-[11px] font-mono text-zinc-400">
                        <span className="truncate mr-2 text-zinc-300">
                          {JSON.stringify(entry.details)}
                        </span>
                        <button
                          onClick={() =>
                            handleCopy(
                              JSON.stringify(entry.details, null, 2),
                              entry.id,
                            )
                          }
                          title="Copy details JSON"
                          className="text-zinc-500 hover:text-zinc-200 p-0.5 rounded transition-colors shrink-0"
                        >
                          {copiedId === entry.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
