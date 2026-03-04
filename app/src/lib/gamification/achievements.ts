export type AchievementCategory = "progress" | "streaks" | "skills" | "community" | "special" | "xp";

export interface AchievementDefinition {
  id: string;
  name: string;
  description: string;
  category: AchievementCategory;
  bitmapIndex: number; // 0-255, maps to 256-bit bitmap
  icon: string; // lucide icon name
  xpReward: number;
  /** Maximum number of learners who can earn this achievement. undefined = unlimited. */
  supplyCap?: number;
  /** Current number of learners who have claimed this achievement (fetched from API). */
  supplyClaimed?: number;
}

export const ACHIEVEMENT_DEFINITIONS: AchievementDefinition[] = [
  // Progress (3 original)
  { id: "first_steps", name: "First Steps", description: "Complete your first lesson", category: "progress", bitmapIndex: 0, icon: "BookOpen", xpReward: 50 },
  { id: "course_completer", name: "Course Completer", description: "Complete your first course", category: "progress", bitmapIndex: 1, icon: "GraduationCap", xpReward: 300 },
  { id: "speed_runner", name: "Speed Runner", description: "Complete a course in record time", category: "progress", bitmapIndex: 2, icon: "Timer", xpReward: 500, supplyCap: 2500 },
  // Streaks (3 original)
  { id: "week_warrior", name: "Week Warrior", description: "Maintain a 7-day learning streak", category: "streaks", bitmapIndex: 3, icon: "Flame", xpReward: 100 },
  { id: "monthly_master", name: "Monthly Master", description: "Maintain a 30-day learning streak", category: "streaks", bitmapIndex: 4, icon: "Zap", xpReward: 300 },
  { id: "consistency_king", name: "Consistency King", description: "Maintain a 100-day learning streak", category: "streaks", bitmapIndex: 5, icon: "Crown", xpReward: 1000, supplyCap: 500 },
  // Skills (3 original)
  { id: "rust_rookie", name: "Rust Rookie", description: "Complete your first Rust lesson", category: "skills", bitmapIndex: 6, icon: "Code", xpReward: 100 },
  { id: "anchor_expert", name: "Anchor Expert", description: "Master Anchor framework development", category: "skills", bitmapIndex: 7, icon: "Terminal", xpReward: 500, supplyCap: 1000 },
  { id: "full_stack_solana", name: "Full Stack Solana", description: "Complete full-stack Solana development tracks", category: "skills", bitmapIndex: 8, icon: "GitBranch", xpReward: 300 },
  // Community (3 original)
  { id: "helper", name: "Helper", description: "Help other learners in the community", category: "community", bitmapIndex: 9, icon: "Heart", xpReward: 50 },
  { id: "first_comment", name: "First Comment", description: "Leave your first community comment", category: "community", bitmapIndex: 10, icon: "MessageSquare", xpReward: 50 },
  { id: "top_contributor", name: "Top Contributor", description: "Become a top community contributor", category: "community", bitmapIndex: 11, icon: "Award", xpReward: 200, supplyCap: 750 },
  // Special (3 original)
  { id: "early_adopter", name: "Early Adopter", description: "Join Superteam Academy in its early days", category: "special", bitmapIndex: 12, icon: "Star", xpReward: 500, supplyCap: 1000 },
  { id: "bug_hunter", name: "Bug Hunter", description: "Find and report a bug in the platform", category: "special", bitmapIndex: 13, icon: "Search", xpReward: 300, supplyCap: 500 },
  { id: "perfect_score", name: "Perfect Score", description: "Achieve a perfect score on a challenge", category: "special", bitmapIndex: 14, icon: "Trophy", xpReward: 300 },

  // -----------------------------------------------------------------------
  // Learning milestones — progress
  // -----------------------------------------------------------------------
  { id: "lesson_5", name: "Getting Started", description: "Complete 5 lessons", category: "progress", bitmapIndex: 15, icon: "BookMarked", xpReward: 75 },
  { id: "lesson_10", name: "Momentum", description: "Complete 10 lessons", category: "progress", bitmapIndex: 16, icon: "TrendingUp", xpReward: 150 },
  { id: "lesson_25", name: "Dedicated Learner", description: "Complete 25 lessons", category: "progress", bitmapIndex: 17, icon: "Layers", xpReward: 250 },
  { id: "lesson_50", name: "Knowledge Seeker", description: "Complete 50 lessons", category: "progress", bitmapIndex: 18, icon: "Library", xpReward: 500 },
  { id: "course_3", name: "Triple Crown", description: "Complete 3 courses", category: "progress", bitmapIndex: 19, icon: "Package", xpReward: 400 },
  { id: "course_5", name: "Curriculum Master", description: "Complete 5 courses", category: "progress", bitmapIndex: 20, icon: "BookCheck", xpReward: 750 },
  { id: "course_10", name: "Academy Graduate", description: "Complete 10 courses", category: "progress", bitmapIndex: 21, icon: "Medal", xpReward: 1500 },
  { id: "quick_learner", name: "Quick Learner", description: "Complete a lesson in under 5 minutes", category: "progress", bitmapIndex: 22, icon: "Gauge", xpReward: 100 },
  { id: "marathon_day", name: "Marathon Day", description: "Complete an entire course in a single day", category: "progress", bitmapIndex: 23, icon: "Rocket", xpReward: 400 },

  // -----------------------------------------------------------------------
  // Streak achievements — streaks
  // -----------------------------------------------------------------------
  { id: "streak_3", name: "On a Roll", description: "Maintain a 3-day learning streak", category: "streaks", bitmapIndex: 24, icon: "Sparkles", xpReward: 30 },
  { id: "streak_14", name: "Two-Week Grind", description: "Maintain a 14-day learning streak", category: "streaks", bitmapIndex: 25, icon: "CalendarCheck", xpReward: 200 },
  { id: "streak_60", name: "Iron Will", description: "Maintain a 60-day learning streak", category: "streaks", bitmapIndex: 26, icon: "Shield", xpReward: 600 },

  // -----------------------------------------------------------------------
  // XP milestones — xp
  // -----------------------------------------------------------------------
  { id: "xp_100", name: "First Gains", description: "Earn 100 XP", category: "xp", bitmapIndex: 27, icon: "Coins", xpReward: 25 },
  { id: "xp_500", name: "Rising Star", description: "Earn 500 XP", category: "xp", bitmapIndex: 28, icon: "Sparkle", xpReward: 50 },
  { id: "xp_1000", name: "XP Warrior", description: "Earn 1,000 XP", category: "xp", bitmapIndex: 29, icon: "Sword", xpReward: 100 },
  { id: "xp_5000", name: "Power Leveler", description: "Earn 5,000 XP", category: "xp", bitmapIndex: 30, icon: "Bolt", xpReward: 250 },
  { id: "xp_10000", name: "Legendary", description: "Earn 10,000 XP", category: "xp", bitmapIndex: 31, icon: "Gem", xpReward: 1000 },

  // -----------------------------------------------------------------------
  // Credential achievements — skills
  // -----------------------------------------------------------------------
  { id: "first_credential", name: "Credentialed", description: "Earn your first on-chain credential NFT", category: "skills", bitmapIndex: 32, icon: "BadgeCheck", xpReward: 200 },
  { id: "credential_3", name: "Credential Collector", description: "Earn 3 credential NFTs", category: "skills", bitmapIndex: 33, icon: "Wallet", xpReward: 400 },
  { id: "credential_5", name: "Proof of Work", description: "Earn 5 credential NFTs", category: "skills", bitmapIndex: 34, icon: "ShieldCheck", xpReward: 750 },
  { id: "credential_10", name: "Master of Credentials", description: "Earn 10 credential NFTs", category: "skills", bitmapIndex: 35, icon: "Briefcase", xpReward: 1500 },

  // -----------------------------------------------------------------------
  // Social / community
  // -----------------------------------------------------------------------
  { id: "first_post", name: "Speaks Up", description: "Post your first message in the forum", category: "community", bitmapIndex: 36, icon: "Megaphone", xpReward: 50 },
  { id: "course_sharer", name: "Spread the Word", description: "Share a course with others", category: "community", bitmapIndex: 37, icon: "Share2", xpReward: 50 },
  { id: "mentor", name: "Mentor", description: "Help 5 learners in the community", category: "community", bitmapIndex: 38, icon: "Users", xpReward: 300 },

  // -----------------------------------------------------------------------
  // Explorer achievements — special
  // -----------------------------------------------------------------------
  { id: "category_explorer", name: "Category Explorer", description: "Complete courses in 3 different subject categories", category: "special", bitmapIndex: 39, icon: "Compass", xpReward: 350 },
  { id: "polyglot_learner", name: "Polyglot Learner", description: "Complete courses in 2 different languages", category: "special", bitmapIndex: 40, icon: "Globe", xpReward: 300 },
];

export const CATEGORIES: { key: AchievementCategory; color: string }[] = [
  { key: "progress", color: "text-blue-500" },
  { key: "streaks", color: "text-orange-500" },
  { key: "skills", color: "text-green-500" },
  { key: "community", color: "text-purple-500" },
  { key: "special", color: "text-yellow-500" },
  { key: "xp", color: "text-cyan-500" },
];

// Check if achievement is unlocked in bitmap
export function isAchievementUnlocked(bitmap: bigint, index: number): boolean {
  return (bitmap & (1n << BigInt(index))) !== 0n;
}

// ---------------------------------------------------------------------------
// Achievement unlock timestamps (stored in localStorage)
// ---------------------------------------------------------------------------

const UNLOCK_TIMESTAMPS_KEY = "superteam-achievement-unlocked-at";

/** Record the timestamp (ms since epoch) when an achievement was unlocked. */
export function recordAchievementUnlockedAt(achievementId: string, timestamp: number = Date.now()): void {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(UNLOCK_TIMESTAMPS_KEY);
    const stored: Record<string, number> = raw ? (JSON.parse(raw) as Record<string, number>) : {};
    if (!stored[achievementId]) {
      stored[achievementId] = timestamp;
      localStorage.setItem(UNLOCK_TIMESTAMPS_KEY, JSON.stringify(stored));
    }
  } catch {
    // localStorage unavailable — silently skip
  }
}

/** Get the unlock timestamp (ms since epoch) for an achievement, or null if not recorded. */
export function getAchievementUnlockedAt(achievementId: string): number | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(UNLOCK_TIMESTAMPS_KEY);
    if (!raw) return null;
    const stored = JSON.parse(raw) as Record<string, number>;
    return stored[achievementId] ?? null;
  } catch {
    return null;
  }
}
