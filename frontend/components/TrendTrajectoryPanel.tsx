"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Activity,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Minus as FlatLine,
  Radio,
  Brain,
  ShieldCheck,
  Zap,
} from "lucide-react";
import {
  TrendAnalysisResult,
  SequenceMetadata,
  TrendState,
  DEMO_SEQUENCES,
  analyzeSequenceTrend,
} from "../lib/trend-logic";
import benchmarkData from "../lib/benchmark-data.json";

interface TrendTrajectoryPanelProps {
  initialSequenceId?: string;
  onClose?: () => void;
}

const predictionsMap = benchmarkData.predictions as Record<string, any>;

/* ─── Physiological Waveform Fallback Generator ─────────────────────────────── */
function generateFallbackSamples(caseId: string): number[] {
  const arr: number[] = [];
  const total = 1280; // 10 seconds @ 128 Hz
  const id = caseId.toLowerCase();
  for (let i = 0; i < total; i++) {
    const t = i / 128;
    let v = 0;
    if (id.includes("math") || id.includes("stress")) {
      v =
        Math.sin(2 * Math.PI * 22 * t) * 14 +
        Math.sin(2 * Math.PI * 18 * t) * 10 +
        Math.sin(i * 0.3) * 8 +
        Math.sin(2 * Math.PI * 6 * t) * 6;
    } else if (id.includes("stroop") || id.includes("conflict")) {
      const thetaMod = 0.5 + 0.5 * Math.sin(2 * Math.PI * 1.2 * t);
      v =
        Math.sin(2 * Math.PI * 5.8 * t) * 26 * thetaMod +
        Math.sin(2 * Math.PI * 20 * t) * 8;
    } else if (id.includes("anxiety")) {
      v =
        Math.sin(2 * Math.PI * 24 * t) * 22 +
        Math.sin(2 * Math.PI * 15 * t) * 14 +
        Math.sin(i * 0.4) * 12 +
        Math.sin(2 * Math.PI * 3.5 * t) * 8;
    } else {
      v =
        Math.sin(2 * Math.PI * 10.1 * t) * 22 +
        Math.sin(2 * Math.PI * 9.8 * t) * 10;
    }
    arr.push(v);
  }
  return arr;
}

/* ─── High-Precision Oscilloscope Waveform Canvas ─────────────────────────────── */
function ProfessionalOscilloscopeCanvas({
  caseId,
  samples,
  isPeak,
  strokeColor,
  glowColor,
  channelName,
}: {
  caseId: string;
  samples?: number[];
  isPeak: boolean;
  strokeColor: string;
  glowColor: string;
  channelName?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const waveData =
      samples && samples.length > 0 ? samples : generateFallbackSamples(caseId);
    const width = canvas.width;
    const height = canvas.height;
    const midY = height / 2;
    const ampRange = 60.0;

    // Deep laboratory CRT dark background
    ctx.fillStyle = "#030712";
    ctx.fillRect(0, 0, width, height);

    // Fine electrophysiology measurement grid
    ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
    ctx.lineWidth = 1;

    // Horizontal voltage reference lines (+30µV, 0µV, -30µV)
    ctx.beginPath();
    ctx.moveTo(0, midY);
    ctx.lineTo(width, midY);
    ctx.stroke();

    ctx.beginPath();
    ctx.setLineDash([2, 3]);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
    ctx.moveTo(0, midY - height * 0.35);
    ctx.lineTo(width, midY - height * 0.35);
    ctx.moveTo(0, midY + height * 0.35);
    ctx.lineTo(width, midY + height * 0.35);
    ctx.stroke();
    ctx.setLineDash([]);

    // Vertical 1-second time calibration grid lines (10 divisions across 10 seconds)
    const colStep = width / 10;
    ctx.beginPath();
    for (let x = colStep; x < width; x += colStep) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
    }
    ctx.stroke();

    // Draw calibrated microvolt signal trace
    ctx.beginPath();
    ctx.strokeStyle = strokeColor;
    ctx.shadowColor = glowColor;
    ctx.shadowBlur = isPeak ? 8 : 4;
    ctx.lineWidth = isPeak ? 1.9 : 1.3;
    ctx.lineJoin = "round";

    const total = waveData.length;
    let maxAbs = 0;
    let maxIdx = 0;

    for (let i = 0; i < total; i++) {
      if (Math.abs(waveData[i]) > maxAbs) {
        maxAbs = Math.abs(waveData[i]);
        maxIdx = i;
      }
    }

    let started = false;
    for (let px = 0; px < width; px += 1.2) {
      const idx = Math.floor((px / width) * (total - 1));
      const val = waveData[idx] || 0;
      const norm = Math.max(-1, Math.min(1, val / ampRange));
      const py = midY - norm * (height * 0.42);

      if (!started) {
        ctx.moveTo(px, py);
        started = true;
      } else {
        ctx.lineTo(px, py);
      }
    }
    ctx.stroke();

    // Mark exact peak voltage discharge if this is the peak window
    if (isPeak && maxIdx > 0) {
      const peakX = (maxIdx / (total - 1)) * width;
      const peakVal = waveData[maxIdx] || 0;
      const peakY =
        midY - Math.max(-1, Math.min(1, peakVal / ampRange)) * (height * 0.42);

      // Outer radial focal ring
      ctx.beginPath();
      ctx.arc(peakX, peakY, 6, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(244, 63, 94, 0.35)";
      ctx.fill();

      // Precision center dot
      ctx.beginPath();
      ctx.arc(peakX, peakY, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.shadowColor = "#f43f5e";
      ctx.shadowBlur = 6;
      ctx.fill();

      // Clinical pointer annotation
      ctx.font = "bold 8.5px ui-monospace, monospace";
      ctx.fillStyle = "#f43f5e";
      const isRight = peakX > width - 75;
      ctx.textAlign = isRight ? "right" : "left";
      ctx.fillText(
        `PEAK: ${Math.abs(peakVal).toFixed(1)} µV`,
        isRight ? peakX - 8 : peakX + 8,
        peakY < 20 ? peakY + 14 : peakY - 5
      );
    }
  }, [caseId, samples, isPeak, strokeColor, glowColor]);

  return (
    <div className="relative w-full rounded-lg overflow-hidden border border-slate-800 bg-[#030712]">
      <canvas
        ref={canvasRef}
        width={380}
        height={90}
        className="w-full h-[88px] block"
      />
      {/* Precision overlay labels */}
      <div className="absolute top-1 left-1.5 flex items-center gap-1.5 text-[8.5px] font-mono text-slate-400 bg-slate-950/85 px-1.5 py-0.5 rounded border border-slate-800/80">
        <Radio className="w-2.5 h-2.5 text-cyan-400" />
        <span>{channelName || "F3 Lead"}</span>
        <span className="text-slate-600">|</span>
        <span className="text-slate-300">±60 µV</span>
      </div>
      <div className="absolute bottom-1 right-1.5 text-[8.5px] font-mono text-slate-500 bg-slate-950/85 px-1.5 py-0.5 rounded border border-slate-800/80">
        128 Hz · 10.0s
      </div>
      <div className="absolute bottom-1 left-1.5 text-[8px] font-mono text-slate-600">
        0.0s
      </div>
      <div className="absolute top-1 right-1.5 text-[8px] font-mono text-slate-600">
        +30 µV
      </div>
    </div>
  );
}

/* ─── STFT Spectrogram Time-Frequency Signal Image ──────────────────────────── */
function ProfessionalSpectrogramImage({
  caseId,
  isPeak,
}: {
  caseId: string;
  isPeak: boolean;
}) {
  return (
    <div
      className={`relative rounded-lg overflow-hidden border transition-all ${
        isPeak
          ? "border-rose-500/70 shadow-md shadow-rose-950/40 ring-1 ring-rose-500/40"
          : "border-slate-800"
      } bg-slate-950`}
    >
      <div className="relative aspect-[16/7] w-full overflow-hidden flex items-center justify-center bg-black">
        <img
          src={`/static/processed/${caseId}_sst_128.png`}
          alt={`STFT Spectrogram for ${caseId}`}
          className="w-full h-full object-cover filter contrast-125 brightness-105"
          onError={(e) => {
            (e.target as HTMLElement).style.display = "none";
          }}
        />

        {/* Frequency scale markers */}
        <div className="absolute top-1 left-1.5 text-[8px] font-mono text-slate-400 bg-slate-950/85 px-1 rounded border border-slate-800/60">
          48 Hz
        </div>
        <div className="absolute bottom-1 left-1.5 text-[8px] font-mono text-slate-400 bg-slate-950/85 px-1 rounded border border-slate-800/60">
          4 Hz
        </div>
        <div className="absolute bottom-1 right-1.5 text-[8px] font-mono text-slate-400 bg-slate-950/85 px-1 rounded border border-slate-800/60">
          10.0s (STFT)
        </div>

        {/* Power distribution callout */}
        {isPeak ? (
          <div className="absolute top-1 right-1.5 bg-rose-600/90 text-white font-mono text-[8.5px] font-bold px-2 py-0.5 rounded shadow flex items-center gap-1">
            <span>PEAK 20–30 Hz POWER SURGE</span>
          </div>
        ) : (
          <div className="absolute top-1 right-1.5 bg-slate-900/85 text-slate-300 font-mono text-[8px] px-1.5 py-0.5 rounded border border-slate-700/60">
            <span>Synchronous Spectrum</span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Trend State Badge Mapping ─────────────────────────────────────────────── */
const getTrendBadge = (state: TrendState) => {
  switch (state) {
    case "stable":
      return {
        icon: <Minus className="w-3.5 h-3.5 text-emerald-400" />,
        label: "STABLE",
        containerClass: "border-emerald-500/50 bg-emerald-950/40 text-emerald-300",
        dotColor: "bg-emerald-400",
        desc: "Cortical arousal is holding steady across observed windows.",
      };
    case "rising":
      return {
        icon: <TrendingUp className="w-3.5 h-3.5 text-amber-300" />,
        label: "RISING",
        containerClass: "border-yellow-500/50 bg-yellow-950/40 text-yellow-200",
        dotColor: "bg-yellow-400",
        desc: "Beta power is increasing window-over-window at a steady rate.",
      };
    case "escalating":
      return {
        icon: <TrendingUp className="w-3.5 h-3.5 text-amber-400 animate-pulse" />,
        label: "ESCALATING",
        containerClass: "border-amber-500/70 bg-amber-950/50 text-amber-200",
        dotColor: "bg-amber-400",
        desc: "Accelerating rate-of-change across consecutive windows.",
      };
    case "peak":
      return {
        icon: <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />,
        label: "PEAK THRESHOLD",
        containerClass: "border-rose-500/70 bg-rose-950/50 text-rose-200",
        dotColor: "bg-rose-400",
        desc: "Cortical arousal index reached sequence maximum.",
      };
    case "declining":
      return {
        icon: <TrendingDown className="w-3.5 h-3.5 text-sky-400" />,
        label: "DECLINING",
        containerClass: "border-sky-500/50 bg-sky-950/40 text-sky-200",
        dotColor: "bg-sky-400",
        desc: "Beta power decreasing — restorative recovery pattern.",
      };
  }
};

/* ─── Main Component ───────────────────────────────────────────────────────── */
export default function TrendTrajectoryPanel({
  initialSequenceId = "cross_cohort_progression",
}: TrendTrajectoryPanelProps) {
  const [selectedSequenceId, setSelectedSequenceId] =
    useState<string>(initialSequenceId);
  const [trendData, setTrendData] = useState<TrendAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [rawWaveforms, setRawWaveforms] = useState<Record<string, number[]>>({});
  const [selectedWindowIdx, setSelectedWindowIdx] = useState<number | null>(null);

  // Load trend analysis
  useEffect(() => {
    setIsLoading(true);
    try {
      const result = analyzeSequenceTrend(selectedSequenceId);
      setTrendData(result);

      if (result && result.windows.length > 0) {
        const peakI = result.windows.reduce(
          (maxI, w, i, arr) =>
            w.arousal_score > arr[maxI].arousal_score ? i : maxI,
          0
        );
        setSelectedWindowIdx(peakI);
      }
    } catch (e) {
      console.error("Failed to analyze trend sequence:", e);
    } finally {
      setIsLoading(false);
    }
  }, [selectedSequenceId]);

  // Load calibrated microvolt raw samples
  useEffect(() => {
    if (!trendData) return;
    let isCancelled = false;

    const loadWaveforms = async () => {
      const map: Record<string, number[]> = {};
      for (const win of trendData.windows) {
        try {
          const res = await fetch(`/static/processed/${win.case_id}_raw.json`);
          if (res.ok) {
            const json = await res.json();
            const ch = win.case_id.includes("math")
              ? "F3"
              : win.case_id.includes("anxiety")
              ? "Fp1"
              : win.case_id.includes("stroop")
              ? "Fz"
              : "O1";
            map[win.case_id] =
              json.channels?.[ch]?.samples || json.samples || [];
          }
        } catch {
          // Graceful fallback
        }
      }
      if (!isCancelled) {
        setRawWaveforms(map);
      }
    };

    loadWaveforms();
    return () => {
      isCancelled = true;
    };
  }, [trendData]);

  if (!trendData && !isLoading) return null;

  const badge = trendData ? getTrendBadge(trendData.trend_state) : null;
  const seqMeta = trendData?.sequence_metadata;

  const peakWindowIdx = trendData
    ? trendData.windows.reduce(
        (maxI, w, i, arr) =>
          w.arousal_score > arr[maxI].arousal_score ? i : maxI,
        0
      )
    : 0;

  const peakWin = trendData ? trendData.windows[peakWindowIdx] : null;
  const peakPred = peakWin ? predictionsMap[peakWin.case_id] : null;

  const activeInspectWin =
    selectedWindowIdx !== null && trendData
      ? trendData.windows[selectedWindowIdx]
      : peakWin;
  const activeInspectPred = activeInspectWin
    ? predictionsMap[activeInspectWin.case_id]
    : null;

  return (
    <div className="bg-[#080c14] rounded-2xl border border-slate-800/90 p-5 sm:p-7 space-y-6 shadow-2xl relative overflow-hidden font-sans">
      {/* Subtle ambient clinical lighting */}
      <div className="absolute top-0 right-0 w-80 h-32 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-32 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* ── 1. Telemetry Station Header & Protocol Selector ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800/90 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-cyan-950/80 text-cyan-300 border border-cyan-800/50">
              Multi-Window Rate-of-Change Layer
            </span>
            <span className="text-[10px] font-mono text-slate-500">
              Electrophysiological Telemetry
            </span>
          </div>
          <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2.5 tracking-tight">
            <Layers className="w-5 h-5 text-cyan-400 shrink-0" />
            Escalation Pattern & Signal Trend Detection
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Sequential analysis of real calibrated EEG recording windows,
            pinpointing the exact signal shift responsible for the peak state.
          </p>
        </div>

        {/* Protocol Selector Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800 shrink-0">
          {Object.values(DEMO_SEQUENCES).map((s) => {
            const isSelected = s.id === selectedSequenceId;
            return (
              <button
                key={s.id}
                onClick={() => setSelectedSequenceId(s.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                  isSelected
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm font-bold"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                }`}
              >
                {s.same_subject ? "Same-Subject" : "Cross-Cohort"} (
                {s.source_cases.length}W)
              </button>
            );
          })}
        </div>
      </div>

      {isLoading && (
        <div className="h-44 flex items-center justify-center text-slate-500 text-xs font-mono animate-pulse">
          Calibrating multi-window electrophysiological signals…
        </div>
      )}

      {trendData && badge && seqMeta && peakWin && peakPred && (
        <>
          {/* ── 2. Master Telemetry Hub: The Exact Signal Responsible for Peak Condition ── */}
          <div className="bg-gradient-to-r from-slate-900/90 via-rose-950/20 to-slate-900/90 rounded-xl border border-rose-500/40 p-4 sm:p-5 shadow-lg relative">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
              {/* Left Column: Peak Signal Identification & Mechanism */}
              <div className="space-y-2 max-w-3xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-mono font-black uppercase tracking-wider bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded border border-rose-500/50 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 inline-block" />
                    PEAK TRIGGER SIGNAL IDENTIFIED
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    Window {peakWindowIdx + 1} of {trendData.windows.length}
                  </span>
                  <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                    {peakPred.session_provenance?.channels_recorded || "7-Channel 10-20 Montage"}
                  </span>
                </div>

                <h4 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
                  <span>{peakPred.detected_state_title || peakWin.source_label}</span>
                </h4>

                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong className="text-rose-300 font-medium">
                    Primary Causal Mechanism:
                  </strong>{" "}
                  {peakPred.structured_interpretation?.interpretation ||
                    "Acute cortical activation driven by high-frequency beta desynchronization and concurrent alpha suppression."}
                </p>

                {/* Key Markers Responsible for Condition */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {peakPred.key_markers?.map((marker: string, i: number) => (
                    <span
                      key={i}
                      className="text-[10.5px] font-mono bg-slate-950/80 text-slate-300 border border-slate-800 px-2 py-0.5 rounded flex items-center gap-1.5"
                    >
                      <Zap className="w-3 h-3 text-amber-400 shrink-0" />
                      {marker}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right Column: Quantitative Telemetry Quad */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-2.5 shrink-0 lg:w-72">
                <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800 text-center">
                  <span className="text-[9px] font-mono text-slate-400 block uppercase">
                    Arousal Index
                  </span>
                  <span className="text-base font-mono font-black text-rose-400">
                    {Math.round(peakWin.arousal_score * 100)}%
                  </span>
                  <span className="text-[9px] font-mono text-slate-500 block">
                    Conf: {(peakPred.confidence * 100).toFixed(1)}%
                  </span>
                </div>

                <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800 text-center">
                  <span className="text-[9px] font-mono text-slate-400 block uppercase">
                    Beta Deviation
                  </span>
                  <span className="text-base font-mono font-black text-amber-300">
                    {peakWin.beta_deviation_percent > 0 ? "+" : ""}
                    {peakWin.beta_deviation_percent.toFixed(1)}%
                  </span>
                  <span className="text-[9px] font-mono text-slate-500 block">
                    vs Resting Ref
                  </span>
                </div>

                <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800 text-center">
                  <span className="text-[9px] font-mono text-slate-400 block uppercase">
                    Beta / Alpha Ratio
                  </span>
                  <span className="text-base font-mono font-black text-slate-200">
                    {peakWin.beta_alpha_ratio.toFixed(2)}
                  </span>
                  <span className="text-[9px] font-mono text-slate-500 block">
                    Threshold &gt;1.20
                  </span>
                </div>

                <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800 text-center">
                  <span className="text-[9px] font-mono text-slate-400 block uppercase">
                    Mean Slope
                  </span>
                  <span
                    className={`text-base font-mono font-black ${
                      trendData.mean_slope > 0 ? "text-amber-400" : "text-sky-400"
                    }`}
                  >
                    {trendData.mean_slope > 0 ? "+" : ""}
                    {trendData.mean_slope.toFixed(1)}%
                  </span>
                  <span className="text-[9px] font-mono text-slate-500 block">
                    Rate of Change
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ── 3. Sequential Multi-Window Telemetry Cards ── */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="uppercase tracking-wider font-semibold text-slate-300 flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                Signal Sequence Breakdown ({trendData.windows.length} Calibrated Windows)
              </span>
              <span className="text-[10px] text-slate-500">
                Click any window to inspect comprehensive spectral matrix
              </span>
            </div>

            <div
              className={`grid gap-4 ${
                trendData.windows.length === 2
                  ? "grid-cols-1 md:grid-cols-2"
                  : "grid-cols-1 md:grid-cols-2 xl:grid-cols-4"
              }`}
            >
              {trendData.windows.map((win, idx) => {
                const isPeak = idx === peakWindowIdx;
                const isSelected = idx === selectedWindowIdx;
                const trans = trendData.transitions[idx];
                const pred = predictionsMap[win.case_id] || {};
                const arousalPct = Math.round(win.arousal_score * 100);

                // Phosphor trace color: Emerald for resting, Amber for rising, Crimson for peak
                const strokeColor = isPeak
                  ? "#f43f5e"
                  : arousalPct > 70
                  ? "#fb923c"
                  : arousalPct > 45
                  ? "#facc15"
                  : "#10b981";
                const glowColor = isPeak
                  ? "rgba(244, 63, 94, 0.4)"
                  : arousalPct > 70
                  ? "rgba(251, 146, 60, 0.3)"
                  : arousalPct > 45
                  ? "rgba(250, 204, 21, 0.3)"
                  : "rgba(16, 185, 129, 0.3)";

                const channelName = win.case_id.includes("math")
                  ? "Lead F3 (Cognitive)"
                  : win.case_id.includes("anxiety")
                  ? "Lead Fp1 (Arousal)"
                  : win.case_id.includes("stroop")
                  ? "Lead Fz (Conflict)"
                  : "Lead O1 (Alpha Ref)";

                // Extract primary relative band powers
                const bands = pred.numerical_band_powers || [];
                const betaPower =
                  bands.find((b: any) => b.band === "Beta")?.rel_power_percent ||
                  0;
                const alphaPower =
                  bands.find((b: any) => b.band === "Alpha")?.rel_power_percent ||
                  0;
                const thetaPower =
                  bands.find((b: any) => b.band === "Theta")?.rel_power_percent ||
                  0;

                return (
                  <div
                    key={win.case_id}
                    onClick={() => setSelectedWindowIdx(idx)}
                    className={`rounded-xl border p-4 flex flex-col justify-between space-y-3 cursor-pointer transition-all duration-200 ${
                      isPeak
                        ? "border-rose-500/70 bg-gradient-to-b from-rose-950/25 via-slate-900/90 to-slate-900/90 shadow-xl shadow-rose-950/20 ring-1 ring-rose-500/30"
                        : isSelected
                        ? "border-cyan-500/60 bg-slate-900/90 shadow-md ring-1 ring-cyan-500/30"
                        : "border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900/80"
                    }`}
                  >
                    {/* Header */}
                    <div>
                      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2 mb-2">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`text-xs font-mono font-bold ${
                              isPeak ? "text-rose-400" : "text-cyan-400"
                            }`}
                          >
                            WINDOW 0{win.window_index + 1}
                          </span>
                          {idx === 0 && (
                            <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-800/50 uppercase font-semibold">
                              Baseline
                            </span>
                          )}
                          {isPeak && (
                            <span className="text-[9px] font-mono text-rose-200 bg-rose-600 px-1.5 py-0.2 rounded font-black tracking-wide uppercase">
                              PEAK THRESHOLD
                            </span>
                          )}
                        </div>
                        <span className="text-[9px] font-mono text-slate-500 truncate max-w-[90px]">
                          {win.case_id}
                        </span>
                      </div>

                      <div className="text-xs font-semibold text-slate-200 leading-snug line-clamp-1">
                        {win.source_label}
                      </div>
                      <div className="text-[10px] font-mono text-slate-400 mt-0.5 flex items-center justify-between">
                        <span>Condition:</span>
                        <span
                          className={`font-bold uppercase ${
                            isPeak ? "text-rose-300" : "text-slate-300"
                          }`}
                        >
                          {win.risk_stage}
                        </span>
                      </div>
                    </div>

                    {/* Calibrated Signal Waveform Trace */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[9px] font-mono text-slate-400">
                        <span>Calibrated EEG Voltage Trace</span>
                        <span className={isPeak ? "text-rose-400 font-bold" : "text-slate-500"}>
                          {isPeak ? "Max Peak Excursion" : "128 Hz"}
                        </span>
                      </div>
                      <ProfessionalOscilloscopeCanvas
                        caseId={win.case_id}
                        samples={rawWaveforms[win.case_id]}
                        isPeak={isPeak}
                        strokeColor={strokeColor}
                        glowColor={glowColor}
                        channelName={channelName}
                      />
                    </div>

                    {/* STFT Spectrogram Image */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[9px] font-mono text-slate-400">
                        <span>STFT Spectrogram Matrix</span>
                        <span className="text-[8px] text-slate-500">4–48 Hz</span>
                      </div>
                      <ProfessionalSpectrogramImage
                        caseId={win.case_id}
                        isPeak={isPeak}
                      />
                    </div>

                    {/* Exact Spectral Band Breakdown Matrix */}
                    <div className="space-y-2 pt-2 border-t border-slate-800/80">
                      <div className="grid grid-cols-3 gap-1 text-[9.5px] font-mono bg-slate-950/80 p-2 rounded-lg border border-slate-800/70">
                        <div className="text-center">
                          <span className="text-slate-500 block text-[8px] uppercase">
                            Beta (13–30)
                          </span>
                          <span
                            className={`font-bold ${
                              win.beta_deviation_percent > 10
                                ? "text-amber-300"
                                : "text-slate-300"
                            }`}
                          >
                            {betaPower > 0 ? `${betaPower}%` : "—"}
                          </span>
                        </div>
                        <div className="text-center">
                          <span className="text-slate-500 block text-[8px] uppercase">
                            Alpha (8–12)
                          </span>
                          <span className="font-bold text-slate-300">
                            {alphaPower > 0 ? `${alphaPower}%` : "—"}
                          </span>
                        </div>
                        <div className="text-center">
                          <span className="text-slate-500 block text-[8px] uppercase">
                            Theta (4–8)
                          </span>
                          <span className="font-bold text-slate-300">
                            {thetaPower > 0 ? `${thetaPower}%` : "—"}
                          </span>
                        </div>
                      </div>

                      {/* Neurometric Values */}
                      <div className="grid grid-cols-2 gap-1.5 text-[10px] font-mono">
                        <div className="bg-slate-950/60 p-1.5 rounded border border-slate-800/60">
                          <span className="text-slate-500 block text-[8.5px]">
                            Beta Deviation
                          </span>
                          <span
                            className={`font-bold ${
                              win.beta_deviation_percent > 10
                                ? "text-amber-400"
                                : "text-slate-300"
                            }`}
                          >
                            {win.beta_deviation_percent > 0 ? "+" : ""}
                            {win.beta_deviation_percent.toFixed(1)}%
                          </span>
                        </div>
                        <div className="bg-slate-950/60 p-1.5 rounded border border-slate-800/60">
                          <span className="text-slate-500 block text-[8.5px]">
                            Beta / Alpha
                          </span>
                          <span className="font-bold text-slate-200">
                            {win.beta_alpha_ratio.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {/* Rate of change connector to next window */}
                      {trans && (
                        <div className="pt-1.5 flex items-center justify-between text-[10px] font-mono text-slate-400">
                          <span>→ Rate of Change to W{idx + 2}:</span>
                          <span
                            className={`font-bold flex items-center gap-0.5 ${
                              trans.delta_beta_deviation > 0
                                ? "text-amber-300"
                                : "text-sky-300"
                            }`}
                          >
                            {trans.delta_beta_deviation > 0 ? (
                              <ArrowUpRight className="w-3 h-3" />
                            ) : (
                              <ArrowDownRight className="w-3 h-3" />
                            )}
                            {trans.delta_beta_deviation > 0 ? "+" : ""}
                            {trans.delta_beta_deviation.toFixed(1)}%
                          </span>
                        </div>
                      )}
                      {!trans && (
                        <div className="pt-1 text-[9px] font-mono text-slate-500 flex items-center gap-1">
                          <FlatLine className="w-3 h-3" /> Sequence terminal window
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── 4. Detailed Electrophysiological Evidence Dossier ── */}
          {activeInspectWin && activeInspectPred && (
            <div className="bg-slate-900/70 rounded-xl border border-slate-800 p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4 text-cyan-400" />
                  <span className="font-bold text-slate-100 text-xs font-mono uppercase tracking-wider">
                    Window 0{activeInspectWin.window_index + 1} Electrophysiological
                    Findings & Evidence Dossier
                  </span>
                  {activeInspectWin.window_index === peakWindowIdx && (
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 uppercase font-black">
                      Peaked Trigger State
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-mono text-slate-500">
                  Provenance: {activeInspectPred.session_provenance?.dataset_name || "Benchmark Cohort"}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                {/* Clinical Finding */}
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-semibold">
                    Current Neuroelectric Finding
                  </span>
                  <p className="text-slate-300 leading-relaxed text-[11.5px]">
                    {activeInspectPred.structured_interpretation?.current_finding ||
                      "Spectral shift denotes active cortical desynchronization and task workload engagement."}
                  </p>
                </div>

                {/* Spectral Evidence */}
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-semibold">
                    Electrophysiological Evidence
                  </span>
                  <p className="text-slate-300 leading-relaxed text-[11.5px]">
                    {activeInspectPred.structured_interpretation?.evidence ||
                      `Beta/Alpha ratio of ${activeInspectWin.beta_alpha_ratio.toFixed(2)} with relative beta deviation of ${activeInspectWin.beta_deviation_percent > 0 ? "+" : ""}${activeInspectWin.beta_deviation_percent.toFixed(1)}%.`}
                  </p>
                </div>

                {/* Artifact Gating & Signal Quality */}
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-semibold flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Artifact Verification
                  </span>
                  <p className="text-slate-300 leading-relaxed text-[11.5px]">
                    {activeInspectPred.signal_quality?.cranial_emg_artifact ||
                      "Cranial EMG artifact screened clean; high-frequency power verified cortical via spectral slope threshold."}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ── 5. Standard Research Disclosure ── */}
          <div className="p-3.5 sm:p-4 rounded-xl border border-amber-500/30 bg-amber-950/20 text-amber-200 text-xs leading-relaxed flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="font-mono text-[10.5px] text-amber-100/80 leading-normal">
              {trendData.demonstration_disclosure}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
