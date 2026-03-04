"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import {
  GraduationCap, Zap, Trophy, Shield, BookOpen, UserPlus, Award,
  ArrowRight, CheckCircle, Layers, ImageIcon, Cpu, Flame, Activity,
} from "lucide-react";
import { StartLearningButton } from "@/components/landing/StartLearningButton";
import type { SanityCourse } from "@/lib/sanity/queries";
import { CourseCard, CourseCardData } from "@/components/courses/CourseCard";
import { motion, Variants } from "framer-motion";
import { useState } from "react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 220, damping: 26 } },
};

const stagger: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

const TICKER_ITEMS = [
  { wallet: "7fXk...9mRq", action: "completed", lesson: "PDAs & CPIs", xp: "+150 XP" },
  { wallet: "B3nN...4pLw", action: "earned credential", lesson: "Solana Fundamentals", xp: "NFT Minted" },
  { wallet: "Qr2T...8sVx", action: "completed", lesson: "Account Model", xp: "+75 XP" },
  { wallet: "mK9J...3zPq", action: "enrolled in", lesson: "Anchor Framework", xp: "+10 XP" },
  { wallet: "5wLc...7nBr", action: "completed", lesson: "Token-2022", xp: "+100 XP" },
  { wallet: "xHd8...2kFm", action: "completed", lesson: "DeFi Basics", xp: "+125 XP" },
  { wallet: "Pn6Y...1vQs", action: "earned credential", lesson: "DeFi Developer", xp: "NFT Minted" },
  { wallet: "9cRj...5tWe", action: "completed", lesson: "Hello World Program", xp: "+125 XP" },
];

export function LandingContent({ featuredCourses }: { featuredCourses: SanityCourse[] }) {
  const t = useTranslations("landing");
  const tPaths = useTranslations("learningPaths");
  // Stable count — avoids hydration mismatch
  const [liveCount] = useState(27);

  return (
    <div className="flex flex-col bg-background">

      {/* ═══════════════════════════════════════
          HERO
      ═══════════════════════════════════════ */}
      <section className="relative min-h-[88vh] flex flex-col justify-center overflow-hidden border-b border-white/5">
        {/* Grid background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(rgba(20,241,149,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(20,241,149,0.025) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
        {/* Ambient glows */}
        <div className="absolute -top-48 -right-24 w-[700px] h-[700px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(153,69,255,0.06) 0%, transparent 70%)" }} />
        <div className="absolute bottom-0 -left-48 w-[600px] h-[600px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(20,241,149,0.04) 0%, transparent 70%)" }} />

        <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 pt-16 pb-12">
          <div className="grid items-center gap-8 lg:grid-cols-[1fr_460px]">

            {/* ── Left: Typography block ── */}
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="show"
              className="space-y-7"
            >
              {/* Live badge */}
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2" style={{ fontFamily: "var(--font-mono)" }}>
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" style={{ background: "#14F195" }} />
                  <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: "#14F195" }} />
                </span>
                <span className="text-xs uppercase tracking-widest" style={{ color: "#14F195" }}>
                  LIVE · {liveCount} on devnet
                </span>
              </motion.div>

              {/* Giant stacked heading */}
              <div>
                <motion.h1
                  variants={stagger}
                  initial="hidden"
                  animate="show"
                  className="uppercase leading-[0.92] tracking-[-0.02em]"
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "clamp(3rem, 6.5vw, 5.8rem)",
                    fontWeight: 900,
                  }}
                >
                  <motion.span variants={fadeUp} className="block text-foreground">LEARN</motion.span>
                  <motion.span variants={fadeUp} className="block" style={{ color: "#14F195" }}>SOLANA</motion.span>
                  <motion.span variants={fadeUp} className="block text-foreground">EARN</motion.span>
                  <motion.span variants={fadeUp} className="block text-foreground/62">ON-CHAIN.</motion.span>
                </motion.h1>
              </div>

              <motion.p variants={fadeUp} className="max-w-sm text-sm leading-relaxed text-foreground/62" style={{ fontFamily: "var(--font-mono)" }}>
                {t("hero.subtitle")}
              </motion.p>

              <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-3">
                <StartLearningButton />
                <Link href="/courses">
                  <Button
                    variant="ghost"
                    size="lg"
                    className="gap-2 border rounded-none text-sm text-foreground/70"
                    style={{
                      fontFamily: "var(--font-mono)",
                      borderColor: "hsl(var(--border))",
                    }}
                  >
                    {t("cta.button")}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </motion.div>

              {/* Inline stats */}
              <motion.div variants={fadeUp} className="flex items-stretch gap-0 border border-white/8 rounded-none w-fit">
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
                      borderLeft: i > 0 ? "1px solid hsl(var(--border))" : "none",
                    }}
                  >
                    <span className="text-lg font-bold tabular-nums text-foreground">{value}</span>
                    <span className="text-[9px] uppercase tracking-widest mt-0.5 text-foreground/55">{label}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* ── Right: Terminal panel ── */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.25, type: "spring" }}
              className="hidden lg:block"
            >
              <div
                className="overflow-hidden shadow-2xl"
                style={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  boxShadow: "0 0 0 1px rgba(20,241,149,0.04), 0 32px 64px rgba(0,0,0,0.6)",
                }}
              >
                {/* Title bar */}
                <div
                  className="flex items-center justify-between px-4 py-2.5"
                  style={{ background: "hsl(var(--muted))", borderBottom: "1px solid hsl(var(--border) / 0.5)" }}
                >
                  <div className="flex gap-1.5 text-foreground/45">
                    <div className="h-2.5 w-2.5 rounded-full" style={{ background: "#FF5F57" }} />
                    <div className="h-2.5 w-2.5 rounded-full" style={{ background: "#FEBC2E" }} />
                    <div className="h-2.5 w-2.5 rounded-full" style={{ background: "#28C840" }} />
                  </div>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px" }}>
                    academy.superteam.fun — lesson.rs
                  </span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "#14F195", opacity: 0.5 }}>
                    ● devnet
                  </span>
                </div>

                {/* Editor body */}
                <div className="flex">
                  {/* Sidebar */}
                  <div
                    className="w-40 shrink-0 p-3 space-y-0.5 text-foreground/45"
                    style={{ borderRight: "1px solid hsl(var(--border) / 0.5)" }}
                  >
                    <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px" }}>Module 1</p>
                    {[
                      { name: "Intro to PDAs", done: true, active: false },
                      { name: "Account Model", done: true, active: false },
                      { name: "Token-2022", done: false, active: true },
                    ].map(({ name, done, active }) => (
                      <div
                        key={name}
                        className={`flex items-center gap-1.5 px-2 py-1.5 ${active ? "text-[#14F195]" : done ? "text-foreground/62" : "text-foreground/55"}`}
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "9px",
                          background: active ? "rgba(20,241,149,0.08)" : "transparent",
                        }}
                      >
                        {done ? (
                          <CheckCircle style={{ width: "10px", height: "10px", flexShrink: 0 }} />
                        ) : (
                          <div className="text-foreground/55" style={{ width: "10px", height: "10px", flexShrink: 0, borderRadius: "50%", border: "1px solid currentColor" }} />
                        )}
                        {name}
                      </div>
                    ))}
                    <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: "12px", marginBottom: "8px" }}>Module 2</p>
                    {["Anchor Setup", "Your Program", "PDAs & CPIs"].map(name => (
                      <div
                        key={name}
                        className="flex items-center gap-1.5 px-2 py-1.5 text-foreground/55"
                        style={{ fontFamily: "var(--font-mono)", fontSize: "9px" }}
                      >
                        <div style={{ width: "10px", height: "10px", flexShrink: 0, borderRadius: "50%", border: "1px solid hsl(var(--border))" }} />
                        {name}
                      </div>
                    ))}
                  </div>

                  {/* Code pane */}
                  <div className="flex-1 p-4" style={{ background: "hsl(var(--card))" }}>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px", lineHeight: "1.7" }}>
                      {[
                        { ln: "1", parts: [{ t: "use", c: "#7ECA9C" }, { t: " anchor_lang", c: "#14F195" }, { t: "::prelude::*;", c: "rgba(237,233,225,0.62)" }] },
                        { ln: "2", parts: [{ t: " ", c: "" }] },
                        { ln: "3", parts: [{ t: "#[program]", c: "#C792EA" }] },
                        { ln: "4", parts: [{ t: "pub mod", c: "#7ECA9C" }, { t: " academy", c: "#82AAFF" }, { t: " {", c: "rgba(237,233,225,0.7)" }] },
                        { ln: "5", parts: [{ t: "  pub fn", c: "#7ECA9C" }, { t: " enroll", c: "#FFB800" }, { t: "(ctx) {", c: "rgba(237,233,225,0.7)" }] },
                        { ln: "6", parts: [{ t: "    // ✏️  Your code here", c: "rgba(237,233,225,0.45)" }] },
                        { ln: "7", parts: [{ t: "  }", c: "rgba(237,233,225,0.7)" }] },
                        { ln: "8", parts: [{ t: "}", c: "rgba(237,233,225,0.7)" }] },
                      ].map(({ ln, parts }) => (
                        <div key={ln} className="flex items-center gap-4 text-foreground/55">
                          <span style={{ width: "16px", textAlign: "right", userSelect: "none", flexShrink: 0 }}>{ln}</span>
                          <span>
                            {parts.map((p, i) => (
                              <span key={i} style={{ color: p.c }}>{p.t}</span>
                            ))}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Status bar */}
                <div
                  className="flex items-center justify-between px-4 py-2"
                  style={{ background: "hsl(var(--muted))", borderTop: "1px solid hsl(var(--border) / 0.5)" }}
                >
                  <div className="flex items-center gap-1.5 text-foreground/45" style={{ fontFamily: "var(--font-mono)", fontSize: "9px" }}>
                    <Zap style={{ width: "10px", height: "10px", color: "#FFB800" }} />
                    <span style={{ color: "#FFB800", fontWeight: "bold" }}>+150 XP</span>
                    <span>on completion</span>
                  </div>
                  <div className="flex items-center gap-1.5" style={{ fontFamily: "var(--font-mono)", fontSize: "9px", color: "#14F195" }}>
                    <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: "#14F195" }} />
                    tests ready
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          LIVE ACTIVITY TICKER
      ═══════════════════════════════════════ */}
      <div className="border-b border-border/20 overflow-hidden bg-background">
        <div className="flex items-stretch">
          {/* Label */}
          <div
            className="shrink-0 flex items-center gap-2 px-4 py-2.5 z-10"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
              borderRight: "1px solid hsl(var(--border))",
              background: "hsl(var(--background))",
            }}
          >
            <Activity style={{ width: "11px", height: "11px", color: "#14F195" }} />
            <span style={{ color: "#14F195", textTransform: "uppercase", letterSpacing: "0.12em" }}>Live</span>
          </div>

          {/* Scrolling ticker */}
          <div className="overflow-hidden relative flex-1">
            <div className="flex" style={{ animation: "ticker-scroll 40s linear infinite", width: "max-content" }}>
              {[...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2.5 px-6 py-2.5 shrink-0"
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "10px",
                    borderRight: "1px solid hsl(var(--border) / 0.3)",
                  }}
                >
                  <span className="h-1.5 w-1.5 rounded-full shrink-0 text-foreground/62 text-foreground/45 text-foreground/80" style={{ background: "#14F195" }} />
                  <span>{item.wallet}</span>
                  <span>{item.action}</span>
                  <span>{item.lesson}</span>
                  <span style={{ color: item.xp.includes("NFT") ? "#9945FF" : "#FFB800", fontWeight: "600" }}>{item.xp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════
          FEATURES
      ═══════════════════════════════════════ */}
      <section className="py-20 border-b border-white/5">
        <div className="mx-auto max-w-7xl px-4">
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }} className="mb-10">
            <motion.p variants={fadeUp} className="text-xs uppercase tracking-widest mb-3" style={{ fontFamily: "var(--font-mono)", color: "#14F195" }}>
              $ features --list
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-3xl font-bold text-foreground sm:text-4xl">
              {t("features.title")}
            </motion.h2>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 overflow-hidden"
            style={{ border: "1px solid hsl(var(--border) / 0.6)", gap: "1px", background: "hsl(var(--border) / 0.6)" }}
          >
            {[
              { icon: Shield, key: "onChain" as const, cmd: "on-chain-xp", accent: "#14F195" },
              { icon: Zap, key: "soulboundXP" as const, cmd: "soulbound-tokens", accent: "#FFB800" },
              { icon: Trophy, key: "nftCredentials" as const, cmd: "nft-credentials", accent: "#9945FF" },
              { icon: GraduationCap, key: "openSource" as const, cmd: "open-source", accent: "#14F195" },
            ].map(({ icon: Icon, key, cmd, accent }) => (
              <motion.div
                key={key}
                variants={fadeUp}
                className="group relative p-7 transition-colors cursor-default text-foreground/55"
                style={{ background: "hsl(var(--card))" }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = "hsl(var(--muted))"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = "hsl(var(--card))"; }}
              >
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", marginBottom: "20px" }}>
                  $ feature.{cmd}
                </p>
                <div
                  className="mb-4 inline-flex h-9 w-9 items-center justify-center"
                  style={{
                    border: `1px solid ${accent}28`,
                    background: `${accent}0A`,
                    color: accent,
                  }}
                >
                  <Icon style={{ width: "16px", height: "16px" }} />
                </div>
                <h3 className="mb-2 text-sm font-bold text-foreground" style={{ fontFamily: "var(--font-mono)" }}>
                  {t(`features.${key}.title`)}
                </h3>
                <p className="text-xs leading-relaxed text-foreground/62">
                  {t(`features.${key}.description`)}
                </p>
                {/* Accent line on hover */}
                <div
                  className="absolute bottom-0 left-0 h-[2px] transition-all duration-500"
                  style={{ background: accent, width: "0%" }}
                  ref={el => {
                    if (!el) return;
                    const parent = el.parentElement!;
                    parent.addEventListener("mouseenter", () => { el.style.width = "100%"; });
                    parent.addEventListener("mouseleave", () => { el.style.width = "0%"; });
                  }}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          HOW IT WORKS
      ═══════════════════════════════════════ */}
      <section className="py-20 border-b border-white/5" style={{ background: "hsl(var(--card))" }}>
        <div className="mx-auto max-w-7xl px-4">
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="mb-10">
            <motion.p variants={fadeUp} className="text-xs uppercase tracking-widest mb-3" style={{ fontFamily: "var(--font-mono)", color: "#14F195" }}>
              $ how-it-works
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-3xl font-bold text-foreground sm:text-4xl">
              {t("howItWorks.title")}
            </motion.h2>
          </motion.div>

          <div className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Connector */}
            <div className="absolute left-0 right-0 top-[4.5rem] hidden h-px lg:block" style={{ background: "linear-gradient(90deg, transparent, rgba(20,241,149,0.12) 20%, rgba(20,241,149,0.12) 80%, transparent)" }} />

            {([
              { step: "step1" as const, icon: UserPlus, reward: "+10 XP", num: "01" },
              { step: "step2" as const, icon: BookOpen, reward: "Unlock Paths", num: "02" },
              { step: "step3" as const, icon: CheckCircle, reward: "+500 XP", num: "03" },
              { step: "step4" as const, icon: Award, reward: "NFT Mint", num: "04" },
            ] as const).map(({ step, icon: StepIcon, reward, num }, idx) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="group relative p-6 text-foreground/45"
                style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border) / 0.6)" }}
              >
                <div
                  className="absolute -top-3 left-4 px-2"
                  style={{ fontFamily: "var(--font-mono)", fontSize: "9px", background: "hsl(var(--card))" }}
                >
                  {num}
                </div>
                <div className="mt-2 mb-4 flex items-center gap-2.5">
                  <div
                    className="flex h-9 w-9 items-center justify-center"
                    style={{ border: "1px solid rgba(20,241,149,0.18)", background: "rgba(20,241,149,0.06)", color: "#14F195" }}
                  >
                    <StepIcon style={{ width: "16px", height: "16px" }} />
                  </div>
                  <span
                    className="px-2 py-0.5 text-[9px] font-semibold"
                    style={{
                      fontFamily: "var(--font-mono)",
                      border: "1px solid rgba(255,184,0,0.25)",
                      background: "rgba(255,184,0,0.06)",
                      color: "#FFB800",
                    }}
                  >
                    {reward}
                  </span>
                </div>
                <h3
                  className="mb-2 text-sm font-bold text-foreground transition-colors group-hover:text-[#14F195]"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {t(`howItWorks.${step}.title`)}
                </h3>
                <p className="text-xs leading-relaxed text-foreground/62">
                  {t(`howItWorks.${step}.description`)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          LEARNING PATHS
      ═══════════════════════════════════════ */}
      <section className="py-20 border-b border-white/5">
        <div className="mx-auto max-w-7xl px-4">
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="mb-10">
            <motion.p variants={fadeUp} className="text-xs uppercase tracking-widest mb-3" style={{ fontFamily: "var(--font-mono)", color: "#14F195" }}>
              $ learning-paths --all
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-3xl font-bold text-foreground sm:text-4xl">
              {tPaths("title")}
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-2 text-sm text-foreground/62">
              {tPaths("subtitle")}
            </motion.p>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {([
              { key: "solanaFundamentals" as const, icon: Layers, track: "solana-fundamentals", comingSoon: false, xp: "1,000", badge: "Builder", accent: "#14F195" },
              { key: "defiDevelopment" as const, icon: Zap, track: "defi-development", comingSoon: true, xp: "2,500", badge: "DeFi Master", accent: "#FFB800" },
              { key: "nftGaming" as const, icon: ImageIcon, track: "nft-gaming", comingSoon: true, xp: "2,000", badge: "Creator", accent: "#9945FF" },
              { key: "advancedProtocol" as const, icon: Cpu, track: "advanced-protocol", comingSoon: true, xp: "5,000", badge: "Core Dev", accent: "#00D4FF" },
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
                    className="group h-full p-6 flex flex-col transition-all"
                    style={{
                      background: comingSoon ? "hsl(var(--background) / 0.5)" : "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      opacity: comingSoon ? 0.65 : 1,
                    }}
                    onMouseEnter={e => {
                      if (!comingSoon) (e.currentTarget as HTMLDivElement).style.borderColor = `${accent}35`;
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLDivElement).style.borderColor = "hsl(var(--border))";
                    }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className="flex h-9 w-9 items-center justify-center"
                        style={{ border: `1px solid ${accent}22`, background: `${accent}08`, color: accent }}
                      >
                        <PathIcon style={{ width: "16px", height: "16px" }} />
                      </div>
                      {!comingSoon ? (
                        <div className="flex items-center gap-1 text-foreground/45" style={{ fontFamily: "var(--font-mono)", fontSize: "9px", color: "#14F195" }}>
                          <Flame style={{ width: "10px", height: "10px" }} />
                          LIVE
                        </div>
                      ) : (
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: "9px", border: "1px solid hsl(var(--border))", padding: "2px 8px" }}>
                          {tPaths("comingSoon")}
                        </span>
                      )}
                    </div>

                    <h3 className="mb-1.5 text-sm font-bold text-foreground" style={{ fontFamily: "var(--font-mono)" }}>
                      {tPaths(`paths.${key}.title`)}
                    </h3>
                    <p className="flex-1 text-xs leading-relaxed mb-4 text-foreground/62">
                      {tPaths(`paths.${key}.description`)}
                    </p>

                    <div className="flex items-center justify-between pt-3 text-foreground/45" style={{ borderTop: "1px solid hsl(var(--border) / 0.5)" }}>
                      <div>
                        <div className="text-xs font-bold text-foreground/45" style={{ fontFamily: "var(--font-mono)", color: accent }}>{xp} XP</div>
                        <div style={{ fontFamily: "var(--font-mono)", fontSize: "9px" }}>{badge} Badge</div>
                      </div>
                      {!comingSoon && (
                        <ArrowRight
                          style={{ width: "14px", height: "14px", transition: "all 0.2s" }}
                          className="group-hover:translate-x-1 group-hover:text-[#14F195] transition-all"
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
          FEATURED COURSES (conditional)
      ═══════════════════════════════════════ */}
      {featuredCourses.length > 0 && (
        <section className="py-20 border-b border-white/5" style={{ background: "hsl(var(--card))" }}>
          <div className="mx-auto max-w-7xl px-4">
            <div className="mb-10">
              <p className="text-xs uppercase tracking-widest mb-3" style={{ fontFamily: "var(--font-mono)", color: "#14F195" }}>
                $ courses --featured
              </p>
              <h2 className="text-3xl font-bold text-foreground sm:text-4xl">{t("featuredCourses.title")}</h2>
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
          PARTNERS
      ═══════════════════════════════════════ */}
      <section className="border-b border-white/5 py-10">
        <div className="mx-auto max-w-7xl px-4">
          <p className="mb-6 text-center text-foreground/55" style={{ fontFamily: "var(--font-mono)", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.12em" }}>
            {t("partners.title")}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {[
              { name: "Solana", accent: "#14F195" },
              { name: "Metaplex", accent: "#14F195" },
              { name: "Helius", accent: "#F97316" },
              { name: "Superteam", accent: "#9945FF" },
              { name: "Anchor", accent: "#3B82F6" },
            ].map(({ name, accent }) => (
              <div
                key={name}
                className="px-5 py-2 cursor-default transition-colors text-foreground/62 hover:text-foreground/75 bg-card border border-border/60"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "11px",
                  borderLeftColor: accent,
                  borderLeftWidth: "2px",
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
      <section className="py-28">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <p className="text-xs uppercase tracking-widest" style={{ fontFamily: "var(--font-mono)", color: "#14F195" }}>
              $ ready
            </p>
            <h2
              className="uppercase leading-[0.9]"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "clamp(2.2rem, 5vw, 4.5rem)",
                fontWeight: 900,
                color: "white",
              }}
            >
              START BUILDING<br className="text-foreground/62" />
              <span style={{ color: "#14F195" }}>ON SOLANA</span><br />
              <span>TODAY.</span>
            </h2>
            <p className="text-sm mx-auto max-w-xs text-foreground/62">
              Join 500+ developers. Free to start. Real on-chain credentials.
            </p>
            <div className="flex items-center justify-center gap-3">
              <StartLearningButton />
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
