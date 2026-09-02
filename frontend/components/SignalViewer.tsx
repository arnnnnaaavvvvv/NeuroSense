"use client";

import React, { useRef, useEffect, useState } from "react";
import { Activity, Layers } from "lucide-react";
import { RawWaveformData } from "../lib/types";

interface SignalViewerProps {
  waveformData: RawWaveformData | null;
  sstImageUrl: string;
  currentTime: number;
  duration: number;
  riskStage: string;
}

export default function SignalViewer({
  waveformData,
  sstImageUrl,
  currentTime,
  duration,
  riskStage,
}: SignalViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedLead, setSelectedLead] = useState<string>("FT9-FT10");

  const availableChannels = waveformData?.channels
    ? Object.keys(waveformData.channels)
    : ["FT9-FT10"];

  // Render dynamic Oscilloscope Waveform on Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !waveformData) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Get samples for currently selected lead
    const samples =
      waveformData.channels && waveformData.channels[selectedLead]
        ? waveformData.channels[selectedLead].samples
        : waveformData.samples || [];

    const totalSamples = samples.length;
    if (totalSamples === 0) return;

    // Clear background
    ctx.clearRect(0, 0, width, height);

    // Draw baseline grid center line
    ctx.strokeStyle = "rgba(148, 163, 184, 0.12)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();

    // Restrained clinical color scheme
    let traceColor = "#38bdf8"; // Medical sky
    if (riskStage.toLowerCase().includes("ictal") && !riskStage.toLowerCase().includes("pre")) {
      traceColor = "#f87171"; // Restrained Crimson/Rose
    } else if (riskStage.toLowerCase().includes("pre")) {
      traceColor = "#fbbf24"; // Restrained Amber
    } else {
      traceColor = "#34d399"; // Restrained Emerald
    }

    const maxVal = Math.max(...samples.map((v) => Math.abs(v)), 30.0);
    const scaleY = (height / 2.6) / maxVal;
    const stepX = width / (totalSamples - 1);

    const currentProgress = duration > 0 ? currentTime / duration : 0;
    const currentSampleIdx = Math.floor(currentProgress * totalSamples);

    // 1. Dim Background Trace
    ctx.strokeStyle = "rgba(71, 85, 105, 0.35)";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    for (let i = 0; i < totalSamples; i++) {
      const x = i * stepX;
      const y = height / 2 - samples[i] * scaleY;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // 2. Active Played Trace
    if (currentSampleIdx > 0) {
      ctx.strokeStyle = traceColor;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      for (let i = 0; i <= currentSampleIdx; i++) {
        const x = i * stepX;
        const y = height / 2 - samples[i] * scaleY;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    // 3. Scanning Playhead Cursor
    const playheadX = currentProgress * width;
    ctx.strokeStyle = "rgba(226, 232, 240, 0.85)";
    ctx.lineWidth = 1.2;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(playheadX, 0);
    ctx.lineTo(playheadX, height);
    ctx.stroke();
    ctx.setLineDash([]);

    if (currentSampleIdx < totalSamples) {
      const currentY = height / 2 - samples[currentSampleIdx] * scaleY;
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(playheadX, currentY, 3.5, 0, 2 * Math.PI);
      ctx.fill();
    }
  }, [waveformData, selectedLead, currentTime, duration, riskStage]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      {/* 1. Time-Series EEG Waveform View */}
      <div className="lg:col-span-8 clinical-panel rounded-xl p-4 flex flex-col justify-between">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800 mb-2">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-sky-400" />
            <h3 className="font-semibold text-sm text-slate-100 tracking-wide">
              Scalp EEG Oscilloscope
            </h3>
          </div>

          {/* Montage Channel Selector Tabs */}
          <div className="flex items-center bg-slate-900/90 rounded-lg p-1 border border-slate-800 text-xs">
            <span className="text-[10px] font-mono text-slate-400 px-2 uppercase">Montage:</span>
            {availableChannels.map((lead) => (
              <button
                key={lead}
                onClick={() => setSelectedLead(lead)}
                className={`px-2.5 py-0.5 rounded font-mono text-xs transition-colors ${
                  selectedLead === lead
                    ? "bg-sky-500/20 text-sky-300 font-bold border border-sky-500/40"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {lead}
              </button>
            ))}
          </div>
        </div>

        {/* Oscilloscope Canvas Viewport */}
        <div className="relative w-full h-56 bg-[#080d1a] rounded-lg border border-slate-800 overflow-hidden bg-eeg-grid-fine">
          <canvas
            ref={canvasRef}
            width={720}
            height={224}
            className="w-full h-full block"
          />

          <div className="absolute top-2 left-3 text-[10px] font-mono text-slate-400 pointer-events-none">
            Lead: <strong className="text-slate-200">{selectedLead}</strong> &bull; +100 µV
          </div>
          <div className="absolute bottom-2 left-3 text-[10px] font-mono text-slate-400 pointer-events-none">
            -100 µV
          </div>
          <div className="absolute bottom-2 right-3 text-[10px] font-mono text-slate-400 pointer-events-none">
            Window: 10.0 s &bull; 256 Hz
          </div>
        </div>
      </div>

      {/* 2. Synchrosqueezing Transform (SST) Time-Frequency View */}
      <div className="lg:col-span-4 clinical-panel rounded-xl p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-2">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            <h3 className="font-semibold text-sm text-slate-100 tracking-wide">
              128×128 SST Spectrogram
            </h3>
          </div>
          <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
            Özdemir et al. (2020)
          </span>
        </div>

        <div className="relative flex flex-col items-center justify-center bg-[#080d1a] rounded-lg p-3 border border-slate-800">
          <div className="relative w-44 h-44 rounded border border-slate-700 overflow-hidden bg-black">
            {sstImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={sstImageUrl.startsWith("http") ? sstImageUrl : `http://127.0.0.1:8000${sstImageUrl}`}
                alt="Synchrosqueezing Transform 128x128 representation"
                className="w-full h-full object-cover filter contrast-125"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-slate-500">
                Loading SST Image...
              </div>
            )}
            
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-white/80 pointer-events-none"
              style={{ left: `${(currentTime / duration) * 100}%` }}
            ></div>
          </div>

          <div className="w-full flex justify-between text-[10px] font-mono text-slate-400 mt-2 px-3">
            <span>0.5 Hz (Delta)</span>
            <span>Freq Axis</span>
            <span>60 Hz (Gamma)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
