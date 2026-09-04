"use client";

import React from "react";
import Link from "next/link";
import { Activity, Database, Moon, Brain } from "lucide-react";

export default function Navbar() {
  return (
    <>
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-zinc-200 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center shadow-md shadow-black/10 group-hover:scale-105 transition-transform">
              <Activity className="w-5 h-5 text-white stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-zinc-950 tracking-tight font-display">NeuroSense</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-800 border border-zinc-300 font-semibold">
                  v2.0 Clinical
                </span>
              </div>
              <p className="text-[11px] text-zinc-500">Sleep Staging &bull; Stress & Anxiety EEG Intelligence</p>
            </div>
          </Link>

          <nav className="flex items-center gap-3 text-sm">
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-zinc-700 hover:text-black hover:bg-zinc-100 transition-colors font-medium"
            >
              <Database className="w-4 h-4 text-zinc-900" />
              <span className="hidden sm:inline">Benchmark Dashboard</span>
            </Link>

            <Link
              href="/#architecture-bento"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-zinc-700 hover:text-black hover:bg-zinc-100 transition-colors font-medium"
            >
              <Brain className="w-4 h-4 text-zinc-900" />
              <span>Architecture</span>
            </Link>

            <div className="hidden lg:flex items-center gap-1.5 text-xs text-zinc-900 bg-zinc-100 border border-zinc-200 px-3 py-1 rounded-full font-mono">
              <span className="w-2 h-2 rounded-full bg-zinc-900 animate-pulse"></span>
              <span>Özdemir CNN (m32.h5)</span>
            </div>
          </nav>
        </div>
      </header>
    </>
  );
}
