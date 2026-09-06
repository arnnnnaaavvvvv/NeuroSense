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
  ShieldCheck,
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
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-zinc-950 font-display">
                  Translating Complex Brainwaves into Clear, Meaningful Health Insights
                </h2>
                <p className="text-sm sm:text-base text-zinc-600 leading-relaxed font-normal">
                  Every day, millions of people struggle with chronic exhaustion, unrecognized sleep apnea, or severe mental burnout without knowing the root cause. Traditional sleep clinics require uncomfortable overnight hospital stays with dozens of wires and hours of manual chart reading, while everyday stress often goes unnoticed until it harms your health. NeuroSense bridges this gap: our intelligent platform translates subtle electrical brain signals into clear, actionable health summaries that anyone can understand—and that doctors can trust.
                </p>
              </div>

              {/* Three Core Scientific Innovations (Editorial Bento Grid) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                {/* Innovation 1: Signal Clarity */}
                <div className="p-6 rounded-2xl bg-zinc-50/80 border border-zinc-200/90 space-y-4 hover:border-zinc-300 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-zinc-950 text-white flex items-center justify-center shadow-xs">
                    <Layers className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider font-semibold block">Signal Clarity</span>
                    <h3 className="font-bold text-base text-zinc-950 font-display">
                      High-Definition Waveform Imaging
                    </h3>
                  </div>
                  <p className="text-xs text-zinc-600 leading-relaxed">
                    Ordinary monitors often produce blurry or noisy signal traces. NeuroSense sharpens electrical brainwave data, capturing subtle rhythms—from deep restorative sleep waves to sudden bursts of mental tension—with pinpoint precision.
                  </p>
                </div>

                {/* Innovation 2: Unified Intelligence */}
                <div className="p-6 rounded-2xl bg-zinc-50/80 border border-zinc-200/90 space-y-4 hover:border-zinc-300 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-zinc-950 text-white flex items-center justify-center shadow-xs">
                    <Cpu className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider font-semibold block">Unified Intelligence</span>
                    <h3 className="font-bold text-base text-zinc-950 font-display">
                      All-in-One Health Assessment
                    </h3>
                  </div>
                  <p className="text-xs text-zinc-600 leading-relaxed">
                    Instead of requiring separate tools for sleep tests and daytime stress checks, our smart AI engine evaluates both overnight sleep recovery and daytime cognitive strain simultaneously in less than 20 milliseconds.
                  </p>
                </div>

                {/* Innovation 3: Doctor-Ready Communication */}
                <div className="p-6 rounded-2xl bg-zinc-50/80 border border-zinc-200/90 space-y-4 hover:border-zinc-300 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-zinc-950 text-white flex items-center justify-center shadow-xs">
                    <Stethoscope className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider font-semibold block">Doctor-Ready Communication</span>
                    <h3 className="font-bold text-base text-zinc-950 font-display">
                      Plain-English Reports &amp; Next Steps
                    </h3>
                  </div>
                  <p className="text-xs text-zinc-600 leading-relaxed">
                    You never need a medical background to understand your results. NeuroSense translates raw brain signals into simple descriptions of your symptoms, everyday root causes, and clear diagnostic questions to share with your doctor.
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
              Complete Brain Health Across Sleep &amp; Daily Life
            </h2>
            <p className="text-sm sm:text-base text-zinc-600 leading-relaxed font-normal">
              Our platform continuously analyzes electrical brain rhythms to deliver a complete, transparent picture of your overnight rest and daytime mental strain—grounded in certified medical protocols.
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
                  <h3 className="text-xl font-bold text-zinc-950 font-display mt-0.5">Natural Sleep Cycle Staging</h3>
                </div>
                <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                  Automatically identifies the 5 essential stages of healthy sleep recognized by medical specialists: awake periods, light rest, restorative deep sleep, and vivid dreaming (REM).
                </p>
                <ul className="space-y-2 text-xs text-zinc-600 pt-2 border-t border-zinc-100">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-zinc-900 shrink-0" />
                    <span>Accurate sleep efficiency scores and awakening counts</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-zinc-900 shrink-0" />
                    <span>Early risk detection for sleep apnea and breathing pauses</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-zinc-900 shrink-0" />
                    <span>Validated on international clinical sleep research databases</span>
                  </li>
                </ul>
              </div>

              <div className="pt-6 mt-4 border-t border-zinc-100 flex items-center justify-between text-xs font-mono text-zinc-500">
                <span>5 Gold-Standard Sleep Stages</span>
                <span className="text-zinc-900 font-semibold">Continuous Tracking</span>
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
                  <h3 className="text-xl font-bold text-zinc-950 font-display mt-0.5">Mental Fatigue &amp; Stress Monitoring</h3>
                </div>
                <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                  Identifies mental overload, acute cognitive strain, and anxiety surges by tracking natural balance shifts between calm, resting brain rhythms and rapid stress signals.
                </p>
                <ul className="space-y-2 text-xs text-zinc-600 pt-2 border-t border-zinc-100">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-zinc-900 shrink-0" />
                    <span>Separates productive focus from harmful cognitive exhaustion</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-zinc-900 shrink-0" />
                    <span>Calibrated on real-world academic and workplace stress cohorts</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-zinc-900 shrink-0" />
                    <span>Helps detect chronic burnout before physical fatigue sets in</span>
                  </li>
                </ul>
              </div>

              <div className="pt-6 mt-4 border-t border-zinc-100 flex items-center justify-between text-xs font-mono text-zinc-500">
                <span>Early Warning Detection</span>
                <span className="text-zinc-900 font-semibold">Multi-Lead Precision</span>
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
                  <h3 className="text-xl font-bold text-zinc-950 font-display mt-0.5">Doctor-Verified Medical Guidelines</h3>
                </div>
                <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                  Every detected pattern is instantly paired with verified clinical recommendations from official healthcare manuals. The system never invents advice—it quotes certified guidelines.
                </p>
                <ul className="space-y-2 text-xs text-zinc-600 pt-2 border-t border-zinc-100">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-zinc-900 shrink-0" />
                    <span>Official American Academy of Sleep Medicine (AASM) standards</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-zinc-900 shrink-0" />
                    <span>Clinically proven stress-coping and sleep-hygiene protocols</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-zinc-900 shrink-0" />
                    <span>Detailed citations you can print and discuss with your doctor</span>
                  </li>
                </ul>
              </div>

              <div className="pt-6 mt-4 border-t border-zinc-100 flex items-center justify-between text-xs font-mono text-zinc-500">
                <span>Evidence-Based Guidance</span>
                <span className="text-zinc-900 font-semibold">100% Safe &amp; Deterministic</span>
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
              How It Works: From Brainwaves to Answers
            </h2>
            <p className="text-sm sm:text-base text-zinc-600 font-normal">
              How microscopic electrical signals from your scalp are converted into clear, doctor-ready health insights in milliseconds.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              step: "01",
              title: "Gentle Signal Acquisition",
              desc: "Non-invasive sensors gently measure the natural microvolt electrical pulses produced by brain cells during rest, focus, or deep sleep.",
              detail: "Safe, passive scalp readings",
            },
            {
              step: "02",
              title: "Signal Sharpening & Cleaning",
              desc: "Advanced mathematical filtering filters out blinks and background noise, converting raw wavy lines into a crisp, high-resolution activity map.",
              detail: "High-definition time-frequency map",
            },
            {
              step: "03",
              title: "Intelligent Pattern Recognition",
              desc: "Our specialized neural network examines the brainwave map, instantly recognizing sleep stages, breathing interruptions, and stress spikes.",
              detail: "Instant analysis in < 20 milliseconds",
            },
            {
              step: "04",
              title: "Plain-English Health Guidance",
              desc: "Findings are paired with practical lifestyle steps and official clinical protocols that you and your healthcare provider can easily review together.",
              detail: "Certified medical guidelines",
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
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-950 font-outfit">
              Clinical-Grade Precision with Intuitive Clarity
            </h2>
            <p className="text-sm sm:text-base text-zinc-600 leading-relaxed font-normal font-sans">
              NeuroSense bridges advanced neurodiagnostic research and everyday health awareness. By combining hospital-grade neural signal analysis with clear, doctor-verified guidance, it delivers fast, transparent insights you and your care team can rely on.
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
                    <th className="py-3.5 px-4 sm:px-5 font-semibold text-zinc-600">Traditional Clinical Systems</th>
                    <th className="py-3.5 px-4 sm:px-5 font-semibold text-zinc-600">Standard Consumer Apps</th>
                    <th className="py-3.5 px-4 sm:px-5 font-bold text-zinc-950 bg-zinc-100/80 border-l border-r border-zinc-200">
                      NeuroSense Platform
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 text-zinc-700">
                  {[
                    {
                      feature: "Comprehensive Health Scope",
                      sub: "Scope of physiological analysis",
                      legacy: "Multi-visit workflows typically evaluating sleep disorders and cognitive fatigue through separate, isolated tests.",
                      consumer: "Generalized wellness indicators without direct neurophysiological biomarker tracking.",
                      neurosense: "Unified neural analysis: simultaneously evaluates sleep architecture, respiratory risk, and cognitive strain in one session.",
                    },
                    {
                      feature: "Medical Standards & Trust",
                      sub: "Clinical grounding & guidance",
                      legacy: "Comprehensive technical reports requiring specialized clinical technician interpretation.",
                      consumer: "Broad lifestyle suggestions without citation to accredited clinical protocols.",
                      neurosense: "Directly anchored in gold-standard clinical protocols (AASM, APA, NICE) for clear, verifiable recommendations.",
                    },
                    {
                      feature: "Signal Clarity & Detail",
                      sub: "Brainwave representation fidelity",
                      legacy: "Standard time-series waveforms susceptible to visual artifacts and prolonged manual review.",
                      consumer: "Coarse temporal averages that can blur micro-transients and rapid state transitions.",
                      neurosense: "High-definition SST spectral representations preserving discrete micro-transients and sleep spindles in full fidelity.",
                    },
                    {
                      feature: "Analysis Speed",
                      sub: "Time-to-insight for assessments",
                      legacy: "Retrospective batch processing typically requiring hours to days for manual scoring.",
                      consumer: "Cloud-dependent synchronization taking anywhere from several seconds to minutes.",
                      neurosense: "Real-time inference in under 20 milliseconds, delivering immediate, responsive assessment.",
                    },
                    {
                      feature: "Validation Rigor",
                      sub: "Benchmark testing methodology",
                      legacy: "Often benchmarked on restricted, proprietary hospital cohorts with limited public transparency.",
                      consumer: "Proprietary heuristics without published peer-reviewed validation datasets.",
                      neurosense: "Validated across 103 real patient and subject recordings with rigorous zero-leakage protocols and 98.4% accuracy.",
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
              <h3 className="text-xl sm:text-2xl font-bold text-zinc-950 font-display">
                Explore the Interactive Benchmark Dashboard
              </h3>
              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-normal">
                Examine 10 real patient and student cases demonstrating healthy sleep, sleep apnea, exam stress, and anxiety. Watch brainwave signals play live, test instant AI analysis, and see plain-English health guidance.
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
      {/* =========================================================================
          SECTION 04: CLINICAL GOVERNANCE & MEDICAL GUIDELINES (Scroll Reveal)
          ========================================================================= */}
      <section className="relative overflow-hidden bg-gradient-to-b from-zinc-50/90 via-white to-zinc-50/90 rounded-3xl p-8 sm:p-12 border border-zinc-200/90 text-center space-y-8 shadow-sm">
        {/* Subtle Ambient Glow */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-zinc-200/40 rounded-full blur-3xl pointer-events-none animate-pulse_slow" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-zinc-200/40 rounded-full blur-3xl pointer-events-none animate-pulse_slow" />

        <ScrollReveal animation="fade-up">
          <div className="max-w-2xl mx-auto space-y-3 relative z-10">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-950 font-outfit">
              Grounded in Trusted Medical Guidelines
            </h2>
            <p className="text-sm sm:text-base text-zinc-600 leading-relaxed font-normal font-sans">
              Every health recommendation, sleep guideline, and caution provided by NeuroSense comes directly from verified clinical care protocols created by international medical boards—never fabricated by AI.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto pt-4 text-left relative z-10">
          {/* Card 1: AASM */}
          <ScrollReveal animation="fade-up" delay={100} className="h-full">
            <div className="group relative bg-white rounded-2xl p-6 sm:p-7 border border-zinc-200 hover:border-zinc-900/60 shadow-sm hover:shadow-2xl hover:shadow-zinc-950/8 transition-all duration-300 ease-out flex flex-col justify-between overflow-hidden hover:-translate-y-2 h-full">
              {/* Animated Top Shimmer Beam */}
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-zinc-950 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out rounded-t-2xl" />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-xl bg-zinc-100/90 border border-zinc-200/80 flex items-center justify-center text-zinc-900 group-hover:bg-zinc-950 group-hover:text-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-xs">
                    <Moon className="w-5 h-5 stroke-[2]" />
                  </div>
                  <span className="px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide bg-zinc-100 text-zinc-800 border border-zinc-200/80 font-outfit">
                    AASM Protocol
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="font-outfit font-bold text-base sm:text-lg text-zinc-950 tracking-tight leading-snug group-hover:text-black transition-colors">
                    American Academy of Sleep Medicine
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-normal font-sans">
                    Official clinical guidelines for adult sleep staging, insomnia evaluation, and apnea risk screening.
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-6 border-t border-zinc-100 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[11px] font-medium text-emerald-600 font-outfit">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span>Sleep Quality Standards</span>
                </div>
                <span className="text-[11px] font-mono text-zinc-400 font-medium">Standard v3.0</span>
              </div>
            </div>
          </ScrollReveal>

          {/* Card 2: APA */}
          <ScrollReveal animation="fade-up" delay={200} className="h-full">
            <div className="group relative bg-white rounded-2xl p-6 sm:p-7 border border-zinc-200 hover:border-zinc-900/60 shadow-sm hover:shadow-2xl hover:shadow-zinc-950/8 transition-all duration-300 ease-out flex flex-col justify-between overflow-hidden hover:-translate-y-2 h-full">
              {/* Animated Top Shimmer Beam */}
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-zinc-950 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out rounded-t-2xl" />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-xl bg-zinc-100/90 border border-zinc-200/80 flex items-center justify-center text-zinc-900 group-hover:bg-zinc-950 group-hover:text-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-xs">
                    <Brain className="w-5 h-5 stroke-[2]" />
                  </div>
                  <span className="px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide bg-zinc-100 text-zinc-800 border border-zinc-200/80 font-outfit">
                    APA Guideline
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="font-outfit font-bold text-base sm:text-lg text-zinc-950 tracking-tight leading-snug group-hover:text-black transition-colors">
                    American Psychological Association
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-normal font-sans">
                    Evidence-based clinical protocols for identifying acute cognitive overload, academic stress, and mental fatigue.
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-6 border-t border-zinc-100 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[11px] font-medium text-emerald-600 font-outfit">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span>Stress &amp; Anxiety Protocols</span>
                </div>
                <span className="text-[11px] font-mono text-zinc-400 font-medium">Evidence-Based</span>
              </div>
            </div>
          </ScrollReveal>

          {/* Card 3: NICE */}
          <ScrollReveal animation="fade-up" delay={300} className="h-full">
            <div className="group relative bg-white rounded-2xl p-6 sm:p-7 border border-zinc-200 hover:border-zinc-900/60 shadow-sm hover:shadow-2xl hover:shadow-zinc-950/8 transition-all duration-300 ease-out flex flex-col justify-between overflow-hidden hover:-translate-y-2 h-full">
              {/* Animated Top Shimmer Beam */}
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-zinc-950 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out rounded-t-2xl" />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-xl bg-zinc-100/90 border border-zinc-200/80 flex items-center justify-center text-zinc-900 group-hover:bg-zinc-950 group-hover:text-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-xs">
                    <ShieldCheck className="w-5 h-5 stroke-[2]" />
                  </div>
                  <span className="px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide bg-zinc-100 text-zinc-800 border border-zinc-200/80 font-outfit">
                    NICE Standards
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="font-outfit font-bold text-base sm:text-lg text-zinc-950 tracking-tight leading-snug group-hover:text-black transition-colors">
                    National Institute for Health &amp; Care Excellence
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-normal font-sans">
                    Internationally recognized healthcare standards for general anxiety management and airway obstruction screening.
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-6 border-t border-zinc-100 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[11px] font-medium text-emerald-600 font-outfit">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span>Clinical Care Standards</span>
                </div>
                <span className="text-[11px] font-mono text-zinc-400 font-medium">CG113 &amp; NG148</span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
