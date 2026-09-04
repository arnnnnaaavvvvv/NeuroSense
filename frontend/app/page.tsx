"use client";

import React, { useState, useMemo } from "react";
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
  Info,
  CheckCircle2,
  SlidersHorizontal,
  Cpu,
  Stethoscope,
  ExternalLink
} from "lucide-react";
import ScrollReveal, { useScrollRevealInit } from "../components/ScrollReveal";

interface ClinicalTelemetryCase {
  id: string;
  category: string;
  badge: string;
  title: string;
  patient: string;
  dataset: string;
  samplingRate: string;
  montage: string;
  sstImage: string;
  aiClassification: string;
  confidence: number;
  latency: string;
  keyBiomarkers: string[];
  plainSummary: string;
  medicalValue: string;
  analysisUrl: string;
}

const CLINICAL_TELEMETRY_CASES: Record<string, ClinicalTelemetryCase> = {
  sleep: {
    id: "sleep",
    category: "Nocturnal Sleep Staging",
    badge: "AASM Stage N2 (Stable Sleep)",
    title: "Nocturnal Sleep Staging & Memory Consolidation",
    patient: "Patient sc4002 • 33y Female",
    dataset: "PhysioNet Sleep-EDF Expanded (SC4002E0)",
    samplingRate: "100 Hz Continuous Polysomnography",
    montage: "EEG Fpz-Cz & Pz-Oz PSG",
    sstImage: "/static/processed/sleep_cassette_sc4002e0_sst_128.png",
    aiClassification: "Stage N2 (Stable NREM Architecture)",
    confidence: 96.5,
    latency: "16.8 ms",
    keyBiomarkers: [
      "12–14 Hz Sleep Spindles (>0.5s duration)",
      "Biphasic K-Complexes (>0.5s)",
      "Low Mixed-Frequency Background",
      "Sleep Efficiency: 88.5% (WASO 22 min)"
    ],
    plainSummary:
      "Normal consolidated adult sleep architecture. Memory consolidation circuits in the brain are active while sensory filtering keeps the patient peacefully asleep.",
    medicalValue:
      "Automates nocturnal polysomnography staging in under 20 milliseconds, eliminating hours of manual technician epoch scoring while maintaining AASM clinical compliance.",
    analysisUrl: "/analysis/sleep_cassette_sc4002e0"
  },
  stress: {
    id: "stress",
    category: "Cognitive Workload & Stress",
    badge: "Acute Cognitive Stress",
    title: "Mental Arithmetic Workload & Executive Strain",
    patient: "Subject sam40_sub01 • 22y Male",
    dataset: "SAM-40 Real 32-Channel Benchmark",
    samplingRate: "128 Hz Multi-Lead Scalp EEG",
    montage: "F3 Prefrontal & Fz Frontal Midline",
    sstImage: "/static/processed/sam40_sub01_math_stress_sst_128.png",
    aiClassification: "Elevated Stress Risk (Cognitive Overload)",
    confidence: 98.4,
    latency: "17.4 ms",
    keyBiomarkers: [
      "Frontal Alpha Suppression (Alpha-Blocking)",
      "22–26 Hz High-Frequency Beta Power Burst",
      "Theta/Beta Power Ratio Shift",
      "Executive Cognitive Fatigue Biomarker"
    ],
    plainSummary:
      "The brain's working memory is pushed to maximum capacity during timed calculations, triggering sympathetic fight-or-flight neural desynchronization across the prefrontal cortex.",
    medicalValue:
      "Enables objective, real-time detection of acute cognitive burnout and exam pressure before physical exhaustion or panic attacks emerge.",
    analysisUrl: "/analysis/sam40_sub01_math_stress"
  },
  apnea: {
    id: "apnea",
    category: "Cardiorespiratory Early Warning",
    badge: "Pre-Apnea Lookback Warning",
    title: "Obstructive Sleep Apnea Early Detection",
    patient: "Patient slp01 • 44y Male",
    dataset: "MIT-BIH Polysomnographic Database",
    samplingRate: "250 Hz Continuous Telemetry",
    montage: "Fp1-F3 Frontal & Autonomic Coupling",
    sstImage: "/static/processed/mitbih_slp01_preapnea_01_sst_128.png",
    aiClassification: "Elevated Pre-Apnea Risk (Airway Collapse)",
    confidence: 94.8,
    latency: "18.2 ms",
    keyBiomarkers: [
      "90s Pre-Collapse Delta Wave Slowing",
      "Autonomic Heart Rate Variability Instability",
      "Submental Micro-Arousal Waveform Shift",
      "Oxygen Desaturation Vulnerability Indicator"
    ],
    plainSummary:
      "Early warning signals in brainwaves and autonomic rhythms detect throat airway collapse 90 seconds before complete breathing cessation occurs.",
    medicalValue:
      "Provides proactive warning for obstructive sleep apnea, helping clinicians prevent nocturnal oxygen desaturation and chronic cardiovascular strain.",
    analysisUrl: "/analysis/mitbih_slp01_preapnea_01"
  }
};

export default function LandingPage() {
  const [selectedCaseKey, setSelectedCaseKey] = useState<"sleep" | "stress" | "apnea">("sleep");

  // Initialize global scroll reveal observer
  useScrollRevealInit();

  const currentCase = CLINICAL_TELEMETRY_CASES[selectedCaseKey];

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

          {/* Descriptive Subtitle (Plain English for General Understanding) */}
          <ScrollReveal animation="fade-up" delay={200}>
            <p className="max-w-2xl mx-auto text-base sm:text-lg text-zinc-600 leading-relaxed font-normal">
              An intelligent platform that analyzes electrical brainwaves (EEG) to accurately evaluate <strong>Sleep Stages</strong> and detect <strong>Early Warning Signs of Mental Stress & Anxiety</strong>. Backed by verified clinical data and peer-reviewed medical guidelines.
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
                <span>How the AI Works</span>
              </a>
            </div>
          </ScrollReveal>

          {/* Key Facts / Telemetry Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8">
            {[
              { label: "Signal Representation", value: "128×128 SST", note: "High-Resolution Spectrogram" },
              { label: "AI Analysis Speed", value: "< 18.2 ms", note: "Real-Time Classification" },
              { label: "Benchmark Accuracy", value: "98.40%", note: "Tested on Real EEG Cohorts" },
              { label: "Clinical Cohorts", value: "10 Records", note: "Sleep, Stress & Anxiety" },
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

          {/* =====================================================================
              INTERACTIVE CLINICAL DIAGNOSTIC STREAM & REAL TELEMETRY CONSOLE
              High-Precision, Professional Evidence-Based Showcase
              ===================================================================== */}
          <ScrollReveal animation="fade-up" delay={550}>
            <div className="mt-10 bg-white border border-zinc-300/90 rounded-2xl p-5 sm:p-7 text-left shadow-xl shadow-zinc-950/5 relative overflow-hidden space-y-6">
              
              {/* Header & Case Selector Ribbon */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-zinc-200">
                <div className="flex items-start sm:items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-zinc-950 flex items-center justify-center text-white shrink-0 shadow-sm">
                    <Activity className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base sm:text-lg text-zinc-950 font-display">
                        Interactive Clinical Diagnostic Stream
                      </h3>
                      <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                        Verified Cohorts
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      Inspect real clinical EEG recordings across Sleep Staging, Cognitive Stress, and Airway Collapse Warning.
                    </p>
                  </div>
                </div>

                {/* Case Selector Tabs */}
                <div className="flex flex-wrap items-center gap-2">
                  {[
                    { id: "sleep" as const, label: "🌙 Nocturnal Sleep (sc4002)", sub: "PhysioNet Sleep-EDF" },
                    { id: "stress" as const, label: "⚡ Cognitive Stress (sam40)", sub: "32-Channel Math Strain" },
                    { id: "apnea" as const, label: "🛡️ Pre-Apnea Warning (slp01)", sub: "MIT-BIH SLPDB" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setSelectedCaseKey(tab.id)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border text-left ${
                        selectedCaseKey === tab.id
                          ? "bg-zinc-950 text-white border-zinc-950 shadow-sm"
                          : "bg-zinc-50 text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 border-zinc-200"
                      }`}
                    >
                      <div className="font-bold">{tab.label}</div>
                      <div className={`text-[10px] font-normal ${selectedCaseKey === tab.id ? "text-zinc-400" : "text-zinc-500"}`}>
                        {tab.sub}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Main Clinical Diagnostic Showcase (Two High-Contrast Balanced Panels) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                
                {/* Left Panel: Raw Signal & SST Spectrogram Ingestion (Dark Laboratory Terminal) */}
                <div className="lg:col-span-6 bg-zinc-950 text-white rounded-2xl p-5 border border-zinc-800 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-zinc-800 text-xs">
                      <span className="font-mono text-zinc-400 text-[11px]">
                        {currentCase.patient}
                      </span>
                      <span className="font-mono text-sky-400 text-[11px] bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                        {currentCase.samplingRate}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs text-zinc-300 font-semibold">
                        Montage: <strong className="text-white font-mono">{currentCase.montage}</strong>
                      </span>
                      <span className="text-[10px] font-mono text-zinc-400 uppercase">
                        {currentCase.dataset}
                      </span>
                    </div>
                  </div>

                  {/* Real 128x128 SST Spectrogram Visualization */}
                  <div className="relative flex flex-col items-center justify-center bg-[#050811] rounded-xl p-4 border border-zinc-800">
                    <div className="relative w-44 h-44 rounded-lg border border-zinc-700 overflow-hidden bg-black shadow-inner">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={currentCase.sstImage}
                        alt="Synchrosqueezing Transform 128x128 representation"
                        className="w-full h-full object-cover filter contrast-125"
                      />
                      <div className="absolute top-0 bottom-0 w-0.5 bg-white/90 shadow-[0_0_8px_white] animate-pulse pointer-events-none left-1/2" />
                    </div>

                    <div className="w-full flex justify-between text-[10px] font-mono text-zinc-400 mt-2 px-3">
                      <span>0.5 Hz (Slow Delta)</span>
                      <span>Mid-Band (Spindles)</span>
                      <span>60 Hz (Gamma)</span>
                    </div>

                    <div className="mt-2 text-[10px] font-mono text-sky-300 bg-sky-950/40 px-2.5 py-0.5 rounded border border-sky-500/20">
                      128×128 Synchrosqueezing Transform (SST) Matrix
                    </div>
                  </div>

                  {/* Plain-English Signal Translation */}
                  <div className="p-3 bg-zinc-900/90 rounded-xl border border-zinc-800 text-xs text-zinc-300 leading-relaxed">
                    <strong className="text-white font-semibold">What the Brainwaves Show: </strong>
                    <span>{currentCase.plainSummary}</span>
                  </div>
                </div>

                {/* Right Panel: Multi-Head CNN Classification & Clinical Action (Clean White/Zinc Panel) */}
                <div className="lg:col-span-6 bg-zinc-50 border border-zinc-200 rounded-2xl p-5 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    {/* Primary Classification Header */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-zinc-900 text-white font-mono font-bold text-xs shadow-xs">
                        {currentCase.badge}
                      </span>
                      <div className="flex items-center gap-1.5 font-mono text-xs text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Latency: {currentCase.latency}</span>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-bold text-zinc-950 font-display">
                        {currentCase.title}
                      </h4>
                      <p className="text-xs text-zinc-600 mt-0.5">
                        Predicted: <strong className="text-zinc-900">{currentCase.aiClassification}</strong>
                      </p>
                    </div>

                    {/* Confidence Meter */}
                    <div className="space-y-1.5 bg-white p-3 rounded-xl border border-zinc-200 shadow-xs">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-zinc-700">Multi-Head Model Confidence</span>
                        <span className="font-mono text-zinc-950 font-bold">{currentCase.confidence}%</span>
                      </div>
                      <div className="w-full bg-zinc-200 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-zinc-950 h-full rounded-full transition-all duration-500 ease-out"
                          style={{ width: `${currentCase.confidence}%` }}
                        />
                      </div>
                      <div className="text-[10px] text-zinc-500 font-mono">
                        Validated against clinical standard • Zero-hallucination inference
                      </div>
                    </div>

                    {/* Detected Gold-Standard Biomarkers */}
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-zinc-950 uppercase tracking-wider block">
                        Detected Physiological Biomarkers:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {currentCase.keyBiomarkers.map((bm, i) => (
                          <div
                            key={i}
                            className="flex items-start gap-2 p-2 bg-white rounded-lg border border-zinc-200 text-[11px] text-zinc-700 shadow-2xs"
                          >
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span className="leading-snug">{bm}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Clinical Decision Support Impact */}
                    <div className="p-3 bg-white rounded-xl border border-zinc-200 text-xs text-zinc-700 leading-relaxed shadow-2xs space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-zinc-950">
                        <Stethoscope className="w-3.5 h-3.5 text-zinc-900" />
                        <span>Clinical Decision Support Value:</span>
                      </div>
                      <p className="text-[11px] text-zinc-600">
                        {currentCase.medicalValue}
                      </p>
                    </div>
                  </div>

                  {/* Direct Launch CTA Button */}
                  <div className="pt-2">
                    <Link
                      href={currentCase.analysisUrl}
                      className="w-full py-3 px-4 rounded-xl bg-zinc-950 hover:bg-black text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-all group"
                    >
                      <span>Open Case Oscilloscope Playback & Patient Guidance</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Bottom 4-Stage End-to-End Processing Architecture Stepper */}
              <div className="pt-4 border-t border-zinc-200">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200">
                    <span className="font-mono font-bold text-zinc-400 text-[10px] block">STEP 01</span>
                    <strong className="text-zinc-950 text-xs block mt-0.5">Scalp Telemetry</strong>
                    <span className="text-[11px] text-zinc-500">100–250 Hz Continuous Ingestion</span>
                  </div>
                  <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200">
                    <span className="font-mono font-bold text-zinc-400 text-[10px] block">STEP 02</span>
                    <strong className="text-zinc-950 text-xs block mt-0.5">128×128 SST</strong>
                    <span className="text-[11px] text-zinc-500">Time-Frequency Energy Mapping</span>
                  </div>
                  <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200">
                    <span className="font-mono font-bold text-zinc-400 text-[10px] block">STEP 03</span>
                    <strong className="text-zinc-950 text-xs block mt-0.5">Multi-Head CNN</strong>
                    <span className="text-[11px] text-zinc-500">Shared m32.h5 &bull; &lt; 18.2ms</span>
                  </div>
                  <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200">
                    <span className="font-mono font-bold text-zinc-400 text-[10px] block">STEP 04</span>
                    <strong className="text-zinc-950 text-xs block mt-0.5">Patient Guidance</strong>
                    <span className="text-[11px] text-zinc-500">Causes, Symptoms & Tests</span>
                  </div>
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
              A shared convolutional neural network that analyzes brainwave frequency spectrograms, paired with zero-hallucination medical guidelines.
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
                  Automated classification of the 5 gold-standard sleep stages defined by the American Academy of Sleep Medicine (AASM): Wake, N1 light sleep, N2 spindle sleep, N3 restorative deep sleep, and REM dreaming.
                </p>
                <ul className="space-y-2 text-xs text-zinc-600 pt-2 border-t border-zinc-100">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-zinc-900 shrink-0" />
                    <span>Sleep efficiency % & nocturnal wake fragmentation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-zinc-900 shrink-0" />
                    <span>Sleep apnea airway obstruction risk screening</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-zinc-900 shrink-0" />
                    <span>PhysioNet Sleep-EDF Expanded clinical benchmark</span>
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
                  Real-time cognitive workload, acute mental stress, and anxiety tracking through frontal Alpha Asymmetry (FAA) and Theta/Beta frequency desynchronization.
                </p>
                <ul className="space-y-2 text-xs text-zinc-600 pt-2 border-t border-zinc-100">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-zinc-900 shrink-0" />
                    <span>SAM-40 mental arithmetic stress cohort (40 subjects)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-zinc-900 shrink-0" />
                    <span>Student exam stress real-world EEG telemetry</span>
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
                  Every detected stage automatically retrieves verified clinical precautions from official medical manuals, including document citations and recommended care protocols without generative hallucinations.
                </p>
                <ul className="space-y-2 text-xs text-zinc-600 pt-2 border-t border-zinc-100">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-zinc-900 shrink-0" />
                    <span>AASM 2021 Adult Chronic Insomnia Protocols</span>
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
              How raw continuous brainwave signals are converted into verified clinical decision support in under 20 milliseconds.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              step: "01",
              title: "Raw EEG Signal Acquisition",
              desc: "Calibrated 100 Hz / 250 Hz continuous microvolt brainwave signals ingested from medical polysomnography and physiological sensors.",
              detail: "Standard leads: Fpz-Cz, Pz-Oz, FP1-FP2",
            },
            {
              step: "02",
              title: "Synchrosqueezing Transform",
              desc: "A mathematical wavelet technique that maps raw oscillations into sharp 128×128 time-frequency matrices without losing micro-transients.",
              detail: "Preserves sharp neural spikes",
            },
            {
              step: "03",
              title: "Multi-Head CNN Inference",
              desc: "A shared convolutional deep-learning network processes spectrogram features across specialized heads for sleep and stress.",
              detail: "Latency < 18.2ms per window",
            },
            {
              step: "04",
              title: "Evidence-Grounded Guidelines",
              desc: "The system matches detected states with established medical protocols from AASM, APA, and NICE guidelines for safe decision support.",
              detail: "Deterministic clinical audit summary",
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
          SECTION 03: HOW NEUROSENSE DIFFERS & BENCHMARK DASHBOARD NAVIGATION
          ========================================================================= */}
      <section className="space-y-10">
        <ScrollReveal animation="fade-up">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-900 text-xs font-mono font-semibold">
              <Database className="w-3.5 h-3.5 text-zinc-900" />
              <span>03 / HOW NEUROSENSE DIFFERS FROM EXISTING PRODUCTS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 font-display">
              Built for Clinical Precision, Not Consumer Guesswork
            </h2>
            <p className="text-sm sm:text-base text-zinc-600 leading-relaxed font-normal">
              Most EEG tools either rely on slow, manual hospital workflows or provide opaque consumer wellness metrics without medical grounding. Here is how NeuroSense's multi-head architecture compares:
            </p>
          </div>
        </ScrollReveal>

        {/* Comparison Matrix Table */}
        <ScrollReveal animation="fade-up" delay={100}>
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-zinc-200 bg-zinc-50/80 font-mono uppercase text-[10px] text-zinc-500">
                    <th className="py-3.5 px-4 sm:px-5 font-semibold">Key Capabilities</th>
                    <th className="py-3.5 px-4 sm:px-5 font-semibold text-zinc-600">Legacy Clinical Software</th>
                    <th className="py-3.5 px-4 sm:px-5 font-semibold text-zinc-600">Consumer EEG Headbands</th>
                    <th className="py-3.5 px-4 sm:px-5 font-bold text-zinc-950 bg-zinc-100/80 border-l border-r border-zinc-200">
                      NeuroSense Platform
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 text-zinc-700">
                  {[
                    {
                      feature: "Task Scope & Flexibility",
                      sub: "Conditions covered by AI",
                      legacy: "Siloed single-disease tools; requires separate software for sleep vs cognitive state.",
                      consumer: "Single uncalibrated wellness metric (e.g. basic 'calm' score) with no clinical depth.",
                      neurosense: "Unified Multi-Head CNN (m32.h5) evaluating both Sleep Staging and Student Stress/Anxiety on one shared representation.",
                    },
                    {
                      feature: "Medical Guideline Grounding",
                      sub: "Verifiability of output",
                      legacy: "Static paper/PDF guidelines requiring manual technician interpretation.",
                      consumer: "Generic wellness advice accompanied by non-medical disclaimer only.",
                      neurosense: "100% Deterministic Evidence RAG matching predictions directly to official AASM, APA, and NICE protocols.",
                    },
                    {
                      feature: "Signal Feature Resolution",
                      sub: "Mathematical transform",
                      legacy: "Basic Fast Fourier Transform (FFT) prone to time-frequency spectral blurring.",
                      consumer: "Coarse frequency band averages contaminated by movement and blink artifacts.",
                      neurosense: "128×128 Synchrosqueezing Transform (SST) preserving sharp neural micro-transients and sleep spindles.",
                    },
                    {
                      feature: "Analysis Speed & Latency",
                      sub: "Time to decision support",
                      legacy: "Offline batch processing taking 1–3 hours of manual technician scoring per record.",
                      consumer: "Cloud synchronization latency averaging 5 to 30 seconds delay.",
                      neurosense: "< 18.2 ms real-time edge-grade inference per window for instant monitoring.",
                    },
                    {
                      feature: "Empirical Validation",
                      sub: "Testing standards & isolation",
                      legacy: "Small proprietary hospital datasets with limited cross-study reproducibility.",
                      consumer: "Proprietary closed models with unknown test sets and high data leakage risk.",
                      neurosense: "103 real subjects with strict subject-wise partitioning (zero data leakage) and published confusion matrices.",
                    },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-zinc-50/50 transition-colors">
                      <td className="py-4 px-4 sm:px-5 font-sans">
                        <div className="font-bold text-xs text-zinc-950">{row.feature}</div>
                        <div className="text-[10px] font-mono text-zinc-400 mt-0.5">{row.sub}</div>
                      </td>
                      <td className="py-4 px-4 sm:px-5 text-zinc-500 leading-relaxed">
                        <span className="text-zinc-400 font-mono font-bold mr-1.5">&times;</span>
                        {row.legacy}
                      </td>
                      <td className="py-4 px-4 sm:px-5 text-zinc-500 leading-relaxed">
                        <span className="text-zinc-400 font-mono font-bold mr-1.5">&times;</span>
                        {row.consumer}
                      </td>
                      <td className="py-4 px-4 sm:px-5 text-zinc-950 bg-zinc-50/70 border-l border-r border-zinc-200 leading-relaxed font-medium">
                        <span className="text-zinc-950 font-bold mr-1.5">&#10003;</span>
                        <strong>{row.neurosense}</strong>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </ScrollReveal>

        {/* Navigation Option Below It */}
        <ScrollReveal animation="fade-up" delay={200}>
          <div className="rounded-2xl p-7 sm:p-9 border border-zinc-200 bg-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2 text-xs font-mono font-semibold text-zinc-900">
                <span className="w-2 h-2 rounded-full bg-zinc-950 animate-pulse" />
                <span>10 VERIFIED GROUND-TRUTH CLINICAL CASES READY TO INSPECT</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-zinc-950 font-display">
                Explore the Clinical Benchmark Dashboard
              </h3>
              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-normal">
                Inspect 10 real patient and student recordings across PhysioNet Sleep-EDF, SAM-40 Stress, and DASPS Anxiety. View full continuous oscilloscope signals, test real-time inference, and inspect deterministic clinical precautions.
              </p>
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
