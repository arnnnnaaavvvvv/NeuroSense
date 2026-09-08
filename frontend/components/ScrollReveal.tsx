"use client";

import React, { useEffect, useRef, ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  animation?: "fade-up" | "fade-down" | "fade-left" | "fade-right" | "zoom-in" | "blur-in";
  delay?: number;
  className?: string;
  threshold?: number;
  once?: boolean;
}

/**
 * ScrollReveal Component
 * Live bidirectional scroll-triggered animations (triggers when scrolling down AND scrolling up).
 */
export default function ScrollReveal({
  children,
  animation = "fade-up",
  delay = 0,
  className = "",
  threshold = 0.02,
  once = true,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      el.classList.add("is-visible");
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
          if (once) {
            observer.unobserve(el);
          }
        } else if (!once) {
          el.classList.remove("is-visible");
        }
      },
      {
        threshold,
        rootMargin: "0px 0px 80px 0px",
      }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [threshold, once]);

  return (
    <div
      ref={ref}
      data-reveal={animation}
      data-reveal-delay={delay > 0 ? String(delay) : undefined}
      style={delay > 0 ? { transitionDelay: `${delay}ms` } : undefined}
      className={className}
    >
      {children}
    </div>
  );
}

/**
 * Hook to automatically observe all raw elements with `[data-reveal]` on the page
 * with smooth, instantaneous hardware-accelerated reveals.
 */
export function useScrollRevealInit() {
  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      document.querySelectorAll("[data-reveal]").forEach((el) => {
        el.classList.add("is-visible");
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.02,
        rootMargin: "0px 0px 80px 0px",
      }
    );

    const elements = document.querySelectorAll("[data-reveal]");
    elements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, []);
}
