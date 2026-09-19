"use client";

import React, { useRef, useEffect, useState } from "react";

interface CardLiveSignalProps {
  caseId: string;
  channel?: string;
  strokeColor: string;
  glowColor: string;
  samplingRate?: number;
}

export default function CardLiveSignal({
  caseId,
  channel = "F3",
  strokeColor,
  glowColor,
  samplingRate = 128,
}: CardLiveSignalProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [liveVoltage, setLiveVoltage] = useState<number>(0);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    let isCancelled = false;
    let rawSamples: number[] = [];

    // Fallback physiological wave generator based on case type if network/file takes a moment
    const generateFallbackSamples = () => {
      const arr: number[] = [];
      const total = 640; // 5 seconds @ 128Hz
      const id = caseId.toLowerCase();

      for (let i = 0; i < total; i++) {
        const t = i / 128;
        let v = 0;
        if (id.includes("math") || id.includes("stress")) {
          // Fast beta (18-28 Hz) + desynchronized low alpha
          v = Math.sin(2 * Math.PI * 22 * t) * 14 +
              Math.sin(2 * Math.PI * 18 * t) * 10 +
              (Math.random() - 0.5) * 12 +
              Math.sin(2 * Math.PI * 6 * t) * 6;
        } else if (id.includes("stroop") || id.includes("conflict")) {
          // Frontal Midline Theta (4-7 Hz) bursts + beta
          const thetaMod = 0.5 + 0.5 * Math.sin(2 * Math.PI * 1.2 * t);
          v = Math.sin(2 * Math.PI * 5.8 * t) * 28 * thetaMod +
              Math.sin(2 * Math.PI * 20 * t) * 7 +
              (Math.random() - 0.5) * 8;
        } else if (id.includes("anxiety")) {
          // Rapid high-frequency beta ripples (20-30 Hz) + sharp transient shifts
          v = Math.sin(2 * Math.PI * 24 * t) * 20 +
              Math.sin(2 * Math.PI * 15 * t) * 12 +
              Math.sin(2 * Math.PI * 3.5 * t) * 8 +
              (Math.random() - 0.5) * 16;
        } else {
          // Dominant, synchronous 10 Hz resting posterior alpha wave
          v = Math.sin(2 * Math.PI * 10.1 * t) * 22 +
              Math.sin(2 * Math.PI * 9.8 * t) * 10 +
              (Math.random() - 0.5) * 4;
        }
        arr.push(v);
      }
      return arr;
    };

    rawSamples = generateFallbackSamples();

    // Fetch real ground-truth calibrated microvolt samples from static JSON
    fetch(`/static/processed/${caseId}_raw.json`)
      .then((res) => {
        if (!res.ok) throw new Error("Could not load raw waveform");
        return res.json();
      })
      .then((data) => {
        if (isCancelled) return;
        const ch = channel || "F3";
        if (data.channels && data.channels[ch]?.samples) {
          rawSamples = data.channels[ch].samples;
        } else if (data.samples && data.samples.length > 0) {
          rawSamples = data.samples;
        }
      })
      .catch(() => {
        // Keeps fallback samples smoothly
      });

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let sweepOffset = 0;
    let lastTime = performance.now();

    const render = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      const width = canvas.width;
      const height = canvas.height;
      const midY = height / 2;
      const ampRange = 85.0; // Scaled for mini card viewport

      // Advance sweep cursor across the screen: full sweep in ~4.5 seconds
      const sweepSpeed = width / 4.5;
      sweepOffset = (sweepOffset + sweepSpeed * dt) % width;

      // Clear dark CRT background
      ctx.fillStyle = "#040711";
      ctx.fillRect(0, 0, width, height);

      // Fine medical grid
      ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
      ctx.lineWidth = 1;

      // Horizontal lines
      ctx.beginPath();
      ctx.moveTo(0, midY);
      ctx.lineTo(width, midY);
      ctx.moveTo(0, midY - height * 0.32);
      ctx.lineTo(width, midY - height * 0.32);
      ctx.moveTo(0, midY + height * 0.32);
      ctx.lineTo(width, midY + height * 0.32);
      ctx.stroke();

      // Vertical time grid lines
      const colW = width / 8;
      ctx.beginPath();
      for (let x = colW; x < width; x += colW) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      ctx.stroke();

      const totalSamples = rawSamples.length || 640;
      const eraseGap = 20; // 20px black erase bar ahead of cursor

      // Current sample under cursor
      const progress = sweepOffset / width;
      const curIdx = Math.floor(progress * (totalSamples - 1));
      const curVal = rawSamples[curIdx] || 0;
      setLiveVoltage(curVal);

      const normCur = Math.max(-1, Math.min(1, curVal / ampRange));
      const cursorY = midY - normCur * (height * 0.4);

      // 1. Draw older trace (ahead of erase gap to the right) with soft phosphor fade
      ctx.save();
      ctx.beginPath();
      ctx.strokeStyle = strokeColor;
      ctx.globalAlpha = 0.25;
      ctx.lineWidth = 1.4;

      const rightStart = sweepOffset + eraseGap;
      if (rightStart < width) {
        let started = false;
        for (let x = rightStart; x < width; x += 1.5) {
          const sampleRatio = x / width;
          const sIdx = Math.floor(sampleRatio * (totalSamples - 1));
          const v = rawSamples[sIdx] || 0;
          const n = Math.max(-1, Math.min(1, v / ampRange));
          const y = midY - n * (height * 0.4);

          if (!started) {
            ctx.moveTo(x, y);
            started = true;
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }
      ctx.restore();

      // 2. Draw freshly written live wave (from 0 to sweepOffset) with high luminescence
      ctx.save();
      ctx.beginPath();
      ctx.strokeStyle = strokeColor;
      ctx.shadowColor = glowColor;
      ctx.shadowBlur = 8;
      ctx.lineWidth = 1.8;
      ctx.lineJoin = "round";

      let freshStarted = false;
      for (let x = 0; x <= sweepOffset; x += 1.5) {
        const sampleRatio = x / width;
        const sIdx = Math.floor(sampleRatio * (totalSamples - 1));
        const v = rawSamples[sIdx] || 0;
        const n = Math.max(-1, Math.min(1, v / ampRange));
        const y = midY - n * (height * 0.4);

        if (!freshStarted) {
          ctx.moveTo(x, y);
          freshStarted = true;
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
      ctx.restore();

      // 3. Draw scanning laser cursor line
      ctx.save();
      const grad = ctx.createLinearGradient(sweepOffset, 0, sweepOffset, height);
      grad.addColorStop(0, "rgba(255, 255, 255, 0.05)");
      grad.addColorStop(0.5, glowColor);
      grad.addColorStop(1, "rgba(255, 255, 255, 0.05)");
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(sweepOffset, 0);
      ctx.lineTo(sweepOffset, height);
      ctx.stroke();

      // Glowing tracer blip on active peak
      ctx.shadowColor = glowColor;
      ctx.shadowBlur = 10;
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(sweepOffset, cursorY, 3, 0, Math.PI * 2);
      ctx.fill();

      // Outer aura ring
      ctx.strokeStyle = glowColor;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(sweepOffset, cursorY, 6, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      animationRef.current = requestAnimationFrame(render);
    };

    animationRef.current = requestAnimationFrame(render);

    return () => {
      isCancelled = true;
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [caseId, channel, strokeColor, glowColor]);

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-white/10 bg-[#040711] shadow-inner group/signal">
      {/* Top Telemetry Header inside oscilloscope */}
      <div className="flex items-center justify-between px-2.5 py-1.5 border-b border-white/5 bg-slate-950/60 text-[10px] font-mono">
        <div className="flex items-center gap-1.5">
          <span
            className="w-1.5 h-1.5 rounded-full animate-ping"
            style={{ backgroundColor: strokeColor }}
          />
          <span className="text-zinc-300 font-semibold tracking-wider uppercase">
            LIVE SIGNAL &bull; {channel}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-zinc-500 font-medium">AMP:</span>
          <span
            className="font-bold tracking-tight px-1.5 py-0.2 rounded bg-black/70 border border-white/10 min-w-[58px] text-right"
            style={{ color: strokeColor }}
          >
            {liveVoltage >= 0 ? `+${liveVoltage.toFixed(1)}` : liveVoltage.toFixed(1)} µV
          </span>
        </div>
      </div>

      {/* 60fps Live EEG Canvas */}
      <canvas
        ref={canvasRef}
        width={360}
        height={72}
        className="w-full h-[72px] block"
      />

      {/* Bottom Subtle Scale Tag */}
      <div className="absolute bottom-1 right-2 text-[9px] font-mono text-zinc-500 pointer-events-none">
        {samplingRate} Hz &bull; &plusmn;100 µV
      </div>
    </div>
  );
}
