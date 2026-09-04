"use client";

import React, { useState, useEffect } from "react";
import { ShieldAlert, CheckCircle2, Lock } from "lucide-react";

export default function DisclaimerModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const acknowledged = localStorage.getItem("neurosense_disclaimer_accepted");
    if (!acknowledged) {
      setIsOpen(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("neurosense_disclaimer_accepted", "true");
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white max-w-lg w-full rounded-2xl p-6 shadow-2xl border border-zinc-200 text-zinc-900">
        <div className="flex items-center gap-3 text-zinc-900 mb-4">
          <ShieldAlert className="w-7 h-7 shrink-0 text-zinc-950" />
          <h2 className="text-lg font-bold text-zinc-950 tracking-tight font-display">
            Clinical Research Prototype Disclaimer
          </h2>
        </div>

        <div className="space-y-3 text-sm text-zinc-700 leading-relaxed border-y border-zinc-200 py-4 my-2">
          <p>
            Welcome to <strong className="text-zinc-950">NeuroSense</strong>, an artificial intelligence demonstration system for EEG time-frequency feature extraction and neurophysiological state classification.
          </p>
          <div className="bg-zinc-50 rounded-xl p-3.5 border border-zinc-200 space-y-2.5 text-xs text-zinc-600">
            <div className="flex items-start gap-2">
              <Lock className="w-3.5 h-3.5 text-zinc-900 shrink-0 mt-0.5" />
              <span><strong>Inference-Only Architecture:</strong> Operates strictly on pre-curated benchmark demo cohorts. Dynamic file uploads are disabled by design.</span>
            </div>
            <div className="flex items-start gap-2">
              <Lock className="w-3.5 h-3.5 text-zinc-900 shrink-0 mt-0.5" />
              <span><strong>Model Citation:</strong> CNN architecture based on <em>Özdemir & Kaya (2020)</em> multi-head backbone on 128x128 Synchrosqueezing Transform representations.</span>
            </div>
            <div className="flex items-start gap-2">
              <Lock className="w-3.5 h-3.5 text-zinc-900 shrink-0 mt-0.5" />
              <span><strong>RAG Layer Grounding:</strong> Precaution guidance is strictly retrieved from published clinical guidelines (AASM, APA, NICE) with zero unverified medical claims.</span>
            </div>
          </div>
          <p className="text-xs text-zinc-600 font-medium">
            This platform is NOT a certified medical device (FDA/CE) and must NEVER be used to formulate medical diagnoses, alter prescription medications, or replace qualified clinical consultation.
          </p>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            onClick={handleAccept}
            className="flex items-center gap-2 bg-black hover:bg-zinc-800 text-white font-semibold px-5 py-2.5 rounded-xl transition-all shadow-md text-sm"
          >
            <CheckCircle2 className="w-4 h-4" />
            I Acknowledge & Agree
          </button>
        </div>
      </div>
    </div>
  );
}
