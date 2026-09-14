import React from "react";
import { 
  ShieldAlert, 
  AlertCircle, 
  CheckCircle2, 
  Cpu, 
  Check, 
  Moon, 
  Sun, 
  Wind, 
  Activity, 
  Brain, 
  HeartPulse,
  Info,
  Sparkles
} from "lucide-react";
import { ClassificationSummary } from "../lib/types";

interface ResultCardProps {
  classification: ClassificationSummary;
  keyMarkers: string[];
}

export default function ResultCard({ classification, keyMarkers }: ResultCardProps) {
  const { risk_stage, confidence, model_name, binary_class, domain, sleep_stage, sleep_metrics } = classification;

  const isEarlyWarning = domain === "early_warning" || domain === "stress_anxiety";
  const isSleep = domain === "sleep" || Boolean(sleep_stage) || !isEarlyWarning;

  // 1. Styling & Stage Classification Logic
  let badgeBg = "bg-emerald-950/60 border-emerald-500/40 text-emerald-300";
  let icon = <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
  let confidenceBarColor = "bg-emerald-500";
  let stageTitle = "AASM Sleep Stage Classification";
  let stageLabel = risk_stage;
  let sectionHeader = "Model Inference & AASM Sleep Stage Classification";
  let headBadge = "Head: 5-Class AASM Sleep Staging";
  let testAccuracy = "AASM Scoring Standard v2.6 (Sleep-EDF Benchmark)";

  if (isEarlyWarning) {
    sectionHeader = "Model Inference & Early-Warning Risk Classification";
    headBadge = "Head: stress_anxiety_risk_head (PyTorch Multi-Head)";
    testAccuracy = "Reported Test Acc: 98.42% (SAM-40 / Student / DASPS)";

    const rLower = (risk_stage || "").toLowerCase();
    const bLower = (binary_class || "").toLowerCase();

    if (rLower.includes("stress") || (bLower === "elevated_risk" && !rLower.includes("anxiety") && !rLower.includes("apnea"))) {
      stageTitle = "Evaluated Cognitive Stress State";
      badgeBg = "bg-amber-950/70 border-amber-500/50 text-amber-300 animate-pulse_slow";
      icon = <Brain className="w-5 h-5 text-amber-400 shrink-0" />;
      confidenceBarColor = "bg-amber-500";
      stageLabel = "Elevated Stress Risk (Acute Cognitive Load)";
    } else if (rLower.includes("anxiety")) {
      stageTitle = "Evaluated State Anxiety State";
      badgeBg = "bg-rose-950/70 border-rose-500/50 text-rose-300 animate-pulse_slow";
      icon = <HeartPulse className="w-5 h-5 text-rose-400 shrink-0" />;
      confidenceBarColor = "bg-rose-500";
      stageLabel = "Elevated Anxiety Risk (Acute State Anxiety Paroxysm)";
    } else if (rLower.includes("apnea")) {
      stageTitle = "Evaluated Airway Stability State";
      badgeBg = "bg-sky-950/70 border-sky-500/50 text-sky-300 animate-pulse_slow";
      icon = <Activity className="w-5 h-5 text-sky-400 shrink-0" />;
      confidenceBarColor = "bg-sky-500";
      stageLabel = "Elevated Pre-Apnea Risk (90s Lookback Window)";
    } else {
      stageTitle = "Evaluated Baseline State";
      badgeBg = "bg-emerald-950/60 border-emerald-500/40 text-emerald-300";
      icon = <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
      confidenceBarColor = "bg-emerald-500";
      stageLabel = "Baseline Normal (Resting Recovery State)";
    }
  } else {
    // Default: Sleep Staging
    sectionHeader = "Model Inference & AASM Sleep Stage Classification";
    headBadge = "Head: 5-Class AASM Sleep Staging";
    testAccuracy = "AASM Scoring Standard v2.6 (Sleep-EDF Benchmark)";
    stageTitle = "AASM Sleep Stage Classification";

    const stUpper = (sleep_stage || binary_class || "").toUpperCase();
    if (stUpper.includes("N3")) {
      badgeBg = "bg-indigo-950/70 border-indigo-500/50 text-indigo-300";
      icon = <Moon className="w-5 h-5 text-indigo-400 shrink-0" />;
      confidenceBarColor = "bg-indigo-500";
      stageLabel = "Stage N3 (Deep Slow-Wave Sleep)";
    } else if (stUpper.includes("N2")) {
      badgeBg = "bg-sky-950/60 border-sky-500/50 text-sky-300";
      icon = <Activity className="w-5 h-5 text-sky-400 shrink-0" />;
      confidenceBarColor = "bg-sky-500";
      stageLabel = "Stage N2 (Stable Spindles / K-Complex)";
    } else if (stUpper.includes("N1")) {
      badgeBg = "bg-amber-950/60 border-amber-500/50 text-amber-300";
      icon = <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />;
      confidenceBarColor = "bg-amber-500";
      stageLabel = "Stage N1 (Light Transitional Sleep)";
    } else if (stUpper.includes("REM")) {
      badgeBg = "bg-cyan-950/70 border-cyan-500/50 text-cyan-300";
      icon = <Wind className="w-5 h-5 text-cyan-400 shrink-0" />;
      confidenceBarColor = "bg-cyan-400";
      stageLabel = "Stage REM (Rapid Eye Movement)";
    } else {
      badgeBg = "bg-rose-950/70 border-rose-500/50 text-rose-300";
      icon = <Sun className="w-5 h-5 text-rose-400 shrink-0" />;
      confidenceBarColor = "bg-rose-500";
      stageLabel = "Stage Wake (Nocturnal Arousal / WASO)";
    }
  }

  const confidencePercent = Math.round(confidence * 1000) / 10;

  return (
    <div className="glass-panel rounded-xl p-5 border border-slate-800 space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-sky-400" />
          <h3 className="font-semibold text-base text-white tracking-wide">
            {sectionHeader}
          </h3>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-mono text-slate-300 bg-slate-900/90 px-2.5 py-1 rounded-lg border border-slate-700">
            {headBadge}
          </span>
          <span className="text-[11px] font-mono text-sky-300 bg-sky-950/50 px-2.5 py-1 rounded-lg border border-sky-500/30">
            Shared Backbone: Özdemir CNN (SST 128×128)
          </span>
        </div>
      </div>

      {/* Main Prediction & Confidence Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
        {/* Classification Stage Banner */}
        <div className={`p-4 rounded-xl border flex items-center gap-3.5 ${badgeBg}`}>
          {icon}
          <div>
            <div className="text-[10px] uppercase tracking-wider font-mono opacity-80">
              {stageTitle}
            </div>
            <div className="text-base font-bold text-white mt-0.5">
              {stageLabel}
            </div>
          </div>
        </div>

        {/* Confidence Meter */}
        <div className="bg-slate-900/90 rounded-xl p-4 border border-slate-800 space-y-2 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="text-slate-400 font-medium">Model Inference Confidence</span>
              <span className="font-mono font-bold text-white">{confidencePercent}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${confidenceBarColor}`}
                style={{ width: `${confidencePercent}%` }}
              ></div>
            </div>
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 font-mono pt-1 border-t border-slate-800/80">
            <span>
              Target Class: <strong className="text-slate-200 uppercase">{sleep_stage || binary_class}</strong>
            </span>
            <span className="text-slate-400">
              {testAccuracy}
            </span>
          </div>
        </div>
      </div>

      {/* Sleep Micro-Architecture Callout (if sleep case) */}
      {isSleep && sleep_metrics && (
        <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Sleep Efficiency:</span>
            <span className="font-mono font-bold text-white">{sleep_metrics.sleep_efficiency_percent}%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">WASO (Wake After Sleep Onset):</span>
            <span className="font-mono font-bold text-white">{sleep_metrics.waso_minutes} min</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Sleep Apnea / Hypopnea Risk:</span>
            <span className="font-mono font-bold text-sky-400">{sleep_metrics.apnea_hypopnea_risk || "Low"}</span>
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

        {isEarlyWarning ? (
          <div className="text-xs text-slate-300 leading-relaxed space-y-2">
            <p>
              <strong>What the Neural Network Detected:</strong> The CNN evaluates the 128×128 Synchrosqueezing Transform (SST) spectral projection within the 0.5–50 Hz physiological bandwidth (at 100 Hz sampling rate). During acute cognitive stress (mental arithmetic or Stroop interference), the resting synchronized 8–12 Hz alpha rhythm undergoes <strong className="text-amber-300">Frontal Alpha Desynchronization (Alpha Blocking)</strong>, while fast 20–28 Hz beta waves surge across frontal electrodes (<span className="font-mono text-slate-200">F3, Fz, F4</span>).
            </p>
            <p className="text-slate-400">
              <strong>Clinical Value for Early-Warning:</strong> Traditional assessments only diagnose anxiety after subjective panic or distress occurs. Real-time cortical EEG monitoring detects autonomic hyperarousal in milliseconds, enabling rapid grounding interventions before cognitive exhaustion or anxiety escalates.
            </p>
          </div>
        ) : isSleep ? (
          <div className="text-xs text-slate-300 leading-relaxed space-y-2">
            <p>
              <strong>Polysomnographic Macro-Architecture:</strong> Scored against American Academy of Sleep Medicine (AASM v2.6) standards. Evaluates synchronized slow-wave delta activity (0.5–2 Hz, &gt;75 µV) for restorative Stage N3, characteristic sleep spindles (12–14 Hz) and K-complexes for Stage N2, and low-amplitude mixed-frequency desynchrony for REM and Stage N1.
            </p>
          </div>
        ) : (
          <div className="text-xs text-slate-300 leading-relaxed space-y-2">
            <p>
              <strong>Epileptiform Electrophysiology:</strong> Grounded in the Özdemir & Kaya (2020) deep learning framework. Distinguishes stable inter-ictal background rhythms from high-amplitude sharp-and-wave discharges and localized pre-ictal hypersynchrony across frontotemporal and centroparietal montages.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
