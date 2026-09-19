"use client";

import React, { useState, useEffect } from "react";
import { 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  AlertTriangle, 
  Layers, 
  Compass, 
  Sliders, 
  ArrowRight,
  Info,
  CheckCircle2
} from "lucide-react";
import { 
  TrendAnalysisResult, 
  SequenceMetadata, 
  TrendState, 
  DEMO_SEQUENCES, 
  analyzeSequenceTrend 
} from "../lib/trend-logic";

interface TrendTrajectoryPanelProps {
  initialSequenceId?: string;
  onClose?: () => void;
}

export default function TrendTrajectoryPanel({
  initialSequenceId = "sam40_sub01_escalation",
  onClose
}: TrendTrajectoryPanelProps) {
  const [selectedSequenceId, setSelectedSequenceId] = useState<string>(initialSequenceId);
  const [trendData, setTrendData] = useState<TrendAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);
    try {
      // Analyze sequence using the verified trend detection logic
      const result = analyzeSequenceTrend(selectedSequenceId);
      setTrendData(result);
    } catch (e) {
      console.error("Failed to analyze trend sequence:", e);
    } finally {
      setIsLoading(false);
    }
  }, [selectedSequenceId]);

  if (!trendData && !isLoading) {
    return null;
  }

  // Trend Badge configuration: visually distinct from single-window risk badge
  const getTrendBadge = (state: TrendState) => {
    switch (state) {
      case "stable":
        return {
          icon: <Minus className="w-4 h-4 text-emerald-400" />,
          label: "STABLE",
          containerClass: "border-emerald-500/50 bg-emerald-950/40 text-emerald-300",
          dotColor: "bg-emerald-400"
        };
      case "rising":
        return {
          icon: <TrendingUp className="w-4 h-4 text-amber-300" />,
          label: "RISING",
          containerClass: "border-yellow-500/50 bg-yellow-950/40 text-yellow-200",
          dotColor: "bg-yellow-400"
        };
      case "escalating":
        return {
          icon: <TrendingUp className="w-4 h-4 text-amber-400 animate-pulse" />,
          label: "ESCALATING",
          containerClass: "border-amber-500/70 bg-amber-950/50 text-amber-200 shadow-amber-900/20",
          dotColor: "bg-amber-400"
        };
      case "peak":
        return {
          icon: <AlertTriangle className="w-4 h-4 text-rose-400" />,
          label: "PEAK",
          containerClass: "border-rose-500/60 bg-rose-950/50 text-rose-200",
          dotColor: "bg-rose-400"
        };
      case "declining":
        return {
          icon: <TrendingDown className="w-4 h-4 text-sky-400" />,
          label: "DECLINING",
          containerClass: "border-sky-500/50 bg-sky-950/40 text-sky-200",
          dotColor: "bg-sky-400"
        };
    }
  };

  const badge = trendData ? getTrendBadge(trendData.trend_state) : null;
  const seqMeta = trendData?.sequence_metadata;

  return (
    <div className="bg-slate-950 rounded-2xl border border-slate-800 p-5 sm:p-7 space-y-6 shadow-2xl relative overflow-hidden">
      {/* Top Ambient Glow */}
      <div className="absolute top-0 right-0 w-96 h-32 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header & Feature Identity */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-cyan-950/80 text-cyan-300 border border-cyan-700/50">
              Multi-Window Sequence Layer
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              Demonstration of Early-Warning Logic (Demonstration)
            </span>
          </div>
          <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2.5">
            <Layers className="w-5 h-5 text-cyan-400 shrink-0" />
            <span>Escalation Pattern &amp; Trend Detection</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Tracks rate-of-change across an ordered sequence of real EEG windows to illustrate
            how multi-window slope changes compare against static single-window thresholds.
          </p>
        </div>

        {/* Sequence Selector Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800">
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

      {trendData && badge && seqMeta && (
        <>
          {/* Active Sequence Banner & Overall Trend Classification Badge */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Sequence Title & Metadata Specs */}
            <div className="lg:col-span-2 bg-slate-900/70 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                  Active Demonstration Sequence
                </span>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                  seqMeta.same_subject 
                    ? "bg-emerald-950/60 text-emerald-300 border-emerald-800/50"
                    : "bg-purple-950/60 text-purple-300 border-purple-800/50"
                }`}>
                  {seqMeta.same_subject ? "✓ Same Research Subject" : "⚠ Cross-Subject / Cross-Cohort"}
                </span>
              </div>
              <h4 className="text-sm font-semibold text-slate-200">
                {seqMeta.title}
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                {seqMeta.description}
              </p>
            </div>

            {/* Distinct Multi-Window Trend Badge */}
            <div className={`p-4 rounded-xl border flex flex-col justify-between space-y-2 ${badge.containerClass}`}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider">
                  Trend State (Demonstration)
                </span>
                <span className="flex h-2 w-2 relative">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${badge.dotColor}`} />
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${badge.dotColor}`} />
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                {badge.icon}
                <span className="text-lg font-bold font-mono tracking-wide">
                  {badge.label}
                </span>
              </div>

              <div className="pt-2 border-t border-current/20 flex items-center justify-between text-[11px] font-mono">
                <span>Mean Slope:</span>
                <span className="font-bold">
                  {trendData.mean_slope > 0 ? `+${trendData.mean_slope.toFixed(1)}%` : `${trendData.mean_slope.toFixed(1)}%`}
                </span>
              </div>
            </div>
          </div>

          {/* Trajectory Timeline: Multi-Point EEG Sequence Visualizer */}
          <div className="space-y-3 bg-slate-900/50 p-4 sm:p-5 rounded-xl border border-slate-800/90">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-200">
                  Sequenced Window Trajectory ({trendData.windows.length} Inferences)
                </h4>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                Sourced strictly from real discrete recording epochs
              </span>
            </div>

            {/* Trajectory Cards along Timeline */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {trendData.windows.map((win, idx) => {
                const trans = trendData.transitions[idx];
                const arousalPct = Math.round(win.arousal_score * 100);
                return (
                  <div key={win.case_id} className="relative group">
                    <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2.5 hover:border-slate-700 transition-all h-full flex flex-col justify-between">
                      {/* Window Header */}
                      <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5">
                        <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase">
                          Window {win.window_index + 1}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">
                          {win.case_id.slice(0, 18)}...
                        </span>
                      </div>

                      {/* State title / source */}
                      <div>
                        <span className="text-xs font-semibold text-slate-200 line-clamp-1 block">
                          {win.source_label}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
                          Stage: <strong className="text-slate-300 uppercase">{win.risk_stage}</strong>
                        </span>
                      </div>

                      {/* Metrics: Beta Deviation & Beta/Alpha Ratio */}
                      <div className="grid grid-cols-2 gap-2 text-xs bg-slate-900/80 p-2 rounded-lg border border-slate-800/60">
                        <div>
                          <span className="text-[9px] text-slate-400 block font-mono">Beta Shift</span>
                          <span className={`font-mono font-bold text-[11px] ${win.beta_deviation_percent > 10 ? "text-amber-400" : "text-slate-300"}`}>
                            {win.beta_deviation_percent > 0 ? `+${win.beta_deviation_percent.toFixed(1)}%` : `${win.beta_deviation_percent.toFixed(1)}%`}
                          </span>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-400 block font-mono">Beta / Alpha</span>
                          <span className="font-mono font-bold text-[11px] text-slate-200">
                            {win.beta_alpha_ratio.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {/* Arousal Indicator Bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-mono text-slate-400">
                          <span>Arousal Index</span>
                          <span className="text-slate-200 font-bold">{arousalPct}%</span>
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-500 ${
                              arousalPct > 70 ? "bg-amber-400" : arousalPct > 40 ? "bg-yellow-400" : "bg-emerald-400"
                            }`} 
                            style={{ width: `${arousalPct}%` }} 
                          />
                        </div>
                      </div>

                      {/* Window-over-Window Transition Metric (if next exists) */}
                      {trans && (
                        <div className="pt-2 border-t border-slate-800/80 text-[10px] font-mono flex items-center justify-between text-slate-400">
                          <span>Next Step Slope:</span>
                          <span className={`font-bold ${trans.delta_beta_deviation > 0 ? "text-amber-300" : "text-sky-300"}`}>
                            {trans.delta_beta_deviation > 0 ? `+${trans.delta_beta_deviation.toFixed(1)}%` : `${trans.delta_beta_deviation.toFixed(1)}%`}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Rate-of-Change Interpretation Summary */}
            <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800/80 text-xs text-slate-300 flex items-start gap-2.5">
              <Compass className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-200 block text-[11px]">
                  Derivative &amp; Rate-of-Change Analysis:
                </span>
                <p className="text-slate-400 mt-0.5 leading-relaxed text-[11px]">
                  {trendData.trend_description}
                </p>
              </div>
            </div>
          </div>

          {/* MANDATORY RESEARCH & REGULATORY DISCLOSURE (Always visible, non-collapsible) */}
          <div className="p-4 rounded-xl border border-amber-500/40 bg-amber-950/30 text-amber-200 text-xs leading-relaxed space-y-1.5 shadow-sm">
            <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider text-[11px]">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
              <span>Mandatory Demonstration Disclosure</span>
            </div>
            <p className="font-mono text-[11.5px] text-amber-100/90 leading-normal">
              {trendData.demonstration_disclosure}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
