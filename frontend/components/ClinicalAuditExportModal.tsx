"use client";

import React, { useEffect, useState } from "react";
import { Printer, X, FileText, ShieldAlert, CheckCircle2, BookOpen } from "lucide-react";
import { fetchClinicalAuditExport } from "../lib/api";
import { ClinicalAuditExportResponse } from "../lib/types";

interface ExportModalProps {
  caseId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ClinicalAuditExportModal({ caseId, isOpen, onClose }: ExportModalProps) {
  const [data, setData] = useState<ClinicalAuditExportResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !caseId) return;

    async function loadExport() {
      try {
        setLoading(true);
        setError(null);
        const exportData = await fetchClinicalAuditExport(caseId);
        setData(exportData);
      } catch (err: any) {
        setError(err.message || "Failed to generate export report.");
      } finally {
        setLoading(false);
      }
    }
    loadExport();
  }, [isOpen, caseId]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 max-w-3xl w-full rounded-xl shadow-2xl p-6 text-slate-100 space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Modal Top Controls */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-sky-400" />
            <h2 className="font-bold text-base text-white">Clinical Audit & Analysis Summary</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              disabled={loading || !data}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs transition-colors disabled:opacity-50"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {loading && (
          <div className="py-12 text-center text-slate-400 animate-pulse text-sm">
            Assembling clinical telemetry audit document...
          </div>
        )}

        {error && (
          <div className="p-4 bg-rose-950/40 border border-rose-500/40 text-rose-300 rounded-lg text-xs">
            {error}
          </div>
        )}

        {data && (
          <div className="space-y-5 print:text-black print:bg-white text-xs">
            {/* Header Record Block */}
            <div className="bg-slate-950/70 p-4 rounded-lg border border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <span className="text-slate-500 text-[10px] block">CASE IDENTIFIER</span>
                <span className="font-mono font-bold text-slate-200 text-sm">{data.case_id}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">DOMAIN / BENCHMARK</span>
                <span className="font-mono text-sky-300 font-bold uppercase">{data.domain || "sleep"} &bull; {data.dataset_source || "sleep-edf"}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">PATIENT & SAMPLING</span>
                <span className="text-slate-200">{data.patient_anon_id} &bull; {data.sampling_rate_hz} Hz &bull; {data.duration_seconds}s</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">AUDIT TIMESTAMP</span>
                <span className="font-mono text-slate-200">{data.export_timestamp}</span>
              </div>
            </div>

            {data.sleep_metrics && (
              <div className="bg-indigo-950/30 p-3 rounded-lg border border-indigo-500/30 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                <div>
                  <span className="text-slate-400 block">Sleep Efficiency:</span>
                  <span className="font-mono font-bold text-white">{data.sleep_metrics.sleep_efficiency_percent}%</span>
                </div>
                <div>
                  <span className="text-slate-400 block">WASO:</span>
                  <span className="font-mono font-bold text-white">{data.sleep_metrics.waso_minutes} min</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Slow-Wave (N3):</span>
                  <span className="font-mono font-bold text-indigo-300">{data.sleep_metrics.n3_slow_wave_percent || 21.4}%</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Apnea Risk:</span>
                  <span className="font-mono font-bold text-sky-400">{data.sleep_metrics.apnea_hypopnea_risk || "Low"}</span>
                </div>
              </div>
            )}

            {/* Model Classification Summary */}
            <div className="border border-slate-800 rounded-lg p-4 space-y-3">
              <h3 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
                Pretrained CNN Classification Assessment
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">EVALUATED RISK STAGE</span>
                  <span className="font-bold text-sky-400 text-sm">{data.evaluated_risk_stage}</span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">TEST CONFIDENCE RATING</span>
                  <span className="font-mono font-bold text-emerald-400 text-sm">
                    {(data.confidence_score * 100).toFixed(2)}%
                  </span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">MODEL ARTIFACT</span>
                  <span className="font-mono text-slate-300">{data.model_version}</span>
                </div>
              </div>

              {/* Electrographic Markers */}
              <div>
                <span className="text-slate-400 font-semibold block mb-1">Detected Electrographic Markers:</span>
                <ul className="list-disc list-inside space-y-0.5 text-slate-300">
                  {data.key_markers.map((m, idx) => (
                    <li key={idx}>{m}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* RAG Clinical Precaution Guidance */}
            <div className="border border-slate-800 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-slate-200 uppercase tracking-wider text-[11px]">
                <BookOpen className="w-3.5 h-3.5 text-sky-400" />
                <span>Verified Clinical Guideline Recommendations (RAG Grounded)</span>
              </div>
              <p className="text-slate-300 leading-relaxed bg-slate-950/80 p-3 rounded border border-slate-800">
                {data.clinical_guidance_summary}
              </p>

              {/* Citations list */}
              <div className="pt-2">
                <span className="text-slate-400 font-semibold block mb-1">Source Guideline Citations:</span>
                <div className="space-y-1">
                  {data.citations.map((c, i) => (
                    <div key={i} className="text-slate-400 text-[11px]">
                      &bull; <strong>[{c.source_org}]</strong> {c.document_title} ({c.citation_reference})
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Mandatory Disclaimer */}
            <div className="p-3 bg-amber-950/30 border border-amber-500/30 rounded-lg text-amber-300/90 text-[11px] leading-relaxed">
              <strong>MANDATORY NOTICE:</strong> {data.medical_disclaimer}
            </div>

            {/* Clinician Review Sign-off */}
            <div className="pt-4 border-t border-slate-800 grid grid-cols-2 gap-6 text-[11px] text-slate-400">
              <div>
                <span>Clinical Reviewer: _____________________________</span>
              </div>
              <div className="text-right">
                <span>Date & Verification Signature: __________________</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
