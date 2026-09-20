"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Activity,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  Layers,
  Compass,
  ArrowUpRight,
  ArrowDownRight,
  Minus as FlatLine,
  Sparkles,
  Radio,
  Eye,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Brain,
  Info,
} from "lucide-react";
import {
  TrendAnalysisResult,
  SequenceMetadata,
  TrendState,
  DEMO_SEQUENCES,
  analyzeSequenceTrend,
} from "../lib/trend-logic";

interface TrendTrajectoryPanelProps {
  initialSequenceId?: string;
  onClose?: () => void;
}

/* ─── Realistic Physiological Waveform Fallback Generator ───────────────────── */
function generateFallbackSamples(caseId: string): number[] {
  const arr: number[] = [];
  const total = 640;
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

/* ─── Oscilloscope Waveform Canvas for Window Signal ────────────────────────── */
function WindowSignalCanvas({
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
    const ampRange = 65.0;

    // Clear dark CRT background
    ctx.fillStyle = "#040711";
    ctx.fillRect(0, 0, width, height);

    // Fine medical grid
    ctx.strokeStyle = "rgba(255, 255, 255, 0.06)";
    ctx.lineWidth = 0.8;

    // Center zero baseline
    ctx.beginPath();
    ctx.moveTo(0, midY);
    ctx.lineTo(width, midY);
    ctx.stroke();

    // Secondary grid lines
    ctx.beginPath();
    ctx.setLineDash([2, 4]);
    ctx.moveTo(0, midY - height * 0.35);
    ctx.lineTo(width, midY - height * 0.35);
    ctx.moveTo(0, midY + height * 0.35);
    ctx.lineTo(width, midY + height * 0.35);
    ctx.stroke();
    ctx.setLineDash([]);

    // Vertical time grid lines
    const colStep = width / 6;
    ctx.beginPath();
    for (let x = colStep; x < width; x += colStep) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
    }
    ctx.stroke();

    // Draw waveform trace
    ctx.beginPath();
    ctx.strokeStyle = strokeColor;
    ctx.shadowColor = glowColor;
    ctx.shadowBlur = isPeak ? 10 : 5;
    ctx.lineWidth = isPeak ? 2.0 : 1.4;
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

    // If peak window, mark peak point with glowing target ring
    if (isPeak && maxIdx > 0) {
      const peakX = (maxIdx / (total - 1)) * width;
      const peakVal = waveData[maxIdx] || 0;
      const peakY =
        midY - Math.max(-1, Math.min(1, peakVal / ampRange)) * (height * 0.42);

      // Glow halo
      ctx.beginPath();
      ctx.arc(peakX, peakY, 7, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(244, 63, 94, 0.35)";
      ctx.fill();

      // Pin center
      ctx.beginPath();
      ctx.arc(peakX, peakY, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.shadowColor = "#f43f5e";
      ctx.shadowBlur = 8;
      ctx.fill();

      // Text label
      ctx.font = "bold 9px monospace";
      ctx.fillStyle = "#f43f5e";
      ctx.textAlign = peakX > width - 60 ? "right" : "left";
      ctx.fillText(
        `★ PEAK ${Math.abs(peakVal).toFixed(1)}µV`,
        peakX > width - 60 ? peakX - 8 : peakX + 8,
        peakY < 20 ? peakY + 14 : peakY - 6
      );
    }
  }, [caseId, samples, isPeak, strokeColor, glowColor]);

  return (
    <div className="relative w-full overflow-hidden rounded-lg border border-slate-800/80 bg-[#040711]">
      <canvas
        ref={canvasRef}
        width={340}
        height={95}
        className="w-full h-[90px] block"
      />
      <div className="absolute top-1 left-2 text-[8px] font-mono text-slate-400 bg-slate-950/80 px-1.5 py-0.5 rounded border border-slate-800/60">
        {channelName || "EEG Lead"} · ±40 µV
      </div>
      <div className="absolute bottom-1 right-2 text-[8px] font-mono text-slate-500 bg-slate-950/80 px-1.5 py-0.5 rounded border border-slate-800/60">
        128 Hz · 10s
      </div>
    </div>
  );
}

/* ─── STFT Spectrogram Signal Image Thumbnail ──────────────────────────────── */
function WindowSpectrogramImage({
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
          ? "border-rose-500/60 shadow-md shadow-rose-950/40 ring-1 ring-rose-500/30"
          : "border-slate-800"
      } bg-slate-950`}
    >
      <div className="relative aspect-video w-full max-h-[105px] overflow-hidden flex items-center justify-center bg-black">
        <img
          src={`/static/processed/${caseId}_sst_128.png`}
          alt={`STFT Spectrogram for ${caseId}`}
          className="w-full h-full object-cover filter contrast-125 brightness-105"
          onError={(e) => {
            (e.target as HTMLElement).style.display = "none";
          }}
        />

        {/* Frequency scale on left */}
        <div className="absolute top-1 left-1.5 text-[8px] font-mono text-slate-400 bg-slate-950/80 px-1 rounded">
          48Hz
        </div>
        <div className="absolute bottom-1 left-1.5 text-[8px] font-mono text-slate-400 bg-slate-950/80 px-1 rounded">
          4Hz
        </div>
        <div className="absolute bottom-1 right-1.5 text-[8px] font-mono text-slate-400 bg-slate-950/80 px-1 rounded">
          10.0s
        </div>

        {/* Spectrogram Annotation Badge */}
        {isPeak ? (
          <div className="absolute top-1 right-1 bg-rose-600/90 text-white font-mono text-[8px] font-bold px-1.5 py-0.5 rounded shadow flex items-center gap-1">
            <span>▲ PEAK BETA POWER (20–30Hz)</span>
          </div>
        ) : (
          <div className="absolute top-1 right-1 bg-slate-900/80 text-slate-300 font-mono text-[8px] px-1.5 py-0.5 rounded border border-slate-700/50">
            <span>STFT Spectrogram</span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── SVG Arousal Macro Chart ──────────────────────────────────────────────── */
function ArousalSVGChart({
  windows,
  transitions,
}: {
  windows: TrendAnalysisResult["windows"];
  transitions: TrendAnalysisResult["transitions"];
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const W = 640;
  const H = 160;
  const PAD_L = 48;
  const PAD_R = 24;
  const PAD_T = 20;
  const PAD_B = 32;

  const chartW = W - PAD_L - PAD_R;
  const chartH = H - PAD_T - PAD_B;

  const n = windows.length;
  if (n < 2) return null;

  const arousalValues = windows.map((w) => w.arousal_score * 100);
  const maxArousal = Math.max(...arousalValues, 100);
  const minArousal = Math.min(...arousalValues, 0);
  const range = maxArousal - minArousal || 1;

  const toX = (i: number) => PAD_L + (i / (n - 1)) * chartW;
  const toY = (v: number) =>
    PAD_T + chartH - ((v - minArousal) / range) * chartH;

  const points = windows
    .map((w, i) => `${toX(i)},${toY(w.arousal_score * 100)}`)
    .join(" ");
  const peakIdx = arousalValues.indexOf(Math.max(...arousalValues));

  const areaPath = [
    `M ${toX(0)} ${toY(arousalValues[0])}`,
    ...windows
      .slice(1)
      .map((w, i) => `L ${toX(i + 1)} ${toY(arousalValues[i + 1])}`),
    `L ${toX(n - 1)} ${H - PAD_B}`,
    `L ${toX(0)} ${H - PAD_B}`,
    "Z",
  ].join(" ");

  const gridLines = [0, 25, 50, 75, 100].map((pct) => {
    const y = toY(minArousal + (range * pct) / 100);
    return { y, label: `${Math.round(minArousal + (range * pct) / 100)}%` };
  });

  const getColor = (v: number) =>
    v > 70 ? "#f97316" : v > 45 ? "#facc15" : "#34d399";
  const peakColor = getColor(arousalValues[peakIdx]);

  return (
    <div className="w-full overflow-x-auto">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="w-full max-w-full"
        style={{ minWidth: 320 }}
        aria-label="Arousal trajectory chart"
      >
        <defs>
          <linearGradient id="arousalGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={peakColor} stopOpacity="0.35" />
            <stop offset="100%" stopColor={peakColor} stopOpacity="0.02" />
          </linearGradient>
          <filter id="peakGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {gridLines.map(({ y, label }) => (
          <g key={label}>
            <line
              x1={PAD_L}
              y1={y}
              x2={W - PAD_R}
              y2={y}
              stroke="#334155"
              strokeWidth="0.5"
              strokeDasharray="3,4"
            />
            <text
              x={PAD_L - 6}
              y={y + 3.5}
              textAnchor="end"
              fontSize="9"
              fill="#64748b"
              fontFamily="monospace"
            >
              {label}
            </text>
          </g>
        ))}

        <line
          x1={PAD_L}
          y1={H - PAD_B}
          x2={W - PAD_R}
          y2={H - PAD_B}
          stroke="#475569"
          strokeWidth="0.8"
        />

        <path d={areaPath} fill="url(#arousalGrad)" />

        <polyline
          points={points}
          fill="none"
          stroke={peakColor}
          strokeWidth="2.2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {transitions.map((t, i) => {
          const midX = (toX(i) + toX(i + 1)) / 2;
          const midY =
            (toY(arousalValues[i]) + toY(arousalValues[i + 1])) / 2 - 10;
          const isUp = t.delta_beta_deviation > 0;
          const slopeColor = isUp ? "#fb923c" : "#38bdf8";
          return (
            <g key={i}>
              <text
                x={midX}
                y={midY}
                textAnchor="middle"
                fontSize="8.5"
                fill={slopeColor}
                fontFamily="monospace"
                fontWeight="bold"
              >
                {isUp ? "▲" : "▼"} {isUp ? "+" : ""}
                {t.delta_beta_deviation.toFixed(1)}%
              </text>
            </g>
          );
        })}

        {windows.map((w, i) => {
          const cx = toX(i);
          const cy = toY(arousalValues[i]);
          const isPeak = i === peakIdx;
          const dotColor = getColor(arousalValues[i]);
          return (
            <g key={w.case_id}>
              {isPeak && (
                <circle
                  cx={cx}
                  cy={cy}
                  r="10"
                  fill={dotColor}
                  fillOpacity="0.18"
                  filter="url(#peakGlow)"
                />
              )}
              <circle
                cx={cx}
                cy={cy}
                r={isPeak ? 6 : 4.5}
                fill={dotColor}
                stroke={isPeak ? "#fff" : "#0f172a"}
                strokeWidth={isPeak ? 2 : 1.2}
                filter={isPeak ? "url(#peakGlow)" : undefined}
              />
              <text
                x={cx}
                y={H - PAD_B + 14}
                textAnchor="middle"
                fontSize="8.5"
                fill="#94a3b8"
                fontFamily="monospace"
              >
                W{i + 1}
              </text>
              <text
                x={cx}
                y={cy - (isPeak ? 12 : 9)}
                textAnchor="middle"
                fontSize="8"
                fill={dotColor}
                fontFamily="monospace"
                fontWeight="bold"
              >
                {Math.round(arousalValues[i])}%
              </text>
            </g>
          );
        })}

        {(() => {
          const px = toX(peakIdx);
          const py = toY(arousalValues[peakIdx]);
          return (
            <g>
              <line
                x1={px}
                y1={py - 8}
                x2={px}
                y2={PAD_T + 2}
                stroke={peakColor}
                strokeWidth="1"
                strokeDasharray="3,3"
                opacity="0.6"
              />
              <rect
                x={px - 18}
                y={1}
                width={36}
                height={12}
                rx="3"
                fill={peakColor}
                fillOpacity="0.18"
                stroke={peakColor}
                strokeWidth="0.5"
                strokeOpacity="0.5"
              />
              <text
                x={px}
                y={9}
                textAnchor="middle"
                fontSize="7.5"
                fill={peakColor}
                fontFamily="monospace"
                fontWeight="bold"
                letterSpacing="0.5"
              >
                PEAK
              </text>
            </g>
          );
        })()}

        <text
          transform={`rotate(-90)`}
          x={-(H / 2)}
          y={12}
          textAnchor="middle"
          fontSize="8"
          fill="#475569"
          fontFamily="monospace"
        >
          Arousal Index (%)
        </text>
      </svg>
    </div>
  );
}

/* ─── Trend Badge Config ──────────────────────────────────────────────────── */
const getTrendBadge = (state: TrendState) => {
  switch (state) {
    case "stable":
      return {
        icon: <Minus className="w-4 h-4 text-emerald-400" />,
        label: "STABLE",
        containerClass: "border-emerald-500/50 bg-emerald-950/40 text-emerald-300",
        dotColor: "bg-emerald-400",
        desc: "Arousal levels are holding steady across windows.",
      };
    case "rising":
      return {
        icon: <TrendingUp className="w-4 h-4 text-amber-300" />,
        label: "RISING",
        containerClass: "border-yellow-500/50 bg-yellow-950/40 text-yellow-200",
        dotColor: "bg-yellow-400",
        desc: "Beta power is increasing window-over-window at a mild rate.",
      };
    case "escalating":
      return {
        icon: <TrendingUp className="w-4 h-4 text-amber-400 animate-pulse" />,
        label: "ESCALATING",
        containerClass: "border-amber-500/70 bg-amber-950/50 text-amber-200",
        dotColor: "bg-amber-400",
        desc: "Rapid rate-of-change: beta power is accelerating across consecutive windows.",
      };
    case "peak":
      return {
        icon: <AlertTriangle className="w-4 h-4 text-rose-400" />,
        label: "PEAK",
        containerClass: "border-rose-500/60 bg-rose-950/50 text-rose-200",
        dotColor: "bg-rose-400",
        desc: "Arousal index reached maximum across the observed sequence.",
      };
    case "declining":
      return {
        icon: <TrendingDown className="w-4 h-4 text-sky-400" />,
        label: "DECLINING",
        containerClass: "border-sky-500/50 bg-sky-950/40 text-sky-200",
        dotColor: "bg-sky-400",
        desc: "Beta dominance is decreasing — cortical arousal is subsiding.",
      };
  }
};

/* ─── Main Panel Component ─────────────────────────────────────────────────── */
export default function TrendTrajectoryPanel({
  initialSequenceId = "cross_cohort_progression",
}: TrendTrajectoryPanelProps) {
  const [selectedSequenceId, setSelectedSequenceId] =
    useState<string>(initialSequenceId);
  const [trendData, setTrendData] = useState<TrendAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [rawWaveforms, setRawWaveforms] = useState<Record<string, number[]>>({});
  const [displayMode, setDisplayMode] = useState<
    "composite" | "waveform" | "spectrogram"
  >("composite");
  const [selectedWindowIdx, setSelectedWindowIdx] = useState<number | null>(null);
  const [showMacroTrajectory, setShowMacroTrajectory] = useState<boolean>(false);

  // Load trend analytics
  useEffect(() => {
    setIsLoading(true);
    try {
      const result = analyzeSequenceTrend(selectedSequenceId);
      setTrendData(result);

      // Default selected window to peak window
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

  // Load real microvolt raw waveforms from static JSON
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
          // Fallback samples are used gracefully by WindowSignalCanvas
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
  const activeDetailWin =
    selectedWindowIdx !== null && trendData
      ? trendData.windows[selectedWindowIdx]
      : peakWin;

  return (
    <div className="bg-[#090d16] rounded-2xl border border-slate-800 p-5 sm:p-7 space-y-6 shadow-2xl relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-0 right-0 w-96 h-40 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-32 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-cyan-950/80 text-cyan-300 border border-cyan-700/50">
              Multi-Window Sequence Layer
            </span>
            <span className="text-[10px] font-mono text-slate-500">
              Post-Signal Analysis — Demonstration
            </span>
          </div>
          <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2.5">
            <Layers className="w-5 h-5 text-cyan-400 shrink-0" />
            Escalation Pattern & Trend Detection
          </h3>
          <p className="text-xs text-slate-400 mt-1.5 max-w-2xl leading-relaxed">
            Tracks rate-of-change across an ordered sequence of real EEG windows
            to illustrate how multi-window slope changes compare against static
            single-window thresholds.
          </p>
        </div>

        {/* Sequence selector */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800 shrink-0">
          {Object.values(DEMO_SEQUENCES).map((s) => {
            const isSelected = s.id === selectedSequenceId;
            return (
              <button
                key={s.id}
                onClick={() => setSelectedSequenceId(s.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                  isSelected
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
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
        <div className="h-48 flex items-center justify-center text-slate-500 text-sm font-mono animate-pulse">
          Computing multi-window trend signals…
        </div>
      )}

      {trendData && badge && seqMeta && peakWin && (
        <>
          {/* ── UNIFIED SIGNAL VISUALIZER DECK (Replaces purely textual display) ── */}
          <div className="space-y-4">
            {/* 1. Signal HUD Status Bar */}
            <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-3 sm:p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-inner">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                    Active Sequence Signal
                  </span>
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                      seqMeta.same_subject
                        ? "bg-emerald-950/60 text-emerald-300 border-emerald-800/50"
                        : "bg-purple-950/60 text-purple-300 border-purple-800/50"
                    }`}
                  >
                    {seqMeta.same_subject ? "✓ Same Subject" : "⚠ Cross-Cohort"}
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                  <span>{seqMeta.title}</span>
                  <span className="text-xs font-mono text-slate-500">
                    ({trendData.windows.length} Windows)
                  </span>
                </h4>
              </div>

              {/* Center/Right: Trend State Badge & Derivatives HUD */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                {/* Trend state badge */}
                <div
                  className={`px-3 py-1.5 rounded-lg border flex items-center gap-2 font-mono text-xs font-bold ${badge.containerClass}`}
                >
                  <span className="flex h-2 w-2 relative">
                    <span
                      className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${badge.dotColor}`}
                    />
                    <span
                      className={`relative inline-flex rounded-full h-2 w-2 ${badge.dotColor}`}
                    />
                  </span>
                  {badge.icon}
                  <span>TREND STATE: {badge.label}</span>
                </div>

                {/* Mean slope pill */}
                <div className="bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800 text-xs font-mono flex items-center gap-1.5">
                  <span className="text-slate-500">Mean Slope:</span>
                  <span
                    className={`font-bold ${
                      trendData.mean_slope > 0
                        ? "text-amber-400"
                        : "text-sky-400"
                    }`}
                  >
                    {trendData.mean_slope > 0 ? "+" : ""}
                    {trendData.mean_slope.toFixed(1)}%
                  </span>
                </div>

                {/* Acceleration pill */}
                <div className="bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800 text-xs font-mono flex items-center gap-1.5">
                  <span className="text-slate-500">Acceleration:</span>
                  <span
                    className={`font-bold ${
                      trendData.second_derivative_acceleration > 0
                        ? "text-rose-400"
                        : "text-emerald-400"
                    }`}
                  >
                    {trendData.second_derivative_acceleration > 0 ? "+" : ""}
                    {trendData.second_derivative_acceleration.toFixed(1)}%
                  </span>
                </div>

                {/* View Mode Switcher */}
                <div className="flex items-center bg-slate-950 rounded-lg p-1 border border-slate-800 text-[11px] font-mono">
                  <button
                    onClick={() => setDisplayMode("composite")}
                    className={`px-2 py-1 rounded transition-all ${
                      displayMode === "composite"
                        ? "bg-cyan-500/20 text-cyan-300 font-bold"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                    title="Show both Oscilloscope Waveform and STFT Spectrogram"
                  >
                    Wave + STFT
                  </button>
                  <button
                    onClick={() => setDisplayMode("waveform")}
                    className={`px-2 py-1 rounded transition-all ${
                      displayMode === "waveform"
                        ? "bg-cyan-500/20 text-cyan-300 font-bold"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                    title="Show only EEG Oscilloscope Waveforms"
                  >
                    Wave Only
                  </button>
                  <button
                    onClick={() => setDisplayMode("spectrogram")}
                    className={`px-2 py-1 rounded transition-all ${
                      displayMode === "spectrogram"
                        ? "bg-cyan-500/20 text-cyan-300 font-bold"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                    title="Show only STFT Spectrogram Signal Images"
                  >
                    STFT Only
                  </button>
                </div>
              </div>
            </div>

            {/* 2. PROMINENT CALLOUT BANNER: Direct pointer to where the signal peaked */}
            <div className="relative bg-gradient-to-r from-rose-950/40 via-amber-950/25 to-rose-950/40 border border-rose-500/50 rounded-xl p-4 shadow-lg shadow-rose-950/20">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-rose-500/20 border border-rose-500/40 flex items-center justify-center shrink-0 text-rose-400 mt-0.5">
                    <AlertTriangle className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-mono font-black uppercase tracking-wider bg-rose-500/25 text-rose-300 px-2 py-0.5 rounded border border-rose-500/40 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping inline-block" />
                        📍 Peak Arousal Point Identified
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-100">
                        Window {peakWindowIdx + 1}: {peakWin.source_label}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                      Signal peaks at Window {peakWindowIdx + 1} with an arousal
                      index of{" "}
                      <strong className="text-rose-400 font-mono font-bold">
                        {Math.round(peakWin.arousal_score * 100)}%
                      </strong>
                      , a high-frequency beta power deviation of{" "}
                      <strong className="text-amber-300 font-mono font-bold">
                        {peakWin.beta_deviation_percent > 0 ? "+" : ""}
                        {peakWin.beta_deviation_percent.toFixed(1)}%
                      </strong>
                      , and Beta/Alpha ratio of{" "}
                      <strong className="text-slate-100 font-mono font-bold">
                        {peakWin.beta_alpha_ratio.toFixed(2)}
                      </strong>
                      . High-amplitude desynchronization burst is visible below.
                    </p>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 sm:border-l border-rose-500/20 pt-2 sm:pt-0 sm:pl-4 shrink-0">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">
                    Observed Peak State
                  </span>
                  <span className="text-sm font-mono font-black text-rose-300 tracking-wider">
                    {peakWin.risk_stage}
                  </span>
                </div>
              </div>

              {/* Indicator note pointing down */}
              <div className="hidden md:flex items-center justify-center gap-2 mt-3 pt-2.5 border-t border-rose-500/20 text-[10px] font-mono text-rose-300/80">
                <span>
                  ▼ Downward arrow below points directly to the peaked EEG
                  voltage wave & STFT spectrogram image
                </span>
              </div>
            </div>

            {/* 3. Multi-Window Signal Grid (Showing waveform + spectrogram images with peak marker) */}
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
                const arousalPct = Math.round(win.arousal_score * 100);

                // Phosphor palette based on arousal state
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
                  ? "F3 Lead"
                  : win.case_id.includes("anxiety")
                  ? "Fp1 Lead"
                  : win.case_id.includes("stroop")
                  ? "Fz Lead"
                  : "O1 Lead";

                return (
                  <div
                    key={win.case_id}
                    onClick={() => setSelectedWindowIdx(idx)}
                    className={`relative rounded-xl border p-3.5 sm:p-4 flex flex-col justify-between space-y-3 cursor-pointer transition-all duration-300 ${
                      isPeak
                        ? "border-rose-500/60 bg-gradient-to-b from-rose-950/30 via-slate-900/90 to-slate-900/90 shadow-xl shadow-rose-950/20 ring-1 ring-rose-500/40"
                        : isSelected
                        ? "border-cyan-500/60 bg-slate-900/90 shadow-lg ring-1 ring-cyan-500/30"
                        : "border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900/80"
                    }`}
                  >
                    {/* Floating Downward Peak Pointer */}
                    {isPeak && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
                        <span className="px-2.5 py-0.5 rounded-full text-[9px] font-mono font-black uppercase tracking-wider bg-rose-500 text-white shadow-lg shadow-rose-500/50 flex items-center gap-1 animate-bounce">
                          ▼ PEAKED HERE
                        </span>
                      </div>
                    )}

                    {/* Window Header */}
                    <div>
                      <div className="flex items-center justify-between border-b border-slate-800/70 pb-2 mb-2">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`text-xs font-mono font-bold ${
                              isPeak ? "text-rose-400" : "text-cyan-400"
                            }`}
                          >
                            Window {win.window_index + 1}
                          </span>
                          {idx === 0 && (
                            <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-800/40 uppercase">
                              Baseline
                            </span>
                          )}
                          {isPeak && (
                            <span className="text-[9px] font-mono font-black text-rose-300 bg-rose-950/80 px-1.5 py-0.2 rounded border border-rose-600/50 uppercase">
                              Peak Arousal
                            </span>
                          )}
                        </div>
                        <span className="text-[9px] font-mono text-slate-500 truncate max-w-[90px]">
                          {win.case_id}
                        </span>
                      </div>

                      <div className="text-xs font-semibold text-slate-200 line-clamp-1">
                        {win.source_label}
                      </div>
                      <div className="text-[10px] font-mono text-slate-400 mt-0.5 flex items-center justify-between">
                        <span>State:</span>
                        <span className="font-bold text-slate-300 uppercase">
                          {win.risk_stage}
                        </span>
                      </div>
                    </div>

                    {/* Visual Signal Representation (Waveform / Spectrogram Images) */}
                    <div className="space-y-2">
                      {/* EEG Waveform Canvas */}
                      {(displayMode === "composite" ||
                        displayMode === "waveform") && (
                        <div>
                          <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 mb-1">
                            <span className="flex items-center gap-1">
                              <Radio className="w-2.5 h-2.5 text-cyan-400" />
                              Microvolt EEG Waveform
                            </span>
                            {isPeak && (
                              <span className="text-rose-400 font-bold">
                                Desynchronized Peak
                              </span>
                            )}
                          </div>
                          <WindowSignalCanvas
                            caseId={win.case_id}
                            samples={rawWaveforms[win.case_id]}
                            isPeak={isPeak}
                            strokeColor={strokeColor}
                            glowColor={glowColor}
                            channelName={channelName}
                          />
                        </div>
                      )}

                      {/* STFT Spectrogram Image */}
                      {(displayMode === "composite" ||
                        displayMode === "spectrogram") && (
                        <div>
                          <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 mb-1">
                            <span className="flex items-center gap-1">
                              <Activity className="w-2.5 h-2.5 text-amber-400" />
                              STFT Spectrogram Image
                            </span>
                            <span className="text-[8px] text-slate-500">
                              0–48 Hz
                            </span>
                          </div>
                          <WindowSpectrogramImage
                            caseId={win.case_id}
                            isPeak={isPeak}
                          />
                        </div>
                      )}
                    </div>

                    {/* Neurometric Values On The Signal Card */}
                    <div className="space-y-2 pt-2 border-t border-slate-800/60">
                      {/* Arousal Progress */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-mono">
                          <span className="text-slate-400">Arousal Index</span>
                          <span
                            className={`font-bold ${
                              isPeak
                                ? "text-rose-400"
                                : arousalPct > 70
                                ? "text-amber-400"
                                : arousalPct > 45
                                ? "text-yellow-400"
                                : "text-emerald-400"
                            }`}
                          >
                            {arousalPct}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ${
                              isPeak
                                ? "bg-rose-500"
                                : arousalPct > 70
                                ? "bg-amber-400"
                                : arousalPct > 45
                                ? "bg-yellow-400"
                                : "bg-emerald-400"
                            }`}
                            style={{ width: `${arousalPct}%` }}
                          />
                        </div>
                      </div>

                      {/* Beta Metrics Row */}
                      <div className="grid grid-cols-2 gap-1.5 text-[10px] font-mono bg-slate-950/70 p-2 rounded-lg border border-slate-800/60">
                        <div>
                          <span className="text-slate-500 block text-[9px]">
                            Beta Shift
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
                        <div>
                          <span className="text-slate-500 block text-[9px]">
                            Beta/Alpha
                          </span>
                          <span className="font-bold text-slate-200">
                            {win.beta_alpha_ratio.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {/* Transition Slope to next window */}
                      {trans && (
                        <div className="pt-1.5 flex items-center justify-between text-[10px] font-mono text-slate-400">
                          <span>→ Slope to W{idx + 2}:</span>
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
                          <FlatLine className="w-3 h-3" /> Terminal window in
                          sequence
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 4. On-Signal Interactive Spotlight Explanatory Drawer */}
            {activeDetailWin && (
              <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-2.5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4 text-cyan-400" />
                    <span className="font-semibold text-slate-100 text-xs uppercase tracking-wider">
                      Window {activeDetailWin.window_index + 1} Electrophysiological
                      Interpretation
                    </span>
                    {activeDetailWin.window_index === peakWindowIdx && (
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 uppercase font-bold">
                        ★ Peaked Window Detail
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">
                    Click any window card above to inspect
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 block uppercase">
                      Physiological Mechanism
                    </span>
                    <p className="text-slate-300 mt-1 leading-relaxed">
                      {activeDetailWin.window_index === 0
                        ? "Resting alpha synchronization (8–12 Hz) reflects cortical idling and baseline mental calm."
                        : activeDetailWin.window_index === peakWindowIdx
                        ? "High-frequency beta desynchronization (20–30 Hz) accompanied by alpha suppression denotes peak cortical strain and cognitive activation."
                        : "Progressive recruitment of frontal networks with rising beta power and emerging midline theta activation."}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 block uppercase">
                      Electrode Channel Derivation
                    </span>
                    <p className="text-slate-300 mt-1 leading-relaxed font-mono text-[11px]">
                      {activeDetailWin.case_id.includes("math")
                        ? "F3 — Left Frontal Cognitive Processing (captures arithmetic workload)"
                        : activeDetailWin.case_id.includes("anxiety")
                        ? "Fp1 — Left Prefrontal Emotional Arousal (captures acute affective reactivity)"
                        : activeDetailWin.case_id.includes("stroop")
                        ? "Fz — Frontal Midline Theta (captures executive conflict)"
                        : "O1 — Occipital Posterior Alpha Rhythm (captures sensory resting state)"}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 block uppercase">
                      Rate-of-Change Interpretation
                    </span>
                    <p className="text-slate-300 mt-1 leading-relaxed">
                      {trendData.trend_description}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── Macro Trajectory Curve (Collapsible Companion) ── */}
          <div className="bg-slate-900/40 rounded-xl border border-slate-800 p-4 space-y-2">
            <button
              onClick={() => setShowMacroTrajectory(!showMacroTrajectory)}
              className="w-full flex items-center justify-between text-xs font-mono text-slate-400 hover:text-slate-200 transition-colors"
            >
              <span className="flex items-center gap-2 font-bold uppercase tracking-wider text-slate-300">
                <Activity className="w-4 h-4 text-cyan-400" />
                Macro Arousal Trajectory Curve ({trendData.windows.length}{" "}
                Windows)
              </span>
              <span className="flex items-center gap-1 text-[11px] text-cyan-400">
                {showMacroTrajectory ? "Hide Curve" : "View Curve"}
                {showMacroTrajectory ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </span>
            </button>

            {showMacroTrajectory && (
              <div className="pt-2 animate-in fade-in duration-300">
                <ArousalSVGChart
                  windows={trendData.windows}
                  transitions={trendData.transitions}
                />
              </div>
            )}
          </div>

          {/* ── Mandatory Disclosure ── */}
          <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-950/20 text-amber-200 text-xs leading-relaxed flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="font-mono text-[11px] text-amber-100/85 leading-normal">
              {trendData.demonstration_disclosure}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
