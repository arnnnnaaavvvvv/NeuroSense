import React from "react";
import { BookOpen, ShieldCheck } from "lucide-react";
import { PrecautionResponse } from "../lib/types";

interface PrecautionPanelProps {
  precautionData: PrecautionResponse | null;
  isLoading: boolean;
}

export default function PrecautionPanel({ precautionData, isLoading }: PrecautionPanelProps) {
  if (isLoading) {
    return (
      <div className="glass-panel rounded-xl p-6 border border-slate-800 animate-pulse space-y-4">
        <div className="h-5 bg-slate-800 rounded w-1/3"></div>
        <div className="h-20 bg-slate-800/60 rounded"></div>
      </div>
    );
  }

  if (!precautionData) return null;

  return (
    <div className="glass-panel rounded-xl p-5 border border-slate-800 space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <h3 className="font-semibold text-base text-white tracking-wide">
            Clinical Precaution Guidance (RAG Grounded)
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
            Source Grounded: Zero LLM Hallucination
          </span>
        </div>
      </div>

      {/* Main Guidance Text Block */}
      <div className="bg-slate-900/90 rounded-xl p-4 border border-slate-800 text-sm text-slate-200 leading-relaxed space-y-3">
        <p className="font-normal text-slate-200">{precautionData.guidance_text}</p>

        {/* Primary Source Citation Badge */}
        <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-2 text-xs text-slate-400">
          <BookOpen className="w-3.5 h-3.5 text-sky-400 shrink-0" />
          <span>Primary Verified Guidance Sources:</span>
          <span className="text-sky-300 font-medium">{precautionData.source_citation}</span>
        </div>
      </div>
    </div>
  );
}
