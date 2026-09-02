import React from "react";
import { ShieldAlert, AlertCircle, CheckCircle2, Cpu, Check, FileCode } from "lucide-react";
import { ClassificationSummary } from "../lib/types";

interface ResultCardProps {
  classification: ClassificationSummary;
  keyMarkers: string[];
}

export default function ResultCard({ classification, keyMarkers }: ResultCardProps) {
  const { risk_stage, confidence, model_name, binary_class } = classification;

  // Determine styling based on risk stage
  let badgeBg = "bg-emerald-950/60 border-emerald-500/40 text-emerald-300";
  let icon = <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
  let confidenceBarColor = "bg-emerald-500";
  let stageLabel = "Low Risk (Baseline / Inter-Ictal)";

  if (risk_stage.toLowerCase().includes("ictal") && !risk_stage.toLowerCase().includes("pre")) {
    badgeBg = "bg-rose-950/70 border-rose-500/50 text-rose-300 animate-pulse_slow";
    icon = <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />;
    confidenceBarColor = "bg-rose-500";
    stageLabel = "High Risk (Active Ictal Seizure)";
  } else if (risk_stage.toLowerCase().includes("pre")) {
    badgeBg = "bg-amber-950/60 border-amber-500/50 text-amber-300";
    icon = <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />;
    confidenceBarColor = "bg-amber-500";
    stageLabel = "Moderate Risk (Pre-Ictal / Transitional)";
  }

  const confidencePercent = Math.round(confidence * 1000) / 10;

  return (
    <div className="glass-panel rounded-xl p-5 border border-slate-800 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-sky-400" />
          <h3 className="font-semibold text-base text-white tracking-wide">
            Model Inference & Risk Classification
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
            Model: {model_name}
          </span>
          <span className="text-[11px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
            CNN (SST 128×128)
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        {/* Risk Stage Banner */}
        <div className={`p-4 rounded-xl border flex items-center gap-3.5 ${badgeBg}`}>
          {icon}
          <div>
            <div className="text-[11px] uppercase tracking-wider font-mono opacity-80">
              Evaluated Seizure Risk Stage
            </div>
            <div className="text-base font-bold text-white mt-0.5">
              {stageLabel}
            </div>
          </div>
        </div>

        {/* Confidence Meter */}
        <div className="bg-slate-900/90 rounded-xl p-4 border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400 font-medium">Model Test Confidence Rating</span>
            <span className="font-mono font-bold text-white">{confidencePercent}%</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${confidenceBarColor}`}
              style={{ width: `${confidencePercent}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>Binary Class: <strong className="text-slate-300 uppercase">{binary_class}</strong></span>
            <span>Reported Test Acc: 99.28%</span>
          </div>
        </div>
      </div>

      {/* Key Signal Markers */}
      <div className="space-y-2 pt-1">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Detected Electrographic Markers
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {keyMarkers.map((marker, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 bg-slate-900/80 px-3 py-2 rounded-lg border border-slate-800 text-xs text-slate-300"
            >
              <Check className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span className="truncate">{marker}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
