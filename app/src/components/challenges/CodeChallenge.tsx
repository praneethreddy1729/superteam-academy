"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import confetti from "canvas-confetti";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Play, RotateCcw, Eye, EyeOff, CheckCircle2, XCircle, Loader2,
  Lightbulb, Terminal, Sparkles, ChevronDown,
  Lock, Unlock, GitCompareArrows, Copy, Check,
  Target, ListChecks,
} from "lucide-react";
import type { SanityChallenge } from "@/lib/sanity/queries";
import { AIHints } from "@/components/challenges/AIHints";
import { useProgressStore } from "@/stores/progress-store";
import { useNotificationStore } from "@/stores/notification-store";
import { showXPToast } from "@/components/gamification/XPToast";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useAchievementTrigger } from "@/hooks/useAchievementTrigger";
import { loader } from "@monaco-editor/react";

// Load Monaco from local public/ directory instead of CDN (jsdelivr may be blocked).
loader.config({ paths: { vs: "/monaco/vs" } });

const XP_BY_DIFFICULTY: Record<number, number> = { 1: 25, 2: 50, 3: 100 };

function EditorLoading() {
  const t = useTranslations("challenge");
  return (
    <div className="relative flex h-[400px] w-full items-center justify-center overflow-hidden rounded-lg bg-muted/50 border border-border/30">
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      <div className="flex flex-col items-center gap-3 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin text-primary/60" />
        <span className="text-xs font-medium tracking-wide">{t("initializingEditor")}</span>
      </div>
    </div>
  );
}

const MonacoEditor = dynamic(() => import("@monaco-editor/react").then((m) => m.default), {
  ssr: false,
  loading: () => <EditorLoading />,
});

const MonacoDiffEditor = dynamic(() => import("@monaco-editor/react").then((m) => m.DiffEditor), {
  ssr: false,
  loading: () => <EditorLoading />,
});

async function fetchChallengeById(id: string): Promise<SanityChallenge | null> {
  const { publicClient } = await import("@/lib/sanity/client");
  return publicClient.fetch(
    `*[_type == "challenge" && _id == $id][0] {
      _id, title, description, language, starterCode, solutionCode, testCode, hints, difficulty, xpReward
    }`,
    { id }
  );
}

type TestMessages = {
  noImplementation: string;
  implementationDetected: string;
  allPassed: string;
  passCount: (count: number) => string;
  failCount: (count: number) => string;
  pass: string;
  fail: string;
};

type TestResult = { pattern: string; passed: boolean };

/* ─── Structural Token Extraction ─── */
function extractKeyTokens(code: string): string[] {
  // Strip comments and empty lines, extract meaningful tokens
  const stripped = code
    .split("\n")
    .map((l) => l.replace(/\/\/.*$/, "").trim())
    .filter(Boolean)
    .join("\n");

  const tokens: string[] = [];

  // Extract function/method calls (e.g., getAssociatedTokenAddressSync, getAccountInfo)
  const callMatches = stripped.match(/\b[a-zA-Z_]\w*(?=\s*\()/g);
  if (callMatches) tokens.push(...callMatches.filter((t) => t.length > 3 && !/^(if|for|while|return|const|let|var|function|async|await|import|export|from|new|throw|catch|try)$/.test(t)));

  // Extract property accesses (e.g., connection.getAccountInfo)
  const propMatches = stripped.match(/\w+\.\w+/g);
  if (propMatches) tokens.push(...propMatches.filter((t) => t.length > 5));

  // Extract key identifiers from assignments
  const assignMatches = stripped.match(/(?:const|let|var)\s+(\w+)/g);
  if (assignMatches) tokens.push(...assignMatches.map((m) => m.replace(/^(?:const|let|var)\s+/, "")).filter((t) => t.length > 2));

  // Extract return statement structure presence
  if (stripped.includes("return")) tokens.push("return");

  // Deduplicate
  return [...new Set(tokens)];
}

function runPatternTests(
  code: string,
  testCode: string,
  solutionCode: string,
  msgs: TestMessages
): { passed: boolean; output: string; results: TestResult[] } {
  const patterns = testCode
    .split("\n")
    .filter((l) => l.trim().startsWith("// expect:"))
    .map((l) => l.replace("// expect:", "").trim());

  if (patterns.length === 0) {
    // No explicit patterns → structural comparison against solution
    const trimmed = code.trim();
    if (trimmed === "" || trimmed.includes("// TODO") || trimmed === solutionCode.trim().split("\n").slice(0, 3).join("\n").trim()) {
      return {
        passed: false,
        output: `${msgs.fail}: ${msgs.noImplementation}`,
        results: [],
      };
    }

    // Extract key tokens from solution and check user's code
    const solutionTokens = extractKeyTokens(solutionCode);
    if (solutionTokens.length === 0) {
      // Fallback: at least ensure code has function bodies
      const hasFunctionBody = /\{[\s\S]*\S[\s\S]*\}/.test(code);
      return {
        passed: hasFunctionBody,
        output: hasFunctionBody
          ? `${msgs.pass}: ${msgs.implementationDetected}\n\n${msgs.allPassed}`
          : `${msgs.fail}: ${msgs.noImplementation}`,
        results: [],
      };
    }

    const results: TestResult[] = solutionTokens.map((token) => ({
      pattern: token,
      passed: code.includes(token),
    }));

    const matched = results.filter((r) => r.passed).length;
    const score = matched / solutionTokens.length;

    if (score >= 0.5) {
      return {
        passed: true,
        output: `${msgs.pass}: ${msgs.passCount(matched)}/${solutionTokens.length} key patterns matched\n\n${msgs.allPassed}`,
        results,
      };
    }

    const missing = results.filter((r) => !r.passed).slice(0, 3);
    return {
      passed: false,
      output: `${msgs.fail}: Only ${matched}/${solutionTokens.length} key patterns found\n\nMissing:\n${missing.map((r) => `  • ${r.pattern}`).join("\n")}`,
      results,
    };
  }

  // Explicit patterns mode
  const results: TestResult[] = patterns.map((pattern) => ({
    pattern,
    passed: code.includes(pattern),
  }));

  const failures = results.filter((r) => !r.passed);

  return failures.length === 0
    ? { passed: true, output: `${msgs.pass}: ${msgs.passCount(patterns.length)}`, results }
    : {
      passed: false,
      output: `${msgs.fail}: ${msgs.failCount(failures.length)}\n${failures.map((r) => `  Expected: ${r.pattern}`).join("\n")}`,
      results,
    };
}

/* ─── Component ─── */

interface Props {
  challenge?: SanityChallenge;
  challengeId?: string;
  standalone?: boolean;
  /** When provided, enables the "Mark Lesson Complete" button after all tests pass */
  onMarkComplete?: () => Promise<void>;
  /** Whether the lesson is already marked complete (hides the button) */
  lessonCompleted?: boolean;
}

export function CodeChallenge({ challenge: challengeProp, challengeId, standalone = false, onMarkComplete, lessonCompleted = false }: Props) {
  const t = useTranslations("challenge");
  const tc = useTranslations("common");
  const { resolvedTheme } = useTheme();

  // Data
  const [challenge, setChallenge] = useState<SanityChallenge | null>(challengeProp ?? null);
  const [loadingChallenge, setLoadingChallenge] = useState(!challengeProp && !!challengeId);
  const [code, setCode] = useState(challengeProp?.starterCode ?? "");

  // Test state
  const [output, setOutput] = useState("");
  const [testResult, setTestResult] = useState<"pass" | "fail" | null>(null);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [copiedSolution, setCopiedSolution] = useState(false);
  const [running, setRunning] = useState(false);

  // UI state
  const [showSolution, setShowSolution] = useState(false);
  const [revealedHints, setRevealedHints] = useState(0);
  const [hintPanelOpen, setHintPanelOpen] = useState(false);
  const [outputExpanded, setOutputExpanded] = useState(true);
  const [markingComplete, setMarkingComplete] = useState(false);

  // Refs & stores
  const xpAwardedRef = useRef(false);
  const hasFailedRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  // Diff editor: track edits in a ref to avoid re-renders that reset Monaco cursor/undo
  const diffCodeRef = useRef<string>("");
  // Monaco editor + API refs for marker management
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const editorRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const monacoRef = useRef<any>(null);
  const addBonusXp = useProgressStore((s) => s.addBonusXp);
  const recordActivity = useProgressStore((s) => s.recordActivity);
  const addNotification = useNotificationStore((s) => s.addNotification);
  const { trigger: triggerAchievement } = useAchievementTrigger();

  useEffect(() => () => { clearTimeout(timerRef.current); clearTimeout(saveTimerRef.current); }, []);

  useEffect(() => {
    if (challengeProp) {
      setChallenge(challengeProp);
      const savedCode = typeof window !== "undefined"
        ? localStorage.getItem(`academy:challenge:${challengeProp._id}:code`)
        : null;
      setCode(savedCode ?? challengeProp.starterCode);
      setOutput("");
      setTestResult(null);
      setTestResults([]);
      setShowSolution(false);
      setRevealedHints(0);
      return;
    }
    if (!challengeId) return;
    setLoadingChallenge(true);
    fetchChallengeById(challengeId)
      .then((data) => {
        if (data) {
          setChallenge(data);
          const savedCode = typeof window !== "undefined"
            ? localStorage.getItem(`academy:challenge:${data._id}:code`)
            : null;
          setCode(savedCode ?? data.starterCode);
        }
      })
      .finally(() => setLoadingChallenge(false));
  }, [challengeId, challengeProp]);

  // REQ-345: debounced localStorage save
  const handleCodeChange = useCallback((value: string) => {
    setCode(value);
    if (!challenge) return;
    clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      try {
        localStorage.setItem(`academy:challenge:${challenge._id}:code`, value);
      } catch {
        // quota exceeded — silently ignore
      }
    }, 1000);
  }, [challenge]);

  const copySolution = useCallback(() => {
    if (!challenge?.solutionCode) return;
    navigator.clipboard.writeText(challenge.solutionCode).then(() => {
      setCopiedSolution(true);
      setTimeout(() => setCopiedSolution(false), 2000);
    });
  }, [challenge?.solutionCode]);

  const runTests = useCallback(() => {
    if (!challenge) return;
    setRunning(true);
    setTestResult(null);
    setOutput(`${t("tests.running")}\n`);
    // Auto-expand output when running
    setOutputExpanded(true);
    // Auto-hide solution diff when running tests; sync ref → state first
    const codeToTest = showSolution ? diffCodeRef.current : code;
    if (showSolution) {
      setCode(diffCodeRef.current);
      setShowSolution(false);
    }

    timerRef.current = setTimeout(() => {
      const msgs: TestMessages = {
        noImplementation: t("tests.noImplementation"),
        implementationDetected: t("tests.implementationDetected"),
        allPassed: t("tests.allPassed"),
        passCount: (count: number) => t("tests.passCount", { count }),
        failCount: (count: number) => t("tests.failCount", { count }),
        pass: t("tests.pass"),
        fail: t("tests.fail"),
      };
      const { passed, output: testOutput, results } = runPatternTests(
        codeToTest, challenge.testCode, challenge.solutionCode, msgs
      );
      setTestResult(passed ? "pass" : "fail");
      setTestResults(results);
      setOutput(testOutput);
      setRunning(false);

      // REQ-114: set/clear Monaco error markers
      if (monacoRef.current && editorRef.current) {
        const monacoApi = monacoRef.current;
        const model = editorRef.current.getModel();
        if (model) {
          if (passed) {
            monacoApi.editor.setModelMarkers(model, "tests", []);
          } else {
            const markers: {
              startLineNumber: number; startColumn: number;
              endLineNumber: number; endColumn: number;
              message: string; severity: number;
            }[] = [];

            // General warning on line 1
            markers.push({
              startLineNumber: 1, startColumn: 1,
              endLineNumber: 1, endColumn: model.getLineMaxColumn(1),
              message: "Tests failing — check output panel",
              severity: monacoApi.MarkerSeverity.Warning,
            });

            // Rust-specific: detect missing semicolons and unmatched braces
            if (challenge.language === "rust") {
              const lines = codeToTest.split("\n");
              let openBraces = 0;
              lines.forEach((line, idx) => {
                const lineNum = idx + 1;
                const trimmed = line.trim();
                // Detect likely missing semicolons on statement lines
                if (
                  trimmed.length > 0 &&
                  !trimmed.endsWith(";") &&
                  !trimmed.endsWith("{") &&
                  !trimmed.endsWith("}") &&
                  !trimmed.endsWith(",") &&
                  !trimmed.startsWith("//") &&
                  !trimmed.startsWith("/*") &&
                  !trimmed.startsWith("*") &&
                  !trimmed.startsWith("#") &&
                  /^(let |const |return |msg!|require!|err!|Ok\(|Err\()/.test(trimmed)
                ) {
                  markers.push({
                    startLineNumber: lineNum, startColumn: 1,
                    endLineNumber: lineNum, endColumn: line.length + 1,
                    message: "Possible missing semicolon",
                    severity: monacoApi.MarkerSeverity.Info,
                  });
                }
                // Track brace balance
                for (const ch of line) {
                  if (ch === "{") openBraces++;
                  else if (ch === "}") openBraces--;
                }
              });
              // Mark last line if braces are unbalanced
              if (openBraces !== 0) {
                const lastLine = lines.length;
                markers.push({
                  startLineNumber: lastLine, startColumn: 1,
                  endLineNumber: lastLine, endColumn: model.getLineMaxColumn(lastLine),
                  message: `Unmatched braces (${openBraces > 0 ? "missing closing }" : "extra closing }"})`,
                  severity: monacoApi.MarkerSeverity.Error,
                });
              }
            }

            monacoApi.editor.setModelMarkers(model, "tests", markers);
          }
        }
      }

      if (!passed) {
        hasFailedRef.current = true;
      }

      if (passed && standalone && !xpAwardedRef.current) {
        const xpAmount = challenge.xpReward ?? XP_BY_DIFFICULTY[challenge.difficulty] ?? 25;
        addBonusXp(xpAmount, "challenge_complete");
        recordActivity();
        showXPToast(xpAmount);
        xpAwardedRef.current = true;
        addNotification({
          type: "xp_earned",
          title: t("xpEarned"),
          message: `+${xpAmount} XP`,
        });
        import("@/lib/analytics/events").then(({ trackChallengeComplete }) => {
          trackChallengeComplete(challenge._id, challenge.difficulty);
        }).catch(() => { });
      }
      if (passed) {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
        void triggerAchievement("challenge_complete", { isFirstAttempt: !hasFailedRef.current });
      }
    }, 400);
  }, [challenge, code, standalone, showSolution, t, addBonusXp, recordActivity, addNotification, triggerAchievement]);

  const reset = useCallback(() => {
    if (!challenge) return;
    diffCodeRef.current = "";
    // REQ-345: clear saved code so reset goes back to starterCode
    try {
      localStorage.removeItem(`academy:challenge:${challenge._id}:code`);
    } catch { /* ignore */ }
    setCode(challenge.starterCode);
    setOutput("");
    setTestResult(null);
    setTestResults([]);
    setShowSolution(false);
    setRevealedHints(0);
    hasFailedRef.current = false;
    // REQ-114: clear error markers on reset
    if (monacoRef.current && editorRef.current) {
      const model = editorRef.current.getModel();
      if (model) monacoRef.current.editor.setModelMarkers(model, "tests", []);
    }
  }, [challenge]);

  const handleMarkComplete = useCallback(async () => {
    if (!onMarkComplete || markingComplete) return;
    setMarkingComplete(true);
    try {
      await onMarkComplete();
    } finally {
      setMarkingComplete(false);
    }
  }, [onMarkComplete, markingComplete]);

  useKeyboardShortcuts([
    {
      key: "Enter",
      ctrl: true,
      description: "Run code",
      handler: () => { if (!running && challenge) runTests(); },
      skipWhenTyping: false,
    },
    {
      key: "s",
      ctrl: true,
      description: "Save progress",
      handler: () => { /* auto-saved */ },
      skipWhenTyping: false,
    },
  ]);

  if (loadingChallenge) {
    return (
      <div className="flex h-full items-center justify-center" role="status" aria-label={tc("loading")}>
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" aria-hidden="true" />
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">{t("notFound")}</p>
      </div>
    );
  }

  const difficultyLabel = (["", t("difficulty.beginner"), t("difficulty.intermediate"), t("difficulty.advanced")] as const)[
    challenge.difficulty
  ];
  const monacoLang = challenge.language === "ts" ? "typescript" : challenge.language === "json" ? "json" : "rust";
  const totalHints = (challenge.hints ?? []).length;

  // Parse // expect: lines from testCode for the pre-run checklist
  const expectedPatterns = (challenge.testCode ?? "")
    .split("\n")
    .filter((l) => l.trim().startsWith("// expect:"))
    .map((l) => l.replace("// expect:", "").trim())
    .filter(Boolean);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEditorDidMount = (editor: any, monaco: any) => {
    // REQ-114: store refs for marker management
    editorRef.current = editor;
    monacoRef.current = monaco;

    if (challenge.language === "rust") {
      monaco.languages.registerCompletionItemProvider("rust", {
        provideCompletionItems: (_model: unknown, position: { lineNumber: number; column: number }) => {
          const suggestions = [
            "pub fn", "pub struct", "use anchor_lang::prelude::*",
            "Account", "Program", "Signer", "SystemProgram",
            "msg!", "require!", "err!", "Ok(())",
            "ctx.accounts", "ctx.program_id", "ctx.bumps",
            "#[derive(Accounts)]", "#[account]", "#[program]",
            "declare_id!", "Pubkey", "Clock", "Rent",
          ].map((label) => ({
            label,
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: label,
            range: {
              startLineNumber: position.lineNumber,
              endLineNumber: position.lineNumber,
              startColumn: position.column,
              endColumn: position.column,
            },
          }));
          return { suggestions };
        },
      });
    }
  };

  return (
    <div className="flex h-full flex-col">
      {/* ── Toolbar ── */}
      <div className="relative shrink-0 border-b border-border/40 bg-background/80 backdrop-blur-sm">
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        <div className="flex flex-wrap items-center gap-2 px-3 sm:px-4 py-2">
          {/* Challenge title + badges — compact */}
          <div className="hidden lg:flex items-center gap-2 mr-3 pr-3 border-r border-border/30">
            <span className="text-sm font-semibold truncate max-w-[200px]">{challenge.title}</span>
            <Badge className="text-[10px] font-mono border-primary/30 bg-primary/5 text-primary" variant="outline">
              {challenge.language.toUpperCase()}
            </Badge>
            {difficultyLabel && (
              <Badge className={`text-[10px] ${challenge.difficulty === 1 ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                : challenge.difficulty === 2 ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                  : "bg-red-500/10 text-red-500 border-red-500/20"
                } border`}>
                {difficultyLabel}
              </Badge>
            )}
            <Badge variant="outline" className="gap-1 text-[10px] border-yellow-500/30 bg-yellow-500/5 text-yellow-600 dark:text-yellow-400">
              <Sparkles className="h-2.5 w-2.5" />
              {challenge.xpReward ?? XP_BY_DIFFICULTY[challenge.difficulty] ?? 25} XP
            </Badge>
          </div>

          {/* Run tests — with inline keyboard shortcut */}
          <Button
            onClick={runTests}
            size="sm"
            className="gap-1.5 shadow-sm group shrink-0"
            disabled={running}
          >
            {running ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />}
            {running ? t("running") : t("runTests")}
            {!running && (
              <kbd className="hidden sm:inline-flex ml-1 h-4 items-center rounded border border-border/50 bg-muted/60 px-1 font-mono text-[9px] text-muted-foreground group-hover:border-primary/30">
                ⌘↵
              </kbd>
            )}
          </Button>

          <Button onClick={reset} variant="outline" size="sm" className="gap-1.5">
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{t("reset")}</span>
          </Button>

          {/* Solution toggle — switches editor to side-by-side diff view */}
          <Button
            variant={showSolution ? "default" : "ghost"}
            size="sm"
            className={`gap-1.5 transition-all ${showSolution ? "bg-primary/15 text-primary border border-primary/30 hover:bg-primary/20" : ""}`}
            onClick={() => {
              if (!showSolution) {
                diffCodeRef.current = code;
                setShowSolution(true);
              } else {
                setCode(diffCodeRef.current);
                setShowSolution(false);
              }
            }}
          >
            {showSolution ? (
              <>
                <EyeOff className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{t("hideSolutionToEdit")}</span>
                <span className="sm:hidden">{t("hide")}</span>
              </>
            ) : (
              <>
                <GitCompareArrows className="h-3.5 w-3.5" />
                {t("showSolution")}
              </>
            )}
          </Button>

          {/* Animated status badge */}
          {testResult === "pass" && (
            <Badge className="ml-auto gap-1.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 animate-in fade-in-0 zoom-in-95 duration-300">
              <CheckCircle2 className="h-3.5 w-3.5" />
              {t("allTestsPassed")}
            </Badge>
          )}
          {testResult === "fail" && (
            <Badge className="ml-auto gap-1.5 bg-red-500/10 text-red-400 border border-red-500/20 animate-in fade-in-0 slide-in-from-right-2 duration-300">
              <XCircle className="h-3.5 w-3.5" />
              {t("testsFailing")}
            </Badge>
          )}
        </div>
      </div>

      {/* ── Description / Objectives Card ── */}
      {(challenge.description || expectedPatterns.length > 0) && (
        <div className="shrink-0 border-b border-border/40 bg-muted/10 px-3 sm:px-4 py-3 space-y-3 min-w-0 overflow-hidden">
          {/* Description */}
          {challenge.description && (
            <div className="flex gap-2.5">
              <Target className="h-4 w-4 shrink-0 mt-0.5 text-primary" aria-hidden="true" />
              <div className="space-y-0.5">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {t("objectives")}
                </p>
                <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">
                  {challenge.description}
                </p>
              </div>
            </div>
          )}

          {/* Expected outputs checklist (pre-run) */}
          {expectedPatterns.length > 0 && (
            <div className="flex gap-2.5">
              <ListChecks className="h-4 w-4 shrink-0 mt-0.5 text-amber-500" aria-hidden="true" />
              <div className="space-y-1.5">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {t("expectedOutputs")}
                </p>
                <div className="flex flex-col gap-1">
                  {expectedPatterns.map((pattern, i) => {
                    const result = testResults.find((r) => r.pattern === pattern);
                    const isDone = result?.passed ?? false;
                    const hasRun = testResults.length > 0;
                    return (
                      <div
                        key={i}
                        className={`flex items-center gap-2 text-xs font-mono transition-colors duration-300 ${isDone
                          ? "text-emerald-500"
                          : hasRun
                            ? "text-red-400"
                            : "text-muted-foreground"
                          }`}
                      >
                        {isDone ? (
                          <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                        ) : (
                          <div className={`h-3.5 w-3.5 shrink-0 rounded-full border ${hasRun ? "border-red-500/50 bg-red-500/10" : "border-border/50"}`} />
                        )}
                        <span className="truncate">{pattern}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Editor Area — toggles between normal editor and diff view ── */}
      <div className="flex-1 min-h-[200px] relative">
        {showSolution && (
          <div className="absolute top-2 left-0 right-0 z-10 flex items-center justify-center pointer-events-none animate-in fade-in-0 slide-in-from-top-2 duration-300">
            <div className="pointer-events-auto flex flex-wrap items-center justify-center gap-2 sm:gap-3 rounded-full border border-primary/20 bg-background/90 backdrop-blur-sm px-3 sm:px-4 py-1.5 shadow-lg max-w-[90vw]">
              <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <Eye className="h-3 w-3 text-primary" />
                {t("yourCode")}
              </span>
              <span className="text-[10px] text-muted-foreground/40">←  {t("diff")}  →</span>
              <span className="text-xs font-medium text-emerald-500 flex items-center gap-1.5">
                <CheckCircle2 className="h-3 w-3" />
                {t("solution")}
              </span>
              <div className="w-px h-3 bg-border/40" />
              <button
                onClick={copySolution}
                className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
              >
                {copiedSolution ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                {copiedSolution ? t("copied") : t("copy")}
              </button>
            </div>
          </div>
        )}

        {showSolution ? (
          <MonacoDiffEditor
            height="100%"
            language={monacoLang}
            theme={resolvedTheme === "dark" ? "vs-dark" : "light"}
            original={diffCodeRef.current}
            modified={challenge.solutionCode}
            onMount={(editor) => {
              const originalModel = editor.getOriginalEditor();
              // Update ref only — no setCode, so no re-render, cursor/undo preserved
              originalModel.onDidChangeModelContent(() => {
                diffCodeRef.current = originalModel.getValue();
              });
            }}
            options={{
              fontSize: 14,
              minimap: { enabled: false },
              fontFamily: "var(--font-mono), 'JetBrains Mono', monospace",
              padding: { top: 40, bottom: 16 },
              scrollBeyondLastLine: false,
              renderSideBySide: true,
              originalEditable: true,
              renderOverviewRuler: false,
              diffWordWrap: "on" as const,
              ariaLabel: "Solution diff view — left panel is editable",
            }}
          />
        ) : (
          <MonacoEditor
            height="100%"
            language={monacoLang}
            theme={resolvedTheme === "dark" ? "vs-dark" : "light"}
            value={code}
            onChange={(v) => handleCodeChange(v ?? "")}
            onMount={handleEditorDidMount}
            options={{
              fontSize: 14,
              minimap: { enabled: false },
              fontFamily: "var(--font-mono), 'JetBrains Mono', monospace",
              padding: { top: 16, bottom: 16 },
              scrollBeyondLastLine: false,
              tabSize: 2,
              ariaLabel: t("codeEditorLabel"),
              suggestOnTriggerCharacters: true,
              quickSuggestions: { other: true, strings: true, comments: false },
              acceptSuggestionOnEnter: "on" as const,
              wordBasedSuggestions: "currentDocument" as const,
              parameterHints: { enabled: true },
            }}
          />
        )}

        {/* ── Floating Hint Pill ── persistent, bottom-right of editor */}
        {totalHints > 0 && !hintPanelOpen && (
          <button
            onClick={() => setHintPanelOpen(true)}
            className="absolute bottom-3 right-3 z-20 flex items-center gap-2 rounded-full border border-amber-500/30 bg-background/90 backdrop-blur-sm px-3 py-1.5 shadow-lg hover:border-amber-500/60 hover:bg-amber-500/5 transition-all duration-200 group animate-in fade-in-0 slide-in-from-bottom-2 duration-300"
            aria-label={t("hints.title")}
          >
            <Lightbulb className="h-3.5 w-3.5 text-amber-500 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
              {revealedHints > 0
                ? `${revealedHints}/${totalHints}`
                : t("hints.hintsAvailable", { count: totalHints })}
            </span>
            {revealedHints > 0 && (
              <div className="flex gap-0.5">
                {(challenge.hints ?? []).map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 w-2.5 rounded-full transition-colors ${i < revealedHints ? "bg-amber-500" : "bg-border/50"}`}
                  />
                ))}
              </div>
            )}
          </button>
        )}
      </div>

      {/* ── Bottom Panel: Test Results + Output + Info Card ── */}
      <div className="shrink-0 border-t border-border/40">
        {/* Test Results */}
        {testResults.length > 0 && (
          <div className="border-b border-border/30 px-4 py-2.5 bg-muted/10">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">{t("testCases")}</p>
            <div className="flex flex-wrap gap-1.5">
              {testResults.map((result, i) => (
                <div
                  key={i}
                  className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-mono ${result.passed
                    ? "bg-emerald-500/5 text-emerald-500 border border-emerald-500/15"
                    : "bg-red-500/5 text-red-400 border border-red-500/15"
                    }`}
                >
                  {result.passed ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                  <span className="truncate max-w-[180px]">{result.pattern}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Output Console */}
        {output && (
          <div className={`border-b transition-colors duration-300 ${testResult === "pass" ? "border-emerald-500/30" : testResult === "fail" ? "border-red-500/30" : "border-border/30"
            }`}>
            <button
              onClick={() => setOutputExpanded(!outputExpanded)}
              className="flex w-full items-center gap-2 px-4 py-1.5 text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <Terminal className={`h-3 w-3 transition-colors ${testResult === "pass" ? "text-emerald-500" : testResult === "fail" ? "text-red-400" : ""
                }`} />
              {t("output")}
              {testResult && (
                <span className={`ml-1 text-[9px] font-mono px-1.5 py-0.5 rounded-full ${testResult === "pass" ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-400"
                  }`}>
                  {testResult === "pass" ? "PASS" : "FAIL"}
                </span>
              )}
              <ChevronDown className={`h-3 w-3 ml-auto transition-transform duration-200 ${outputExpanded ? "rotate-180" : ""}`} />
            </button>
            {outputExpanded && (
              <div aria-live="assertive" className="max-h-32 overflow-auto px-4 pb-2 bg-background/50">
                <pre className={`font-mono text-xs leading-relaxed whitespace-pre-wrap break-words ${testResult === "pass" ? "text-emerald-600 dark:text-emerald-400"
                    : testResult === "fail" ? "text-red-600 dark:text-red-400"
                      : "text-foreground/80"
                  }`}>
                  {output}
                </pre>
              </div>
            )}
          </div>
        )}

        {/* ── Mark Lesson Complete ── shown when tests pass and lesson context is available */}
        {onMarkComplete && testResult === "pass" && !lessonCompleted && (
          <div className="border-b border-emerald-500/30 bg-emerald-500/5 px-4 py-2.5 animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3">
              <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                {t("testsPassedMarkComplete")}
              </p>
              <Button
                onClick={handleMarkComplete}
                disabled={markingComplete}
                size="sm"
                className="shrink-0 gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white border-0"
                aria-label={t("markComplete")}
              >
                {markingComplete ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <CheckCircle2 className="h-3.5 w-3.5" />
                )}
                {markingComplete ? t("markCompleting") : t("markComplete")}
              </Button>
            </div>
          </div>
        )}

        {/* Already completed notice */}
        {onMarkComplete && lessonCompleted && (
          <div className="border-b border-emerald-500/20 bg-emerald-500/5 px-4 py-2 animate-in fade-in-0 duration-300">
            <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              <CheckCircle2 className="h-3.5 w-3.5" />
              {t("allTestsPassed")}
            </div>
          </div>
        )}

        {/* ── Mobile Challenge Info Bar (visible on small screens only) ── */}
        <div className="lg:hidden border-b border-border/30 bg-muted/10 px-3 py-1.5 flex items-center gap-1.5">
          <span className="text-xs font-semibold truncate">{challenge.title}</span>
          <Badge className="text-[9px] font-mono ml-auto" variant="outline">{challenge.language.toUpperCase()}</Badge>
          <Badge variant="outline" className="gap-0.5 text-[9px] border-yellow-500/30 text-yellow-500">
            <Sparkles className="h-2 w-2" />{challenge.xpReward ?? XP_BY_DIFFICULTY[challenge.difficulty] ?? 25}
          </Badge>
        </div>

        {/* ── Slide-up Hint Panel ── */}
        {totalHints > 0 && hintPanelOpen && (
          <div className="border-t border-amber-500/30 bg-gradient-to-t from-amber-500/[0.03] to-transparent animate-in slide-in-from-bottom-4 fade-in-0 duration-300">
            {/* Panel header */}
            <div className="flex items-center justify-between px-3 sm:px-4 py-2 border-b border-border/30">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-amber-500" />
                <span className="text-sm font-medium">{t("hints.title")}</span>
                <span className="text-xs text-muted-foreground">({revealedHints}/{totalHints})</span>
              </div>
              <button
                onClick={() => setHintPanelOpen(false)}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors rounded-md px-2 py-1 hover:bg-muted/30"
              >
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Hint progress bar */}
            <div className="flex gap-1 px-3 sm:px-4 pt-2">
              {(challenge.hints ?? []).map((_, i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-all duration-500 ${i < revealedHints ? "bg-amber-500" : "bg-border/40"}`}
                />
              ))}
            </div>

            {/* Hint cards — progressive disclosure */}
            <div className="px-3 sm:px-4 py-3 space-y-2 max-h-[280px] overflow-y-auto">
              {(challenge.hints ?? []).map((hint, i) => {
                const isRevealed = i < revealedHints;
                const isNext = i === revealedHints;
                const levelLabels = [
                  t("hints.hintLevel1Label"),
                  t("hints.hintLevel2Label"),
                  t("hints.hintLevel3Label"),
                ];
                const levelDescs = [
                  t("hints.hintLevel1Desc"),
                  t("hints.hintLevel2Desc"),
                  t("hints.hintLevel3Desc"),
                ];
                const levelIcons = [
                  <Lightbulb key="l" className="h-3.5 w-3.5" />,
                  <Target key="t" className="h-3.5 w-3.5" />,
                  <Sparkles key="s" className="h-3.5 w-3.5" />,
                ];

                return (
                  <div
                    key={i}
                    className={`rounded-lg border p-3 transition-all duration-300 ${
                      isRevealed
                        ? "border-amber-500/25 bg-amber-500/[0.06]"
                        : isNext
                          ? "border-amber-500/15 bg-muted/20"
                          : "border-border/20 bg-muted/10 opacity-50"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5 flex-1 min-w-0">
                        {/* Level badge */}
                        <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full mt-0.5 ${
                          isRevealed
                            ? "bg-amber-500/15 text-amber-500"
                            : "bg-border/30 text-muted-foreground"
                        }`}>
                          {isRevealed ? levelIcons[i] ?? levelIcons[0] : <Lock className="h-3 w-3" />}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-semibold ${isRevealed ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground"}`}>
                              {levelLabels[i] ?? levelLabels[2]}
                            </span>
                            {isRevealed && (
                              <span className="text-[9px] font-mono uppercase tracking-wider text-amber-500/60">
                                {t("hints.revealed")}
                              </span>
                            )}
                          </div>
                          {isRevealed ? (
                            <p className="text-sm leading-relaxed text-foreground/85 mt-1.5 whitespace-pre-wrap">
                              {hint}
                            </p>
                          ) : (
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {levelDescs[i] ?? levelDescs[2]}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Reveal button — only on the next unrevealed hint */}
                      {isNext && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="shrink-0 gap-1.5 text-xs border-amber-500/40 text-amber-600 hover:text-amber-500 hover:border-amber-500 hover:bg-amber-500/10 dark:text-amber-400 dark:hover:text-amber-300"
                          onClick={() => setRevealedHints((r) => Math.min(r + 1, totalHints))}
                        >
                          <Unlock className="h-3 w-3" />
                          {t("hints.reveal")}
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* AI Hints — nested inside the hint panel */}
              <AIHints
                hints={challenge.hints ?? []}
                language={challenge.language === "json" ? "ts" : challenge.language}
                difficulty={challenge.difficulty}
                challengeTitle={challenge.title}
                starterCode={challenge.starterCode}
                userCode={code}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
