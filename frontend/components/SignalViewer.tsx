"use client";

import React, { useRef, useEffect, useState } from "react";
import { Activity, Layers, Info, HelpCircle, ChevronDown, ChevronUp } from "lucide-react";
import { RawWaveformData } from "../lib/types";

interface SignalViewerProps {
  waveformData: RawWaveformData | null;
  sstImageUrl: string;
  currentTime: number;
  duration: number;
  riskStage: string;
  domain?: string;
}

const LEAD_DESCRIPTIONS: Record<string, string> = {
  "Fp1": "Left Prefrontal Cortex — Frontal emotional valence, affective arousal, and acute stress/anxiety reactivity.",
  "Fp2": "Right Prefrontal Cortex — Right-frontal withdrawal motivation and hyperarousal vigilance.",
  "F3": "Left Frontal Cortex — Core site for mental arithmetic, cognitive workload, and alpha desynchronization (alpha blocking).",
  "F4": "Right Frontal Cortex — High-frequency beta power and affective stress asymmetry.",
  "Fz": "Frontal Midline — Midline theta (Fmθ, 4–8 Hz) tracking sustained mental focus and cognitive conflict.",
  "Cz": "Central Vertex — Somatosensory and sensorimotor rhythm (SMR) gating.",
  "Pz": "Parietal Midline — Parietal attention resource allocation and posterior alpha rhythm.",
  "O1": "Left Occipital — Occipital alpha rhythm (8–12 Hz); dominant during relaxed eyes-closed baseline.",
  "FT9-FT10": "Frontotemporal Bipolar — Standard clinical montage for temporal epileptiform focal discharges (CHB-MIT).",
  "C3-P3": "Central-Parietal Bipolar — Sensorimotor cortical integration and sleep spindles.",
  "F3-C3": "Frontal-Central Bipolar — Pre-motor and motor cortex synchronization.",
  "T7-P7": "Temporal-Parietal Bipolar — Lateralized temporal sharp transients.",
  "EEG Fpz-Cz": "Frontal-Central PSG — Optimized for delta slow-wave sleep (0.5–2 Hz, Stage N3).",
  "EEG Pz-Oz": "Parietal-Occipital PSG — Captures sleep spindles (12–14 Hz) and K-complexes (Stage N2)."
};

export default function SignalViewer({
  waveformData,
  sstImageUrl,
  currentTime,
  duration,
  riskStage,
  domain,
}: SignalViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedLead, setSelectedLead] = useState<string>("FT9-FT10");
  const [showSignalGuide, setShowSignalGuide] = useState(false);

  const availableChannels = waveformData?.channels
    ? Object.keys(waveformData.channels)
    : ["FT9-FT10"];

  useEffect(() => {
    if (waveformData?.channels && !waveformData.channels[selectedLead] && availableChannels.length > 0) {
      setSelectedLead(availableChannels[0]);
    }
  }, [waveformData, selectedLead, availableChannels]);

  const isEarlyWarning = domain === "early_warning" || domain === "stress_anxiety";
  const isSleep = domain === "sleep";

  // Determine oscilloscope title
  let oscilloscopeTitle = "Scalp EEG Oscilloscope (10-20 International System)";
  if (isEarlyWarning) {
    oscilloscopeTitle = "Cortical EEG Oscilloscope (Stress & Anxiety Time-Series)";
  } else if (isSleep) {
    oscilloscopeTitle = "Polysomnography EEG/PSG Oscilloscope (Sleep Staging)";
  }

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

    // Trace color scheme
    let traceColor = "#38bdf8"; // Medical sky
    const rLower = riskStage.toLowerCase();
    if (isEarlyWarning) {
      if (rLower.includes("stress")) {
        traceColor = "#f59e0b"; // Amber for acute stress
      } else if (rLower.includes("anxiety")) {
        traceColor = "#f43f5e"; // Rose for anxiety paroxysm
      } else if (rLower.includes("apnea")) {
        traceColor = "#38bdf8"; // Sky for pre-apnea
      } else {
        traceColor = "#10b981"; // Emerald for baseline relaxation
      }
    } else if (isSleep) {
      if (rLower.includes("n3")) traceColor = "#818cf8"; // Indigo
      else if (rLower.includes("rem")) traceColor = "#22d3ee"; // Cyan
      else if (rLower.includes("wake")) traceColor = "#f43f5e"; // Rose
      else traceColor = "#38bdf8"; // Sky for N1/N2
    } else {
      if (rLower.includes("ictal") && !rLower.includes("pre") && !rLower.includes("inter")) {
        traceColor = "#f43f5e"; // Rose
      } else if (rLower.includes("pre")) {
        traceColor = "#f59e0b"; // Amber
      } else {
        traceColor = "#10b981"; // Emerald
      }
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
  }, [waveformData, selectedLead, currentTime, duration, riskStage, isEarlyWarning, isSleep]);

  const cleanSstUrl = sstImageUrl.startsWith("http") || sstImageUrl.startsWith("/")
    ? sstImageUrl
    : `/static/processed/${sstImageUrl}`;

  const leadExplanation = LEAD_DESCRIPTIONS[selectedLead] || `Electrode lead: ${selectedLead}`;

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* 1. Time-Series EEG Waveform View */}
        <div className="lg:col-span-8 clinical-panel rounded-xl p-4 flex flex-col justify-between">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800 mb-2">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-sky-400" />
              <h3 className="font-semibold text-sm text-slate-100 tracking-wide">
                {oscilloscopeTitle}
              </h3>
            </div>

            {/* Montage Channel Selector Tabs */}
            <div className="flex items-center flex-wrap gap-1 bg-slate-900/90 rounded-lg p-1 border border-slate-800 text-xs">
              <span className="text-[10px] font-mono text-slate-400 px-2 uppercase">Lead:</span>
              {availableChannels.map((lead) => (
                <button
                  key={lead}
                  onClick={() => setSelectedLead(lead)}
                  className={`px-2 py-0.5 rounded font-mono text-xs transition-colors ${
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

          {/* Functional Lead Description Pill */}
          <div className="mb-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800/80 text-[11px] text-slate-300 flex items-center gap-2">
            <span className="font-bold text-sky-300 shrink-0 font-mono">{selectedLead}:</span>
            <span className="truncate">{leadExplanation}</span>
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
              Window: {duration.toFixed(1)} s &bull; {waveformData?.sampling_rate_hz || 128} Hz
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
              {cleanSstUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={cleanSstUrl}
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

      {/* 3. Simple & Detailed Signal & Spectrogram Guide for Judges / Evaluators */}
      <div className="bg-slate-900/60 rounded-xl border border-slate-800/80 overflow-hidden">
        <button
          onClick={() => setShowSignalGuide(!showSignalGuide)}
          className="w-full px-4 py-2.5 flex items-center justify-between text-xs font-semibold text-slate-300 hover:bg-slate-800/60 transition-colors"
        >
          <div className="flex items-center gap-2 text-sky-400">
            <HelpCircle className="w-4 h-4" />
            <span>How to Read This EEG Signal & Spectrogram (Guide for Evaluators)</span>
          </div>
          {showSignalGuide ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showSignalGuide && (
          <div className="p-4 border-t border-slate-800 text-xs text-slate-300 space-y-3 bg-slate-950/60 leading-relaxed">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5 p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="font-bold text-white block">1. Scalp EEG Oscilloscope (Time-Series)</span>
                <p className="text-slate-400">
                  Shows voltage changes in <strong>microvolts (µV)</strong> over 10 seconds.
                  When relaxed, healthy brains display rhythmic, smooth 8–12 Hz waves (Alpha waves).
                  Under acute stress or mental calculation load, waves become irregular and rapid (Beta ripples) due to desynchronized cortical firing.
                </p>
              </div>

              <div className="space-y-1.5 p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="font-bold text-white block">2. 128×128 SST Spectrogram (Time-Frequency Heatmap)</span>
                <p className="text-slate-400">
                  The <strong>Synchrosqueezing Transform (SST)</strong> maps time on the X-axis (0–10s) and frequency on the Y-axis (0.5–60 Hz).
                  Bright spots represent intense neural energy. High brightness in upper bands (20–30 Hz) flags active mental strain, anxiety, or cognitive engagement.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-sky-950/20 border border-sky-500/20 text-[11px] text-sky-200">
              <strong className="text-sky-300">Key Takeaway for Judges:</strong> The raw signal shows amplitude over time; the SST spectrogram extracts the exact neural frequencies. Both views provide complementary, verified biomarkers before deep learning classification.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
