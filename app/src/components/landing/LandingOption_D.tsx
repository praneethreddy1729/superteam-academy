"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import {
  ArrowRight, Shield, Zap, Trophy, GraduationCap, BookOpen, UserPlus, Award,
  CheckCircle, Layers, ImageIcon, Cpu, Flame, Terminal, Code2, Rocket,
  GitBranch, Play, ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StartLearningButton } from "@/components/landing/StartLearningButton";
import type { SanityCourse } from "@/lib/sanity/queries";
import { CourseCard, CourseCardData } from "@/components/courses/CourseCard";
import { motion, Variants, useMotionValue, useTransform, animate } from "framer-motion";
import { useState, useEffect, useRef } from "react";

/* ═══════════════════════════════════════════════════════════
   OPTION D — "THE SYNTHESIS"

   Design Direction: "Journey Map + Live Code"
   - Hero IS the product: a skill-tree constellation + live terminal
   - Duolingo's gamified path meets Scrimba's code-first approach
   - Social proof via live ticker (from current design)
   - Swiss typography discipline (from Option B)
   - Dark, premium, dev-native aesthetic

   Innovation: Interactive constellation skill-tree in hero
   that pulses with real activity. No other platform has this.
   ═══════════════════════════════════════════════════════════ */

/* ── Design Tokens ── */
const T = {
  bg:       "#050810",
  surface:  "#0A0E18",
  surface2: "#0E1220",
  green:    "#14F195",
  purple:   "#9945FF",
  amber:    "#FFB800",
  blue:     "#00C2FF",
  red:      "#FF4D6A",
  white:    "#FFFFFF",
  text:     "rgba(255,255,255,0.55)",
  dim:      "rgba(255,255,255,0.25)",
  faint:    "rgba(255,255,255,0.08)",
} as const;

const MONO: React.CSSProperties = { fontFamily: "var(--font-mono)" };

/* ── Animation Variants ── */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 240, damping: 28 } },
};

const stagger: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  show: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 200, damping: 24 } },
};

/* ── Ticker Data ── */
const TICKER_ITEMS = [
  { wallet: "7fXk...9mRq", action: "completed", lesson: "PDAs & CPIs", xp: "+150 XP", type: "xp" as const },
  { wallet: "B3nN...4pLw", action: "earned", lesson: "Solana Fundamentals", xp: "NFT Minted", type: "nft" as const },
  { wallet: "Qr2T...8sVx", action: "completed", lesson: "Account Model", xp: "+75 XP", type: "xp" as const },
  { wallet: "mK9J...3zPq", action: "enrolled", lesson: "Anchor Framework", xp: "+10 XP", type: "xp" as const },
  { wallet: "5wLc...7nBr", action: "completed", lesson: "Token-2022", xp: "+100 XP", type: "xp" as const },
  { wallet: "xHd8...2kFm", action: "completed", lesson: "DeFi Basics", xp: "+125 XP", type: "xp" as const },
  { wallet: "Pn6Y...1vQs", action: "earned", lesson: "DeFi Developer", xp: "NFT Minted", type: "nft" as const },
  { wallet: "9cRj...5tWe", action: "shipped", lesson: "Hello World", xp: "+125 XP", type: "xp" as const },
];

/* ── Skill Tree Node Data ── */
const SKILL_NODES = [
  { id: "start",   x: 50,  y: 240, label: "Start",           done: true,  active: false, accent: T.green },
  { id: "wallet",  x: 120, y: 180, label: "Wallet Setup",     done: true,  active: false, accent: T.green },
  { id: "account", x: 200, y: 140, label: "Account Model",    done: true,  active: false, accent: T.green },
  { id: "token",   x: 290, y: 100, label: "Token-2022",       done: false, active: true,  accent: T.amber },
  { id: "pda",     x: 370, y: 150, label: "PDAs",             done: false, active: false, accent: T.dim },
  { id: "anchor",  x: 340, y: 230, label: "Anchor",           done: false, active: false, accent: T.dim },
  { id: "cpi",     x: 430, y: 100, label: "CPIs",             done: false, active: false, accent: T.dim },
  { id: "defi",    x: 440, y: 200, label: "DeFi",             done: false, active: false, accent: T.purple },
  { id: "nft",     x: 380, y: 300, label: "NFTs",             done: false, active: false, accent: T.purple },
];

const SKILL_EDGES: [string, string][] = [
  ["start", "wallet"], ["wallet", "account"], ["account", "token"],
  ["token", "pda"], ["token", "anchor"], ["pda", "cpi"],
  ["anchor", "defi"], ["anchor", "nft"],
];

/* ── Constellation Skill Tree (SVG) ── */
function SkillConstellation() {
  const nodeMap = Object.fromEntries(SKILL_NODES.map(n => [n.id, n]));

  return (
    <div className="relative w-full" style={{ maxWidth: 500, aspectRatio: "5/3.5" }}>
      {/* Ambient glow behind */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 55% 40%, ${T.green}08 0%, transparent 60%), radial-gradient(ellipse at 80% 60%, ${T.purple}06 0%, transparent 50%)`,
        }}
      />

      <svg viewBox="0 0 500 350" className="w-full h-full" style={{ filter: "drop-shadow(0 0 20px rgba(20,241,149,0.05))" }}>
        <defs>
          <filter id="node-glow">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="edge-glow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <style>{`
            @keyframes pulse-node { 0%,100%{opacity:0.6} 50%{opacity:1} }
            @keyframes orbit { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
          `}</style>
        </defs>

        {/* Edges */}
        {SKILL_EDGES.map(([fromId, toId]) => {
          const from = nodeMap[fromId];
          const to = nodeMap[toId];
          if (!from || !to) return null;
          const isComplete = from.done && to.done;
          const isNext = from.done && !to.done;
          return (
            <line
              key={`${fromId}-${toId}`}
              x1={from.x} y1={from.y} x2={to.x} y2={to.y}
              stroke={isComplete ? T.green : isNext ? T.amber : "rgba(255,255,255,0.06)"}
              strokeWidth={isComplete ? 1.5 : 1}
              strokeDasharray={isNext ? "4 4" : isComplete ? "none" : "2 6"}
              opacity={isComplete ? 0.5 : isNext ? 0.4 : 0.3}
              filter={isComplete ? "url(#edge-glow)" : undefined}
            />
          );
        })}

        {/* Nodes */}
        {SKILL_NODES.map(node => {
          const r = node.active ? 18 : node.done ? 14 : 10;
          return (
            <g key={node.id}>
              {/* Outer ring for active */}
              {node.active && (
                <circle
                  cx={node.x} cy={node.y} r={24}
                  fill="none"
                  stroke={T.amber}
                  strokeWidth={1}
                  opacity={0.3}
                  style={{ animation: "pulse-node 2s ease-in-out infinite" }}
                />
              )}

              {/* Node circle */}
              <circle
                cx={node.x} cy={node.y} r={r}
                fill={node.done ? `${T.green}15` : node.active ? `${T.amber}12` : `${T.white}05`}
                stroke={node.done ? T.green : node.active ? T.amber : "rgba(255,255,255,0.1)"}
                strokeWidth={node.active ? 2 : 1}
                filter={node.done || node.active ? "url(#node-glow)" : undefined}
              />

              {/* Check or play icon placeholder */}
              {node.done && (
                <text
                  x={node.x} y={node.y + 1}
                  textAnchor="middle" dominantBaseline="central"
                  fill={T.green} fontSize={10} fontFamily="var(--font-mono)"
                >
                  &#10003;
                </text>
              )}
              {node.active && (
                <polygon
                  points={`${node.x - 3},${node.y - 5} ${node.x - 3},${node.y + 5} ${node.x + 5},${node.y}`}
                  fill={T.amber}
                  opacity={0.8}
                />
              )}

              {/* Label */}
              <text
                x={node.x} y={node.y + r + 14}
                textAnchor="middle"
                fill={node.done ? "rgba(255,255,255,0.5)" : node.active ? T.amber : "rgba(255,255,255,0.2)"}
                fontSize={9}
                fontFamily="var(--font-mono)"
                fontWeight={node.active ? 600 : 400}
              >
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* ── Animated Counter ── */
function AnimatedNumber({ target, suffix = "" }: { target: number; suffix?: string }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, v => Math.round(v).toLocaleString());
  const [display, setDisplay] = useState("0");
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const unsub = rounded.on("change", v => setDisplay(v));
    return unsub;
  }, [rounded]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          animate(count, target, { duration: 1.8, ease: "easeOut" });
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [count, target]);

  return <span ref={ref}>{display}{suffix}</span>;
}

/* ── Typing Code Line Animation ── */
function TypedCode() {
  const lines = [
    { text: "use anchor_lang::prelude::*;", delay: 0 },
    { text: "", delay: 0.3 },
    { text: '#[program]', delay: 0.5 },
    { text: "pub mod academy {", delay: 0.8 },
    { text: "  pub fn enroll(ctx: Context<Enroll>) -> Result<()> {", delay: 1.2 },
    { text: '    msg!("Welcome to Solana!");', delay: 1.8 },
    { text: "    Ok(())", delay: 2.3 },
    { text: "  }", delay: 2.6 },
    { text: "}", delay: 2.8 },
  ];

  const colors: Record<string, string> = {
    "use": "#C792EA", "pub": "#C792EA", "mod": "#C792EA", "fn": "#C792EA",
    "anchor_lang": "#14F195", "academy": "#82AAFF", "enroll": "#FFB800",
    "ctx:": T.text, "Context": "#82AAFF", "Enroll": "#82AAFF",
    "Result": "#82AAFF", "Ok": "#14F195", "msg!": "#FFB800",
    "#[program]": "#C792EA", "prelude": "#14F195",
  };

  function colorize(text: string) {
    let result = text;
    for (const [keyword, color] of Object.entries(colors)) {
      if (text.includes(keyword)) {
        result = text;
        return <span>{text.split(new RegExp(`(${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`)).map((part, i) =>
          colors[part] ? <span key={i} style={{ color: colors[part] }}>{part}</span> : <span key={i} style={{ color: T.text }}>{part}</span>
        )}</span>;
      }
    }
    return <span style={{ color: T.text }}>{result}</span>;
  }

  return (
    <div style={{ ...MONO, fontSize: "11px", lineHeight: 1.8 }}>
      {lines.map((line, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: line.delay, duration: 0.3 }}
          className="flex items-start gap-4"
        >
          <span className="select-none shrink-0 w-4 text-right" style={{ color: T.dim, fontSize: "10px" }}>
            {i + 1}
          </span>
          {line.text ? colorize(line.text) : <span>&nbsp;</span>}
        </motion.div>
      ))}
      {/* Blinking cursor on last line */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3 }}
        className="flex items-start gap-4"
      >
        <span className="select-none shrink-0 w-4 text-right" style={{ color: T.dim, fontSize: "10px" }}>10</span>
        <span className="inline-block w-[7px] h-[14px] animate-pulse" style={{ background: T.green, opacity: 0.7 }} />
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════ */
export function LandingContent({ featuredCourses }: { featuredCourses: SanityCourse[] }) {
  const t = useTranslations("landing");
  const tPaths = useTranslations("learningPaths");
  const [liveCount] = useState(27);

  return (
    <div className="flex flex-col" style={{ background: T.bg }}>

      {/* Inject keyframe for ticker */}
      <style>{`
        @keyframes ticker-scroll { from { transform: translateX(0); } to { transform: translateX(-33.333%); } }
        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
      `}</style>

      {/* ═══════════════════════════════════════
          HERO — Skill Constellation + Code Terminal
      ═══════════════════════════════════════ */}
      <section className="relative flex flex-col justify-center overflow-hidden" style={{ minHeight: "min(88vh, 860px)" }}>
        {/* Subtle grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              `linear-gradient(${T.green}04 1px, transparent 1px), linear-gradient(90deg, ${T.green}04 1px, transparent 1px)`,
            backgroundSize: "80px 80px",
          }}
        />
        {/* Gradient overlay to fade grid at edges */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 50% 50%, transparent 30%, ${T.bg} 80%)`,
          }}
        />

        <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 pt-12 pb-8">
          {/* Top bar — status line */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-between mb-8 pb-4"
            style={{ borderBottom: `1px solid ${T.faint}` }}
          >
            <div className="flex items-center gap-3" style={MONO}>
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" style={{ background: T.green }} />
                <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: T.green }} />
              </span>
              <span className="text-[10px] uppercase tracking-[0.15em]" style={{ color: T.green }}>
                {liveCount} builders active on devnet
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-4" style={{ ...MONO, fontSize: "10px", color: T.dim }}>
              <span>v1.0.0</span>
              <span style={{ color: T.faint }}>|</span>
              <span>Solana Mainnet</span>
            </div>
          </motion.div>

          <div className="grid items-center gap-10 lg:grid-cols-[1fr_480px]">

            {/* ── Left: Hero Copy ── */}
            <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
              {/* Eyebrow */}
              <motion.div variants={fadeUp} className="flex items-center gap-2">
                <div
                  className="px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] font-semibold"
                  style={{ ...MONO, background: `${T.green}12`, border: `1px solid ${T.green}25`, color: T.green }}
                >
                  Free &amp; Open Source
                </div>
                <div
                  className="px-2.5 py-1 text-[10px] uppercase tracking-[0.12em]"
                  style={{ ...MONO, background: `${T.purple}10`, border: `1px solid ${T.purple}20`, color: T.purple }}
                >
                  On-Chain Credentials
                </div>
              </motion.div>

              {/* Headline — large, high contrast, stacked */}
              <motion.div variants={fadeUp}>
                <h1
                  className="leading-[0.95] tracking-tight"
                  style={{
                    ...MONO,
                    fontSize: "clamp(2.6rem, 5.5vw, 4.8rem)",
                    fontWeight: 900,
                  }}
                >
                  <span className="block" style={{ color: T.white }}>Build on</span>
                  <span className="block" style={{
                    background: `linear-gradient(135deg, ${T.green}, ${T.blue})`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}>
                    Solana.
                  </span>
                  <span className="block" style={{ color: "rgba(255,255,255,0.2)" }}>Earn on-chain.</span>
                </h1>
              </motion.div>

              {/* Subheadline */}
              <motion.p variants={fadeUp} className="max-w-md text-sm leading-relaxed" style={{ ...MONO, color: T.text }}>
                {t("hero.subtitle")}
              </motion.p>

              {/* CTA buttons */}
              <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-3 pt-1">
                <StartLearningButton />
                <Link href="/courses">
                  <Button
                    variant="ghost"
                    size="lg"
                    className="gap-2 text-sm rounded-none group"
                    style={{
                      ...MONO,
                      border: `1px solid rgba(255,255,255,0.1)`,
                      color: "rgba(255,255,255,0.5)",
                    }}
                  >
                    {t("cta.button")}
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </Button>
                </Link>
              </motion.div>

              {/* Micro stats row */}
              <motion.div variants={fadeUp} className="flex items-center gap-6 pt-2">
                {[
                  { value: t("stats.coursesValue"), label: t("stats.courses") },
                  { value: t("stats.lessonsValue"), label: t("stats.lessons") },
                  { value: t("stats.challengesValue"), label: t("stats.challenges") },
                ].map(({ value, label }) => (
                  <div key={label} className="flex items-baseline gap-1.5" style={MONO}>
                    <span className="text-base font-bold tabular-nums" style={{ color: T.white }}>{value}</span>
                    <span className="text-[9px] uppercase tracking-widest" style={{ color: T.dim }}>{label}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* ── Right: Interactive Skill Tree + Terminal Stack ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7, type: "spring" }}
              className="hidden lg:flex flex-col gap-3"
            >
              {/* Skill Constellation */}
              <div
                className="relative p-4"
                style={{
                  background: T.surface,
                  border: `1px solid ${T.faint}`,
                }}
              >
                <div
                  className="flex items-center justify-between mb-2 pb-2"
                  style={{ borderBottom: `1px solid ${T.faint}` }}
                >
                  <div className="flex items-center gap-2" style={{ ...MONO, fontSize: "10px", color: T.dim }}>
                    <GitBranch style={{ width: 11, height: 11 }} />
                    <span style={{ color: T.text }}>Your Skill Tree</span>
                    <span style={{ color: T.dim }}>3/9 complete</span>
                  </div>
                  <div className="flex items-center gap-1.5" style={{ ...MONO, fontSize: "9px" }}>
                    <Flame style={{ width: 10, height: 10, color: T.amber }} />
                    <span style={{ color: T.amber }}>7 day streak</span>
                  </div>
                </div>
                <SkillConstellation />
              </div>

              {/* Mini terminal */}
              <div
                style={{
                  background: T.surface,
                  border: `1px solid ${T.faint}`,
                }}
              >
                {/* Terminal bar */}
                <div
                  className="flex items-center justify-between px-3 py-2"
                  style={{ borderBottom: `1px solid ${T.faint}`, background: T.surface2 }}
                >
                  <div className="flex items-center gap-1.5">
                    <div className="h-2 w-2 rounded-full" style={{ background: "#FF5F57" }} />
                    <div className="h-2 w-2 rounded-full" style={{ background: "#FEBC2E" }} />
                    <div className="h-2 w-2 rounded-full" style={{ background: "#28C840" }} />
                  </div>
                  <span style={{ ...MONO, fontSize: "9px", color: T.dim }}>lesson.rs</span>
                  <div className="flex items-center gap-1" style={{ ...MONO, fontSize: "9px", color: T.green, opacity: 0.5 }}>
                    <Terminal style={{ width: 9, height: 9 }} />
                    devnet
                  </div>
                </div>
                {/* Code body */}
                <div className="p-4" style={{ background: "#070A12" }}>
                  <TypedCode />
                </div>
                {/* Status footer */}
                <div
                  className="flex items-center justify-between px-3 py-1.5"
                  style={{ borderTop: `1px solid ${T.faint}`, background: T.surface2 }}
                >
                  <div className="flex items-center gap-1.5" style={{ ...MONO, fontSize: "9px" }}>
                    <Zap style={{ width: 9, height: 9, color: T.amber }} />
                    <span style={{ color: T.amber, fontWeight: 600 }}>+150 XP</span>
                    <span style={{ color: T.dim }}>on completion</span>
                  </div>
                  <div className="flex items-center gap-1" style={{ ...MONO, fontSize: "9px", color: T.green }}>
                    <Play style={{ width: 8, height: 8, fill: T.green }} />
                    Run Tests
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          LIVE TICKER
      ═══════════════════════════════════════ */}
      <div
        className="overflow-hidden"
        style={{ background: "#030508", borderTop: `1px solid ${T.faint}`, borderBottom: `1px solid ${T.faint}` }}
      >
        <div className="flex items-stretch">
          <div
            className="shrink-0 flex items-center gap-2 px-5 py-2 z-10"
            style={{ ...MONO, fontSize: "10px", borderRight: `1px solid ${T.faint}`, background: "#030508" }}
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full" style={{ background: T.green, opacity: 0.6 }} />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ background: T.green }} />
            </span>
            <span style={{ color: T.green, textTransform: "uppercase", letterSpacing: "0.12em" }}>Live Feed</span>
          </div>
          <div className="overflow-hidden relative flex-1">
            <div className="flex" style={{ animation: "ticker-scroll 45s linear infinite", width: "max-content" }}>
              {[...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 px-5 py-2 shrink-0"
                  style={{ ...MONO, fontSize: "10px", borderRight: `1px solid rgba(255,255,255,0.03)` }}
                >
                  <span className="h-1 w-1 rounded-full shrink-0" style={{ background: item.type === "nft" ? T.purple : T.green }} />
                  <span style={{ color: T.dim }}>{item.wallet}</span>
                  <span style={{ color: "rgba(255,255,255,0.18)" }}>{item.action}</span>
                  <span style={{ color: T.text }}>{item.lesson}</span>
                  <span style={{ color: item.type === "nft" ? T.purple : T.amber, fontWeight: 600 }}>{item.xp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════
          STATS — Animated Numbers
      ═══════════════════════════════════════ */}
      <section className="py-16" style={{ borderBottom: `1px solid ${T.faint}` }}>
        <div className="mx-auto max-w-7xl px-4">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-px"
            style={{ background: T.faint }}
          >
            {[
              { target: 500, suffix: "+", label: "Active Learners", accent: T.green },
              { target: 47, suffix: "", label: "Lessons Available", accent: T.blue },
              { target: 1200, suffix: "+", label: "XP Distributed", accent: T.amber },
              { target: 89, suffix: "", label: "Credentials Minted", accent: T.purple },
            ].map(({ target, suffix, label, accent }) => (
              <motion.div
                key={label}
                variants={fadeUp}
                className="flex flex-col items-center justify-center py-8 px-4"
                style={{ background: T.bg }}
              >
                <div className="text-3xl sm:text-4xl font-black tabular-nums" style={{ ...MONO, color: accent }}>
                  <AnimatedNumber target={target} suffix={suffix} />
                </div>
                <div className="text-[10px] uppercase tracking-[0.15em] mt-1.5" style={{ ...MONO, color: T.dim }}>
                  {label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          FEATURES — Bento Grid Layout
      ═══════════════════════════════════════ */}
      <section className="py-20" style={{ borderBottom: `1px solid ${T.faint}` }}>
        <div className="mx-auto max-w-7xl px-4">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="mb-12"
          >
            <motion.div variants={fadeUp} className="flex items-center gap-3 mb-4">
              <div className="h-px flex-1 max-w-[40px]" style={{ background: T.green }} />
              <span className="text-[10px] uppercase tracking-[0.2em]" style={{ ...MONO, color: T.green }}>Why Superteam Academy</span>
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-bold text-white">
              {t("features.title")}
            </motion.h2>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px"
            style={{ background: T.faint }}
          >
            {[
              { icon: Shield,        key: "onChain" as const,        accent: T.green,  tag: "CORE" },
              { icon: Zap,           key: "soulboundXP" as const,    accent: T.amber,  tag: "TOKEN-2022" },
              { icon: Trophy,        key: "nftCredentials" as const, accent: T.purple,  tag: "METAPLEX" },
              { icon: GraduationCap, key: "openSource" as const,     accent: T.blue,    tag: "OSS" },
            ].map(({ icon: Icon, key, accent, tag }) => (
              <motion.div
                key={key}
                variants={scaleIn}
                className="group relative p-6 cursor-default transition-all duration-300"
                style={{ background: T.bg }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.background = T.surface;
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.background = T.bg;
                }}
              >
                {/* Tech tag */}
                <span
                  className="absolute top-4 right-4 text-[8px] tracking-[0.12em] px-1.5 py-0.5"
                  style={{ ...MONO, border: `1px solid ${accent}20`, color: `${accent}80`, background: `${accent}08` }}
                >
                  {tag}
                </span>

                <div
                  className="mb-5 inline-flex h-10 w-10 items-center justify-center transition-transform duration-300 group-hover:scale-110"
                  style={{
                    border: `1px solid ${accent}25`,
                    background: `${accent}08`,
                    color: accent,
                  }}
                >
                  <Icon style={{ width: 18, height: 18 }} />
                </div>
                <h3 className="mb-2 text-sm font-bold text-white" style={MONO}>
                  {t(`features.${key}.title`)}
                </h3>
                <p className="text-xs leading-relaxed" style={{ color: T.text }}>
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
          HOW IT WORKS — Journey Steps
      ═══════════════════════════════════════ */}
      <section className="py-20" style={{ background: T.surface, borderBottom: `1px solid ${T.faint}` }}>
        <div className="mx-auto max-w-7xl px-4">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mb-12"
          >
            <motion.div variants={fadeUp} className="flex items-center gap-3 mb-4">
              <div className="h-px flex-1 max-w-[40px]" style={{ background: T.green }} />
              <span className="text-[10px] uppercase tracking-[0.2em]" style={{ ...MONO, color: T.green }}>Your Journey</span>
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-bold text-white">
              {t("howItWorks.title")}
            </motion.h2>
          </motion.div>

          {/* Steps as a connected pipeline */}
          <div className="relative">
            {/* Connector line */}
            <div
              className="absolute left-0 right-0 top-[52px] hidden h-px lg:block"
              style={{ background: `linear-gradient(90deg, transparent, ${T.green}20 15%, ${T.green}20 85%, transparent)` }}
            />

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {([
                { step: "step1" as const, icon: UserPlus,    reward: "+10 XP",      num: "01", accent: T.green },
                { step: "step2" as const, icon: BookOpen,    reward: "Unlock Paths", num: "02", accent: T.blue },
                { step: "step3" as const, icon: CheckCircle, reward: "+500 XP",      num: "03", accent: T.amber },
                { step: "step4" as const, icon: Award,       reward: "NFT Mint",     num: "04", accent: T.purple },
              ] as const).map(({ step, icon: StepIcon, reward, num, accent }, idx) => (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="group relative"
                >
                  <div
                    className="h-full p-6 transition-all duration-300"
                    style={{
                      background: T.bg,
                      border: `1px solid ${T.faint}`,
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLDivElement).style.borderColor = `${accent}30`;
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLDivElement).style.borderColor = T.faint;
                    }}
                  >
                    {/* Step number */}
                    <div
                      className="absolute -top-3 left-5 px-2"
                      style={{ ...MONO, fontSize: "10px", color: accent, background: T.surface, fontWeight: 700 }}
                    >
                      {num}
                    </div>

                    <div className="flex items-center gap-3 mb-4 mt-1">
                      <div
                        className="flex h-10 w-10 items-center justify-center shrink-0"
                        style={{ border: `1px solid ${accent}25`, background: `${accent}08`, color: accent }}
                      >
                        <StepIcon style={{ width: 16, height: 16 }} />
                      </div>
                      <span
                        className="px-2 py-0.5 text-[9px] font-semibold"
                        style={{
                          ...MONO,
                          border: `1px solid ${T.amber}25`,
                          background: `${T.amber}08`,
                          color: T.amber,
                        }}
                      >
                        {reward}
                      </span>
                    </div>

                    <h3
                      className="mb-2 text-sm font-bold text-white transition-colors duration-200"
                      style={MONO}
                    >
                      {t(`howItWorks.${step}.title`)}
                    </h3>
                    <p className="text-xs leading-relaxed" style={{ color: T.text }}>
                      {t(`howItWorks.${step}.description`)}
                    </p>

                    {/* Arrow indicator */}
                    {idx < 3 && (
                      <ChevronRight
                        className="absolute -right-2.5 top-1/2 -translate-y-1/2 hidden lg:block z-10"
                        style={{ width: 14, height: 14, color: T.dim }}
                      />
                    )}
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
      <section className="py-20" style={{ borderBottom: `1px solid ${T.faint}` }}>
        <div className="mx-auto max-w-7xl px-4">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mb-12"
          >
            <motion.div variants={fadeUp} className="flex items-center gap-3 mb-4">
              <div className="h-px flex-1 max-w-[40px]" style={{ background: T.green }} />
              <span className="text-[10px] uppercase tracking-[0.2em]" style={{ ...MONO, color: T.green }}>Tracks</span>
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-bold text-white">
              {tPaths("title")}
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-3 text-sm max-w-md" style={{ ...MONO, color: T.text }}>
              {tPaths("subtitle")}
            </motion.p>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {([
              { key: "solanaFundamentals" as const, icon: Layers,    track: "solana-fundamentals", comingSoon: false, xp: "1,000", badge: "Builder",    accent: T.green },
              { key: "defiDevelopment" as const,    icon: Zap,       track: "defi-development",    comingSoon: true,  xp: "2,500", badge: "DeFi Master", accent: T.amber },
              { key: "nftGaming" as const,          icon: ImageIcon, track: "nft-gaming",           comingSoon: true,  xp: "2,000", badge: "Creator",     accent: T.purple },
              { key: "advancedProtocol" as const,   icon: Cpu,       track: "advanced-protocol",    comingSoon: true,  xp: "5,000", badge: "Core Dev",    accent: T.blue },
            ] as const).map(({ key, icon: PathIcon, track, comingSoon, xp, badge, accent }, idx) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
              >
                <Link href={comingSoon ? "#" : `/courses?track=${track}`}>
                  <div
                    className="group h-full p-6 flex flex-col transition-all duration-300"
                    style={{
                      background: comingSoon ? `${T.surface}80` : T.bg,
                      border: `1px solid ${T.faint}`,
                      opacity: comingSoon ? 0.6 : 1,
                    }}
                    onMouseEnter={e => {
                      if (!comingSoon) (e.currentTarget as HTMLDivElement).style.borderColor = `${accent}30`;
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLDivElement).style.borderColor = T.faint;
                    }}
                  >
                    <div className="flex items-start justify-between mb-5">
                      <div
                        className="flex h-10 w-10 items-center justify-center"
                        style={{ border: `1px solid ${accent}20`, background: `${accent}08`, color: accent }}
                      >
                        <PathIcon style={{ width: 16, height: 16 }} />
                      </div>
                      {!comingSoon ? (
                        <div className="flex items-center gap-1" style={{ ...MONO, fontSize: "9px", color: T.green }}>
                          <Flame style={{ width: 10, height: 10 }} />
                          LIVE
                        </div>
                      ) : (
                        <span
                          className="text-[9px] px-2 py-0.5"
                          style={{ ...MONO, border: `1px solid ${T.faint}`, color: T.dim }}
                        >
                          {tPaths("comingSoon")}
                        </span>
                      )}
                    </div>

                    <h3 className="mb-1.5 text-sm font-bold text-white" style={MONO}>
                      {tPaths(`paths.${key}.title`)}
                    </h3>
                    <p className="flex-1 text-xs leading-relaxed mb-5" style={{ color: T.text }}>
                      {tPaths(`paths.${key}.description`)}
                    </p>

                    {/* XP / Badge footer */}
                    <div
                      className="flex items-center justify-between pt-4"
                      style={{ borderTop: `1px solid ${T.faint}` }}
                    >
                      <div>
                        <div className="text-xs font-bold" style={{ ...MONO, color: accent }}>{xp} XP</div>
                        <div style={{ ...MONO, fontSize: "9px", color: T.dim }}>{badge} Badge</div>
                      </div>
                      {!comingSoon && (
                        <ArrowRight
                          style={{ width: 14, height: 14, color: T.dim }}
                          className="transition-all duration-200 group-hover:translate-x-1"
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
        <section className="py-20" style={{ background: T.surface, borderBottom: `1px solid ${T.faint}` }}>
          <div className="mx-auto max-w-7xl px-4">
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px flex-1 max-w-[40px]" style={{ background: T.green }} />
                <span className="text-[10px] uppercase tracking-[0.2em]" style={{ ...MONO, color: T.green }}>Courses</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white">{t("featuredCourses.title")}</h2>
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
                  className="gap-2 text-xs rounded-none group"
                  style={{ ...MONO, border: `1px solid rgba(255,255,255,0.1)`, color: T.text }}
                >
                  {t("featuredCourses.viewAll")}
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════
          PARTNERS
      ═══════════════════════════════════════ */}
      <section className="py-12" style={{ borderBottom: `1px solid ${T.faint}` }}>
        <div className="mx-auto max-w-7xl px-4">
          <p
            className="mb-8 text-center"
            style={{ ...MONO, fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.15em", color: T.dim }}
          >
            {t("partners.title")}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {[
              { name: "Solana",   accent: T.green },
              { name: "Metaplex", accent: T.green },
              { name: "Helius",   accent: "#F97316" },
              { name: "Superteam", accent: T.purple },
              { name: "Anchor",   accent: T.blue },
            ].map(({ name, accent }) => (
              <div
                key={name}
                className="group relative px-6 py-2.5 cursor-default transition-all duration-300"
                style={{
                  ...MONO,
                  fontSize: "11px",
                  color: T.dim,
                  background: T.bg,
                  border: `1px solid ${T.faint}`,
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.color = "rgba(255,255,255,0.7)";
                  el.style.borderColor = `${accent}30`;
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.color = T.dim;
                  el.style.borderColor = T.faint;
                }}
              >
                {/* Left accent notch */}
                <span
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-3 transition-all duration-300 group-hover:h-full"
                  style={{ background: accent }}
                />
                {name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          FINAL CTA — Full-width Impact
      ═══════════════════════════════════════ */}
      <section className="relative py-28 overflow-hidden">
        {/* Background constellation dots */}
        <div className="absolute inset-0 pointer-events-none">
          {[
            { x: "10%", y: "20%", s: 2 }, { x: "25%", y: "70%", s: 1.5 }, { x: "40%", y: "30%", s: 1 },
            { x: "60%", y: "65%", s: 2 }, { x: "75%", y: "25%", s: 1.5 }, { x: "85%", y: "55%", s: 1 },
            { x: "15%", y: "50%", s: 1 }, { x: "90%", y: "40%", s: 1.5 }, { x: "50%", y: "80%", s: 2 },
          ].map((dot, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                left: dot.x, top: dot.y,
                width: dot.s, height: dot.s,
                background: T.green,
                opacity: 0.15,
                animation: `float ${3 + i * 0.5}s ease-in-out infinite`,
                animationDelay: `${i * 0.3}s`,
              }}
            />
          ))}
        </div>

        {/* Center radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 50% 50%, ${T.green}06 0%, transparent 50%)`,
          }}
        />

        <div className="relative mx-auto max-w-4xl px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, type: "spring" }}
            className="space-y-6"
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <Rocket style={{ width: 14, height: 14, color: T.green }} />
              <span className="text-[10px] uppercase tracking-[0.2em]" style={{ ...MONO, color: T.green }}>Ready to build?</span>
            </div>

            <h2
              className="leading-[0.92]"
              style={{
                ...MONO,
                fontSize: "clamp(2.2rem, 5vw, 4.5rem)",
                fontWeight: 900,
              }}
            >
              <span className="block" style={{ color: T.white }}>Start your</span>
              <span className="block" style={{
                background: `linear-gradient(135deg, ${T.green}, ${T.blue})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
                Solana journey
              </span>
              <span className="block" style={{ color: "rgba(255,255,255,0.2)" }}>today.</span>
            </h2>

            <p className="text-sm mx-auto max-w-sm" style={{ ...MONO, color: T.text }}>
              Join 500+ developers. Free, open-source, and real on-chain credentials that prove your skills.
            </p>

            <div className="flex items-center justify-center gap-3 pt-2">
              <StartLearningButton />
              <Link href="/courses">
                <Button
                  variant="ghost"
                  size="lg"
                  className="gap-2 text-sm rounded-none group"
                  style={{ ...MONO, border: `1px solid rgba(255,255,255,0.1)`, color: T.text }}
                >
                  Browse Courses
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </Button>
              </Link>
            </div>

            {/* Trust signals */}
            <div className="flex items-center justify-center gap-4 pt-6" style={{ ...MONO, fontSize: "10px", color: T.dim }}>
              <div className="flex items-center gap-1.5">
                <Shield style={{ width: 10, height: 10 }} />
                <span>100% Free</span>
              </div>
              <span style={{ color: T.faint }}>|</span>
              <div className="flex items-center gap-1.5">
                <Code2 style={{ width: 10, height: 10 }} />
                <span>Open Source</span>
              </div>
              <span style={{ color: T.faint }}>|</span>
              <div className="flex items-center gap-1.5">
                <Trophy style={{ width: 10, height: 10 }} />
                <span>On-Chain Creds</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
