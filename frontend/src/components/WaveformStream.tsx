import React, { useEffect, useState } from 'react';
import {
  Download,
  FileCode,
  Pause,
  Play,
  Radio,
} from 'lucide-react';

interface WaveformStreamProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onExportPcap: () => void;
  onExportJson: () => void;
  activeQueueName?: string;
  inFlightCount?: number;
}

export const WaveformStream: React.FC<WaveformStreamProps> = ({
  isPlaying,
  onTogglePlay,
  onExportPcap,
  onExportJson,
  activeQueueName = 'report-gen',
  inFlightCount = 18,
}) => {
  // Generate random heights for waveform frequency bars
  const [bars, setBars] = useState<number[]>(() =>
    Array.from({ length: 54 }, () => Math.floor(Math.random() * 65) + 15),
  );
  const [speedMultiplier, setSpeedMultiplier] = useState<'1x' | '2x'>('1x');
  const [streamPosition, setStreamPosition] = useState<number>(42);

  // Animate waveform bars dynamically while playing
  useEffect(() => {
    if (!isPlaying) return;

    const intervalTime = speedMultiplier === '2x' ? 120 : 250;
    const interval = setInterval(() => {
      setBars((prev) => {
        const newHeight = Math.floor(Math.random() * 75) + 12;
        return [...prev.slice(1), newHeight];
      });
      setStreamPosition((pos) => (pos >= 100 ? 0 : pos + 1));
    }, intervalTime);

    return () => clearInterval(interval);
  }, [isPlaying, speedMultiplier]);

  return (
    <div className="px-6 mb-6">
      <div className="bg-[#15181e] border border-zinc-800/80 rounded-xl p-5 shadow-sm relative overflow-hidden">
        {/* 1. Header & Telemetry Status */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-zinc-800/70 gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Radio className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-semibold text-zinc-100 font-sans tracking-tight">
                  Redis Ingestion Waveform & Event Flow
                </h3>
                <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                  ● LIVE BROKER
                </span>
              </div>
              <p className="text-xs text-zinc-500 font-mono mt-0.5">
                Channel: <span className="text-zinc-300 font-semibold">{activeQueueName}</span> | Buffer: {inFlightCount} active job events
              </p>
            </div>
          </div>

          {/* Player Controls & Action Triggers */}
          <div className="flex items-center space-x-2">
            {/* Speed selector */}
            <button
              onClick={() =>
                setSpeedMultiplier((curr) => (curr === '1x' ? '2x' : '1x'))
              }
              className="px-2 py-1 text-xs font-mono rounded bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
              title="Stream playback rate"
            >
              {speedMultiplier}
            </button>

            {/* Play / Pause Toggle */}
            <button
              onClick={onTogglePlay}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                isPlaying
                  ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700'
                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30'
              }`}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span>Pause Stream</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>Resume</span>
                </>
              )}
            </button>

            {/* Download Dumps */}
            <button
              onClick={onExportPcap}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 rounded-lg text-xs font-mono transition-colors"
              title="Download network packet capture trace"
            >
              <FileCode className="w-3.5 h-3.5 text-zinc-400" />
              <span>.pcap</span>
            </button>

            <button
              onClick={onExportJson}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 rounded-lg text-xs font-mono transition-colors"
              title="Download structured event telemetry JSON"
            >
              <Download className="w-3.5 h-3.5 text-zinc-400" />
              <span>.json</span>
            </button>
          </div>
        </div>

        {/* 2. Interactive Waveform Frequency Bars Canvas */}
        <div className="pt-5 pb-2">
          <div className="h-28 w-full bg-[#0c0d12] border border-zinc-800/80 rounded-lg p-3 relative flex items-end justify-between gap-1 overflow-hidden">
            {/* Subtle Horizontal Gridlines */}
            <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-2 opacity-15">
              <div className="border-b border-zinc-700 border-dashed w-full"></div>
              <div className="border-b border-zinc-700 border-dashed w-full"></div>
              <div className="border-b border-zinc-700 border-dashed w-full"></div>
            </div>

            {/* Scanning Playhead Bar */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-emerald-400/80 shadow-[0_0_8px_rgba(52,211,153,0.8)] z-10 transition-all duration-300 pointer-events-none"
              style={{ left: `${streamPosition}%` }}
            ></div>

            {/* Frequency Bars */}
            {bars.map((height, i) => {
              const isActiveBar = Math.abs(i - (streamPosition / 100) * 54) < 3;
              return (
                <div
                  key={i}
                  className={`w-full rounded-xs transition-all duration-200 ${
                    isActiveBar
                      ? 'bg-emerald-300 shadow-[0_0_6px_rgba(110,231,183,0.6)]'
                      : i % 2 === 0
                        ? 'bg-emerald-500/80 hover:bg-emerald-400'
                        : 'bg-teal-500/60 hover:bg-teal-400'
                  }`}
                  style={{ height: `${height}%` }}
                  title={`Packet chunk #${i + 1}: ${height * 12} bytes/sec`}
                ></div>
              );
            })}
          </div>

          {/* Waveform Footer Timeline */}
          <div className="mt-2 flex items-center justify-between text-[11px] font-mono text-zinc-500">
            <span>-12.0s</span>
            <span>-8.0s</span>
            <span>-4.0s</span>
            <span className="text-emerald-400 font-semibold">0.0s (Live)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
