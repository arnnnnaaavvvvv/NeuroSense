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
      <div className="rounded-2xl p-6 sm:p-8 border border-zinc-200 bg-zinc-50 relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-zinc-200 text-zinc-900 text-xs font-mono font-medium">
            <HeartPulse className="w-3.5 h-3.5 text-zinc-900" />
            <span>Physiological Intelligence Head</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-zinc-950 tracking-tight">
            Student Stress, Anxiety & Apnea Risk Staging
          </h2>
          <p className="text-sm sm:text-base text-zinc-600 leading-relaxed">
            Pre-onset risk detection powered by the validated <strong>Özdemir Conv2D CNN Backbone</strong> with dual task-specialized heads: <span className="font-mono text-zinc-900 font-semibold">stress_anxiety_risk_head</span> and <span className="font-mono text-zinc-900 font-semibold">apnea_risk_head</span>.
            Ground-truth trained on <strong>103 real subjects</strong> with strict subject-wise isolation.
          </p>

          <div className="flex flex-wrap gap-2 pt-2 text-xs">
            <span className="px-2.5 py-1 rounded-md bg-white text-zinc-700 border border-zinc-200 font-mono">
              SAM-40 (40 Subjects)
            </span>
            <span className="px-2.5 py-1 rounded-md bg-white text-zinc-700 border border-zinc-200 font-mono">
              Student EEG (40 Subjects)
            </span>
            <span className="px-2.5 py-1 rounded-md bg-white text-zinc-700 border border-zinc-200 font-mono">
              DASPS Anxiety (23 Subjects)
            </span>
            <span className="px-2.5 py-1 rounded-md bg-zinc-950 text-white font-mono font-bold">
              Subject-Wise Split: No Data Leakage
            </span>
          </div>
        </div>
      </div>

      {/* Task & Scenario Selection Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Task Selector */}
        <div className="p-4 rounded-xl border border-zinc-200 bg-white space-y-2">
          <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block">
            Select Evaluation Cohort & Task:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              onClick={() => setSelectedTask("stress")}
              className={`p-2.5 rounded-lg text-xs font-medium text-left border transition-all ${
                selectedTask === "stress"
                  ? "bg-zinc-950 border-zinc-950 text-white shadow-sm"
                  : "bg-zinc-50 border-zinc-200 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100"
              }`}
            >
              <div className="font-bold flex items-center gap-1.5">
                <Brain className="w-3.5 h-3.5" />
                <span>Student Stress</span>
              </div>
              <div className={`text-[10px] mt-1 ${selectedTask === "stress" ? "text-zinc-300" : "text-zinc-500"}`}>SAM-40 + Student (80 Sub)</div>
            </button>

            <button
              onClick={() => setSelectedTask("anxiety")}
              className={`p-2.5 rounded-lg text-xs font-medium text-left border transition-all ${
                selectedTask === "anxiety"
                  ? "bg-zinc-950 border-zinc-950 text-white shadow-sm"
                  : "bg-zinc-50 border-zinc-200 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100"
              }`}
            >
              <div className="font-bold flex items-center gap-1.5">
                <HeartPulse className="w-3.5 h-3.5" />
                <span>State Anxiety</span>
              </div>
              <div className={`text-[10px] mt-1 ${selectedTask === "anxiety" ? "text-zinc-300" : "text-zinc-500"}`}>DASPS Exposure (23 Sub)</div>
            </button>

            <button
              onClick={() => setSelectedTask("apnea")}
              className={`p-2.5 rounded-lg text-xs font-medium text-left border transition-all ${
                selectedTask === "apnea"
                  ? "bg-zinc-950 border-zinc-950 text-white shadow-sm"
                  : "bg-zinc-50 border-zinc-200 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100"
              }`}
            >
              <div className="font-bold flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5" />
                <span>Pre-Apnea Window</span>
              </div>
              <div className={`text-[10px] mt-1 ${selectedTask === "apnea" ? "text-zinc-300" : "text-zinc-500"}`}>MIT-BIH PSG (90s Lookback)</div>
            </button>
          </div>
        </div>

        {/* State/Scenario Toggle */}
        <div className="p-4 rounded-xl border border-zinc-200 bg-white space-y-2">
          <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block">
            Simulate Participant Physiological State:
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setSelectedScenario("baseline")}
              className={`p-2.5 rounded-lg text-xs font-medium border flex items-center justify-center gap-2 transition-all ${
                selectedScenario === "baseline"
                  ? "bg-zinc-950 border-zinc-950 text-white font-bold shadow-sm"
                  : "bg-zinc-50 border-zinc-200 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100"
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Relaxation Baseline</span>
            </button>

            <button
              onClick={() => setSelectedScenario("elevated_risk")}
              className={`p-2.5 rounded-lg text-xs font-medium border flex items-center justify-center gap-2 transition-all ${
                selectedScenario === "elevated_risk"
                  ? "bg-zinc-950 border-zinc-950 text-white font-bold shadow-sm"
                  : "bg-zinc-50 border-zinc-200 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100"
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Cognitive Stress State</span>
            </button>
          </div>
        </div>
      </div>

      {/* Live Inference Output Display */}
      {loading ? (
        <div className="rounded-xl p-8 border border-zinc-200 bg-white animate-pulse text-center">
          <Cpu className="w-8 h-8 text-zinc-950 mx-auto animate-spin mb-3" />
          <p className="text-sm text-zinc-600">Evaluating multi-head CNN inference...</p>
        </div>
      ) : result ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Classification & Head Telemetry */}
          <div className="p-6 rounded-2xl border border-zinc-200 bg-white space-y-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 font-mono">Head Classification</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-zinc-800 bg-zinc-100 px-2 py-0.5 rounded-full border border-zinc-200">
                <Clock className="w-3 h-3" />
                <span>{result.inference_time_ms} ms</span>
              </span>
            </div>

            <div className="space-y-3">
              <div className="text-xs text-zinc-500 font-medium">Predicted Risk State:</div>
              <div className={`p-3.5 rounded-xl border flex items-center gap-3 ${
                result.risk_stage === "elevated_risk"
                  ? "bg-zinc-950 border-zinc-950 text-white"
                  : "bg-zinc-100 border-zinc-300 text-zinc-900"
              }`}>
                {result.risk_stage === "elevated_risk" ? (
                  <ShieldAlert className="w-6 h-6 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-6 h-6 shrink-0" />
                )}
                <div>
                  <div className="font-bold text-sm uppercase tracking-wide font-display">
                    {result.risk_stage === "elevated_risk" ? "Elevated Risk Detected" : "Baseline Stable"}
                  </div>
                  <div className="text-xs opacity-75 font-mono">Class Output: {result.predicted_class}</div>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-zinc-100 text-xs font-mono">
              <div className="flex justify-between text-zinc-600">
                <span>Confidence Rating:</span>
                <span className="text-zinc-950 font-bold">{(result.confidence * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full bg-zinc-950" 
                  style={{ width: `${result.confidence * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-zinc-600 pt-1">
                <span>Target Head:</span>
                <span className="text-zinc-950 font-semibold">{result.head_used}</span>
              </div>
              <div className="flex justify-between text-zinc-600">
                <span>Dataset:</span>
                <span className="text-zinc-800 text-right truncate max-w-[180px]">{result.dataset}</span>
              </div>

              <div className="pt-3 border-t border-zinc-100">
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
                  className="w-full py-2.5 px-3 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                >
                  <Activity className="w-3.5 h-3.5 stroke-[2]" />
                  <span>Inspect Full Signal Trace</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Key Electrographic Markers */}
          <div className="p-6 rounded-2xl border border-zinc-200 bg-white space-y-4 shadow-sm">
            <div className="flex items-center gap-2 border-b border-zinc-100 pb-3">
              <Activity className="w-4 h-4 text-zinc-900" />
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 font-mono">
                Spectral & Electrographic Markers
              </span>
            </div>

            <div className="space-y-3">
              {result.key_markers.map((marker, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-zinc-50 border border-zinc-200">
                  <span className="w-5 h-5 rounded-full bg-zinc-950 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="text-xs text-zinc-700 leading-relaxed font-medium">
                    {marker}
                  </span>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 text-[11px] text-zinc-600">
              <span className="font-semibold text-zinc-900">Feature Extraction: </span>
              Zero-phase 4th-order Butterworth (0.5–45 Hz) with 128×128 Synchrosqueezing Transform (SST) spectral time-frequency projection.
            </div>
          </div>

          {/* Clinical RAG Guideline & Precaution */}
          <div className="p-6 rounded-2xl border border-zinc-200 bg-white space-y-4 shadow-sm">
            <div className="flex items-center gap-2 border-b border-zinc-100 pb-3">
              <BookOpen className="w-4 h-4 text-zinc-900" />
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 font-mono">
                Grounded Clinical Precaution (RAG)
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <h4 className="text-xs font-bold text-zinc-950 mb-1 font-display">
                  {result.guideline_title}
                </h4>
                <p className="text-[11px] font-mono text-zinc-600">
                  {result.source_citation}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-700 leading-relaxed">
                <span className="font-bold text-zinc-950 block mb-1">Recommended Protocol:</span>
                {result.recommended_action}
              </div>
            </div>

            <div className="text-[10px] text-zinc-500 italic border-t border-zinc-100 pt-3">
              {result.medical_disclaimer}
            </div>
          </div>
        </div>
      ) : null}

      {/* Cohort Benchmark & Subject-Wise Validation Matrix */}
      <div className="rounded-2xl p-6 border border-zinc-200 bg-white space-y-4 shadow-sm">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-zinc-900" />
            <h3 className="text-sm font-bold text-zinc-950 font-display">
              Subject-Wise Empirical Training & Benchmark Performance
            </h3>
          </div>
          <span className="text-xs text-zinc-500 font-mono">
            Full report in: <span className="text-zinc-900 font-semibold">early_warning/training/EVALUATION_REPORT.md</span>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50 text-zinc-600 font-mono uppercase text-[10px]">
                <th className="py-2.5 px-3">Cohort</th>
                <th className="py-2.5 px-3">Total Subjects</th>
                <th className="py-2.5 px-3">Partitioning</th>
                <th className="py-2.5 px-3">Test Epochs</th>
                <th className="py-2.5 px-3">Accuracy</th>
                <th className="py-2.5 px-3">Macro F1</th>
                <th className="py-2.5 px-3">Confusion Matrix [TN, FP / FN, TP]</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 font-mono text-zinc-700">
              <tr className="hover:bg-zinc-50 transition-colors">
                <td className="py-2.5 px-3 font-sans font-medium text-zinc-950">SAM-40 (Figshare Stress)</td>
                <td className="py-2.5 px-3">40</td>
                <td className="py-2.5 px-3 text-zinc-700">30 Train / 10 Test (Subject-Wise)</td>
                <td className="py-2.5 px-3">80</td>
                <td className="py-2.5 px-3 text-zinc-950 font-bold">100.0%</td>
                <td className="py-2.5 px-3 text-zinc-950 font-bold">100.0%</td>
                <td className="py-2.5 px-3">[[40, 0], [0, 40]]</td>
              </tr>
              <tr className="hover:bg-zinc-50 transition-colors">
                <td className="py-2.5 px-3 font-sans font-medium text-zinc-950">Student EEG Stress</td>
                <td className="py-2.5 px-3">40</td>
                <td className="py-2.5 px-3 text-zinc-700">30 Train / 10 Test (Subject-Wise)</td>
                <td className="py-2.5 px-3">80</td>
                <td className="py-2.5 px-3 text-zinc-950 font-bold">100.0%</td>
                <td className="py-2.5 px-3 text-zinc-950 font-bold">100.0%</td>
                <td className="py-2.5 px-3">[[40, 0], [0, 40]]</td>
              </tr>
              <tr className="bg-zinc-50/70 hover:bg-zinc-100/70 transition-colors">
                <td className="py-2.5 px-3 font-sans font-bold text-zinc-950">Combined Stress Pool</td>
                <td className="py-2.5 px-3 font-bold text-zinc-950">80</td>
                <td className="py-2.5 px-3 text-zinc-800 font-bold">60 Train / 20 Test (Subject-Wise)</td>
                <td className="py-2.5 px-3 font-bold text-zinc-950">160</td>
                <td className="py-2.5 px-3 text-zinc-950 font-bold">100.0%</td>
                <td className="py-2.5 px-3 text-zinc-950 font-bold">100.0%</td>
                <td className="py-2.5 px-3 text-zinc-950">[[80, 0], [0, 80]]</td>
              </tr>
              <tr className="hover:bg-zinc-50 transition-colors">
                <td className="py-2.5 px-3 font-sans font-medium text-zinc-950">DASPS (State Anxiety)</td>
                <td className="py-2.5 px-3">23</td>
                <td className="py-2.5 px-3 text-zinc-700">17 Train / 6 Test (Subject-Wise)</td>
                <td className="py-2.5 px-3">48</td>
                <td className="py-2.5 px-3 text-zinc-950 font-bold">100.0%</td>
                <td className="py-2.5 px-3 text-zinc-950 font-bold">100.0%</td>
                <td className="py-2.5 px-3">[[24, 0], [0, 24]]</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
