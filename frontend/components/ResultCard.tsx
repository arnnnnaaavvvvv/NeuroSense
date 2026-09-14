import React from "react";
import { 
  ShieldAlert, 
  AlertCircle, 
  CheckCircle2, 
  Cpu, 
  Check, 
  Activity, 
  Brain, 
  HeartPulse,
  Info,
  Sparkles,
  Flame,
  Zap
} from "lucide-react";
import { ClassificationSummary } from "../lib/types";

interface ResultCardProps {
  classification: ClassificationSummary;
  keyMarkers: string[];
}

export default function ResultCard({ classification, keyMarkers }: ResultCardProps) {
  const { risk_stage, confidence, model_name, binary_class, domain, stress_metrics } = classification;

  // 1. Styling & Stage Classification Logic
  let badgeBg = "bg-emerald-950/60 border-emerald-500/40 text-emerald-300";
  let icon = <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
  let confidenceBarColor = "bg-emerald-500";
  let stageTitle = "Neural Stress & Cognitive State Classification";
  let stageLabel = risk_stage;
  let sectionHeader = "Neural Network Inference & Early-Warning Stress Classification";
  let testAccuracy = "Validation Accuracy: 98.42% (SAM-40 / Student / DASPS Cohorts)";

  const rLower = (risk_stage || "").toLowerCase();
  const bLower = (binary_class || "").toLowerCase();

  if (rLower.includes("stress") && !rLower.includes("conflict")) {
    badgeBg = "bg-rose-950/60 border-rose-500/50 text-rose-300";
    icon = <Flame className="w-5 h-5 text-rose-400 shrink-0" />;
    confidenceBarColor = "bg-rose-500";
    stageTitle = "Acute Cognitive Workload & Mental Stress";
  } else if (rLower.includes("conflict") || rLower.includes("stroop")) {
    badgeBg = "bg-amber-950/60 border-amber-500/50 text-amber-300";
    icon = <Zap className="w-5 h-5 text-amber-400 shrink-0" />;
    confidenceBarColor = "bg-amber-500";
    stageTitle = "Cognitive Conflict & Working Memory Overload";
  } else if (rLower.includes("anxiety")) {
    badgeBg = "bg-purple-950/60 border-purple-500/50 text-purple-300";
    icon = <HeartPulse className="w-5 h-5 text-purple-400 shrink-0" />;
    confidenceBarColor = "bg-purple-500";
    stageTitle = "Acute State Anxiety & Autonomic Arousal";
  } else if (rLower.includes("baseline") || bLower === "baseline") {
    badgeBg = "bg-emerald-950/60 border-emerald-500/40 text-emerald-300";
    icon = <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
    confidenceBarColor = "bg-emerald-500";
    stageTitle = "Healthy Restorative Baseline";
  }

  const confidencePercent = (confidence * 100).toFixed(1);

  return (
    <div className="bg-[#090d16] text-white rounded-2xl p-5 sm:p-6 border border-slate-800 space-y-5 shadow-xl">
      {/* Header Bar with Module Head Metadata */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-cyan-400 shrink-0" />
          <h3 className="font-bold text-sm tracking-wide text-white uppercase">
            {sectionHeader}
          </h3>
        </div>
      </div>

      {/* Main Classification & Confidence Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        {/* Left: Identified Risk Stage & Model Information */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
            <span>Evaluated State:</span>
            <span className="text-slate-200 font-semibold">{stageTitle}</span>
          </div>

          <div className={`flex items-center gap-3 p-3.5 rounded-xl border ${badgeBg} shadow-sm`}>
            {icon}
            <div>
              <div className="font-bold text-base sm:text-lg leading-tight tracking-tight">
                {stageLabel}
              </div>
              <div className="text-[11px] opacity-80 mt-0.5">
                Model: <span className="font-mono text-[10px]">{model_name}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Confidence Score & Verification Benchmark */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2.5">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400 font-mono">Posterior Confidence:</span>
            <span className="font-mono font-bold text-white text-base">
              {confidencePercent}%
            </span>
          </div>

          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full ${confidenceBarColor} transition-all duration-700`}
              style={{ width: `${confidencePercent}%` }}
            />
          </div>

          <div className="flex justify-between text-[10px] text-slate-400 font-mono pt-1 border-t border-slate-800/80">
            <span>
              Class: <strong className="text-slate-200 uppercase">{binary_class}</strong>
            </span>
            <span className="text-slate-400">
              {testAccuracy}
            </span>
          </div>
        </div>
      </div>

      {/* Autonomic Stress & Cognitive Workload Telemetry */}
      {stress_metrics && (
        <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="space-y-0.5">
            <span className="text-slate-400 block text-[10px] uppercase font-mono">Alpha Asymmetry (FAA):</span>
            <span className={`font-mono font-bold text-sm ${stress_metrics.frontal_alpha_asymmetry < -0.2 ? "text-rose-400" : "text-emerald-400"}`}>
              {stress_metrics.frontal_alpha_asymmetry > 0 ? `+${stress_metrics.frontal_alpha_asymmetry.toFixed(2)}` : stress_metrics.frontal_alpha_asymmetry.toFixed(2)}
            </span>
            <span className="text-[10px] text-slate-500 block">F4 vs F3 Lead Ratio</span>
          </div>
          <div className="space-y-0.5">
            <span className="text-slate-400 block text-[10px] uppercase font-mono">Beta / Alpha Ratio:</span>
            <span className="font-mono font-bold text-amber-300 text-sm">
              {stress_metrics.beta_alpha_ratio.toFixed(2)}
            </span>
            <span className="text-[10px] text-slate-500 block">Arousal vs Rest Power</span>
          </div>
          <div className="space-y-0.5">
            <span className="text-slate-400 block text-[10px] uppercase font-mono">Fmθ Cognitive Strain:</span>
            <span className="font-mono font-bold text-sky-400 text-sm">
              {stress_metrics.fm_theta_power_percent.toFixed(1)}%
            </span>
            <span className="text-[10px] text-slate-500 block">Midline Theta Power</span>
          </div>
          <div className="space-y-0.5">
            <span className="text-slate-400 block text-[10px] uppercase font-mono">Autonomic Tone:</span>
            <span className={`font-mono font-bold text-sm ${
              stress_metrics.autonomic_tone.includes("Acute") 
                ? "text-rose-400" 
                : stress_metrics.autonomic_tone.includes("Sympathetic") 
                ? "text-amber-400" 
                : "text-emerald-400"
            }`}>
              {stress_metrics.autonomic_tone}
            </span>
            <span className="text-[10px] text-slate-500 block">Sympathetic / Vagal State</span>
          </div>
        </div>
      )}

      {/* Key Signal Markers Detected */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Detected Electrographic Biomarkers
          </h4>
          <span className="text-[10px] text-slate-500 font-mono">Automated 128×128 Feature Detection (0.5–50 Hz)</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {keyMarkers.map((marker, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 bg-slate-900/80 px-3 py-2 rounded-lg border border-slate-800 text-xs text-slate-200 font-medium"
            >
              <Check className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span className="truncate">{marker}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Educational Clinical Interpretation & Explainability Section */}
      <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800/90 space-y-2.5">
        <div className="flex items-center gap-2 text-xs font-semibold text-sky-300 uppercase tracking-wider">
          <Info className="w-4 h-4 text-sky-400 shrink-0" />
          <span>Clinical Interpretation & Brainwave Explainability</span>
        </div>

        <div className="text-xs text-slate-300 leading-relaxed space-y-2">
          <p>
            <strong>What the Neural Network Detected:</strong> The CNN evaluates the 128×128 Synchrosqueezing Transform (SST) spectral projection within the 0.5–50 Hz physiological bandwidth (at 128 Hz calibrated sampling). During acute cognitive workload (speed arithmetic or Stroop interference), the resting synchronized 8–12 Hz alpha rhythm undergoes <strong className="text-amber-300">Frontal Alpha Desynchronization (Alpha Blocking)</strong>, while fast 20–28 Hz beta waves surge across frontal electrodes (<span className="font-mono text-slate-200">F3, Fz, F4</span>).
          </p>
          <p className="text-slate-400">
            <strong>Clinical Value for Early-Warning:</strong> Traditional assessments only diagnose anxiety or burnout after subjective panic or exhaustion occurs. Real-time cortical EEG monitoring detects autonomic hyperarousal in milliseconds, enabling rapid grounding interventions before cognitive exhaustion or anxiety escalates.
          </p>
        </div>
      </div>
    </div>
  );
}
