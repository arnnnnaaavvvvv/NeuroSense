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

/* ─── SVG Arousal Chart ─────────────────────────────────────────────────────── */
function ArousalSVGChart({ windows, transitions }: {
  windows: TrendAnalysisResult["windows"];
  transitions: TrendAnalysisResult["transitions"];
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const W = 640;
  const H = 180;
  const PAD_L = 48;
  const PAD_R = 24;
  const PAD_T = 20;
  const PAD_B = 36;

  const chartW = W - PAD_L - PAD_R;
  const chartH = H - PAD_T - PAD_B;

  const n = windows.length;
  if (n < 2) return null;

  const arousalValues = windows.map((w) => w.arousal_score * 100);
  const maxArousal = Math.max(...arousalValues, 100);
  const minArousal = Math.min(...arousalValues, 0);
  const range = maxArousal - minArousal || 1;

  const toX = (i: number) => PAD_L + (i / (n - 1)) * chartW;
  const toY = (v: number) => PAD_T + chartH - ((v - minArousal) / range) * chartH;

  // Build polyline points
  const points = windows.map((w, i) => `${toX(i)},${toY(w.arousal_score * 100)}`).join(" ");

  // Peak index
  const peakIdx = arousalValues.indexOf(Math.max(...arousalValues));

  // Area fill path
  const areaPath = [
    `M ${toX(0)} ${toY(arousalValues[0])}`,
    ...windows.slice(1).map((w, i) => `L ${toX(i + 1)} ${toY(arousalValues[i + 1])}`),
    `L ${toX(n - 1)} ${H - PAD_B}`,
    `L ${toX(0)} ${H - PAD_B}`,
    "Z",
  ].join(" ");

  // Y-axis grid lines
  const gridLines = [0, 25, 50, 75, 100].map((pct) => {
    const y = toY(minArousal + (range * pct) / 100);
    return { y, label: `${Math.round(minArousal + (range * pct) / 100)}%` };
  });

  const getColor = (v: number) => (v > 70 ? "#f97316" : v > 45 ? "#facc15" : "#34d399");
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
          {/* Gradient fill under line */}
          <linearGradient id="arousalGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={peakColor} stopOpacity="0.35" />
            <stop offset="100%" stopColor={peakColor} stopOpacity="0.02" />
          </linearGradient>
          {/* Glow filter for peak point */}
          <filter id="peakGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Grid lines */}
        {gridLines.map(({ y, label }) => (
          <g key={label}>
            <line
              x1={PAD_L} y1={y} x2={W - PAD_R} y2={y}
              stroke="#334155" strokeWidth="0.5" strokeDasharray="3,4"
            />
            <text
              x={PAD_L - 6} y={y + 3.5}
              textAnchor="end" fontSize="9" fill="#64748b"
              fontFamily="monospace"
            >
              {label}
            </text>
          </g>
        ))}

        {/* X-axis baseline */}
        <line
          x1={PAD_L} y1={H - PAD_B} x2={W - PAD_R} y2={H - PAD_B}
          stroke="#475569" strokeWidth="0.8"
        />

        {/* Area fill */}
        <path d={areaPath} fill="url(#arousalGrad)" />

        {/* Main line */}
        <polyline
          points={points}
          fill="none"
          stroke={peakColor}
          strokeWidth="2.2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Transition slope arrows above each segment midpoint */}
        {transitions.map((t, i) => {
          const midX = (toX(i) + toX(i + 1)) / 2;
          const midY = (toY(arousalValues[i]) + toY(arousalValues[i + 1])) / 2 - 10;
          const isUp = t.delta_beta_deviation > 0;
          const slopeColor = isUp ? "#fb923c" : "#38bdf8";
          return (
            <g key={i}>
              <text
                x={midX} y={midY}
                textAnchor="middle" fontSize="8.5" fill={slopeColor}
                fontFamily="monospace" fontWeight="bold"
              >
                {isUp ? "▲" : "▼"}{" "}
                {isUp ? "+" : ""}{t.delta_beta_deviation.toFixed(1)}%
              </text>
            </g>
          );
        })}

        {/* Window dots */}
        {windows.map((w, i) => {
          const cx = toX(i);
          const cy = toY(arousalValues[i]);
          const isPeak = i === peakIdx;
          const dotColor = getColor(arousalValues[i]);
          return (
            <g key={w.case_id}>
              {isPeak && (
                <circle cx={cx} cy={cy} r="10" fill={dotColor} fillOpacity="0.18" filter="url(#peakGlow)" />
              )}
              <circle
                cx={cx} cy={cy} r={isPeak ? 6 : 4.5}
                fill={dotColor}
                stroke={isPeak ? "#fff" : "#0f172a"}
                strokeWidth={isPeak ? 2 : 1.2}
                filter={isPeak ? "url(#peakGlow)" : undefined}
              />
              {/* Label below */}
              <text
                x={cx} y={H - PAD_B + 14}
                textAnchor="middle" fontSize="8.5" fill="#94a3b8"
                fontFamily="monospace"
              >
                W{i + 1}
              </text>
              {/* Arousal value above dot */}
              <text
                x={cx} y={cy - (isPeak ? 12 : 9)}
                textAnchor="middle" fontSize="8" fill={dotColor}
                fontFamily="monospace" fontWeight="bold"
              >
                {Math.round(arousalValues[i])}%
              </text>
            </g>
          );
        })}

        {/* Peak annotation line */}
        {(() => {
          const px = toX(peakIdx);
          const py = toY(arousalValues[peakIdx]);
          return (
            <g>
              <line
                x1={px} y1={py - 8} x2={px} y2={PAD_T + 2}
                stroke={peakColor} strokeWidth="1" strokeDasharray="3,3" opacity="0.6"
              />
              <rect x={px - 18} y={1} width={36} height={12} rx="3"
                fill={peakColor} fillOpacity="0.18" stroke={peakColor} strokeWidth="0.5" strokeOpacity="0.5"
              />
              <text
                x={px} y={9}
                textAnchor="middle" fontSize="7.5" fill={peakColor}
                fontFamily="monospace" fontWeight="bold" letterSpacing="0.5"
              >
                PEAK
              </text>
            </g>
          );
        })()}

        {/* Y-axis label */}
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

/* ─── Trend Badge ─────────────────────────────────────────────────────────── */
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

/* ─── Main Panel ──────────────────────────────────────────────────────────── */
export default function TrendTrajectoryPanel({
  initialSequenceId = "sam40_sub01_escalation",
}: TrendTrajectoryPanelProps) {
  const [selectedSequenceId, setSelectedSequenceId] = useState<string>(initialSequenceId);
  const [trendData, setTrendData] = useState<TrendAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [revealedChart, setRevealedChart] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setRevealedChart(false);
    try {
      const result = analyzeSequenceTrend(selectedSequenceId);
      setTrendData(result);
    } catch (e) {
      console.error("Failed to analyze trend sequence:", e);
    } finally {
      setIsLoading(false);
      // Animate chart in after short delay for drama
      setTimeout(() => setRevealedChart(true), 200);
    }
  }, [selectedSequenceId]);

  if (!trendData && !isLoading) return null;

  const badge = trendData ? getTrendBadge(trendData.trend_state) : null;
  const seqMeta = trendData?.sequence_metadata;

  const peakWindowIdx = trendData
    ? trendData.windows.reduce(
        (maxI, w, i, arr) => (w.arousal_score > arr[maxI].arousal_score ? i : maxI),
        0
      )
    : 0;

  return (
    <div className="bg-[#090d16] rounded-2xl border border-slate-800 p-5 sm:p-7 space-y-7 shadow-2xl relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-0 right-0 w-96 h-40 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-32 bg-rose-500/4 rounded-full blur-3xl pointer-events-none" />

      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-cyan-950/80 text-cyan-300 border border-cyan-700/50">
              Multi-Window Sequence
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
            Tracks the rate-of-change in cortical arousal across a sequence of EEG windows.
            The chart below shows <strong className="text-slate-200">when arousal peaks</strong>, how steeply it rose,
            and which window carried the dominant signal shift.
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
                {s.same_subject ? "Same-Subject" : "Cross-Cohort"} ({s.source_cases.length}W)
              </button>
            );
          })}
        </div>
      </div>

      {isLoading && (
        <div className="h-48 flex items-center justify-center text-slate-500 text-sm font-mono animate-pulse">
          Computing trend analysis…
        </div>
      )}

      {trendData && badge && seqMeta && (
        <>
          {/* ── Sequence + Trend Badge Row ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                  Active Sequence
                </span>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                  seqMeta.same_subject
                    ? "bg-emerald-950/60 text-emerald-300 border-emerald-800/50"
                    : "bg-purple-950/60 text-purple-300 border-purple-800/50"
                }`}>
                  {seqMeta.same_subject ? "✓ Same Subject" : "⚠ Cross-Cohort"}
                </span>
              </div>
              <h4 className="text-sm font-semibold text-slate-100">{seqMeta.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{seqMeta.description}</p>

              {/* Key stats row */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/60">
                <div className="text-center">
                  <span className="text-[10px] text-slate-500 block font-mono">Windows</span>
                  <span className="font-mono font-bold text-sm text-slate-200">{trendData.windows.length}</span>
                </div>
                <div className="text-center">
                  <span className="text-[10px] text-slate-500 block font-mono">Mean Slope</span>
                  <span className={`font-mono font-bold text-sm ${trendData.mean_slope > 0 ? "text-amber-400" : "text-sky-400"}`}>
                    {trendData.mean_slope > 0 ? "+" : ""}{trendData.mean_slope.toFixed(1)}%
                  </span>
                </div>
                <div className="text-center">
                  <span className="text-[10px] text-slate-500 block font-mono">Acceleration</span>
                  <span className={`font-mono font-bold text-sm ${trendData.second_derivative_acceleration > 0 ? "text-rose-400" : "text-emerald-400"}`}>
                    {trendData.second_derivative_acceleration > 0 ? "+" : ""}{trendData.second_derivative_acceleration.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Trend badge */}
            <div className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 ${badge.containerClass}`}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider opacity-70">
                  Trend State
                </span>
                <span className="flex h-2 w-2 relative">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${badge.dotColor}`} />
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${badge.dotColor}`} />
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  {badge.icon}
                  <span className="text-2xl font-black font-mono tracking-wide">{badge.label}</span>
                </div>
                <p className="text-[11px] mt-2 leading-snug opacity-75">{badge.desc}</p>
              </div>
              <div className="pt-2 border-t border-current/20 text-[11px] font-mono space-y-1">
                <div className="flex justify-between">
                  <span className="opacity-60">Peak at Window:</span>
                  <span className="font-bold">W{peakWindowIdx + 1}</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-60">Peak Arousal:</span>
                  <span className="font-bold">
                    {Math.round(trendData.windows[peakWindowIdx]?.arousal_score * 100)}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ── SVG Arousal Trajectory Chart ── */}
          <div className="bg-slate-900/60 rounded-xl border border-slate-800 p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-200">
                  Arousal Trajectory — {trendData.windows.length} Windows
                </h4>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                Peak annotated · Slope deltas shown
              </span>
            </div>

            <div className={`transition-all duration-700 ${revealedChart ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
              <ArousalSVGChart windows={trendData.windows} transitions={trendData.transitions} />
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-800/60">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" /> Low arousal (≤45%)</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-yellow-400 inline-block" /> Mid arousal (45–70%)</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-orange-400 inline-block" /> High arousal (&gt;70%)</span>
              <span className="flex items-center gap-1.5"><span className="font-bold text-orange-400">▲ / ▼</span> Beta shift slope between windows</span>
            </div>
          </div>

          {/* ── Detailed Window Cards ── */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>Per-Window Detail</span>
              <span className="ml-auto text-[10px] font-mono text-slate-500">Sourced from real benchmark recordings</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
              {trendData.windows.map((win, idx) => {
                const trans = trendData.transitions[idx];
                const arousalPct = Math.round(win.arousal_score * 100);
                const isPeak = idx === peakWindowIdx;
                const arousalColor = arousalPct > 70 ? "text-orange-400" : arousalPct > 45 ? "text-yellow-400" : "text-emerald-400";
                const barColor = arousalPct > 70 ? "bg-orange-400" : arousalPct > 45 ? "bg-yellow-400" : "bg-emerald-400";

                return (
                  <div
                    key={win.case_id}
                    className={`rounded-xl border p-4 space-y-3 flex flex-col justify-between transition-all ${
                      isPeak
                        ? "border-orange-500/50 bg-orange-950/20 shadow-lg shadow-orange-900/10"
                        : "border-slate-800 bg-slate-900/60"
                    }`}
                  >
                    {/* Window header */}
                    <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase">
                          Window {win.window_index + 1}
                        </span>
                        {isPeak && (
                          <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-300 border border-orange-500/30 uppercase">
                            Peak
                          </span>
                        )}
                      </div>
                      <span className="text-[9px] font-mono text-slate-500 truncate max-w-[80px]" title={win.case_id}>
                        {win.case_id.slice(0, 14)}…
                      </span>
                    </div>

                    {/* Source description */}
                    <div>
                      <span className="text-xs font-semibold text-slate-100 block leading-snug">
                        {win.source_label}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 block mt-1">
                        Stage: <strong className="text-slate-200 uppercase">{win.risk_stage}</strong>
                      </span>
                    </div>

                    {/* Metrics grid */}
                    <div className="grid grid-cols-2 gap-2 text-xs bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/60">
                      <div>
                        <span className="text-[9px] text-slate-500 block font-mono">Beta Shift</span>
                        <span className={`font-mono font-bold text-[12px] ${win.beta_deviation_percent > 10 ? "text-amber-400" : "text-slate-300"}`}>
                          {win.beta_deviation_percent > 0 ? `+${win.beta_deviation_percent.toFixed(1)}%` : `${win.beta_deviation_percent.toFixed(1)}%`}
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-500 block font-mono">Beta / Alpha</span>
                        <span className="font-mono font-bold text-[12px] text-slate-200">
                          {win.beta_alpha_ratio.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Arousal bar */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[10px] font-mono">
                        <span className="text-slate-400">Arousal Index</span>
                        <span className={`font-bold ${arousalColor}`}>{arousalPct}%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${barColor}`}
                          style={{ width: `${arousalPct}%` }}
                        />
                      </div>
                    </div>

                    {/* Transition to next window */}
                    {trans && (
                      <div className="pt-2.5 border-t border-slate-800/60 text-[10px] font-mono space-y-1">
                        <div className="flex items-center justify-between text-slate-400">
                          <span>→ Slope to W{idx + 2}:</span>
                          <span className={`font-bold text-[11px] flex items-center gap-0.5 ${trans.delta_beta_deviation > 0 ? "text-amber-300" : "text-sky-300"}`}>
                            {trans.delta_beta_deviation > 0
                              ? <ArrowUpRight className="w-3 h-3" />
                              : <ArrowDownRight className="w-3 h-3" />
                            }
                            {trans.delta_beta_deviation > 0 ? "+" : ""}{trans.delta_beta_deviation.toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-slate-500">
                          <span>Δ Arousal:</span>
                          <span className={`font-bold ${trans.delta_arousal > 0 ? "text-amber-300/80" : "text-sky-300/80"}`}>
                            {trans.delta_arousal > 0 ? "+" : ""}{(trans.delta_arousal * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-slate-500">
                          <span>Rate of Change:</span>
                          <span className="text-slate-300 font-bold">{trans.percent_rate_of_change.toFixed(1)}%</span>
                        </div>
                      </div>
                    )}
                    {!trans && (
                      <div className="pt-2 border-t border-slate-800/60 text-[10px] font-mono text-slate-500 flex items-center gap-1">
                        <FlatLine className="w-3 h-3" /> Terminal window — no further slope
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Rate-of-Change Analysis ── */}
          <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 flex items-start gap-3">
            <Compass className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-100 block text-[11px] uppercase tracking-wider mb-1">
                Derivative & Rate-of-Change Interpretation
              </span>
              <p className="text-slate-400 leading-relaxed text-[11px]">{trendData.trend_description}</p>
            </div>
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
