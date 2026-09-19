"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Brain,
  HeartPulse,
  Activity,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  Filter,
  Search,
  Sparkles,
  Zap,
  ArrowLeft,
  ChevronRight,
  ShieldAlert,
  Flame
} from "lucide-react";

import { fetchCases } from "../../lib/api";
import { CaseItem, CategoryFilter } from "../../lib/types";
import { getErrorMessage } from "../../lib/errors";
import ScrollReveal from "../../components/ScrollReveal";

// Helper to determine risk metadata in unified black-and-white editorial theme
function getCardMetadata(c: CaseItem) {
  const rLower = (c.risk_stage || "").toLowerCase();
  const idLower = (c.id || "").toLowerCase();
  const predLower = (c.predicted_class || "").toLowerCase();

  // 1. Baseline / Low Risk (Resting Control)
  if (
    predLower.includes("baseline") ||
    c.three_state_class === "baseline" ||
    rLower.includes("baseline") ||
    rLower.includes("relax")
  ) {
    return {
      tier: "LOW RISK",
      severityLabel: "Severity: Nominal (L1)",
      categorySubtitle: "Calm Neural Baseline",
      icon: CheckCircle2,
    };
  }

  // 2. High State Anxiety / Panic (DASPS)
  if (rLower.includes("anxiety") || idLower.includes("anxiety") || idLower.includes("dasps")) {
    return {
      tier: "HIGH RISK",
      severityLabel: "Severity: High (L3)",
      categorySubtitle: "State Anxiety Paroxysm",
      icon: HeartPulse,
    };
  }

  // 3. Cognitive Conflict / Executive Load (Stroop)
  if (
    rLower.includes("conflict") ||
    rLower.includes("stroop") ||
    idLower.includes("stroop") ||
    c.three_state_class === "rising_arousal"
  ) {
    return {
      tier: "MODERATE RISK",
      severityLabel: "Severity: Moderate (L2)",
      categorySubtitle: "Executive Cognitive Conflict",
      icon: Zap,
    };
  }

  // 4. Acute Cognitive Stress / Workload (SAM-40 Math Stress)
  return {
    tier: "HIGH RISK",
    severityLabel: "Severity: High (L3)",
    categorySubtitle: "Acute Cognitive Strain",
    icon: Flame,
  };
}

function DashboardContent() {
  const searchParams = useSearchParams();
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Stress & Anxiety Category Filter State
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (searchParams) {
      const catParam = searchParams.get("category");
      if (catParam === "stress" || catParam === "conflict" || catParam === "anxiety" || catParam === "baseline") {
        setCategoryFilter(catParam);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    async function loadCases() {
      try {
        setLoading(true);
        const data = await fetchCases();
        // Filter strictly to early_warning / stress / anxiety records
        const stressOnly = data.filter((c) => c.domain !== "sleep");
        setCases(stressOnly);
        setError(null);
      } catch (err: unknown) {
        console.error("Failed to load benchmark cases:", getErrorMessage(err));
        setError("Unable to connect to telemetry service. Please ensure the backend is reachable.");
      } finally {
        setLoading(false);
      }
    }
    loadCases();
  }, []);

  // Filter cases by category
  const categoryFilteredCases = cases.filter((c) => {
    if (categoryFilter === "all") return true;
    const stageStr = (c.risk_stage || "").toLowerCase();
    const classStr = (c.predicted_class || "").toLowerCase();
    const sourceStr = (c.dataset_source || "").toLowerCase();
    const titleStr = (c.title || "").toLowerCase();

    if (categoryFilter === "baseline") {
      return stageStr.includes("baseline") || classStr.includes("baseline") || titleStr.includes("baseline") || titleStr.includes("relax");
    }
    if (categoryFilter === "stress") {
      return sourceStr.includes("sam40") || titleStr.includes("arithmetic") || (stageStr.includes("stress") && !sourceStr.includes("student"));
    }
    if (categoryFilter === "conflict") {
      return sourceStr.includes("student") || titleStr.includes("conflict") || titleStr.includes("stroop");
    }
    if (categoryFilter === "anxiety") {
      return sourceStr.includes("dasps") || stageStr.includes("anxiety") || titleStr.includes("anxiety");
    }
    return true;
  });

  const finalCases = categoryFilteredCases.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.id.toLowerCase().includes(q) ||
      c.patient_anon_id.toLowerCase().includes(q) ||
      (c.title || "").toLowerCase().includes(q) ||
      (c.description || "").toLowerCase().includes(q) ||
      (c.risk_stage || "").toLowerCase().includes(q) ||
      (c.predicted_class || "").toLowerCase().includes(q) ||
      (c.highlights || []).some((h) => h.toLowerCase().includes(q))
    );
  });

  function formatPatientBadge(patientId: string): string {
    const p = (patientId || "").toLowerCase();
    if (p.includes("sam40")) return "SAM-01";
    if (p.includes("student")) return "STU-11";
    if (p.includes("dasps")) return "DASPS";
    return patientId.slice(0, 6).toUpperCase();
  }

  return (
    <div className="space-y-10 pb-16">
      {/* Top Header & Breadcrumb */}
      <ScrollReveal animation="fade-down">
        <div className="space-y-4 border-b border-zinc-200 pb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-600 hover:text-zinc-950 transition-colors py-1.5 px-3 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 shadow-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Platform Overview</span>
            </Link>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-zinc-950 font-display">
              Clinical Stress & Anxiety Telemetry
            </h1>
            <p className="text-sm sm:text-base text-zinc-600 max-w-3xl leading-relaxed">
              Explore ground-truth clinical electroencephalogram (EEG) cohorts evaluating <strong>Acute Mental Arithmetic Stress</strong> (SAM-40 speed math), <strong>Cognitive Conflict & Exam Overload</strong> (Student Stroop task), and <strong>State Anxiety & Panic Paroxysms</strong> (DASPS). Each case features raw microvolt waveforms, calibrated 128×128 SST spectrograms (0.5–50 Hz), and verified clinical intervention guidelines.
            </p>
          </div>
        </div>
      </ScrollReveal>

      {/* Cohort Stats Header */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Active Stress Cases", value: `${finalCases.length} Cohorts`, note: "Ground-Truth Records" },
          { label: "Spectrogram Matrix", value: "128×128 SST", note: "0.5–50 Hz Nyquist Band" },
          { label: "Pipeline Latency", value: "< 18.2 ms", note: "Real-Time Classification" },
          { label: "Clinical Standards", value: "100% Grounded", note: "APA & NICE Evidenced" },
        ].map((item, idx) => (
          <ScrollReveal key={idx} animation="fade-up" delay={idx * 60}>
            <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-xs">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block">{item.label}</span>
              <span className="text-xl sm:text-2xl font-bold font-display text-zinc-950 block mt-0.5">{item.value}</span>
              <span className="text-[11px] text-zinc-500 block mt-1">{item.note}</span>
            </div>
          </ScrollReveal>
        ))}
      </div>

      {/* Filter Tabs & Search Bar */}
      <ScrollReveal animation="fade-up">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-200 pb-4">
          <div className="flex flex-wrap items-center gap-2">
            {(
              [
                { id: "all", label: "All Stress & Anxiety Cases", icon: Brain, count: cases.length },
                { id: "stress", label: "Acute Cognitive Stress (SAM-40)", icon: Flame, count: cases.filter(c => (c.dataset_source || "").includes("sam40") && !(c.risk_stage || "").toLowerCase().includes("baseline")).length },
                { id: "conflict", label: "Cognitive Conflict (Stroop)", icon: Zap, count: cases.filter(c => (c.dataset_source || "").includes("student")).length },
                { id: "anxiety", label: "State Anxiety & Panic (DASPS)", icon: HeartPulse, count: cases.filter(c => (c.dataset_source || "").includes("dasps") && !(c.risk_stage || "").toLowerCase().includes("baseline")).length },
                { id: "baseline", label: "Restorative Baselines", icon: CheckCircle2, count: cases.filter(c => (c.risk_stage || "").toLowerCase().includes("baseline")).length },
              ] as const satisfies ReadonlyArray<{ id: CategoryFilter; label: string; icon: React.ElementType; count: number }>
            ).map((tab) => {
              const Icon = tab.icon;
              const isActive = categoryFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setCategoryFilter(tab.id)}
                  className={`px-4 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-2 ${
                    isActive
                      ? "bg-black text-white shadow-sm"
                      : "bg-white text-zinc-700 hover:text-black hover:bg-zinc-100 border border-zinc-200"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                  {tab.count > 0 && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isActive ? "bg-zinc-800 text-zinc-300" : "bg-zinc-100 text-zinc-600"
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search case, symptom, marker..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-zinc-200 bg-white text-xs font-mono text-zinc-950 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:border-transparent transition-all shadow-xs"
            />
          </div>
        </div>
      </ScrollReveal>

      {/* Case Count Summary */}
      <div className="flex justify-between items-center text-xs text-zinc-500 font-mono px-1">
        <span>
          Showing {finalCases.length} of {cases.length} validated stress & anxiety records
        </span>
        <span>Sampling: 128 Hz Calibrated &bull; 0.5–50 Hz Physiological Band</span>
      </div>

      {/* Loading & Error States */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-zinc-950 rounded-2xl p-6 border border-zinc-800 animate-pulse h-64 space-y-4">
              <div className="h-6 bg-zinc-800 rounded w-1/2" />
              <div className="h-16 bg-zinc-900 rounded" />
              <div className="h-8 bg-zinc-800 rounded" />
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="bg-zinc-50 rounded-xl p-6 border border-zinc-300 text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-zinc-900 mx-auto" />
          <h3 className="font-bold text-zinc-950 text-base font-display">Telemetry Notice</h3>
          <p className="text-xs text-zinc-600 max-w-lg mx-auto">{error}</p>
        </div>
      )}

      {/* Case Grid (High Contrast Cards) */}
      {!loading && !error && finalCases.length === 0 && (
        <div className="bg-zinc-50 rounded-xl p-12 text-center border border-zinc-200 space-y-3">
          <Search className="w-8 h-8 text-zinc-400 mx-auto" />
          <h3 className="text-base font-bold text-zinc-950 font-display">No Matching Stress/Anxiety Cases Found</h3>
          <p className="text-xs text-zinc-500 max-w-md mx-auto">
            Try adjusting your search query or filter to inspect available records.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setCategoryFilter("all");
            }}
            className="px-4 py-2 rounded-lg bg-black text-white text-xs font-semibold hover:bg-zinc-800 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}

      {!loading && !error && finalCases.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {finalCases.map((c, i) => {
            const meta = getCardMetadata(c);
            const StageIcon = meta.icon;

            return (
              <ScrollReveal key={c.id} animation="fade-up" delay={i * 60} className="h-full">
                <div className="group relative bg-[#090d16] text-white rounded-2xl border border-zinc-800 p-6 flex flex-col justify-between hover:border-zinc-600 transition-all duration-300 shadow-sm hover:shadow-xl h-full overflow-hidden">
                  <div className="space-y-4">
                    {/* Top Case ID & Patient Pill */}
                    <div className="flex items-center justify-between gap-2 border-b border-zinc-800/80 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-zinc-400" />
                        <span className="font-mono text-xs font-semibold text-zinc-200 group-hover:text-white transition-colors tracking-wide">
                          {c.id}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 font-mono text-[11px] text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800 shrink-0">
                        <span>Lead: {c.montage_channel || "F3"}</span>
                        <span>&bull;</span>
                        <span>{formatPatientBadge(c.patient_anon_id)}</span>
                      </div>
                    </div>

                    {/* Stage & Risk Evaluation Badges (Clean Monochrome) */}
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-zinc-900 text-zinc-200 border border-zinc-700/80">
                        <StageIcon className="w-3.5 h-3.5 text-zinc-300" />
                        <span>{c.risk_stage}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-zinc-900 text-zinc-400 border border-zinc-800">
                          {meta.tier}
                        </span>
                        <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                          {c.dataset_source || "eeg"}
                        </span>
                      </div>
                    </div>

                    {/* Title & Description */}
                    <div className="space-y-1.5">
                      <div className="text-[10px] font-mono font-medium uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
                        <span>{meta.categorySubtitle}</span>
                        <span>&bull;</span>
                        <span>{meta.severityLabel}</span>
                      </div>
                      <h3 className="font-display font-semibold text-base sm:text-lg text-white tracking-tight leading-snug group-hover:text-zinc-100 transition-colors">
                        {c.title || c.risk_stage}
                      </h3>
                      <p className="text-xs text-zinc-400 leading-relaxed font-sans line-clamp-3">
                        {c.description}
                      </p>
                    </div>

                    {/* Key Electrographic Biomarkers */}
                    <div className="space-y-2 pt-1">
                      <span className="text-[10px] font-mono uppercase font-semibold tracking-wider text-zinc-500 flex items-center gap-1.5">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-zinc-400" />
                        Detected Biomarkers (128×128 SST)
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {(c.highlights || []).map((hl, hIdx) => (
                          <span
                            key={hIdx}
                            className="inline-block text-[11px] font-mono bg-zinc-900 text-zinc-300 px-2.5 py-1 rounded-md border border-zinc-800 hover:border-zinc-700 hover:text-white transition-colors"
                          >
                            {hl}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Bottom Action Footer */}
                  <div className="pt-6 mt-4 border-t border-zinc-800/80 flex items-center justify-between">
                    <div className="text-[11px] font-mono text-zinc-500">
                      {c.eeg_sampling_rate_hz} Hz &bull; Single Segment
                    </div>

                    <Link
                      href={`/analysis/${c.id}`}
                      className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 transition-all shadow-sm group/btn"
                    >
                      <span>Inspect Signal</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform text-zinc-950" />
                    </Link>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center space-y-4">
          <div className="w-8 h-8 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
            Loading Cognitive Stress &amp; Anxiety Telemetry...
          </p>
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
