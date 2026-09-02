"use client";

import React from "react";
import { Play, Pause, RotateCcw, FastForward, Volume2 } from "lucide-react";

interface ReplayControlsProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onReset: () => void;
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  playbackSpeed: number;
  onChangeSpeed: (speed: number) => void;
}

export default function ReplayControls({
  isPlaying,
  onTogglePlay,
  onReset,
  currentTime,
  duration,
  onSeek,
  playbackSpeed,
  onChangeSpeed,
}: ReplayControlsProps) {
  const speeds = [0.5, 1.0, 2.0];
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 1000);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}.${ms.toString().padStart(3, "0")}`;
  };

  return (
    <div className="glass-panel rounded-xl p-4 border border-slate-800 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Playback Button Group */}
        <div className="flex items-center gap-2">
          <button
            onClick={onTogglePlay}
            className={`flex items-center justify-center w-10 h-10 rounded-xl font-bold transition-all shadow-md ${
              isPlaying
                ? "bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20"
                : "bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-sky-500/20"
            }`}
            title={isPlaying ? "Pause Telemetry Playback" : "Play Signal Telemetry"}
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
          </button>

          <button
            onClick={onReset}
            className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700"
            title="Reset to 00:00"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <div className="h-6 w-px bg-slate-800 mx-1"></div>

          {/* Speed Selector */}
          <div className="flex items-center bg-slate-900 rounded-lg p-1 border border-slate-800 text-xs">
            {speeds.map((s) => (
              <button
                key={s}
                onClick={() => onChangeSpeed(s)}
                className={`px-2 py-1 rounded font-mono transition-colors ${
                  playbackSpeed === s
                    ? "bg-sky-500/20 text-sky-300 font-semibold border border-sky-500/40"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>

        {/* Timecode Display */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 font-mono text-xs bg-slate-900/90 px-3 py-1.5 rounded-lg border border-slate-800">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span className="text-cyan-300 font-bold">{formatTime(currentTime)}</span>
            <span className="text-slate-500">/</span>
            <span className="text-slate-400">{formatTime(duration)}</span>
          </div>
        </div>
      </div>

      {/* Scrub Bar */}
      <div className="relative flex items-center group">
        <input
          type="range"
          min={0}
          max={duration}
          step={0.05}
          value={currentTime}
          onChange={(e) => onSeek(parseFloat(e.target.value))}
          className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-400 focus:outline-none"
        />
        <div
          className="absolute left-0 top-0 h-2 bg-gradient-to-r from-sky-500 to-cyan-400 rounded-lg pointer-events-none"
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>
    </div>
  );
}
