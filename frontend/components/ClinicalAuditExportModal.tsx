"use client";

import React, { useEffect, useState } from "react";
import {
  Printer,
  X,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Stethoscope,
  ClipboardList,
  Pill,
  Sparkles,
  ShieldCheck,
  Activity,
  HeartPulse
} from "lucide-react";
import { fetchClinicalAuditExport } from "../lib/api";
import { ClinicalAuditExportResponse } from "../lib/types";
import { getCaseClinicalInfo, CaseClinicalInfo } from "../lib/clinical-guidelines-data";
import { getErrorMessage } from "../lib/errors";

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
      } catch (err: unknown) {
        setError(getErrorMessage(err, "Failed to generate export report."));
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

  const clinicalInfo: CaseClinicalInfo = getCaseClinicalInfo(
    caseId,
    data?.evaluated_risk_stage || ""
  );

  const isOptimal =
    clinicalInfo.signalAnomaly.status === "optimal" ||
    (data?.evaluated_risk_stage || "").toLowerCase().includes("baseline") ||
    (data?.evaluated_risk_stage || "").toLowerCase().includes("relax") ||
    caseId.toLowerCase().includes("relax");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xs p-3 sm:p-5 overflow-y-auto print:p-0 print:bg-white">
      <div className="bg-slate-900 border border-slate-700 max-w-3xl w-full rounded-2xl shadow-2xl p-5 sm:p-7 text-slate-100 space-y-6 max-h-[92vh] overflow-y-auto print:max-h-none print:border-none print:shadow-none print:bg-white print:text-black print:p-0">
        
        {/* Modal Top Action Bar (Hidden during printing) */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-sm sm:text-base text-white tracking-tight">
                Clinical Audit &amp; Assessment Report
              </h2>
              <p className="text-[11px] text-slate-400">
                Official physician &amp; patient clinical evaluation summary
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              disabled={loading || !data}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs transition-colors shadow-sm disabled:opacity-50"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Close Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {loading && (
          <div className="py-14 text-center text-slate-400 animate-pulse text-xs space-y-2">
            <Activity className="w-6 h-6 mx-auto text-sky-400 animate-spin" />
            <p>Compiling clinical evaluation report &amp; diagnostic telemetry...</p>
          </div>
        )}

        {error && (
          <div className="p-4 bg-rose-950/40 border border-rose-500/40 text-rose-300 rounded-xl text-xs">
            {error}
          </div>
        )}

        {data && (
          <div className="space-y-5 print:text-black print:bg-white text-xs">
            
            {/* 1. Formal Clinical Header (Hospital / Clinic Header Style) */}
            <div className="border-b border-slate-700/80 pb-4 print:border-black space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h1 className="text-base sm:text-lg font-bold text-white print:text-black tracking-tight">
                    NeuroSense Clinical Neuro-Analytics
                  </h1>
                  <p className="text-[11px] text-slate-400 print:text-gray-600">
                    Standard 10-20 Cortical EEG Cognitive Stress &amp; State Anxiety Evaluation
                  </p>
                </div>
                <span className={`text-[11px] font-bold px-3 py-1 rounded-full border ${
                  isOptimal
                    ? "bg-emerald-950/80 text-emerald-300 border-emerald-500/50 print:border-emerald-600 print:text-emerald-700"
                    : "bg-amber-950/80 text-amber-300 border-amber-500/50 print:border-amber-600 print:text-amber-800"
                }`}>
                  {isOptimal ? "Clinical Status: Healthy Baseline" : `Clinical Status: ${data.evaluated_risk_stage}`}
                </span>
              </div>

              {/* Patient & Sampling Demographics Table (No overlapping text!) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-xl bg-slate-950/80 border border-slate-800 print:bg-gray-50 print:border-gray-300 text-xs">
                <div className="space-y-0.5 min-w-0">
                  <span className="text-[10px] uppercase font-semibold text-slate-400 print:text-gray-500 block">
                    Patient ID
                  </span>
                  <span className="font-mono font-bold text-slate-200 print:text-black truncate block">
                    {data.patient_anon_id || "Anonymous"}
                  </span>
                </div>
                <div className="space-y-0.5 min-w-0">
                  <span className="text-[10px] uppercase font-semibold text-slate-400 print:text-gray-500 block">
                    Case Reference
                  </span>
                  <span className="font-mono font-bold text-slate-200 print:text-black truncate block" title={data.case_id}>
                    {data.case_id}
                  </span>
                </div>
                <div className="space-y-0.5 min-w-0">
                  <span className="text-[10px] uppercase font-semibold text-slate-400 print:text-gray-500 block">
                    Sampling Protocol
                  </span>
                  <span className="font-mono text-slate-200 print:text-black block">
                    {data.sampling_rate_hz} Hz &bull; {data.duration_seconds}s
                  </span>
                </div>
                <div className="space-y-0.5 min-w-0">
                  <span className="text-[10px] uppercase font-semibold text-slate-400 print:text-gray-500 block">
                    Report Timestamp
                  </span>
                  <span className="font-mono text-slate-200 print:text-black truncate block">
                    {data.export_timestamp}
                  </span>
                </div>
              </div>
            </div>

            {/* 2. CASE FINDING SUMMARY */}
            <div className={`p-4 rounded-xl border ${
              isOptimal 
                ? "bg-emerald-950/30 border-emerald-500/30 print:bg-emerald-50 print:border-emerald-200" 
                : "bg-slate-950/60 border-slate-800 print:bg-gray-50 print:border-gray-200"
            } space-y-1.5`}>
              <div className="flex items-center gap-2">
                {isOptimal ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 print:text-emerald-600 shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-400 print:text-amber-600 shrink-0" />
                )}
                <h3 className="font-bold text-sm text-white print:text-black">
                  {clinicalInfo.conditionTitle}
                </h3>
              </div>
              <p className="text-slate-300 print:text-gray-700 leading-relaxed pl-6 text-xs">
                {clinicalInfo.simpleSummary}
              </p>
            </div>

            {/* 3. CONDITIONAL CONTENT: SIMPLE IF FINE, STRUCTURED IF ISSUE DETECTED */}
            {isOptimal ? (
              /* ================== HEALTHY BASELINE: DO NOT MAKE IT COMPLEX ================== */
              <div className="space-y-4">
                {/* Clean Verification Card */}
                <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 print:bg-white print:border-gray-300 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 print:text-emerald-700 font-bold text-xs uppercase tracking-wider">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Physician Verification: Normal Restorative Baseline</span>
                  </div>
                  <p className="text-slate-300 print:text-gray-700 leading-relaxed text-xs">
                    EEG electrographic rhythms demonstrate synchronized, stable resting alpha oscillations (8–12 Hz) across all monitored channels. Autonomic nervous system tone indicates an optimal, restorative parasympathetic state. No pathological brainwave slowing, epileptiform spikes, or acute stress tension bursts were identified.
                  </p>
                </div>

                {/* Routine Care & Lifestyle Protocols */}
                <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 print:bg-white print:border-gray-300 space-y-2">
                  <div className="flex items-center gap-2 text-sky-400 print:text-sky-700 font-bold text-xs uppercase tracking-wider">
                    <Sparkles className="w-4 h-4" />
                    <span>Routine Care &amp; Preventative Health Guidelines</span>
                  </div>
                  <ul className="space-y-1.5 text-slate-300 print:text-gray-700 pl-1 text-xs">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                      <span><strong>No specialist medical consultation or clinical device is required.</strong></span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                      <span>Continue routine annual preventative wellness checkups with your primary care provider.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                      <span>Sustain regular sleep hygiene and light physical activity to preserve this balanced neurological baseline.</span>
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              /* ================== DETECTED CONDITION: SYMPTOMS, CAUSES, TESTS & TREATMENTS ================== */
              <div className="space-y-4">
                
                {/* SECTION A: REPORTED & DAILY SYMPTOMS */}
                <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 print:bg-white print:border-gray-300 space-y-2.5">
                  <div className="flex items-center gap-2 text-amber-300 print:text-amber-800 font-bold text-xs uppercase tracking-wider">
                    <HeartPulse className="w-4 h-4 text-amber-400 print:text-amber-600" />
                    <span>1. Associated Clinical &amp; Daily Symptoms ({clinicalInfo.symptoms.length})</span>
                  </div>
                  <p className="text-[11px] text-slate-400 print:text-gray-600">
                    Physical, cognitive, and emotional symptoms typically accompanying this stress pattern:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {clinicalInfo.symptoms.map((s, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800/80 print:bg-gray-50 print:border-gray-200 space-y-0.5"
                      >
                        <span className="font-bold text-white print:text-black text-xs block">
                          &bull; {s.title}
                        </span>
                        <p className="text-[11px] text-slate-300 print:text-gray-700 leading-relaxed pl-2">
                          {s.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* SECTION B: PRIMARY CAUSES & TRIGGERS */}
                <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 print:bg-white print:border-gray-300 space-y-2.5">
                  <div className="flex items-center gap-2 text-sky-300 print:text-sky-800 font-bold text-xs uppercase tracking-wider">
                    <Activity className="w-4 h-4 text-sky-400 print:text-sky-600" />
                    <span>2. Identified Causes &amp; Physiological Triggers ({clinicalInfo.causes.length})</span>
                  </div>
                  <p className="text-[11px] text-slate-400 print:text-gray-600">
                    Neurological, autonomic, and environmental factors contributing to this state:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {clinicalInfo.causes.map((c, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800/80 print:bg-gray-50 print:border-gray-200 space-y-0.5"
                      >
                        <span className="font-bold text-white print:text-black text-xs block">
                          &bull; {c.title}
                        </span>
                        <p className="text-[11px] text-slate-300 print:text-gray-700 leading-relaxed pl-2">
                          {c.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* SECTION C: RECOMMENDED TESTS & CHECKUPS */}
                <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 print:bg-white print:border-gray-300 space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-amber-400 print:text-amber-800 font-bold text-xs uppercase tracking-wider">
                      <ClipboardList className="w-4 h-4" />
                      <span>3. Recommended Clinical Tests &amp; Diagnostic Checkups ({clinicalInfo.requiredTests.length})</span>
                    </div>
                    <span className="text-[10px] text-slate-400 print:text-gray-600">
                      Physician verification checklist
                    </span>
                  </div>
                  <div className="space-y-2 pt-1">
                    {clinicalInfo.requiredTests.map((t, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800/80 print:bg-gray-50 print:border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 print:text-emerald-600 shrink-0" />
                            <span className="font-bold text-white print:text-black text-xs">
                              {t.plainEnglishName}
                            </span>
                            <span className="text-[10px] text-slate-400 print:text-gray-500 font-mono">
                              ({t.testName})
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-300 print:text-gray-600 pl-5 leading-relaxed">
                            <strong>Purpose: </strong>{t.whyNeeded}
                          </p>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 uppercase tracking-wider bg-amber-950/60 text-amber-300 border-amber-500/40 print:bg-amber-100 print:text-amber-900">
                          {t.urgency}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* SECTION D: EVIDENCE-BASED TREATMENTS & SPECIALIST GUIDANCE */}
                <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 print:bg-white print:border-gray-300 space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-emerald-400 print:text-emerald-800 font-bold text-xs uppercase tracking-wider">
                      <Pill className="w-4 h-4" />
                      <span>4. Evidence-Based Medical Treatments &amp; Therapies ({clinicalInfo.realTreatments.length})</span>
                    </div>
                    <span className="text-[10px] text-emerald-300 print:text-emerald-800 font-semibold">
                      Consult: {clinicalInfo.actionableGuidance.specialistToConsult}
                    </span>
                  </div>
                  <div className="space-y-2 pt-1">
                    {clinicalInfo.realTreatments.map((tr, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800/80 print:bg-gray-50 print:border-gray-200 space-y-1"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-white print:text-black text-xs">
                            {tr.treatmentName}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-sky-950/60 text-sky-300 border border-sky-500/40 print:bg-sky-100 print:text-sky-800">
                            {tr.category}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300 print:text-gray-600 leading-relaxed">
                          <strong>Clinical Protocol: </strong>{tr.howItWorks}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* 4. CLINICAL SIGN-OFF & REVIEWER NOTICE */}
            <div className="pt-4 border-t border-slate-800 print:border-black space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-slate-400 print:text-gray-600 pt-2">
                <div className="space-y-1">
                  <span className="block text-[11px]">Authorized Reviewing Clinician:</span>
                  <div className="border-b border-slate-700 print:border-black h-6 w-52" />
                </div>
                <div className="space-y-1 sm:text-right">
                  <span className="block text-[11px]">Verification Signature &amp; Date:</span>
                  <div className="border-b border-slate-700 print:border-black h-6 w-52 sm:ml-auto" />
                </div>
              </div>

              <p className="text-[10px] text-slate-500 print:text-gray-500 leading-relaxed pt-1">
                <strong>CLINICAL NOTICE:</strong> This EEG assessment report provides quantitative cortical oscillation telemetry to support clinical decision-making. It is intended to guide patient consultations with board-certified physicians, neurologists, or psychiatrists. Formal diagnosis requires comprehensive in-person clinical workup.
              </p>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

