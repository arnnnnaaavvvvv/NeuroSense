import type { Metadata } from "next";
import "./globals.css";
import Navbar from "../components/Navbar";
import DisclaimerBanner from "../components/DisclaimerBanner";
import DisclaimerModal from "../components/DisclaimerModal";

export const metadata: Metadata = {
  title: "NeuroSense | Multi-Disorder Clinical EEG Intelligence Platform",
  description: "Clinical research prototype for EEG time-frequency feature extraction, AASM sleep staging, and student stress/anxiety early-warning using a shared 128×128 SST representation and multi-head CNN.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-zinc-950 flex flex-col bg-eeg-grid antialiased selection:bg-black selection:text-white">
        <DisclaimerBanner />
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <DisclaimerModal />
        <footer className="border-t border-zinc-200 bg-zinc-50/80 py-8 text-center text-xs text-zinc-500">
          <p>
            NeuroSense Research Prototype &bull; Model Checkpoint: <span className="font-mono font-semibold text-zinc-800">m32.h5 Shared Backbone</span> &bull; Verified Cohorts: <span className="font-mono text-zinc-700">PhysioNet Sleep-EDF, SAM-40 Stress & DASPS Anxiety</span>
          </p>
          <p className="mt-1 text-zinc-400">
            For academic and clinical engineering demonstration purposes only. Not for clinical diagnosis or prescription adjustment.
          </p>
        </footer>
      </body>
    </html>
  );
}
