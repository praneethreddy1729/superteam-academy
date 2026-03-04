"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import {
  ArrowRight,
  Shield,
  Zap,
  Trophy,
  GraduationCap,
  UserPlus,
  BookOpen,
  CheckCircle,
  Award,
  Layers,
  ImageIcon,
  Cpu,
} from "lucide-react";
import { StartLearningButton } from "@/components/landing/StartLearningButton";
import type { SanityCourse } from "@/lib/sanity/queries";
import { CourseCard, CourseCardData } from "@/components/courses/CourseCard";
import { motion } from "framer-motion";

/* ────────────────────────────────────────────
   ANIMATION VARIANTS
   ──────────────────────────────────────────── */

const letterStagger: import("framer-motion").Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.03 } },
};

const letterReveal: import("framer-motion").Variants = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

/* ────────────────────────────────────────────
   HELPERS
   ──────────────────────────────────────────── */

function SplitText({
  text,
  className,
  style,
}: {
  text: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <motion.span
      variants={letterStagger}
      initial="hidden"
      animate="show"
      className={className}
      style={{ display: "inline-block", ...style }}
      aria-label={text}
    >
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          variants={letterReveal}
          style={{ display: "inline-block" }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.span>
  );
}

const MONO: React.CSSProperties = { fontFamily: "var(--font-mono)" };
const GREEN = "#14F195";
const BG = "#000000";

const PROGRESS_MILESTONES = [
  { pct: 0, label: "YOU ARE HERE" },
  { pct: 25, label: "FUNDAMENTALS" },
  { pct: 50, label: "FIRST PROGRAM" },
  { pct: 75, label: "CREDENTIAL NFT" },
  { pct: 100, label: "CORE DEV" },
];

/* ────────────────────────────────────────────
   COMPONENT
   ──────────────────────────────────────────── */

export function LandingContent({
  featuredCourses,
}: {
  featuredCourses: SanityCourse[];
}) {
  const t = useTranslations("landing");
  const tPaths = useTranslations("learningPaths");

  return (
    <div
      className="flex flex-col"
      style={{
        background: BG,
        backgroundImage:
          "linear-gradient(rgba(20,241,149,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(20,241,149,0.02) 1px, transparent 1px)",
        backgroundSize: "80px 80px",
      }}
    >
      {/* ═══════════════════════════════════════
          HERO — takes full viewport, no scroll needed
      ═══════════════════════════════════════ */}
      <section
        className="relative flex flex-col justify-between overflow-hidden"
        style={{
          minHeight: "100vh",
          borderBottom: `1px solid ${GREEN}15`,
        }}
      >
        {/* Top bar — asymmetric info strip */}
        <div
          className="flex items-center justify-between px-4 sm:px-8 py-4"
          style={{ borderBottom: `1px solid ${GREEN}10`, ...MONO }}
        >
          <span
            className="text-[10px] uppercase tracking-[0.25em]"
            style={{ color: GREEN }}
          >
            SUPERTEAM ACADEMY
          </span>
          <span
            className="text-[10px] uppercase tracking-[0.2em]"
            style={{ color: "rgba(255,255,255,0.15)" }}
          >
            SOLANA // ON-CHAIN EDUCATION
          </span>
        </div>

        {/* Main heading — pushed to the left, bleeding edge */}
        <div className="flex-1 flex flex-col justify-center px-4 sm:px-8 py-8">
          <div className="max-w-[95vw]">
            {/* Tiny label */}
            <div
              className="mb-6 text-[10px] uppercase tracking-[0.3em]"
              style={{ color: "rgba(255,255,255,0.2)", ...MONO }}
            >
              {"// WHERE DEVS BECOME SOLANA BUILDERS"}
            </div>

            {/* HUGE heading — 80% vw */}
            <h1
              className="uppercase leading-[0.85] tracking-[-0.04em]"
              style={{
                ...MONO,
                fontSize: "clamp(2.8rem, 12vw, 10rem)",
                fontWeight: 900,
              }}
            >
              <SplitText
                text="LEARN"
                style={{ color: "white", display: "block" }}
              />
              <span
                className="block"
                style={{
                  fontSize: "clamp(1rem, 3vw, 2rem)",
                  color: "rgba(255,255,255,0.12)",
                  letterSpacing: "0.3em",
                  lineHeight: "2",
                  fontWeight: 400,
                }}
              >
                SOLANA BLOCKCHAIN DEVELOPMENT
              </span>
              <SplitText
                text="BUILD"
                style={{ color: GREEN, display: "block" }}
              />
              <SplitText
                text="EARN."
                style={{
                  color: "rgba(255,255,255,0.15)",
                  display: "block",
                }}
              />
            </h1>

            {/* Subtitle — small, offset right */}
            <div className="mt-8 ml-1 sm:ml-2 max-w-md">
              <p
                className="text-xs leading-relaxed"
                style={{ color: "rgba(255,255,255,0.35)", ...MONO }}
              >
                {t("hero.subtitle")}
              </p>
            </div>

            {/* CTA row */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <StartLearningButton />
              <Link
                href="/courses"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-widest hover:text-white transition-colors"
                style={{ color: "rgba(255,255,255,0.35)", ...MONO }}
              >
                {t("cta.button")}
                <ArrowRight style={{ width: 12, height: 12 }} />
              </Link>
            </div>
          </div>
        </div>

        {/* ── PROGRESS BAR — the memorable element ── */}
        <div
          className="w-full px-4 sm:px-8 pb-6"
          style={{ borderTop: `1px solid ${GREEN}10` }}
        >
          <div className="pt-6">
            <div
              className="flex items-center justify-between mb-3"
              style={{ ...MONO }}
            >
              <span
                className="text-[10px] uppercase tracking-[0.2em]"
                style={{ color: GREEN }}
              >
                YOUR PROGRESS
              </span>
              <span
                className="text-[10px] uppercase tracking-[0.2em]"
                style={{ color: "rgba(255,255,255,0.15)" }}
              >
                0% COMPLETE — START LEARNING →
              </span>
            </div>

            {/* The bar */}
            <div
              className="relative w-full"
              style={{ height: 4, background: `${GREEN}10` }}
            >
              {/* Filled portion — 0% */}
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  height: "100%",
                  width: "2%",
                  background: GREEN,
                }}
              />
            </div>

            {/* Milestones */}
            <div className="relative w-full mt-2 flex justify-between">
              {PROGRESS_MILESTONES.map(({ pct, label }) => (
                <div
                  key={label}
                  className="flex flex-col items-start"
                  style={{
                    width: pct === 0 ? "auto" : undefined,
                    textAlign: pct === 0 ? "left" : "center",
                  }}
                >
                  <span
                    className="text-[9px] uppercase tracking-[0.15em]"
                    style={{
                      color: pct === 0 ? GREEN : "rgba(255,255,255,0.12)",
                      ...MONO,
                      fontWeight: pct === 0 ? 700 : 400,
                    }}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats strip — inline, left-aligned */}
        <div
          className="flex items-stretch"
          style={{ borderTop: `1px solid ${GREEN}10` }}
        >
          {[
            { value: t("stats.coursesValue"), label: t("stats.courses") },
            { value: t("stats.lessonsValue"), label: t("stats.lessons") },
            {
              value: t("stats.challengesValue"),
              label: t("stats.challenges"),
            },
            { value: t("stats.languagesValue"), label: t("stats.languages") },
          ].map(({ value, label }, i) => (
            <div
              key={label}
              className="flex items-center gap-3 px-4 sm:px-8 py-4"
              style={{
                ...MONO,
                borderRight: `1px solid ${GREEN}10`,
                borderLeft:
                  i === 0 ? "none" : undefined,
              }}
            >
              <span
                className="text-lg font-bold tabular-nums"
                style={{ color: "white" }}
              >
                {value}
              </span>
              <span
                className="text-[9px] uppercase tracking-[0.2em]"
                style={{ color: "rgba(255,255,255,0.2)" }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════
          FEATURES — 4 items, asymmetric grid
      ═══════════════════════════════════════ */}
      <section style={{ borderBottom: `1px solid ${GREEN}10` }}>
        <div className="px-4 sm:px-8 py-20">
          {/* Section label — left-aligned with accent line */}
          <div
            className="mb-16 pl-4"
            style={{ borderLeft: `2px solid ${GREEN}` }}
          >
            <span
              className="text-[10px] uppercase tracking-[0.3em] block mb-2"
              style={{ color: GREEN, ...MONO }}
            >
              FEATURES
            </span>
            <h2
              className="text-2xl sm:text-4xl font-bold uppercase text-white"
              style={{ ...MONO }}
            >
              {t("features.title")}
            </h2>
          </div>

          {/* 2x2 grid with uneven sizing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[1px]">
            {[
              { icon: Shield, key: "onChain" as const },
              { icon: Zap, key: "soulboundXP" as const },
              { icon: Trophy, key: "nftCredentials" as const },
              { icon: GraduationCap, key: "openSource" as const },
            ].map(({ icon: Icon, key }, idx) => (
              <div
                key={key}
                className="group relative p-8 transition-colors"
                style={{
                  background: BG,
                  borderLeft:
                    idx === 0
                      ? `2px solid ${GREEN}`
                      : `1px solid ${GREEN}15`,
                  borderTop: `1px solid ${GREEN}15`,
                  borderBottom: `1px solid ${GREEN}15`,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.background =
                    "#050505";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.background = BG;
                }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <Icon
                    style={{ width: 16, height: 16, color: GREEN }}
                    strokeWidth={1.5}
                  />
                  <span
                    className="text-[10px] uppercase tracking-[0.2em]"
                    style={{
                      color: "rgba(255,255,255,0.15)",
                      ...MONO,
                    }}
                  >
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3
                  className="text-sm font-bold text-white mb-2 uppercase"
                  style={{ ...MONO }}
                >
                  {t(`features.${key}.title`)}
                </h3>
                <p
                  className="text-xs leading-relaxed"
                  style={{
                    color: "rgba(255,255,255,0.25)",
                    ...MONO,
                  }}
                >
                  {t(`features.${key}.description`)}
                </p>

                {/* Bottom accent on hover */}
                <div
                  className="absolute bottom-0 left-0 h-[1px] w-0 group-hover:w-full transition-all duration-500"
                  style={{ background: GREEN }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          HOW IT WORKS — 4 steps, vertical timeline feel
      ═══════════════════════════════════════ */}
      <section style={{ borderBottom: `1px solid ${GREEN}10` }}>
        <div className="px-4 sm:px-8 py-20">
          <div
            className="mb-16 pl-4"
            style={{ borderLeft: `2px solid ${GREEN}` }}
          >
            <span
              className="text-[10px] uppercase tracking-[0.3em] block mb-2"
              style={{ color: GREEN, ...MONO }}
            >
              PROCESS
            </span>
            <h2
              className="text-2xl sm:text-4xl font-bold uppercase text-white"
              style={{ ...MONO }}
            >
              {t("howItWorks.title")}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-0">
            {([
              { step: "step1" as const, icon: UserPlus, num: "01" },
              { step: "step2" as const, icon: BookOpen, num: "02" },
              { step: "step3" as const, icon: CheckCircle, num: "03" },
              { step: "step4" as const, icon: Award, num: "04" },
            ] as const).map(({ step, icon: StepIcon, num }, idx) => (
              <div
                key={step}
                className="relative flex items-start gap-6 p-8"
                style={{
                  borderTop:
                    idx === 0
                      ? `2px solid ${GREEN}`
                      : `1px solid ${GREEN}10`,
                  borderLeft: `1px solid ${GREEN}10`,
                }}
              >
                {/* Big number */}
                <span
                  className="text-5xl font-black shrink-0"
                  style={{
                    color: idx === 0 ? GREEN : "rgba(255,255,255,0.04)",
                    ...MONO,
                    lineHeight: 1,
                  }}
                >
                  {num}
                </span>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <StepIcon
                      style={{
                        width: 14,
                        height: 14,
                        color:
                          idx === 0
                            ? GREEN
                            : "rgba(255,255,255,0.2)",
                      }}
                      strokeWidth={1.5}
                    />
                  </div>
                  <h3
                    className="text-sm font-bold text-white mb-2 uppercase"
                    style={{ ...MONO }}
                  >
                    {t(`howItWorks.${step}.title`)}
                  </h3>
                  <p
                    className="text-xs leading-relaxed"
                    style={{
                      color: "rgba(255,255,255,0.25)",
                      ...MONO,
                    }}
                  >
                    {t(`howItWorks.${step}.description`)}
                  </p>
                </div>

                {/* Arrow connector on desktop */}
                {idx < 3 && (
                  <div
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 hidden lg:block z-10"
                    style={{ color: GREEN }}
                  >
                    <ArrowRight style={{ width: 14, height: 14 }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          LEARNING PATHS
      ═══════════════════════════════════════ */}
      <section style={{ borderBottom: `1px solid ${GREEN}10` }}>
        <div className="px-4 sm:px-8 py-20">
          <div
            className="mb-16 pl-4"
            style={{ borderLeft: `2px solid ${GREEN}` }}
          >
            <span
              className="text-[10px] uppercase tracking-[0.3em] block mb-2"
              style={{ color: GREEN, ...MONO }}
            >
              PATHS
            </span>
            <h2
              className="text-2xl sm:text-4xl font-bold uppercase text-white"
              style={{ ...MONO }}
            >
              {tPaths("title")}
            </h2>
            <p
              className="mt-2 text-xs"
              style={{
                color: "rgba(255,255,255,0.25)",
                ...MONO,
              }}
            >
              {tPaths("subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0">
            {([
              {
                key: "solanaFundamentals" as const,
                icon: Layers,
                track: "solana-fundamentals",
                comingSoon: false,
                xp: "1,000",
                badge: "Builder",
              },
              {
                key: "defiDevelopment" as const,
                icon: Zap,
                track: "defi-development",
                comingSoon: true,
                xp: "2,500",
                badge: "DeFi Master",
              },
              {
                key: "nftGaming" as const,
                icon: ImageIcon,
                track: "nft-gaming",
                comingSoon: true,
                xp: "2,000",
                badge: "Creator",
              },
              {
                key: "advancedProtocol" as const,
                icon: Cpu,
                track: "advanced-protocol",
                comingSoon: true,
                xp: "5,000",
                badge: "Core Dev",
              },
            ] as const).map(
              ({ key, icon: PathIcon, track, comingSoon, xp, badge }, idx) => (
                <Link
                  key={key}
                  href={comingSoon ? "#" : `/courses?track=${track}`}
                >
                  <div
                    className="group h-full p-8 flex flex-col transition-colors"
                    style={{
                      background: BG,
                      borderLeft:
                        idx === 0
                          ? `2px solid ${GREEN}`
                          : `1px solid ${GREEN}15`,
                      borderTop: `1px solid ${GREEN}15`,
                      borderBottom: `1px solid ${GREEN}15`,
                      borderRight: `1px solid ${GREEN}15`,
                      opacity: comingSoon ? 0.4 : 1,
                    }}
                    onMouseEnter={(e) => {
                      if (!comingSoon)
                        (e.currentTarget as HTMLDivElement).style.borderLeftColor =
                          GREEN;
                    }}
                    onMouseLeave={(e) => {
                      if (!comingSoon && idx !== 0)
                        (
                          e.currentTarget as HTMLDivElement
                        ).style.borderLeftColor = `${GREEN}15`;
                    }}
                  >
                    <div className="flex items-start justify-between mb-6">
                      <PathIcon
                        style={{ width: 18, height: 18, color: GREEN }}
                        strokeWidth={1.5}
                      />
                      {comingSoon ? (
                        <span
                          className="text-[9px] uppercase tracking-[0.15em]"
                          style={{
                            color: "rgba(255,255,255,0.15)",
                            ...MONO,
                          }}
                        >
                          {tPaths("comingSoon")}
                        </span>
                      ) : (
                        <span
                          className="text-[9px] uppercase tracking-[0.15em] font-bold"
                          style={{ color: GREEN, ...MONO }}
                        >
                          LIVE
                        </span>
                      )}
                    </div>

                    <h3
                      className="text-sm font-bold text-white mb-2 uppercase group-hover:text-[#14F195] transition-colors"
                      style={{ ...MONO }}
                    >
                      {tPaths(`paths.${key}.title`)}
                    </h3>
                    <p
                      className="flex-1 text-xs leading-relaxed mb-6"
                      style={{
                        color: "rgba(255,255,255,0.2)",
                        ...MONO,
                      }}
                    >
                      {tPaths(`paths.${key}.description`)}
                    </p>

                    <div
                      className="pt-4 flex items-center justify-between"
                      style={{ borderTop: `1px solid ${GREEN}10` }}
                    >
                      <div>
                        <div
                          className="text-xs font-bold"
                          style={{ color: GREEN, ...MONO }}
                        >
                          {xp} XP
                        </div>
                        <div
                          className="text-[9px] uppercase tracking-widest"
                          style={{
                            color: "rgba(255,255,255,0.12)",
                            ...MONO,
                          }}
                        >
                          {badge}
                        </div>
                      </div>
                      {!comingSoon && (
                        <ArrowRight
                          style={{
                            width: 14,
                            height: 14,
                            color: "rgba(255,255,255,0.15)",
                          }}
                          className="group-hover:text-[#14F195] group-hover:translate-x-1 transition-all"
                        />
                      )}
                    </div>
                  </div>
                </Link>
              )
            )}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          FEATURED COURSES
      ═══════════════════════════════════════ */}
      {featuredCourses.length > 0 && (
        <section style={{ borderBottom: `1px solid ${GREEN}10` }}>
          <div className="px-4 sm:px-8 py-20">
            <div
              className="mb-16 pl-4"
              style={{ borderLeft: `2px solid ${GREEN}` }}
            >
              <span
                className="text-[10px] uppercase tracking-[0.3em] block mb-2"
                style={{ color: GREEN, ...MONO }}
              >
                COURSES
              </span>
              <h2
                className="text-2xl sm:text-4xl font-bold uppercase text-white"
                style={{ ...MONO }}
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

            <div className="mt-10">
              <Link
                href="/courses"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-widest hover:text-white transition-colors"
                style={{ color: "rgba(255,255,255,0.3)", ...MONO }}
              >
                {t("featuredCourses.viewAll")}
                <ArrowRight style={{ width: 12, height: 12 }} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════
          PARTNERS
      ═══════════════════════════════════════ */}
      <section style={{ borderBottom: `1px solid ${GREEN}10` }}>
        <div className="px-4 sm:px-8 py-16">
          <span
            className="text-[10px] uppercase tracking-[0.3em] block mb-8"
            style={{ color: "rgba(255,255,255,0.12)", ...MONO }}
          >
            {t("partners.title")}
          </span>

          <div className="flex flex-wrap items-center gap-0">
            {["Solana", "Metaplex", "Helius", "Superteam", "Anchor"].map(
              (name) => (
                <div
                  key={name}
                  className="px-6 py-3 cursor-default transition-colors"
                  style={{
                    ...MONO,
                    fontSize: 12,
                    color: "rgba(255,255,255,0.2)",
                    borderLeft: `1px solid ${GREEN}15`,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.color =
                      "rgba(255,255,255,0.6)";
                    (e.currentTarget as HTMLDivElement).style.borderLeftColor =
                      GREEN;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.color =
                      "rgba(255,255,255,0.2)";
                    (
                      e.currentTarget as HTMLDivElement
                    ).style.borderLeftColor = `${GREEN}15`;
                  }}
                >
                  {name}
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          FINAL CTA — brutalist, not centered
      ═══════════════════════════════════════ */}
      <section className="relative">
        <div className="px-4 sm:px-8 py-28">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Big diagonal text */}
            <div
              className="mb-8 text-[10px] uppercase tracking-[0.3em]"
              style={{ color: GREEN, ...MONO }}
            >
              {"// READY?"}
            </div>

            <h2
              className="uppercase leading-[0.85] tracking-[-0.04em] mb-10"
              style={{
                ...MONO,
                fontSize: "clamp(2.5rem, 8vw, 7rem)",
                fontWeight: 900,
              }}
            >
              <span className="block text-white">START</span>
              <span className="block text-white">BUILDING</span>
              <span className="block" style={{ color: GREEN }}>
                ON SOLANA
              </span>
              <span
                className="block"
                style={{ color: "rgba(255,255,255,0.08)" }}
              >
                TODAY.
              </span>
            </h2>

            <p
              className="text-xs mb-8 max-w-xs"
              style={{
                color: "rgba(255,255,255,0.25)",
                ...MONO,
              }}
            >
              Join 500+ developers. Free to start. Real on-chain credentials.
            </p>

            <StartLearningButton />
          </motion.div>
        </div>

        {/* Bottom line */}
        <div style={{ height: 2, background: GREEN, opacity: 0.15 }} />
      </section>
    </div>
  );
}
