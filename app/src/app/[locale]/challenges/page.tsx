import { setRequestLocale, getTranslations } from "next-intl/server";
import Link from "next/link";
import { publicClient } from "@/lib/sanity/client";
import { type SanityChallenge } from "@/lib/sanity/queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const revalidate = 60;

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "challenge" });
  const title = t("title");
  return {
    title,
    openGraph: { title, type: "website" },
    twitter: { card: "summary_large_image", title },
  };
}

const DIFFICULTY_LABEL: Record<number, string> = {
  1: "Beginner",
  2: "Intermediate",
  3: "Advanced",
};

const DIFFICULTY_VARIANT: Record<number, "default" | "secondary" | "destructive"> = {
  1: "default",
  2: "secondary",
  3: "destructive",
};

const LANGUAGE_LABEL: Record<string, string> = {
  ts: "TypeScript",
  rust: "Rust",
  json: "JSON",
};

async function getAllChallenges(): Promise<SanityChallenge[]> {
  return publicClient.fetch(
    `*[_type == "challenge"] {
      _id, title, language, difficulty, xpReward, hints
    } | order(difficulty asc)`
  );
}

export default async function ChallengesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "challenge" });

  let challenges: SanityChallenge[] = [];
  try {
    challenges = await getAllChallenges();
  } catch {
    // Fall through to empty state
  }

  const totalXP = challenges.reduce((sum, c) => sum + (c.xpReward ?? 0), 0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      {/* Hero header */}
      <div className="relative mb-12 overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-primary/5 via-background to-accent/5 px-8 py-12">
        <div className="courses-dot-grid pointer-events-none absolute inset-0 opacity-60" />

        <div className="relative z-10 space-y-5">
          <h1 className="gradient-text text-4xl font-bold tracking-tight sm:text-5xl">
            {t("title")}
          </h1>
          <p className="max-w-xl text-base text-muted-foreground">
            Practice coding in TypeScript, Rust, and more. Solve challenges to earn XP.
          </p>

          {challenges.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="courses-stat-pill">
                <span className="courses-stat-pill-dot diff-dot-beginner" />
                {challenges.length} {challenges.length === 1 ? "challenge" : "challenges"}
              </span>
              {totalXP > 0 && (
                <span className="courses-stat-pill">
                  <span
                    className="courses-stat-pill-dot"
                    style={{ background: "hsl(43 96% 52%)" }}
                  />
                  {totalXP.toLocaleString()}+ XP available
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Grid */}
      {challenges.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-24 text-center">
          <p className="text-lg font-medium text-foreground">No challenges yet</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Challenges are coming soon. Check back later!
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {challenges.map((challenge) => (
            <Link
              key={challenge._id}
              href={`/challenges/${challenge._id}`}
              className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl"
            >
              <Card className="h-full transition-all duration-200 group-hover:border-primary/50 group-hover:shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs font-mono">
                      {LANGUAGE_LABEL[challenge.language] ?? challenge.language}
                    </Badge>
                    <Badge variant={DIFFICULTY_VARIANT[challenge.difficulty] ?? "default"}>
                      {DIFFICULTY_LABEL[challenge.difficulty] ?? `Level ${challenge.difficulty}`}
                    </Badge>
                  </div>
                  <CardTitle className="text-base leading-snug line-clamp-2">
                    {challenge.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    {challenge.xpReward != null && challenge.xpReward > 0 ? (
                      <span className="font-medium text-amber-500 dark:text-amber-400">
                        +{challenge.xpReward} XP
                      </span>
                    ) : (
                      <span />
                    )}
                    {challenge.hints && challenge.hints.length > 0 && (
                      <span>
                        {challenge.hints.length} {challenge.hints.length === 1 ? "hint" : "hints"}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
