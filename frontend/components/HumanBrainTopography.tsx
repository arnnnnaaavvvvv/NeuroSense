"use client";

import React, { useState } from "react";
import { Brain, Sparkles, CheckCircle2, Activity, Info } from "lucide-react";

interface HumanBrainTopographyProps {
  selectedLead: string;
  availableChannels: string[];
  onSelectLead: (lead: string) => void;
  themeColor?: string; // e.g. #10b981, #f43f5e, #c084fc, #f59e0b
  themeGlow?: string;
}

interface AnatomicalNode {
  key: string;
  label: string;
  x: number;
  y: number;
  lobe: "Frontal" | "Central" | "Parietal" | "Occipital";
  region: string;
  broadmann: string;
  functionalRole: string;
}

const BRAIN_NODES: AnatomicalNode[] = [
  {
    key: "Fp1",
    label: "Fp1",
    x: 114,
    y: 72,
    lobe: "Frontal",
    region: "Left Frontopolar Cortex",
    broadmann: "BA 10",
    functionalRole: "Executive planning, attentional gating, and prospective memory",
  },
  {
    key: "Fp2",
    label: "Fp2",
    x: 206,
    y: 72,
    lobe: "Frontal",
    region: "Right Frontopolar Cortex",
    broadmann: "BA 10",
    functionalRole: "Emotional valence evaluation and avoidance decision processing",
  },
  {
    key: "F3",
    label: "F3",
    x: 88,
    y: 116,
    lobe: "Frontal",
    region: "Left Dorsolateral Prefrontal (DLPFC)",
    broadmann: "BA 9/46",
    functionalRole: "Working memory, mental arithmetic load, and cognitive inhibition",
  },
  {
    key: "Fz",
    label: "Fz",
    x: 160,
    y: 108,
    lobe: "Frontal",
    region: "Frontal Midline (Pre-SMA)",
    broadmann: "BA 6/8",
    functionalRole: "Cognitive conflict resolution and theta-band task engagement",
  },
  {
    key: "F4",
    label: "F4",
    x: 232,
    y: 116,
    lobe: "Frontal",
    region: "Right Dorsolateral Prefrontal (DLPFC)",
    broadmann: "BA 9/46",
    functionalRole: "Arousal regulation, threat vigilance, and acute stress modulation",
  },
  {
    key: "Cz",
    label: "Cz",
    x: 160,
    y: 166,
    lobe: "Central",
    region: "Central Vertex (Sensorimotor Strip)",
    broadmann: "BA 3/1/2/4",
    functionalRole: "Primary motor execution, sensory integration, and somatic gating",
  },
  {
    key: "Pz",
    label: "Pz",
    x: 160,
    y: 220,
    lobe: "Parietal",
    region: "Parietal Midline (Precuneus)",
    broadmann: "BA 7",
    functionalRole: "Visuospatial attention, default-mode node, and sensory awareness",
  },
  {
    key: "O1",
    label: "O1",
    x: 114,
    y: 266,
    lobe: "Occipital",
    region: "Left Occipital (Primary Visual Cortex)",
    broadmann: "BA 17/18",
    functionalRole: "Dominant resting alpha rhythm generator and visual input decoding",
  },
  {
    key: "O2",
    label: "O2",
    x: 206,
    y: 266,
    lobe: "Occipital",
    region: "Right Occipital (Visual Association)",
    broadmann: "BA 17/18",
    functionalRole: "Occipital alpha synchrony and visual spatial processing",
  },
];

export default function HumanBrainTopography({
  selectedLead,
  availableChannels,
  onSelectLead,
  themeColor = "#10b981",
  themeGlow = "#34d399",
}: HumanBrainTopographyProps) {
  const [hoveredNode, setHoveredNode] = useState<AnatomicalNode | null>(null);

  const activeNode = BRAIN_NODES.find((n) => n.key === selectedLead) || BRAIN_NODES[0];
  const currentNode = hoveredNode || activeNode;

  return (
    <div className="flex flex-col items-center justify-between h-full space-y-3 select-none w-full">
      {/* Top Clinical Header: Live Anatomical Lobe & Functional Region */}
      <div className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[#090d16] border border-slate-800 text-white shadow-md">
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border"
            style={{
              backgroundColor: `${themeColor}15`,
              borderColor: `${themeColor}40`,
              color: themeColor,
            }}
          >
            <Brain className="w-4 h-4" />
          </div>
          <div className="leading-tight truncate">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-bold font-display text-zinc-100 truncate">
                {currentNode.region}
              </span>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-800/90 text-slate-300 border border-slate-700/60 shrink-0">
                {currentNode.broadmann}
              </span>
            </div>
            <div className="text-[10px] text-zinc-400 font-sans truncate mt-0.5">
              Lobe: <strong className="text-zinc-200">{currentNode.lobe} Cortex</strong> &bull; Lead{" "}
              <strong className="text-white font-mono">{currentNode.label}</strong>
            </div>
          </div>
        </div>

        <div className="text-right shrink-0 pl-2">
          <span
            className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border shadow-sm tracking-wider uppercase"
            style={{
              backgroundColor: `${themeColor}20`,
              color: themeColor,
              borderColor: `${themeColor}60`,
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ backgroundColor: themeColor }}
            />
            {selectedLead} ACTIVE
          </span>
        </div>
      </div>

      {/* Main Anatomical Human Brain Display (Superior / Axial View) */}
      <div className="relative w-full max-w-[320px] aspect-square flex items-center justify-center">
        <svg
          viewBox="0 0 320 320"
          className="w-full h-full drop-shadow-2xl overflow-visible"
        >
          <defs>
            {/* Ambient Deep Shadow behind Brain */}
            <radialGradient id="deepBrainShadow" cx="50%" cy="50%" r="50%">
              <stop offset="60%" stopColor="#020409" stopOpacity="0.9" />
              <stop offset="95%" stopColor="#020409" stopOpacity="0" />
            </radialGradient>

            {/* Natural Cortical Shading - Left Cerebral Hemisphere */}
            <radialGradient id="leftHemisphereCortex" cx="36%" cy="42%" r="62%">
              <stop offset="0%" stopColor="#2c3e5a" />
              <stop offset="25%" stopColor="#1e2c42" />
              <stop offset="55%" stopColor="#141c2c" />
              <stop offset="85%" stopColor="#0a0f18" />
              <stop offset="100%" stopColor="#05080e" />
            </radialGradient>

            {/* Natural Cortical Shading - Right Cerebral Hemisphere */}
            <radialGradient id="rightHemisphereCortex" cx="64%" cy="42%" r="62%">
              <stop offset="0%" stopColor="#2c3e5a" />
              <stop offset="25%" stopColor="#1e2c42" />
              <stop offset="55%" stopColor="#141c2c" />
              <stop offset="85%" stopColor="#0a0f18" />
              <stop offset="100%" stopColor="#05080e" />
            </radialGradient>

            {/* Cerebellar Folia Gradient */}
            <linearGradient id="cerebellumShade" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1a2536" />
              <stop offset="60%" stopColor="#101724" />
              <stop offset="100%" stopColor="#05080f" />
            </linearGradient>

            {/* Active Electrode Beam Filter */}
            <filter id="electrodeGlow" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="4.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Biological Gyri Convolution Pattern Overlay */}
            <filter id="cortexNoise" x="0%" y="0%" width="100%" height="100%">
              <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
              <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.12 0" />
              <feComposite in2="SourceAlpha" operator="in" />
            </filter>
          </defs>

          {/* 1. ANATOMICAL HEAD/CRANIUM OUTLINE (10-20 Standard Spatial Shell) */}
          <ellipse cx="160" cy="164" rx="142" ry="144" fill="url(#deepBrainShadow)" />

          {/* Translucent Cranial Envelope with Anatomical Fiducials */}
          <path
            d="M 160,18
               C 165,18 167,24 170,32
               C 220,35 274,78 288,130
               C 294,152 294,178 286,204
               C 270,250 220,294 160,300
               C 100,294 50,250 34,204
               C 26,178 26,152 32,130
               C 46,78 100,35 150,32
               C 153,24 155,18 160,18 Z"
            fill="#03060c"
            stroke="#1e293b"
            strokeWidth="1.6"
            strokeDasharray="4,4"
            opacity="0.65"
          />

          {/* Preauricular Notches (Ears: Left & Right) */}
          <path
            d="M 28,142 C 16,148 16,178 28,184"
            fill="none"
            stroke="#334155"
            strokeWidth="2.2"
            strokeLinecap="round"
            opacity="0.8"
          />
          <path
            d="M 292,142 C 304,148 304,178 292,184"
            fill="none"
            stroke="#334155"
            strokeWidth="2.2"
            strokeLinecap="round"
            opacity="0.8"
          />

          {/* Nasion Apex Notch (Anterior Fiducial) */}
          <path
            d="M 152,24 L 160,12 L 168,24"
            fill="none"
            stroke="#475569"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* 2. CEREBELLAR POLES (Posterior fossa, visible beneath occipital lobes) */}
          <g opacity="0.85">
            {/* Left Cerebellar Lobe */}
            <path
              d="M 112,254 C 108,272 126,288 152,286 C 146,272 134,260 118,252 Z"
              fill="url(#cerebellumShade)"
              stroke="#1b2535"
              strokeWidth="1.2"
            />
            {/* Right Cerebellar Lobe */}
            <path
              d="M 208,254 C 212,272 194,288 168,286 C 174,272 186,260 202,252 Z"
              fill="url(#cerebellumShade)"
              stroke="#1b2535"
              strokeWidth="1.2"
            />
            {/* Cerebellar Transverse Micro-Folia (Fine parallel fissures) */}
            <path d="M 122,266 C 132,270 142,270 150,268" stroke="#334155" strokeWidth="0.8" fill="none" opacity="0.6" />
            <path d="M 126,274 C 134,277 144,276 148,275" stroke="#334155" strokeWidth="0.8" fill="none" opacity="0.6" />
            <path d="M 128,280 C 134,282 142,282 146,280" stroke="#334155" strokeWidth="0.8" fill="none" opacity="0.6" />
            <path d="M 198,266 C 188,270 178,270 170,268" stroke="#334155" strokeWidth="0.8" fill="none" opacity="0.6" />
            <path d="M 194,274 C 186,277 176,276 172,275" stroke="#334155" strokeWidth="0.8" fill="none" opacity="0.6" />
            <path d="M 192,280 C 186,282 178,282 174,280" stroke="#334155" strokeWidth="0.8" fill="none" opacity="0.6" />
          </g>

          {/* 3. LEFT CEREBRAL HEMISPHERE (Natural undulating biological cortex) */}
          <path
            d="M 157,44
               C 140,44 122,48 105,58
               C 92,66 84,76 74,88
               C 62,102 52,118 47,136
               C 42,154 44,174 48,192
               C 53,212 65,230 80,244
               C 96,258 114,268 134,273
               C 146,276 154,274 157,268
               C 158,255 158,235 157,215
               C 157,175 158,135 157,95
               C 157,65 158,52 157,44 Z"
            fill="url(#leftHemisphereCortex)"
            stroke="#3a4f6e"
            strokeWidth="2"
          />

          {/* 4. RIGHT CEREBRAL HEMISPHERE (Natural undulating biological cortex) */}
          <path
            d="M 163,44
               C 180,44 198,48 215,58
               C 228,66 236,76 246,88
               C 258,102 268,118 273,136
               C 278,154 276,174 272,192
               C 267,212 255,230 240,244
               C 224,258 206,268 186,273
               C 174,276 166,274 163,268
               C 162,255 162,235 163,215
               C 163,175 162,135 163,95
               C 163,65 162,52 163,44 Z"
            fill="url(#rightHemisphereCortex)"
            stroke="#3a4f6e"
            strokeWidth="2"
          />

          {/* 5. LONGITUDINAL CEREBRAL FISSURE (Interhemispheric Medial Cleft) */}
          {/* Deep Sulcal Crevice */}
          <path
            d="M 160,38 
               C 159,58 161,84 159,114 
               C 161,144 158,174 161,204 
               C 159,234 161,256 160,278"
            fill="none"
            stroke="#020408"
            strokeWidth="4.8"
            strokeLinecap="round"
          />
          {/* Vascular / Sulcal Edge Highlight */}
          <path
            d="M 160,38 
               C 159,58 161,84 159,114 
               C 161,144 158,174 161,204 
               C 159,234 161,256 160,278"
            fill="none"
            stroke="#1b283d"
            strokeWidth="1.6"
            strokeLinecap="round"
          />

          {/* 6. DETAILED ANATOMICAL GYRI & SULCI (Left Hemisphere - Real Cortical Folds) */}
          <g fill="none" strokeLinecap="round" strokeLinejoin="round">
            {/* Deep Sulcal Shadows (Background Crevices) */}
            <g stroke="#080e1a" strokeWidth="3" opacity="0.9">
              {/* Superior Frontal Sulcus */}
              <path d="M 154,64 C 138,67 120,74 110,88 C 102,100 106,112 112,120" />
              {/* Middle Frontal Sulcus */}
              <path d="M 98,72 C 82,82 68,98 62,118 C 58,132 64,142 72,148" />
              {/* Inferior Frontal Sulcus */}
              <path d="M 124,124 C 112,132 96,138 82,140" />
              {/* Precentral Sulcus (Motor Border) */}
              <path d="M 155,136 C 138,138 118,144 102,154 C 90,162 82,172 80,184" />
              {/* Central Sulcus of Rolando (Key Landmark) */}
              <path d="M 157,162 C 142,165 122,172 104,184 C 90,194 82,208 80,222" />
              {/* Postcentral Sulcus (Sensory Border) */}
              <path d="M 154,186 C 138,190 120,200 108,214 C 100,226 98,236 100,246" />
              {/* Intraparietal Sulcus */}
              <path d="M 155,210 C 140,214 126,226 116,240 C 110,250 114,258 120,264" />
              {/* Parieto-Occipital & Calcarine Branches */}
              <path d="M 152,246 C 140,252 128,260 122,268" />
              <path d="M 148,262 C 138,266 132,270 128,272" />
            </g>

            {/* Illuminated Gyral Crests (Surface Ridges of Grey Matter) */}
            <g stroke="#3a5174" strokeWidth="1.5" opacity="0.85">
              {/* Frontopolar Gyri */}
              <path d="M 150,56 C 136,58 124,64 116,74" />
              <path d="M 144,76 C 132,80 122,88 118,98" />
              <path d="M 104,84 C 92,94 84,106 82,118" />
              
              {/* Dorsolateral Prefrontal Convolutions */}
              <path d="M 136,102 C 122,108 112,118 104,128" />
              <path d="M 88,112 C 78,122 74,134 76,144" />
              <path d="M 130,126 C 118,134 104,140 92,142" />

              {/* Precentral Gyrus (Motor Strip Ridge) */}
              <path d="M 152,144 C 136,146 118,152 104,162 C 94,170 88,180 86,192" stroke="#4a6692" strokeWidth="1.8" />

              {/* Central Sulcus Highlight Line */}
              <path d="M 156,164 C 140,167 122,174 106,186 C 92,196 84,210 82,224" stroke="#253550" strokeWidth="2.2" />

              {/* Postcentral Gyrus (Somatosensory Ridge) */}
              <path d="M 150,178 C 136,182 120,192 108,206 C 98,218 94,228 96,238" stroke="#4a6692" strokeWidth="1.8" />

              {/* Parietal Lobule Convolutions */}
              <path d="M 148,202 C 134,206 122,216 114,228 C 108,238 108,246 112,252" />
              <path d="M 142,226 C 132,234 126,244 126,252" />

              {/* Occipital Pole Gyri */}
              <path d="M 148,242 C 138,248 128,256 124,264" />
              <path d="M 144,258 C 136,262 130,266 126,268" />
            </g>
          </g>

          {/* 7. DETAILED ANATOMICAL GYRI & SULCI (Right Hemisphere - Symmetrical Cortex) */}
          <g fill="none" strokeLinecap="round" strokeLinejoin="round">
            {/* Deep Sulcal Shadows */}
            <g stroke="#080e1a" strokeWidth="3" opacity="0.9">
              {/* Superior Frontal Sulcus */}
              <path d="M 166,64 C 182,67 200,74 210,88 C 218,100 214,112 208,120" />
              {/* Middle Frontal Sulcus */}
              <path d="M 222,72 C 238,82 252,98 258,118 C 262,132 256,142 248,148" />
              {/* Inferior Frontal Sulcus */}
              <path d="M 196,124 C 208,132 224,138 238,140" />
              {/* Precentral Sulcus */}
              <path d="M 165,136 C 182,138 202,144 218,154 C 230,162 238,172 240,184" />
              {/* Central Sulcus of Rolando */}
              <path d="M 163,162 C 178,165 198,172 216,184 C 230,194 238,208 240,222" />
              {/* Postcentral Sulcus */}
              <path d="M 166,186 C 182,190 200,200 212,214 C 220,226 222,236 220,246" />
              {/* Intraparietal Sulcus */}
              <path d="M 165,210 C 180,214 194,226 204,240 C 210,250 206,258 200,264" />
              {/* Parieto-Occipital & Calcarine Branches */}
              <path d="M 168,246 C 180,252 192,260 198,268" />
              <path d="M 172,262 C 182,266 188,270 192,272" />
            </g>

            {/* Illuminated Gyral Crests */}
            <g stroke="#3a5174" strokeWidth="1.5" opacity="0.85">
              {/* Frontopolar Gyri */}
              <path d="M 170,56 C 184,58 196,64 204,74" />
              <path d="M 176,76 C 188,80 198,88 202,98" />
              <path d="M 216,84 C 228,94 236,106 238,118" />

              {/* Dorsolateral Prefrontal Convolutions */}
              <path d="M 184,102 C 198,108 208,118 216,128" />
              <path d="M 232,112 C 242,122 246,134 244,144" />
              <path d="M 190,126 C 202,134 216,140 228,142" />

              {/* Precentral Gyrus (Motor Strip Ridge) */}
              <path d="M 168,144 C 184,146 202,152 216,162 C 226,170 232,180 234,192" stroke="#4a6692" strokeWidth="1.8" />

              {/* Central Sulcus Highlight Line */}
              <path d="M 164,164 C 180,167 198,174 214,186 C 228,196 236,210 238,224" stroke="#253550" strokeWidth="2.2" />

              {/* Postcentral Gyrus (Somatosensory Ridge) */}
              <path d="M 170,178 C 184,182 200,192 212,206 C 222,218 226,228 224,238" stroke="#4a6692" strokeWidth="1.8" />

              {/* Parietal Lobule Convolutions */}
              <path d="M 172,202 C 186,206 198,216 206,228 C 212,238 212,246 208,252" />
              <path d="M 178,226 C 188,234 194,244 194,252" />

              {/* Occipital Pole Gyri */}
              <path d="M 172,242 C 182,248 192,256 196,264" />
              <path d="M 176,258 C 184,262 190,266 194,268" />
            </g>
          </g>

          {/* 8. ANATOMICAL LOBE MARKERS & DIRECTIONAL AXIS */}
          <text x="160" y="32" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="monospace" fontWeight="bold">
            NASION (ANTERIOR)
          </text>
          <text x="160" y="312" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="monospace" fontWeight="bold">
            INION (POSTERIOR)
          </text>
          <text x="16" y="166" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="monospace" fontWeight="bold">
            L
          </text>
          <text x="304" y="166" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="monospace" fontWeight="bold">
            R
          </text>

          {/* Subtle Midline & Coronal Reference Dashed Axes */}
          <line x1="160" y1="36" x2="160" y2="295" stroke="#334155" strokeWidth="1" strokeDasharray="2,4" opacity="0.35" />
          <line x1="36" y1="166" x2="284" y2="166" stroke="#334155" strokeWidth="1" strokeDasharray="2,4" opacity="0.35" />

          {/* 9. INTERACTIVE 10-20 ELECTRODE SENSORS PLACED ON CORTICAL LOCATIONS */}
          {BRAIN_NODES.map((node) => {
            const isAvailable = availableChannels.includes(node.key);
            const isSelected = selectedLead === node.key;
            const isHovered = hoveredNode?.key === node.key;

            return (
              <g
                key={node.key}
                className={isAvailable ? "cursor-pointer group" : "cursor-not-allowed opacity-35"}
                onClick={() => isAvailable && onSelectLead(node.key)}
                onMouseEnter={() => isAvailable && setHoveredNode(node)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                {/* Active Pulsing Aura Beacon */}
                {isSelected && (
                  <>
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r="22"
                      fill={themeColor}
                      fillOpacity="0.18"
                      className="animate-ping origin-center"
                      style={{ transformOrigin: `${node.x}px ${node.y}px` }}
                    />
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r="16"
                      fill={themeColor}
                      fillOpacity="0.28"
                      stroke={themeGlow}
                      strokeWidth="1.8"
                    />
                  </>
                )}

                {/* Hover Aura */}
                {isHovered && !isSelected && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="15"
                    fill="#38bdf8"
                    fillOpacity="0.22"
                    stroke="#38bdf8"
                    strokeWidth="1.5"
                  />
                )}

                {/* Electrode Outer Medical Sensor Base */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={isSelected ? "11.5" : "9.5"}
                  fill={isSelected ? themeColor : isHovered ? "#1e293b" : "#0c1424"}
                  stroke={isSelected ? "#ffffff" : isHovered ? "#38bdf8" : "#475569"}
                  strokeWidth={isSelected ? "2.2" : "1.4"}
                  filter={isSelected ? "url(#electrodeGlow)" : undefined}
                />

                {/* Metallic Pin Accent for Inactive Nodes */}
                {!isSelected && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="2.8"
                    fill={isAvailable ? "#94a3b8" : "#475569"}
                    opacity={isHovered ? 0 : 0.7}
                  />
                )}

                {/* High-Contrast Electrode Lead Typography */}
                <text
                  x={node.x}
                  y={node.y + (isSelected ? 3.5 : 3)}
                  textAnchor="middle"
                  fill={isSelected ? "#02040a" : isHovered ? "#38bdf8" : "#f1f5f9"}
                  fontSize={isSelected ? "8.5" : "7.5"}
                  fontWeight="900"
                  fontFamily="monospace"
                  letterSpacing="-0.3px"
                >
                  {node.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Bottom Functional Lobe Description & Lead Status Bar */}
      <div className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200/90 text-slate-700 shadow-xs">
        <div className="flex items-center gap-2 min-w-0 pr-2">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span className="text-[11px] font-medium text-slate-600 truncate">
            {currentNode.functionalRole}
          </span>
        </div>
        <div
          className="font-mono text-xs font-bold shrink-0 flex items-center gap-1.5"
          style={{ color: themeColor }}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{selectedLead}</span>
        </div>
      </div>
    </div>
  );
}
