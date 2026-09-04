import React from "react";
import { AlertTriangle, ShieldAlert } from "lucide-react";

export default function DisclaimerBanner() {
  return (
    <aside aria-label="Medical research prototype disclaimer" className="bg-zinc-50 border-b border-zinc-200 text-zinc-700 px-4 py-2 text-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-zinc-900 shrink-0" />
          <p>
            <strong className="font-semibold text-zinc-950">RESEARCH PROTOTYPE ONLY:</strong> NeuroSense is an educational and clinical engineering demonstration. It is not an FDA/CE-cleared diagnostic device and must not be used for clinical decision-making.
          </p>
        </div>
        <span className="hidden md:inline-block px-2.5 py-0.5 rounded text-[10px] uppercase font-mono font-semibold tracking-wider bg-zinc-200 text-zinc-900 border border-zinc-300">
          Inference-Only Demo
        </span>
      </div>
    </aside>
  );
}
