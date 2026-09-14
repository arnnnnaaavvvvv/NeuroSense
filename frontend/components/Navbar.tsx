"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Database } from "lucide-react";

export default function Navbar() {
  return (
    <>
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-zinc-200 shadow-[0_1px_3px_rgba(0,0,0,0.03)] font-outfit">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-md shadow-black/10 group-hover:scale-105 transition-transform flex-shrink-0">
              <Image
                src="/logo.png"
                alt="NeuroSense Logo"
                width={40}
                height={40}
                className="w-full h-full object-contain"
                priority
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-zinc-950 tracking-tight font-display">NeuroSense</span>
              </div>
              <p className="text-[11px] text-zinc-500">Cognitive Stress &bull; State Anxiety EEG Intelligence</p>
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
          </nav>
        </div>
      </header>
    </>
  );
}
