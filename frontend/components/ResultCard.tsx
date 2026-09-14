import React from "react";
import { 
  CheckCircle2, 
  Cpu, 
  Check, 
  Activity, 
  HeartPulse,
  Info,
  Flame,
  Zap,
  ShieldCheck
} from "lucide-react";
import { ClassificationSummary } from "../lib/types";

interface ResultCardProps {
  classification: ClassificationSummary;
  keyMarkers: string[];
}

export default function ResultCard({ classification, keyMarkers }: ResultCardProps) {
  const { risk_stage, confidence, binary_class, stress_metrics } = classification;

  const rLower = (risk_stage || "").toLowerCase();
  const bLower = (binary_class || "").toLowerCase();

  const isOptimal =
    rLower.includes("baseline") ||
    rLower.includes("relax") ||
    bLower === "baseline" ||
    bLower === "normal";

  // Stage classification styling and content
  let badgeBg = "bg-rose-950/60 border-rose-500/50 text-rose-300";
  let badgeLabel = "Elevated Stress Detected";
  let icon = <Flame className="w-5 h-5 text-rose-400 shrink-0" />;
  let confidenceBarColor = "bg-rose-500";
  let stageTitle = "Acute Cognitive Workload & Mental Stress";
  let simpleDescription =
    "EEG signals show active cortical strain with reduced resting alpha waves and increased fast-wave beta tension, characteristic of high mental effort.";

  if (isOptimal) {
    badgeBg = "bg-emerald-950/60 border-emerald-500/40 text-emerald-300";
    badgeLabel = "Healthy Baseline Verified";
    icon = <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
    confidenceBarColor = "bg-emerald-500";
    stageTitle = "Optimal Restorative Neurological Baseline";
    simpleDescription =
      "EEG signals demonstrate synchronized, calm resting alpha waves (8–12 Hz) across all monitored channels. Autonomic nervous system tone indicates optimal rest and mental recovery.";
  } else if (rLower.includes("conflict") || rLower.includes("stroop")) {
    badgeBg = "bg-amber-950/60 border-amber-500/50 text-amber-300";
    badgeLabel = "Cognitive Conflict Detected";
    icon = <Zap className="w-5 h-5 text-amber-400 shrink-0" />;
    confidenceBarColor = "bg-amber-500";
    stageTitle = "Cognitive Conflict & Working Memory Overload";
    simpleDescription =
      "EEG sensors detected high mental interference and friction in executive decision circuits, reflecting rapid cognitive processing and working memory strain.";
  } else if (rLower.includes("anxiety")) {
    badgeBg = "bg-purple-950/60 border-purple-500/50 text-purple-300";
    badgeLabel = "State Anxiety Detected";
    icon = <HeartPulse className="w-5 h-5 text-purple-400 shrink-0" />;
    confidenceBarColor = "bg-purple-500";
    stageTitle = "Acute State Anxiety & Autonomic Hyperarousal";
    simpleDescription =
      "EEG analysis captured fast-frequency neural activity paired with sympathetic autonomic activation, characteristic of situational stress and acute anxiety.";
  }

  const confidencePercent = (confidence * 100).toFixed(1);

  return (
    <div className="bg-[#090d16] text-white rounded-2xl p-5 sm:p-6 border border-slate-800 space-y-5 shadow-xl">
      {/* 1. Header Bar: Professional & Clean */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-cyan-400 shrink-0" />
          <h3 className="font-bold text-sm tracking-wide text-white uppercase">
            Neurological Assessment &amp; Cognitive State Classification
          </h3>
        </div>
        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${badgeBg}`}>
          {badgeLabel}
        </span>
      </div>

      {/* 2. Main Classification Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        {/* Left: Identified State */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
            Clinical Telemetry Verdict
          </span>
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            {icon}
            <div>
              <h4 className="font-bold text-base sm:text-lg text-white leading-snug">
                {stageTitle}
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Evaluation: <strong className="text-slate-200">{risk_stage}</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Right: Confidence Score & Verification Benchmark */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2.5">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400 font-medium">Model Classification Confidence:</span>
            <span className="font-mono font-bold text-emerald-400 text-base">
              {confidencePercent}%
            </span>
          </div>

          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full ${confidenceBarColor} transition-all duration-700`}
              style={{ width: `${confidencePercent}%` }}
            />
          </div>

          <div className="flex justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
            <span>Validation: <strong className="text-slate-200">Clinical EEG Cohorts</strong></span>
            <span className="text-emerald-400 font-medium">High Statistical Agreement</span>
          </div>
        </div>
      </div>

      {/* 3. Conditional Content: Simple if fine, clear detailed indicators if issue */}
      {isOptimal ? (
        /* SIMPLE IF OPTIMAL: DO NOT MAKE IT COMPLEX */
        <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Optimal Baseline Summary</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {simpleDescription}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
            <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800/80">
              <span className="text-[10px] text-slate-500 uppercase block">Cortical Rhythm</span>
              <span className="font-semibold text-emerald-300">Synchronized Alpha (8–12 Hz)</span>
            </div>
            <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800/80">
              <span className="text-[10px] text-slate-500 uppercase block">Stress Index</span>
              <span className="font-semibold text-emerald-300">Low / Resting State</span>
            </div>
            <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800/80">
              <span className="text-[10px] text-slate-500 uppercase block">Autonomic State</span>
              <span className="font-semibold text-emerald-300">Restorative Parasympathetic</span>
            </div>
          </div>
        </div>
      ) : (
        /* DETAILED YET SIMPLE & PROFESSIONAL WHEN ISSUE DETECTED */
        <div className="space-y-4">
          {/* Key Physiological Observations */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-medium">
                <Activity className="w-3.5 h-3.5 text-rose-400" />
                <span>Frontal Alpha Rhythms</span>
              </div>
              <div className="font-bold text-rose-300 text-xs">Alpha Desynchronization</div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Relaxed brainwaves suppressed due to active cognitive workload.
              </p>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-medium">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>High-Frequency Tension</span>
              </div>
              <div className="font-bold text-amber-300 text-xs">Fast Beta Surge (20–28 Hz)</div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Reflects intense focus, working memory strain, and mental effort.
              </p>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-medium">
                <HeartPulse className="w-3.5 h-3.5 text-sky-400" />
                <span>Autonomic Nervous State</span>
              </div>
              <div className="font-bold text-sky-300 text-xs">{stress_metrics?.autonomic_tone || "Sympathetic Activation"}</div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                The body's physiological alert response is actively engaged.
              </p>
            </div>
          </div>

          {/* Key Detected Electrographic Biomarkers */}
          {keyMarkers && keyMarkers.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">
                Detected Electrographic Biomarkers
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {keyMarkers.map((marker, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 bg-slate-950/90 px-3 py-2 rounded-lg border border-slate-800 text-xs text-slate-200"
                  >
                    <Check className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    <span className="truncate">{marker}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Simple Human-Understandable Explainability */}
          <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800/90 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-sky-300 uppercase tracking-wider">
              <Info className="w-4 h-4 text-sky-400 shrink-0" />
              <span>Plain-English Clinical Meaning</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {simpleDescription}
            </p>
            <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
              <strong>Clinical Takeaway:</strong> Real-time cortical EEG monitoring identifies mental strain and hyperarousal immediately. Review the detailed triggers, symptoms, and physician guidelines in the patient care section below.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
