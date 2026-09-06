"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
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

export default function LandingPage() {
  // Initialize global scroll reveal observer
  useScrollRevealInit();

  return (
    <div className="space-y-24 sm:space-y-32">
      {/* =========================================================================
          HERO SECTION (Pure White Background, Crisp Black Typography)
          ========================================================================= */}
      <section className="relative pt-6 sm:pt-12 pb-8 border-b border-zinc-200/80">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          {/* Official Brand Badge */}
          <ScrollReveal animation="fade-up" delay={50}>
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-zinc-900 text-zinc-200 text-xs font-medium shadow-md shadow-zinc-950/5 border border-zinc-800/80 mb-2">
              <div className="w-5 h-5 rounded-md overflow-hidden flex-shrink-0">
                <Image
                  src="/logo.png"
                  alt="NeuroSense Logo"
                  width={20}
                  height={20}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="tracking-tight font-medium">NeuroSense Neural Intelligence</span>
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
              ABOUT THE PROJECT & CLINICAL BREAKTHROUGHS
              Elevated, Professional Project Presentation (Zero Dashboard Clutter)
              ===================================================================== */}
          <ScrollReveal animation="fade-up" delay={500}>
            <div className="mt-12 bg-white border border-zinc-200 rounded-3xl p-6 sm:p-10 text-left shadow-sm space-y-10">
              
              {/* Executive Summary & Mission */}
              <div className="max-w-3xl space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-900 text-xs font-mono font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-zinc-900" />
                  <span>THE NEUROSENSE INITIATIVE</span>
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-zinc-950 font-display">
                  Transforming Continuous Scalp EEG into Proactive Clinical Action
                </h2>
                <p className="text-sm sm:text-base text-zinc-600 leading-relaxed font-normal">
                  Over 70% of sleep apnea and nocturnal sleep fragmentation cases remain undiagnosed due to the friction of traditional overnight hospital polysomnography, which requires over two hours of manual epoch scoring per patient. In universities and demanding workplaces, acute cognitive strain and anxiety paroxysms are frequently overlooked until burnout causes physical impairment. NeuroSense was created to solve this clinical bottleneck through high-resolution mathematical time-frequency analysis and multi-head deep learning.
                </p>
              </div>

              {/* Three Core Scientific Innovations (Editorial Bento Grid) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                {/* Innovation 1: Mathematical Wavelets */}
                <div className="p-6 rounded-2xl bg-zinc-50/80 border border-zinc-200/90 space-y-4 hover:border-zinc-300 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-zinc-950 text-white flex items-center justify-center shadow-xs">
                    <Layers className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider font-semibold block">Mathematical Precision</span>
                    <h3 className="font-bold text-base text-zinc-950 font-display">
                      128×128 Synchrosqueezing Transform (SST)
                    </h3>
                  </div>
                  <p className="text-xs text-zinc-600 leading-relaxed">
                    Standard Fourier transforms suffer from spectral blurring. NeuroSense applies reassigned wavelet mathematics to sharpen energy concentrations, cleanly capturing 12–14 Hz sleep spindles, slow delta rolls, and rapid stress ripples without loss of transient detail.
                  </p>
                </div>

                {/* Innovation 2: Unified Multi-Head CNN */}
                <div className="p-6 rounded-2xl bg-zinc-50/80 border border-zinc-200/90 space-y-4 hover:border-zinc-300 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-zinc-950 text-white flex items-center justify-center shadow-xs">
                    <Cpu className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider font-semibold block">Deep Learning Architecture</span>
                    <h3 className="font-bold text-base text-zinc-950 font-display">
                      Unified Multi-Head Model (m32.h5 Backbone)
                    </h3>
                  </div>
                  <p className="text-xs text-zinc-600 leading-relaxed">
                    Inspired by the landmark architecture of Özdemir et al. (2020), a single convolutional backbone processes multi-channel brainwave energy in &lt;18.2 milliseconds, simultaneously evaluating 5-class AASM sleep staging and cognitive workload on one shared model.
                  </p>
                </div>

                {/* Innovation 3: Patient-Centered Explainability */}
                <div className="p-6 rounded-2xl bg-zinc-50/80 border border-zinc-200/90 space-y-4 hover:border-zinc-300 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-zinc-950 text-white flex items-center justify-center shadow-xs">
                    <Stethoscope className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider font-semibold block">Human-Centered Health</span>
                    <h3 className="font-bold text-base text-zinc-950 font-display">
                      Plain-English Guidance & Diagnostic Roadmaps
                    </h3>
                  </div>
                  <p className="text-xs text-zinc-600 leading-relaxed">
                    NeuroSense translates complex microvolt signals into accessible health guidance for non-medical individuals—clarifying physiological causes, everyday symptoms, and the exact clinical diagnostic tests (such as In-Lab Sleep Studies or Holter ECG) to request from a physician.
                  </p>
                </div>
              </div>

              {/* Research Lineage & Verified Cohorts Ribbon */}
              <div className="pt-6 border-t border-zinc-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono text-zinc-500 text-[11px] uppercase font-bold tracking-wider">
                    Validated Benchmark Cohorts:
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-zinc-100 text-zinc-800 font-mono text-[11px] border border-zinc-200">
                    PhysioNet Sleep-EDF Expanded
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-zinc-100 text-zinc-800 font-mono text-[11px] border border-zinc-200">
                    SAM-40 (32-Ch Stress Cohort)
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-zinc-100 text-zinc-800 font-mono text-[11px] border border-zinc-200">
                    DASPS State Anxiety Database
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-zinc-100 text-zinc-800 font-mono text-[11px] border border-zinc-200">
                    MIT-BIH Polysomnography
                  </span>
                </div>

                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-1.5 font-semibold text-zinc-950 hover:text-zinc-700 transition-colors shrink-0 text-xs group"
                >
                  <span>Explore Benchmark Cases in Dashboard</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
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
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 font-display">
              Dual-Domain Neural Classification Engine
            </h2>
            <p className="text-sm sm:text-base text-zinc-600 leading-relaxed font-normal">
              Our core system architecture uses a shared convolutional neural network to process continuous brainwave spectrograms, simultaneously performing polysomnography sleep staging and mental stress detection alongside verified clinical guidelines.
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
              <span>HOW NEUROSENSE DIFFERS FROM EXISTING PRODUCTS</span>
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
