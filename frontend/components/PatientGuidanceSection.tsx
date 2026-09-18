"use client";

import React, { useState, useRef } from "react";
import {
  HeartPulse,
  AlertTriangle,
  Stethoscope,
  ClipboardList,
  CheckCircle2,
  HelpCircle,
  Activity,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Clock,
  Sparkles,
  Info,
  Pill,
  ShieldAlert,
  Zap,
  Flame
} from "lucide-react";

import {
  getCaseClinicalInfo,
  type CaseClinicalInfo,
  type SignalAnomalyDetail,
  type RedFlagSign,
  type RealMedicalTreatment,
  type RequiredClinicalTest,
  type ClinicalWarningSign,
  type ClinicalIntervention
} from "../lib/clinical-guidelines-data";

export {
  getCaseClinicalInfo,
  type CaseClinicalInfo,
  type SignalAnomalyDetail,
  type RedFlagSign,
  type RealMedicalTreatment,
  type RequiredClinicalTest,
  type ClinicalWarningSign,
  type ClinicalIntervention
};

interface PatientGuidanceSectionProps {
  caseId: string;
  domain?: string;
  stageOrRisk: string;
  patientAnonId?: string;
}

export default function PatientGuidanceSection({
  caseId,
  domain,
  stageOrRisk,
  patientAnonId
}: PatientGuidanceSectionProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "causes" | "symptoms" | "tests" | "actions">("overview");
  const [showDoctorQuestions, setShowDoctorQuestions] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Smoothly scrolls to the top of the guidance section (just below sticky navbar, matching image 2)
  const scrollToGuidanceHeader = () => {
    if (sectionRef.current) {
      const navbarHeight = 64; // height of sticky navbar
      const topOffset = 16;    // margin above card header matching image 2
      const elementPosition = sectionRef.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - (navbarHeight + topOffset);
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  const handleTabSwitch = (tab: "overview" | "causes" | "symptoms" | "tests" | "actions") => {
    setActiveTab(tab);
    requestAnimationFrame(() => {
      scrollToGuidanceHeader();
    });
  };

  const caseData = getCaseClinicalInfo(caseId, stageOrRisk);

  const isOptimal =
    caseData.signalAnomaly.status === "optimal" ||
    stageOrRisk.toLowerCase().includes("baseline") ||
    stageOrRisk.toLowerCase().includes("relax") ||
    stageOrRisk.toLowerCase().includes("optimal");

  // When patient is healthy, hide triggers, symptoms, and tests tabs — they do not apply
  const effectiveTab =
    isOptimal && (activeTab === "causes" || activeTab === "symptoms" || activeTab === "tests")
      ? "overview"
      : activeTab;

  return (
    <section
      ref={sectionRef}
      id="patient-guidance-section"
      className="scroll-mt-24 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden text-slate-900 transition-all"
    >
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase border font-mono ${
                isOptimal
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                  : "bg-rose-500/20 text-rose-300 border-rose-500/30"
              }`}>
                {isOptimal ? "Clinical Health & Baseline Verification" : "Stress & Anxiety Telemetry Guide"}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Case: {patientAnonId || caseId}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              {caseData.conditionTitle}
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed pt-1">
              {caseData.simpleSummary}
            </p>
          </div>

          <div className="flex flex-col sm:items-end gap-1.5 shrink-0 bg-slate-950/40 p-3 rounded-xl border border-slate-700/60">
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
              Current Finding
            </div>
            <div className={`text-sm font-bold ${isOptimal ? "text-emerald-400" : "text-sky-300"}`}>
              {stageOrRisk}
            </div>
            <div className="text-[11px] text-slate-400">
              {isOptimal ? "Normal physiological rhythms confirmed" : "Clinical telemetry translated for patients"}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-5 border-t border-slate-700/60 mt-4 text-xs font-medium">
          {isOptimal ? (
            /* Healthy Baseline: Only 2 relevant tabs. No triggers, symptoms, or tests! */
            <>
              <button
                onClick={() => handleTabSwitch("overview")}
                className={`px-3.5 py-1.5 rounded-lg transition-all ${
                  effectiveTab === "overview"
                    ? "bg-emerald-400 text-slate-950 font-bold shadow-sm"
                    : "bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700"
                }`}
              >
                1. Brain Health Overview &amp; Verification
              </button>
              <button
                onClick={() => handleTabSwitch("actions")}
                className={`px-3.5 py-1.5 rounded-lg transition-all ${
                  effectiveTab === "actions"
                    ? "bg-emerald-400 text-slate-950 font-bold shadow-sm"
                    : "bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700"
                }`}
              >
                2. Doctor Wellness Advice &amp; Daily Habits
              </button>
            </>
          ) : (
            /* Condition Detected: Full 5-tab diagnostic guide */
            <>
              <button
                onClick={() => handleTabSwitch("overview")}
                className={`px-3.5 py-1.5 rounded-lg transition-all ${
                  effectiveTab === "overview"
                    ? "bg-sky-500 text-slate-950 font-bold shadow-sm"
                    : "bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700"
                }`}
              >
                1. Overview &amp; Signals
              </button>
              <button
                onClick={() => handleTabSwitch("causes")}
                className={`px-3.5 py-1.5 rounded-lg transition-all ${
                  effectiveTab === "causes"
                    ? "bg-sky-500 text-slate-950 font-bold shadow-sm"
                    : "bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700"
                }`}
              >
                2. Common Triggers ({caseData.causes.length})
              </button>
              <button
                onClick={() => handleTabSwitch("symptoms")}
                className={`px-3.5 py-1.5 rounded-lg transition-all ${
                  effectiveTab === "symptoms"
                    ? "bg-sky-500 text-slate-950 font-bold shadow-sm"
                    : "bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700"
                }`}
              >
                3. What You Feel ({caseData.symptoms.length})
              </button>
              <button
                onClick={() => handleTabSwitch("tests")}
                className={`px-3.5 py-1.5 rounded-lg transition-all ${
                  effectiveTab === "tests"
                    ? "bg-amber-400 text-slate-950 font-bold shadow-sm"
                    : "bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700"
                }`}
              >
                4. Real Tests &amp; Treatments ({caseData.requiredTests.length + caseData.realTreatments.length})
              </button>
              <button
                onClick={() => handleTabSwitch("actions")}
                className={`px-3.5 py-1.5 rounded-lg transition-all ${
                  effectiveTab === "actions"
                    ? "bg-emerald-400 text-slate-950 font-bold shadow-sm"
                    : "bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700"
                }`}
              >
                5. Doctor Guidance &amp; Steps
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-5 sm:p-6 bg-slate-50/50">
        {/* TAB 1: OVERVIEW & SIGNAL DIAGNOSTICS */}
        {effectiveTab === "overview" && (
          <div className="space-y-6">
            {/* Two-Card Grid: Signal Finding + Specialist */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Card 1: Physician Signal Verification */}
              <div className="p-4 sm:p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3.5">
                <div className="flex items-center justify-between gap-2">
                  <div className={`flex items-center gap-2 font-bold text-sm ${isOptimal ? "text-emerald-600" : "text-rose-600"}`}>
                    {isOptimal ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    )}
                    <span>{isOptimal ? "Physician Signal Evaluation: Healthy Baseline" : "Why This Needs Attention"}</span>
                  </div>
                  <span
                    className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${
                      isOptimal
                        ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                        : caseData.signalAnomaly.status === "abnormal"
                        ? "bg-rose-100 text-rose-800 border-rose-200"
                        : "bg-amber-100 text-amber-800 border-amber-200"
                    }`}
                  >
                    {caseData.signalAnomaly.statusBadge}
                  </span>
                </div>

                {/* Waveform Finding Callout Box */}
                {isOptimal ? (
                  <div className="p-3.5 rounded-lg bg-emerald-50/70 border border-emerald-200/80 space-y-1.5">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Physiological Rhythm Status: Optimal &amp; Balanced (No Pathology Detected)</span>
                    </div>
                    <p className="text-xs font-bold text-slate-900 leading-snug">
                      {caseData.signalAnomaly.abnormalLocation}
                    </p>
                    <p className="text-[11px] text-slate-700 leading-relaxed pt-0.5">
                      {caseData.signalAnomaly.signalPathologyDescription}
                    </p>
                  </div>
                ) : (
                  <div className="p-3.5 rounded-lg bg-rose-50/70 border border-rose-200/80 space-y-1.5">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-rose-800 flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-rose-600" />
                      <span>Where The Signal Is Not Good (Waveform Anomaly)</span>
                    </div>
                    <p className="text-xs font-bold text-slate-900 leading-snug">
                      {caseData.signalAnomaly.abnormalLocation}
                    </p>
                    <p className="text-[11px] text-slate-700 leading-relaxed pt-0.5">
                      {caseData.signalAnomaly.signalPathologyDescription}
                    </p>
                  </div>
                )}

                {/* Clinical Justification / Interpretation */}
                <div className="text-xs text-slate-700 leading-relaxed pt-0.5">
                  <strong className="text-slate-900">
                    {isOptimal ? "Physician Interpretation: " : "Clinical Justification: "}
                  </strong>
                  {caseData.whyNeedsAttention}
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  {isOptimal ? (
                    <button
                      onClick={() => handleTabSwitch("actions")}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-900 transition-colors"
                    >
                      <span>View Doctor Wellness Advice</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleTabSwitch("causes")}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-700 hover:text-sky-900 transition-colors"
                    >
                      <span>View Common Triggers ({caseData.causes.length})</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Card 2: Recommended Specialist / Physician Follow-up */}
              <div className="p-4 sm:p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3.5 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                    <Stethoscope className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{isOptimal ? "Recommended Physician Follow-Up" : "Recommended Specialist"}</span>
                  </div>
                  <div className="p-3.5 rounded-lg bg-emerald-50/70 border border-emerald-200/80">
                    <p className="text-xs font-bold text-slate-900 leading-snug">
                      {isOptimal ? "Routine Primary Care & Preventative Wellness" : caseData.actionableGuidance.specialistToConsult}
                    </p>
                    <p className="text-[11px] text-emerald-900 pt-1 leading-relaxed">
                      {isOptimal
                        ? "No specialist consultation or medical intervention is required. Continue routine annual preventative wellness checkups with your primary care physician to sustain this healthy nervous system baseline."
                        : "Consult with this medical specialist to evaluate confirmatory gold-standard tests and discuss evidence-based therapeutic options."}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                    <div className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                      {isOptimal ? "Clinical Baseline Verification" : "Healthy Baseline Comparison"}
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      {caseData.signalAnomaly.normalBaselineComparison}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  <p className="text-[11px] text-slate-500">
                    {isOptimal
                      ? "Share this summary with your primary care provider during your next routine annual health checkup."
                      : "Share this summary and the exported report with your healthcare team."}
                  </p>
                  <button
                    onClick={() => handleTabSwitch("actions")}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 transition-all shadow-2xs"
                  >
                    <span>{isOptimal ? "View Doctor Wellness Advice" : "View Doctor Guidance & Questions"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* CARD 3: DOCTOR-RECOMMENDED PRACTICES OR WARNING SIGNS */}
            <div className="p-4 sm:p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3.5">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  {isOptimal ? (
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                  )}
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                    {isOptimal
                      ? "Doctor-Recommended Practices to Maintain Neural Health & Resilience"
                      : "Real Things on Which the Patient Needs to Pay Attention"}
                  </h3>
                </div>
                <span className={`text-[11px] ${isOptimal ? "text-emerald-700 font-medium" : "text-slate-500"}`}>
                  {isOptimal
                    ? "Evidence-Based Preventive Health & Brain Hygiene Protocols"
                    : "Critical Physiological Warning Signs & Red Flags"}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {caseData.thingsToPayAttentionTo.map((item, idx) => {
                  let badgeStyle = "bg-slate-100 text-slate-700 border-slate-200";
                  if (isOptimal) {
                    badgeStyle = "bg-emerald-100 text-emerald-900 border-emerald-300 font-bold";
                  } else if (item.urgency === "Immediate Medical Attention") {
                    badgeStyle = "bg-rose-100 text-rose-900 border-rose-300 font-extrabold";
                  } else if (item.urgency === "Clinical Follow-Up") {
                    badgeStyle = "bg-amber-100 text-amber-900 border-amber-300 font-bold";
                  } else {
                    badgeStyle = "bg-sky-100 text-sky-900 border-sky-300 font-medium";
                  }

                  return (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-lg border transition-all space-y-1.5 ${
                        isOptimal
                          ? "border-emerald-200/80 bg-emerald-50/40 hover:bg-emerald-50/70 hover:border-emerald-300"
                          : "border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-bold text-slate-900 leading-snug">
                          {item.sign}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border shrink-0 ${badgeStyle}`}>
                          {item.urgency}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        {item.clinicalContext}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100">
                <span className="text-[11px] text-slate-500 font-medium">
                  {isOptimal ? "Doctor-recommended lifestyle practices for ongoing health:" : "Explore triggers and what you might experience daily:"}
                </span>
                <div className="flex items-center gap-2">
                  {isOptimal ? (
                    <button
                      onClick={() => handleTabSwitch("actions")}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-all"
                    >
                      <span>View Doctor Wellness Advice</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => handleTabSwitch("causes")}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-sky-50 hover:text-sky-700 text-slate-700 border border-slate-200 transition-all"
                      >
                        <span>View Common Triggers ({caseData.causes.length})</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleTabSwitch("symptoms")}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-amber-50 hover:text-amber-800 text-slate-700 border border-slate-200 transition-all"
                      >
                        <span>View What You Feel ({caseData.symptoms.length})</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* CARD 4: REASSURING NO-TESTS-NEEDED BANNER WHEN OPTIMAL, OR FULL TESTS/TREATMENTS TEASER WHEN ISSUE DETECTED */}
            {isOptimal ? (
              <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 text-white border border-emerald-800/40 shadow-xs space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-300">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Optimal Neurological Health Verified</span>
                    </div>
                    <h4 className="text-sm sm:text-base font-bold text-white">
                      No Diagnostic Tests or Medical Treatments Required
                    </h4>
                    <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                      All cortical brainwaves, resting alpha synchrony, and autonomic indicators are within normal healthy parameters. You do not need confirmatory scans, prescription medications, or specialist workups.
                    </p>
                  </div>
                  <button
                    onClick={() => handleTabSwitch("actions")}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-emerald-400 hover:bg-emerald-300 text-slate-950 transition-all shadow-sm shrink-0"
                  >
                    <span>View Daily Wellness Habits</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-xs space-y-3.5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-300">
                      <Pill className="w-4 h-4" />
                      <span>Real Diagnostic Tests &amp; Real Medical Treatments</span>
                    </div>
                    <h4 className="text-sm sm:text-base font-bold text-white pt-1">
                      {caseData.requiredTests.length} Confirmatory Clinical Tests &amp; {caseData.realTreatments.length} Evidence-Based Therapies
                    </h4>
                    <p className="text-xs text-slate-300 pt-0.5">
                      Clinically validated diagnostic evaluations and physician-directed treatments matching this stress/anxiety pattern.
                    </p>
                  </div>
                  <button
                    onClick={() => handleTabSwitch("tests")}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 transition-all shadow-sm shrink-0"
                  >
                    <span>View Full Tests &amp; Treatments</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Quick Pills */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-700/60 text-xs">
                  <div className="space-y-1">
                    <div className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                      Diagnostic Tests:
                    </div>
                    <ul className="text-slate-200 text-[11px] space-y-0.5">
                      {caseData.requiredTests.slice(0, 2).map((t, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span className="truncate">{t.plainEnglishName}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-1">
                    <div className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                      Medical Treatments:
                    </div>
                    <ul className="text-slate-200 text-[11px] space-y-0.5">
                      {caseData.realTreatments.slice(0, 2).map((tr, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <Zap className="w-3 h-3 text-amber-400 shrink-0" />
                          <span className="truncate">{tr.treatmentName}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: CAUSES */}
        {!isOptimal && effectiveTab === "causes" && (
          <div className="space-y-4">
            <div className="pb-1">
              <h3 className="text-base font-bold text-slate-900">
                Why Does This Happen? (Possible Triggers Explained Simply)
              </h3>
              <p className="text-xs text-slate-500">
                Cognitive overload and anxiety rarely have a single trigger. Here are the most common neurological, psychological, and autonomic factors:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {caseData.causes.map((c, idx) => (
                <div
                  key={idx}
                  className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-sky-300 transition-all space-y-1.5"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-800 font-bold text-xs flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <h4 className="font-bold text-sm text-slate-900">
                      {c.title}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed pl-7">
                    {c.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Tab Navigation Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <button
                onClick={() => handleTabSwitch("overview")}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Overview</span>
              </button>
              <button
                onClick={() => handleTabSwitch("symptoms")}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-sm transition-all"
              >
                <span>Next: What You Feel ({caseData.symptoms.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: SYMPTOMS */}
        {!isOptimal && effectiveTab === "symptoms" && (
          <div className="space-y-4">
            <div className="pb-1">
              <h3 className="text-base font-bold text-slate-900">
                What a Person Might Feel (Daily Life Symptoms)
              </h3>
              <p className="text-xs text-slate-500">
                These are the physical, emotional, and cognitive signs that often accompany this physiological stress pattern:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {caseData.symptoms.map((s, idx) => (
                <div
                  key={idx}
                  className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-amber-300 transition-all space-y-1.5"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-900 font-bold text-xs flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <h4 className="font-bold text-sm text-slate-900">
                      {s.title}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed pl-7">
                    {s.description}
                  </p>
                </div>
              ))}
            </div>

            {caseData.symptoms_alert && (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-xs text-amber-900 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong>Important Clinical Observation: </strong>
                  {caseData.symptoms_alert}
                </p>
              </div>
            )}

            {/* Tab Navigation Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <button
                onClick={() => handleTabSwitch("causes")}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Triggers</span>
              </button>
              <button
                onClick={() => handleTabSwitch("tests")}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-sm transition-all"
              >
                <span>Next: Real Tests &amp; Treatments ({caseData.requiredTests.length + caseData.realTreatments.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 4: REAL TESTS & REAL TREATMENTS */}
        {!isOptimal && effectiveTab === "tests" && (
          <div className="space-y-6">
            {/* SECTION 1: REQUIRED DIAGNOSTIC TESTS */}
            <div className="space-y-3.5">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-1 border-b border-slate-200">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <ClipboardList className="w-4 h-4 text-amber-600" />
                    <span>Real Diagnostic Tests for This Condition</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Bring this checklist to your physician to request or verify these formal clinical evaluations:
                  </p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 bg-amber-100 text-amber-900 rounded-full border border-amber-200">
                  Diagnostic Workup ({caseData.requiredTests.length} Tests)
                </span>
              </div>

              <div className="space-y-3">
                {caseData.requiredTests.map((t, idx) => {
                  let badgeColor = "bg-slate-100 text-slate-700 border-slate-200";
                  if (t.urgency === "Priority") {
                    badgeColor = "bg-rose-100 text-rose-800 border-rose-200";
                  } else if (t.urgency === "Recommended") {
                    badgeColor = "bg-amber-100 text-amber-800 border-amber-200";
                  }

                  return (
                    <div
                      key={idx}
                      className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs hover:border-slate-300 transition-all space-y-2"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <div>
                            <span className="font-bold text-sm text-slate-900">
                              {t.plainEnglishName}
                            </span>
                            <span className="text-xs text-slate-500 font-mono ml-2">
                              ({t.testName})
                            </span>
                          </div>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeColor}`}>
                          {t.urgency}
                        </span>
                      </div>

                      <div className="pl-6 text-xs text-slate-600 leading-relaxed">
                        <strong className="text-slate-800">Why your doctor orders this: </strong>
                        {t.whyNeeded}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SECTION 2: REAL MEDICAL TREATMENTS & THERAPIES */}
            <div className="space-y-3.5 pt-2">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-1 border-b border-slate-200">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Pill className="w-4 h-4 text-emerald-600" />
                    <span>Real Medical Treatments &amp; Evidence-Based Therapies</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Clinically established medical therapies, devices, and protocols prescribed by physicians for this specific pattern:
                  </p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-100 text-emerald-900 rounded-full border border-emerald-200">
                  Evidence-Based Treatments ({caseData.realTreatments.length})
                </span>
              </div>

              <div className="space-y-3">
                {caseData.realTreatments.map((tr, idx) => {
                  let catBadge = "bg-sky-50 text-sky-800 border-sky-200";
                  if (tr.category === "First-Line Medical Therapy") {
                    catBadge = "bg-rose-50 text-rose-800 border-rose-200";
                  } else if (tr.category === "Clinical Device / Appliance") {
                    catBadge = "bg-amber-50 text-amber-800 border-amber-200";
                  } else if (tr.category === "Medical Specialist Care") {
                    catBadge = "bg-purple-50 text-purple-800 border-purple-200";
                  }

                  return (
                    <div
                      key={idx}
                      className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs hover:border-slate-300 transition-all space-y-2"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                          <span className="font-bold text-sm text-slate-900">
                            {tr.treatmentName}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${catBadge}`}>
                            {tr.category}
                          </span>
                        </div>
                      </div>

                      <div className="pl-6 text-xs text-slate-600 leading-relaxed space-y-1">
                        <div>
                          <strong className="text-slate-800">How It Works Clinically: </strong>
                          {tr.howItWorks}
                        </div>
                        <div className="text-[11px] text-emerald-800 font-medium bg-emerald-50/60 p-2 rounded-lg border border-emerald-100">
                          <strong>Clinical Evidence: </strong>
                          {tr.evidenceBase}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tab Navigation Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <button
                onClick={() => handleTabSwitch("symptoms")}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Symptoms</span>
              </button>
              <button
                onClick={() => handleTabSwitch("actions")}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-400 hover:bg-emerald-300 text-slate-950 shadow-sm transition-all"
              >
                <span>Next: Doctor Guidance &amp; Questions</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 5: DOCTOR GUIDANCE & ACTIONABLE STEPS */}
        {effectiveTab === "actions" && (
          <div className="space-y-5">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {isOptimal ? "Doctor Wellness Advice & Daily Habits" : "Patient Action Plan & Medical Guidance"}
              </h3>
              <p className="text-xs text-slate-500">
                {isOptimal
                  ? "Doctor-recommended lifestyle practices to sustain your healthy neural baseline, plus routine checkup guidance:"
                  : "Clear, practical steps you can start today, along with what to ask your doctor:"}
              </p>
            </div>

            {/* Immediate Steps */}
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>{isOptimal ? "Recommended Daily Health Habits" : "Immediate Self-Care & Lifestyle Steps"}</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-700 pl-2">
                {caseData.actionableGuidance.immediateSteps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Questions for Your Doctor */}
            <div className="bg-slate-900 text-white rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-sm text-white">
                  <HelpCircle className="w-4 h-4 text-sky-400" />
                  <span>{isOptimal ? "Questions to Ask at Your Next Routine Checkup" : "Questions to Ask Your Doctor at Your Next Visit"}</span>
                </div>
                <button
                  onClick={() => setShowDoctorQuestions(!showDoctorQuestions)}
                  className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1"
                >
                  {showDoctorQuestions ? "Collapse" : "Expand All"}
                </button>
              </div>

              <div className="space-y-2 text-xs text-slate-300 pt-1">
                {caseData.actionableGuidance.doctorQuestions.map((q, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700 flex items-start gap-2.5"
                  >
                    <span className="font-mono text-sky-400 font-bold shrink-0">
                      Q{idx + 1}:
                    </span>
                    <span>{q}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Specialist Banner */}
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-900">
              <div className="flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>
                  <strong>{isOptimal ? "Physician Consultation Status: " : "Primary Specialist to Schedule: "}</strong>
                  {isOptimal ? "Routine Primary Care / General Practitioner (No Specialist Required)" : caseData.actionableGuidance.specialistToConsult}
                </span>
              </div>
            </div>

            {/* Tab Navigation Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              {isOptimal ? (
                <button
                  onClick={() => handleTabSwitch("overview")}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Brain Health Overview</span>
                </button>
              ) : (
                <button
                  onClick={() => handleTabSwitch("tests")}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Tests &amp; Treatments</span>
                </button>
              )}
              <button
                onClick={() => handleTabSwitch("overview")}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-sm transition-all"
              >
                <span>Return to Overview &amp; Signals</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
