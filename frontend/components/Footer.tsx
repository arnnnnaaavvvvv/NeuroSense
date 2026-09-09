import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Database, Brain, ShieldCheck, Activity } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-50/80 text-zinc-600 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-zinc-200/80">
          {/* Brand Identity */}
          <div className="flex items-center gap-3.5 text-center md:text-left">
            <div className="w-9 h-9 rounded-xl overflow-hidden shadow-sm border border-zinc-200/80 flex-shrink-0 bg-white">
              <Image
                src="/logo.png"
                alt="NeuroSense Logo"
                width={36}
                height={36}
                className="w-full h-full object-contain p-1"
              />
            </div>
            <div>
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <span className="font-bold text-base text-zinc-950 font-display tracking-tight">
                  NeuroSense
                </span>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Inference Ready
                </span>
              </div>
              <p className="text-xs text-zinc-500 mt-0.5">
                Multi-Disorder Clinical EEG Intelligence Platform
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <nav className="flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-zinc-600">
            <Link
              href="/dashboard"
              className="hover:text-zinc-950 transition-colors flex items-center gap-1.5"
            >
              <Database className="w-3.5 h-3.5 text-zinc-400" />
              <span>Benchmark Dashboard</span>
            </Link>
            <Link
              href="/#architecture-bento"
              className="hover:text-zinc-950 transition-colors flex items-center gap-1.5"
            >
              <Brain className="w-3.5 h-3.5 text-zinc-400" />
              <span>Architecture</span>
            </Link>
            <Link
              href="/#clinical-guidance"
              className="hover:text-zinc-950 transition-colors flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
              <span>Clinical Guidelines</span>
            </Link>
          </nav>
        </div>

        {/* Bottom Section: Legal & Disclaimer */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p className="font-medium text-zinc-600 text-center sm:text-left">
            &copy; {new Date().getFullYear()} NeuroSense. All rights reserved.
          </p>
          <p className="text-[11px] text-zinc-400 text-center sm:text-right max-w-xl leading-relaxed">
            For academic and clinical engineering demonstration purposes only. Not for clinical diagnosis or prescription adjustment.
          </p>
        </div>
      </div>
    </footer>
  );
}
