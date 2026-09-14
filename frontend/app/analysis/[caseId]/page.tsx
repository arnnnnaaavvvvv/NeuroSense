"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, AlertCircle, CheckCircle2, FileDown, Activity } from "lucide-react";

import { fetchAnalysis, fetchPrecautions, fetchWaveformData } from "../../../lib/api";
import { AnalysisResponse, PrecautionResponse, RawWaveformData } from "../../../lib/types";
import SignalViewer from "../../../components/SignalViewer";
import ResultCard from "../../../components/ResultCard";
import PrecautionPanel from "../../../components/PrecautionPanel";
import ClinicalAuditExportModal from "../../../components/ClinicalAuditExportModal";
import HypnogramTimeline from "../../../components/HypnogramTimeline";
import PatientGuidanceSection from "../../../components/PatientGuidanceSection";

export default function CaseAnalysisPage() {
  const params = useParams();
  const caseId = params?.caseId as string;

  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [waveformData, setWaveformData] = useState<RawWaveformData | null>(null);
  const [precautions, setPrecautions] = useState<PrecautionResponse | null>(null);
  
  const [loadingAnalysis, setLoadingAnalysis] = useState(true);
  const [loadingPrecautions, setLoadingPrecautions] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Playback Simulation State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0.0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const duration = analysis?.time_window.duration_seconds || 10.0;

  const animationFrameRef = useRef<number | null>(null);
  const lastTickTimeRef = useRef<number | null>(null);

  // 1. Fetch Case Analysis & Waveform
  useEffect(() => {
    if (!caseId) return;

    async function loadData() {
      try {
        setLoadingAnalysis(true);
        setError(null);

        const analysisData = await fetchAnalysis(caseId);
        setAnalysis(analysisData);

        if (analysisData.signal_assets.raw_waveform_url) {
          const waveData = await fetchWaveformData(analysisData.signal_assets.raw_waveform_url);
          setWaveformData(waveData);
        }

        setLoadingPrecautions(true);
        const stageTarget = analysisData.classification.sleep_stage || analysisData.classification.binary_class || "baseline";
        const precData = await fetchPrecautions(stageTarget, analysisData.domain);
        setPrecautions(precData);
      } catch (err: any) {
        console.error("Failed to load analysis page:", err);
        setError(err.message || "Failed to load case analysis.");
      } finally {
        setLoadingAnalysis(false);
        setLoadingPrecautions(false);
      }
    }

    loadData();
  }, [caseId]);

  // 2. 60fps Real-Time Playback Simulation Loop
  useEffect(() => {
    if (!isPlaying) {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      lastTickTimeRef.current = null;
      return;
    }

    const loop = (timestamp: number) => {
      if (lastTickTimeRef.current === null) {
        lastTickTimeRef.current = timestamp;
      }
      const deltaSeconds = (timestamp - lastTickTimeRef.current) / 1000.0;
      lastTickTimeRef.current = timestamp;

      setCurrentTime((prev) => {
        const nextTime = prev + deltaSeconds * playbackSpeed;
        if (nextTime >= duration) {
          return 0.0;
        }
        return nextTime;
      });

      animationFrameRef.current = requestAnimationFrame(loop);
    };

    animationFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isPlaying, playbackSpeed, duration]);

  const handleTogglePlay = () => setIsPlaying(!isPlaying);
  const handleReset = () => {
    setIsPlaying(false);
    setCurrentTime(0.0);
  };
  const handleSeek = (time: number) => setCurrentTime(time);
  const handleChangeSpeed = (speed: number) => setPlaybackSpeed(speed);

  if (loadingAnalysis) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-zinc-200 rounded w-1/4"></div>
        <div className="h-64 bg-zinc-100 rounded-2xl border border-zinc-200"></div>
        <div className="h-44 bg-zinc-100 rounded-2xl border border-zinc-200"></div>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-rose-200 text-center space-y-4 shadow-sm">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-zinc-900">Case Analysis Unavailable</h2>
        <p className="text-sm text-zinc-600 max-w-md mx-auto">{error || "Case record could not be found."}</p>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 text-white hover:bg-black transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Benchmark Cases
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-zinc-200 shadow-xs">
        <div className="flex items-center gap-3.5">
          <Link
            href={analysis?.domain ? `/dashboard?domain=${analysis.domain}` : "/dashboard"}
            className="p-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-800 transition-colors"
            title="Return to Benchmark Cases & Risk Telemetry"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-zinc-950 font-mono tracking-tight">
                {analysis.case_id}
              </h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-700 border border-zinc-200 font-mono font-semibold">
                Segment #{analysis.segment_id}
              </span>
            </div>
            <p className="text-xs text-zinc-500 mt-0.5">
              Patient: <strong className="text-zinc-700">{analysis.patient_anon_id}</strong> &bull; Time Window: {analysis.time_window.start_seconds}s - {analysis.time_window.end_seconds}s ({analysis.time_window.duration_seconds}s)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-950 hover:bg-black text-white text-xs font-semibold transition-all shadow-xs"
          >
            <FileDown className="w-4 h-4 text-sky-400" />
            <span>Export Clinical Summary</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-emerald-700 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Precomputed Telemetry</span>
          </div>
        </div>
      </div>

      {/* Clinical Context Callout */}
      {analysis.description && (
        <div className="bg-zinc-950 text-white p-4 rounded-2xl border border-zinc-800 text-xs text-zinc-300 leading-relaxed shadow-xs flex items-start gap-3">
          <Activity className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-white font-semibold">Clinical Dataset Context: </strong>
            <span>{analysis.description}</span>
          </div>
        </div>
      )}

      {/* 1. Oscilloscope Graph with Integrated Playback Option Directly Below & Lead Explanations */}
      <SignalViewer
        waveformData={waveformData}
        sstImageUrl={analysis.signal_assets.sst_image_url}
        currentTime={currentTime}
        duration={duration}
        riskStage={analysis.classification.risk_stage}
        domain={analysis.domain}
        isPlaying={isPlaying}
        onTogglePlay={handleTogglePlay}
        onReset={handleReset}
        onSeek={handleSeek}
        playbackSpeed={playbackSpeed}
        onChangeSpeed={handleChangeSpeed}
      />

      {/* 2. Polysomnography Sleep Hypnogram (for Sleep Cases) */}
      {(analysis.domain === "sleep" || waveformData?.hypnogram) && (
        <HypnogramTimeline
          hypnogram={waveformData?.hypnogram}
          sleepMetrics={analysis.classification.sleep_metrics}
        />
      )}

      {/* 3. Pretrained CNN Classification & Key Signal Markers Card */}
      <ResultCard
        classification={analysis.classification}
        keyMarkers={analysis.key_markers}
      />

      {/* 4. Non-Medical Patient Health Guidance: Causes, Symptoms, Required Tests & Doctor Questions */}
      <PatientGuidanceSection
        caseId={caseId}
        domain={analysis.domain}
        stageOrRisk={analysis.classification.risk_stage}
        patientAnonId={analysis.patient_anon_id}
      />

      {/* 5. RAG Clinical Precaution Panel with Source Citations */}
      <PrecautionPanel
        precautionData={precautions}
        isLoading={loadingPrecautions}
      />

      {/* 6. Printable Clinical Audit Summary Modal */}
      <ClinicalAuditExportModal
        caseId={caseId}
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />
    </div>
  );
}
