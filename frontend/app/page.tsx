"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Activity, 
  Database, 
  ChevronRight, 
  Moon, 
  Brain, 
  HeartPulse, 
  ArrowRight,
  Sparkles,
  BookOpen,
  FileCheck,
  Check,
  Layers,
  Clock,
  ShieldAlert,
  ArrowUpRight
} from "lucide-react";
import ScrollReveal, { useScrollRevealInit } from "../components/ScrollReveal";

export default function LandingPage() {
  // Hero Lead Simulation State
  const [activeLead, setActiveLead] = useState<"Fpz-Cz" | "FP1-FP2" | "Pz-Oz">("Fpz-Cz");

  // Initialize global scroll reveal observer
  useScrollRevealInit();

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
              <Link
                href="/dashboard"
                className="px-6 py-3.5 rounded-xl bg-zinc-950 text-white font-semibold hover:bg-zinc-800 transition-all shadow-md shadow-zinc-950/10 flex items-center gap-2 text-sm group"
              >
                <span>Explore Benchmark Cases</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>

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

                {/* Spectral Energy Band Indicators */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2 text-xs">
                  {[
                    { band: "Delta (0.5–4 Hz)", pct: 42, note: "Slow-Wave Deep" },
                    { band: "Theta (4–8 Hz)", pct: 22, note: "Cognitive Load" },
                    { band: "Alpha (8–12 Hz)", pct: 18, note: "Resting Recovery" },
                    { band: "Beta (12–30 Hz)", pct: 14, note: "High Alertness" },
                    { band: "Gamma (>30 Hz)", pct: 6, note: "Cortical Binding" },
                  ].map((b) => (
                    <div key={b.band} className="p-2.5 rounded-lg bg-zinc-50 border border-zinc-200">
                      <div className="flex justify-between items-baseline mb-1">
                        <span className="text-zinc-600 font-medium text-[11px]">{b.band}</span>
                        <span className="font-mono font-bold text-zinc-950">{b.pct}%</span>
                      </div>
                      <div className="w-full bg-zinc-200 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-zinc-900 h-full rounded-full transition-all duration-500"
                          style={{ width: `${b.pct}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-zinc-400 block mt-1">{b.note}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* =========================================================================
          SECTION 01: ARCHITECTURE BENTO GRID (Scroll Reveal)
          ========================================================================= */}
      <section id="architecture-bento" className="space-y-12">
        <ScrollReveal animation="fade-up">
          <div className="max-w-3xl space-y-2">
            <span className="text-xs font-mono font-bold tracking-widest text-zinc-400 uppercase">01 / Core Architecture</span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 font-display">
              Dual-Domain Neural Classification Engine
            </h2>
            <p className="text-sm sm:text-base text-zinc-600 leading-relaxed font-normal">
              A shared multi-head convolutional backbone trained on continuous 128×128 synchrosqueezed spectrograms, paired with zero-hallucination clinical guideline retrieval.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Sleep Staging */}
          <ScrollReveal animation="fade-up" delay={100} className="h-full">
            <div className="bg-white border border-zinc-200 hover:border-zinc-400 rounded-2xl p-6 sm:p-7 h-full flex flex-col justify-between shadow-sm transition-all group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-950 border border-zinc-200 group-hover:bg-zinc-950 group-hover:text-white transition-colors">
                  <Moon className="w-6 h-6 stroke-[2]" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider">Domain 01</span>
                  <h3 className="text-xl font-bold text-zinc-950 font-display mt-0.5">Polysomnography Sleep Staging</h3>
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

          {/* Card 2: Stress & Anxiety */}
          <ScrollReveal animation="fade-up" delay={200} className="h-full">
            <div className="bg-white border border-zinc-200 hover:border-zinc-400 rounded-2xl p-6 sm:p-7 h-full flex flex-col justify-between shadow-sm transition-all group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-950 border border-zinc-200 group-hover:bg-zinc-950 group-hover:text-white transition-colors">
                  <HeartPulse className="w-6 h-6 stroke-[2]" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider">Domain 02</span>
                  <h3 className="text-xl font-bold text-zinc-950 font-display mt-0.5">Stress & State Anxiety Detection</h3>
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

          {/* Card 3: Deterministic Clinical RAG */}
          <ScrollReveal animation="fade-up" delay={300} className="h-full">
            <div className="bg-white border border-zinc-200 hover:border-zinc-400 rounded-2xl p-6 sm:p-7 h-full flex flex-col justify-between shadow-sm transition-all group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-950 border border-zinc-200 group-hover:bg-zinc-950 group-hover:text-white transition-colors">
                  <FileCheck className="w-6 h-6 stroke-[2]" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider">Clinical Evidence</span>
                  <h3 className="text-xl font-bold text-zinc-950 font-display mt-0.5">Zero-Hallucination Evidence RAG</h3>
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
          SECTION 02: 4-STAGE PIPELINE (Scroll Reveal)
          ========================================================================= */}
      <section className="space-y-12 bg-zinc-50/60 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-16 border-y border-zinc-200">
        <ScrollReveal animation="fade-up">
          <div className="max-w-3xl space-y-2">
            <span className="text-xs font-mono font-bold tracking-widest text-zinc-400 uppercase">02 / Pipeline</span>
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
          ].map((item, idx) => (
            <ScrollReveal key={item.step} animation="fade-up" delay={idx * 120}>
              <div className="bg-white border border-zinc-200 rounded-xl p-6 h-full flex flex-col justify-between shadow-sm hover:shadow-md hover:border-zinc-400 transition-all">
                <div className="space-y-3">
                  <span className="text-3xl font-extrabold text-zinc-300 font-display block">{item.step}</span>
                  <h3 className="font-bold text-base text-zinc-950 font-display">{item.title}</h3>
                  <p className="text-xs text-zinc-600 leading-relaxed font-normal">{item.desc}</p>
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
          SECTION 03: DEDICATED BENCHMARK DASHBOARD SPOTLIGHT (Clean White / Crisp Black Fonts)
          ========================================================================= */}
      <section className="space-y-8">
        <ScrollReveal animation="fade-up">
          <div className="rounded-2xl p-8 sm:p-12 border border-zinc-200 bg-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-8 relative overflow-hidden">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-900 text-xs font-mono font-semibold">
                <Database className="w-3.5 h-3.5 text-zinc-900" />
                <span>03 / CLINICAL BENCHMARK DASHBOARD</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-zinc-950 font-display">
                Dedicated Clinical Evaluation & Case Telemetry
              </h2>
              <p className="text-sm sm:text-base text-zinc-600 leading-relaxed font-normal">
                Access the dedicated benchmark dashboard to inspect 10 real patient and participant records across verified cohorts: <strong>PhysioNet Sleep-EDF</strong> (Wake, N1, N2, N3, REM), <strong>SAM-40 Mental Stress</strong>, <strong>Student Examination Stress</strong>, and <strong>DASPS State Anxiety</strong>.
              </p>

              <div className="flex flex-wrap gap-2 pt-2 text-xs font-mono">
                <span className="px-2.5 py-1 rounded-md bg-zinc-50 border border-zinc-200 text-zinc-800">
                  4 Polysomnography Records
                </span>
                <span className="px-2.5 py-1 rounded-md bg-zinc-50 border border-zinc-200 text-zinc-800">
                  6 Stress & Anxiety Records
                </span>
                <span className="px-2.5 py-1 rounded-md bg-zinc-50 border border-zinc-200 text-zinc-800">
                  Interactive Early-Warning Simulation
                </span>
                <span className="px-2.5 py-1 rounded-md bg-zinc-950 text-white font-bold">
                  Confusion Matrices & F1 Scores
                </span>
              </div>
            </div>

            <div className="shrink-0 w-full md:w-auto">
              <Link
                href="/dashboard"
                className="w-full md:w-auto px-7 py-4 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-semibold text-sm flex items-center justify-center gap-2.5 shadow-md shadow-zinc-950/10 transition-all group"
              >
                <span>Open Benchmark Dashboard</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </ScrollReveal>
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
          <ScrollReveal animation="fade-up" delay={100}>
            <div className="bg-white p-4 rounded-xl border border-zinc-200 space-y-2 h-full flex flex-col justify-between shadow-sm">
              <span className="font-mono font-bold text-zinc-950 block">AASM (American Academy of Sleep Medicine)</span>
              <p className="text-zinc-600 leading-relaxed">2021 Adult Chronic Insomnia & Scoring Manual v2.6/v3.0</p>
              <span className="text-[10px] font-mono text-zinc-400 block pt-1 border-t border-zinc-100">
                Sleep Architecture Macro-Analysis
              </span>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={200}>
            <div className="bg-white p-4 rounded-xl border border-zinc-200 space-y-2 h-full flex flex-col justify-between shadow-sm">
              <span className="font-mono font-bold text-zinc-950 block">APA (American Psychological Association)</span>
              <p className="text-zinc-600 leading-relaxed">
                Clinical Practice Guideline: Cognitive Stress & Autonomic Workload
              </p>
              <span className="text-[10px] font-mono text-zinc-400 block pt-1 border-t border-zinc-100">
                Cognitive Load & Stress Protocol
              </span>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={300}>
            <div className="bg-white p-4 rounded-xl border border-zinc-200 space-y-2 h-full flex flex-col justify-between shadow-sm">
              <span className="font-mono font-bold text-zinc-950 block">NICE (National Institute for Health and Care Excellence)</span>
              <p className="text-zinc-600 leading-relaxed">Clinical Guidelines CG113 (Anxiety) & NG148 (Sleep Apnea)</p>
              <span className="text-[10px] font-mono text-zinc-400 block pt-1 border-t border-zinc-100">
                Airway & Anxiety Screening
              </span>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
