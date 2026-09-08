"use client";

import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function AOSInit() {
  useEffect(() => {
    AOS.init({
      duration: 500,
      easing: "ease-out-cubic",
      once: false,
      mirror: true,
      offset: 50,
      delay: 0,
      anchorPlacement: "top-bottom",
    });
    
    // Refresh after DOM layout is ready
    const timer = setTimeout(() => {
      AOS.refresh();
    }, 150);

    return () => clearTimeout(timer);
  }, []);

  return null;
}
