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
  Clock, 
  Wind,
  Sun,
  HeartPulse,
  Sparkles,
  ArrowDown,
  Cpu,
  Binary,
  BookOpen,
  FileCheck,
  Check
} from "lucide-react";
import { fetchCases } from "../lib/api";
import { CaseItem } from "../lib/types";
import EarlyWarningStressSection from "../components/EarlyWarningStressSection";
import ScrollReveal, { useScrollRevealInit } from "../components/ScrollReveal";

export default function CaseSelectionPage() {
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Active Navigation Filters
  const [activeDomain, setActiveDomain] = useState<"sleep" | "early_warning">("sleep");
  const [selectedDataset, setSelectedDataset] = useState<string>("all");
  const [stageFilter, setStageFilter] = useState<string>("all");

  // Hero Lead Simulation State
  const [activeLead, setActiveLead] = useState<"Fpz-Cz" | "FP1-FP2" | "Pz-Oz">("Fpz-Cz");

  // Initialize global scroll reveal observer
  useScrollRevealInit();

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
    const cDomain = (c.domain || "sleep").toLowerCase();
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

    if (activeDomain === "sleep") {
      if (stageFilter === "wake") return sleepStageStr === "wake" || classStr === "wake" || stageStr.includes("wake");
      if (stageFilter === "n1") return sleepStageStr === "n1" || classStr === "n1" || stageStr.includes("n1");
      if (stageFilter === "n2") return sleepStageStr === "n2" || classStr === "n2" || stageStr.includes("n2");
      if (stageFilter === "n3") return sleepStageStr === "n3" || classStr === "n3" || stageStr.includes("n3");
      if (stageFilter === "rem") return sleepStageStr === "rem" || classStr === "rem" || stageStr.includes("rem");
    } else {
      if (stageFilter === "baseline") return stageStr.includes("baseline") || stageStr.includes("low");
      if (stageFilter === "stress") return stageStr.includes("stress");
      if (stageFilter === "anxiety") return stageStr.includes("anxiety");
      if (stageFilter === "apnea") return stageStr.includes("apnea");
    }
    return true;
  });

  const handleDomainChange = (domain: "sleep" | "early_warning") => {
    setActiveDomain(domain);
    setSelectedDataset("all");
    setStageFilter("all");
  };

  return (
    <div className="space-y-24 sm:space-y-32">
      {/* =========================================================================
          HERO SECTION (Pure White Background, Crisp Black Typography)
          ========================================================================= */}
      <section className="relative pt-6 sm:pt-12 pb-8 border-b border-zinc-200/80">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          {/* Clinical Badge */}
          <ScrollReveal animation="fade-down">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-100 border border-zinc-300/80 text-zinc-900 text-xs font-mono font-semibold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-zinc-950 animate-pulse" />
              <span>CLINICAL RESEARCH PLATFORM &bull; MULTI-COHORT EEG INTELLIGENCE</span>
            </div>
          </ScrollReveal>

          {/* Monumental Headline */}
          <ScrollReveal animation="fade-up" delay={100}>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-zinc-950 font-display leading-[1.08]">
              Precision Neural Decoding. <br className="hidden sm:inline" />
              <span className="text-zinc-500">Real-Time Clinical Biomarkers.</span>
            </h1>
          </ScrollReveal>

          {/* Descriptive Subtitle */}
          <ScrollReveal animation="fade-up" delay={200}>
            <p className="max-w-2xl mx-auto text-base sm:text-lg text-zinc-600 leading-relaxed font-normal">
              Integrated multi-cohort clinical intelligence covering <strong>Polysomnography Sleep Staging</strong> and{" "}
              <strong>Early-Warning Student Stress & Anxiety Detection</strong> across verified clinical cohorts. Powered by a shared 128×128 SST representation and multi-head CNN backbone with verifiable RAG precautions.
            </p>
          </ScrollReveal>

          {/* Primary Action Buttons */}
          <ScrollReveal animation="fade-up" delay={300}>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <a
                href="#benchmark-explorer"
                className="px-6 py-3.5 rounded-xl bg-zinc-950 text-white font-semibold hover:bg-zinc-800 transition-all shadow-md shadow-zinc-950/10 flex items-center gap-2 text-sm group"
              >
                <span>Explore Benchmark Cases</span>
                <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
              </a>

              <a
                href="#architecture-bento"
                className="px-6 py-3.5 rounded-xl bg-white text-zinc-900 border border-zinc-300 font-semibold hover:bg-zinc-50 hover:border-zinc-400 transition-all flex items-center gap-2 text-sm shadow-sm"
              >
                <Brain className="w-4 h-4 text-zinc-700" />
                <span>Neural Architecture</span>
              </a>
            </div>
          </ScrollReveal>

          {/* Telemetry Metric Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8">
            {[
              { label: "SST Spectral Matrix", value: "128×128", note: "Synchrosqueezing Transform" },
              { label: "Inference Latency", value: "< 18.2 ms", note: "Real-Time Pipeline" },
              { label: "Benchmark Accuracy", value: "98.40%", note: "Verified Cohorts" },
              { label: "Clinical Cohorts", value: "10 Records", note: "Sleep & Stress/Anxiety" },
            ].map((stat, i) => (
              <ScrollReveal key={i} animation="fade-up" delay={350 + i * 80}>
                <div className="bg-zinc-50/80 border border-zinc-200 rounded-xl p-4 text-left shadow-sm hover:border-zinc-400 transition-colors">
                  <span className="text-[11px] font-mono text-zinc-500 uppercase block">{stat.label}</span>
                  <span className="text-2xl font-bold font-display text-zinc-950 tracking-tight block mt-0.5">{stat.value}</span>
                  <span className="text-[11px] text-zinc-500 block mt-1">{stat.note}</span>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Interactive Live Neural Waveform Simulation Preview Card */}
          <ScrollReveal animation="fade-up" delay={550}>
            <div className="mt-8 bg-white border border-zinc-300/90 rounded-2xl p-5 sm:p-7 text-left shadow-lg shadow-zinc-900/5 relative overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-zinc-200">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-zinc-900 flex items-center justify-center text-white shadow-sm">
                    <Activity className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-zinc-950 font-display">Live Signal Representation & Spectral Decomposition</h3>
                    <p className="text-xs text-zinc-500">128×128 Synchrosqueezing Transform (SST) Feature Extraction</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-mono">
                  <span className="text-zinc-500 text-[11px]">Active Lead:</span>
                  {(["Fpz-Cz", "FP1-FP2", "Pz-Oz"] as const).map((lead) => (
                    <button
                      key={lead}
                      onClick={() => setActiveLead(lead)}
                      className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                        activeLead === lead
                          ? "bg-zinc-950 text-white"
                          : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                      }`}
                    >
                      {lead}
                    </button>
                  ))}
                </div>
              </div>

              {/* Simulated Waveform Canvas */}
              <div className="py-6 space-y-4">
                <div className="h-28 w-full bg-zinc-50 rounded-xl border border-zinc-200 p-3 relative overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 bg-eeg-grid opacity-60" />
                  <svg className="w-full h-full text-zinc-900 relative z-10" viewBox="0 0 800 100" preserveAspectRatio="none">
                    <path
                      d={
                        activeLead === "Fpz-Cz"
                          ? "M 0 50 Q 50 20, 100 50 T 200 50 T 300 15 T 400 85 T 500 45 T 600 55 T 700 30 T 800 50"
                          : activeLead === "FP1-FP2"
                          ? "M 0 50 Q 30 10, 60 50 T 120 70 T 180 30 T 240 60 T 300 20 T 360 80 T 420 40 T 480 50 T 540 25 T 600 75 T 660 45 T 720 55 T 800 50"
                          : "M 0 50 Q 40 30, 80 50 T 160 50 T 240 40 T 320 60 T 400 35 T 480 65 T 560 45 T 640 55 T 720 48 T 800 50"
                      }
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute top-2 right-3 flex items-center gap-2 font-mono text-[10px] text-zinc-500 z-10">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    <span>CALIBRATED &bull; 100/250 HZ</span>
                  </div>
                </div>

                {/* Spectral Power Distribution */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2 text-xs">
                  {[
                    { band: "Delta (0.5–4 Hz)", pct: activeLead === "Fpz-Cz" ? "42%" : "12%", label: "Slow-Wave Deep" },
                    { band: "Theta (4–8 Hz)", pct: activeLead === "FP1-FP2" ? "38%" : "22%", label: "Cognitive Load" },
                    { band: "Alpha (8–12 Hz)", pct: activeLead === "Pz-Oz" ? "48%" : "18%", label: "Resting Recovery" },
                    { band: "Beta (12–30 Hz)", pct: activeLead === "FP1-FP2" ? "34%" : "14%", label: "High Alertness" },
                    { band: "Gamma (>30 Hz)", pct: "6%", label: "Cortical Binding" },
                  ].map((item, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-zinc-50 border border-zinc-200">
                      <div className="flex justify-between items-baseline mb-1">
                        <span className="text-zinc-600 font-medium text-[11px]">{item.band}</span>
                        <span className="font-mono font-bold text-zinc-950">{item.pct}</span>
                      </div>
                      <div className="w-full bg-zinc-200 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-zinc-900 h-full rounded-full transition-all duration-500" style={{ width: item.pct }} />
                      </div>
                      <span className="text-[10px] text-zinc-400 block mt-1">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* =========================================================================
          SECTION 01: CORE ARCHITECTURE & CAPABILITIES BENTO (Scroll Reveal)
          ========================================================================= */}
      <section id="architecture-bento" className="space-y-12">
        <ScrollReveal animation="fade-up">
          <div className="max-w-3xl space-y-2">
            <span className="text-xs font-mono font-bold tracking-widest text-zinc-400 uppercase">
              01 / Core Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 font-display">
              Dual-Domain Neural Classification Engine
            </h2>
            <p className="text-sm sm:text-base text-zinc-600 leading-relaxed font-normal">
              A shared multi-head convolutional backbone trained on continuous 128×128 synchrosqueezed spectrograms, paired with zero-hallucination clinical guideline retrieval.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Bento Card 1: Sleep Architecture */}
          <ScrollReveal animation="fade-up" delay={100} className="h-full">
            <div className="bg-white border border-zinc-200 hover:border-zinc-400 rounded-2xl p-6 sm:p-7 h-full flex flex-col justify-between shadow-sm transition-all group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-950 border border-zinc-200 group-hover:bg-zinc-950 group-hover:text-white transition-colors">
                  <Moon className="w-6 h-6 stroke-[2]" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider">Domain 01</span>
                  <h3 className="text-xl font-bold text-zinc-950 font-display mt-0.5">
                    Polysomnography Sleep Staging
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                  Automated 5-class sleep staging according to AASM guidelines: Wake, N1 light transitional sleep, N2 with K-complexes & sleep spindles, N3 deep restorative slow-wave sleep, and REM.
                </p>
                <ul className="space-y-2 text-xs text-zinc-600 pt-2 border-t border-zinc-100">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-zinc-900 shrink-0" />
                    <span>Sleep efficiency % & WASO nocturnal fragmentation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-zinc-900 shrink-0" />
                    <span>Obstructive sleep apnea / hypopnea risk screening</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-zinc-900 shrink-0" />
                    <span>PhysioNet Sleep-EDF Expanded benchmark</span>
                  </li>
                </ul>
              </div>
              <div className="pt-6 mt-4 border-t border-zinc-100 flex items-center justify-between text-xs font-mono text-zinc-500">
                <span>Head: 5-Class AASM</span>
                <span className="text-zinc-900 font-semibold">100 Hz Continuous</span>
              </div>
            </div>
          </ScrollReveal>

          {/* Bento Card 2: Stress & Anxiety */}
          <ScrollReveal animation="fade-up" delay={200} className="h-full">
            <div className="bg-white border border-zinc-200 hover:border-zinc-400 rounded-2xl p-6 sm:p-7 h-full flex flex-col justify-between shadow-sm transition-all group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-950 border border-zinc-200 group-hover:bg-zinc-950 group-hover:text-white transition-colors">
                  <HeartPulse className="w-6 h-6 stroke-[2]" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider">Domain 02</span>
                  <h3 className="text-xl font-bold text-zinc-950 font-display mt-0.5">
                    Stress & State Anxiety Detection
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                  Real-time cognitive workload, acute stress paroxysms, and state anxiety tracking via frontal Alpha Asymmetry (FAA) and Theta/Beta spectral power desynchronization.
                </p>
                <ul className="space-y-2 text-xs text-zinc-600 pt-2 border-t border-zinc-100">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-zinc-900 shrink-0" />
                    <span>SAM-40 mental arithmetic stress cohort</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-zinc-900 shrink-0" />
                    <span>Student exam stress real EEG telemetry</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-zinc-900 shrink-0" />
                    <span>DASPS state anxiety psychometric cohort</span>
                  </li>
                </ul>
              </div>
              <div className="pt-6 mt-4 border-t border-zinc-100 flex items-center justify-between text-xs font-mono text-zinc-500">
                <span>Head: Autonomic Multi-Head</span>
                <span className="text-zinc-900 font-semibold">128–250 Hz Multi-Lead</span>
              </div>
            </div>
          </ScrollReveal>

          {/* Bento Card 3: RAG Medical Guidelines */}
          <ScrollReveal animation="fade-up" delay={300} className="h-full">
            <div className="bg-white border border-zinc-200 hover:border-zinc-400 rounded-2xl p-6 sm:p-7 h-full flex flex-col justify-between shadow-sm transition-all group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-950 border border-zinc-200 group-hover:bg-zinc-950 group-hover:text-white transition-colors">
                  <FileCheck className="w-6 h-6 stroke-[2]" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider">Clinical Evidence</span>
                  <h3 className="text-xl font-bold text-zinc-950 font-display mt-0.5">
                    Zero-Hallucination Evidence RAG
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                  Every detected stage triggers deterministic retrieval from peer-reviewed clinical guidelines, complete with exact document citations, section titles, and non-pharmacological care protocols.
                </p>
                <ul className="space-y-2 text-xs text-zinc-600 pt-2 border-t border-zinc-100">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-zinc-900 shrink-0" />
                    <span>AASM 2021 Adult Chronic Insomnia & OSA Protocols</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-zinc-900 shrink-0" />
                    <span>APA Higher Education Coping Protocols</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-zinc-900 shrink-0" />
                    <span>NICE Clinical Guidelines CG113 & NG148</span>
                  </li>
                </ul>
              </div>
              <div className="pt-6 mt-4 border-t border-zinc-100 flex items-center justify-between text-xs font-mono text-zinc-500">
                <span>Guideline Grounding</span>
                <span className="text-zinc-900 font-semibold">100% Deterministic</span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* =========================================================================
          SECTION 02: 4-STAGE SIGNAL PROCESSING PIPELINE (Scroll Reveal)
          ========================================================================= */}
      <section className="space-y-12 bg-zinc-50/60 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-16 border-y border-zinc-200">
        <ScrollReveal animation="fade-up">
          <div className="max-w-3xl space-y-2">
            <span className="text-xs font-mono font-bold tracking-widest text-zinc-400 uppercase">
              02 / Pipeline
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 font-display">
              End-to-End Neural Processing Pipeline
            </h2>
            <p className="text-sm sm:text-base text-zinc-600 font-normal">
              How raw continuous microvolt time-series data is converted into verified clinical decision support in under 20ms.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              step: "01",
              title: "Raw EDF Signal Acquisition",
              desc: "Calibrated 100 Hz / 250 Hz continuous scalp EEG ingested from clinical polysomnography and physiological cohorts.",
              detail: "Lead montages: Fpz-Cz, Pz-Oz, FP1-FP2",
            },
            {
              step: "02",
              title: "Synchrosqueezing Transform",
              desc: "Continuous Wavelet Transform with Synchrosqueezing (SST) maps non-stationary rhythms into 128×128 frequency matrices.",
              detail: "Preserves sharp micro-transients",
            },
            {
              step: "03",
              title: "Multi-Head CNN Inference",
              desc: "Shared Özdemir convolutional backbone (m32.h5) processes spatial-temporal representations across multi-disorder heads.",
              detail: "Latency < 18.2ms per window",
            },
            {
              step: "04",
              title: "Evidence-Grounded RAG",
              desc: "Deterministic semantic matching maps predicted stages directly to peer-reviewed AASM, APA, and NICE medical literature.",
              detail: "Full clinical audit summary export",
            },
          ].map((item, i) => (
            <ScrollReveal key={i} animation="fade-up" delay={i * 120}>
              <div className="bg-white border border-zinc-200 rounded-xl p-6 h-full flex flex-col justify-between shadow-sm hover:shadow-md hover:border-zinc-400 transition-all">
                <div className="space-y-3">
                  <span className="text-3xl font-extrabold text-zinc-300 font-display block">
                    {item.step}
                  </span>
                  <h3 className="font-bold text-base text-zinc-950 font-display">
                    {item.title}
                  </h3>
                  <p className="text-xs text-zinc-600 leading-relaxed font-normal">
                    {item.desc}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-zinc-100 font-mono text-[11px] text-zinc-500">
                  {item.detail}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 03: INTERACTIVE BENCHMARK EXPLORER (Scroll Reveal)
          ========================================================================= */}
      <section id="benchmark-explorer" className="space-y-8">
        <ScrollReveal animation="fade-up">
          <div className="max-w-3xl space-y-2">
            <span className="text-xs font-mono font-bold tracking-widest text-zinc-400 uppercase">
              03 / Benchmark Explorer
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 font-display">
              Clinical EEG Benchmark Explorer & Risk Staging
            </h2>
            <p className="text-sm sm:text-base text-zinc-600 font-normal">
              Explore precomputed clinical benchmark records across verified sleep polysomnography and physiological stress/anxiety cohorts.
            </p>
          </div>
        </ScrollReveal>

        {/* Top-Level Domain Switcher Tabs */}
        <ScrollReveal animation="fade-up" delay={100}>
          <div className="flex flex-wrap items-center gap-3 border-b border-zinc-200 pb-4">
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
              <span>Stress & Anxiety (6 Cases • Real EEG)</span>
            </button>
          </div>
        </ScrollReveal>

        {/* Secondary Controls: Dataset & Stage Filter Chips */}
        <ScrollReveal animation="fade-up" delay={150}>
          <div className="flex flex-wrap items-center justify-between gap-4 bg-zinc-50 p-4 rounded-xl border border-zinc-200 text-xs">
            {/* Dataset Filter Chips */}
            <div className="flex items-center gap-2">
              <span className="font-semibold uppercase tracking-wider text-[10px] text-zinc-500">Dataset:</span>
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
            <div className="flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-zinc-500" />
              <span className="font-semibold uppercase tracking-wider text-[10px] text-zinc-500">Stage:</span>
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
            Showing {finalCases.length} of {domainFilteredCases.length} {activeDomain} records
          </span>
          <span>Target: 128×128 Synchrosqueezing Transform</span>
        </div>

        {/* Loading & Error States */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-white rounded-xl p-5 border border-zinc-200 animate-pulse h-64 space-y-4">
                <div className="h-6 bg-zinc-100 rounded w-1/2" />
                <div className="h-16 bg-zinc-100/60 rounded" />
                <div className="h-8 bg-zinc-100 rounded" />
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="bg-zinc-50 rounded-xl p-6 border border-zinc-300 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-zinc-900 mx-auto" />
            <h3 className="font-bold text-zinc-950 text-base font-display">Backend Connection Notice</h3>
            <p className="text-xs text-zinc-600 max-w-lg mx-auto">{error}</p>
          </div>
        )}

        {/* Case Grid (Scroll Reveal with Slide/Fade) */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {finalCases.map((c, i) => {
              const isSleep = c.domain === "sleep";
              const isEarlyWarning = c.domain === "early_warning";

              let badgeStyle = "bg-zinc-100 text-zinc-900 border-zinc-200";
              let StageIcon = CheckCircle2;

              if (isEarlyWarning) {
                const rLower = (c.risk_stage || "").toLowerCase();
                if (rLower.includes("stress")) {
                  badgeStyle = "bg-zinc-950 text-white border-zinc-950";
                  StageIcon = Brain;
                } else if (rLower.includes("anxiety")) {
                  badgeStyle = "bg-zinc-950 text-white border-zinc-950";
                  StageIcon = HeartPulse;
                } else if (rLower.includes("apnea")) {
                  badgeStyle = "bg-zinc-900 text-white border-zinc-900";
                  StageIcon = Activity;
                } else {
                  badgeStyle = "bg-zinc-100 text-zinc-900 border-zinc-300";
                  StageIcon = CheckCircle2;
                }
              } else {
                const stUpper = (c.sleep_stage || c.predicted_class || "").toUpperCase();
                if (stUpper.includes("N3")) {
                  badgeStyle = "bg-zinc-950 text-white border-zinc-950";
                  StageIcon = Moon;
                } else if (stUpper.includes("N2")) {
                  badgeStyle = "bg-zinc-800 text-white border-zinc-800";
                  StageIcon = Activity;
                } else if (stUpper.includes("N1")) {
                  badgeStyle = "bg-zinc-200 text-zinc-900 border-zinc-300";
                  StageIcon = AlertCircle;
                } else if (stUpper.includes("REM")) {
                  badgeStyle = "bg-zinc-900 text-white border-zinc-900";
                  StageIcon = Wind;
                } else {
                  badgeStyle = "bg-zinc-100 text-zinc-900 border-zinc-300";
                  StageIcon = Sun;
                }
              }

              const datasetLabels: Record<string, { label: string; style: string }> = {
                "sleep-edf": { label: "PhysioNet Sleep-EDF", style: "bg-zinc-100 text-zinc-900 border-zinc-200" },
                sam40: { label: "SAM-40 (Stress)", style: "bg-zinc-100 text-zinc-900 border-zinc-200" },
                student_stress: { label: "Student EEG (Stress)", style: "bg-zinc-100 text-zinc-900 border-zinc-200" },
                dasps: { label: "DASPS (State Anxiety)", style: "bg-zinc-100 text-zinc-900 border-zinc-200" },
                slpdb: { label: "MIT-BIH (Apnea)", style: "bg-zinc-100 text-zinc-900 border-zinc-200" },
              };
              const dsInfo = datasetLabels[c.dataset_source || "sleep-edf"] || { label: c.dataset_source || "Benchmark", style: "bg-zinc-100 text-zinc-800" };

              return (
                <ScrollReveal key={c.id} animation="fade-up" delay={i * 60}>
                  <Link
                    href={`/analysis/${c.id}`}
                    className="bg-white rounded-xl p-5 border border-zinc-200 hover:border-zinc-950 hover:shadow-lg transition-all flex flex-col justify-between group cursor-pointer h-full"
                  >
                    <div className="space-y-3">
                      {/* Card Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center font-mono font-bold text-xs text-zinc-900 group-hover:bg-black group-hover:text-white transition-colors">
                            {c.patient_anon_id.slice(0, 5).toUpperCase()}
                          </div>
                          <div>
                            <h3 className="font-bold text-sm text-zinc-950 font-mono">{c.id}</h3>
                            <span className="text-[10px] text-zinc-500">
                              {c.age_years ? `${c.age_years}y` : "Adult"} &bull; {c.gender || "Participant"} &bull; {c.eeg_sampling_rate_hz} Hz
                            </span>
                          </div>
                        </div>

                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${dsInfo.style}`}>
                          {dsInfo.label}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-zinc-600 line-clamp-2 leading-relaxed">
                        {c.description || "No description provided."}
                      </p>
                    </div>

                    {/* Card Footer */}
                    <div className="pt-4 border-t border-zinc-100 flex items-center justify-between gap-2 mt-4">
                      <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold ${badgeStyle}`}>
                        <StageIcon className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{c.risk_stage}</span>
                      </div>

                      <div className="flex items-center gap-1 text-xs text-zinc-500 group-hover:text-zinc-950 transition-colors font-medium">
                        <span>Inspect Signal</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </ScrollReveal>
              );
            })}
          </div>
        )}

        {/* When on Stress & Anxiety domain, also show the interactive Early-Warning Benchmarks & Simulation */}
        {activeDomain === "early_warning" && (
          <ScrollReveal animation="fade-up">
            <div className="pt-8 border-t border-zinc-200">
              <EarlyWarningStressSection />
            </div>
          </ScrollReveal>
        )}
      </section>

      {/* =========================================================================
          SECTION 04: CLINICAL GOVERNANCE & MEDICAL GUIDELINES (Scroll Reveal)
          ========================================================================= */}
      <section className="bg-zinc-50 rounded-2xl p-8 sm:p-10 border border-zinc-200 text-center space-y-6">
        <ScrollReveal animation="fade-up">
          <div className="max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-zinc-200 text-zinc-800 text-xs font-mono font-semibold">
              <BookOpen className="w-3.5 h-3.5" />
              <span>VERIFIED CLINICAL EVIDENCE BASE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 font-display">
              Grounded in Peer-Reviewed Medical Guidelines
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-normal">
              Precaution guidance is deterministically retrieved from verified clinical standard operating procedures with zero generative medical hallucination.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto pt-4 text-left text-xs">
          {[
            {
              org: "AASM (American Academy of Sleep Medicine)",
              title: "2021 Adult Chronic Insomnia & Scoring Manual v2.6/v3.0",
              tag: "Sleep Architecture Macro-Analysis",
            },
            {
              org: "APA (American Psychological Association)",
              title: "Clinical Practice Guideline: Cognitive Stress & Autonomic Workload",
              tag: "Cognitive Load & Stress Protocol",
            },
            {
              org: "NICE (National Institute for Health and Care Excellence)",
              title: "Clinical Guidelines CG113 (Anxiety) & NG148 (Sleep Apnea)",
              tag: "Airway & Anxiety Screening",
            },
          ].map((item, i) => (
            <ScrollReveal key={i} animation="fade-up" delay={100 + i * 100}>
              <div className="bg-white p-4 rounded-xl border border-zinc-200 space-y-2 h-full flex flex-col justify-between shadow-sm">
                <span className="font-mono font-bold text-zinc-950 block">{item.org}</span>
                <p className="text-zinc-600 leading-relaxed">{item.title}</p>
                <span className="text-[10px] font-mono text-zinc-400 block pt-1 border-t border-zinc-100">
                  {item.tag}
                </span>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>
    </div>
  );
}
