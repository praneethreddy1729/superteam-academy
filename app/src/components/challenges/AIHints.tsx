"use client";

import { useState, useCallback, useRef } from "react";
import { useTranslations } from "next-intl";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lightbulb, ChevronRight, HelpCircle, Sparkles, Loader2, AlertCircle } from "lucide-react";

// Hint levels in order of increasing detail
const HINT_LEVEL_LABELS = ["nudge", "approach", "solutionGuide"] as const;
type HintLevelKey = (typeof HINT_LEVEL_LABELS)[number];

const HINT_LEVEL_DESCRIPTIONS: Record<number, string> = {
  1: "nudge (1 sentence, just point in the right direction)",
  2: "approach (2-3 sentences, describe the strategy without giving code)",
  3: "solution guide (step-by-step walkthrough, can include short code snippets but NOT the full solution)",
};

// Fallback hints when CMS has none, keyed by language + difficulty
function getGenericHints(language: "ts" | "rust", difficulty: 1 | 2 | 3): string[] {
  const langLabel = language === "ts" ? "TypeScript" : "Rust";

  const nudge = `Break the problem into smaller parts. What does the function need to return?`;
  const approach =
    difficulty === 1
      ? `Start with the simplest implementation — no edge cases yet. Get the basic case working first.`
      : difficulty === 2
        ? `Think about the data structures involved. Consider what inputs lead to each output, then handle edge cases.`
        : `Consider performance characteristics. In ${langLabel}, think about ownership and borrowing for Rust, or type inference for TypeScript.`;
  const guide = `Review the starter code comments for clues. Look at the test cases — each one tells you what the function must do. Work backwards from the expected outputs.`;

  return [nudge, approach, guide];
}

interface AIHintsProps {
  hints: string[]; // Hints from Sanity CMS (may be empty)
  language: "ts" | "rust";
  difficulty: 1 | 2 | 3;
  challengeTitle?: string;
  starterCode?: string;
  userCode?: string;
}

export function AIHints({ hints, language, difficulty, challengeTitle, starterCode, userCode }: AIHintsProps) {
  const t = useTranslations("challenge.hints");
  const [revealedCount, setRevealedCount] = useState(0);

  // AI hint state
  const [aiHints, setAiHints] = useState<Map<number, string>>(new Map());
  const [aiLoading, setAiLoading] = useState<number | null>(null); // which level is loading
  const [aiError, setAiError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const hasCmsHints = hints.length > 0;

  // Use CMS hints if available, otherwise generate generic ones
  const effectiveHints = hasCmsHints ? hints : getGenericHints(language, difficulty);
  const totalHints = effectiveHints.length;

  const levelKey = (index: number): HintLevelKey => {
    return HINT_LEVEL_LABELS[index] ?? "solutionGuide";
  };

  const levelVariant = (index: number): "outline" | "secondary" | "default" => {
    if (index === 0) return "outline";
    if (index === 1) return "secondary";
    return "default";
  };

  const handleRevealNext = () => {
    if (revealedCount < totalHints) {
      setRevealedCount((prev) => prev + 1);
    }
  };

  const fetchAIHint = useCallback(async (level: number) => {
    if (aiHints.has(level)) return; // Already cached
    if (aiLoading !== null) return; // Already loading another

    setAiLoading(level);
    setAiError(null);

    // Cancel any previous in-flight request
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const langLabel = language === "ts" ? "TypeScript" : "Rust";
    const levelDesc = HINT_LEVEL_DESCRIPTIONS[level] ?? HINT_LEVEL_DESCRIPTIONS[3];

    const systemMessage = `You are a Solana coding instructor for Superteam Academy. Give a ${levelDesc} hint for this challenge. Be concise and pedagogical. Do NOT give the full answer for levels 1-2. Use markdown formatting sparingly (bold for key terms only). Focus on Solana/blockchain concepts when relevant.`;

    const codeContext = userCode && userCode !== starterCode
      ? `\n\nThe student's current code (they've been working on it):\n\`\`\`${langLabel.toLowerCase()}\n${userCode}\n\`\`\``
      : "";

    const userMessage = `Challenge: "${challengeTitle || "Untitled Challenge"}"
Language: ${langLabel}
Difficulty: ${difficulty}/3

Starter code:
\`\`\`${langLabel.toLowerCase()}
${starterCode || "// No starter code available"}
\`\`\`${codeContext}

Give me a level ${level} hint (${levelDesc}).`;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: "user", content: systemMessage + "\n\n" + userMessage },
          ],
        }),
        signal: controller.signal,
      });

      if (!res.ok) {
        throw new Error(`API returned ${res.status}`);
      }

      const data = await res.json();
      const content = data.content || data.error;

      if (data.error) {
        throw new Error(data.error);
      }

      setAiHints((prev) => {
        const next = new Map(prev);
        next.set(level, content);
        return next;
      });
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      setAiError(err instanceof Error ? err.message : "Failed to get AI hint");
    } finally {
      setAiLoading(null);
    }
  }, [aiHints, aiLoading, language, challengeTitle, starterCode, userCode, difficulty]);

  // Determine if AI features are available (we have the challenge context)
  const canUseAI = Boolean(challengeTitle || starterCode);

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="ai-hints" className="border-amber-500/30">
        <AccordionTrigger className="text-sm hover:no-underline gap-2 px-0">
          <span className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-amber-500" aria-hidden="true" />
            <span>{t("title")}</span>
            {revealedCount > 0 && (
              <Badge variant="outline" className="ml-1 text-xs border-amber-500/50 text-amber-600 dark:text-amber-400">
                {t("usedHints", { count: revealedCount, total: totalHints })}
              </Badge>
            )}
            {canUseAI && aiHints.size > 0 && (
              <Badge variant="outline" className="ml-1 text-xs border-violet-500/50 text-violet-600 dark:text-violet-400">
                <Sparkles className="h-2.5 w-2.5 mr-0.5" />
                AI {aiHints.size}/3
              </Badge>
            )}
          </span>
        </AccordionTrigger>
        <AccordionContent className="pb-2">
          <div className="space-y-3 pt-1">
            {/* Unrevealed state prompt */}
            {revealedCount === 0 && aiHints.size === 0 && (
              <p className="text-xs text-muted-foreground italic">{t("thinkFirst")}</p>
            )}

            {/* Revealed CMS/generic hints */}
            {effectiveHints.slice(0, revealedCount).map((hint, index) => (
              <div
                key={`cms-${index}`}
                className="rounded-md border border-border/60 bg-muted/40 p-3 space-y-1.5"
              >
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-3.5 w-3.5 text-amber-500 shrink-0" aria-hidden="true" />
                  <Badge variant={levelVariant(index)} className="text-xs">
                    {t(levelKey(index))}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed pl-5">{hint}</p>
              </div>
            ))}

            {/* Reveal next CMS hint / no more hints */}
            {revealedCount < totalHints ? (
              <Button
                variant="outline"
                size="sm"
                onClick={handleRevealNext}
                className="w-full gap-1.5 border-amber-500/40 text-amber-600 hover:text-amber-700 hover:border-amber-500 dark:text-amber-400 dark:hover:text-amber-300"
                aria-label={t("getNextHint")}
              >
                <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                {t("getNextHint")}
              </Button>
            ) : (
              <p className="text-center text-xs text-muted-foreground py-1">{t("noMoreHints")}</p>
            )}

            {/* ── AI Hints Section ── */}
            {canUseAI && (
              <div className="mt-4 pt-3 border-t border-violet-500/20">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="h-3.5 w-3.5 text-violet-500" />
                  <span className="text-xs font-medium text-violet-600 dark:text-violet-400">
                    Ask AI for Help
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    — contextual hints based on your code
                  </span>
                </div>

                {/* AI hint buttons */}
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3].map((level) => {
                    const isLoading = aiLoading === level;
                    const hasHint = aiHints.has(level);
                    const labels = ["Nudge", "Approach", "Solution Guide"];

                    return (
                      <Button
                        key={level}
                        variant={hasHint ? "secondary" : "outline"}
                        size="sm"
                        disabled={isLoading || (aiLoading !== null && aiLoading !== level)}
                        onClick={() => fetchAIHint(level)}
                        className={`gap-1.5 text-xs transition-all ${hasHint
                          ? "border-violet-500/30 bg-violet-500/10 text-violet-600 dark:text-violet-400"
                          : "border-violet-500/20 text-violet-600 hover:border-violet-500/40 hover:bg-violet-500/5 dark:text-violet-400"
                          }`}
                      >
                        {isLoading ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <Sparkles className="h-3 w-3" />
                        )}
                        {hasHint ? `${labels[level - 1]}` : `L${level}: ${labels[level - 1]}`}
                      </Button>
                    );
                  })}
                </div>

                {/* Error message */}
                {aiError && (
                  <div className="mt-2 flex items-center gap-2 rounded-md border border-red-500/20 bg-red-500/5 px-3 py-2 text-xs text-red-600 dark:text-red-400">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>{aiError}</span>
                  </div>
                )}

                {/* Loading indicator */}
                {aiLoading !== null && (
                  <div className="mt-2 flex items-center gap-2 rounded-md border border-violet-500/20 bg-violet-500/5 px-3 py-2.5">
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-violet-500" />
                    <span className="text-xs text-violet-600 dark:text-violet-400">
                      Generating AI hint...
                    </span>
                  </div>
                )}

                {/* Rendered AI hints */}
                {[1, 2, 3].map((level) => {
                  const hint = aiHints.get(level);
                  if (!hint) return null;
                  const labels = ["Nudge", "Approach", "Solution Guide"];

                  return (
                    <div
                      key={`ai-${level}`}
                      className="mt-2 rounded-md border border-violet-500/20 bg-violet-500/5 p-3 space-y-1.5 animate-in fade-in-0 slide-in-from-bottom-2 duration-300"
                    >
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-3.5 w-3.5 text-violet-500 shrink-0" aria-hidden="true" />
                        <Badge variant={levelVariant(level - 1)} className="text-xs border-violet-500/30">
                          AI {labels[level - 1]}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground leading-relaxed pl-5 whitespace-pre-wrap">
                        {hint}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
