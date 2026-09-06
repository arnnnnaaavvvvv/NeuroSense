import React from "react";
import Image from "next/image";

interface NeuroSenseLogoProps {
  className?: string;
  size?: number;
  priority?: boolean;
}

export default function NeuroSenseLogo({
  className = "w-10 h-10",
  size = 40,
  priority = false,
}: NeuroSenseLogoProps) {
  return (
    <div className={`relative flex-shrink-0 flex items-center justify-center overflow-hidden rounded-xl shadow-md shadow-black/10 ${className}`}>
      <Image
        src="/logo.png"
        alt="NeuroSense Logo"
        width={size}
        height={size}
        className="w-full h-full object-contain"
        priority={priority}
      />
    </div>
  );
}
