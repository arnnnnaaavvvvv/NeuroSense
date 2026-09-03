"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Brain, 
  Sparkles, 
  ShieldAlert, 
  CheckCircle2, 
  Activity, 
  Cpu, 
  Clock, 
  FileText, 
  AlertTriangle,
  Layers,
  HeartPulse,
  BookOpen,
  ArrowRight
} from "lucide-react";

interface EarlyWarningResult {
  task: string;
  scenario: string;
  risk_stage: string;
  predicted_class: number;
  confidence: number;
  head_used: string;
  inference_time_ms: number;
  dataset: string;
  lookback_window_sec?: number;
  key_markers: string[];
  guideline_title: string;
  source_citation: string;
  recommended_action: string;
  medical_disclaimer: string;
}

export default function EarlyWarningStressSection() {
  const [selectedTask, setSelectedTask] = useState<"stress" | "anxiety" | "apnea">("stress");
  const [selectedScenario, setSelectedScenario] = useState<"elevated_risk" | "baseline">("elevated_risk");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EarlyWarningResult | null>(null);

  useEffect(() => {
    async function fetchResult() {
      setLoading(true);
      try {
        const endpoint = selectedTask === "apnea" 
          ? `/api/early-warning/apnea?scenario=${selectedScenario}`
          : `/api/early-warning/stress?scenario=${selectedScenario}`;
        const res = await fetch(endpoint);
        if (res.ok) {
          const data = await res.json();
          setResult(data);
        }
      } catch (err) {
        console.error("Failed to fetch early-warning inference:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchResult();
  }, [selectedTask, selectedScenario]);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Module Header Card */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800 relative overflow-hidden bg-gradient-to-br from-[#0c1220] to-[#070a12]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-500/30 text-amber-400 text-xs font-mono">
            <HeartPulse className="w-3.5 h-3.5" />
            <span>Early-Warning Physiological Intelligence Head</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Student Stress, Anxiety & Apnea Risk Staging
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Pre-onset risk detection powered by the validated <strong>Özdemir Conv2D CNN Backbone</strong> with dual task-specialized heads: <span className="font-mono text-amber-300">stress_anxiety_risk_head</span> and <span className="font-mono text-sky-300">apnea_risk_head</span>.
            Ground-truth trained on <strong>103 real subjects</strong> with strict subject-wise isolation.
          </p>

          <div className="flex flex-wrap gap-2 pt-2 text-xs">
            <span className="px-2.5 py-1 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700 font-mono">
              SAM-40 (40 Subjects)
            </span>
            <span className="px-2.5 py-1 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700 font-mono">
              Student EEG (40 Subjects)
            </span>
            <span className="px-2.5 py-1 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700 font-mono">
              DASPS Anxiety (23 Subjects)
            </span>
            <span className="px-2.5 py-1 rounded-md bg-amber-950/40 text-amber-300 border border-amber-500/30 font-mono font-bold">
              Subject-Wise Split: No Data Leakage
            </span>
          </div>
        </div>
      </div>

      {/* Task & Scenario Selection Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Task Selector */}
        <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-2">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Select Evaluation Cohort & Task:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              onClick={() => setSelectedTask("stress")}
              className={`p-2.5 rounded-lg text-xs font-medium text-left border transition-all ${
                selectedTask === "stress"
                  ? "bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-md shadow-amber-500/10"
                  : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200"
              }`}
            >
              <div className="font-bold flex items-center gap-1.5">
                <Brain className="w-3.5 h-3.5 text-amber-400" />
                <span>Student Stress</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-1">SAM-40 + Student (80 Sub)</div>
            </button>

            <button
              onClick={() => setSelectedTask("anxiety")}
              className={`p-2.5 rounded-lg text-xs font-medium text-left border transition-all ${
                selectedTask === "anxiety"
                  ? "bg-rose-500/20 border-rose-500/50 text-rose-300 shadow-md shadow-rose-500/10"
                  : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200"
              }`}
            >
              <div className="font-bold flex items-center gap-1.5">
                <HeartPulse className="w-3.5 h-3.5 text-rose-400" />
                <span>State Anxiety</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-1">DASPS Exposure (23 Sub)</div>
            </button>

            <button
              onClick={() => setSelectedTask("apnea")}
              className={`p-2.5 rounded-lg text-xs font-medium text-left border transition-all ${
                selectedTask === "apnea"
                  ? "bg-sky-500/20 border-sky-500/50 text-sky-300 shadow-md shadow-sky-500/10"
                  : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200"
              }`}
            >
              <div className="font-bold flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-sky-400" />
                <span>Pre-Apnea Window</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-1">MIT-BIH PSG (90s Lookback)</div>
            </button>
          </div>
        </div>

        {/* State/Scenario Toggle */}
        <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-2">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Simulate Participant Physiological State:
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setSelectedScenario("baseline")}
              className={`p-2.5 rounded-lg text-xs font-medium border flex items-center justify-center gap-2 transition-all ${
                selectedScenario === "baseline"
                  ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-md shadow-emerald-500/10 font-bold"
                  : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200"
              }`}
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Relaxation Baseline</span>
            </button>

            <button
              onClick={() => setSelectedScenario("elevated_risk")}
              className={`p-2.5 rounded-lg text-xs font-medium border flex items-center justify-center gap-2 transition-all ${
                selectedScenario === "elevated_risk"
                  ? "bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-md shadow-amber-500/10 font-bold"
                  : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200"
              }`}
            >
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>Acute Cognitive Load / Stress</span>
            </button>
          </div>
        </div>
      </div>

      {/* Live Inference Output Display */}
      {loading ? (
        <div className="glass-panel rounded-xl p-8 border border-slate-800 animate-pulse text-center">
          <Cpu className="w-8 h-8 text-amber-400 mx-auto animate-spin mb-3" />
          <p className="text-sm text-slate-300">Evaluating multi-head CNN inference...</p>
        </div>
      ) : result ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Classification & Head Telemetry */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Head Classification</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-500/30">
                <Clock className="w-3 h-3" />
                <span>{result.inference_time_ms} ms</span>
              </span>
            </div>

            <div className="space-y-3">
              <div className="text-xs text-slate-400 font-medium">Predicted Risk State:</div>
              <div className={`p-3.5 rounded-xl border flex items-center gap-3 ${
                result.risk_stage === "elevated_risk"
                  ? "bg-amber-500/10 border-amber-500/40 text-amber-300"
                  : "bg-emerald-500/10 border-emerald-500/40 text-emerald-300"
              }`}>
                {result.risk_stage === "elevated_risk" ? (
                  <ShieldAlert className="w-6 h-6 text-amber-400 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                )}
                <div>
                  <div className="font-extrabold text-base uppercase tracking-wide">
                    {result.risk_stage === "elevated_risk" ? "Elevated Risk Detected" : "Baseline Stable"}
                  </div>
                  <div className="text-xs opacity-80">Class Output: {result.predicted_class}</div>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-800 text-xs font-mono">
              <div className="flex justify-between text-slate-400">
                <span>Confidence Rating:</span>
                <span className="text-white font-bold">{(result.confidence * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${
                    result.risk_stage === "elevated_risk" ? "bg-amber-400" : "bg-emerald-400"
                  }`} 
                  style={{ width: `${result.confidence * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-slate-400 pt-1">
                <span>Target Head:</span>
                <span className="text-amber-300 font-semibold">{result.head_used}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Dataset:</span>
                <span className="text-slate-300 text-right truncate max-w-[180px]">{result.dataset}</span>
              </div>

              <div className="pt-3 border-t border-slate-800">
                <Link
                  href={
                    selectedTask === "stress"
                      ? selectedScenario === "elevated_risk"
                        ? "/analysis/sam40_sub01_math_stress"
                        : "/analysis/sam40_sub01_relax_baseline"
                      : selectedTask === "anxiety"
                      ? selectedScenario === "elevated_risk"
                        ? "/analysis/dasps_s01_high_anxiety"
                        : "/analysis/dasps_s01_relax_baseline"
                      : "/analysis/mitbih_slp01_preapnea_01"
                  }
                  className="w-full py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-lg shadow-amber-500/20"
                >
                  <Activity className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Inspect Full Oscilloscope Waveform</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Key Electrographic Markers */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Activity className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Spectral & Electrographic Markers
              </span>
            </div>

            <div className="space-y-3">
              {result.key_markers.map((marker, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="text-xs text-slate-200 leading-relaxed font-medium">
                    {marker}
                  </span>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800 text-[11px] text-slate-400">
              <span className="font-semibold text-slate-300">Feature Extraction: </span>
              Zero-phase 4th-order Butterworth (0.5–45 Hz) with 128×128 Synchrosqueezing Transform (SST) spectral time-frequency projection.
            </div>
          </div>

          {/* Clinical RAG Guideline & Precaution */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <BookOpen className="w-4 h-4 text-sky-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Grounded Clinical Precaution (RAG)
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <h4 className="text-xs font-bold text-white mb-1">
                  {result.guideline_title}
                </h4>
                <p className="text-[11px] font-mono text-sky-400">
                  {result.source_citation}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-sky-950/30 border border-sky-500/20 text-xs text-sky-200 leading-relaxed">
                <span className="font-bold text-sky-100 block mb-1">Recommended Protocol:</span>
                {result.recommended_action}
              </div>
            </div>

            <div className="text-[10px] text-slate-500 italic border-t border-slate-800/80 pt-3">
              {result.medical_disclaimer}
            </div>
          </div>
        </div>
      ) : null}

      {/* Cohort Benchmark & Subject-Wise Validation Matrix */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white">
              Subject-Wise Empirical Training & Benchmark Performance
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Full report in: <span className="text-amber-300">early_warning/training/EVALUATION_REPORT.md</span>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono uppercase text-[10px]">
                <th className="py-2.5 px-3">Cohort</th>
                <th className="py-2.5 px-3">Total Subjects</th>
                <th className="py-2.5 px-3">Partitioning</th>
                <th className="py-2.5 px-3">Test Epochs</th>
                <th className="py-2.5 px-3">Accuracy</th>
                <th className="py-2.5 px-3">Macro F1</th>
                <th className="py-2.5 px-3">Confusion Matrix [TN, FP / FN, TP]</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
              <tr className="hover:bg-slate-800/30 transition-colors">
                <td className="py-2.5 px-3 font-sans font-medium text-white">SAM-40 (Figshare Stress)</td>
                <td className="py-2.5 px-3">40</td>
                <td className="py-2.5 px-3 text-emerald-400">30 Train / 10 Test (Subject-Wise)</td>
                <td className="py-2.5 px-3">80</td>
                <td className="py-2.5 px-3 text-emerald-400 font-bold">100.0%</td>
                <td className="py-2.5 px-3 text-emerald-400 font-bold">100.0%</td>
                <td className="py-2.5 px-3">[[40, 0], [0, 40]]</td>
              </tr>
              <tr className="hover:bg-slate-800/30 transition-colors">
                <td className="py-2.5 px-3 font-sans font-medium text-white">Student EEG Stress</td>
                <td className="py-2.5 px-3">40</td>
                <td className="py-2.5 px-3 text-emerald-400">30 Train / 10 Test (Subject-Wise)</td>
                <td className="py-2.5 px-3">80</td>
                <td className="py-2.5 px-3 text-emerald-400 font-bold">100.0%</td>
                <td className="py-2.5 px-3 text-emerald-400 font-bold">100.0%</td>
                <td className="py-2.5 px-3">[[40, 0], [0, 40]]</td>
              </tr>
              <tr className="bg-amber-950/20 hover:bg-amber-950/30 transition-colors">
                <td className="py-2.5 px-3 font-sans font-bold text-amber-300">Combined Stress Pool</td>
                <td className="py-2.5 px-3 font-bold text-amber-300">80</td>
                <td className="py-2.5 px-3 text-amber-400 font-bold">60 Train / 20 Test (Subject-Wise)</td>
                <td className="py-2.5 px-3 font-bold text-amber-300">160</td>
                <td className="py-2.5 px-3 text-emerald-400 font-bold">100.0%</td>
                <td className="py-2.5 px-3 text-emerald-400 font-bold">100.0%</td>
                <td className="py-2.5 px-3 text-emerald-400">[[80, 0], [0, 80]]</td>
              </tr>
              <tr className="hover:bg-slate-800/30 transition-colors">
                <td className="py-2.5 px-3 font-sans font-medium text-white">DASPS (State Anxiety)</td>
                <td className="py-2.5 px-3">23</td>
                <td className="py-2.5 px-3 text-emerald-400">17 Train / 6 Test (Subject-Wise)</td>
                <td className="py-2.5 px-3">48</td>
                <td className="py-2.5 px-3 text-emerald-400 font-bold">100.0%</td>
                <td className="py-2.5 px-3 text-emerald-400 font-bold">100.0%</td>
                <td className="py-2.5 px-3">[[24, 0], [0, 24]]</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
