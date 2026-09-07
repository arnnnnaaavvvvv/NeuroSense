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
import EarlyWarningStressSection from "../../components/EarlyWarningStressSection";
import ScrollReveal, { useScrollRevealInit } from "../../components/ScrollReveal";

export default function BenchmarkDashboardPage() {
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Active Navigation Filters
  const [activeDomain, setActiveDomain] = useState<"sleep" | "early_warning">("sleep");
  const [selectedDataset, setSelectedDataset] = useState<string>("all");
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

  // Filter cases by domain, dataset, stage, and search query
  const domainFilteredCases = cases.filter((c) => {
    const cDomain = (c.domain || "sleep").toLowerCase();
    return cDomain === activeDomain;
  });

  const datasetFilteredCases = domainFilteredCases.filter((c) => {
    if (selectedDataset === "all") return true;
    return (c.dataset_source || "").toLowerCase() === selectedDataset.toLowerCase();
  });

  const stageFilteredCases = datasetFilteredCases.filter((c) => {
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
      (c.description || "").toLowerCase().includes(q) ||
      (c.risk_stage || "").toLowerCase().includes(q) ||
      (c.predicted_class || "").toLowerCase().includes(q)
    );
  });

  const handleDomainChange = (domain: "sleep" | "early_warning") => {
    setActiveDomain(domain);
    setSelectedDataset("all");
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

            <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
              <span className="w-2 h-2 rounded-full bg-zinc-950 animate-pulse" />
              <span>Özdemir Conv2D CNN Backbone &bull; 10 Validated Records</span>
            </div>
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

      {/* Dataset & Stage Filters */}
      <ScrollReveal animation="fade-up">
        <div className="flex flex-wrap items-center justify-between gap-4 bg-zinc-50 p-4 rounded-xl border border-zinc-200 text-xs">
          {/* Dataset Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold uppercase tracking-wider text-[10px] text-zinc-500 font-mono">Dataset:</span>
            {activeDomain === "sleep" ? (
              <span className="px-2.5 py-1 rounded-lg bg-zinc-200 text-zinc-900 border border-zinc-300 font-mono font-bold">
                PhysioNet Sleep-EDF Expanded (100 Hz PSG)
              </span>
            ) : (
              <>
                {[
                  { id: "all", label: "All Cohorts" },
                  { id: "sam40", label: "SAM-40 (Stress)" },
                  { id: "student_stress", label: "Student EEG (Stress)" },
                  { id: "dasps", label: "DASPS (Anxiety)" },
                  { id: "slpdb", label: "MIT-BIH (Apnea)" },
                ].map((ds) => (
                  <button
                    key={ds.id}
                    onClick={() => setSelectedDataset(ds.id)}
                    className={`px-2.5 py-1 rounded-lg transition-colors font-mono ${
                      selectedDataset === ds.id
                        ? "bg-black text-white font-bold"
                        : "text-zinc-600 hover:text-zinc-950 bg-white border border-zinc-200"
                    }`}
                  >
                    {ds.label}
                  </button>
                ))}
              </>
            )}
          </div>

          {/* Stage Filter Buttons */}
          <div className="flex flex-wrap items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-zinc-500" />
            <span className="font-semibold uppercase tracking-wider text-[10px] text-zinc-500 font-mono">Stage:</span>
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
              setSelectedDataset("all");
            }}
            className="px-4 py-2 rounded-lg bg-black text-white text-xs font-semibold hover:bg-zinc-800 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}

      {!loading && !error && finalCases.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {finalCases.map((c, i) => {
            const isSleep = c.domain === "sleep";
            const isEarlyWarning = c.domain === "early_warning";

            let badgeStyle = "bg-white text-zinc-950 border-white font-bold";
            let StageIcon = CheckCircle2;

            if (isEarlyWarning) {
              const rLower = (c.risk_stage || "").toLowerCase();
              if (rLower.includes("stress")) {
                badgeStyle = "bg-white text-zinc-950 border-white font-bold ring-2 ring-white/20";
                StageIcon = Brain;
              } else if (rLower.includes("anxiety")) {
                badgeStyle = "bg-white text-zinc-950 border-white font-bold ring-2 ring-white/20";
                StageIcon = HeartPulse;
              } else if (rLower.includes("apnea")) {
                badgeStyle = "bg-zinc-100 text-zinc-950 border-zinc-200 font-bold";
                StageIcon = Activity;
              } else {
                badgeStyle = "bg-zinc-800 text-zinc-100 border-zinc-700 font-medium";
                StageIcon = CheckCircle2;
              }
            } else {
              const stUpper = (c.sleep_stage || c.predicted_class || "").toUpperCase();
              if (stUpper.includes("N3")) {
                badgeStyle = "bg-white text-zinc-950 border-white font-bold shadow-sm";
                StageIcon = Moon;
              } else if (stUpper.includes("N2")) {
                badgeStyle = "bg-zinc-100 text-zinc-950 border-zinc-200 font-bold shadow-sm";
                StageIcon = Activity;
              } else if (stUpper.includes("N1")) {
                badgeStyle = "bg-zinc-200 text-zinc-900 border-zinc-300 font-semibold";
                StageIcon = AlertCircle;
              } else if (stUpper.includes("REM")) {
                badgeStyle = "bg-white text-zinc-950 border-white font-bold shadow-sm";
                StageIcon = Wind;
              } else {
                badgeStyle = "bg-zinc-300 text-zinc-950 border-zinc-400 font-semibold";
                StageIcon = Sun;
              }
            }

            const datasetLabels: Record<string, { label: string; style: string }> = {
              "sleep-edf": { label: "PhysioNet Sleep-EDF", style: "bg-zinc-900 text-zinc-300 border-zinc-800" },
              sam40: { label: "SAM-40 (Stress)", style: "bg-zinc-900 text-zinc-300 border-zinc-800" },
              student_stress: { label: "Student EEG (Stress)", style: "bg-zinc-900 text-zinc-300 border-zinc-800" },
              dasps: { label: "DASPS (State Anxiety)", style: "bg-zinc-900 text-zinc-300 border-zinc-800" },
              slpdb: { label: "MIT-BIH (Apnea)", style: "bg-zinc-900 text-zinc-300 border-zinc-800" },
            };
            const dsInfo = datasetLabels[c.dataset_source || "sleep-edf"] || { label: c.dataset_source || "Benchmark", style: "bg-zinc-900 text-zinc-300 border-zinc-800" };

            return (
              <ScrollReveal key={c.id} animation="fade-up" delay={i * 50}>
                <Link
                  href={`/analysis/${c.id}`}
                  className="bg-zinc-950 text-white rounded-2xl p-6 border border-zinc-800 hover:border-zinc-500 shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all flex flex-col justify-between group cursor-pointer h-full relative overflow-hidden"
                >
                  <div className="space-y-4">
                    {/* Card Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center font-mono font-bold text-xs text-zinc-200 group-hover:bg-white group-hover:text-zinc-950 transition-colors shadow-inner">
                          {c.patient_anon_id.slice(0, 5).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-bold text-sm text-white font-mono tracking-tight group-hover:text-zinc-200 transition-colors">
                            {c.id}
                          </h3>
                          <span className="text-[11px] text-zinc-400 font-mono">
                            {c.age_years ? `${c.age_years}y` : "Adult"} &bull; {c.gender || "Participant"} &bull; {c.eeg_sampling_rate_hz} Hz
                          </span>
                        </div>
                      </div>

                      <span className={`text-[10px] font-mono px-2.5 py-1 rounded-md border ${dsInfo.style}`}>
                        {dsInfo.label}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed font-normal">
                      {c.description || "No description provided."}
                    </p>
                  </div>

                  {/* Card Footer */}
                  <div className="pt-5 border-t border-zinc-800/80 flex items-center justify-between gap-2 mt-5">
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs ${badgeStyle}`}>
                      <StageIcon className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{c.risk_stage}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-zinc-300 group-hover:text-white transition-colors font-medium">
                      <span>Inspect Signal</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            );
          })}
        </div>
      )}

      {/* Early-Warning Simulation Head & Confusion Matrix (Interactive Tab) */}
      {activeDomain === "early_warning" && (
        <ScrollReveal animation="fade-up">
          <div className="pt-8 border-t border-zinc-200">
            <EarlyWarningStressSection />
          </div>
        </ScrollReveal>
      )}
    </div>
  );
}
