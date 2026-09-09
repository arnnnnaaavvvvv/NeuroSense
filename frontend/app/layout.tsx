import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import DisclaimerModal from "../components/DisclaimerModal";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "NeuroSense | Multi-Disorder Clinical EEG Intelligence Platform",
  description: "Clinical intelligence platform for EEG time-frequency feature extraction, AASM sleep staging, and student stress/anxiety early-warning using a shared 128×128 SST representation and multi-head CNN.",
  icons: {
    icon: [
      { url: "/icon.png", sizes: "192x192", type: "image/png" },
      { url: "/favicon.ico" }
    ],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${plusJakarta.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen bg-white text-zinc-950 flex flex-col bg-eeg-grid antialiased selection:bg-black selection:text-white font-sans">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <DisclaimerModal />
        <footer className="border-t border-zinc-200 bg-zinc-50/80 py-8 text-center text-xs text-zinc-500">
          <p className="text-zinc-400">
            For academic and clinical engineering demonstration purposes only. Not for clinical diagnosis or prescription adjustment.
          </p>
        </footer>
      </body>
    </html>
  );
}
