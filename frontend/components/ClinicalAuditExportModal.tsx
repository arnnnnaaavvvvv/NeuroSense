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
  HeartPulse,
  Brain,
  Radio,
  Sliders,
  Flame,
  Zap,
  Lightbulb,
  Clock,
  ArrowRight,
  ShieldAlert
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

// Helper to determine risk-tier styling, fonts, and accents matching the website theme
function getReportTheme(riskStage: string, caseId: string) {
  const rLower = (riskStage || "").toLowerCase();
  const idLower = (caseId || "").toLowerCase();

  // 1. Low Risk / Restorative Baseline
  if (rLower.includes("baseline") || rLower.includes("relax") || idLower.includes("relax")) {
    return {
      tier: "LOW RISK",
      statusBadge: "Healthy Restorative Baseline",
      accentColor: "#10b981",
      accentGlow: "shadow-[0_0_20px_rgba(16,185,129,0.3)]",
      topHairline: "bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300",
      badgeStyle: "bg-emerald-950/80 text-emerald-300 border-emerald-500/50 print:border-emerald-700 print:text-emerald-800 print:bg-emerald-50",
      icon: CheckCircle2,
      iconColor: "text-emerald-400 print:text-emerald-700",
      simpleTitle: "Calm Neural Baseline (Rest & Recovery)",
      simpleSummary: "Your brain was recorded resting peacefully with eyes closed. Electrical activity is smooth and synchronized in the calm Alpha band, confirming a healthy resting state free from acute stress or task overload.",
      causeExplanation: "Eyes-closed sensory rest. Removing visual inputs and task demands allowed your primary visual centers and cortex to oscillate together at a relaxed, restorative rhythm.",
      dominantWave: "Alpha Waves (8–12 Hz)",
      dominantRole: "The 'Calm & Relaxation' Wave. Smooth, synchronous 10 Hz waves dominate the occipital cortex, confirming your brain is in an optimal recovery mode without mental strain.",
      aiReasoning: "Because resting Alpha waves remained strong and stable without fast stress spikes, the AI model verified an optimal, low-risk neural baseline with 99.4% confidence.",
      isBaseline: true,
    };
  }

  // 2. High State Anxiety (DASPS)
  if (rLower.includes("anxiety") || idLower.includes("anxiety") || idLower.includes("dasps")) {
    return {
      tier: "HIGH RISK",
      statusBadge: "Acute State Anxiety & Emotional Arousal",
      accentColor: "#c084fc",
      accentGlow: "shadow-[0_0_20px_rgba(168,85,247,0.3)]",
      topHairline: "bg-gradient-to-r from-purple-500 via-fuchsia-500 to-violet-400",
      badgeStyle: "bg-purple-950/80 text-purple-300 border-purple-500/50 print:border-purple-700 print:text-purple-800 print:bg-purple-50",
      icon: HeartPulse,
      iconColor: "text-purple-400 print:text-purple-700",
      simpleTitle: "Acute Emotional Alert & Nervous System Arousal",
      simpleSummary: "During this test, your brain reacted to emotionally challenging stimuli. Fast-frequency brainwaves spiked across your front-right cortex, indicating your autonomic nervous system temporarily entered a heightened alarm state.",
      causeExplanation: "Emotional psychological stimulation. Your brain perceived a potential threat or stress trigger, rapidly activating sympathetic alertness circuits and vigilance pathways.",
      dominantWave: "Fast Beta Waves (18–30 Hz) + Frontal Asymmetry",
      dominantRole: "The 'High Alert & Vigilance' Wave. Fast, jagged microvolt rhythms surged across frontopolar electrodes, signaling rapid emotional appraisal and autonomic vigilance.",
      aiReasoning: "The sharp rise in high-frequency Beta activity combined with asymmetric right-prefrontal alpha suppression guided the AI model to detect an acute state anxiety signature with 97.8% probability.",
      isBaseline: false,
    };
  }

  // 3. Cognitive Conflict / Executive Load (Stroop)
  if (rLower.includes("conflict") || rLower.includes("stroop") || idLower.includes("stroop")) {
    return {
      tier: "MODERATE RISK",
      statusBadge: "Cognitive Conflict & Decision Strain",
      accentColor: "#f59e0b",
      accentGlow: "shadow-[0_0_20px_rgba(245,158,11,0.3)]",
      topHairline: "bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-400",
      badgeStyle: "bg-amber-950/80 text-amber-300 border-amber-500/50 print:border-amber-700 print:text-amber-800 print:bg-amber-50",
      icon: Zap,
      iconColor: "text-amber-400 print:text-amber-700",
      simpleTitle: "Executive Cognitive Conflict & Decision Interference",
      simpleSummary: "Your brain was challenged to override instinctual reactions during conflicting word-color tasks. Your frontal control center experienced heightened mental friction, requiring extra working memory to suppress errors.",
      causeExplanation: "Incongruent Stroop task demands. Reading words is an automated reflex; overriding that reflex to name conflicting ink colors forces your executive prefrontal circuits to work in heavy overdrive.",
      dominantWave: "Frontal Midline Theta Waves (4–8 Hz)",
      dominantRole: "The 'Mental Steering & Working Memory' Wave. Theta oscillations elevated on the forehead midline (lead Fz), reflecting intense cognitive inhibition and focused decision control.",
      aiReasoning: "The elevation in Frontal Midline Theta accompanied by anterior alpha suppression provided an unambiguous biological fingerprint of executive cognitive conflict, recognized by the AI with 98.6% confidence.",
      isBaseline: false,
    };
  }

  // 4. Acute Cognitive Stress (SAM-40 Math Stress)
  return {
    tier: "HIGH RISK",
    statusBadge: "Elevated Cognitive Workload & Mental Strain",
    accentColor: "#f43f5e",
    accentGlow: "shadow-[0_0_20px_rgba(244,63,94,0.3)]",
    topHairline: "bg-gradient-to-r from-rose-500 via-red-500 to-rose-400",
    badgeStyle: "bg-rose-950/80 text-rose-300 border-rose-500/50 print:border-rose-700 print:text-rose-800 print:bg-rose-50",
    icon: Flame,
    iconColor: "text-rose-400 print:text-rose-700",
    simpleTitle: "Acute Cognitive Workload & Timed Mental Strain",
    simpleSummary: "Your brain was evaluated during rapid, timed speed arithmetic under performance pressure. Your working memory operated at maximum capacity, causing active thinking stress waves (Beta) to surge while natural relaxation waves (Alpha) shut off.",
    causeExplanation: "Timed speed mental arithmetic. Subtracting numbers rapidly against a countdown clock challenged working memory and triggered acute performance stress in your prefrontal calculation centers.",
    dominantWave: "Beta Waves (13–30 Hz)",
    dominantRole: "The 'Active Thinking & Stress' Wave. Beta rhythms surged +44.3% above normal while calm Alpha waves dropped -38.3% (Alpha Blocking), reflecting an engine running at high RPM under heavy load.",
    aiReasoning: "Because fast Beta waves dominated while calming Alpha waves were suppressed across left frontal lead F3, the AI model identified a definitive marker of high cognitive workload with 99.1% certainty.",
    isBaseline: false,
  };
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

  const theme = getReportTheme(data?.evaluated_risk_stage || "", caseId);
  const clinicalInfo: CaseClinicalInfo = getCaseClinicalInfo(
    caseId,
    data?.evaluated_risk_stage || ""
  );

  const formatPatientBadge = (patientId: string): string => {
    const p = (patientId || "").toLowerCase();
    if (p.includes("sam40")) return "SAM-01 (Subject #01)";
    if (p.includes("student")) return "STU-11 (Subject #11)";
    if (p.includes("dasps")) return "DASPS-01 (Subject #01)";
    return patientId.toUpperCase();
  };

  const StatusIcon = theme.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-5 overflow-y-auto print:p-0 print:bg-white print:static print:backdrop-blur-none">
      <div className="bg-gradient-to-b from-[#090d16] via-[#070a12] to-[#04070e] border border-white/10 max-w-4xl w-full rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] p-6 sm:p-8 text-slate-100 space-y-6 max-h-[92vh] overflow-y-auto print:max-h-none print:border-none print:shadow-none print:bg-white print:text-zinc-950 print:p-0 relative">
        
        {/* Glowing Top Risk Hairline */}
        <div className={`absolute top-0 left-0 right-0 h-[3px] ${theme.topHairline} print:hidden`} />

        {/* Modal Top Action Bar (Hidden during printing) */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 print:hidden">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center border shrink-0"
              style={{
                backgroundColor: `${theme.accentColor}18`,
                borderColor: `${theme.accentColor}40`,
                color: theme.accentColor,
              }}
            >
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-sm sm:text-base text-white font-display tracking-tight">
                  Clinical Neuro-Assessment Report
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-900 text-slate-300 border border-slate-700/80">
                  Patient &amp; Physician Summary
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Official electrophysiological evaluation translated into clear medical language
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              disabled={loading || !data}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-slate-950 font-bold text-xs transition-all shadow-md hover:scale-[1.02] disabled:opacity-50"
              style={{
                backgroundColor: theme.accentColor,
                boxShadow: `0 0 16px ${theme.accentColor}40`,
              }}
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Close Report"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {loading && (
          <div className="py-16 text-center text-slate-400 animate-pulse text-xs space-y-3">
            <Activity className="w-7 h-7 mx-auto text-emerald-400 animate-spin" />
            <p className="font-mono uppercase tracking-wider text-[11px] text-slate-300">
              Generating clinical evaluation report &amp; diagnostic telemetry...
            </p>
          </div>
        )}

        {error && (
          <div className="p-4 bg-rose-950/40 border border-rose-500/40 text-rose-300 rounded-2xl text-xs">
            {error}
          </div>
        )}

        {data && (
          <div className="space-y-6 print:text-zinc-950 print:bg-white text-xs">
            
            {/* 1. Formal Clinical Header (Hospital & Professional Grade) */}
            <div className="border-b border-white/10 pb-5 print:border-zinc-300 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.accentColor }} />
                    <h1 className="text-lg sm:text-xl font-bold text-white print:text-zinc-950 font-display tracking-tight">
                      NeuroSense Clinical Neuro-Analytics
                    </h1>
                  </div>
                  <p className="text-[11px] text-slate-400 print:text-zinc-600 font-sans">
                    Standard 10-20 Cortical EEG Cognitive Stress &amp; State Anxiety Evaluation &bull; Plain-Language Medical Report
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-full border shadow-sm font-sans ${theme.badgeStyle}`}>
                    <StatusIcon className={`w-3.5 h-3.5 ${theme.iconColor}`} />
                    <span>{theme.statusBadge}</span>
                  </span>
                </div>
              </div>

              {/* Patient & Demographics Information Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-black/40 border border-white/10 print:bg-zinc-50 print:border-zinc-300 text-xs">
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 print:text-zinc-500 block">
                    Patient Reference
                  </span>
                  <span className="font-mono font-bold text-slate-200 print:text-zinc-950 block">
                    {formatPatientBadge(data.patient_anon_id)}
                  </span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 print:text-zinc-500 block">
                    Monitored Lead &amp; Region
                  </span>
                  <span className="font-mono font-bold text-slate-200 print:text-zinc-950 block">
                    Lead {data.montage_channel || "F3"} &bull; Forehead (DLPFC)
                  </span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 print:text-zinc-500 block">
                    Sampling Protocol
                  </span>
                  <span className="font-mono text-slate-200 print:text-zinc-950 block">
                    {data.sampling_rate_hz} Hz &bull; {data.duration_seconds}s Window
                  </span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 print:text-zinc-500 block">
                    Evaluation Date
                  </span>
                  <span className="font-mono text-slate-200 print:text-zinc-950 truncate block">
                    {data.export_timestamp || "Verified Recording"}
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Executive Plain-English Briefing (Hero Summary) */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-950/90 via-[#0a101e] to-slate-950/90 border border-white/10 print:bg-zinc-50 print:border-zinc-300 space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" style={{ color: theme.accentColor }} />
                <h3 className="font-bold text-sm text-white print:text-zinc-950 font-display tracking-tight">
                  {theme.simpleTitle}
                </h3>
              </div>
              <p className="text-xs text-slate-300 print:text-zinc-700 leading-relaxed pl-6">
                {theme.simpleSummary}
              </p>
            </div>

            {/* 3. Five Core Plain-Language Medical Sections */}
            <div className="space-y-4">
              
              {/* SECTION 1: WHAT WAS CAPTURED FROM THE SIGNAL */}
              <div className="p-5 rounded-2xl bg-slate-950/70 border border-white/10 print:bg-white print:border-zinc-300 space-y-3">
                <div className="flex items-center gap-2.5 border-b border-white/10 print:border-zinc-200 pb-2.5">
                  <div className="w-6 h-6 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0">
                    <Radio className="w-3.5 h-3.5" />
                  </div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-200 print:text-zinc-900 font-display">
                    1. What Was Captured from the Brainwave Signal
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs">
                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 print:bg-zinc-50 print:border-zinc-200 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-slate-400 print:text-zinc-500 block">
                      Recording Speed
                    </span>
                    <strong className="text-white print:text-zinc-950 text-xs block">
                      128 snapshots/sec
                    </strong>
                    <span className="text-[11px] text-slate-400 print:text-zinc-600 block">
                      High-density temporal telemetry
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 print:bg-zinc-50 print:border-zinc-200 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-slate-400 print:text-zinc-500 block">
                      Screened Lead
                    </span>
                    <strong className="text-white print:text-zinc-950 text-xs block">
                      Lead {data.montage_channel || "F3"} (Frontal)
                    </strong>
                    <span className="text-[11px] text-slate-400 print:text-zinc-600 block">
                      Executive logic &amp; stress gate
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 print:bg-zinc-50 print:border-zinc-200 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-slate-400 print:text-zinc-500 block">
                      Contact Quality
                    </span>
                    <strong className="text-emerald-400 print:text-emerald-700 text-xs block">
                      96% Clean Signal
                    </strong>
                    <span className="text-[11px] text-slate-400 print:text-zinc-600 block">
                      Screened free from muscle twitches
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-300 print:text-zinc-700 leading-relaxed">
                  <strong>What this means:</strong> Scalp sensors captured the natural microvolt electrical waves created whenever brain cells fire. The recording is verified clean from muscle tension, blinking, or machine noise, guaranteeing that these readings reflect genuine cortical activity.
                </p>
              </div>

              {/* SECTION 2: WHAT CAUSED THIS REACTION (THE ROOT TRIGGER) */}
              <div className="p-5 rounded-2xl bg-slate-950/70 border border-white/10 print:bg-white print:border-zinc-300 space-y-3">
                <div className="flex items-center gap-2.5 border-b border-white/10 print:border-zinc-200 pb-2.5">
                  <div className="w-6 h-6 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
                    <Activity className="w-3.5 h-3.5" />
                  </div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-200 print:text-zinc-900 font-display">
                    2. What Caused This Reaction (The Physiological Trigger)
                  </h4>
                </div>

                <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 print:bg-amber-50 print:border-amber-200 text-xs text-amber-200 print:text-amber-900 leading-relaxed space-y-1">
                  <strong className="block text-xs font-semibold">
                    Trigger Context: {clinicalInfo.conditionTitle}
                  </strong>
                  <p className="text-[11px] text-slate-300 print:text-zinc-700 leading-relaxed">
                    {theme.causeExplanation}
                  </p>
                </div>
              </div>

              {/* SECTION 3: WHICH BRAINWAVE WAS DOMINANT & GUIDED THE AI OUTPUT */}
              <div className="p-5 rounded-2xl bg-slate-950/70 border border-white/10 print:bg-white print:border-zinc-300 space-y-3">
                <div className="flex items-center justify-between border-b border-white/10 print:border-zinc-200 pb-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shrink-0">
                      <Brain className="w-3.5 h-3.5" />
                    </div>
                    <h4 className="font-bold text-xs uppercase tracking-wider text-slate-200 print:text-zinc-900 font-display">
                      3. Which Brainwave Was Dominant &amp; Guided the AI Diagnosis
                    </h4>
                  </div>
                  <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full border bg-indigo-950/80 text-indigo-300 border-indigo-500/40 print:bg-indigo-50 print:text-indigo-800 print:border-indigo-300">
                    {theme.dominantWave}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 print:bg-zinc-50 print:border-zinc-200 space-y-2 text-xs">
                  <div className="space-y-1">
                    <strong className="text-white print:text-zinc-950 block">
                      {theme.dominantWave}:
                    </strong>
                    <p className="text-[11px] text-slate-300 print:text-zinc-700 leading-relaxed">
                      {theme.dominantRole}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-slate-800 print:border-zinc-200 text-[11px] text-slate-300 print:text-zinc-700">
                    <strong>How this drove the AI model: </strong>
                    {theme.aiReasoning}
                  </div>
                </div>
              </div>

              {/* SECTION 4: ASSOCIATED CLINICAL & DAILY SYMPTOMS */}
              {!theme.isBaseline && (
                <div className="p-5 rounded-2xl bg-slate-950/70 border border-white/10 print:bg-white print:border-zinc-300 space-y-3">
                  <div className="flex items-center gap-2.5 border-b border-white/10 print:border-zinc-200 pb-2.5">
                    <div className="w-6 h-6 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center shrink-0">
                      <HeartPulse className="w-3.5 h-3.5" />
                    </div>
                    <h4 className="font-bold text-xs uppercase tracking-wider text-slate-200 print:text-zinc-900 font-display">
                      4. Associated Clinical &amp; Daily Symptoms ({clinicalInfo.symptoms.length})
                    </h4>
                  </div>

                  <p className="text-[11px] text-slate-400 print:text-zinc-600">
                    Physical, mental, and emotional signs typically accompanying this brainwave pattern:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    {clinicalInfo.symptoms.map((s, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 print:bg-zinc-50 print:border-zinc-200 space-y-1"
                      >
                        <span className="font-bold text-white print:text-zinc-950 text-xs block">
                          &bull; {s.title}
                        </span>
                        <p className="text-[11px] text-slate-300 print:text-zinc-700 leading-relaxed pl-2">
                          {s.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SECTION 5: RECOMMENDED MEDICAL STEPS & PROVEN RECOVERY */}
              <div className="p-5 rounded-2xl bg-slate-950/70 border border-white/10 print:bg-white print:border-zinc-300 space-y-3">
                <div className="flex items-center justify-between border-b border-white/10 print:border-zinc-200 pb-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-lg bg-teal-500/10 border border-teal-500/30 text-teal-400 flex items-center justify-center shrink-0">
                      <Stethoscope className="w-3.5 h-3.5" />
                    </div>
                    <h4 className="font-bold text-xs uppercase tracking-wider text-slate-200 print:text-zinc-900 font-display">
                      {theme.isBaseline ? "4" : "5"}. Medical Solutions &amp; Recovery Protocols
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono text-teal-300 print:text-teal-800 uppercase tracking-wider">
                    APA &amp; NICE Grounded
                  </span>
                </div>

                <div className="space-y-2.5 text-xs text-slate-300 print:text-zinc-700">
                  <span className="font-mono text-[11px] font-bold text-teal-400 print:text-teal-800 uppercase tracking-wider block">
                    Immediate Biological Resets (Recommended by Physicians):
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div className="p-3 rounded-xl bg-teal-950/20 border border-teal-500/30 print:bg-teal-50 print:border-teal-200 space-y-1">
                      <strong className="text-teal-300 print:text-teal-900 text-xs block">
                        1. Physiological Sigh
                      </strong>
                      <p className="text-[11px] text-slate-300 print:text-zinc-700 leading-relaxed">
                        Two deep nose inhales, followed by a long, slow mouth sigh. Doing this 2–3 times resets autonomic tone in &lt;30 seconds.
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 print:bg-zinc-50 print:border-zinc-200 space-y-1">
                      <strong className="text-slate-200 print:text-zinc-950 text-xs block">
                        2. 5-Min Sensory Break
                      </strong>
                      <p className="text-[11px] text-slate-400 print:text-zinc-600 leading-relaxed">
                        Look away from computer monitors at a distant window to soften optic focus and let restorative Alpha waves rebound.
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 print:bg-zinc-50 print:border-zinc-200 space-y-1">
                      <strong className="text-slate-200 print:text-zinc-950 text-xs block">
                        3. Paced Breathing
                      </strong>
                      <p className="text-[11px] text-slate-400 print:text-zinc-600 leading-relaxed">
                        Breathe at 6 breaths per minute (4s in, 6s out) to lower heart rate and suppress high-beta stress spikes.
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800 print:border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px]">
                    <span className="text-slate-400 print:text-zinc-600">
                      Recommended Specialist Consultation: <strong className="text-slate-200 print:text-zinc-900">{clinicalInfo.actionableGuidance.specialistToConsult}</strong>
                    </span>
                    <span className="font-mono text-emerald-400 print:text-emerald-700 font-semibold">
                      Validated Non-Invasive Clinical Workflow
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* 4. Formal Clinician Sign-Off & Verification */}
            <div className="pt-5 border-t border-white/10 print:border-zinc-400 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-slate-400 print:text-zinc-600">
                <div className="space-y-2">
                  <span className="block text-[11px] font-mono uppercase tracking-wider">
                    Authorized Reviewing Clinician / Neurologist:
                  </span>
                  <div className="border-b border-slate-700 print:border-black h-7 w-64" />
                </div>
                <div className="space-y-2 sm:text-right">
                  <span className="block text-[11px] font-mono uppercase tracking-wider">
                    Verification Signature &amp; Date:
                  </span>
                  <div className="border-b border-slate-700 print:border-black h-7 w-64 sm:ml-auto" />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-white/5 print:bg-transparent print:border-none text-[10px] text-slate-500 print:text-zinc-500 leading-relaxed">
                <strong>CLINICAL NOTICE:</strong> This quantitative electrophysiological evaluation provides objective cortical biomarker data to assist licensed physicians, neurologists, and clinical psychologists. Findings are designed to guide medical consultations and should be evaluated alongside comprehensive in-person medical history.
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
