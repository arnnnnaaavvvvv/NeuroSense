import React, { useState } from "react";
import { BookOpen, ShieldCheck, ExternalLink, ChevronDown, ChevronUp, AlertOctagon } from "lucide-react";
import { PrecautionResponse } from "../lib/types";

interface PrecautionPanelProps {
  precautionData: PrecautionResponse | null;
  isLoading: boolean;
}

export default function PrecautionPanel({ precautionData, isLoading }: PrecautionPanelProps) {
  const [showCitations, setShowCitations] = useState(true);

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

      {/* Collapsible Verified Citations List */}
      <div className="border border-slate-800/80 rounded-xl overflow-hidden bg-slate-950/40">
        <button
          onClick={() => setShowCitations(!showCitations)}
          className="w-full px-4 py-2.5 flex items-center justify-between text-xs font-semibold text-slate-300 hover:bg-slate-900/60 transition-colors"
        >
          <span className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-sky-400" />
            Verified Medical Guideline Citations ({precautionData.citations.length})
          </span>
          {showCitations ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showCitations && (
          <div className="px-4 pb-3 space-y-2 border-t border-slate-800/60 pt-2">
            {precautionData.citations.map((c, i) => (
              <div
                key={i}
                className="bg-slate-900/70 p-3 rounded-lg border border-slate-800 text-xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sky-300">
                    [{c.source_org}] {c.document_title}
                  </span>
                  {c.page_number && (
                    <span className="text-[11px] font-mono text-slate-400">
                      Page {c.page_number}
                    </span>
                  )}
                </div>
                {c.section_title && (
                  <div className="text-slate-400 italic">Section: {c.section_title}</div>
                )}
                <div className="text-[11px] text-slate-500 font-mono">
                  Ref: {c.citation_reference}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Embedded Disclaimer Footnote */}
      <div className="flex items-start gap-2 text-[11px] text-amber-400/80 bg-amber-950/20 p-2.5 rounded-lg border border-amber-500/20">
        <AlertOctagon className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <p>{precautionData.medical_disclaimer}</p>
      </div>
    </div>
  );
}
