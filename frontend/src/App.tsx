import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ClusterHeader } from './components/ClusterHeader';
import { ClusterMetrics } from './components/ClusterMetrics';
import { DispatchJobModal } from './components/DispatchJobModal';
import { PipelineConsole } from './components/PipelineConsole';
import { api } from './services/api';
import type {
  ClusterMetrics as ClusterMetricsType,
  JobDetail,
  JobItem,
  JobStatus,
} from './types';

export const App: React.FC = () => {
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [selectedJob, setSelectedJob] = useState<JobDetail | null>(null);
  const [metrics, setMetrics] = useState<ClusterMetricsType | null>(null);
  const [statusFilter, setStatusFilter] = useState<JobStatus>('all');
  const [queueFilter, setQueueFilter] = useState<string>('all');
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const selectedJobIdRef = useRef<string | null>(null);

  // Sync ref
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

        // Keep current selected job in sync, or auto-select the first job if none selected
        const currentSelectedId = selectedJobIdRef.current;
        if (currentSelectedId) {
          // Refresh details of the currently inspected job
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

  // Initial load and filter changes
  useEffect(() => {
    fetchData(false);
  }, [fetchData]);

  // Background polling timer
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

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* 1. Top Header */}
      <ClusterHeader
        onOpenDispatchModal={() => setIsDispatchModalOpen(true)}
        onRefresh={() => fetchData(false)}
        isRefreshing={isRefreshing}
        autoRefresh={autoRefresh}
        onToggleAutoRefresh={() => setAutoRefresh((prev) => !prev)}
      />

      {/* 2. Mini KPI Strip */}
      <ClusterMetrics metrics={metrics} />

      {/* 3. Master-Detail Console View */}
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

      {/* 4. Dispatch Job Modal */}
      <DispatchJobModal
        isOpen={isDispatchModalOpen}
        onClose={() => setIsDispatchModalOpen(false)}
        onJobDispatched={handleJobDispatched}
      />
    </div>
  );
};

export default App;
