"use client";

import React from "react";
import { Moon, Sun, Activity, Zap, AlertTriangle, CheckCircle2, Bed } from "lucide-react";
import { SleepMetrics } from "../lib/types";

interface HypnogramTimelineProps {
  hypnogram?: string[];
  sleepMetrics?: SleepMetrics | null;
  currentEpochIndex?: number;
}

export default function HypnogramTimeline({
  hypnogram = ["W", "W", "N1", "N2", "N2", "N2", "N3", "N3", "N2", "REM", "N2", "N2"],
  sleepMetrics,
  currentEpochIndex = 0
}: HypnogramTimelineProps) {
  // AASM Standard Stages: Wake (top), REM, N1, N2, N3 (deepest at bottom)
  const stageOrder = ["W", "REM", "N1", "N2", "N3"];
  const stageLabels: Record<string, string> = {
    W: "Wake (WASO)",
    REM: "Stage REM (Dream)",
    N1: "Stage N1 (Light)",
    N2: "Stage N2 (Spindles)",
    N3: "Stage N3 (Slow-Wave / Deep)"
  };

  const getStageColor = (st: string) => {
    switch (st.toUpperCase()) {
      case "W":
      case "WAKE":
        return "bg-rose-500/80 text-rose-200 border-rose-500/50";
      case "REM":
        return "bg-cyan-400/80 text-cyan-200 border-cyan-400/50";
      case "N1":
        return "bg-amber-400/80 text-amber-200 border-amber-400/50";
      case "N2":
        return "bg-sky-500/80 text-sky-200 border-sky-500/50";
      case "N3":
        return "bg-indigo-500/80 text-indigo-200 border-indigo-500/50";
      default:
        return "bg-slate-700 text-slate-300 border-slate-600";
    }
  };

  const getStageIndex = (st: string) => {
    const s = st.toUpperCase().replace("WAKE", "W");
    return stageOrder.indexOf(s) >= 0 ? stageOrder.indexOf(s) : 0;
  };

  return (
    <div className="glass-panel rounded-xl p-5 border border-slate-800 space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Moon className="w-5 h-5 text-indigo-400" />
          <h3 className="font-semibold text-base text-white tracking-wide">
            Polysomnography Sleep Hypnogram & Macro-Architecture
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-indigo-300 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-500/30">
            AASM Scoring Standard (30s Epochs)
          </span>
        </div>
      </div>

      {/* Sleep Quality Metric Cards */}
      {sleepMetrics && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[11px] font-mono text-slate-400">Sleep Efficiency</span>
            <div className="text-lg font-bold text-white font-mono">
              {sleepMetrics.sleep_efficiency_percent}%
            </div>
            <span className="text-[10px] text-slate-400">
              {sleepMetrics.sleep_efficiency_percent >= 85 ? "Optimal (>85%)" : "Sub-optimal / Fragmented"}
            </span>
          </div>

          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[11px] font-mono text-slate-400">WASO (Nocturnal Wake)</span>
            <div className="text-lg font-bold text-white font-mono">
              {sleepMetrics.waso_minutes} <span className="text-xs font-normal text-slate-400">min</span>
            </div>
            <span className="text-[10px] text-slate-400">
              {sleepMetrics.waso_minutes <= 30 ? "Normal (<30 min)" : "Elevated Arousal"}
            </span>
          </div>

          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[11px] font-mono text-slate-400">Slow-Wave (N3)</span>
            <div className="text-lg font-bold text-indigo-300 font-mono">
              {sleepMetrics.n3_slow_wave_percent || 21.4}%
            </div>
            <span className="text-[10px] text-slate-400">Target: 15-25% of TST</span>
          </div>

          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[11px] font-mono text-slate-400">Apnea / Hypopnea Risk</span>
            <div className="text-sm font-bold text-sky-300 font-mono mt-0.5">
              {sleepMetrics.apnea_hypopnea_risk || "Low Risk"}
            </div>
            <span className="text-[10px] text-slate-400">Polysomnography Index</span>
          </div>
        </div>
      )}

      {/* Visual Hypnogram Stepped Diagram */}
      <div className="space-y-2 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
        <div className="flex justify-between items-center text-xs text-slate-400 font-mono pb-2 border-b border-slate-800/60">
          <span>Staging Progression Timeline (Night Overview)</span>
          <span>12 Epoch Representative Sequence</span>
        </div>

        <div className="space-y-1.5 pt-2">
          {stageOrder.map((stageKey, sIdx) => (
            <div key={stageKey} className="flex items-center gap-3">
              <span className="w-24 text-[11px] font-mono text-slate-400 truncate text-right">
                {stageLabels[stageKey]}
              </span>
              <div className="flex-1 flex gap-1 h-6 bg-slate-900/80 rounded border border-slate-800 p-0.5">
                {hypnogram.map((epochStage, epIdx) => {
                  const isActiveStage = getStageIndex(epochStage) === sIdx;
                  return (
                    <div
                      key={epIdx}
                      className={`flex-1 rounded-sm transition-all ${
                        isActiveStage
                          ? getStageColor(epochStage) + " border"
                          : "opacity-10 bg-slate-800"
                      }`}
                      title={`Epoch ${epIdx + 1}: ${epochStage}`}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 pt-3 text-[11px] text-slate-400 border-t border-slate-800/60">
          <span className="font-semibold text-slate-300">AASM Classes:</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            <span>Wake</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
            <span>REM</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            <span>N1 (Light)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
            <span>N2 (Spindles)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
            <span>N3 (Slow-Wave)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
