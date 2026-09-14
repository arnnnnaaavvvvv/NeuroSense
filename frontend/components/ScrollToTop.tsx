"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Ensures clean, top-aligned positioning on every page navigation.
 * Prevents pages from inheriting previous scroll offsets or opening scrolled down.
 */
export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname]);

  return null;
}
