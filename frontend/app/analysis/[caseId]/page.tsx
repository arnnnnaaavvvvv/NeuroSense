"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, RefreshCw, AlertCircle, Sparkles, CheckCircle2, ShieldAlert, FileDown } from "lucide-react";

import { fetchAnalysis, fetchPrecautions, fetchWaveformData } from "../../../lib/api";
import { AnalysisResponse, PrecautionResponse, RawWaveformData } from "../../../lib/types";
import ReplayControls from "../../../components/ReplayControls";
import SignalViewer from "../../../components/SignalViewer";
import ResultCard from "../../../components/ResultCard";
import PrecautionPanel from "../../../components/PrecautionPanel";
import ClinicalAuditExportModal from "../../../components/ClinicalAuditExportModal";
import HypnogramTimeline from "../../../components/HypnogramTimeline";

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
        <div className="h-8 bg-slate-800 rounded w-1/4"></div>
        <div className="h-64 bg-slate-800/60 rounded-xl"></div>
        <div className="h-44 bg-slate-800/40 rounded-xl"></div>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="clinical-panel rounded-2xl p-8 border border-rose-500/40 text-center space-y-4">
        <AlertCircle className="w-10 h-10 text-rose-400 mx-auto" />
        <h2 className="text-xl font-bold text-white">Case Analysis Unavailable</h2>
        <p className="text-sm text-slate-300 max-w-md mx-auto">{error || "Case record could not be found."}</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Case Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors"
            title="Return to Cases"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-white font-mono">{analysis.case_id}</h1>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-sky-400 border border-slate-700 font-mono">
                Segment #{analysis.segment_id}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Patient: {analysis.patient_anon_id} &bull; Time Window: {analysis.time_window.start_seconds}s - {analysis.time_window.end_seconds}s ({analysis.time_window.duration_seconds}s)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-medium transition-colors"
          >
            <FileDown className="w-4 h-4 text-sky-400" />
            <span>Export Clinical Summary</span>
          </button>

          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
            <CheckCircle2 className="w-4 h-4" />
            <span>Precomputed Telemetry</span>
          </div>
        </div>
      </div>

      {/* Description Callout */}
      {analysis.description && (
        <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
          <strong className="text-slate-100">Clinical Context:</strong> {analysis.description}
        </div>
      )}

      {/* 1. Multi-Montage Oscilloscope & SST Spectrogram Dual Viewer */}
      <SignalViewer
        waveformData={waveformData}
        sstImageUrl={analysis.signal_assets.sst_image_url}
        currentTime={currentTime}
        duration={duration}
        riskStage={analysis.classification.risk_stage}
      />

      {/* 1b. Polysomnography Sleep Hypnogram (for Sleep Cases) */}
      {(analysis.domain === "sleep" || waveformData?.hypnogram) && (
        <HypnogramTimeline
          hypnogram={waveformData?.hypnogram}
          sleepMetrics={analysis.classification.sleep_metrics}
        />
      )}

      {/* 2. Real-Time Playback Controls */}
      <ReplayControls
        isPlaying={isPlaying}
        onTogglePlay={handleTogglePlay}
        onReset={handleReset}
        currentTime={currentTime}
        duration={duration}
        onSeek={handleSeek}
        playbackSpeed={playbackSpeed}
        onChangeSpeed={handleChangeSpeed}
      />

      {/* 3. Pretrained CNN Classification & Key Signal Markers Card */}
      <ResultCard
        classification={analysis.classification}
        keyMarkers={analysis.key_markers}
      />

      {/* 4. RAG Clinical Precaution Panel with Source Citations */}
      <PrecautionPanel
        precautionData={precautions}
        isLoading={loadingPrecautions}
      />

      {/* 5. Printable Clinical Audit Summary Modal */}
      <ClinicalAuditExportModal
        caseId={caseId}
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />
    </div>
  );
}
