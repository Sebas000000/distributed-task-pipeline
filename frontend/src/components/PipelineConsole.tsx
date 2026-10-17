import React, { useState } from 'react';
import {
  AlertCircle,
  Copy,
  Cpu,
  Database,
  Layers,
  Radio,
  Search,
  Terminal,
} from 'lucide-react';
import type { JobDetail, JobItem, JobStatus, QueueName } from '../types';

interface PipelineConsoleProps {
  jobs: JobItem[];
  selectedJob: JobDetail | null;
  onSelectJob: (id: string) => void;
  statusFilter: JobStatus;
  onChangeStatusFilter: (status: JobStatus) => void;
  queueFilter: string;
  onChangeQueueFilter: (queue: string) => void;
  isLoading: boolean;
}

export const PipelineConsole: React.FC<PipelineConsoleProps> = ({
  jobs,
  selectedJob,
  onSelectJob,
  statusFilter,
  onChangeStatusFilter,
  queueFilter,
  onChangeQueueFilter,
  isLoading,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeInspectorTab, setActiveInspectorTab] = useState<
    'logs' | 'payload' | 'metadata'
  >('logs');
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopyFeedback(label);
    setTimeout(() => setCopyFeedback(null), 1800);
  };

  // Filter jobs by search query
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.jobId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.payloadType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (job.assignedWorker &&
        job.assignedWorker.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded text-[11px] font-mono font-medium text-indigo-300 bg-indigo-950/60 border border-indigo-800/60">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></span>
            <span>active</span>
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded text-[11px] font-mono font-medium text-emerald-400 bg-emerald-950/40 border border-emerald-800/40">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>completed</span>
          </span>
        );
      case 'waiting':
        return (
          <span className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded text-[11px] font-mono font-medium text-amber-400 bg-amber-950/40 border border-amber-800/40">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            <span>waiting</span>
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded text-[11px] font-mono font-medium text-rose-400 bg-rose-950/40 border border-rose-800/40">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
            <span>failed</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded text-[11px] font-mono font-medium text-zinc-400 bg-zinc-900 border border-zinc-800">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-500"></span>
            <span>{status}</span>
          </span>
        );
    }
  };

  const getQueueColorClass = (queue: QueueName) => {
    switch (queue) {
      case 'report-gen':
        return 'text-sky-400 bg-sky-950/30 border-sky-800/40';
      case 'data-ingest':
        return 'text-purple-400 bg-purple-950/30 border-purple-800/40';
      case 'webhooks':
        return 'text-teal-400 bg-teal-950/30 border-teal-800/40';
      default:
        return 'text-zinc-400 bg-zinc-900 border-zinc-800';
    }
  };

  return (
    <div className="flex-1 flex flex-col lg:flex-row overflow-hidden border-t border-zinc-800/80 bg-[#09090b]">
      {/* ======================================================== */}
      {/* LEFT COLUMN: 45% WIDTH - JOB STREAM                      */}
      {/* ======================================================== */}
      <section className="w-full lg:w-[45%] flex flex-col border-b lg:border-b-0 lg:border-r border-zinc-800/80 bg-[#09090b] overflow-hidden">
        {/* Controls Bar: Status Filter Tabs & Search */}
        <div className="p-3 border-b border-zinc-800/80 bg-[#111113]/60 space-y-2">
          {/* Status Tabs */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1 text-xs font-mono">
              {(['all', 'active', 'waiting', 'completed', 'failed'] as JobStatus[]).map(
                (status) => (
                  <button
                    key={status}
                    onClick={() => onChangeStatusFilter(status)}
                    className={`px-2.5 py-1 rounded capitalize transition-all ${
                      statusFilter === status
                        ? 'bg-zinc-800 text-zinc-100 font-semibold border border-zinc-700/80 shadow-xs'
                        : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900'
                    }`}
                  >
                    {status}
                  </button>
                ),
              )}
            </div>

            {/* Queue Selector */}
            <select
              value={queueFilter}
              onChange={(e) => onChangeQueueFilter(e.target.value)}
              className="text-xs font-mono bg-zinc-900 border border-zinc-800 text-zinc-300 rounded px-2 py-1 outline-hidden focus:border-indigo-500/60"
            >
              <option value="all">All Queues</option>
              <option value="report-gen">report-gen</option>
              <option value="data-ingest">data-ingest</option>
              <option value="webhooks">webhooks</option>
            </select>
          </div>

          {/* Unified Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-zinc-500" />
            <input
              type="text"
              placeholder="Search by job ID, handler, or worker node..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#09090b] border border-zinc-800 rounded pl-8 pr-3 py-1.5 text-xs font-mono text-zinc-200 placeholder:text-zinc-600 outline-hidden focus:border-zinc-700 transition-colors"
            />
          </div>
        </div>

        {/* Dense Job Stream List */}
        <div className="flex-1 overflow-y-auto divide-y divide-zinc-800/50">
          {isLoading && jobs.length === 0 ? (
            <div className="p-8 text-center text-zinc-500 text-xs font-mono">
              <span className="inline-block animate-spin mr-2">◒</span>
              Polling cluster queue events...
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="p-8 text-center text-zinc-500 text-xs font-mono space-y-1">
              <p>No jobs found matching the selected criteria.</p>
              <p className="text-[11px] text-zinc-600">
                Click "+ Dispatch Job" above to enqueue a task.
              </p>
            </div>
          ) : (
            filteredJobs.map((job) => {
              const isSelected = selectedJob?.jobId === job.jobId;

              return (
                <div
                  key={job.jobId}
                  onClick={() => onSelectJob(job.jobId)}
                  className={`p-3 cursor-pointer transition-all border-l-2 select-none group ${
                    isSelected
                      ? 'bg-[#18181b] border-l-indigo-500 text-zinc-100'
                      : 'border-l-transparent hover:bg-zinc-900/60 text-zinc-300'
                  }`}
                >
                  {/* Top Row: Job ID & Status Badge */}
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-semibold text-zinc-200 tracking-tight">
                        {job.jobId}
                      </span>
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${getQueueColorClass(
                          job.queueName,
                        )}`}
                      >
                        {job.queueName}
                      </span>
                    </div>
                    {getStatusBadge(job.status)}
                  </div>

                  {/* Middle Row: Handler / Payload Type & Worker */}
                  <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
                    <span className="font-mono text-[11px] text-zinc-300">
                      {job.payloadType}
                    </span>
                    <span className="font-mono text-[11px] text-zinc-500 flex items-center space-x-1">
                      <Cpu className="w-3 h-3 text-zinc-600" />
                      <span>{job.assignedWorker || 'unassigned'}</span>
                    </span>
                  </div>

                  {/* Mini Animated Progress Bar */}
                  <div className="w-full bg-zinc-800 rounded-full h-1 overflow-hidden mb-1.5">
                    <div
                      className={`h-full transition-all duration-300 ${
                        job.status === 'completed'
                          ? 'bg-emerald-500'
                          : job.status === 'failed'
                            ? 'bg-rose-500'
                            : 'bg-indigo-500'
                      }`}
                      style={{ width: `${Math.max(job.progress, 5)}%` }}
                    ></div>
                  </div>

                  {/* Bottom Row: Latency & Timestamp */}
                  <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500">
                    <span>
                      {job.latency !== null ? `${job.latency}ms latency` : 'in queue'}
                    </span>
                    <span>
                      {new Date(job.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* ======================================================== */}
      {/* RIGHT COLUMN: 55% WIDTH - REAL-TIME EXECUTION INSPECTOR   */}
      {/* ======================================================== */}
      <section className="w-full lg:w-[55%] flex flex-col bg-[#09090b] overflow-hidden">
        {selectedJob ? (
          <>
            {/* Inspector Header */}
            <div className="p-4 border-b border-zinc-800/80 bg-[#111113] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-base font-bold text-zinc-100">
                    {selectedJob.jobId}
                  </span>
                  <button
                    onClick={() => handleCopy(selectedJob.jobId, 'jobId')}
                    title="Copy Job ID"
                    className="p-1 rounded text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  {copyFeedback === 'jobId' && (
                    <span className="text-[10px] font-mono text-emerald-400">Copied!</span>
                  )}
                  {getStatusBadge(selectedJob.status)}
                </div>
                <div className="flex items-center space-x-3 text-xs font-mono text-zinc-400 mt-1">
                  <span>Queue: {selectedJob.queueName}</span>
                  <span className="text-zinc-700">•</span>
                  <span>Handler: {selectedJob.payloadType}</span>
                  <span className="text-zinc-700">•</span>
                  <span>Worker: {selectedJob.assignedWorker || 'worker-01'}</span>
                </div>
              </div>

              {/* Progress and Latency Telemetry */}
              <div className="flex items-center space-x-4 text-right">
                <div>
                  <div className="text-[11px] font-mono text-zinc-500">Execution Time</div>
                  <div className="text-xs font-mono text-zinc-200 font-semibold">
                    {selectedJob.latency !== null ? `${selectedJob.latency} ms` : 'Processing...'}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] font-mono text-zinc-500">Progress</div>
                  <div className="text-xs font-mono text-indigo-400 font-semibold">
                    {selectedJob.progress}%
                  </div>
                </div>
              </div>
            </div>

            {/* Inspector Navigation Tabs */}
            <div className="px-4 border-b border-zinc-800/80 bg-[#111113]/70 flex items-center justify-between">
              <div className="flex space-x-4 text-xs font-mono">
                <button
                  onClick={() => setActiveInspectorTab('logs')}
                  className={`py-2.5 border-b-2 font-medium flex items-center space-x-1.5 transition-colors ${
                    activeInspectorTab === 'logs'
                      ? 'border-indigo-500 text-indigo-300'
                      : 'border-transparent text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Execution Logs</span>
                  <span className="text-[10px] bg-zinc-800 px-1 rounded text-zinc-400">
                    {selectedJob.logs?.length || 0}
                  </span>
                </button>

                <button
                  onClick={() => setActiveInspectorTab('payload')}
                  className={`py-2.5 border-b-2 font-medium flex items-center space-x-1.5 transition-colors ${
                    activeInspectorTab === 'payload'
                      ? 'border-indigo-500 text-indigo-300'
                      : 'border-transparent text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <Database className="w-3.5 h-3.5" />
                  <span>Event Payload (JSON)</span>
                </button>

                <button
                  onClick={() => setActiveInspectorTab('metadata')}
                  className={`py-2.5 border-b-2 font-medium flex items-center space-x-1.5 transition-colors ${
                    activeInspectorTab === 'metadata'
                      ? 'border-indigo-500 text-indigo-300'
                      : 'border-transparent text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Retry Metadata</span>
                </button>
              </div>

              {activeInspectorTab === 'payload' && (
                <button
                  onClick={() =>
                    handleCopy(JSON.stringify(selectedJob.payload, null, 2), 'payload')
                  }
                  className="text-[11px] font-mono text-zinc-400 hover:text-zinc-200 flex items-center space-x-1 px-2 py-1 bg-zinc-900 border border-zinc-800 rounded"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copyFeedback === 'payload' ? 'Copied!' : 'Copy JSON'}</span>
                </button>
              )}
            </div>

            {/* Inspector Tab Content */}
            <div className="flex-1 overflow-y-auto p-4 bg-[#09090b]">
              {/* TAB 1: Terminal de Logs */}
              {activeInspectorTab === 'logs' && (
                <div className="bg-[#050506] border border-zinc-800/90 rounded font-mono text-xs p-3 overflow-x-auto min-h-[340px] shadow-inner">
                  {selectedJob.logs && selectedJob.logs.length > 0 ? (
                    <div className="space-y-1.5">
                      {selectedJob.logs.map((logLine, index) => {
                        const lineNumber = String(index + 1).padStart(2, '0');
                        const isAlert =
                          logLine.includes('[ALERT]') || logLine.includes('FAIL');
                        const isSuccess =
                          logLine.includes('100%') || logLine.includes('acknowledged');

                        return (
                          <div
                            key={index}
                            className={`flex items-start space-x-3 leading-relaxed hover:bg-zinc-900/40 px-1 rounded transition-colors ${
                              isAlert
                                ? 'text-rose-300 bg-rose-950/20'
                                : isSuccess
                                  ? 'text-emerald-300'
                                  : 'text-zinc-300'
                            }`}
                          >
                            <span className="text-zinc-600 select-none text-[11px] w-5 text-right font-mono">
                              {lineNumber}
                            </span>
                            <span className="flex-1 break-all">
                              {logLine}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-zinc-600 italic py-8 text-center font-mono">
                      [Waiting for worker execution logs to stream...]
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: Visor JSON Formateado */}
              {activeInspectorTab === 'payload' && (
                <div className="bg-[#050506] border border-zinc-800/90 rounded p-4 font-mono text-xs overflow-x-auto">
                  <pre className="text-zinc-200 leading-relaxed">
                    {JSON.stringify(selectedJob.payload, null, 2)}
                  </pre>
                </div>
              )}

              {/* TAB 3: Retry & Cluster Metadata */}
              {activeInspectorTab === 'metadata' && (
                <div className="space-y-3 font-mono text-xs">
                  <div className="bg-[#111113] border border-zinc-800/80 rounded p-4 space-y-2">
                    <div className="text-zinc-400 font-semibold mb-2">
                      Cluster Execution Chronology
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-zinc-300">
                      <div>
                        <span className="text-zinc-500">Enqueued At:</span>
                        <div className="text-zinc-200">{selectedJob.createdAt}</div>
                      </div>
                      <div>
                        <span className="text-zinc-500">Processed On:</span>
                        <div className="text-zinc-200">
                          {selectedJob.processedOn || 'Pending processing'}
                        </div>
                      </div>
                      <div>
                        <span className="text-zinc-500">Finished On:</span>
                        <div className="text-zinc-200">
                          {selectedJob.finishedOn || 'In-flight'}
                        </div>
                      </div>
                      <div>
                        <span className="text-zinc-500">Assigned Node:</span>
                        <div className="text-zinc-200">
                          {selectedJob.assignedWorker || 'Unassigned'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {selectedJob.failedReason && (
                    <div className="bg-rose-950/20 border border-rose-800/50 rounded p-4 text-rose-300">
                      <div className="font-semibold flex items-center space-x-1.5 mb-1 text-rose-400">
                        <AlertCircle className="w-4 h-4" />
                        <span>Execution Failure Reason</span>
                      </div>
                      <p className="text-xs leading-relaxed text-rose-200">
                        {selectedJob.failedReason}
                      </p>
                    </div>
                  )}

                  {selectedJob.returnvalue && (
                    <div className="bg-[#111113] border border-zinc-800/80 rounded p-4">
                      <div className="text-zinc-400 font-semibold mb-2">
                        Worker Output Return Value
                      </div>
                      <pre className="bg-[#050506] p-3 rounded text-zinc-300 overflow-x-auto">
                        {JSON.stringify(selectedJob.returnvalue, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-zinc-600 font-mono text-xs p-8 space-y-2">
            <Radio className="w-8 h-8 text-zinc-700 animate-pulse" />
            <p>Select a job from the stream on the left to inspect logs and telemetry.</p>
          </div>
        )}
      </section>
    </div>
  );
};
