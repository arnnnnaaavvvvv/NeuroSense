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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="glass-panel max-w-lg w-full rounded-xl p-6 shadow-2xl border border-amber-500/30 text-slate-200">
        <div className="flex items-center gap-3 text-amber-400 mb-4">
          <ShieldAlert className="w-8 h-8 shrink-0" />
          <h2 className="text-lg font-bold text-white tracking-wide">
            Clinical Research Prototype Disclaimer
          </h2>
        </div>

        <div className="space-y-3 text-sm text-slate-300 leading-relaxed border-y border-slate-700/60 py-4 my-2">
          <p>
            Welcome to <strong className="text-sky-400">NeuroSense</strong>, an artificial intelligence demonstration system for EEG time-frequency feature extraction and seizure risk classification.
          </p>
          <div className="bg-slate-900/80 rounded-lg p-3 border border-slate-800 space-y-2 text-xs text-slate-400">
            <div className="flex items-start gap-2">
              <Lock className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
              <span><strong>Inference-Only Architecture:</strong> Operates strictly on pre-curated PhysioNet CHB-MIT demo cases. Dynamic file uploads are disabled by design.</span>
            </div>
            <div className="flex items-start gap-2">
              <Lock className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
              <span><strong>Model Citation:</strong> CNN architecture based on <em>Özdemir & Kaya (2020)</em> trained on 128x128 Synchrosqueezing Transform matrices.</span>
            </div>
            <div className="flex items-start gap-2">
              <Lock className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
              <span><strong>RAG Layer Grounding:</strong> Precaution guidance is strictly retrieved from published clinical guidelines (AES, ILAE, NICE) with zero unverified medical claims.</span>
            </div>
          </div>
          <p className="text-xs text-amber-300/90 font-medium">
            This platform is NOT a certified medical device (FDA/CE) and must NEVER be used to formulate medical diagnoses, alter prescription anti-seizure medication (ASM), or replace qualified neurological consultation.
          </p>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            onClick={handleAccept}
            className="flex items-center gap-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold px-5 py-2.5 rounded-lg transition-all shadow-lg shadow-sky-500/20 text-sm"
          >
            <CheckCircle2 className="w-4 h-4" />
            I Acknowledge & Agree
          </button>
        </div>
      </div>
    </div>
  );
}
