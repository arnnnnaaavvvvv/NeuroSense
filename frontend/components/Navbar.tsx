"use client";

import React from "react";
import Link from "next/link";
import { Activity, Database, Moon, Brain } from "lucide-react";

export default function Navbar() {
  return (
    <>
      <header className="sticky top-0 z-40 bg-[#0a0d14]/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-sky-500/20 group-hover:scale-105 transition-transform">
              <Activity className="w-6 h-6 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-white tracking-tight">NeuroSense</span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/30">
                  Multi-Disorder v2.0
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Multi-Disorder EEG Intelligence Platform (Sleep Staging &bull; Stress & Anxiety)</p>
            </div>
          </Link>

          <nav className="flex items-center gap-3 text-sm">
            <Link
              href="/"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
            >
              <Database className="w-4 h-4 text-sky-400" />
              <span className="hidden sm:inline">Benchmark Cases</span>
            </Link>

            <div className="hidden lg:flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Shared Özdemir CNN Multi-Head</span>
            </div>
          </nav>
        </div>
      </header>
    </>
  );
}
