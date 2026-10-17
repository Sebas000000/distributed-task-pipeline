import React, { useState } from 'react';
import { AlertCircle, Loader2, Send, X } from 'lucide-react';
import { api } from '../services/api';
import type { DispatchJobDto, QueueName } from '../types';

interface DispatchJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJobDispatched: (jobId: string) => void;
}

interface PresetOption {
  label: string;
  queueName: QueueName;
  payloadType: string;
  priority: number;
  payload: Record<string, unknown>;
}

const PRESETS: PresetOption[] = [
  {
    label: 'Monthly Financial Report',
    queueName: 'report-gen',
    payloadType: 'report.monthly',
    priority: 5,
    payload: {
      reportMonth: '2026-10',
      currency: 'USD',
      recipients: ['cfo@company.com', 'treasury@company.com'],
      includeCharts: true,
      costCenter: 'ENTERPRISE-GLOBAL',
    },
  },
  {
    label: 'Daily Ledger Settlement',
    queueName: 'report-gen',
    payloadType: 'report.daily',
    priority: 10,
    payload: {
      date: '2026-10-17',
      settlementWindow: 'EOD-CLOSE',
      generateSummaryCsv: true,
    },
  },
  {
    label: 'Telemetry Stream Batch',
    queueName: 'data-ingest',
    payloadType: 'events.batch',
    priority: 10,
    payload: {
      batchId: 'batch-stream-94012',
      eventCount: 3500,
      sourceRegion: 'us-east-1',
      schemaVersion: '2.4.0',
    },
  },
  {
    label: 'Mass CSV Records Import',
    queueName: 'data-ingest',
    payloadType: 'csv.import',
    priority: 15,
    payload: {
      sourceBucket: 's3://inbound-assets/customer_export_2026.csv',
      estimatedRows: 25000,
      targetEntity: 'accounts_ledger',
    },
  },
  {
    label: 'Order Settled Webhook',
    queueName: 'webhooks',
    payloadType: 'webhook.deliver',
    priority: 5,
    payload: {
      targetUrl: 'https://api.subscriber.com/webhooks/incoming',
      eventType: 'order.payment_completed',
      orderId: 'ORD-984214',
      amountUsd: 2450.0,
      customerTier: 'PLATINUM',
    },
  },
  {
    label: 'Simulate Webhook Retry / Failure',
    queueName: 'webhooks',
    payloadType: 'webhook.deliver',
    priority: 10,
    payload: {
      targetUrl: 'https://api.subscriber.com/webhooks/flaky-receiver',
      eventType: 'payment.dispute_opened',
      shouldFail: true,
      maxRetriesConfigured: 3,
    },
  },
];

export const DispatchJobModal: React.FC<DispatchJobModalProps> = ({
  isOpen,
  onClose,
  onJobDispatched,
}) => {
  const [queueName, setQueueName] = useState<QueueName>('report-gen');
  const [payloadType, setPayloadType] = useState('report.monthly');
  const [priority, setPriority] = useState<number>(10);
  const [payloadText, setPayloadText] = useState(
    JSON.stringify(PRESETS[0].payload, null, 2),
  );
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleQueueChange = (newQueue: QueueName) => {
    setQueueName(newQueue);
    if (newQueue === 'report-gen') {
      setPayloadType('report.monthly');
    } else if (newQueue === 'data-ingest') {
      setPayloadType('events.batch');
    } else if (newQueue === 'webhooks') {
      setPayloadType('webhook.deliver');
    }
  };

  const handleSelectPreset = (preset: PresetOption) => {
    setQueueName(preset.queueName);
    setPayloadType(preset.payloadType);
    setPriority(preset.priority);
    setPayloadText(JSON.stringify(preset.payload, null, 2));
    setJsonError(null);
    setServerError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setJsonError(null);
    setServerError(null);

    let parsedPayload: Record<string, unknown>;
    try {
      parsedPayload = JSON.parse(payloadText);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid JSON syntax';
      setJsonError(`JSON Syntax Error: ${msg}`);
      return;
    }

    const dto: DispatchJobDto = {
      queueName,
      payloadType,
      payload: parsedPayload,
      priority,
    };

    setIsSubmitting(true);
    try {
      const res = await api.dispatchJob(dto);
      onJobDispatched(res.jobId);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setServerError(`Failed to dispatch job: ${msg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 select-none">
      <div className="bg-[#111113] border border-zinc-800 rounded-lg shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-zinc-800 flex items-center justify-between bg-[#151518]">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
            <h3 className="text-sm font-semibold text-zinc-100 font-sans tracking-tight">
              Dispatch Task to Redis Broker
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-200 p-1 rounded hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4 font-mono text-xs">
          {/* Quick Preset Buttons */}
          <div>
            <label className="text-[11px] text-zinc-400 font-sans block mb-1.5 uppercase font-medium tracking-wider">
              Quick Templates
            </label>
            <div className="flex flex-wrap gap-1.5">
              {PRESETS.map((preset, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => handleSelectPreset(preset)}
                  className="px-2 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-300 rounded text-[11px] transition-colors"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Queue & Payload Type Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-zinc-400 font-sans block mb-1 uppercase font-medium tracking-wider">
                Target Queue
              </label>
              <select
                value={queueName}
                onChange={(e) => handleQueueChange(e.target.value as QueueName)}
                className="w-full bg-[#09090b] border border-zinc-800 text-zinc-200 rounded px-3 py-2 outline-hidden focus:border-indigo-500"
              >
                <option value="report-gen">report-gen</option>
                <option value="data-ingest">data-ingest</option>
                <option value="webhooks">webhooks</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] text-zinc-400 font-sans block mb-1 uppercase font-medium tracking-wider">
                Event Subtype (Handler)
              </label>
              <input
                type="text"
                value={payloadType}
                onChange={(e) => setPayloadType(e.target.value)}
                placeholder="e.g. report.monthly, events.batch"
                className="w-full bg-[#09090b] border border-zinc-800 text-zinc-200 rounded px-3 py-2 outline-hidden focus:border-indigo-500"
                required
              />
            </div>
          </div>

          {/* Priority Selection */}
          <div>
            <label className="text-[11px] text-zinc-400 font-sans block mb-1 uppercase font-medium tracking-wider">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(Number(e.target.value))}
              className="w-full bg-[#09090b] border border-zinc-800 text-zinc-200 rounded px-3 py-2 outline-hidden focus:border-indigo-500"
            >
              <option value={1}>High Priority (1)</option>
              <option value={10}>Normal Priority (10)</option>
              <option value={50}>Low Priority (50)</option>
            </select>
          </div>

          {/* JSON Payload Editor */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] text-zinc-400 font-sans uppercase font-medium tracking-wider">
                JSON Input Payload
              </label>
              <span className="text-[10px] text-zinc-500">Valid JSON required</span>
            </div>
            <textarea
              rows={8}
              value={payloadText}
              onChange={(e) => {
                setPayloadText(e.target.value);
                setJsonError(null);
              }}
              className="w-full bg-[#050506] border border-zinc-800 rounded p-3 text-zinc-200 font-mono text-xs leading-relaxed outline-hidden focus:border-indigo-500 resize-none"
            ></textarea>

            {jsonError && (
              <div className="mt-1.5 flex items-center space-x-1 text-rose-400 text-[11px]">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{jsonError}</span>
              </div>
            )}
          </div>

          {serverError && (
            <div className="bg-rose-950/30 border border-rose-800/60 p-2.5 rounded text-rose-300 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{serverError}</span>
            </div>
          )}

          {/* Modal Footer */}
          <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 rounded text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center space-x-1.5 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-semibold transition-all active:scale-[0.98] disabled:opacity-50 shadow-sm shadow-indigo-950"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Enqueuing...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Enqueue Job</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
