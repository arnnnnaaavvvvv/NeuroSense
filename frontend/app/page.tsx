"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Activity, 
  ShieldAlert, 
  AlertCircle, 
  CheckCircle2, 
  Database, 
  ChevronRight, 
  Filter, 
  Info, 
  Moon, 
  Brain, 
  Layers, 
  Zap, 
  Clock, 
  Wind,
  Sun,
  HeartPulse
} from "lucide-react";
import { fetchCases } from "../lib/api";
import { CaseItem } from "../lib/types";
import EarlyWarningStressSection from "../components/EarlyWarningStressSection";

export default function CaseSelectionPage() {
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Active Navigation Filters
  const [activeDomain, setActiveDomain] = useState<"epilepsy" | "sleep" | "early_warning">("epilepsy");
  const [selectedDataset, setSelectedDataset] = useState<string>("all");
  const [stageFilter, setStageFilter] = useState<string>("all");

  useEffect(() => {
    async function loadCases() {
      try {
        setLoading(true);
        const data = await fetchCases();
        setCases(data);
        setError(null);
      } catch (err: any) {
        console.error("Failed to load cases:", err);
        setError("Unable to connect to backend service. Please verify the FastAPI backend is running.");
      } finally {
        setLoading(false);
      }
    }
    loadCases();
  }, []);

  // Filter cases by domain, dataset, and stage
  const domainFilteredCases = cases.filter((c) => {
    const cDomain = (c.domain || "epilepsy").toLowerCase();
    return cDomain === activeDomain;
  });

  const datasetFilteredCases = domainFilteredCases.filter((c) => {
    if (selectedDataset === "all") return true;
    return (c.dataset_source || "").toLowerCase() === selectedDataset.toLowerCase();
  });

  const finalCases = datasetFilteredCases.filter((c) => {
    if (stageFilter === "all") return true;
    const stageStr = (c.risk_stage || "").toLowerCase();
    const classStr = (c.predicted_class || "").toLowerCase();
    const sleepStageStr = (c.sleep_stage || "").toLowerCase();

    if (activeDomain === "epilepsy") {
      if (stageFilter === "baseline") return stageStr.includes("baseline") || stageStr.includes("healthy");
      if (stageFilter === "pre-ictal") return stageStr.includes("pre") || stageStr.includes("inter");
      if (stageFilter === "ictal") return stageStr.includes("ictal") && !stageStr.includes("pre") && !stageStr.includes("inter");
    } else if (activeDomain === "sleep") {
      // Sleep domain
      if (stageFilter === "wake") return sleepStageStr === "wake" || classStr === "wake" || stageStr.includes("wake");
      if (stageFilter === "n1") return sleepStageStr === "n1" || classStr === "n1" || stageStr.includes("n1");
      if (stageFilter === "n2") return sleepStageStr === "n2" || classStr === "n2" || stageStr.includes("n2");
      if (stageFilter === "n3") return sleepStageStr === "n3" || classStr === "n3" || stageStr.includes("n3");
      if (stageFilter === "rem") return sleepStageStr === "rem" || classStr === "rem" || stageStr.includes("rem");
    } else {
      // Early warning stress & anxiety domain
      if (stageFilter === "baseline") return stageStr.includes("baseline") || stageStr.includes("low");
      if (stageFilter === "stress") return stageStr.includes("stress");
      if (stageFilter === "anxiety") return stageStr.includes("anxiety");
      if (stageFilter === "apnea") return stageStr.includes("apnea");
    }
    return true;
  });

  // Handle Domain Switch
  const handleDomainChange = (domain: "epilepsy" | "sleep" | "early_warning") => {
    setActiveDomain(domain);
    setSelectedDataset("all");
    setStageFilter("all");
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Platform Overview Banner */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-950/60 border border-sky-500/30 text-sky-400 text-xs font-mono">
            <Brain className="w-3.5 h-3.5" />
            <span>Multi-Disorder EEG Intelligence Platform</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Clinical EEG Benchmark Explorer & Risk Staging
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Integrated multi-disorder clinical intelligence covering <strong>Epileptic Seizure Risk</strong>,{" "}
            <strong>Polysomnography Sleep Staging</strong>, and <strong>Early-Warning Student Stress & Anxiety Detection</strong> across 7 verified cohorts.
            Powered by a shared 128×128 SST representation and multi-head CNN backbone with verified RAG precautions.
          </p>
        </div>

        {/* Informational Scope Note */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between flex-wrap gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-sky-400 shrink-0" />
            <span>
              <strong>Clinical Research Prototype:</strong> Precomputed benchmark records with verified AES, ILAE, AASM, APA & NICE guideline citations.
            </span>
          </div>
          <div className="font-mono text-[11px] text-slate-400">
            Shared Backbone: <span className="text-sky-300">Özdemir CNN (m32.h5)</span>
          </div>
        </div>
      </div>

      {/* Top-Level Domain Switcher Tabs */}
      <div className="flex flex-wrap items-center gap-3 border-b border-slate-800 pb-4">
        <button
          onClick={() => handleDomainChange("epilepsy")}
          className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2.5 ${
            activeDomain === "epilepsy"
              ? "bg-sky-500 text-slate-950 shadow-lg shadow-sky-500/20"
              : "bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800/80 border border-slate-800"
          }`}
        >
          <Activity className="w-4 h-4 stroke-[2.5]" />
          <span>Epilepsy & Seizure Risk (12 Cases)</span>
        </button>

        <button
          onClick={() => handleDomainChange("sleep")}
          className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2.5 ${
            activeDomain === "sleep"
              ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
              : "bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800/80 border border-slate-800"
          }`}
        >
          <Moon className="w-4 h-4 stroke-[2.5]" />
          <span>Sleep Staging & Disorders (4 Cases)</span>
        </button>

        <button
          onClick={() => handleDomainChange("early_warning")}
          className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2.5 ${
            activeDomain === "early_warning"
              ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20"
              : "bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800/80 border border-slate-800"
          }`}
        >
          <HeartPulse className="w-4 h-4 stroke-[2.5]" />
          <span>Stress & Anxiety (6 Cases • Real EEG)</span>
        </button>
      </div>

      {/* Secondary Controls: Dataset & Stage Filter Chips */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-xs">
        {/* Dataset Filter Chips */}
        <div className="flex items-center gap-2">
          <span className="font-semibold uppercase tracking-wider text-[10px] text-slate-400">Dataset:</span>
          {activeDomain === "epilepsy" ? (
            <>
              {[
                { id: "all", label: "All Datasets" },
                { id: "chbmit", label: "CHB-MIT (Primary)" },
                { id: "bonn", label: "Bonn Univ (Live)" },
                { id: "uci", label: "UCI CSV (Instant)" },
              ].map((ds) => (
                <button
                  key={ds.id}
                  onClick={() => setSelectedDataset(ds.id)}
                  className={`px-2.5 py-1 rounded-lg transition-colors font-mono ${
                    selectedDataset === ds.id
                      ? "bg-sky-500/20 text-sky-300 border border-sky-500/40 font-bold"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {ds.label}
                </button>
              ))}
            </>
          ) : activeDomain === "sleep" ? (
            <span className="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-mono font-bold">
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
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {ds.label}
                </button>
              ))}
            </>
          )}
        </div>

        {/* Stage Filter Buttons */}
        <div className="flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-semibold uppercase tracking-wider text-[10px] text-slate-400">Stage:</span>
          {activeDomain === "epilepsy" ? (
            [
              { id: "all", label: "All Stages" },
              { id: "baseline", label: "Baseline" },
              { id: "pre-ictal", label: "Pre-Ictal" },
              { id: "ictal", label: "Ictal" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStageFilter(tab.id)}
                className={`px-2.5 py-1 rounded-md transition-all font-medium ${
                  stageFilter === tab.id
                    ? "bg-slate-700 text-white font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))
          ) : activeDomain === "sleep" ? (
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
                    ? "bg-indigo-600 text-white font-bold"
                    : "text-slate-400 hover:text-white"
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
                    ? "bg-amber-600 text-white font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Case Count Summary */}
      <div className="flex justify-between items-center text-xs text-slate-400 font-mono">
        <span>
          Showing {finalCases.length} of {domainFilteredCases.length} {activeDomain} records
        </span>
        <span>Target: 128×128 Synchrosqueezing Transform</span>
      </div>

      {/* Loading & Error States */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="glass-panel rounded-xl p-5 border border-slate-800 animate-pulse h-64 space-y-4">
              <div className="h-6 bg-slate-800 rounded w-1/2"></div>
              <div className="h-16 bg-slate-800/50 rounded"></div>
              <div className="h-8 bg-slate-800 rounded"></div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="glass-panel rounded-xl p-6 border border-rose-500/40 bg-rose-950/20 text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-rose-400 mx-auto" />
          <h3 className="font-bold text-white text-base">Backend Connection Notice</h3>
          <p className="text-xs text-slate-300 max-w-lg mx-auto">{error}</p>
        </div>
      )}

      {/* Case Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {finalCases.map((c) => {
            const isIctal = c.risk_stage?.toLowerCase().includes("ictal") && !c.risk_stage?.toLowerCase().includes("pre") && !c.risk_stage?.toLowerCase().includes("inter");
            const isPreIctal = c.risk_stage?.toLowerCase().includes("pre") || c.risk_stage?.toLowerCase().includes("inter");
            const isSleep = c.domain === "sleep";
            const isEarlyWarning = c.domain === "early_warning";

            let badgeStyle = "bg-emerald-950/60 text-emerald-300 border-emerald-500/30";
            let StageIcon = CheckCircle2;

            if (isEarlyWarning) {
              const rLower = (c.risk_stage || "").toLowerCase();
              if (rLower.includes("stress")) {
                badgeStyle = "bg-amber-950/70 text-amber-300 border-amber-500/50";
                StageIcon = Brain;
              } else if (rLower.includes("anxiety")) {
                badgeStyle = "bg-rose-950/70 text-rose-300 border-rose-500/50";
                StageIcon = HeartPulse;
              } else if (rLower.includes("apnea")) {
                badgeStyle = "bg-sky-950/70 text-sky-300 border-sky-500/50";
                StageIcon = Activity;
              } else {
                badgeStyle = "bg-emerald-950/60 text-emerald-300 border-emerald-500/30";
                StageIcon = CheckCircle2;
              }
            } else if (isSleep) {
              const stUpper = (c.sleep_stage || c.predicted_class || "").toUpperCase();
              if (stUpper.includes("N3")) {
                badgeStyle = "bg-indigo-950/70 text-indigo-300 border-indigo-500/50";
                StageIcon = Moon;
              } else if (stUpper.includes("N2")) {
                badgeStyle = "bg-sky-950/60 text-sky-300 border-sky-500/50";
                StageIcon = Activity;
              } else if (stUpper.includes("N1")) {
                badgeStyle = "bg-amber-950/60 text-amber-300 border-amber-500/50";
                StageIcon = AlertCircle;
              } else if (stUpper.includes("REM")) {
                badgeStyle = "bg-cyan-950/70 text-cyan-300 border-cyan-500/50";
                StageIcon = Wind;
              } else {
                badgeStyle = "bg-rose-950/70 text-rose-300 border-rose-500/50";
                StageIcon = Sun;
              }
            } else {
              if (isIctal) {
                badgeStyle = "bg-rose-950/60 text-rose-300 border-rose-500/40";
                StageIcon = ShieldAlert;
              } else if (isPreIctal) {
                badgeStyle = "bg-amber-950/60 text-amber-300 border-amber-500/30";
                StageIcon = AlertCircle;
              }
            }

            // Benchmark dataset label badge
            const datasetLabels: Record<string, { label: string; style: string }> = {
              chbmit: { label: "CHB-MIT (Primary)", style: "bg-sky-500/10 text-sky-400 border-sky-500/30" },
              bonn: { label: "Bonn Univ (Univariate)", style: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" },
              uci: { label: "UCI CSV (178 Features)", style: "bg-amber-500/10 text-amber-400 border-amber-500/30" },
              "sleep-edf": { label: "PhysioNet Sleep-EDF", style: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30" },
              sam40: { label: "SAM-40 (Figshare Stress)", style: "bg-amber-500/10 text-amber-400 border-amber-500/30" },
              student_stress: { label: "Student EEG (Stress)", style: "bg-purple-500/10 text-purple-400 border-purple-500/30" },
              dasps: { label: "DASPS (State Anxiety)", style: "bg-rose-500/10 text-rose-400 border-rose-500/30" },
              slpdb: { label: "MIT-BIH (Polysomnography)", style: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30" },
            };
            const dsInfo = datasetLabels[c.dataset_source || "chbmit"] || { label: c.dataset_source || "Benchmark", style: "bg-slate-800 text-slate-300" };

            return (
              <Link
                key={c.id}
                href={`/analysis/${c.id}`}
                className="glass-panel rounded-xl p-5 border border-slate-800 hover:border-sky-500/50 hover:shadow-xl hover:shadow-sky-500/10 transition-all flex flex-col justify-between group cursor-pointer"
              >
                <div className="space-y-3">
                  {/* Card Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center font-mono font-bold text-xs text-sky-400 group-hover:bg-sky-500 group-hover:text-slate-950 transition-colors">
                        {c.patient_anon_id.slice(0, 5).toUpperCase()}
                      </div>
                      <div>
                        <h2 className="font-bold text-sm text-white font-mono">{c.id}</h2>
                        <span className="text-[10px] text-slate-400">
                          {c.age_years ? `${c.age_years}y` : "Adult"} &bull; {c.gender || "Participant"} &bull; {c.eeg_sampling_rate_hz} Hz
                        </span>
                      </div>
                    </div>

                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${dsInfo.style}`}>
                      {dsInfo.label}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {c.description || "No description provided."}
                  </p>
                </div>

                {/* Card Footer */}
                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-2 mt-4">
                  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold ${badgeStyle}`}>
                    <StageIcon className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{c.risk_stage}</span>
                  </div>

                  <div className="flex items-center gap-1 text-xs text-slate-400 group-hover:text-sky-400 transition-colors font-medium">
                    <span>Inspect Waveform</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* When on Stress & Anxiety domain, also show the interactive Early-Warning Benchmarks & Simulation */}
      {activeDomain === "early_warning" && (
        <div className="pt-6 border-t border-slate-800/80">
          <EarlyWarningStressSection />
        </div>
      )}
    </div>
  );
}
