"use client";

import React, { useState } from "react";
import { Zap, X, Play, Clock, Cpu, CheckCircle2, ShieldAlert, BarChart3, Database, Layers } from "lucide-react";
import { runUciFastPath, runBonnFastPath } from "../lib/api";
import { UCIFastPathResponse, BonnFastPathResponse } from "../lib/types";

interface FastPitchDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FastPitchDemoModal({ isOpen, onClose }: FastPitchDemoModalProps) {
  const [activeTab, setActiveTab] = useState<"uci" | "bonn">("uci");

  // UCI State
  const [uciTargetClass, setUciTargetClass] = useState<number>(1);
  const [uciResult, setUciResult] = useState<UCIFastPathResponse | null>(null);
  const [uciLoading, setUciLoading] = useState<boolean>(false);

  // Bonn State
  const [bonnSubset, setBonnSubset] = useState<string>("ictal");
  const [bonnResult, setBonnResult] = useState<BonnFastPathResponse | null>(null);
  const [bonnLoading, setBonnLoading] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleRunUCI = async (targetClass: number) => {
    setUciTargetClass(targetClass);
    try {
      setUciLoading(true);
      const res = await runUciFastPath(targetClass);
      setUciResult(res);
    } catch (err) {
      console.error("UCI demo error:", err);
    } finally {
      setUciLoading(false);
    }
  };

  const handleRunBonn = async (subset: string) => {
    setBonnSubset(subset);
    try {
      setBonnLoading(true);
      const res = await runBonnFastPath(subset);
      setBonnResult(res);
    } catch (err) {
      console.error("Bonn demo error:", err);
    } finally {
      setBonnLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="glass-panel w-full max-w-3xl rounded-2xl border border-sky-500/40 p-6 shadow-2xl shadow-sky-500/10 space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Zap className="w-6 h-6 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white tracking-tight">Fast-Path Pitch & Recruiter Demo</h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
                  Zero EDF Overhead
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Lightweight fallback classifiers for instant live presentations (<span className="text-sky-300 font-mono">&lt;15ms</span> latency)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Benchmark Selector Tabs */}
        <div className="flex items-center gap-2 p-1.5 bg-slate-950/70 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab("uci")}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
              activeTab === "uci"
                ? "bg-sky-500 text-slate-950 font-bold shadow-md shadow-sky-500/20"
                : "text-slate-300 hover:text-white hover:bg-slate-800/50"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>UCI Seizure Dataset (Instant 178-CSV)</span>
          </button>
          <button
            onClick={() => setActiveTab("bonn")}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
              activeTab === "bonn"
                ? "bg-sky-500 text-slate-950 font-bold shadow-md shadow-sky-500/20"
                : "text-slate-300 hover:text-white hover:bg-slate-800/50"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Bonn University EEG (Fast Univariate)</span>
          </button>
        </div>

        {/* Tab 1: UCI Instant CSV Pitch */}
        {activeTab === "uci" && (
          <div className="space-y-4">
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-2">
              <div className="flex items-center justify-between font-mono text-[11px] text-sky-400">
                <span>Source: UCI Machine Learning Repository / akshayg056</span>
                <span>Pre-flattened (178 features / sec)</span>
              </div>
              <p>
                Demonstrates instant end-to-end evaluation of tabular EEG vectors without EDF I/O latency.
                Click any class below to run instantaneous live inference:
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 pt-2">
                {[
                  { label: "Class 1: Active Seizure (Ictal)", classVal: 1, style: "hover:border-rose-500 hover:text-rose-300" },
                  { label: "Class 2: Tumor Focus (Inter-Ictal)", classVal: 2, style: "hover:border-amber-500 hover:text-amber-300" },
                  { label: "Class 5: Normal Awake (Baseline)", classVal: 5, style: "hover:border-emerald-500 hover:text-emerald-300" },
                ].map((item) => (
                  <button
                    key={item.classVal}
                    onClick={() => handleRunUCI(item.classVal)}
                    disabled={uciLoading}
                    className={`px-3 py-2 rounded-lg border border-slate-700 bg-slate-800/80 font-medium transition-all flex items-center gap-2 ${item.style} ${
                      uciTargetClass === item.classVal && uciResult ? "ring-2 ring-sky-400" : ""
                    }`}
                  >
                    <Play className="w-3.5 h-3.5 text-sky-400" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Live Results Panel */}
            {uciResult && (
              <div className="bg-slate-950/80 p-5 rounded-xl border border-slate-800 space-y-4 animate-fadeIn">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-400 uppercase">Evaluated Result:</span>
                    <span className="font-bold text-sm text-white">{uciResult.label_name}</span>
                  </div>
                  <div className="flex items-center gap-3 font-mono text-xs">
                    <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-400">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{uciResult.inference_time_ms} ms</span>
                    </span>
                    <span className="px-2 py-0.5 rounded bg-sky-950/60 border border-sky-500/30 text-sky-400">
                      Conf: {(uciResult.confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>

                {/* Feature Sparkline Visualization */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] font-mono text-slate-400">
                    <span>178-Timepoint Normalized Feature Spectrum</span>
                    <span>Signal Variance: {uciResult.variance} μV²</span>
                  </div>
                  <div className="h-16 w-full bg-slate-900 rounded-lg p-2 flex items-end gap-0.5 overflow-hidden border border-slate-800">
                    {uciResult.features_sample.map((val, idx) => {
                      const heightPercent = Math.min(100, Math.max(8, ((Math.abs(val) / 200.0) * 100)));
                      const isSeizure = uciResult.binary_class === "ictal";
                      const color = isSeizure ? "bg-rose-500" : "bg-sky-400";
                      return (
                        <div
                          key={idx}
                          className={`flex-1 rounded-t-sm transition-all duration-300 ${color}`}
                          style={{ height: `${heightPercent}%` }}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Markers */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  {uciResult.key_markers.map((m, i) => (
                    <div key={i} className="flex items-center gap-2 bg-slate-900/60 p-2 rounded-lg border border-slate-800 text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                      <span className="truncate">{m}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Bonn Univariate Pitch */}
        {activeTab === "bonn" && (
          <div className="space-y-4">
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-2">
              <div className="flex items-center justify-between font-mono text-[11px] text-sky-400">
                <span>Source: Bonn University Epilepsy Center / Andrzejak et al.</span>
                <span>Univariate 173.61 Hz</span>
              </div>
              <p>
                Univariate single-channel time-series benchmark. Evaluates spectral power bands and paroxysms in &lt;10ms:
              </p>

              <div className="flex flex-wrap gap-2 pt-2">
                {[
                  { label: "Set E: Active Ictal Seizure", subset: "ictal", style: "hover:border-rose-500 hover:text-rose-300" },
                  { label: "Set C: Inter-Ictal Hippocampal", subset: "inter-ictal", style: "hover:border-amber-500 hover:text-amber-300" },
                  { label: "Set A: Healthy Volunteer Eyes Open", subset: "healthy", style: "hover:border-emerald-500 hover:text-emerald-300" },
                ].map((item) => (
                  <button
                    key={item.subset}
                    onClick={() => handleRunBonn(item.subset)}
                    disabled={bonnLoading}
                    className={`px-3 py-2 rounded-lg border border-slate-700 bg-slate-800/80 font-medium transition-all flex items-center gap-2 ${item.style} ${
                      bonnSubset === item.subset && bonnResult ? "ring-2 ring-sky-400" : ""
                    }`}
                  >
                    <Play className="w-3.5 h-3.5 text-sky-400" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {bonnResult && (
              <div className="bg-slate-950/80 p-5 rounded-xl border border-slate-800 space-y-4 animate-fadeIn">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-400 uppercase">Evaluated Set:</span>
                    <span className="font-bold text-sm text-white">{bonnResult.risk_stage}</span>
                  </div>
                  <div className="flex items-center gap-3 font-mono text-xs">
                    <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-400">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{bonnResult.inference_time_ms} ms</span>
                    </span>
                    <span className="px-2 py-0.5 rounded bg-sky-950/60 border border-sky-500/30 text-sky-400">
                      Conf: {(bonnResult.confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] font-mono text-slate-400">
                    <span>Univariate Raw Signal Waveform Preview</span>
                    <span>173.61 Hz Calibrated</span>
                  </div>
                  <div className="h-16 w-full bg-slate-900 rounded-lg p-2 flex items-end gap-0.5 overflow-hidden border border-slate-800">
                    {bonnResult.samples_preview.map((val, idx) => {
                      const heightPercent = Math.min(100, Math.max(6, ((Math.abs(val) / 120.0) * 100)));
                      const isIctal = bonnResult.classification === "ictal";
                      const color = isIctal ? "bg-rose-500" : "bg-sky-400";
                      return (
                        <div
                          key={idx}
                          className={`flex-1 rounded-t-sm transition-all duration-300 ${color}`}
                          style={{ height: `${heightPercent}%` }}
                        />
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  {bonnResult.key_markers.map((m, i) => (
                    <div key={i} className="flex items-center gap-2 bg-slate-900/60 p-2 rounded-lg border border-slate-800 text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                      <span className="truncate">{m}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Pitch Summary Callout */}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-sky-400" />
            <span>Shared Özdemir Multi-Disorder Backbone Architecture</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors"
          >
            Close Demo
          </button>
        </div>
      </div>
    </div>
  );
}
