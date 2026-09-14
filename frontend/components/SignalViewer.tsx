"use client";

import React, { useRef, useEffect, useState } from "react";
import {
  Activity,
  Layers,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  MapPin,
  Brain,
  TrendingUp,
  Stethoscope,
  Volume2
} from "lucide-react";
import { RawWaveformData } from "../lib/types";

interface SignalViewerProps {
  waveformData: RawWaveformData | null;
  sstImageUrl: string;
  currentTime: number;
  duration: number;
  riskStage: string;
  domain?: string;
  // Direct playback controls right below graph
  isPlaying: boolean;
  onTogglePlay: () => void;
  onReset: () => void;
  onSeek: (time: number) => void;
  playbackSpeed: number;
  onChangeSpeed: (speed: number) => void;
  hideLeadExplanation?: boolean;
}

interface LeadPlainDetail {
  leadName: string;
  friendlyName: string;
  placement: string;
  whatItMeasures: string;
  waveMeaning: string;
  clinicalPurpose: string;
}

const PLAIN_ENGLISH_LEADS: Record<string, LeadPlainDetail> = {
  "Fpz-Cz": {
    leadName: "Fpz-Cz",
    friendlyName: "Forehead to Top of Head (Deep Sleep Lead)",
    placement: "One small sensor placed right above the bridge of your nose / forehead, paired with one on the exact center-top of your head.",
    whatItMeasures: "Deep restorative sleep waves (Delta waves) and how quietly your conscious thinking brain is resting.",
    waveMeaning: "Large, slow rolling waves mean your brain is in deep healing sleep (Stage N3). Fast, sharp spikes mean you briefly woke up or shifted in bed.",
    clinicalPurpose: "Doctors use this to verify whether your body is getting enough restorative slow-wave sleep to repair muscles, strengthen immunity, and flush daily brain toxins."
  },
  "Pz-Oz": {
    leadName: "Pz-Oz",
    friendlyName: "Crown to Back of Head (Memory & Relaxation Lead)",
    placement: "Sensors placed on the upper back of your head (crown) and the lower back base of your skull near your neck.",
    whatItMeasures: "Memory filing bursts (sleep spindles) during light sleep, and relaxation waves (Alpha waves) when you close your eyes.",
    waveMeaning: "Quick, rhythmic ripples (12–14 waves per second) indicate healthy memory storage. Smooth waves show peaceful mental relaxation.",
    clinicalPurpose: "Helps doctors diagnose sleep quality, insomnia, and confirms smooth transitions between light sleep and deep dream stages."
  },
  "EOG": {
    leadName: "EOG",
    friendlyName: "Eye Movement Tracker (Dream Stage Sensor)",
    placement: "Gentle adhesive stickers placed right next to the outer corners of your left and right eyes.",
    whatItMeasures: "The rapid back-and-forth darting of your eyeballs while you sleep.",
    waveMeaning: "Sharp, synchronized high jumps mean your eyes are darting to look at dream imagery (Stage REM). Slow gentle rolls mean you are just drifting off to sleep.",
    clinicalPurpose: "This is the medical gold standard to prove whether a patient is actively in dream sleep (Stage REM) versus being awake."
  },
  "EMG": {
    leadName: "EMG",
    friendlyName: "Chin Muscle Tone (Jaw & Relaxation Sensor)",
    placement: "Small adhesive sensors attached firmly underneath your lower lip and directly on the curve of your chin.",
    whatItMeasures: "Physical muscle tension, jaw clenching, and full-body muscle relaxation.",
    waveMeaning: "A flat line means your muscles are safely paralyzed during dreams so you don't thrash around. A thick fuzzy line means jaw clenching, teeth grinding, or waking up.",
    clinicalPurpose: "Crucial for detecting sleep apnea struggles, teeth grinding (bruxism), and verifying that your natural dream-paralysis safety switch is functioning."
  },
  "Fp1": {
    leadName: "Fp1",
    friendlyName: "Left Forehead (Emotional Reaction Sensor)",
    placement: "Attached directly to your lower left forehead, right above your left eyebrow.",
    whatItMeasures: "Immediate emotional reactions, acute stress surges, and eyelid fluttering.",
    waveMeaning: "Jagged, fast spikes show sudden mental tension, worry, or emotional alarm. Smooth waves mean emotional calm.",
    clinicalPurpose: "Evaluates how intensely your brain responds to sudden anxiety triggers or emotional stress."
  },
  "Fp2": {
    leadName: "Fp2",
    friendlyName: "Right Forehead (Alertness & Vigilance Sensor)",
    placement: "Attached directly to your lower right forehead, right above your right eyebrow.",
    whatItMeasures: "The brain's threat-detection vigilance and defensive fight-or-flight response.",
    waveMeaning: "High-frequency rapid oscillations show the brain is on high alert, scanning for danger or anticipating difficulty.",
    clinicalPurpose: "Compares with Fp1 to measure emotional balance and autonomic stress reactivity."
  },
  "F3": {
    leadName: "F3",
    friendlyName: "Left Frontal (Thinking & Calculation Area)",
    placement: "Positioned on the upper left side of your forehead, right near your front hairline.",
    whatItMeasures: "Active mental effort, logical thinking, arithmetic calculation, and working memory.",
    waveMeaning: "Rapid, low-voltage buzzing waves (Beta waves) indicate heavy mental exertion or calculation stress. Calm waves indicate a relaxed mind.",
    clinicalPurpose: "Measures cognitive overload, working memory strain, and mental fatigue during demanding tasks."
  },
  "F4": {
    leadName: "F4",
    friendlyName: "Right Frontal (Emotional Control Area)",
    placement: "Positioned on the upper right side of your forehead, near the right front hairline.",
    whatItMeasures: "Emotional self-regulation and stress resistance.",
    waveMeaning: "Persistent fast-wave activity indicates psychological distress, impatience, or tension.",
    clinicalPurpose: "Assesses how well a person handles emotional pressure without tipping into acute anxiety."
  },
  "Fz": {
    leadName: "Fz",
    friendlyName: "Center Forehead (Deep Focus & Focus Conflict)",
    placement: "Placed right in the center of your forehead along your vertical midline, near the hairline.",
    whatItMeasures: "Deep mental concentration, impulse control, and conflict resolution (like resisting a mistake).",
    waveMeaning: "Rhythmic rolling waves (Frontal Midline Theta) appear during intense unbroken focus. Erratic waves mean mental confusion or distraction.",
    clinicalPurpose: "Checks sustained attention span and detects when the brain's executive control center is overwhelmed."
  },
  "Cz": {
    leadName: "Cz",
    friendlyName: "Center Vertex (Exact Top of Head)",
    placement: "Located at the exact midpoint on the very top of your head (where the headband of headphones rests).",
    whatItMeasures: "Physical body sensation, motor movement readiness, and sensory filtering.",
    waveMeaning: "Regular, steady rhythms show physical stillness and relaxation. Sudden tall spikes indicate bodily movement or being startled.",
    clinicalPurpose: "Acts as a central benchmark for brain stability and sensorimotor regulation."
  },
  "Pz": {
    leadName: "Pz",
    friendlyName: "Parietal Crown (Sensory & Attention Hub)",
    placement: "Placed along the midline at the upper back crown of your head.",
    whatItMeasures: "Sensory integration, spatial awareness, and memory recall.",
    waveMeaning: "High synchronized waves mean the brain is calmly resting; flattened waves mean intense active attention.",
    clinicalPurpose: "Helps specialists verify sensory processing and healthy resting state maintenance."
  },
  "O1": {
    leadName: "O1",
    friendlyName: "Left Lower Back of Head (Visual Rest Sensor)",
    placement: "Positioned at the lower back of your skull on the left side, right above your neck.",
    whatItMeasures: "The brain's classic 'Alpha rhythm' that appears when your eyes are closed.",
    waveMeaning: "When you close your eyes, this produces smooth, beautiful 10-Hz rolling waves. The exact moment you open your eyes, the waves vanish.",
    clinicalPurpose: "The primary medical proof that your visual system and nervous system can cleanly switch off into a peaceful resting state."
  },
  "O2": {
    leadName: "O2",
    friendlyName: "Right Lower Back of Head (Visual Rest Sensor)",
    placement: "Positioned at the lower back of your skull on the right side.",
    whatItMeasures: "Visual idling rhythm across the right hemisphere.",
    waveMeaning: "Smooth synchronized waves during eyes-closed rest.",
    clinicalPurpose: "Verifies equal visual relaxation across both sides of the brain."
  },
  "FT9-FT10": {
    leadName: "FT9-FT10",
    friendlyName: "Side-to-Side Temple Lead (Frontotemporal)",
    placement: "Attached on the sides of your temples, just above and in front of your ears.",
    whatItMeasures: "Electrical activity spanning the temporal lobes on both sides.",
    waveMeaning: "Normal gentle ripples reflect auditory processing. Sharp sudden spikes indicate localized neural irritability.",
    clinicalPurpose: "Used in neurological evaluations to monitor temporal lobe rhythm stability."
  },
  "C3-P3": {
    leadName: "C3-P3",
    friendlyName: "Left Motor-Parietal Bipolar Lead",
    placement: "Positioned over the left motor and sensory areas on the upper left side of the skull.",
    whatItMeasures: "Sensorimotor rhythms and physical relaxation.",
    waveMeaning: "Even waves indicate quiet rest; jagged high-amplitude activity indicates motor activity.",
    clinicalPurpose: "Checks motor cortex synchronization and sleep architecture."
  },
  "F3-C3": {
    leadName: "F3-C3",
    friendlyName: "Frontal-Motor Connection Lead",
    placement: "Bridges the thinking frontal cortex and the motor movement cortex on the left side.",
    whatItMeasures: "Coordination between planning an action and executing it.",
    waveMeaning: "Rhythmic background indicates calm readiness.",
    clinicalPurpose: "Monitors neurological communication between frontal executive circuits and motor centers."
  },
  "T7-P7": {
    leadName: "T7-P7",
    friendlyName: "Left Temple-Parietal Connection Lead",
    placement: "Placed behind the left ear toward the back-side of the head.",
    whatItMeasures: "Language processing and auditory memory rhythms.",
    waveMeaning: "Regular low-voltage patterns during quiet rest.",
    clinicalPurpose: "Assesses temporal-parietal electrical stability."
  }
};

export default function SignalViewer({
  waveformData,
  sstImageUrl,
  currentTime,
  duration,
  riskStage,
  domain,
  isPlaying,
  onTogglePlay,
  onReset,
  onSeek,
  playbackSpeed,
  onChangeSpeed,
  hideLeadExplanation = false,
}: SignalViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedLead, setSelectedLead] = useState<string>("Fpz-Cz");
  const [showAllLeadsDrawer, setShowAllLeadsDrawer] = useState(false);
  const [showSpectrogramGuide, setShowSpectrogramGuide] = useState(false);

  const availableChannels = waveformData?.channels
    ? Object.keys(waveformData.channels)
    : ["Fpz-Cz"];

  useEffect(() => {
    if (waveformData?.channels && !waveformData.channels[selectedLead] && availableChannels.length > 0) {
      setSelectedLead(availableChannels[0]);
    }
  }, [waveformData, selectedLead, availableChannels]);

  const isEarlyWarning = domain === "early_warning" || domain === "stress_anxiety";
  const isSleep = domain === "sleep";

  // Oscilloscope Title
  let oscilloscopeTitle = "Medical Waveform Graph (Live Oscilloscope)";
  if (isEarlyWarning) {
    oscilloscopeTitle = "Brainwave Oscilloscope (Stress, Anxiety & Pre-Apnea)";
  } else if (isSleep) {
    oscilloscopeTitle = "Sleep Polysomnography Graph (Sleep Staging Waves)";
  }

  // Draw Waveform on Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !waveformData) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    const samples =
      waveformData.channels && waveformData.channels[selectedLead]
        ? waveformData.channels[selectedLead].samples
        : waveformData.samples || [];

    const totalSamples = samples.length;
    if (totalSamples === 0) return;

    // Clear background
    ctx.clearRect(0, 0, width, height);

    // Draw baseline grid center line
    ctx.strokeStyle = "rgba(148, 163, 184, 0.15)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();

    // Trace color scheme
    let traceColor = "#38bdf8"; // Sky
    const rLower = riskStage.toLowerCase();
    if (isEarlyWarning) {
      if (rLower.includes("stress")) {
        traceColor = "#f59e0b"; // Amber for stress
      } else if (rLower.includes("anxiety")) {
        traceColor = "#f43f5e"; // Rose for anxiety
      } else if (rLower.includes("apnea")) {
        traceColor = "#38bdf8"; // Sky for pre-apnea
      } else {
        traceColor = "#10b981"; // Emerald for baseline
      }
    } else if (isSleep) {
      if (rLower.includes("n3")) traceColor = "#818cf8"; // Indigo for deep sleep
      else if (rLower.includes("rem")) traceColor = "#22d3ee"; // Cyan for REM
      else if (rLower.includes("wake")) traceColor = "#f43f5e"; // Rose for wakefulness
      else traceColor = "#38bdf8"; // Sky for N2
    } else {
      traceColor = "#10b981";
    }

    const maxVal = Math.max(...samples.map((v) => Math.abs(v)), 30.0);
    const scaleY = (height / 2.6) / maxVal;
    const stepX = width / (totalSamples - 1);

    const currentProgress = duration > 0 ? currentTime / duration : 0;
    const currentSampleIdx = Math.floor(currentProgress * totalSamples);

    // 1. Dim Background Wave Trace
    ctx.strokeStyle = "rgba(100, 116, 139, 0.35)";
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    for (let i = 0; i < totalSamples; i++) {
      const x = i * stepX;
      const y = height / 2 - samples[i] * scaleY;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // 2. Active Played Trace
    if (currentSampleIdx > 0) {
      ctx.strokeStyle = traceColor;
      ctx.lineWidth = 2.0;
      ctx.beginPath();
      for (let i = 0; i <= currentSampleIdx; i++) {
        const x = i * stepX;
        const y = height / 2 - samples[i] * scaleY;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    // 3. Scanning Playhead Cursor
    const playheadX = currentProgress * width;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(playheadX, 0);
    ctx.lineTo(playheadX, height);
    ctx.stroke();
    ctx.setLineDash([]);

    if (currentSampleIdx < totalSamples) {
      const currentY = height / 2 - samples[currentSampleIdx] * scaleY;
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(playheadX, currentY, 4, 0, 2 * Math.PI);
      ctx.fill();
    }
  }, [waveformData, selectedLead, currentTime, duration, riskStage, isEarlyWarning, isSleep]);

  const cleanSstUrl = sstImageUrl.startsWith("http") || sstImageUrl.startsWith("/")
    ? sstImageUrl
    : `/static/processed/${sstImageUrl}`;

  // Find plain-English explanation for the active lead
  const leadInfo: LeadPlainDetail = PLAIN_ENGLISH_LEADS[selectedLead] || {
    leadName: selectedLead,
    friendlyName: `Electrode Lead (${selectedLead})`,
    placement: `Sensor attached to the scalp or body monitoring the ${selectedLead} anatomical channel.`,
    whatItMeasures: "Captures microvolt electrical variations reflecting neural or physiological oscillations.",
    waveMeaning: "Smooth waves indicate rhythmic calm; fast spikes indicate cognitive arousal, movement, or wakefulness.",
    clinicalPurpose: "Evaluated by specialists to track brain rhythm integrity and identify anomalies."
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 1000);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}.${ms.toString().padStart(3, "0")}`;
  };

  const speeds = [0.5, 1.0, 2.0, 4.0];

  return (
    <div className="space-y-4">
      {/* 1. Oscilloscope & Spectrogram Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Main Waveform Box (8 cols) */}
        <div className="lg:col-span-8 bg-slate-950 text-white rounded-2xl p-4 sm:p-5 border border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800/80 mb-2">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-sky-400" />
              <div>
                <h3 className="font-bold text-sm text-white tracking-wide">
                  {oscilloscopeTitle}
                </h3>
                <p className="text-[11px] text-slate-400">
                  Real-time physical wave recorded from the patient
                </p>
              </div>
            </div>

            {/* Selectable Lead Pills */}
            <div className="flex items-center flex-wrap gap-1 bg-slate-900 rounded-xl p-1 border border-slate-800 text-xs">
              <span className="text-[10px] font-mono text-slate-400 px-2 uppercase font-semibold">
                Channel:
              </span>
              {availableChannels.map((lead) => (
                <button
                  key={lead}
                  onClick={() => setSelectedLead(lead)}
                  className={`px-2.5 py-1 rounded-lg font-mono text-xs transition-all ${
                    selectedLead === lead
                      ? "bg-sky-500 text-slate-950 font-bold shadow-sm"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                  }`}
                  title={`View ${lead}`}
                >
                  {lead}
                </button>
              ))}
            </div>
          </div>

          {/* Canvas Waveform Viewport */}
          <div className="relative w-full h-60 bg-[#050811] rounded-xl border border-slate-800 overflow-hidden bg-eeg-grid-fine">
            <canvas
              ref={canvasRef}
              width={720}
              height={240}
              className="w-full h-full block"
            />

            <div className="absolute top-2.5 left-3 text-[11px] font-mono text-slate-300 pointer-events-none bg-slate-950/70 px-2 py-0.5 rounded border border-slate-800">
              Active Lead: <strong className="text-sky-300">{selectedLead}</strong> &bull; +100 µV
            </div>
            <div className="absolute bottom-2.5 left-3 text-[10px] font-mono text-slate-400 pointer-events-none bg-slate-950/70 px-1.5 py-0.5 rounded">
              -100 µV
            </div>
            <div className="absolute bottom-2.5 right-3 text-[10px] font-mono text-slate-400 pointer-events-none bg-slate-950/70 px-2 py-0.5 rounded">
              Window: {duration.toFixed(1)} s &bull; {waveformData?.sampling_rate_hz || 100} Hz
            </div>
          </div>

          {/* ACTIVE LEAD HEADER CALLOUT */}
          <div className="mt-3 p-2.5 bg-slate-900/90 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-mono font-bold text-xs border border-sky-500/30">
                {leadInfo.leadName}
              </span>
              <span className="font-semibold text-slate-200">
                {leadInfo.friendlyName}
              </span>
            </div>
            <span className="text-[11px] text-slate-400">
              See plain-English details right below
            </span>
          </div>
        </div>

        {/* Synchrosqueezing Transform (SST) Frequency Heatmap (4 cols) */}
        <div className="lg:col-span-4 bg-slate-950 text-white rounded-2xl p-4 sm:p-5 border border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-2">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-cyan-400" />
              <div>
                <h3 className="font-bold text-sm text-white tracking-wide">
                  Frequency Energy Heatmap
                </h3>
                <p className="text-[11px] text-slate-400">
                  128×128 SST Spectrogram
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
              AI Input
            </span>
          </div>

          <div className="relative flex flex-col items-center justify-center bg-[#050811] rounded-xl p-3 border border-slate-800">
            <div className="relative w-48 h-48 rounded-lg border border-slate-700 overflow-hidden bg-black shadow-inner">
              {cleanSstUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={cleanSstUrl}
                  alt="Synchrosqueezing Transform 128x128 representation"
                  className="w-full h-full object-cover filter contrast-125"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-slate-500">
                  Loading Spectrogram...
                </div>
              )}

              {/* Time Cursor Sweep on Spectrogram */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-white pointer-events-none shadow-[0_0_8px_white]"
                style={{ left: `${(currentTime / duration) * 100}%` }}
              />
            </div>

            <div className="w-full flex justify-between text-[10px] font-mono text-slate-400 mt-2 px-2">
              <span>0.5 Hz (Slow Delta)</span>
              <span>Mid Freq</span>
              <span>60 Hz (Fast Gamma)</span>
            </div>
          </div>

          <div className="mt-3 p-2 bg-slate-900/60 rounded-xl border border-slate-800/80 text-[11px] text-slate-400 text-center">
            Bright white spots = Strongest brain energy frequencies
          </div>
        </div>
      </div>

      {/* 2. PLAYBACK CONTROLS RIGHT BELOW THE GRAPH */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm text-slate-900 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Play/Pause & Reset Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={onTogglePlay}
              className={`flex items-center justify-center w-11 h-11 rounded-xl font-bold transition-all shadow-md ${
                isPlaying
                  ? "bg-amber-500 hover:bg-amber-400 text-slate-950"
                  : "bg-sky-500 hover:bg-sky-400 text-slate-950"
              }`}
              title={isPlaying ? "Pause Playback" : "Play Signal Live"}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 fill-current" />
              ) : (
                <Play className="w-5 h-5 fill-current ml-0.5" />
              )}
            </button>

            <button
              onClick={onReset}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors border border-slate-300"
              title="Reset Signal to Beginning (00:00)"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <div className="h-6 w-px bg-slate-200 mx-1"></div>

            {/* Speed Selector */}
            <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200 text-xs">
              <span className="text-[10px] font-semibold text-slate-500 px-2 uppercase">Speed:</span>
              {speeds.map((s) => (
                <button
                  key={s}
                  onClick={() => onChangeSpeed(s)}
                  className={`px-2.5 py-1 rounded-lg font-mono transition-all ${
                    playbackSpeed === s
                      ? "bg-white text-slate-900 font-bold shadow-xs border border-slate-300"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>

          {/* Timecode & Status */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 font-mono text-xs bg-slate-900 text-white px-3.5 py-2 rounded-xl shadow-xs">
              <span className={`w-2 h-2 rounded-full ${isPlaying ? "bg-emerald-400 animate-pulse" : "bg-slate-500"}`}></span>
              <span className="text-sky-300 font-bold">{formatTime(currentTime)}</span>
              <span className="text-slate-500">/</span>
              <span className="text-slate-400">{formatTime(duration)}</span>
            </div>
          </div>
        </div>

        {/* Scrub Bar Slider */}
        <div className="relative flex items-center pt-1">
          <input
            type="range"
            min={0}
            max={duration}
            step={0.05}
            value={currentTime}
            onChange={(e) => onSeek(parseFloat(e.target.value))}
            className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-500 focus:outline-none"
          />
        </div>

        <div className="flex justify-between items-center text-[11px] text-slate-500 pt-0.5">
          <span>00:00.000 (Start)</span>
          <span className="font-medium text-slate-700">
            Drag slider to scrub through the waveform & spectrogram in real time
          </span>
          <span>{formatTime(duration)} (End)</span>
        </div>
      </div>

      {/* 3. ACTIVE SIGNAL CLEAR EXPLANATION CARD (Plain English for Non-Medical Users) */}
      {!hideLeadExplanation && (
        <>
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm text-slate-900 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 font-mono font-bold text-xs">
                    Channel: {leadInfo.leadName}
                  </span>
                  <h4 className="text-base font-bold text-slate-900">
                    {leadInfo.friendlyName}
                  </h4>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Clear non-medical guide explaining what this specific sensor measures and what the waves mean
                </p>
              </div>

              <button
                onClick={() => setShowAllLeadsDrawer(!showAllLeadsDrawer)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold border border-slate-300 transition-colors"
              >
                <span>{showAllLeadsDrawer ? "Hide All Channels" : "Compare All Channels"}</span>
                {showAllLeadsDrawer ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* 4 Plain-English Breakdown Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 1. Placement */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex items-center gap-2 text-sky-700 font-bold text-xs uppercase tracking-wider">
                  <MapPin className="w-4 h-4" />
                  <span>Where It Is Placed on You</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {leadInfo.placement}
                </p>
              </div>

              {/* 2. What it measures */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs uppercase tracking-wider">
                  <Brain className="w-4 h-4" />
                  <span>What It Listens To in Your Body</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {leadInfo.whatItMeasures}
                </p>
              </div>

              {/* 3. Wave meaning */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex items-center gap-2 text-amber-700 font-bold text-xs uppercase tracking-wider">
                  <TrendingUp className="w-4 h-4" />
                  <span>What the Waves Mean on the Graph</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {leadInfo.waveMeaning}
                </p>
              </div>

              {/* 4. Clinical purpose */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs uppercase tracking-wider">
                  <Stethoscope className="w-4 h-4" />
                  <span>Why Your Doctor Tests This</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {leadInfo.clinicalPurpose}
                </p>
              </div>
            </div>

            {/* EXPANDABLE DRAWER: ALL CHANNELS IN THIS RECORDING */}
            {showAllLeadsDrawer && (
              <div className="pt-4 border-t border-slate-200 space-y-3 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <h5 className="font-bold text-xs uppercase tracking-wider text-slate-700">
                    All Channels in this Recording ({availableChannels.length} leads)
                  </h5>
                  <span className="text-[11px] text-slate-500 font-mono">
                    Click any channel below to switch the real-time wave graph
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {availableChannels.map((chKey) => {
                    const info = PLAIN_ENGLISH_LEADS[chKey] || {
                      leadName: chKey,
                      friendlyName: `Channel ${chKey}`,
                      placement: "Standard electrode placement on head or body.",
                      whatItMeasures: "Captures microvolt electrical variations reflecting neural or physiological oscillations.",
                      waveMeaning: "Smooth waves indicate calm rhythmic states; spikes reflect activity or noise.",
                      clinicalPurpose: "Evaluated by specialists to identify clinical patterns."
                    };
                    const isSelected = selectedLead === chKey;

                    return (
                      <button
                        key={chKey}
                        onClick={() => setSelectedLead(chKey)}
                        className={`text-left p-3 rounded-xl border transition-all ${
                          isSelected
                            ? "bg-sky-50 border-sky-400 ring-2 ring-sky-300 shadow-xs"
                            : "bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className={`font-mono font-bold text-xs ${isSelected ? "text-sky-800" : "text-slate-800"}`}>
                            {info.leadName}
                          </span>
                          {isSelected && (
                            <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-sky-200 text-sky-800">
                              Active
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-medium text-slate-900 mt-1 line-clamp-1">
                          {info.friendlyName}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2 leading-snug">
                          {info.whatItMeasures}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* 4. Spectrogram & Waveform Guide (Collapsible Evaluator Helper) */}
          <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 overflow-hidden">
            <button
              onClick={() => setShowSpectrogramGuide(!showSpectrogramGuide)}
              className="w-full px-5 py-3 flex items-center justify-between text-xs font-semibold text-slate-300 hover:bg-slate-800/80 transition-colors"
            >
              <div className="flex items-center gap-2 text-sky-400">
                <HelpCircle className="w-4 h-4" />
                <span>How the Oscilloscope Wave & Spectrogram Work Together (Non-Medical Visual Guide)</span>
              </div>
              {showSpectrogramGuide ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showSpectrogramGuide && (
              <div className="p-5 border-t border-slate-800 text-xs text-slate-300 space-y-4 leading-relaxed bg-slate-950/60">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                    <span className="font-bold text-white text-sm block">
                      1. The Oscilloscope Waveform (Top Left Graph)
                    </span>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      Think of this like an ocean wave height monitor. It graphs the tiny electrical voltages (in millionths of a volt, or µV) traveling across your scalp as brain cells communicate. When you hit <strong>Play</strong>, the white scanner moves across time, letting you see exactly when spikes, muscle twitches, or deep slow waves happened.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                    <span className="font-bold text-white text-sm block">
                      2. The SST Spectrogram Heatmap (Top Right Box)
                    </span>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      Think of this like a musical equalizer. Instead of wave height, it separates your brainwaves into frequencies: deep slow bass notes at the bottom (Delta sleep waves) and fast treble notes at the top (Beta anxiety / mental effort waves). The bright glowing spots show which frequencies your brain is firing most powerfully.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-sky-950/40 border border-sky-500/30 text-xs text-sky-200 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>
                    <strong>Why both are needed:</strong> Doctors and our AI model examine both the physical wave shape and the frequency breakdown together to achieve 96.5%+ diagnostic reliability without guesswork.
                  </span>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
