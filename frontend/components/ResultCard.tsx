import React, { useState } from "react";
import { 
  CheckCircle2, 
  Cpu, 
  Flame,
  Zap,
  Sparkles
} from "lucide-react";
import { ClassificationSummary } from "../lib/types";
import PlainLanguageSummary from "./PlainLanguageSummary";

interface ResultCardProps {
  classification: ClassificationSummary;
  keyMarkers: string[];
  caseId?: string;
}

export default function ResultCard({ classification, keyMarkers, caseId = "" }: ResultCardProps) {
  const { 
    risk_stage, 
    confidence, 
    binary_class, 
    three_state_class = "baseline",
    detected_state_title,
    stress_metrics,
    signal_quality,
    baseline_comparison = [],
    numerical_band_powers = [],
    temporal_trajectory = [],
    model_validation,
    explainable_reasoning,
    structured_interpretation,
    session_provenance
  } = classification;

  const [viewMode, setViewMode] = useState<"telemetry" | "plain_english">("telemetry");

  // 3-State badge styling
  let stateBadgeBg = "bg-emerald-950/60 border-emerald-500/40 text-emerald-300";
  let stateBadgeLabel = "Baseline State";
  let stateIcon = <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />;
  let confidenceBarColor = "bg-emerald-500";
  let confidenceTextColor = "text-emerald-400";

  if (three_state_class === "high_arousal") {
    stateBadgeBg = "bg-rose-950/60 border-rose-500/50 text-rose-300";
    stateBadgeLabel = "High Arousal";
    stateIcon = <Flame className="w-4 h-4 text-rose-400 shrink-0" />;
    confidenceBarColor = "bg-rose-500";
    confidenceTextColor = "text-rose-400";
  } else if (three_state_class === "rising_arousal") {
    stateBadgeBg = "bg-amber-950/60 border-amber-500/40 text-amber-300";
    stateBadgeLabel = "Rising Arousal";
    stateIcon = <Zap className="w-4 h-4 text-amber-400 shrink-0" />;
    confidenceBarColor = "bg-amber-500";
    confidenceTextColor = "text-amber-400";
  }

  const confidencePercent = (confidence * 100).toFixed(1);
  const qualityScore = signal_quality?.overall_score ?? 95;
  const qualityGrade = signal_quality?.quality_grade ?? "Optimal";

  // Compute total baseline deviation summary
  const betaDev = baseline_comparison.find(b => b.band === "Beta")?.deviation_percent ?? 0;
  const alphaDev = baseline_comparison.find(b => b.band === "Alpha")?.deviation_percent ?? 0;

  return (
    <div className="bg-[#090d16] text-white rounded-2xl p-5 sm:p-6 border border-slate-800 space-y-6 shadow-xl">
      {/* 1. Header Bar with View Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-cyan-400 shrink-0" />
          <h3 className="font-bold text-sm tracking-wide text-white uppercase">
            AI-Assisted EEG State Assessment
          </h3>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Switcher Toggle */}
          <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setViewMode("telemetry")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                viewMode === "telemetry"
                  ? "bg-slate-800 text-white shadow-xs"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>AI Telemetry</span>
            </button>
            <button
              onClick={() => setViewMode("plain_english")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === "plain_english"
                  ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                  : "text-emerald-400 hover:text-emerald-300 hover:bg-slate-800/60"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>✨ Plain-Language Summary</span>
            </button>
          </div>

          <span className={`text-[11px] font-bold px-2.5 py-1.5 rounded-full border uppercase tracking-wider flex items-center gap-1.5 ${stateBadgeBg}`}>
            {stateIcon}
            <span>{stateBadgeLabel}</span>
          </span>
          <span className="text-[10px] font-mono px-2 py-1 rounded bg-slate-900 text-slate-400 border border-slate-800">
            Inference Only
          </span>
        </div>
      </div>

      {/* PLAIN-LANGUAGE PATIENT SUMMARY VIEW */}
      {viewMode === "plain_english" && (
        <PlainLanguageSummary
          classification={classification}
          keyMarkers={keyMarkers}
          caseId={caseId}
          onSwitchToTelemetry={() => setViewMode("telemetry")}
        />
      )}

      {/* TECHNICAL AI TELEMETRY VIEW */}
      {viewMode === "telemetry" && (
        <>
          {/* Quick Access Plain-Language Callout Banner */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/30 via-slate-900 to-emerald-950/20 border border-emerald-500/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 text-xs text-slate-300">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Looking for a simple medical explanation?{" "}
                <strong className="text-white">Learn what the signal detected, what caused it, and what to do.</strong>
              </span>
            </div>
            <button
              onClick={() => setViewMode("plain_english")}
              className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shrink-0 shadow-sm flex items-center gap-1"
            >
              <span>Explain in Plain English</span>
              <span aria-hidden="true">&rarr;</span>
            </button>
          </div>

      {/* Primary Assessment Card: Title & Cognitive vs Anxiety Distinction */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Identified State */}
        <div className="lg:col-span-6 space-y-2">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
            Evaluated Neuroelectric State
          </span>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <h4 className="font-bold text-base sm:text-lg text-white leading-snug">
              {detected_state_title || risk_stage}
            </h4>
            <p className="text-xs text-slate-400">
              Protocol: <strong className="text-slate-200">{session_provenance?.task || "Standard Task Protocol"}</strong>
            </p>

            {/* Workload vs Anxiety Distinction */}
            <div className="pt-2 border-t border-slate-800/80 space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Detected Cognitive State:</span>
                <span className="font-semibold text-sky-300">
                  {stress_metrics?.cognitive_workload_indicator || (three_state_class === "baseline" ? "Nominal Baseline" : "Elevated Workload")}
                </span>
              </div>
              <div className="flex items-start justify-between text-[11px] gap-2">
                <span className="text-slate-400 shrink-0">Anxiety Indicator:</span>
                <span className="text-right text-slate-300 font-mono text-[10px]">
                  {stress_metrics?.anxiety_indicator || "Insufficient evidence from single-modality EEG / requires multimodal telemetry"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Confidence, Signal Quality & Baseline Deviation Triad */}
        <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {/* Model Confidence Score */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex flex-col justify-between">
            <span className="text-[10px] text-slate-400 uppercase font-mono block">
              Model Output
            </span>
            <div className="my-1">
              <span className={`text-xl font-mono font-bold ${confidenceTextColor}`}>
                {confidencePercent}%
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Softmax probability</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className={`h-full ${confidenceBarColor}`} style={{ width: `${confidencePercent}%` }} />
            </div>
          </div>

          {/* Signal Quality Index */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex flex-col justify-between">
            <span className="text-[10px] text-slate-400 uppercase font-mono block">
              Signal Quality
            </span>
            <div className="my-1">
              <span className="text-xl font-mono font-bold text-emerald-400">
                {qualityScore}%
              </span>
              <span className="text-[10px] text-emerald-300 block mt-0.5 font-medium">{qualityGrade} Contact</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500" style={{ width: `${qualityScore}%` }} />
            </div>
          </div>

          {/* Baseline Deviation */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex flex-col justify-between">
            <span className="text-[10px] text-slate-400 uppercase font-mono block">
              Baseline Shift
            </span>
            <div className="my-1">
              <span className={`text-xl font-mono font-bold ${Math.abs(betaDev) > 10 ? "text-amber-400" : "text-slate-300"}`}>
                {betaDev > 0 ? `+${betaDev.toFixed(1)}%` : `${betaDev.toFixed(1)}%`}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Relative Beta shift</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">
              vs. Resting Reference
            </span>
          </div>
        </div>
      </div>
        </>
      )}
    </div>
  );
}

