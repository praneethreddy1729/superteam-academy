"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import {
  Shield, Zap, Trophy, GraduationCap, BookOpen, UserPlus, Award,
  ArrowRight, Layers, ImageIcon, Cpu, Flame,
} from "lucide-react";
import { StartLearningButton } from "@/components/landing/StartLearningButton";
import type { SanityCourse } from "@/lib/sanity/queries";
import { CourseCard, CourseCardData } from "@/components/courses/CourseCard";
import { motion, Variants } from "framer-motion";
import { useState } from "react";

/* ═══════════════════════════════════════════════
   DESIGN SYSTEM — Holographic Game HUD
   ═══════════════════════════════════════════════ */

const C = {
  bg:      "#04060A",
  bgPanel: "#080C12",
  teal:    "#00FFCC",
  amber:   "#FFB800",
  danger:  "#FF4444",
  purple:  "#9945FF",
  blue:    "#00D4FF",
} as const;

const CHAMFER = "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)";
const CHAMFER_SM = "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)";

/* ── Animation Variants ── */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 28 } },
};

const stagger: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const slideLeft: Variants = {
  hidden: { opacity: 0, x: 40 },
  show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 200, damping: 26 } },
};

/* ── Reusable corner bracket decoration ── */
function CornerBrackets({ color = C.teal, size = 16, thickness = 1 }: { color?: string; size?: number; thickness?: number }) {
  const s = `${size}px`;
  const b = `${thickness}px solid ${color}`;
  return (
    <>
      {/* Top-left */}
      <span className="absolute top-0 left-0 pointer-events-none" style={{ width: s, height: s, borderTop: b, borderLeft: b }} />
      {/* Top-right */}
      <span className="absolute top-0 right-0 pointer-events-none" style={{ width: s, height: s, borderTop: b, borderRight: b }} />
      {/* Bottom-left */}
      <span className="absolute bottom-0 left-0 pointer-events-none" style={{ width: s, height: s, borderBottom: b, borderLeft: b }} />
      {/* Bottom-right */}
      <span className="absolute bottom-0 right-0 pointer-events-none" style={{ width: s, height: s, borderBottom: b, borderRight: b }} />
    </>
  );
}

/* ── Hexagonal XP Ring (SVG) ── */
function HexXPRing() {
  // Hexagon points for a regular hexagon centered at 150,150 with radius 130
  const r = 130;
  const cx = 150;
  const cy = 150;
  const points: [number, number][] = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 2;
    points.push([cx + r * Math.cos(angle), cy + r * Math.sin(angle)]);
  }
  const hexPath = points.map((p, i) => `${i === 0 ? "M" : "L"}${p[0]},${p[1]}`).join(" ") + " Z";

  // Smaller inner hex
  const rInner = 110;
  const innerPoints: [number, number][] = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 2;
    innerPoints.push([cx + rInner * Math.cos(angle), cy + rInner * Math.sin(angle)]);
  }
  const innerHexPath = innerPoints.map((p, i) => `${i === 0 ? "M" : "L"}${p[0]},${p[1]}`).join(" ") + " Z";

  // Decorative tick marks on each vertex
  const tickR1 = 135;
  const tickR2 = 142;
  const ticks: { x1: number; y1: number; x2: number; y2: number }[] = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 2;
    ticks.push({
      x1: cx + tickR1 * Math.cos(angle),
      y1: cy + tickR1 * Math.sin(angle),
      x2: cx + tickR2 * Math.cos(angle),
      y2: cy + tickR2 * Math.sin(angle),
    });
  }

  // Small ticks between vertices
  const smallTicks: { x1: number; y1: number; x2: number; y2: number }[] = [];
  for (let i = 0; i < 12; i++) {
    const angle = (Math.PI / 6) * i - Math.PI / 2;
    if (i % 2 === 0) continue; // skip vertex positions
    smallTicks.push({
      x1: cx + (tickR1 + 2) * Math.cos(angle),
      y1: cy + (tickR1 + 2) * Math.sin(angle),
      x2: cx + (tickR2 - 2) * Math.cos(angle),
      y2: cy + (tickR2 - 2) * Math.sin(angle),
    });
  }

  return (
    <div className="relative" style={{ width: 300, height: 300 }}>
      {/* Glow backdrop */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at center, ${C.teal}12 0%, transparent 70%)`,
        }}
      />

      <svg viewBox="0 0 300 300" width={300} height={300} className="relative z-10">
        <defs>
          <filter id="hex-glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="hex-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={C.teal} stopOpacity={0.8} />
            <stop offset="50%" stopColor={C.teal} stopOpacity={0.3} />
            <stop offset="100%" stopColor={C.amber} stopOpacity={0.6} />
          </linearGradient>
          {/* Animated dash for the progress ring */}
          <style>{`
            @keyframes hex-dash {
              from { stroke-dashoffset: 900; }
              to { stroke-dashoffset: 900; }
            }
            @keyframes hex-pulse {
              0%, 100% { opacity: 0.3; }
              50% { opacity: 0.7; }
            }
            @keyframes hex-rotate {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}</style>
        </defs>

        {/* Background hex - dim */}
        <path
          d={hexPath}
          fill="none"
          stroke={C.teal}
          strokeWidth={1}
          opacity={0.15}
        />

        {/* Inner hex */}
        <path
          d={innerHexPath}
          fill="none"
          stroke={C.teal}
          strokeWidth={0.5}
          opacity={0.1}
        />

        {/* Progress ring hex - animated glow */}
        <path
          d={hexPath}
          fill="none"
          stroke="url(#hex-grad)"
          strokeWidth={2.5}
          strokeDasharray="12 8"
          filter="url(#hex-glow)"
          style={{ animation: "hex-pulse 3s ease-in-out infinite" }}
        />

        {/* Vertex ticks */}
        {ticks.map((tick, i) => (
          <line
            key={`t-${i}`}
            x1={tick.x1} y1={tick.y1} x2={tick.x2} y2={tick.y2}
            stroke={C.teal}
            strokeWidth={2}
            opacity={0.6}
          />
        ))}

        {/* Small ticks */}
        {smallTicks.map((tick, i) => (
          <line
            key={`st-${i}`}
            x1={tick.x1} y1={tick.y1} x2={tick.x2} y2={tick.y2}
            stroke={C.teal}
            strokeWidth={1}
            opacity={0.25}
          />
        ))}

        {/* Center level display */}
        <text
          x={cx} y={cy - 24}
          textAnchor="middle"
          fill={C.teal}
          fontSize="10"
          fontFamily="var(--font-mono)"
          letterSpacing="0.2em"
          opacity={0.5}
        >
          ◇ CURRENT RANK ◇
        </text>
        <text
          x={cx} y={cy + 8}
          textAnchor="middle"
          fill="white"
          fontSize="36"
          fontFamily="var(--font-mono)"
          fontWeight="900"
          letterSpacing="-0.02em"
        >
          LVL 0
        </text>
        <text
          x={cx} y={cy + 32}
          textAnchor="middle"
          fill={C.amber}
          fontSize="10"
          fontFamily="var(--font-mono)"
          letterSpacing="0.15em"
          fontWeight="700"
        >
          START JOURNEY
        </text>

        {/* XP bar at bottom */}
        <rect x={cx - 50} y={cy + 46} width={100} height={3} rx={0} fill={`${C.teal}15`} />
        <rect x={cx - 50} y={cy + 46} width={0} height={3} rx={0} fill={C.teal}>
          <animate attributeName="width" from="0" to="0" dur="1s" />
        </rect>
        <text
          x={cx} y={cy + 62}
          textAnchor="middle"
          fill={`${C.teal}80`}
          fontSize="8"
          fontFamily="var(--font-mono)"
          letterSpacing="0.1em"
        >
          0 / 1,000 XP
        </text>

        {/* Animated orbiting dot */}
        <circle r={3} fill={C.teal} opacity={0.6}
          style={{
            transformOrigin: `${cx}px ${cy}px`,
            animation: "hex-rotate 12s linear infinite",
          }}
        >
          <animateMotion dur="12s" repeatCount="indefinite" path={hexPath} />
        </circle>
      </svg>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════ */

export function LandingContent({ featuredCourses }: { featuredCourses: SanityCourse[] }) {
  const t = useTranslations("landing");
  const tPaths = useTranslations("learningPaths");
  const [liveCount] = useState(27);

  return (
    <div className="flex flex-col relative" style={{ background: C.bg }}>

      {/* ── Global CRT Scanlines Overlay ── */}
      <div
        className="fixed inset-0 pointer-events-none z-50"
        style={{
          background: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.03) 3px, rgba(0,0,0,0.03) 4px)",
        }}
      />

      {/* ── Global Keyframes ── */}
      <style>{`
        @keyframes glitch-shift {
          0%, 100% { clip-path: inset(0 0 98% 0); transform: translate(0); }
          10% { clip-path: inset(40% 0 20% 0); transform: translate(-2px, 1px); }
          20% { clip-path: inset(60% 0 10% 0); transform: translate(2px, -1px); }
          30% { clip-path: inset(10% 0 70% 0); transform: translate(-1px, 2px); }
          40%, 100% { clip-path: inset(0 0 100% 0); transform: translate(0); }
        }
        @keyframes scanline-pulse {
          0% { background-position: 0 0; }
          100% { background-position: 0 4px; }
        }
        @keyframes hud-flicker {
          0%, 95%, 100% { opacity: 1; }
          96% { opacity: 0.8; }
          97% { opacity: 1; }
          98% { opacity: 0.6; }
          99% { opacity: 1; }
        }
        @keyframes data-stream {
          from { transform: translateY(0); }
          to { transform: translateY(-50%); }
        }
        @keyframes border-trace {
          0% { background-position: 0% 0%; }
          100% { background-position: 200% 0%; }
        }
        @keyframes ticker-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-33.333%); }
        }
      `}</style>

      {/* ═══════════════════════════════════════
          HERO — Above the Fold
      ═══════════════════════════════════════ */}
      <section className="relative flex flex-col justify-center overflow-hidden" style={{ minHeight: "min(100vh, 900px)" }}>
        {/* Background grid — angled */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(${C.teal}08 1px, transparent 1px), linear-gradient(90deg, ${C.teal}08 1px, transparent 1px)`,
            backgroundSize: "80px 80px",
            mask: "radial-gradient(ellipse 70% 60% at 50% 50%, black, transparent)",
          }}
        />

        {/* Ambient glow — left teal */}
        <div className="absolute -top-20 -left-40 w-[600px] h-[600px] pointer-events-none" style={{ background: `radial-gradient(circle, ${C.teal}08 0%, transparent 65%)` }} />
        {/* Ambient glow — right amber */}
        <div className="absolute -bottom-20 -right-20 w-[500px] h-[500px] pointer-events-none" style={{ background: `radial-gradient(circle, ${C.amber}06 0%, transparent 65%)` }} />

        <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 py-10 lg:py-0">
          <div className="grid items-center gap-8 lg:grid-cols-[1.5fr_1fr]">

            {/* ── Left 60%: Typography ── */}
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="show"
              className="space-y-5"
            >
              {/* System status badge */}
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2.5" style={{ fontFamily: "var(--font-mono)" }}>
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" style={{ background: C.teal }} />
                  <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: C.teal }} />
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em]" style={{ color: C.teal }}>
                  SYSTEM ONLINE · {liveCount} ACTIVE AGENTS
                </span>
              </motion.div>

              {/* Glitch heading */}
              <div>
                <motion.h1
                  variants={stagger}
                  initial="hidden"
                  animate="show"
                  className="relative uppercase leading-[0.88] tracking-[-0.03em]"
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "clamp(2.8rem, 6vw, 5.5rem)",
                    fontWeight: 900,
                  }}
                >
                  {/* Glitch layers */}
                  <span
                    className="absolute inset-0 pointer-events-none select-none"
                    aria-hidden="true"
                    style={{
                      color: "#FF4444",
                      animation: "glitch-shift 4s ease-in-out infinite",
                      zIndex: 1,
                    }}
                  >
                    <span className="block">SUPERTEAM</span>
                    <span className="block">ACADEMY</span>
                  </span>
                  <span
                    className="absolute inset-0 pointer-events-none select-none"
                    aria-hidden="true"
                    style={{
                      color: C.teal,
                      animation: "glitch-shift 4s ease-in-out infinite reverse",
                      zIndex: 1,
                    }}
                  >
                    <span className="block">SUPERTEAM</span>
                    <span className="block">ACADEMY</span>
                  </span>
                  <motion.span variants={fadeUp} className="block text-white relative z-[2]">SUPERTEAM</motion.span>
                  <motion.span variants={fadeUp} className="block relative z-[2]" style={{ color: C.teal }}>ACADEMY</motion.span>
                </motion.h1>
              </div>

              {/* Tagline */}
              <motion.p
                variants={fadeUp}
                className="max-w-md text-sm leading-relaxed tracking-wide uppercase"
                style={{ color: "rgba(255,255,255,0.35)", fontFamily: "var(--font-mono)", letterSpacing: "0.08em" }}
              >
                {t("hero.subtitle")}
              </motion.p>

              {/* CTA row */}
              <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-3 pt-1">
                <div style={{ clipPath: CHAMFER_SM }}>
                  <StartLearningButton />
                </div>
                <Link href="/courses">
                  <button
                    className="relative px-6 py-2.5 text-xs uppercase tracking-widest font-bold transition-all duration-300"
                    style={{
                      fontFamily: "var(--font-mono)",
                      color: C.teal,
                      background: "transparent",
                      border: `1px solid ${C.teal}40`,
                      clipPath: CHAMFER_SM,
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 0 20px ${C.teal}20, inset 0 0 20px ${C.teal}08`;
                      (e.currentTarget as HTMLButtonElement).style.borderColor = `${C.teal}80`;
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
                      (e.currentTarget as HTMLButtonElement).style.borderColor = `${C.teal}40`;
                    }}
                  >
                    {t("cta.button")}
                    <ArrowRight className="inline-block ml-2 h-3 w-3" />
                  </button>
                </Link>
              </motion.div>

              {/* Inline stats — HUD readout style */}
              <motion.div variants={fadeUp} className="flex items-stretch gap-0 w-fit" style={{ clipPath: CHAMFER }}>
                {[
                  { value: t("stats.coursesValue"), label: t("stats.courses") },
                  { value: t("stats.lessonsValue"), label: t("stats.lessons") },
                  { value: t("stats.challengesValue"), label: t("stats.challenges") },
                  { value: t("stats.languagesValue"), label: t("stats.languages") },
                ].map(({ value, label }, i) => (
                  <div
                    key={label}
                    className="flex flex-col items-center justify-center px-5 py-3 text-center"
                    style={{
                      fontFamily: "var(--font-mono)",
                      background: `${C.teal}06`,
                      borderLeft: i > 0 ? `1px solid ${C.teal}15` : "none",
                    }}
                  >
                    <span className="text-lg font-black tabular-nums" style={{ color: C.teal }}>{value}</span>
                    <span className="text-[8px] uppercase tracking-[0.15em] mt-0.5" style={{ color: "rgba(255,255,255,0.25)" }}>{label}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* ── Right 40%: HEX XP Ring + System Stats ── */}
            <motion.div
              variants={slideLeft}
              initial="hidden"
              animate="show"
              className="hidden lg:flex flex-col items-center gap-4"
            >
              {/* XP Ring container */}
              <div
                className="relative p-4"
                style={{
                  clipPath: CHAMFER,
                  background: `linear-gradient(135deg, ${C.teal}08, transparent 60%)`,
                  border: `1px solid ${C.teal}20`,
                }}
              >
                <CornerBrackets color={`${C.teal}50`} size={20} thickness={1} />
                <HexXPRing />
              </div>

              {/* System stats panels */}
              <div className="grid grid-cols-2 gap-2 w-full max-w-[300px]">
                {[
                  { label: "NETWORK", value: "DEVNET", color: C.teal },
                  { label: "STATUS", value: "ACTIVE", color: C.teal },
                  { label: "XP RATE", value: "150/HR", color: C.amber },
                  { label: "AGENTS", value: `${liveCount}`, color: C.amber },
                ].map(({ label, value, color }) => (
                  <div
                    key={label}
                    className="relative flex items-center justify-between px-3 py-2"
                    style={{
                      background: `${color}06`,
                      border: `1px solid ${color}18`,
                      clipPath: CHAMFER_SM,
                    }}
                  >
                    <span
                      className="text-[8px] uppercase tracking-[0.12em]"
                      style={{ fontFamily: "var(--font-mono)", color: "rgba(255,255,255,0.3)" }}
                    >
                      {label}
                    </span>
                    <span
                      className="text-xs font-bold tabular-nums"
                      style={{ fontFamily: "var(--font-mono)", color, animation: "hud-flicker 5s ease-in-out infinite" }}
                    >
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>
        </div>

        {/* Bottom edge decoration */}
        <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${C.teal}30 30%, ${C.teal}30 70%, transparent)` }} />
      </section>

      {/* ═══════════════════════════════════════
          STATS HUD BAR
      ═══════════════════════════════════════ */}
      <section className="border-b" style={{ borderColor: `${C.teal}10`, background: `${C.bgPanel}` }}>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mx-auto max-w-7xl px-4"
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-0">
            {[
              { label: "TOTAL LEARNERS", value: "500+", icon: "▲" },
              { label: "XP DISTRIBUTED", value: "125K", icon: "◆" },
              { label: "CREDENTIALS MINTED", value: "89", icon: "⬡" },
              { label: "COMPLETION RATE", value: "94%", icon: "●" },
            ].map(({ label, value, icon }, i) => (
              <div
                key={label}
                className="flex items-center gap-4 py-5 px-4"
                style={{
                  borderLeft: i > 0 ? `1px solid ${C.teal}10` : "none",
                  fontFamily: "var(--font-mono)",
                }}
              >
                <span style={{ color: C.teal, fontSize: "12px", opacity: 0.5 }}>{icon}</span>
                <div>
                  <div className="text-[9px] uppercase tracking-[0.15em]" style={{ color: "rgba(255,255,255,0.25)" }}>{label}</div>
                  <div className="text-lg font-black tabular-nums text-white">{value}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════
          FEATURES — HUD Panels
      ═══════════════════════════════════════ */}
      <section className="py-20" style={{ borderBottom: `1px solid ${C.teal}10` }}>
        <div className="mx-auto max-w-7xl px-4">
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }} className="mb-12">
            <motion.p variants={fadeUp} className="text-[10px] uppercase tracking-[0.25em] mb-3" style={{ fontFamily: "var(--font-mono)", color: C.teal }}>
              ◇ SYSTEM CAPABILITIES ◇
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="uppercase tracking-tight"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
                fontWeight: 900,
                color: "white",
              }}
            >
              {t("features.title")}
            </motion.h2>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3"
          >
            {[
              { icon: Shield, key: "onChain" as const, accent: C.teal, tag: "CORE" },
              { icon: Zap, key: "soulboundXP" as const, accent: C.amber, tag: "TOKEN" },
              { icon: Trophy, key: "nftCredentials" as const, accent: C.purple, tag: "NFT" },
              { icon: GraduationCap, key: "openSource" as const, accent: C.teal, tag: "OSS" },
            ].map(({ icon: Icon, key, accent, tag }) => (
              <motion.div
                key={key}
                variants={fadeUp}
                className="group relative p-6 cursor-default transition-all duration-300"
                style={{
                  background: C.bg,
                  border: `1px solid ${accent}15`,
                  clipPath: CHAMFER,
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 0 1px ${accent}40, 0 0 30px ${accent}10`;
                  (e.currentTarget as HTMLDivElement).style.borderColor = `${accent}40`;
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                  (e.currentTarget as HTMLDivElement).style.borderColor = `${accent}15`;
                }}
              >
                <CornerBrackets color={`${accent}30`} size={12} thickness={1} />

                {/* Tag */}
                <div
                  className="inline-block px-2 py-0.5 mb-4 text-[8px] uppercase tracking-[0.2em] font-bold"
                  style={{ fontFamily: "var(--font-mono)", color: accent, background: `${accent}10`, border: `1px solid ${accent}20` }}
                >
                  {tag}
                </div>

                <div
                  className="mb-4 inline-flex h-10 w-10 items-center justify-center"
                  style={{ border: `1px solid ${accent}30`, background: `${accent}08`, color: accent, clipPath: CHAMFER_SM }}
                >
                  <Icon style={{ width: "18px", height: "18px" }} />
                </div>

                <h3 className="mb-2 text-sm font-bold text-white uppercase tracking-wide" style={{ fontFamily: "var(--font-mono)" }}>
                  {t(`features.${key}.title`)}
                </h3>
                <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.3)" }}>
                  {t(`features.${key}.description`)}
                </p>

                {/* Bottom accent line */}
                <div
                  className="absolute bottom-0 left-0 h-[2px] w-0 transition-all duration-500 group-hover:w-full"
                  style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          HOW IT WORKS — Mission Briefing
      ═══════════════════════════════════════ */}
      <section className="py-20" style={{ background: C.bgPanel, borderBottom: `1px solid ${C.teal}10` }}>
        <div className="mx-auto max-w-7xl px-4">
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="mb-12">
            <motion.p variants={fadeUp} className="text-[10px] uppercase tracking-[0.25em] mb-3" style={{ fontFamily: "var(--font-mono)", color: C.amber }}>
              ◇ MISSION BRIEFING ◇
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="uppercase tracking-tight"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
                fontWeight: 900,
                color: "white",
              }}
            >
              {t("howItWorks.title")}
            </motion.h2>
          </motion.div>

          <div className="relative">
            {/* Connector line */}
            <div
              className="absolute left-0 right-0 top-[60px] hidden h-px lg:block"
              style={{ background: `linear-gradient(90deg, transparent, ${C.teal}20 15%, ${C.teal}20 85%, transparent)` }}
            />

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {([
                { step: "step1" as const, icon: UserPlus, reward: "+10 XP", num: "01", status: "READY" },
                { step: "step2" as const, icon: BookOpen, reward: "UNLOCK", num: "02", status: "STANDBY" },
                { step: "step3" as const, icon: Award, reward: "+500 XP", num: "03", status: "STANDBY" },
                { step: "step4" as const, icon: Trophy, reward: "NFT MINT", num: "04", status: "LOCKED" },
              ] as const).map(({ step, icon: StepIcon, reward, num, status }, idx) => (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="relative group"
                >
                  {/* Mission number label */}
                  <div
                    className="absolute -top-3 left-4 z-10 flex items-center gap-2 px-2"
                    style={{ background: C.bgPanel }}
                  >
                    <span
                      className="text-[10px] font-black"
                      style={{ fontFamily: "var(--font-mono)", color: C.teal, opacity: idx === 0 ? 1 : 0.4 }}
                    >
                      MISSION {num}
                    </span>
                  </div>

                  <div
                    className="p-6 pt-8 h-full transition-all duration-300"
                    style={{
                      background: C.bg,
                      border: `1px solid ${idx === 0 ? C.teal : "rgba(255,255,255,0.08)"}${idx === 0 ? "40" : ""}`,
                      clipPath: CHAMFER,
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLDivElement).style.borderColor = `${C.teal}50`;
                      (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 30px ${C.teal}08`;
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLDivElement).style.borderColor = idx === 0 ? `${C.teal}40` : "rgba(255,255,255,0.08)";
                      (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                    }}
                  >
                    <CornerBrackets color={idx === 0 ? `${C.teal}40` : "rgba(255,255,255,0.08)"} size={10} />

                    <div className="flex items-center justify-between mb-4">
                      <div
                        className="flex h-10 w-10 items-center justify-center"
                        style={{
                          border: `1px solid ${C.teal}25`,
                          background: `${C.teal}08`,
                          color: C.teal,
                          clipPath: CHAMFER_SM,
                        }}
                      >
                        <StepIcon style={{ width: "16px", height: "16px" }} />
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className="text-[8px] font-bold uppercase tracking-widest px-2 py-0.5"
                          style={{
                            fontFamily: "var(--font-mono)",
                            color: status === "READY" ? C.teal : status === "LOCKED" ? C.danger : "rgba(255,255,255,0.3)",
                            border: `1px solid ${status === "READY" ? `${C.teal}30` : status === "LOCKED" ? `${C.danger}30` : "rgba(255,255,255,0.1)"}`,
                            background: status === "READY" ? `${C.teal}08` : "transparent",
                          }}
                        >
                          {status}
                        </span>
                      </div>
                    </div>

                    <h3
                      className="mb-2 text-sm font-bold text-white uppercase tracking-wide group-hover:text-[#00FFCC] transition-colors"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      {t(`howItWorks.${step}.title`)}
                    </h3>
                    <p className="text-xs leading-relaxed mb-4" style={{ color: "rgba(255,255,255,0.3)" }}>
                      {t(`howItWorks.${step}.description`)}
                    </p>

                    {/* Reward badge */}
                    <div
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[9px] font-bold"
                      style={{
                        fontFamily: "var(--font-mono)",
                        color: C.amber,
                        background: `${C.amber}08`,
                        border: `1px solid ${C.amber}25`,
                        clipPath: CHAMFER_SM,
                      }}
                    >
                      <Zap style={{ width: "10px", height: "10px" }} />
                      {reward}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          LEARNING PATHS
      ═══════════════════════════════════════ */}
      <section className="py-20" style={{ borderBottom: `1px solid ${C.teal}10` }}>
        <div className="mx-auto max-w-7xl px-4">
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="mb-12">
            <motion.p variants={fadeUp} className="text-[10px] uppercase tracking-[0.25em] mb-3" style={{ fontFamily: "var(--font-mono)", color: C.teal }}>
              ◇ SKILL TREES ◇
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="uppercase tracking-tight"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
                fontWeight: 900,
                color: "white",
              }}
            >
              {tPaths("title")}
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-2 text-sm uppercase tracking-wide" style={{ color: "rgba(255,255,255,0.3)", fontFamily: "var(--font-mono)" }}>
              {tPaths("subtitle")}
            </motion.p>
          </motion.div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {([
              { key: "solanaFundamentals" as const, icon: Layers, track: "solana-fundamentals", comingSoon: false, xp: "1,000", badge: "BUILDER", accent: C.teal },
              { key: "defiDevelopment" as const, icon: Zap, track: "defi-development", comingSoon: true, xp: "2,500", badge: "DEFI MASTER", accent: C.amber },
              { key: "nftGaming" as const, icon: ImageIcon, track: "nft-gaming", comingSoon: true, xp: "2,000", badge: "CREATOR", accent: C.purple },
              { key: "advancedProtocol" as const, icon: Cpu, track: "advanced-protocol", comingSoon: true, xp: "5,000", badge: "CORE DEV", accent: C.blue },
            ] as const).map(({ key, icon: PathIcon, track, comingSoon, xp, badge, accent }, idx) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
              >
                <Link href={comingSoon ? "#" : `/courses?track=${track}`}>
                  <div
                    className="group h-full p-6 flex flex-col transition-all duration-300 relative"
                    style={{
                      background: comingSoon ? `${C.bg}90` : C.bg,
                      border: `1px solid ${comingSoon ? "rgba(255,255,255,0.06)" : `${accent}20`}`,
                      opacity: comingSoon ? 0.6 : 1,
                      clipPath: CHAMFER,
                    }}
                    onMouseEnter={e => {
                      if (!comingSoon) {
                        (e.currentTarget as HTMLDivElement).style.borderColor = `${accent}50`;
                        (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 0 1px ${accent}20, 0 0 30px ${accent}08`;
                      }
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLDivElement).style.borderColor = comingSoon ? "rgba(255,255,255,0.06)" : `${accent}20`;
                      (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                    }}
                  >
                    <CornerBrackets color={comingSoon ? "rgba(255,255,255,0.05)" : `${accent}25`} size={10} />

                    <div className="flex items-start justify-between mb-4">
                      <div
                        className="flex h-10 w-10 items-center justify-center"
                        style={{ border: `1px solid ${accent}25`, background: `${accent}08`, color: accent, clipPath: CHAMFER_SM }}
                      >
                        <PathIcon style={{ width: "16px", height: "16px" }} />
                      </div>
                      {!comingSoon ? (
                        <div className="flex items-center gap-1 px-2 py-0.5" style={{ fontFamily: "var(--font-mono)", fontSize: "9px", color: C.teal, background: `${C.teal}08`, border: `1px solid ${C.teal}20` }}>
                          <Flame style={{ width: "10px", height: "10px" }} />
                          LIVE
                        </div>
                      ) : (
                        <span
                          className="px-2 py-0.5 text-[9px] uppercase tracking-wider"
                          style={{ fontFamily: "var(--font-mono)", color: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.08)" }}
                        >
                          {tPaths("comingSoon")}
                        </span>
                      )}
                    </div>

                    <h3 className="mb-1.5 text-sm font-bold text-white uppercase tracking-wide" style={{ fontFamily: "var(--font-mono)" }}>
                      {tPaths(`paths.${key}.title`)}
                    </h3>
                    <p className="flex-1 text-xs leading-relaxed mb-4" style={{ color: "rgba(255,255,255,0.3)" }}>
                      {tPaths(`paths.${key}.description`)}
                    </p>

                    <div className="flex items-center justify-between pt-3" style={{ borderTop: `1px solid ${accent}12` }}>
                      <div>
                        <div className="text-xs font-black" style={{ fontFamily: "var(--font-mono)", color: accent }}>{xp} XP</div>
                        <div style={{ fontFamily: "var(--font-mono)", fontSize: "8px", color: "rgba(255,255,255,0.2)", letterSpacing: "0.1em" }}>{badge} BADGE</div>
                      </div>
                      {!comingSoon && (
                        <ArrowRight
                          style={{ width: "14px", height: "14px", color: `${accent}40`, transition: "all 0.2s" }}
                          className="group-hover:translate-x-1 transition-all"
                        />
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          FEATURED COURSES
      ═══════════════════════════════════════ */}
      {featuredCourses.length > 0 && (
        <section className="py-20" style={{ background: C.bgPanel, borderBottom: `1px solid ${C.teal}10` }}>
          <div className="mx-auto max-w-7xl px-4">
            <div className="mb-10">
              <p className="text-[10px] uppercase tracking-[0.25em] mb-3" style={{ fontFamily: "var(--font-mono)", color: C.teal }}>
                ◇ AVAILABLE MISSIONS ◇
              </p>
              <h2
                className="uppercase tracking-tight"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
                  fontWeight: 900,
                  color: "white",
                }}
              >
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
                <button
                  className="px-5 py-2.5 text-[10px] uppercase tracking-[0.15em] font-bold transition-all duration-300"
                  style={{
                    fontFamily: "var(--font-mono)",
                    color: C.teal,
                    background: "transparent",
                    border: `1px solid ${C.teal}30`,
                    clipPath: CHAMFER_SM,
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = `${C.teal}60`;
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 0 20px ${C.teal}15`;
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = `${C.teal}30`;
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
                  }}
                >
                  {t("featuredCourses.viewAll")}
                  <ArrowRight className="inline-block ml-2 h-3 w-3" />
                </button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════
          PARTNERS
      ═══════════════════════════════════════ */}
      <section className="py-12" style={{ borderBottom: `1px solid ${C.teal}10` }}>
        <div className="mx-auto max-w-7xl px-4">
          <p
            className="mb-6 text-center text-[9px] uppercase tracking-[0.2em]"
            style={{ fontFamily: "var(--font-mono)", color: "rgba(255,255,255,0.18)" }}
          >
            {t("partners.title")}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {[
              { name: "SOLANA", accent: C.teal },
              { name: "METAPLEX", accent: C.teal },
              { name: "HELIUS", accent: "#F97316" },
              { name: "SUPERTEAM", accent: C.purple },
              { name: "ANCHOR", accent: C.blue },
            ].map(({ name, accent }) => (
              <div
                key={name}
                className="px-5 py-2.5 cursor-default transition-all duration-300"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "10px",
                  letterSpacing: "0.12em",
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.25)",
                  background: `${accent}06`,
                  border: `1px solid ${accent}15`,
                  clipPath: CHAMFER_SM,
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.color = accent;
                  (e.currentTarget as HTMLDivElement).style.borderColor = `${accent}40`;
                  (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 20px ${accent}10`;
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.color = "rgba(255,255,255,0.25)";
                  (e.currentTarget as HTMLDivElement).style.borderColor = `${accent}15`;
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                }}
              >
                {name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          FINAL CTA
      ═══════════════════════════════════════ */}
      <section className="py-28 relative overflow-hidden">
        {/* Background hex grid pattern */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, ${C.teal}06 0%, transparent 60%)`,
          }}
        />

        <div className="mx-auto max-w-4xl px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <p
              className="text-[10px] uppercase tracking-[0.25em]"
              style={{ fontFamily: "var(--font-mono)", color: C.amber }}
            >
              ◇ INITIALIZE PROTOCOL ◇
            </p>

            {/* Glitch CTA heading */}
            <div className="relative inline-block">
              <h2
                className="relative uppercase leading-[0.88]"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "clamp(2rem, 5vw, 4.5rem)",
                  fontWeight: 900,
                }}
              >
                <span
                  className="absolute inset-0 pointer-events-none select-none"
                  aria-hidden="true"
                  style={{ color: "#FF4444", animation: "glitch-shift 5s ease-in-out infinite" }}
                >
                  START BUILDING<br />ON SOLANA<br />TODAY.
                </span>
                <span
                  className="absolute inset-0 pointer-events-none select-none"
                  aria-hidden="true"
                  style={{ color: C.teal, animation: "glitch-shift 5s ease-in-out infinite reverse" }}
                >
                  START BUILDING<br />ON SOLANA<br />TODAY.
                </span>
                <span className="relative z-[2] text-white">START BUILDING</span><br />
                <span className="relative z-[2]" style={{ color: C.teal }}>ON SOLANA</span><br />
                <span className="relative z-[2]" style={{ color: "rgba(255,255,255,0.25)" }}>TODAY.</span>
              </h2>
            </div>

            <p className="text-sm mx-auto max-w-sm uppercase tracking-wide" style={{ color: "rgba(255,255,255,0.3)", fontFamily: "var(--font-mono)" }}>
              Join 500+ developers. Free to start. Real on-chain credentials.
            </p>

            <div className="flex items-center justify-center gap-3 pt-2">
              <div style={{ clipPath: CHAMFER_SM }}>
                <StartLearningButton />
              </div>
            </div>

            {/* Bottom decorative line */}
            <div className="mx-auto mt-10 w-48 h-px" style={{ background: `linear-gradient(90deg, transparent, ${C.teal}30, transparent)` }} />
          </motion.div>
        </div>
      </section>

    </div>
  );
}
