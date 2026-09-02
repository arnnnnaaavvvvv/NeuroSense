import React from "react";
import { AlertTriangle, ShieldAlert } from "lucide-react";

export default function DisclaimerBanner() {
  return (
    <aside aria-label="Medical research prototype disclaimer" className="bg-amber-950/40 border-b border-amber-500/30 text-amber-200 px-4 py-2 text-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <p>
            <strong className="font-semibold text-amber-300">RESEARCH PROTOTYPE ONLY:</strong> NeuroSense is an educational and clinical research demonstration. It is not an FDA/CE-cleared diagnostic device and must not be used for patient management.
          </p>
        </div>
        <span className="hidden md:inline-block px-2 py-0.5 rounded text-[10px] uppercase font-mono tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
          Inference-Only Demo
        </span>
      </div>
    </aside>
  );
}
