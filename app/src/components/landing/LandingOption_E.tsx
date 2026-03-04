"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Award, Code2, Trophy, Globe, MessageSquare, Quote } from "lucide-react";
import { StartLearningButton } from "@/components/landing/StartLearningButton";
import type { SanityCourse } from "@/lib/sanity/queries";
import { CourseCard, CourseCardData } from "@/components/courses/CourseCard";
import { motion, Variants } from "framer-motion";
import { useState, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════════
   ANIMATION VARIANTS
   ═══════════════════════════════════════════════════════════════ */

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 220, damping: 26 } },
};

const stagger: Variants = {
  hidden: { opacity: 1 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const sectionReveal: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

/* ═══════════════════════════════════════════════════════════════
   SOLANA ORB — THE VISUAL IDENTITY
   A crystalline hexagonal structure representing on-chain identity.
   Pure inline SVG + CSS keyframe animations.
   ═══════════════════════════════════════════════════════════════ */

function SolanaOrb({ size = 380 }: { size?: number }) {
  const cx = size / 2;
  const cy = size / 2;

  // Hexagon helper
  const hex = (centerX: number, centerY: number, r: number) => {
    const pts: string[] = [];
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i - Math.PI / 2;
      pts.push(`${centerX + r * Math.cos(angle)},${centerY + r * Math.sin(angle)}`);
    }
    return pts.join(" ");
  };

  // Badge data for middle ring
  const badges = [
    { icon: "\u2713", label: "Verified" },
    { icon: "\u26A1", label: "Power" },
    { icon: "\u2606", label: "Star" },
    { icon: "\u2764", label: "Award" },
    { icon: "</>", label: "Code" },
    { icon: "\u25C6", label: "Elite" },
  ];

  const middleRadius = size * 0.3;
  const outerRadius = size * 0.42;

  // Constellation dots
  const constellationDots = Array.from({ length: 24 }, (_, i) => {
    const angle = (Math.PI * 2 * i) / 24 + (i % 3) * 0.3;
    const r = size * 0.2 + (i % 5) * size * 0.06;
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    };
  });

  // Particle positions for outer ring
  const particles = Array.from({ length: 18 }, (_, i) => {
    const angle = (Math.PI * 2 * i) / 18;
    const r = outerRadius + (i % 3) * 8;
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
      delay: i * 0.35,
      color: i % 3 === 0 ? "#FFB800" : "#14F195",
      size: 1.5 + (i % 3) * 0.8,
    };
  });

  return (
    <div className="relative solana-orb" style={{ width: size, height: size }}>
      {/* CSS animations + light/dark theming via CSS custom properties */}
      <style>{`
        /* ── Light mode defaults (deeper, richer colors for cream bg) ── */
        .solana-orb {
          --orb-green: #0a8f5e;
          --orb-purple: #6822b8;
          --orb-gold: #b88600;
          --orb-constellation-min: 0.35;
          --orb-constellation-max: 0.7;
          --orb-constellation-line-w: 0.6;
          --orb-ring-breathe-min: 0.3;
          --orb-ring-breathe-max: 0.6;
          --orb-hex-breathe-min: 0.35;
          --orb-hex-breathe-max: 0.7;
          --orb-facet-fill-min: 0.18;
          --orb-facet-fill-max: 0.38;
          --orb-facet-stroke-opacity: 0.55;
          --orb-ring-stroke-w: 1;
          --orb-outer-ring-stroke-w: 0.6;
          --orb-hex-outer-stroke-w: 1;
          --orb-hex-outer2-stroke-w: 0.6;
          --orb-center-hex-stroke-opacity: 0.4;
          --orb-center-hex-fill-opacity: 0.08;
          --orb-ambient-min: 0.12;
          --orb-ambient-max: 0.25;
          --orb-arc-stroke-min: 0.35;
          --orb-arc-stroke-max: 0.65;
          --orb-arc-stroke-w: 1.5;
          --orb-badge-fill-opacity: 0.7;
          --orb-badge-stroke-opacity: 1;
          --orb-badge-stroke-w: 1.5;
          --orb-brazil-min: 0.5;
          --orb-brazil-max: 0.8;
          --orb-particle-gold: #b88600;
          --orb-particle-green: #0a8f5e;
        }
        /* ── Dark mode overrides (original neon values) ── */
        .dark .solana-orb {
          --orb-green: #14F195;
          --orb-purple: #9945FF;
          --orb-gold: #FFB800;
          --orb-constellation-min: 0.2;
          --orb-constellation-max: 0.55;
          --orb-constellation-line-w: 0.3;
          --orb-ring-breathe-min: 0.15;
          --orb-ring-breathe-max: 0.35;
          --orb-hex-breathe-min: 0.18;
          --orb-hex-breathe-max: 0.45;
          --orb-facet-fill-min: 0.08;
          --orb-facet-fill-max: 0.2;
          --orb-facet-stroke-opacity: 0.35;
          --orb-ring-stroke-w: 0.5;
          --orb-outer-ring-stroke-w: 0.3;
          --orb-hex-outer-stroke-w: 0.5;
          --orb-hex-outer2-stroke-w: 0.3;
          --orb-center-hex-stroke-opacity: 0.2;
          --orb-center-hex-fill-opacity: 0.04;
          --orb-ambient-min: 0.4;
          --orb-ambient-max: 0.6;
          --orb-arc-stroke-min: 0.18;
          --orb-arc-stroke-max: 0.45;
          --orb-arc-stroke-w: 1;
          --orb-badge-fill-opacity: 0.5;
          --orb-badge-stroke-opacity: 0.9;
          --orb-badge-stroke-w: 1.2;
          --orb-brazil-min: 0.3;
          --orb-brazil-max: 0.6;
          --orb-particle-gold: #FFB800;
          --orb-particle-green: #14F195;
        }

        @keyframes orb-rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes orb-counter-rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        @keyframes orb-pulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.08); }
        }
        @keyframes orb-core-pulse {
          0%, 100% { r: ${size * 0.06}px; opacity: 0.9; }
          50% { r: ${size * 0.075}px; opacity: 1; }
        }
        @keyframes orb-core-glow {
          0%, 100% { stdDeviation: 12; }
          50% { stdDeviation: 20; }
        }
        @keyframes particle-float {
          0% { transform: translateY(0px); opacity: 0; }
          15% { opacity: 1; }
          85% { opacity: 1; }
          100% { transform: translateY(-${size * 0.18}px); opacity: 0; }
        }
        @keyframes badge-glow {
          0%, 100% { filter: drop-shadow(0 0 2px rgba(153,69,255,0.3)); }
          50% { filter: drop-shadow(0 0 6px rgba(153,69,255,0.6)); }
        }
        @keyframes constellation-twinkle {
          0%, 100% { opacity: var(--orb-constellation-min); }
          50% { opacity: var(--orb-constellation-max); }
        }
        @keyframes ring-breathe {
          0%, 100% { stroke-opacity: var(--orb-ring-breathe-min); }
          50% { stroke-opacity: var(--orb-ring-breathe-max); }
        }
        @keyframes hex-outer-breathe {
          0%, 100% { stroke-opacity: var(--orb-hex-breathe-min); stroke-dashoffset: 0; }
          50% { stroke-opacity: var(--orb-hex-breathe-max); stroke-dashoffset: 20; }
        }
        .orb-middle-ring {
          animation: orb-rotate 60s linear infinite;
          transform-origin: ${cx}px ${cy}px;
        }
        .orb-outer-particles {
          animation: orb-counter-rotate 90s linear infinite;
          transform-origin: ${cx}px ${cy}px;
        }
        .orb-constellation {
          animation: orb-rotate 120s linear infinite;
          transform-origin: ${cx}px ${cy}px;
        }
      `}</style>

      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: "visible" }}
      >
        <defs>
          {/* Core glow filter */}
          <filter id="orb-glow-core" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="16" result="blur1">
              <animate
                attributeName="stdDeviation"
                values="12;20;12"
                dur="4s"
                repeatCount="indefinite"
              />
            </feGaussianBlur>
            <feColorMatrix
              in="blur1"
              type="matrix"
              values="0 0 0 0 0.08  0 0 0 0 0.95  0 0 0 0 0.58  0 0 0 0.8 0"
            />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Wider ambient glow */}
          <filter id="orb-glow-ambient" x="-150%" y="-150%" width="400%" height="400%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="35" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.08  0 0 0 0 0.95  0 0 0 0 0.58  0 0 0 0.3 0"
            />
          </filter>

          {/* Badge glow */}
          <filter id="orb-glow-badge" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="0 0 0 0 0.6  0 0 0 0 0.27  0 0 0 0 1  0 0 0 0.5 0"
            />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Particle glow */}
          <filter id="orb-glow-particle" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" />
          </filter>

          {/* Ring gradient */}
          <radialGradient id="orb-ring-gradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#14F195" stopOpacity="0.05" />
            <stop offset="70%" stopColor="#9945FF" stopOpacity="0.03" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>

          {/* Hex fill gradient */}
          <linearGradient id="orb-hex-fill" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#14F195" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#9945FF" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {/* ── Background ambient glow ── */}
        <circle cx={cx} cy={cy} r={size * 0.25} style={{ fill: "var(--orb-green)" }} filter="url(#orb-glow-ambient)" opacity="0.5">
          <animate attributeName="opacity" values="0.4;0.6;0.4" dur="5s" repeatCount="indefinite" />
        </circle>

        {/* ── Constellation layer ── */}
        <g className="orb-constellation">
          {constellationDots.map((dot, i) => (
            <circle
              key={`const-${i}`}
              cx={dot.x}
              cy={dot.y}
              r={1.2}
              style={{
                fill: "var(--orb-green)",
                animation: `constellation-twinkle ${3 + (i % 4)}s ease-in-out ${i * 0.4}s infinite`,
              }}
            />
          ))}
          {/* Constellation connecting lines */}
          {constellationDots.slice(0, 20).map((dot, i) => {
            const next = constellationDots[(i + 3) % constellationDots.length]!;
            return (
              <line
                key={`line-${i}`}
                x1={dot.x}
                y1={dot.y}
                x2={next.x}
                y2={next.y}
                style={{
                  stroke: "var(--orb-green)",
                  strokeWidth: "var(--orb-constellation-line-w)",
                  animation: `constellation-twinkle ${4 + (i % 3)}s ease-in-out ${i * 0.5}s infinite`,
                }}
              />
            );
          })}
        </g>

        {/* ── Outer decorative hex ring ── */}
        <polygon
          points={hex(cx, cy, size * 0.44)}
          fill="none"
          strokeDasharray="8 12"
          style={{ stroke: "var(--orb-green)", strokeWidth: "var(--orb-hex-outer-stroke-w)", animation: "hex-outer-breathe 8s ease-in-out infinite" }}
        />
        <polygon
          points={hex(cx, cy, size * 0.41)}
          fill="none"
          strokeDasharray="4 16"
          style={{ stroke: "var(--orb-purple)", strokeWidth: "var(--orb-hex-outer2-stroke-w)", animation: "hex-outer-breathe 10s ease-in-out 2s infinite" }}
        />

        {/* ── Ring circles ── */}
        <circle
          cx={cx}
          cy={cy}
          r={middleRadius}
          fill="none"
          style={{ stroke: "var(--orb-green)", strokeWidth: "var(--orb-ring-stroke-w)", animation: "ring-breathe 6s ease-in-out infinite" }}
        />
        <circle
          cx={cx}
          cy={cy}
          r={outerRadius}
          fill="none"
          style={{ stroke: "var(--orb-purple)", strokeWidth: "var(--orb-outer-ring-stroke-w)", animation: "ring-breathe 8s ease-in-out 1s infinite" }}
        />

        {/* ── Center fill ── */}
        <polygon
          points={hex(cx, cy, size * 0.14)}
          fill="url(#orb-hex-fill)"
          strokeWidth="0.8"
          style={{ stroke: "var(--orb-green)", strokeOpacity: "var(--orb-center-hex-stroke-opacity)" as any }}
        />

        {/* ── Core pulsing center ── */}
        <circle cx={cx} cy={cy} r={size * 0.06} style={{ fill: "var(--orb-green)" }} filter="url(#orb-glow-core)">
          <animate
            attributeName="r"
            values={`${size * 0.055};${size * 0.07};${size * 0.055}`}
            dur="4s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx={cx} cy={cy} r={size * 0.03} style={{ fill: "var(--orb-green)" }} opacity="0.9">
          <animate attributeName="opacity" values="0.7;1.0;0.7" dur="4s" repeatCount="indefinite" />
        </circle>

        {/* ── Inner hexagonal facets ── */}
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const angle = (Math.PI / 3) * i - Math.PI / 2;
          const innerR = size * 0.12;
          const tipX = cx + innerR * Math.cos(angle);
          const tipY = cy + innerR * Math.sin(angle);
          const leftAngle = angle - 0.3;
          const rightAngle = angle + 0.3;
          const baseR = size * 0.04;
          return (
            <polygon
              key={`facet-${i}`}
              points={`${tipX},${tipY} ${cx + baseR * Math.cos(leftAngle)},${cy + baseR * Math.sin(leftAngle)} ${cx + baseR * Math.cos(rightAngle)},${cy + baseR * Math.sin(rightAngle)}`}
              fillOpacity="0.12"
              strokeWidth="0.8"
              style={{ fill: "var(--orb-green)", stroke: "var(--orb-green)", strokeOpacity: "var(--orb-facet-stroke-opacity)" as any }}
            >
              <animate
                attributeName="fill-opacity"
                values="0.08;0.2;0.08"
                dur={`${3 + i * 0.5}s`}
                repeatCount="indefinite"
              />
            </polygon>
          );
        })}

        {/* ── Middle ring: orbiting badge hexagons ── */}
        <g className="orb-middle-ring">
          {badges.map((badge, i) => {
            const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2;
            const bx = cx + middleRadius * Math.cos(angle);
            const by = cy + middleRadius * Math.sin(angle);
            const badgeSize = size * 0.04;
            return (
              <g key={`badge-${i}`} filter="url(#orb-glow-badge)" style={{ animation: `badge-glow ${3 + i * 0.3}s ease-in-out ${i * 0.5}s infinite` }}>
                <polygon
                  points={hex(bx, by, badgeSize)}
                  style={{
                    fill: i % 2 === 0 ? "var(--orb-purple)" : "var(--orb-gold)",
                    fillOpacity: "var(--orb-badge-fill-opacity)" as any,
                    stroke: i % 2 === 0 ? "var(--orb-purple)" : "var(--orb-gold)",
                    strokeWidth: "var(--orb-badge-stroke-w)",
                    strokeOpacity: "var(--orb-badge-stroke-opacity)" as any,
                  }}
                />
                <text
                  x={bx}
                  y={by}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="currentColor"
                  fontSize={size * 0.025}
                  fontFamily="var(--font-mono)"
                  opacity="0.9"
                >
                  {badge.icon}
                </text>
              </g>
            );
          })}
        </g>

        {/* ── Outer ring: floating XP particles ── */}
        <g className="orb-outer-particles">
          {particles.map((p, i) => (
            <g key={`particle-${i}`}>
              <circle
                cx={p.x}
                cy={p.y}
                r={p.size}
                filter="url(#orb-glow-particle)"
                style={{
                  fill: i % 3 === 0 ? "var(--orb-particle-gold)" : "var(--orb-particle-green)",
                  animation: `particle-float ${4 + (i % 3)}s ease-in-out ${p.delay}s infinite`,
                }}
              />
            </g>
          ))}
        </g>


        {/* ── Brazilian flag color orbit ── */}
        <g style={{ animation: "orb-rotate 240s linear infinite", transformOrigin: `${cx}px ${cy}px` }}>
          {[
            { color: "#009C3B", angle: 0 },
            { color: "#FFDF00", angle: (Math.PI * 2) / 3 },
            { color: "#002776", angle: (Math.PI * 2 * 2) / 3 },
          ].map((dot, i) => {
            const br = size * 0.48;
            const dx = cx + br * Math.cos(dot.angle);
            const dy = cy + br * Math.sin(dot.angle);
            return (
              <circle
                key={`brazil-dot-${i}`}
                cx={dx}
                cy={dy}
                r={3.5}
                fill={dot.color}
                opacity="0.6"
              >
                <animate attributeName="opacity" values="0.4;0.8;0.4" dur="4s" repeatCount="indefinite" />
              </circle>
            );
          })}
        </g>

        {/* ── Decorative data arcs ── */}
        {[0, 1, 2].map((i) => {
          const startAngle = (Math.PI * 2 * i) / 3 + 0.2;
          const endAngle = startAngle + 0.8;
          const r = size * 0.36;
          const x1 = cx + r * Math.cos(startAngle);
          const y1 = cy + r * Math.sin(startAngle);
          const x2 = cx + r * Math.cos(endAngle);
          const y2 = cy + r * Math.sin(endAngle);
          return (
            <path
              key={`arc-${i}`}
              d={`M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}`}
              fill="none"
              strokeDasharray="2 6"
              style={{ stroke: "var(--orb-green)", strokeWidth: "var(--orb-arc-stroke-w)" }}
              strokeOpacity="0.28"
            >
              <animate
                attributeName="stroke-opacity"
                values="0.18;0.55;0.18"
                dur={`${5 + i}s`}
                repeatCount="indefinite"
              />
            </path>
          );
        })}
      </svg>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   BRAZIL MAP — CULTURAL IDENTITY SVG
   Simplified outline of Brazil with glowing city dots.
   ═══════════════════════════════════════════════════════════════ */

const BRAZIL_CITIES = [
  { name: "São Paulo", x: 225, y: 268, size: 5 },
  { name: "Rio de Janeiro", x: 255, y: 252, size: 4 },
  { name: "Brasília", x: 205, y: 185, size: 4 },
  { name: "Fortaleza", x: 280, y: 82, size: 4 },
  { name: "Recife", x: 295, y: 115, size: 3.5 },
  { name: "Porto Alegre", x: 200, y: 310, size: 3.5 },
  { name: "Salvador", x: 268, y: 175, size: 4 },
  { name: "Belo Horizonte", x: 240, y: 230, size: 3.5 },
  { name: "Manaus", x: 115, y: 75, size: 3.5 },
];

/* More accurate Brazil outline — all cities sit well within boundaries */
const BRAZIL_OUTLINE = "M 130,18 L 165,12 L 205,10 L 245,12 L 275,20 L 298,35 L 315,55 L 322,75 L 318,95 L 322,115 L 315,140 L 305,165 L 292,190 L 282,215 L 275,238 L 268,258 L 255,278 L 238,298 L 218,318 L 200,332 L 182,330 L 164,312 L 145,290 L 125,265 L 108,240 L 92,215 L 78,188 L 68,160 L 60,130 L 58,100 L 65,75 L 78,52 L 98,35 L 115,25 Z";

function BrazilMap() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg
        viewBox="0 0 380 350"
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ maxWidth: "360px" }}
      >
        <defs>
          <radialGradient id="brazil-fill-grad" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#14F195" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#14F195" stopOpacity="0.03" />
          </radialGradient>
          <filter id="city-glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer glow outline */}
        <path
          d={BRAZIL_OUTLINE}
          fill="none"
          stroke="#14F195"
          strokeWidth="3"
          strokeOpacity="0.08"
        />

        {/* Main Brazil outline */}
        <path
          d={BRAZIL_OUTLINE}
          fill="url(#brazil-fill-grad)"
          stroke="#14F195"
          strokeWidth="1.2"
          strokeOpacity="0.6"
          strokeLinejoin="round"
        />

        {/* Inner outline for depth */}
        <path
          d={BRAZIL_OUTLINE}
          fill="none"
          stroke="#14F195"
          strokeWidth="0.5"
          strokeOpacity="0.15"
          strokeDasharray="4 6"
          transform="translate(3, 3) scale(0.97)"
        />

        {/* City dots */}
        {BRAZIL_CITIES.map((city, i) => (
          <g key={city.name}>
            {/* Pulse ring */}
            <circle
              cx={city.x}
              cy={city.y}
              r={city.size}
              fill="none"
              stroke="#14F195"
              strokeWidth="1"
              opacity="0"
            >
              <animate attributeName="r" values={`${city.size};${city.size + 12}`} dur={`${3 + i * 0.4}s`} repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.6;0" dur={`${3 + i * 0.4}s`} repeatCount="indefinite" />
            </circle>
            {/* Dot */}
            <circle cx={city.x} cy={city.y} r={city.size} fill="#14F195" opacity="0.9" />
            {/* Label */}
            <text
              x={city.x}
              y={city.y - city.size - 6}
              textAnchor="middle"
              className="fill-foreground/60"
              fontSize="8"
              fontFamily="var(--font-mono)"
              letterSpacing="0.03em"
            >
              {city.name}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   LEADERBOARD DATA
   ═══════════════════════════════════════════════════════════════ */

const BUILDERS = [
  { wallet: "7fXk...9mRq", level: 12, xp: 4850, cred: "Anchor Dev", progress: 72, city: "São Paulo" },
  { wallet: "B3nN...4pLw", level: 18, xp: 9200, cred: "DeFi Builder", progress: 45, city: "Rio de Janeiro" },
  { wallet: "Qr2T...8sVx", level: 9, xp: 2300, cred: "Token Master", progress: 88, city: "Belo Horizonte" },
  { wallet: "mK9J...3zPq", level: 15, xp: 6700, cred: "Protocol Dev", progress: 31, city: "Fortaleza" },
  { wallet: "5wLc...7nBr", level: 21, xp: 12400, cred: "Core Dev", progress: 56, city: "Brasília" },
  { wallet: "xHd8...2kFm", level: 7, xp: 1450, cred: "NFT Creator", progress: 93, city: "Recife" },
  { wallet: "Pn6Y...1vQs", level: 11, xp: 3900, cred: "DeFi Builder", progress: 67, city: "Porto Alegre" },
  { wallet: "9cRj...5tWe", level: 14, xp: 5800, cred: "Anchor Dev", progress: 22, city: "Salvador" },
];

/* ═══════════════════════════════════════════════════════════════
   SKILL TREE DATA
   ═══════════════════════════════════════════════════════════════ */

const SKILL_PATHS = [
  {
    title: "Solana Fundamentals",
    nodes: [
      { label: "Hello Solana", state: "completed" as const, y: 80 },
      { label: "Accounts", state: "completed" as const, y: 160 },
      { label: "PDAs", state: "available" as const, y: 240 },
    ],
  },
  {
    title: "Anchor Framework",
    nodes: [
      { label: "Setup", state: "locked" as const, y: 100 },
      { label: "Programs", state: "locked" as const, y: 180 },
      { label: "CPIs", state: "locked" as const, y: 260 },
    ],
  },
  {
    title: "DeFi Development",
    nodes: [
      { label: "Token-2022", state: "locked" as const, y: 90 },
      { label: "AMMs", state: "locked" as const, y: 170 },
      { label: "Lending", state: "locked" as const, y: 250 },
      { label: "Yield", state: "locked" as const, y: 300 },
    ],
  },
  {
    title: "Advanced Protocol",
    nodes: [
      { label: "Oracles", state: "locked" as const, y: 80 },
      { label: "Governance", state: "locked" as const, y: 160 },
      { label: "MEV", state: "locked" as const, y: 240 },
    ],
  },
];

/* ═══════════════════════════════════════════════════════════════
   MAIN LANDING COMPONENT
   ═══════════════════════════════════════════════════════════════ */

export function LandingContent({ featuredCourses }: { featuredCourses: SanityCourse[] }) {
  const t = useTranslations("landing");
  const tPaths = useTranslations("learningPaths");
  const [liveCount] = useState(27);
  const [editorCode, setEditorCode] = useState(
    `pub fn greet() -> String {\n    // your code here\n}`
  );
  const [runState, setRunState] = useState<"ready" | "running" | "passed">("ready");

  const handleRun = useCallback(() => {
    if (runState !== "ready") return;
    setRunState("running");
    setTimeout(() => setRunState("passed"), 1500);
    setTimeout(() => setRunState("ready"), 5000);
  }, [runState]);

  return (
    <div className="flex flex-col bg-background">

      {/* Global keyframes */}
      <style>{`
        @keyframes ticker-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-33.333%); }
        }
        @keyframes marquee-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.15); opacity: 0.2; }
          100% { transform: scale(1); opacity: 0.6; }
        }
        @keyframes confetti-fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(40px) rotate(360deg); opacity: 0; }
        }
        @keyframes path-flow {
          from { stroke-dashoffset: 16; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes editor-flash {
          0% { box-shadow: 0 0 0 transparent; }
          50% { box-shadow: 0 0 40px color-mix(in srgb, var(--sol-green-hex) 15%, transparent); }
          100% { box-shadow: 0 0 0 transparent; }
        }
      `}</style>

      {/* ═══════════════════════════════════════
          HERO — BUILD YOUR ON-CHAIN IDENTITY
      ═══════════════════════════════════════ */}
      <section
        className="relative overflow-hidden"
        style={{ minHeight: "min(calc(100vh - 64px), 900px)" }}
      >
        {/* Ambient background glow */}
        <div
          className="absolute pointer-events-none hidden sm:block"
          style={{
            top: "5%",
            right: "2%",
            width: "600px",
            height: "600px",
            background: "radial-gradient(circle, color-mix(in srgb, var(--sol-green-hex) 8%, transparent) 0%, rgba(153,69,255,0.04) 45%, transparent 70%)",
          }}
        />
        {/* Subtle grid texture */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(hsl(var(--foreground) / 0.03) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground) / 0.03) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage: "radial-gradient(ellipse 80% 60% at 50% 40%, black 30%, transparent 80%)",
          }}
        />

        <div className="relative mx-auto flex flex-col justify-center w-full max-w-7xl px-4 sm:px-6 pt-12 sm:pt-20 pb-12 sm:pb-16" style={{ minHeight: "min(calc(100vh - 64px), 900px)" }}>
          <div className="grid items-center gap-6 lg:grid-cols-[50%_50%]">

            {/* ── Left: text ── */}
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="show"
              className="space-y-6"
            >
              {/* Badge row — unified pill style */}
              <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-2.5">
                {/* Powered by Solana pill */}
                <div
                  className="group relative inline-flex items-center gap-2 rounded-full px-3.5 py-1.5"
                  style={{
                    background: "hsl(var(--muted))",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    fontFamily: "var(--font-mono)",
                    border: "1px solid hsl(var(--border))",
                  }}
                >
                  <span
                    className="solana-badge-border absolute inset-0 rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300"
                  />
                  <svg width="14" height="14" viewBox="0 0 128 128" aria-hidden="true">
                    <defs>
                      <linearGradient id="sol-grad-hero" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#9945FF" />
                        <stop offset="50%" stopColor="#00D18C" />
                        <stop offset="100%" stopColor="#14F195" />
                      </linearGradient>
                    </defs>
                    <rect x="10" y="20" width="108" height="16" rx="4" fill="url(#sol-grad-hero)" />
                    <rect x="10" y="56" width="108" height="16" rx="4" fill="url(#sol-grad-hero)" />
                    <rect x="10" y="92" width="108" height="16" rx="4" fill="url(#sol-grad-hero)" />
                  </svg>
                  <span style={{ fontSize: "10px", letterSpacing: "0.08em", color: "hsl(var(--foreground) / 0.5)", fontWeight: 500 }}>
                    Powered by{" "}
                    <span
                      style={{
                        fontWeight: 700,
                        background: "linear-gradient(90deg, #9945FF, #14F195)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      SOLANA
                    </span>
                  </span>
                </div>

                {/* Superteam Brasil pill — matching style */}
                <div
                  className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5"
                  style={{
                    background: "hsl(var(--muted))",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    border: "1px solid hsl(var(--border))",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                    <svg width="16" height="12" viewBox="0 0 42 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ flexShrink: 0 }}>
                    <path
                      d="M32.6944 4.90892H41.4468V8.28973C41.4468 12.8741 37.742 16.5795 33.1571 16.5795H32.6938L32.6944 4.90892ZM20.2372 0H32.6944V31.9071H31.2127C22.1822 31.9071 20.3765 25.6088 20.3765 20.0055L20.2372 0ZM0 7.22433C0 12.9205 4.07522 15.0043 8.61369 15.6993H0V32H8.28973C16.6252 32 17.5978 28.2952 17.5978 24.7757C17.5978 20.4688 14.6338 17.459 10.0495 16.3007H17.5978V0H9.30807C0.972554 0 0 3.70477 0 7.22433Z"
                      fill="#FFDF00"
                    />
                    <circle cx="37" cy="27" r="4.5" fill="#009C3B" stroke="rgba(0,0,0,0.3)" strokeWidth="0.8" />
                    <polygon points="37,24 39.5,27 37,30 34.5,27" fill="#FFDF00" />
                    <circle cx="37" cy="27" r="1.3" fill="#002776" />
                  </svg>
                  <span className="dark:text-[#FFDF00] text-[#9a7400]" style={{ fontSize: "10px", letterSpacing: "0.08em", fontWeight: 600 }}>
                    Superteam Brasil
                  </span>
                  <span style={{ fontSize: "10px", color: "hsl(var(--foreground) / 0.3)" }}>×</span>
                  <span style={{ fontSize: "10px", letterSpacing: "0.06em", color: "hsl(var(--foreground) / 0.45)" }}>
                    Academy
                  </span>
                </div>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                className="leading-[1.05] tracking-[-0.02em]"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "clamp(2.2rem, 4.5vw, 4rem)",
                  fontWeight: 900,
                }}
              >
                <span className="block text-foreground">{t("optionE.heroBuildYour")}</span>
                <span className="block">
                  <span style={{ color: "var(--sol-green-hex)" }}>{t("optionE.heroOnChain")}</span>
                  {" "}
                  <span className="text-foreground">{t("optionE.heroIdentity")}</span>
                </span>
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="max-w-md text-base leading-relaxed text-foreground/62"
              >
                {t("optionE.heroSubtitle")}
              </motion.p>

              <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-3">
                <StartLearningButton />
                <Link href="/courses">
                  <Button
                    variant="ghost"
                    size="lg"
                    className="gap-2 rounded-sm text-sm text-foreground/58 hover:text-foreground/80 hover:border-foreground/20 transition-all duration-200"
                    style={{
                      fontFamily: "var(--font-mono)",
                      border: "1px solid hsl(var(--border))",
                      background: "transparent",
                    }}
                  >
                    {t("optionE.exploreCourses")}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </motion.div>

              {/* Live ticker */}
              <motion.div
                variants={fadeUp}
                className="inline-flex items-center gap-2"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                <span className="relative flex h-2 w-2">
                  <span
                    className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
                    style={{ background: "#14F195" }}
                  />
                  <span
                    className="relative inline-flex h-2 w-2 rounded-full"
                    style={{ background: "#14F195" }}
                  />
                </span>
                <span className="text-xs text-foreground/52" style={{ fontFamily: "var(--font-mono)" }}>
                  <span style={{ color: "var(--sol-green-hex)", fontWeight: 600 }}>{liveCount}</span> {t("optionE.buildersActive")}
                </span>
              </motion.div>

              {/* Aggregate stats */}
              <motion.div
                variants={fadeUp}
                className="flex flex-wrap items-center gap-6 pt-2"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {[
                  { value: t("optionE.statsCoursesValue"), label: t("optionE.statsCoursesAvailable") },
                  { value: t("optionE.statsCredentialsValue"), label: t("optionE.statsCredentialsIssued") },
                  { value: t("optionE.statsLearnersValue"), label: t("optionE.statsActiveLearners") },
                ].map((stat) => (
                  <div key={stat.label} className="flex flex-col">
                    <span className="text-xl font-bold" style={{ color: "#C9903A" }}>{stat.value}</span>
                    <span className="text-[10px] uppercase tracking-[0.1em] text-foreground/42">{stat.label}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* ── Right: SolanaOrb ── */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="hidden lg:flex items-center justify-center relative"
              style={{ height: 320 }}
            >
              <SolanaOrb size={320} />
            </motion.div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          PLATFORM FEATURES
      ═══════════════════════════════════════ */}
      <motion.section
        variants={sectionReveal}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="py-12 sm:py-20 bg-card border-t border-border/20"
      >
        <div className="mx-auto max-w-6xl px-4 text-foreground">
          <div className="mb-12">
            <p className="font-mono text-xs uppercase tracking-[0.15em] mb-3" style={{ color: "var(--sol-green-hex)" }}>
              {t("optionE.featuresLabel")}
            </p>
            <h2 className="text-3xl font-bold sm:text-4xl" style={{ fontFamily: "var(--font-mono)" }}>
              {t("optionE.featuresTitle")}{" "}
              <span style={{ color: "var(--sol-green-hex)" }}>{t("optionE.featuresTitleAccent")}</span>
            </h2>
          </div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {[
              { icon: Shield, title: t("optionE.featureSoulboundXpTitle"), desc: t("optionE.featureSoulboundXpDesc"), accent: "#14F195" },
              { icon: Award, title: t("optionE.featureNftCredentialsTitle"), desc: t("optionE.featureNftCredentialsDesc"), accent: "#9945FF" },
              { icon: Code2, title: t("optionE.featureCodeEditorTitle"), desc: t("optionE.featureCodeEditorDesc"), accent: "#14F195" },
              { icon: Trophy, title: t("optionE.featureGamificationTitle"), desc: t("optionE.featureGamificationDesc"), accent: "#C9903A" },
              { icon: Globe, title: t("optionE.featureMultiLanguageTitle"), desc: t("optionE.featureMultiLanguageDesc"), accent: "#9945FF" },
              { icon: MessageSquare, title: t("optionE.featureCommunityTitle"), desc: t("optionE.featureCommunityDesc"), accent: "#14F195" },
            ].map((feature) => (
              <motion.div
                key={feature.title}
                variants={fadeUp}
                className="p-6 space-y-4 transition-colors"
                style={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderTopWidth: "2px",
                  borderTopColor: feature.accent,
                }}
              >
                <feature.icon className="h-6 w-6" style={{ color: feature.accent }} />
                <h3 className="text-sm font-bold uppercase tracking-wide text-foreground" style={{ fontFamily: "var(--font-mono)" }}>
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-foreground/55">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* ═══════════════════════════════════════
          SECTION 2: TRY IT NOW
      ═══════════════════════════════════════ */}
      <motion.section
        variants={sectionReveal}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="py-12 sm:py-20 bg-card border-t border-border/20"
      >
        <div className="mx-auto max-w-6xl px-4 text-foreground">
          <div className="mb-10">
            <p className="font-mono text-xs uppercase tracking-[0.15em] mb-3" style={{ color: "var(--sol-green-hex)" }}>{t("optionE.challengeLabel")}</p>
            <h2
              className="text-3xl font-bold sm:text-4xl"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {t("optionE.writeCode")} <span style={{ color: "var(--sol-green-hex)" }}>{t("optionE.getXp")}</span>
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Left: challenge info */}
            <div
              className="p-6 space-y-5"
              style={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
              }}
            >
              <div className="flex items-center gap-3">
                <span
                  className="px-2 py-0.5 text-[10px] font-bold uppercase"
                  style={{
                    fontFamily: "var(--font-mono)",
                    background: "color-mix(in srgb, var(--sol-green-hex) 12%, transparent)",
                    color: "var(--sol-green-hex)",
                    border: "1px solid color-mix(in srgb, var(--sol-green-hex) 25%, transparent)",
                  }}
                >
                  Challenge #1
                </span>
              </div>

              <h3
                className="text-xl font-bold text-foreground"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {t("optionE.challengeTitle")}
              </h3>

              <p className="text-sm leading-relaxed text-foreground/57">
                {t("optionE.challengeDesc")}
              </p>

              <div
                className="p-3 text-foreground/70"
                style={{
                  background: "color-mix(in srgb, var(--sol-green-hex) 6%, transparent)",
                  border: "1px solid color-mix(in srgb, var(--sol-green-hex) 15%, transparent)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "12px",
                }}
              >
                {t("optionE.functionSignature")} <span style={{ color: "var(--sol-green-hex)" }}>pub fn greet() -&gt; String</span>
              </div>

              <div className="flex items-center gap-4 text-foreground/52" style={{ fontFamily: "var(--font-mono)", fontSize: "11px" }}>
                <span style={{ color: "#C9903A" }}>+50 XP</span>
                <span className="text-foreground/30">|</span>
                <span>{t("optionE.beginner")}</span>
                <span className="text-foreground/30">|</span>
                <span>{t("optionE.duration")}</span>
              </div>
            </div>

            {/* Right: code editor */}
            <div
              className="flex flex-col transition-all duration-500"
              style={{
                background: "hsl(var(--card))",
                border: runState === "passed" ? "1px solid color-mix(in srgb, var(--sol-green-hex) 30%, transparent)" : "1px solid hsl(var(--border))",
              }}
            >
              {/* Editor title bar */}
              <div
                className="flex items-center justify-between px-4 py-2.5"
                style={{
                  background: "hsl(var(--card))",
                  borderBottom: "1px solid hsl(var(--border) / 0.4)",
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full" style={{ background: "#FF5F57" }} />
                    <div className="h-2.5 w-2.5 rounded-full" style={{ background: "#FEBC2E" }} />
                    <div className="h-2.5 w-2.5 rounded-full" style={{ background: "#28C840" }} />
                  </div>
                </div>
                {/* Tab bar */}
                <div className="flex items-center">
                  <div
                    className="px-3 py-1 text-foreground/70"
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "10px",
                      background: "hsl(var(--card))",
                      borderBottom: "1px solid #14F195",
                    }}
                  >
                    main.rs
                  </div>
                  <div
                    className="px-3 py-1 text-foreground/55"
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "10px",
                    }}
                  >
                    test.rs
                  </div>
                </div>
              </div>

              {/* Text area */}
              <div className="flex-1 p-4" style={{ background: "hsl(var(--card))" }}>
                <textarea
                  value={editorCode}
                  onChange={(e) => setEditorCode(e.target.value)}
                  spellCheck={false}
                  className="w-full h-32 resize-none outline-none"
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "13px",
                    lineHeight: "1.7",
                    background: "transparent",
                    color: "var(--sol-green-hex)",
                    caretColor: "var(--sol-green-hex)",
                    border: "none",
                  }}
                />
              </div>

              {/* Run bar */}
              <div
                className="flex items-center justify-between px-4 py-3"
                style={{
                  background: "hsl(var(--card))",
                  borderTop: "1px solid hsl(var(--border) / 0.4)",
                }}
              >
                <button
                  onClick={handleRun}
                  className="flex items-center gap-2 px-4 py-1.5 text-sm font-bold transition-all"
                  style={{
                    fontFamily: "var(--font-mono)",
                    background: runState === "passed" ? "color-mix(in srgb, var(--sol-green-hex) 18%, transparent)" : "var(--sol-green-hex)",
                    color: runState === "passed" ? "var(--sol-green-hex)" : "#000",
                    border: runState === "passed" ? "1px solid color-mix(in srgb, var(--sol-green-hex) 35%, transparent)" : "none",
                    cursor: runState === "ready" ? "pointer" : "default",
                  }}
                >
                  {runState === "ready" && t("optionE.run")}
                  {runState === "running" && (
                    <>
                      <span
                        className="inline-block h-3 w-3 rounded-full border-2 border-t-transparent animate-spin"
                        style={{ borderColor: "#000", borderTopColor: "transparent" }}
                      />
                      {t("optionE.running")}
                    </>
                  )}
                  {runState === "passed" && t("optionE.passed")}
                </button>

                {runState === "passed" && (
                  <div className="flex gap-1">
                    {["#14F195", "#FFB800", "#9945FF", "#14F195", "#FFB800"].map((c, i) => (
                      <span
                        key={i}
                        className="inline-block h-1.5 w-1.5 rounded-full"
                        style={{
                          background: c,
                          animation: `confetti-fall 1s ease-out ${i * 0.1}s forwards`,
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <Link
              href="/courses"
              className="text-sm transition-colors hover:text-foreground text-foreground/62"
              style={{
                fontFamily: "var(--font-mono)",
              }}
            >
              {t("optionE.allLevels")} <ArrowRight className="inline h-3 w-3 ml-1" />
            </Link>
          </div>
        </div>
      </motion.section>

      {/* ═══════════════════════════════════════
          SECTION 3: LIVE LEADERBOARD
      ═══════════════════════════════════════ */}
      <motion.section
        variants={sectionReveal}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="py-12 sm:py-20 overflow-hidden border-t border-border/20 bg-background"
      >
        <div className="mx-auto max-w-7xl px-4 mb-8 text-foreground">
          <p className="font-mono text-xs uppercase tracking-[0.15em] mb-3" style={{ color: "var(--sol-green-hex)" }}>{t("optionE.leaderboardLabel")}</p>
          <h2
            className="text-3xl font-bold sm:text-4xl"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {t("optionE.topBuilders")} <span style={{ color: "var(--sol-green-hex)" }}>{t("optionE.rightNow")}</span>
          </h2>
        </div>

        {/* Marquee */}
        <div className="relative overflow-hidden">
          {/* Fade edges */}
          <div
            className="absolute inset-y-0 left-0 w-12 sm:w-24 z-10 pointer-events-none bg-gradient-to-r from-background to-transparent"
          />
          <div
            className="absolute inset-y-0 right-0 w-12 sm:w-24 z-10 pointer-events-none bg-gradient-to-l from-background to-transparent"
          />

          <div
            className="flex gap-4"
            style={{
              animation: "marquee-scroll 35s linear infinite",
              width: "max-content",
            }}
          >
            {[...BUILDERS, ...BUILDERS].map((builder, i) => (
              <div
                key={i}
                className="shrink-0 w-64 p-5 space-y-3"
                style={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderLeftWidth: "2px",
                  borderLeftColor: i % 3 === 0 ? "#14F195" : i % 3 === 1 ? "rgba(153,69,255,0.7)" : "#C9903A",
                }}
              >
                <div className="flex items-center justify-between text-foreground/70">
                  <span
                    className="text-xs"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {builder.wallet}
                  </span>
                  <span
                    className="px-2 py-0.5 text-[10px] font-bold"
                    style={{
                      fontFamily: "var(--font-mono)",
                      background: "rgba(201,144,58,0.1)",
                      color: "#C9903A",
                      border: "1px solid rgba(201,144,58,0.2)",
                    }}
                  >
                    Lv.{builder.level}
                  </span>
                </div>
                <div
                  className="text-[9px] text-foreground/55"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  🇧🇷 {builder.city}
                </div>

                <div
                  className="text-3xl font-bold tabular-nums"
                  style={{ fontFamily: "var(--font-mono)", color: "#C9903A" }}
                >
                  {builder.xp.toLocaleString()} <span className="text-xs text-foreground/42">XP</span>
                </div>

                <div className="flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 14 14">
                    <polygon
                      points="7,1 10,4 13,4 10.5,7 11.5,11 7,9 2.5,11 3.5,7 1,4 4,4"
                      fill="none"
                      stroke="#9945FF"
                      strokeWidth="1"
                      opacity="0.6"
                    />
                  </svg>
                  <span
                    className="text-[11px] text-foreground/62"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {builder.cred}
                  </span>
                  <span className="flex items-center gap-0.5 ml-auto">
                    <svg width="10" height="10" viewBox="0 0 10 10">
                      <polygon points="5,0.5 9.33,2.75 9.33,7.25 5,9.5 0.67,7.25 0.67,2.75" fill="none" stroke="#14F195" strokeWidth="0.8" opacity="0.6" />
                      <text x="5" y="5.5" textAnchor="middle" dominantBaseline="central" fill="#14F195" fontSize="5" fontWeight="bold">&#10003;</text>
                    </svg>
                    <span className="text-[8px]" style={{ fontFamily: "var(--font-mono)", color: "var(--sol-green-hex)", opacity: 0.6 }}>on-chain</span>
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: "hsl(var(--border) / 0.5)" }}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${builder.progress}%`,
                      background: "linear-gradient(90deg, #14F195, #9945FF)",
                    }}
                  />
                </div>
                <div
                  className="text-[9px] text-foreground/45"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {builder.progress}% {t("optionE.toNextLevel")}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 mt-8">
          <StartLearningButton />
        </div>
      </motion.section>


      {/* ═══════════════════════════════════════
          COMUNIDADE BRASIL — CULTURAL CENTERPIECE
      ═══════════════════════════════════════ */}
      <motion.section
        variants={sectionReveal}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="py-12 sm:py-20 border-b border-border/20 overflow-hidden bg-background"
      >
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid items-center gap-10 lg:grid-cols-[40%_60%]">

            {/* Left: Brazil map SVG */}
            <div className="hidden md:block relative mx-auto w-full max-w-[320px] lg:max-w-none" style={{ minHeight: "280px" }}>
              {/* Light mode: subtle tinted backdrop for low-opacity SVG elements */}
              <div
                className="absolute inset-0 dark:hidden pointer-events-none rounded-lg"
                style={{
                  background: "radial-gradient(ellipse at 50% 50%, color-mix(in srgb, var(--sol-green-hex) 8%, transparent) 0%, rgba(0,156,59,0.03) 60%, transparent 80%)",
                }}
              />
              <BrazilMap />
            </div>

            {/* Right: Stats and community callout */}
            <div className="space-y-8 text-foreground">
              <div>
                <h2
                  className="text-3xl font-bold sm:text-4xl"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {t("optionE.comunidade")}{" "}
                  <span style={{ color: "var(--sol-green-hex)" }}>{t("optionE.brasil")}</span>
                </h2>
              </div>

              <div
                className="text-4xl font-bold sm:text-5xl lg:text-6xl"
                style={{ fontFamily: "var(--font-mono)", color: "#C9903A" }}
              >
                {t("optionE.buildersCount")}{" "}
                <span className="text-xl sm:text-2xl lg:text-3xl text-foreground/68">
                  {t("optionE.builders")}
                </span>
              </div>

              <p
                className="text-sm text-foreground/50"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {t("optionE.cities")}
              </p>

              <blockquote
                className="pl-4"
                style={{
                  borderLeft: "2px solid color-mix(in srgb, var(--sol-green-hex) 30%, transparent)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "16px",
                  fontStyle: "italic",
                }}
              >
                <span className="text-foreground/60">&ldquo;{t("optionE.quote")}&rdquo;</span>
              </blockquote>

              <Link href="/community">
                <span
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold transition-all hover:opacity-80"
                  style={{
                    fontFamily: "var(--font-mono)",
                    background: "color-mix(in srgb, var(--sol-green-hex) 10%, transparent)",
                    color: "var(--sol-green-hex)",
                    border: "1px solid color-mix(in srgb, var(--sol-green-hex) 25%, transparent)",
                  }}
                >
                  {t("optionE.joinBrasil")}
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ═══════════════════════════════════════
          SECTION 4: SKILL PATH MAP
      ═══════════════════════════════════════ */}
      <motion.section
        variants={sectionReveal}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="py-12 sm:py-20 bg-card border-t border-border/20"
      >
        <div className="mx-auto max-w-7xl px-4 text-foreground">
          <div className="mb-10">
            <p className="font-mono text-xs uppercase tracking-[0.15em] mb-3" style={{ color: "var(--sol-green-hex)" }}>{t("optionE.skillPathLabel")}</p>
            <h2
              className="text-3xl font-bold sm:text-4xl"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {t("optionE.your")} <span style={{ color: "var(--sol-green-hex)" }}>{t("optionE.journey")}</span>
            </h2>
          </div>

          {/* SVG Skill Tree */}
          <div className="w-full overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
            <svg
              width="100%"
              height="360"
              viewBox="0 0 1000 360"
              xmlns="http://www.w3.org/2000/svg"
              style={{ minWidth: "700px" }}
            >
              {SKILL_PATHS.map((path, pathIdx) => {
                const colX = 125 + pathIdx * 240;

                return (
                  <g key={path.title}>
                    {/* Path title */}
                    <text
                      x={colX}
                      y={35}
                      textAnchor="middle"
                      className={pathIdx === 0 ? "fill-[#14F195]" : "fill-foreground/55"}
                      fontSize="12"
                      fontFamily="var(--font-mono)"
                      fontWeight="bold"
                    >
                      {path.title}
                    </text>

                    {/* Connector lines between nodes */}
                    {path.nodes.slice(0, -1).map((node, nodeIdx) => {
                      const nextNode = path.nodes[nodeIdx + 1];
                      const isActive = node.state === "completed" && nextNode?.state === "available";
                      return (
                        <path
                          key={`conn-${pathIdx}-${nodeIdx}`}
                          d={`M ${colX} ${node.y + 14} C ${colX} ${node.y + 40}, ${colX} ${(nextNode?.y ?? node.y) - 40}, ${colX} ${(nextNode?.y ?? node.y) - 14}`}
                          fill="none"
                          stroke={
                            node.state === "completed"
                              ? "#14F195"
                              : "hsl(var(--border))"
                          }
                          strokeWidth={node.state === "completed" ? "2" : "1"}
                          strokeDasharray={isActive ? "8 8" : node.state === "completed" ? "none" : "4 4"}
                          style={isActive ? { animation: "path-flow 1.5s linear infinite" } : undefined}
                        />
                      );
                    })}

                    {/* Cross-path connector to next path */}
                    {pathIdx < SKILL_PATHS.length - 1 && (() => {
                      const lastNode = path.nodes[path.nodes.length - 1]!;
                      const nextPath = SKILL_PATHS[pathIdx + 1]!;
                      const nextFirstNode = nextPath.nodes[0]!;
                      return (
                      <path
                        d={`M ${colX + 20} ${lastNode.y} Q ${colX + 120} ${lastNode.y + 20}, ${colX + 240} ${nextFirstNode.y}`}
                        fill="none"
                        stroke="hsl(var(--border) / 0.4)"
                        strokeWidth="1"
                        strokeDasharray="4 6"
                      />
                      );
                    })()}

                    {/* Nodes */}
                    {path.nodes.map((node, nodeIdx) => {
                      const nodeColor =
                        node.state === "completed"
                          ? "#14F195"
                          : node.state === "available"
                            ? "hsl(var(--foreground))"
                            : "currentColor";
                      const nodeFill =
                        node.state === "completed"
                          ? "#14F195"
                          : "transparent";
                      const nodeR = node.state === "available" ? 13 : 11;

                      return (
                        <g key={`node-${pathIdx}-${nodeIdx}`}>
                          {/* Pulse ring for available nodes */}
                          {node.state === "available" && (
                            <circle
                              cx={colX}
                              cy={node.y}
                              r={18}
                              fill="none"
                              stroke="#14F195"
                              strokeWidth="1"
                              opacity="0.3"
                            >
                              <animate
                                attributeName="r"
                                values="14;22;14"
                                dur="2.5s"
                                repeatCount="indefinite"
                              />
                              <animate
                                attributeName="opacity"
                                values="0.4;0;0.4"
                                dur="2.5s"
                                repeatCount="indefinite"
                              />
                            </circle>
                          )}

                          <circle
                            cx={colX}
                            cy={node.y}
                            r={nodeR}
                            fill={nodeFill}
                            stroke={nodeColor}
                            strokeWidth={node.state === "available" ? "2" : "1.5"}
                          />

                          {/* Checkmark for completed */}
                          {node.state === "completed" && (
                            <text
                              x={colX}
                              y={node.y}
                              textAnchor="middle"
                              dominantBaseline="central"
                              fill="hsl(var(--background))"
                              fontSize="11"
                              fontWeight="bold"
                            >
                              &#10003;
                            </text>
                          )}

                          {/* Label */}
                          <text
                            x={colX}
                            y={node.y + 26}
                            textAnchor="middle"
                            className={node.state === "locked" ? "fill-foreground/45" : "fill-foreground/80"}
                            fontSize="10"
                            fontFamily="var(--font-mono)"
                          >
                            {node.label}
                          </text>
                        </g>
                      );
                    })}
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      </motion.section>

      {/* ═══════════════════════════════════════
          FEATURED COURSES (conditional)
      ═══════════════════════════════════════ */}
      {featuredCourses.length > 0 && (
        <section className="py-12 sm:py-20 border-t border-border/20 bg-background">
          <div className="mx-auto max-w-7xl px-4">
            <div className="mb-10">
              <p className="font-mono text-xs uppercase tracking-[0.15em] mb-3" style={{ color: "var(--sol-green-hex)" }}>{t("optionE.coursesLabel")}</p>
              <h2 className="text-3xl font-bold sm:text-4xl text-foreground" style={{ fontFamily: "var(--font-mono)" }}>
                {t("featuredCourses.title")}
              </h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredCourses.map((course, idx) => {
                const cardData: CourseCardData = {
                  slug: course.slug,
                  title: course.title,
                  description: course.description,
                  thumbnail: course.thumbnail ?? null,
                  difficulty: course.difficulty,
                  lessonCount: course.lessons?.length ?? 0,
                  xpPerLesson: course.xpPerLesson,
                  totalEnrollments: 0,
                  progress: null,
                  tags: course.tags ?? [],
                  totalMinutes: course.lessons?.reduce((sum, l) => sum + (l.estimatedMinutes ?? 0), 0) ?? 0,
                  onChainCourseId: course.onChainCourseId,
                };
                return <CourseCard key={course._id} course={cardData} priority={idx === 0} index={idx} />;
              })}
            </div>
            <div className="mt-8">
              <Link href="/courses">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 text-xs rounded-none text-foreground/62"
                  style={{
                    fontFamily: "var(--font-mono)",
                    border: "1px solid hsl(var(--border))",
                  }}
                >
                  {t("featuredCourses.viewAll")}
                  <ArrowRight style={{ width: "12px", height: "12px" }} />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════
          TESTIMONIALS
      ═══════════════════════════════════════ */}
      <motion.section
        variants={sectionReveal}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="py-12 sm:py-20 border-t border-border/20 bg-card"
      >
        <div className="mx-auto max-w-6xl px-4 text-foreground">
          <div className="mb-12">
            <p className="font-mono text-xs uppercase tracking-[0.15em] mb-3" style={{ color: "var(--sol-green-hex)" }}>
              {t("optionE.testimonialsLabel")}
            </p>
            <h2 className="text-3xl font-bold sm:text-4xl" style={{ fontFamily: "var(--font-mono)" }}>
              {t("optionE.testimonialsTitle")}{" "}
              <span style={{ color: "var(--sol-green-hex)" }}>{t("optionE.testimonialsTitleAccent")}</span>
            </h2>
          </div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {[
              { name: t("optionE.testimonial1Name"), role: t("optionE.testimonial1Role"), quote: t("optionE.testimonial1Quote"), accent: "#14F195" },
              { name: t("optionE.testimonial2Name"), role: t("optionE.testimonial2Role"), quote: t("optionE.testimonial2Quote"), accent: "#9945FF" },
              { name: t("optionE.testimonial3Name"), role: t("optionE.testimonial3Role"), quote: t("optionE.testimonial3Quote"), accent: "#C9903A" },
            ].map((testimonial) => (
              <motion.div
                key={testimonial.name}
                variants={fadeUp}
                className="p-6 space-y-4"
                style={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderLeftWidth: "2px",
                  borderLeftColor: testimonial.accent,
                }}
              >
                <Quote className="h-5 w-5 text-foreground/25" />
                <p className="text-sm leading-relaxed text-foreground/62 italic">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div className="pt-2" style={{ borderTop: "1px solid hsl(var(--border) / 0.3)" }}>
                  <p className="text-sm font-bold text-foreground" style={{ fontFamily: "var(--font-mono)" }}>
                    {testimonial.name}
                  </p>
                  <p className="text-xs text-foreground/45" style={{ fontFamily: "var(--font-mono)" }}>
                    {testimonial.role}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* ═══════════════════════════════════════
          SECTION 5: PARTNERS STRIP
      ═══════════════════════════════════════ */}
      <section className="py-10 bg-card border-t border-border/20">
        <div className="mx-auto max-w-7xl px-4">
          <p className="font-mono text-xs uppercase tracking-[0.15em] mb-6 text-center" style={{ color: "var(--sol-green-hex)", opacity: 0.75 }}>
            $ {t("partners.title").toLowerCase()}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {/* Solana */}
            <div
              className="flex items-center gap-2 px-5 py-2 cursor-default transition-colors text-foreground/55"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderLeftColor: "#14F195",
                borderLeftWidth: "2px",
              }}
            >
              <svg width="14" height="11" viewBox="0 0 397 312" fill="none" aria-hidden="true">
                <path d="M64.6 237.9a11.6 11.6 0 0 1 8.2-3.4H393a5.8 5.8 0 0 1 4.1 9.9l-62.7 62.7a11.6 11.6 0 0 1-8.2 3.4H6.4a5.8 5.8 0 0 1-4.1-9.9l62.3-62.7Z" fill="url(#s1)"/>
                <path d="M64.6 3.4A11.9 11.9 0 0 1 72.8 0H393a5.8 5.8 0 0 1 4.1 9.9l-62.7 62.7a11.6 11.6 0 0 1-8.2 3.4H6.4a5.8 5.8 0 0 1-4.1-9.9L64.6 3.4Z" fill="url(#s2)"/>
                <path d="M333.1 120.1a11.6 11.6 0 0 0-8.2-3.4H4.6a5.8 5.8 0 0 0-4.1 9.9l62.7 62.7a11.6 11.6 0 0 0 8.2 3.4H391a5.8 5.8 0 0 0 4.1-9.9l-62-62.7Z" fill="url(#s3)"/>
                <defs>
                  <linearGradient id="s1" x1="371" y1="1" x2="10" y2="340" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#00FFA3"/><stop offset="1" stopColor="#DC1FFF"/>
                  </linearGradient>
                  <linearGradient id="s2" x1="371" y1="1" x2="10" y2="340" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#00FFA3"/><stop offset="1" stopColor="#DC1FFF"/>
                  </linearGradient>
                  <linearGradient id="s3" x1="371" y1="1" x2="10" y2="340" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#00FFA3"/><stop offset="1" stopColor="#DC1FFF"/>
                  </linearGradient>
                </defs>
              </svg>
              Solana
            </div>

            {/* Metaplex */}
            <div
              className="flex items-center gap-2 px-5 py-2 cursor-default transition-colors text-foreground/55"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderLeftColor: "#14F195",
                borderLeftWidth: "2px",
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 2L2 7l10 5 10-5-10-5Z" fill="#14F195" opacity="0.9"/>
                <path d="M2 17l10 5 10-5" stroke="#14F195" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.7"/>
                <path d="M2 12l10 5 10-5" stroke="#14F195" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.5"/>
              </svg>
              Metaplex
            </div>

            {/* Helius */}
            <div
              className="flex items-center gap-2 px-5 py-2 cursor-default transition-colors text-foreground/55"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderLeftColor: "#F97316",
                borderLeftWidth: "2px",
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="4" fill="#F97316"/>
                <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12" stroke="#F97316" strokeWidth="2" strokeLinecap="round" opacity="0.7"/>
              </svg>
              Helius
            </div>

            {/* Superteam */}
            <div
              className="flex items-center gap-2 px-5 py-2 cursor-default transition-colors text-foreground/55"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderLeftColor: "#9945FF",
                borderLeftWidth: "2px",
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" fill="#9945FF" opacity="0.9"/>
              </svg>
              Superteam
            </div>

            {/* Anchor */}
            <div
              className="flex items-center gap-2 px-5 py-2 cursor-default transition-colors text-foreground/55"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderLeftColor: "#3B82F6",
                borderLeftWidth: "2px",
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="5" r="2" fill="#3B82F6"/>
                <path d="M12 7v4M5 11h14M9 22l3-11 3 11" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Anchor
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          SECTION 6: FINAL CTA
      ═══════════════════════════════════════ */}
      <section className="py-16 sm:py-28 border-t border-border/20 bg-background">
        <div className="mx-auto max-w-4xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center text-center space-y-6 sm:space-y-8"
          >
            {/* Small decorative orb — hidden on mobile for performance */}
            <div className="hidden sm:block opacity-70">
              <SolanaOrb size={150} />
            </div>

            <h2
              className="leading-[1.1] text-foreground"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "clamp(2rem, 4.5vw, 3.5rem)",
                fontWeight: 900,
              }}
            >
              {t("optionE.ctaStartYour")}<br />
              <span style={{ color: "var(--sol-green-hex)" }}>{t("optionE.ctaOnChainJourney")}</span>
            </h2>

            <p className="text-sm mx-auto max-w-xs text-foreground/52">
              {t("optionE.ctaJoinDevelopers")}
            </p>

            <StartLearningButton />
          </motion.div>
        </div>
      </section>

    </div>
  );
}
