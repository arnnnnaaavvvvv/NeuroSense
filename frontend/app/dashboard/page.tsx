"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Activity, 
  ShieldAlert, 
  AlertCircle, 
  CheckCircle2, 
  ChevronRight, 
  Filter, 
  Moon, 
  Brain, 
  Layers, 
  Clock, 
  Wind,
  Sun,
  HeartPulse,
  Search,
  ArrowLeft,
  ArrowRight,
  SlidersHorizontal,
  Check
} from "lucide-react";
import { fetchCases } from "../../lib/api";
import { CaseItem } from "../../lib/types";
import ScrollReveal, { useScrollRevealInit } from "../../components/ScrollReveal";

export default function BenchmarkDashboardPage() {
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Active Navigation Filters
  const [activeDomain, setActiveDomain] = useState<"sleep" | "early_warning">("sleep");
  const [stageFilter, setStageFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Initialize scroll reveal observer
  useScrollRevealInit();

  useEffect(() => {
    async function loadCases() {
      try {
        setLoading(true);
        const data = await fetchCases();
        setCases(data);
        setError(null);
      } catch (err: any) {
        console.error("Failed to load benchmark cases:", err);
        setError("Unable to connect to backend service. Please ensure the API is reachable.");
      } finally {
        setLoading(false);
      }
    }
    loadCases();
  }, []);

  // Filter cases by domain, stage, and search query
  const domainFilteredCases = cases.filter((c) => {
    const cDomain = (c.domain || "sleep").toLowerCase();
    return cDomain === activeDomain;
  });

  const stageFilteredCases = domainFilteredCases.filter((c) => {
    if (stageFilter === "all") return true;
    const stageStr = (c.risk_stage || "").toLowerCase();
    const classStr = (c.predicted_class || "").toLowerCase();
    const sleepStageStr = (c.sleep_stage || "").toLowerCase();

    if (activeDomain === "sleep") {
      if (stageFilter === "wake") return sleepStageStr === "wake" || classStr === "wake" || stageStr.includes("wake");
      if (stageFilter === "n1") return sleepStageStr === "n1" || classStr === "n1" || stageStr.includes("n1");
      if (stageFilter === "n2") return sleepStageStr === "n2" || classStr === "n2" || stageStr.includes("n2");
      if (stageFilter === "n3") return sleepStageStr === "n3" || classStr === "n3" || stageStr.includes("n3");
      if (stageFilter === "rem") return sleepStageStr === "rem" || classStr === "rem" || stageStr.includes("rem");
    } else {
      if (stageFilter === "baseline") return stageStr.includes("baseline") || classStr.includes("baseline") || stageStr.includes("relax");
      if (stageFilter === "stress") return stageStr.includes("stress");
      if (stageFilter === "anxiety") return stageStr.includes("anxiety");
      if (stageFilter === "apnea") return stageStr.includes("apnea");
    }
    return true;
  });

  const finalCases = stageFilteredCases.filter((c) => {
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
    if (p.startsWith("sc")) return p.toUpperCase();
    if (p.startsWith("st")) return p.toUpperCase();
    if (p.includes("sam40")) return "SAM-01";
    if (p.includes("student")) return "STU-11";
    if (p.includes("dasps")) return "DASPS";
    if (p.includes("mitbih")) return "MIT-01";
    return patientId.slice(0, 6).toUpperCase();
  }

  const handleDomainChange = (domain: "sleep" | "early_warning") => {
    setActiveDomain(domain);
    setStageFilter("all");
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Top Header & Breadcrumb */}
      <ScrollReveal animation="fade-down">
        <div className="space-y-4 border-b border-zinc-200 pb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-600 hover:text-zinc-950 transition-colors py-1.5 px-3 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 shadow-sm"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Platform Overview</span>
            </Link>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-zinc-950 font-display">
              Benchmark Cases & Risk Telemetry
            </h1>
            <p className="text-sm sm:text-base text-zinc-600 max-w-3xl leading-relaxed">
              Explore ground-truth clinical records across Polysomnography Sleep Staging (PhysioNet Sleep-EDF) and Early-Warning Physiological Intelligence (SAM-40, Student EEG, and DASPS). Each record includes raw microvolt waveforms, 128×128 SST spectrograms, and deterministic clinical RAG precautions.
            </p>
          </div>
        </div>
      </ScrollReveal>

      {/* Cohort Stats Header */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Active Cohort Cases", value: `${finalCases.length} Records`, note: "Filtered View" },
          { label: "Feature Matrix", value: "128×128 SST", note: "Continuous Wavelet" },
          { label: "Pipeline Latency", value: "< 18.2 ms", note: "Zero-Phase Filtered" },
          { label: "Clinical Evidence", value: "100% Grounded", note: "AASM / APA / NICE" },
        ].map((item, idx) => (
          <ScrollReveal key={idx} animation="fade-up" delay={idx * 60}>
            <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block">{item.label}</span>
              <span className="text-xl sm:text-2xl font-bold font-display text-zinc-950 block mt-0.5">{item.value}</span>
              <span className="text-[11px] text-zinc-500 block mt-1">{item.note}</span>
            </div>
          </ScrollReveal>
        ))}
      </div>

      {/* Domain Switcher Tabs */}
      <ScrollReveal animation="fade-up">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-200 pb-4">
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => handleDomainChange("sleep")}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2.5 ${
                activeDomain === "sleep"
                  ? "bg-black text-white shadow-md shadow-black/10"
                  : "bg-white text-zinc-700 hover:text-black hover:bg-zinc-50 border border-zinc-200"
              }`}
            >
              <Moon className="w-4 h-4 stroke-[2.5]" />
              <span>Sleep Staging & Disorders (4 Cases)</span>
            </button>

            <button
              onClick={() => handleDomainChange("early_warning")}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2.5 ${
                activeDomain === "early_warning"
                  ? "bg-black text-white shadow-md shadow-black/10"
                  : "bg-white text-zinc-700 hover:text-black hover:bg-zinc-50 border border-zinc-200"
              }`}
            >
              <HeartPulse className="w-4 h-4 stroke-[2.5]" />
              <span>Stress & Anxiety (6 Cases &bull; Real EEG)</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search case ID, risk stage..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-zinc-200 bg-white text-xs font-mono text-zinc-950 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:border-transparent transition-all shadow-sm"
            />
          </div>
        </div>
      </ScrollReveal>

      {/* State / Stage Filters */}
      <ScrollReveal animation="fade-up">
        <div className="flex flex-wrap items-center justify-between gap-4 bg-zinc-50 p-4 rounded-xl border border-zinc-200 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-zinc-500" />
            <span className="font-semibold uppercase tracking-wider text-[10px] text-zinc-500 font-mono">
              {activeDomain === "sleep" ? "Filter by Sleep Stage:" : "Filter by Physiological State:"}
            </span>
          </div>

          {/* Stage Filter Buttons */}
          <div className="flex flex-wrap items-center gap-1.5">
            {activeDomain === "sleep" ? (
              [
                { id: "all", label: "All" },
                { id: "wake", label: "Wake" },
                { id: "n1", label: "N1" },
                { id: "n2", label: "N2" },
                { id: "n3", label: "N3" },
                { id: "rem", label: "REM" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setStageFilter(tab.id)}
                  className={`px-2.5 py-1 rounded-md transition-all font-medium ${
                    stageFilter === tab.id
                      ? "bg-black text-white font-bold"
                      : "text-zinc-600 hover:text-zinc-950 bg-white border border-zinc-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))
            ) : (
              [
                { id: "all", label: "All" },
                { id: "baseline", label: "Baseline" },
                { id: "stress", label: "Elevated Stress" },
                { id: "anxiety", label: "Elevated Anxiety" },
                { id: "apnea", label: "Pre-Apnea" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setStageFilter(tab.id)}
                  className={`px-2.5 py-1 rounded-md transition-all font-medium ${
                    stageFilter === tab.id
                      ? "bg-black text-white font-bold"
                      : "text-zinc-600 hover:text-zinc-950 bg-white border border-zinc-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))
            )}
          </div>
        </div>
      </ScrollReveal>

      {/* Case Count Summary */}
      <div className="flex justify-between items-center text-xs text-zinc-500 font-mono px-1">
        <span>
          Showing {finalCases.length} of {domainFilteredCases.length} {activeDomain === "sleep" ? "sleep" : "stress/anxiety"} records
        </span>
        <span>Sampling: 100 Hz / 250 Hz &bull; SST Wavelet Matrix</span>
      </div>

      {/* Loading & Error States */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((n) => (
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
          <h3 className="font-bold text-zinc-950 text-base font-display">Backend Notice</h3>
          <p className="text-xs text-zinc-600 max-w-lg mx-auto">{error}</p>
        </div>
      )}

      {/* Case Grid (Dark Prominent Cards with High Contrast) */}
      {!loading && !error && finalCases.length === 0 && (
        <div className="bg-zinc-50 rounded-xl p-12 text-center border border-zinc-200 space-y-3">
          <Search className="w-8 h-8 text-zinc-400 mx-auto" />
          <h3 className="text-base font-bold text-zinc-950 font-display">No Matching Benchmark Cases Found</h3>
          <p className="text-xs text-zinc-500 max-w-md mx-auto">
            Try adjusting your search query or filter tags to inspect available clinical records.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setStageFilter("all");
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
            const isEarlyWarning = c.domain === "early_warning";

            let badgeStyle = "bg-zinc-800/90 text-zinc-200 border-zinc-700/80";
            let iconColor = "text-zinc-400";
            let StageIcon = CheckCircle2;

            if (isEarlyWarning) {
              const rLower = (c.risk_stage || "").toLowerCase();
              if (rLower.includes("stress")) {
                badgeStyle = "bg-rose-950/50 text-rose-200 border-rose-500/40 ring-1 ring-rose-500/20";
                iconColor = "text-rose-400";
                StageIcon = Brain;
              } else if (rLower.includes("anxiety")) {
                badgeStyle = "bg-amber-950/50 text-amber-200 border-amber-500/40 ring-1 ring-amber-500/20";
                iconColor = "text-amber-400";
                StageIcon = HeartPulse;
              } else if (rLower.includes("apnea")) {
                badgeStyle = "bg-sky-950/50 text-sky-200 border-sky-500/40 ring-1 ring-sky-500/20";
                iconColor = "text-sky-400";
                StageIcon = Activity;
              } else {
                badgeStyle = "bg-emerald-950/50 text-emerald-200 border-emerald-500/40 ring-1 ring-emerald-500/20";
                iconColor = "text-emerald-400";
                StageIcon = CheckCircle2;
              }
            } else {
              const stUpper = (c.sleep_stage || c.predicted_class || "").toUpperCase();
              if (stUpper.includes("N3")) {
                badgeStyle = "bg-indigo-950/50 text-indigo-200 border-indigo-500/40 ring-1 ring-indigo-500/20";
                iconColor = "text-indigo-400";
                StageIcon = Moon;
              } else if (stUpper.includes("N2")) {
                badgeStyle = "bg-emerald-950/50 text-emerald-200 border-emerald-500/40 ring-1 ring-emerald-500/20";
                iconColor = "text-emerald-400";
                StageIcon = Activity;
              } else if (stUpper.includes("N1")) {
                badgeStyle = "bg-amber-950/50 text-amber-200 border-amber-500/40 ring-1 ring-amber-500/20";
                iconColor = "text-amber-400";
                StageIcon = AlertCircle;
              } else if (stUpper.includes("REM")) {
                badgeStyle = "bg-purple-950/50 text-purple-200 border-purple-500/40 ring-1 ring-purple-500/20";
                iconColor = "text-purple-400";
                StageIcon = Wind;
              } else {
                badgeStyle = "bg-rose-950/50 text-rose-200 border-rose-500/40 ring-1 ring-rose-500/20";
                iconColor = "text-rose-400";
                StageIcon = Sun;
              }
            }

            const datasetLabels: Record<string, { label: string; style: string }> = {
              "sleep-edf": { label: "PhysioNet Sleep-EDF", style: "border-zinc-700/80 bg-zinc-800/80 text-zinc-300" },
              sam40: { label: "SAM-40 (Stress Study)", style: "border-zinc-700/80 bg-zinc-800/80 text-zinc-300" },
              student_stress: { label: "Student EEG Cohort", style: "border-zinc-700/80 bg-zinc-800/80 text-zinc-300" },
              dasps: { label: "DASPS (Anxiety Cohort)", style: "border-zinc-700/80 bg-zinc-800/80 text-zinc-300" },
              slpdb: { label: "MIT-BIH (Apnea Cohort)", style: "border-zinc-700/80 bg-zinc-800/80 text-zinc-300" },
            };
            const dsInfo = datasetLabels[c.dataset_source || "sleep-edf"] || { label: c.dataset_source || "Benchmark Cohort", style: "border-zinc-700/80 bg-zinc-800/80 text-zinc-300" };

            return (
              <ScrollReveal key={c.id} animation="fade-up" delay={i * 50}>
                <Link
                  href={`/analysis/${c.id}`}
                  className="bg-gradient-to-b from-zinc-900/95 via-zinc-950 to-zinc-950 text-white rounded-2xl p-6 border border-zinc-800/90 hover:border-zinc-700 shadow-xl hover:shadow-2xl hover:shadow-black/60 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group cursor-pointer h-full relative overflow-hidden font-outfit"
                >
                  {/* Subtle top ambient glowing rim */}
                  <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-zinc-500/30 to-transparent group-hover:via-zinc-300/60 transition-all duration-500" />

                  {/* Ambient hover light */}
                  <div className="absolute -top-16 -right-16 w-40 h-40 bg-white/[0.02] group-hover:bg-white/[0.05] rounded-full blur-2xl transition-all duration-500 pointer-events-none" />

                  <div className="flex flex-col flex-1 space-y-4 relative z-10">
                    {/* Header: Demographics + Dataset Source */}
                    <div className="flex items-center justify-between gap-2.5 min-w-0">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="px-2 py-0.5 rounded-md bg-zinc-800/90 border border-zinc-700/80 font-mono font-bold text-[11px] text-zinc-200 shrink-0 group-hover:border-zinc-600 transition-colors shadow-xs">
                          {formatPatientBadge(c.patient_anon_id)}
                        </span>
                        <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 font-mono shrink-0">
                          <span className="text-zinc-200 font-semibold">{c.age_years ? `${c.age_years}y` : "Adult"}</span>
                          <span className="text-zinc-600">&bull;</span>
                          <span>{c.gender || "Subject"}</span>
                          <span className="text-zinc-600">&bull;</span>
                          <span className="text-zinc-400">{c.eeg_sampling_rate_hz} Hz</span>
                        </div>
                      </div>

                      <span className={`text-[10px] font-mono font-medium tracking-wide px-2.5 py-0.5 rounded-full border shadow-xs shrink-0 whitespace-nowrap ${dsInfo.style}`}>
                        {dsInfo.label}
                      </span>
                    </div>

                    {/* Case Title & Technical Subtitle */}
                    <div className="space-y-1.5">
                      <div className="min-h-[2.85rem] flex items-start">
                        <h3 className="font-bold text-base sm:text-[17px] text-white font-display tracking-tight group-hover:text-zinc-100 transition-colors leading-snug line-clamp-2">
                          {c.title || c.id}
                        </h3>
                      </div>
                      <div className="flex items-center justify-between gap-2 text-[11px] font-mono text-zinc-400 pt-0.5">
                        <div className="flex items-center gap-1.5 min-w-0 truncate">
                          <span className="text-zinc-500 shrink-0">Lead:</span>
                          <span className="text-zinc-300 font-medium truncate">{c.montage_channel || "1-Ch EEG"}</span>
                        </div>
                        <span className="shrink-0 text-[10px] font-mono text-zinc-400 bg-zinc-800/80 px-2 py-0.5 rounded border border-zinc-700/60" title={c.id}>
                          {c.id.length > 18 ? `${c.id.slice(0, 15)}...` : c.id}
                        </span>
                      </div>
                    </div>

                    {/* Simplified Plain-English Description */}
                    <p className="text-xs sm:text-[13px] text-zinc-400 group-hover:text-zinc-300/90 leading-relaxed font-normal line-clamp-3 min-h-[3.6rem] transition-colors">
                      {c.description || "No description provided."}
                    </p>

                    {/* Biomarker Highlight Chips */}
                    <div className="min-h-[3.25rem] flex flex-wrap content-start items-center gap-1.5 pt-0.5">
                      {c.highlights && c.highlights.length > 0 &&
                        c.highlights.map((tag, tagIdx) => (
                          <span
                            key={tagIdx}
                            className="text-[10px] font-mono px-2.5 py-1 rounded-md bg-zinc-800/70 text-zinc-300 border border-zinc-700/60 group-hover:border-zinc-500/80 group-hover:bg-zinc-800/90 transition-colors shadow-xs"
                          >
                            {tag}
                          </span>
                        ))
                      }
                    </div>
                  </div>

                  {/* Footer: Stage Status Badge + Action Button */}
                  <div className="pt-4 mt-6 border-t border-zinc-800/80 flex items-center justify-between gap-3 relative z-10">
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold min-w-0 max-w-[62%] sm:max-w-[66%] shadow-xs ${badgeStyle}`}>
                      <StageIcon className={`w-3.5 h-3.5 shrink-0 ${iconColor}`} />
                      <span className="truncate">{c.risk_stage}</span>
                    </div>

                    <div className="flex items-center gap-1 text-xs text-zinc-300 group-hover:text-white font-medium shrink-0 whitespace-nowrap transition-colors">
                      <span>Inspect Signal</span>
                      <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            );
          })}
        </div>
      )}
    </div>
  );
}
