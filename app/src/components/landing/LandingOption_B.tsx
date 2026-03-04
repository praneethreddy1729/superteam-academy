"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { ArrowRight } from "lucide-react";
import { StartLearningButton } from "@/components/landing/StartLearningButton";
import type { SanityCourse } from "@/lib/sanity/queries";
import { CourseCard, CourseCardData } from "@/components/courses/CourseCard";
import { motion, Variants } from "framer-motion";
import { useState } from "react";

/* ─────────────────────────────────────────────
   ANIMATION VARIANTS
   ───────────────────────────────────────────── */

const reveal: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const clipUp: Variants = {
  hidden: { clipPath: "inset(100% 0 0 0)" },
  show: {
    clipPath: "inset(0% 0 0 0)",
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
};

/* ─────────────────────────────────────────────
   TICKER DATA
   ───────────────────────────────────────────── */

const TICKER_STATS = [
  "SOL $245.32 ↑ 3.4%",
  "27 learners active",
  "847 XP earned today",
  "3 credentials minted",
  "12 lessons completed",
  "SOL $245.32 ↑ 3.4%",
  "27 learners active",
  "847 XP earned today",
  "3 credentials minted",
  "12 lessons completed",
];

/* ─────────────────────────────────────────────
   COLORS
   ───────────────────────────────────────────── */

const C = {
  dark: "#070A10",
  darkAlt: "#0D1117",
  white: "#FFFFFF",
  offWhite: "#E8E8E8",
  mid: "#666666",
  dim: "#333333",
  accent: "#14F195",
  rule: "rgba(255,255,255,0.06)",
} as const;

/* ─────────────────────────────────────────────
   COMPONENT
   ───────────────────────────────────────────── */

export function LandingContent({
  featuredCourses,
}: {
  featuredCourses: SanityCourse[];
}) {
  const t = useTranslations("landing");
  const tPaths = useTranslations("learningPaths");
  const [liveCount] = useState(27);

  return (
    <div className="flex flex-col" style={{ background: C.dark }}>
      {/* ═══════════════════════════════════
          TICKER TAPE — financial terminal
      ═══════════════════════════════════ */}
      <div
        className="overflow-hidden border-b"
        style={{
          background: "#000000",
          borderColor: C.rule,
          height: "28px",
        }}
      >
        <div
          className="flex items-center h-full"
          style={{
            animation: "ticker-scroll 30s linear infinite",
            width: "max-content",
          }}
        >
          {[...TICKER_STATS, ...TICKER_STATS, ...TICKER_STATS].map(
            (stat, i) => (
              <span
                key={i}
                className="shrink-0 flex items-center gap-3 px-6"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "10px",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: stat.includes("SOL") ? C.accent : "rgba(255,255,255,0.35)",
                }}
              >
                <span
                  style={{
                    width: "3px",
                    height: "3px",
                    borderRadius: "50%",
                    background: stat.includes("SOL") ? C.accent : "rgba(255,255,255,0.15)",
                    flexShrink: 0,
                  }}
                />
                {stat}
              </span>
            )
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════
          HERO — editorial typographic split
      ═══════════════════════════════════ */}
      <section
        className="relative overflow-hidden"
        style={{ minHeight: "calc(100vh - 28px - 64px)", maxHeight: "900px" }}
      >
        {/* Split background */}
        <div className="absolute inset-0 flex">
          <div className="w-1/2" style={{ background: C.dark }} />
          <div className="hidden md:block w-1/2" style={{ background: C.darkAlt }} />
        </div>

        {/* Accent line — vertical divider */}
        <div
          className="absolute top-0 bottom-0 left-1/2 hidden md:block"
          style={{ width: "1px", background: C.rule }}
        />

        <div className="relative mx-auto w-full max-w-7xl px-6 sm:px-10 h-full flex items-center">
          <div className="grid md:grid-cols-2 gap-8 md:gap-16 w-full py-12 md:py-0">
            {/* Left column — typography */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              className="flex flex-col justify-center"
            >
              {/* Small caps label */}
              <motion.p
                variants={reveal}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "10px",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: C.mid,
                  marginBottom: "24px",
                }}
              >
                Superteam Academy
              </motion.p>

              {/* Display heading — magazine scale */}
              <div style={{ overflow: "hidden" }}>
                <motion.h1
                  variants={clipUp}
                  initial="hidden"
                  animate="show"
                  style={{
                    fontSize: "clamp(2.8rem, 7vw, 6.5rem)",
                    fontWeight: 900,
                    lineHeight: 0.92,
                    letterSpacing: "-0.03em",
                    color: C.white,
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  Learn
                  <br />
                  <span style={{ color: C.accent }}>Solana.</span>
                </motion.h1>
              </div>

              <motion.p
                variants={reveal}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "clamp(0.75rem, 1.1vw, 0.875rem)",
                  lineHeight: 1.7,
                  color: C.mid,
                  maxWidth: "380px",
                  marginTop: "28px",
                }}
              >
                {t("hero.subtitle")}
              </motion.p>

              <motion.div
                variants={reveal}
                className="flex flex-wrap items-center gap-4"
                style={{ marginTop: "32px" }}
              >
                <StartLearningButton />
                <Link
                  href="/courses"
                  className="group inline-flex items-center gap-2"
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "12px",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.4)",
                    textDecoration: "none",
                  }}
                >
                  <span className="relative">
                    {t("cta.button")}
                    <span
                      className="absolute left-0 bottom-0 h-px bg-current transition-all duration-300"
                      style={{ width: "0%" }}
                      ref={(el) => {
                        if (!el) return;
                        const link = el.closest("a");
                        if (!link) return;
                        link.addEventListener("mouseenter", () => {
                          el.style.width = "100%";
                        });
                        link.addEventListener("mouseleave", () => {
                          el.style.width = "0%";
                        });
                      }}
                    />
                  </span>
                  <ArrowRight style={{ width: "12px", height: "12px" }} />
                </Link>
              </motion.div>

              {/* Live count — minimal */}
              <motion.div
                variants={reveal}
                className="flex items-center gap-2"
                style={{ marginTop: "40px" }}
              >
                <span
                  className="relative flex"
                  style={{ width: "6px", height: "6px" }}
                >
                  <span
                    className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60"
                    style={{ background: C.accent }}
                  />
                  <span
                    className="relative inline-flex rounded-full"
                    style={{
                      width: "6px",
                      height: "6px",
                      background: C.accent,
                    }}
                  />
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "10px",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.25)",
                  }}
                >
                  {liveCount} building now
                </span>
              </motion.div>
            </motion.div>

            {/* Right column — stats as financial statement */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              className="flex flex-col justify-center"
            >
              {/* Section label */}
              <motion.p
                variants={reveal}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "9px",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.2)",
                  marginBottom: "20px",
                }}
              >
                Platform Overview
              </motion.p>

              {/* Ruled stat list */}
              <div
                style={{
                  borderTop: `1px solid ${C.rule}`,
                }}
              >
                {[
                  {
                    label: t("stats.courses"),
                    value: t("stats.coursesValue"),
                  },
                  {
                    label: t("stats.lessons"),
                    value: t("stats.lessonsValue"),
                  },
                  {
                    label: t("stats.challenges"),
                    value: t("stats.challengesValue"),
                  },
                  {
                    label: t("stats.languages"),
                    value: t("stats.languagesValue"),
                  },
                  { label: "Active Learners", value: `${liveCount}` },
                  { label: "Credentials Minted", value: "47" },
                ].map(({ label, value }, i) => (
                  <motion.div
                    key={label}
                    variants={reveal}
                    className="flex items-center justify-between"
                    style={{
                      padding: "14px 0",
                      borderBottom: `1px solid ${C.rule}`,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "11px",
                        color: "rgba(255,255,255,0.35)",
                        letterSpacing: "0.02em",
                      }}
                    >
                      {label}
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "14px",
                        fontWeight: 700,
                        color: i === 0 ? C.accent : C.white,
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {value}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* Decorative accent line */}
              <motion.div
                variants={reveal}
                style={{
                  width: "40px",
                  height: "2px",
                  background: C.accent,
                  marginTop: "24px",
                }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          FEATURES — editorial 2×2
      ═══════════════════════════════════ */}
      <section
        style={{
          background: C.darkAlt,
          borderTop: `1px solid ${C.rule}`,
          borderBottom: `1px solid ${C.rule}`,
        }}
      >
        <div className="mx-auto max-w-7xl px-6 sm:px-10 py-24">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
          >
            {/* Section header — editorial style */}
            <div
              className="flex items-end justify-between mb-16"
              style={{ borderBottom: `1px solid ${C.rule}`, paddingBottom: "16px" }}
            >
              <motion.div variants={reveal}>
                <p
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "9px",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: C.accent,
                    marginBottom: "12px",
                  }}
                >
                  01 — Features
                </p>
                <h2
                  style={{
                    fontSize: "clamp(1.8rem, 3.5vw, 3rem)",
                    fontWeight: 900,
                    lineHeight: 1,
                    letterSpacing: "-0.02em",
                    color: C.white,
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {t("features.title")}
                </h2>
              </motion.div>
              <motion.p
                variants={reveal}
                className="hidden md:block"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "10px",
                  color: "rgba(255,255,255,0.2)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                Solana-native
              </motion.p>
            </div>

            {/* Feature grid — 2 columns, editorial */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              className="grid md:grid-cols-2"
              style={{ gap: "1px", background: C.rule }}
            >
              {(
                [
                  { key: "onChain" as const, num: "A" },
                  { key: "soulboundXP" as const, num: "B" },
                  { key: "nftCredentials" as const, num: "C" },
                  { key: "openSource" as const, num: "D" },
                ] as const
              ).map(({ key, num }) => (
                <motion.div
                  key={key}
                  variants={reveal}
                  className="group"
                  style={{ background: C.darkAlt, padding: "40px" }}
                >
                  <div className="flex items-start justify-between mb-6">
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "48px",
                        fontWeight: 900,
                        lineHeight: 1,
                        color: "rgba(255,255,255,0.03)",
                      }}
                    >
                      {num}
                    </span>
                    <span
                      className="transition-colors duration-300"
                      style={{
                        width: "20px",
                        height: "2px",
                        background: "rgba(255,255,255,0.1)",
                        display: "block",
                        marginTop: "12px",
                      }}
                      ref={(el) => {
                        if (!el) return;
                        const parent = el.closest(".group");
                        if (!parent) return;
                        parent.addEventListener("mouseenter", () => {
                          el.style.background = C.accent;
                          el.style.width = "40px";
                        });
                        parent.addEventListener("mouseleave", () => {
                          el.style.background = "rgba(255,255,255,0.1)";
                          el.style.width = "20px";
                        });
                      }}
                    />
                  </div>
                  <h3
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "14px",
                      fontWeight: 700,
                      color: C.white,
                      marginBottom: "10px",
                      letterSpacing: "0.01em",
                    }}
                  >
                    {t(`features.${key}.title`)}
                  </h3>
                  <p
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "12px",
                      lineHeight: 1.7,
                      color: "rgba(255,255,255,0.3)",
                      maxWidth: "360px",
                    }}
                  >
                    {t(`features.${key}.description`)}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          HOW IT WORKS — horizontal ruled
      ═══════════════════════════════════ */}
      <section style={{ background: C.dark }}>
        <div className="mx-auto max-w-7xl px-6 sm:px-10 py-24">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
          >
            <div
              className="flex items-end justify-between mb-16"
              style={{
                borderBottom: `1px solid ${C.rule}`,
                paddingBottom: "16px",
              }}
            >
              <motion.div variants={reveal}>
                <p
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "9px",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: C.accent,
                    marginBottom: "12px",
                  }}
                >
                  02 — Process
                </p>
                <h2
                  style={{
                    fontSize: "clamp(1.8rem, 3.5vw, 3rem)",
                    fontWeight: 900,
                    lineHeight: 1,
                    letterSpacing: "-0.02em",
                    color: C.white,
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {t("howItWorks.title")}
                </h2>
              </motion.div>
            </div>

            {/* Steps as editorial grid — 2 col layout with large number */}
            <div className="grid md:grid-cols-2 gap-0">
              {(
                [
                  "step1" as const,
                  "step2" as const,
                  "step3" as const,
                  "step4" as const,
                ] as const
              ).map((step, idx) => (
                <motion.div
                  key={step}
                  variants={reveal}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  className="flex gap-6"
                  style={{
                    padding: "32px 0",
                    borderBottom: `1px solid ${C.rule}`,
                    paddingRight: idx % 2 === 0 ? "40px" : "0",
                    paddingLeft: idx % 2 === 1 ? "40px" : "0",
                    borderLeft:
                      idx % 2 === 1 ? `1px solid ${C.rule}` : "none",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "clamp(2rem, 4vw, 3.5rem)",
                      fontWeight: 900,
                      lineHeight: 1,
                      color: "rgba(255,255,255,0.04)",
                      flexShrink: 0,
                    }}
                  >
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "13px",
                        fontWeight: 700,
                        color: C.white,
                        marginBottom: "8px",
                      }}
                    >
                      {t(`howItWorks.${step}.title`)}
                    </h3>
                    <p
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "11px",
                        lineHeight: 1.7,
                        color: "rgba(255,255,255,0.3)",
                      }}
                    >
                      {t(`howItWorks.${step}.description`)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          LEARNING PATHS — magazine spread
      ═══════════════════════════════════ */}
      <section
        style={{
          background: C.darkAlt,
          borderTop: `1px solid ${C.rule}`,
          borderBottom: `1px solid ${C.rule}`,
        }}
      >
        <div className="mx-auto max-w-7xl px-6 sm:px-10 py-24">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
          >
            {/* Section header */}
            <div className="grid md:grid-cols-[1fr_1fr] gap-8 mb-16">
              <motion.div variants={reveal}>
                <p
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "9px",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: C.accent,
                    marginBottom: "12px",
                  }}
                >
                  03 — Paths
                </p>
                <h2
                  style={{
                    fontSize: "clamp(1.8rem, 3.5vw, 3rem)",
                    fontWeight: 900,
                    lineHeight: 1,
                    letterSpacing: "-0.02em",
                    color: C.white,
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {tPaths("title")}
                </h2>
              </motion.div>
              <motion.div
                variants={reveal}
                className="flex items-end"
              >
                <p
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "12px",
                    lineHeight: 1.7,
                    color: "rgba(255,255,255,0.3)",
                    maxWidth: "360px",
                  }}
                >
                  {tPaths("subtitle")}
                </p>
              </motion.div>
            </div>

            {/* Paths as ruled list — like an editorial table of contents */}
            <div style={{ borderTop: `1px solid ${C.rule}` }}>
              {(
                [
                  {
                    key: "solanaFundamentals" as const,
                    track: "solana-fundamentals",
                    comingSoon: false,
                    xp: "1,000",
                  },
                  {
                    key: "defiDevelopment" as const,
                    track: "defi-development",
                    comingSoon: true,
                    xp: "2,500",
                  },
                  {
                    key: "nftGaming" as const,
                    track: "nft-gaming",
                    comingSoon: true,
                    xp: "2,000",
                  },
                  {
                    key: "advancedProtocol" as const,
                    track: "advanced-protocol",
                    comingSoon: true,
                    xp: "5,000",
                  },
                ] as const
              ).map(({ key, track, comingSoon, xp }, idx) => (
                <motion.div
                  key={key}
                  variants={reveal}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                >
                  <Link
                    href={comingSoon ? "#" : `/courses?track=${track}`}
                    className="group flex items-center justify-between py-5 transition-colors"
                    style={{
                      borderBottom: `1px solid ${C.rule}`,
                      textDecoration: "none",
                      opacity: comingSoon ? 0.4 : 1,
                    }}
                  >
                    <div className="flex items-center gap-6">
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "10px",
                          color: "rgba(255,255,255,0.15)",
                          width: "24px",
                        }}
                      >
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <h3
                          className="transition-colors duration-300"
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "14px",
                            fontWeight: 700,
                            color: C.white,
                            marginBottom: "2px",
                          }}
                          ref={(el) => {
                            if (!el || comingSoon) return;
                            const link = el.closest("a");
                            if (!link) return;
                            link.addEventListener("mouseenter", () => {
                              el.style.color = C.accent;
                            });
                            link.addEventListener("mouseleave", () => {
                              el.style.color = C.white;
                            });
                          }}
                        >
                          {tPaths(`paths.${key}.title`)}
                        </h3>
                        <p
                          className="hidden sm:block"
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "11px",
                            color: "rgba(255,255,255,0.2)",
                            maxWidth: "440px",
                          }}
                        >
                          {tPaths(`paths.${key}.description`)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 shrink-0">
                      {comingSoon ? (
                        <span
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "9px",
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            color: "rgba(255,255,255,0.2)",
                            border: "1px solid rgba(255,255,255,0.08)",
                            padding: "3px 10px",
                          }}
                        >
                          {tPaths("comingSoon")}
                        </span>
                      ) : (
                        <>
                          <span
                            style={{
                              fontFamily: "var(--font-mono)",
                              fontSize: "12px",
                              fontWeight: 700,
                              color: C.accent,
                            }}
                          >
                            {xp} XP
                          </span>
                          <ArrowRight
                            className="transition-transform duration-300 group-hover:translate-x-1"
                            style={{
                              width: "14px",
                              height: "14px",
                              color: "rgba(255,255,255,0.2)",
                            }}
                          />
                        </>
                      )}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          FEATURED COURSES (conditional)
      ═══════════════════════════════════ */}
      {featuredCourses.length > 0 && (
        <section style={{ background: C.dark }}>
          <div className="mx-auto max-w-7xl px-6 sm:px-10 py-24">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
            >
              <div
                className="flex items-end justify-between mb-16"
                style={{
                  borderBottom: `1px solid ${C.rule}`,
                  paddingBottom: "16px",
                }}
              >
                <motion.div variants={reveal}>
                  <p
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "9px",
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      color: C.accent,
                      marginBottom: "12px",
                    }}
                  >
                    04 — Courses
                  </p>
                  <h2
                    style={{
                      fontSize: "clamp(1.8rem, 3.5vw, 3rem)",
                      fontWeight: 900,
                      lineHeight: 1,
                      letterSpacing: "-0.02em",
                      color: C.white,
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {t("featuredCourses.title")}
                  </h2>
                </motion.div>
                <motion.div variants={reveal}>
                  <Link
                    href="/courses"
                    className="group inline-flex items-center gap-2"
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "11px",
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,0.3)",
                      textDecoration: "none",
                    }}
                  >
                    <span className="relative">
                      {t("featuredCourses.viewAll")}
                      <span
                        className="absolute left-0 bottom-0 h-px bg-current transition-all duration-300"
                        style={{ width: "0%" }}
                        ref={(el) => {
                          if (!el) return;
                          const link = el.closest("a");
                          if (!link) return;
                          link.addEventListener("mouseenter", () => {
                            el.style.width = "100%";
                          });
                          link.addEventListener("mouseleave", () => {
                            el.style.width = "0%";
                          });
                        }}
                      />
                    </span>
                    <ArrowRight
                      style={{ width: "12px", height: "12px" }}
                    />
                  </Link>
                </motion.div>
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
                    totalMinutes:
                      course.lessons?.reduce(
                        (sum, l) => sum + (l.estimatedMinutes ?? 0),
                        0
                      ) ?? 0,
                    onChainCourseId: course.onChainCourseId,
                  };
                  return (
                    <CourseCard
                      key={course._id}
                      course={cardData}
                      priority={idx === 0}
                      index={idx}
                    />
                  );
                })}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════
          PARTNERS — minimal ruled row
      ═══════════════════════════════════ */}
      <section
        style={{
          borderTop: `1px solid ${C.rule}`,
          borderBottom: `1px solid ${C.rule}`,
          background: C.darkAlt,
        }}
      >
        <div className="mx-auto max-w-7xl px-6 sm:px-10 py-16">
          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "9px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.15)",
                marginBottom: "24px",
                textAlign: "center",
              }}
            >
              {t("partners.title")}
            </p>
            <div
              className="flex flex-wrap items-center justify-center"
              style={{ gap: "1px", background: C.rule }}
            >
              {["Solana", "Metaplex", "Helius", "Superteam", "Anchor"].map(
                (name) => (
                  <div
                    key={name}
                    className="cursor-default transition-colors duration-300"
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "12px",
                      letterSpacing: "0.04em",
                      color: "rgba(255,255,255,0.25)",
                      background: C.darkAlt,
                      padding: "16px 32px",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLDivElement).style.color = C.white;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLDivElement).style.color =
                        "rgba(255,255,255,0.25)";
                    }}
                  >
                    {name}
                  </div>
                )
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          CTA — typographic close
      ═══════════════════════════════════ */}
      <section style={{ background: C.dark }}>
        <div className="mx-auto max-w-7xl px-6 sm:px-10 py-32">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid md:grid-cols-[1.2fr_1fr] gap-12 items-center"
          >
            {/* Left — big type */}
            <motion.div variants={reveal}>
              <div style={{ overflow: "hidden" }}>
                <motion.h2
                  variants={clipUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  style={{
                    fontSize: "clamp(2.2rem, 5.5vw, 5rem)",
                    fontWeight: 900,
                    lineHeight: 0.92,
                    letterSpacing: "-0.03em",
                    color: C.white,
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  Start
                  <br />
                  building
                  <br />
                  <span style={{ color: C.accent }}>today.</span>
                </motion.h2>
              </div>
            </motion.div>

            {/* Right — description + CTA */}
            <motion.div variants={reveal}>
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "12px",
                  lineHeight: 1.8,
                  color: "rgba(255,255,255,0.35)",
                  marginBottom: "32px",
                  maxWidth: "360px",
                }}
              >
                {t("cta.subtitle")}
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <StartLearningButton />
                <Link
                  href="/courses"
                  className="group inline-flex items-center gap-2"
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "12px",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.4)",
                    textDecoration: "none",
                  }}
                >
                  <span className="relative">
                    {t("cta.button")}
                    <span
                      className="absolute left-0 bottom-0 h-px bg-current transition-all duration-300"
                      style={{ width: "0%" }}
                      ref={(el) => {
                        if (!el) return;
                        const link = el.closest("a");
                        if (!link) return;
                        link.addEventListener("mouseenter", () => {
                          el.style.width = "100%";
                        });
                        link.addEventListener("mouseleave", () => {
                          el.style.width = "0%";
                        });
                      }}
                    />
                  </span>
                  <ArrowRight style={{ width: "12px", height: "12px" }} />
                </Link>
              </div>

              {/* Accent rule */}
              <div
                style={{
                  width: "40px",
                  height: "2px",
                  background: C.accent,
                  marginTop: "40px",
                }}
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Bottom accent line */}
      <div
        style={{
          height: "2px",
          background: `linear-gradient(90deg, transparent, ${C.accent}, transparent)`,
        }}
      />
    </div>
  );
}
