import React, { useCallback, useEffect, useRef, useState } from 'react';
import { DispatchJobModal } from './components/DispatchJobModal';
import { LogsConsole } from './components/LogsConsole';
import { MetricCards } from './components/MetricCards';
import { PipelineConsole } from './components/PipelineConsole';
import { QueuesView } from './components/QueuesView';
import { Sidebar } from './components/Sidebar';
import type { ActiveNavTab } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { WaveformStream } from './components/WaveformStream';
import { WorkersView } from './components/WorkersView';
import { api } from './services/api';
import type {
  ClusterMetrics as ClusterMetricsType,
  JobDetail,
  JobItem,
  JobStatus,
} from './types';

export const App: React.FC = () => {
  const [activeNavTab, setActiveNavTab] = useState<ActiveNavTab>('dashboard');
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [selectedJob, setSelectedJob] = useState<JobDetail | null>(null);
  const [metrics, setMetrics] = useState<ClusterMetricsType | null>(null);
  const [statusFilter, setStatusFilter] = useState<JobStatus>('all');
  const [queueFilter, setQueueFilter] = useState<string>('all');
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [isPlayingStream, setIsPlayingStream] = useState(true);
  const selectedJobIdRef = useRef<string | null>(null);

  useEffect(() => {
    selectedJobIdRef.current = selectedJob?.jobId || null;
  }, [selectedJob]);

  // Load selected job details
  const loadJobDetail = useCallback(async (jobId: string) => {
    try {
      const detail = await api.getJobById(jobId);
      setSelectedJob(detail);
    } catch (err) {
      console.error(`Error loading detail for job ${jobId}:`, err);
    }
  }, []);

  // Fetch jobs and metrics
  const fetchData = useCallback(
    async (isBackground = false) => {
      if (!isBackground) setIsRefreshing(true);

      try {
        const [jobsResponse, metricsResponse] = await Promise.all([
          api.getJobs(statusFilter, queueFilter, 1, 50),
          api.getClusterMetrics(),
        ]);

        setJobs(jobsResponse.data);
        setMetrics(metricsResponse);

        const currentSelectedId = selectedJobIdRef.current;
        if (currentSelectedId) {
          loadJobDetail(currentSelectedId);
        } else if (jobsResponse.data.length > 0) {
          loadJobDetail(jobsResponse.data[0].jobId);
        }
      } catch (err) {
        console.error('Failed to fetch cluster data:', err);
      } finally {
        setIsLoading(false);
        if (!isBackground) setIsRefreshing(false);
      }
    },
    [statusFilter, queueFilter, loadJobDetail],
  );

  useEffect(() => {
    fetchData(false);
  }, [fetchData]);

  // Background polling
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      fetchData(true);
    }, 3000);
    return () => clearInterval(interval);
  }, [autoRefresh, fetchData]);

  const handleSelectJob = (id: string) => {
    loadJobDetail(id);
  };

  const handleJobDispatched = (jobId: string) => {
    fetchData(false);
    loadJobDetail(jobId);
  };

  const handleExportJsonDump = () => {
    const dump = {
      cluster: 'voxbase-task-pipeline',
      timestamp: new Date().toISOString(),
      metrics,
      jobs,
    };
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(dump, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `cluster-dump-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleExportPcapDump = () => {
    const simulatedPcap = `[PCAP CAPTURE - REDIS PROTOCOL RESP v3]
Host: redis:6379
Channel: bull:report-gen
Timestamp: ${new Date().toISOString()}
Packets Captured: 1420
CRC32: 0x8F9A1B4C
-- END TRACE --`;
    const dataStr =
      'data:text/plain;charset=utf-8,' + encodeURIComponent(simulatedPcap);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `redis-stream-${Date.now()}.pcap`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const waitingCount = metrics?.summary.waitingJobs || 142;
  const failedCount = metrics?.summary.failedJobs || 2;

  return (
    <div className="min-h-screen bg-[#0c0d12] text-zinc-100 flex flex-row font-sans selection:bg-emerald-500/30 selection:text-emerald-200 antialiased overflow-hidden">
      {/* 1. Fixed AppShell Sidebar (Left) */}
      <Sidebar
        activeTab={activeNavTab}
        onSelectTab={setActiveNavTab}
        waitingCount={waitingCount}
        activeWorkersCount={4}
        failedCount={failedCount}
        onOpenDispatch={() => setIsDispatchModalOpen(true)}
      />

      {/* 2. Main Content Viewport */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto bg-[#0c0d12]">
        {/* Top Bar with Breadcrumbs & Actions */}
        <TopBar
          selectedJob={selectedJob}
          currentQueue={queueFilter !== 'all' ? queueFilter : 'cluster-wide'}
          onOpenDispatch={() => setIsDispatchModalOpen(true)}
          onRefresh={() => fetchData(false)}
          isRefreshing={isRefreshing}
          autoRefresh={autoRefresh}
          onToggleAutoRefresh={() => setAutoRefresh((prev) => !prev)}
          onExportDump={handleExportJsonDump}
        />

        {/* Dynamic Content based on Active Sidebar Tab */}
        {activeNavTab === 'queues' && (
          <div className="space-y-4">
            <QueuesView
              metrics={metrics}
              onSelectQueue={(q) => {
                setQueueFilter(q);
                setActiveNavTab('dashboard');
              }}
            />
            <LogsConsole
              jobs={jobs}
              selectedJob={selectedJob}
              onSelectJob={handleSelectJob}
            />
          </div>
        )}

        {activeNavTab === 'workers' && (
          <div className="space-y-4">
            <MetricCards metrics={metrics} />
            <WorkersView />
            <LogsConsole
              jobs={jobs}
              selectedJob={selectedJob}
              onSelectJob={handleSelectJob}
            />
          </div>
        )}

        {(activeNavTab === 'dashboard' || activeNavTab === 'stream') && (
          <main className="flex-1 flex flex-col space-y-2">
            {/* 4 Metric Cards */}
            <MetricCards metrics={metrics} />

            {/* Central Event Stream Visualizer (Waveform) */}
            <WaveformStream
              isPlaying={isPlayingStream}
              onTogglePlay={() => setIsPlayingStream((prev) => !prev)}
              onExportPcap={handleExportPcapDump}
              onExportJson={handleExportJsonDump}
              activeQueueName={selectedJob?.queueName || 'report-gen'}
              inFlightCount={metrics?.summary.activeJobs || 18}
            />

            {/* Bottom Section: Master-Detail Console & Logs Inspector */}
            <PipelineConsole
              jobs={jobs}
              selectedJob={selectedJob}
              onSelectJob={handleSelectJob}
              statusFilter={statusFilter}
              onChangeStatusFilter={setStatusFilter}
              queueFilter={queueFilter}
              onChangeQueueFilter={setQueueFilter}
              isLoading={isLoading}
            />

            {/* Dense Log Table */}
            <LogsConsole
              jobs={jobs}
              selectedJob={selectedJob}
              onSelectJob={handleSelectJob}
            />
          </main>
        )}

        {(activeNavTab === 'errors' || activeNavTab === 'deadletter') && (
          <main className="flex-1 flex flex-col p-6 space-y-4">
            <MetricCards metrics={metrics} />
            <div className="bg-[#15181e] border border-rose-800/60 p-4 rounded-xl text-xs font-mono text-rose-300">
              <span className="font-bold block mb-1">
                Dead-Letter Queue & Execution Errors
              </span>
              Showing jobs with retry exhaustion or unhandled worker exceptions.
            </div>
            <PipelineConsole
              jobs={jobs.filter((j) => j.status === 'failed')}
              selectedJob={selectedJob}
              onSelectJob={handleSelectJob}
              statusFilter="failed"
              onChangeStatusFilter={setStatusFilter}
              queueFilter={queueFilter}
              onChangeQueueFilter={setQueueFilter}
              isLoading={isLoading}
            />
            <LogsConsole
              jobs={jobs.filter((j) => j.status === 'failed')}
              selectedJob={selectedJob}
              onSelectJob={handleSelectJob}
            />
          </main>
        )}
      </div>

      {/* 3. Dispatch Job Modal */}
      <DispatchJobModal
        isOpen={isDispatchModalOpen}
        onClose={() => setIsDispatchModalOpen(false)}
        onJobDispatched={handleJobDispatched}
      />
    </div>
  );
};

export default App;
