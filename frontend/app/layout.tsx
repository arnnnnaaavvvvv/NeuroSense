import type { Metadata } from "next";
import "./globals.css";
import Navbar from "../components/Navbar";
import DisclaimerBanner from "../components/DisclaimerBanner";
import DisclaimerModal from "../components/DisclaimerModal";

export const metadata: Metadata = {
  title: "NeuroSense | EEG Epileptic Seizure Risk Classification",
  description: "Clinical research prototype demo for EEG time-frequency feature extraction and seizure risk classification using pretrained Keras CNN (m32.h5) and RAG precaution guidance.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#0a0d14] text-slate-100 flex flex-col bg-eeg-grid antialiased">
        <DisclaimerBanner />
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
        <DisclaimerModal />
        <footer className="border-t border-slate-800/80 bg-[#070a10] py-6 text-center text-xs text-slate-500">
          <p>
            NeuroSense Research Prototype &bull; Model Checkpoint: <span className="font-mono text-slate-400">m32.h5</span> (Özdemir & Kaya 2020) &bull; Dataset: <span className="font-mono text-slate-400">PhysioNet CHB-MIT</span>
          </p>
          <p className="mt-1 text-slate-600">
            For academic and clinical engineering demonstration purposes only. Not for medical diagnosis.
          </p>
        </footer>
      </body>
    </html>
  );
}
