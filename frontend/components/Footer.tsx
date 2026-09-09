import React from "react";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-50/80 py-6 text-center text-xs text-zinc-500 font-sans">
      <p>&copy; {new Date().getFullYear()} NeuroSense. All rights reserved.</p>
    </footer>
  );
}
