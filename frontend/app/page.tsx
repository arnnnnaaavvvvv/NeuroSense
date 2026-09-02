"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Activity, ShieldAlert, AlertCircle, CheckCircle2, Database, ChevronRight, Filter, Info } from "lucide-react";
import { fetchCases } from "../lib/api";
import { CaseItem } from "../lib/types";

export default function CaseSelectionPage() {
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    async function loadCases() {
      try {
        setLoading(true);
        const data = await fetchCases();
        setCases(data);
        setError(null);
      } catch (err: any) {
        console.error("Failed to load cases:", err);
        setError("Unable to connect to backend service. Please verify the FastAPI backend is running.");
      } finally {
        setLoading(false);
      }
    }
    loadCases();
  }, []);

  const filteredCases = cases.filter((c) => {
    if (filter === "all") return true;
    if (filter === "baseline") return c.risk_stage?.toLowerCase().includes("baseline");
    if (filter === "pre-ictal") return c.risk_stage?.toLowerCase().includes("pre");
    if (filter === "ictal") return c.risk_stage?.toLowerCase().includes("ictal") && !c.risk_stage?.toLowerCase().includes("pre");
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Hero / System Overview Banner */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-950/60 border border-sky-500/30 text-sky-400 text-xs font-mono">
            <Activity className="w-3.5 h-3.5" />
            <span>Curated PhysioNet CHB-MIT Scalp EEG Dataset</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Epileptic Seizure Risk Classification Explorer
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Select a verified clinical recording from the curated benchmark set below. 
            All classifications use precomputed 128×128 Synchrosqueezing Transform (SST) time-frequency representations 
            evaluated with the pretrained Keras CNN model (<span className="font-mono text-sky-300">m32.h5</span>).
          </p>
        </div>

        {/* Informational Scope Note */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center gap-2 text-xs text-slate-400">
          <Info className="w-4 h-4 text-sky-400 shrink-0" />
          <span>
            <strong>Selection-Only Scope:</strong> Dynamic arbitrary file uploads are strictly disabled to ensure out-of-distribution safety and reproducible clinical validation.
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800 text-xs">
          <div className="flex items-center gap-1.5 px-3 py-1 text-slate-400">
            <Filter className="w-3.5 h-3.5" />
            <span className="font-semibold uppercase tracking-wider text-[10px]">Filter Stage:</span>
          </div>
          {[
            { id: "all", label: "All Cases (6)" },
            { id: "baseline", label: "Baseline / Inter-Ictal (2)" },
            { id: "pre-ictal", label: "Pre-Ictal / Transitional (2)" },
            { id: "ictal", label: "Ictal / Active Seizure (2)" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg transition-all font-medium ${
                filter === tab.id
                  ? "bg-sky-500 text-slate-950 font-bold shadow-md shadow-sky-500/20"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-400 font-mono">
          Showing {filteredCases.length} of {cases.length} cases
        </div>
      </div>

      {/* Loading & Error States */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="glass-panel rounded-xl p-5 border border-slate-800 animate-pulse h-64 space-y-4">
              <div className="h-6 bg-slate-800 rounded w-1/2"></div>
              <div className="h-16 bg-slate-800/50 rounded"></div>
              <div className="h-8 bg-slate-800 rounded"></div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="glass-panel rounded-xl p-6 border border-rose-500/40 bg-rose-950/20 text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-rose-400 mx-auto" />
          <h3 className="font-bold text-white text-base">Backend Connection Notice</h3>
          <p className="text-xs text-slate-300 max-w-lg mx-auto">{error}</p>
        </div>
      )}

      {/* Case Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCases.map((c) => {
            const isIctal = c.risk_stage?.toLowerCase().includes("ictal") && !c.risk_stage?.toLowerCase().includes("pre");
            const isPreIctal = c.risk_stage?.toLowerCase().includes("pre");

            let badgeStyle = "bg-emerald-950/60 text-emerald-300 border-emerald-500/30";
            let StageIcon = CheckCircle2;
            if (isIctal) {
              badgeStyle = "bg-rose-950/60 text-rose-300 border-rose-500/40";
              StageIcon = ShieldAlert;
            } else if (isPreIctal) {
              badgeStyle = "bg-amber-950/60 text-amber-300 border-amber-500/30";
              StageIcon = AlertCircle;
            }

            return (
              <Link
                key={c.id}
                href={`/analysis/${c.id}`}
                className="glass-panel rounded-xl p-5 border border-slate-800 hover:border-sky-500/50 hover:shadow-xl hover:shadow-sky-500/10 transition-all flex flex-col justify-between group cursor-pointer"
              >
                <div className="space-y-3">
                  {/* Card Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center font-mono font-bold text-xs text-sky-400 group-hover:bg-sky-500 group-hover:text-slate-950 transition-colors">
                        {c.patient_anon_id.toUpperCase()}
                      </div>
                      <div>
                        <h2 className="font-bold text-sm text-white font-mono">{c.id}</h2>
                        <span className="text-[10px] text-slate-400">
                          Patient {c.patient_anon_id} &bull; {c.age_years || 11}y &bull; {c.gender || "Female"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Risk Stage Pill */}
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border ${badgeStyle}`}>
                    <StageIcon className="w-3.5 h-3.5" />
                    <span>{c.risk_stage}</span>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                    {c.description}
                  </p>
                </div>

                {/* Footer Action */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="font-mono text-[11px] text-slate-400">
                    Lead: FT9-FT10 &bull; 256 Hz
                  </span>
                  <div className="flex items-center gap-1 text-sky-400 font-semibold group-hover:translate-x-1 transition-transform">
                    <span>Inspect Signal</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
