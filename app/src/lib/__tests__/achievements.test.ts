import { describe, it, expect } from "vitest";
import {
  ACHIEVEMENT_DEFINITIONS,
  CATEGORIES,
  isAchievementUnlocked,
  type AchievementCategory,
  type AchievementDefinition,
} from "../gamification/achievements";

// ---------------------------------------------------------------------------
// ACHIEVEMENT_DEFINITIONS structure
// ---------------------------------------------------------------------------

describe("ACHIEVEMENT_DEFINITIONS — structure", () => {
  it("has at least 30 achievement definitions", () => {
    expect(ACHIEVEMENT_DEFINITIONS.length).toBeGreaterThanOrEqual(30);
  });

  it("every definition has a unique id", () => {
    const ids = ACHIEVEMENT_DEFINITIONS.map((a) => a.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ACHIEVEMENT_DEFINITIONS.length);
  });

  it("every definition has a unique bitmapIndex", () => {
    const indices = ACHIEVEMENT_DEFINITIONS.map((a) => a.bitmapIndex);
    const unique = new Set(indices);
    expect(unique.size).toBe(ACHIEVEMENT_DEFINITIONS.length);
  });

  it("bitmapIndex values start at 0", () => {
    const indices = ACHIEVEMENT_DEFINITIONS.map((a) => a.bitmapIndex);
    expect(Math.min(...indices)).toBe(0);
  });

  it("all bitmapIndex values are within the 256-bit bitmap range", () => {
    for (const def of ACHIEVEMENT_DEFINITIONS) {
      expect(def.bitmapIndex).toBeGreaterThanOrEqual(0);
      expect(def.bitmapIndex).toBeLessThan(256);
    }
  });

  it("every definition has a non-empty icon string", () => {
    for (const def of ACHIEVEMENT_DEFINITIONS) {
      expect(def.icon).toBeTruthy();
    }
  });

  it("every definition has a positive xpReward", () => {
    for (const def of ACHIEVEMENT_DEFINITIONS) {
      expect(def.xpReward).toBeGreaterThan(0);
    }
  });

  it("every definition has a valid category", () => {
    const validCategories: AchievementCategory[] = ["progress", "streaks", "skills", "community", "special", "xp"];
    for (const def of ACHIEVEMENT_DEFINITIONS) {
      expect(validCategories).toContain(def.category);
    }
  });

  it("every definition has a non-empty name", () => {
    for (const def of ACHIEVEMENT_DEFINITIONS) {
      expect(def.name.trim().length).toBeGreaterThan(0);
    }
  });

  it("every definition has a non-empty description", () => {
    for (const def of ACHIEVEMENT_DEFINITIONS) {
      expect(def.description.trim().length).toBeGreaterThan(0);
    }
  });
});

// ---------------------------------------------------------------------------
// Category distribution
// ---------------------------------------------------------------------------

describe("ACHIEVEMENT_DEFINITIONS — category counts", () => {
  function countByCategory(cat: AchievementCategory): number {
    return ACHIEVEMENT_DEFINITIONS.filter((a) => a.category === cat).length;
  }

  it("has at least 3 progress achievements", () => {
    expect(countByCategory("progress")).toBeGreaterThanOrEqual(3);
  });

  it("has at least 3 streak achievements", () => {
    expect(countByCategory("streaks")).toBeGreaterThanOrEqual(3);
  });

  it("has at least 3 skills achievements", () => {
    expect(countByCategory("skills")).toBeGreaterThanOrEqual(3);
  });

  it("has at least 3 community achievements", () => {
    expect(countByCategory("community")).toBeGreaterThanOrEqual(3);
  });

  it("has at least 3 special achievements", () => {
    expect(countByCategory("special")).toBeGreaterThanOrEqual(3);
  });

  it("has at least 3 xp achievements", () => {
    expect(countByCategory("xp")).toBeGreaterThanOrEqual(3);
  });

  it("all categories together cover all achievements", () => {
    const allCategories: AchievementCategory[] = ["progress", "streaks", "skills", "community", "special", "xp"];
    const total = allCategories.reduce(
      (sum, cat) => sum + ACHIEVEMENT_DEFINITIONS.filter((a) => a.category === cat).length,
      0
    );
    expect(total).toBe(ACHIEVEMENT_DEFINITIONS.length);
  });
});

// ---------------------------------------------------------------------------
// Specific achievement IDs — original 15 bounty spec badges
// ---------------------------------------------------------------------------

describe("ACHIEVEMENT_DEFINITIONS — original bounty spec badges", () => {
  function findById(id: string): AchievementDefinition {
    const found = ACHIEVEMENT_DEFINITIONS.find((a) => a.id === id);
    if (!found) throw new Error(`Achievement not found: ${id}`);
    return found;
  }

  // Progress
  it("first_steps is a progress achievement with bitmapIndex 0", () => {
    const a = findById("first_steps");
    expect(a.name).toBe("First Steps");
    expect(a.category).toBe("progress");
    expect(a.bitmapIndex).toBe(0);
  });

  it("course_completer is a progress achievement", () => {
    const a = findById("course_completer");
    expect(a.name).toBe("Course Completer");
    expect(a.category).toBe("progress");
  });

  it("speed_runner is a progress achievement", () => {
    const a = findById("speed_runner");
    expect(a.name).toBe("Speed Runner");
    expect(a.category).toBe("progress");
  });

  // Streaks
  it("week_warrior is a streaks achievement", () => {
    const a = findById("week_warrior");
    expect(a.name).toBe("Week Warrior");
    expect(a.category).toBe("streaks");
  });

  it("monthly_master is a streaks achievement", () => {
    const a = findById("monthly_master");
    expect(a.name).toBe("Monthly Master");
    expect(a.category).toBe("streaks");
  });

  it("consistency_king is a streaks achievement with xpReward 1000", () => {
    const a = findById("consistency_king");
    expect(a.name).toBe("Consistency King");
    expect(a.category).toBe("streaks");
    expect(a.xpReward).toBe(1000);
  });

  // Skills
  it("rust_rookie is a skills achievement", () => {
    const a = findById("rust_rookie");
    expect(a.name).toBe("Rust Rookie");
    expect(a.category).toBe("skills");
  });

  it("anchor_expert is a skills achievement", () => {
    const a = findById("anchor_expert");
    expect(a.name).toBe("Anchor Expert");
    expect(a.category).toBe("skills");
  });

  it("full_stack_solana is a skills achievement", () => {
    const a = findById("full_stack_solana");
    expect(a.name).toBe("Full Stack Solana");
    expect(a.category).toBe("skills");
  });

  // Community
  it("helper is a community achievement", () => {
    const a = findById("helper");
    expect(a.name).toBe("Helper");
    expect(a.category).toBe("community");
  });

  it("first_comment is a community achievement", () => {
    const a = findById("first_comment");
    expect(a.name).toBe("First Comment");
    expect(a.category).toBe("community");
  });

  it("top_contributor is a community achievement", () => {
    const a = findById("top_contributor");
    expect(a.name).toBe("Top Contributor");
    expect(a.category).toBe("community");
  });

  // Special
  it("early_adopter is a special achievement with xpReward 500", () => {
    const a = findById("early_adopter");
    expect(a.name).toBe("Early Adopter");
    expect(a.category).toBe("special");
    expect(a.xpReward).toBe(500);
  });

  it("bug_hunter is a special achievement", () => {
    const a = findById("bug_hunter");
    expect(a.name).toBe("Bug Hunter");
    expect(a.category).toBe("special");
  });

  it("perfect_score is a special achievement with bitmapIndex 14", () => {
    const a = findById("perfect_score");
    expect(a.name).toBe("Perfect Score");
    expect(a.category).toBe("special");
    expect(a.bitmapIndex).toBe(14);
  });
});

// ---------------------------------------------------------------------------
// New achievements — learning milestones
// ---------------------------------------------------------------------------

describe("ACHIEVEMENT_DEFINITIONS — learning milestone achievements", () => {
  function findById(id: string): AchievementDefinition {
    const found = ACHIEVEMENT_DEFINITIONS.find((a) => a.id === id);
    if (!found) throw new Error(`Achievement not found: ${id}`);
    return found;
  }

  it("lesson_5 is a progress achievement", () => {
    const a = findById("lesson_5");
    expect(a.category).toBe("progress");
    expect(a.xpReward).toBeGreaterThan(0);
  });

  it("lesson_10 is a progress achievement", () => {
    const a = findById("lesson_10");
    expect(a.category).toBe("progress");
  });

  it("lesson_25 is a progress achievement", () => {
    const a = findById("lesson_25");
    expect(a.category).toBe("progress");
  });

  it("lesson_50 is a progress achievement", () => {
    const a = findById("lesson_50");
    expect(a.category).toBe("progress");
  });

  it("course_3 is a progress achievement", () => {
    const a = findById("course_3");
    expect(a.category).toBe("progress");
  });

  it("course_5 is a progress achievement", () => {
    const a = findById("course_5");
    expect(a.category).toBe("progress");
  });

  it("course_10 is a progress achievement", () => {
    const a = findById("course_10");
    expect(a.category).toBe("progress");
  });

  it("quick_learner is a progress achievement", () => {
    const a = findById("quick_learner");
    expect(a.category).toBe("progress");
  });

  it("marathon_day is a progress achievement", () => {
    const a = findById("marathon_day");
    expect(a.category).toBe("progress");
  });
});

// ---------------------------------------------------------------------------
// New achievements — streak milestones
// ---------------------------------------------------------------------------

describe("ACHIEVEMENT_DEFINITIONS — streak milestone achievements", () => {
  function findById(id: string): AchievementDefinition {
    const found = ACHIEVEMENT_DEFINITIONS.find((a) => a.id === id);
    if (!found) throw new Error(`Achievement not found: ${id}`);
    return found;
  }

  it("streak_3 is a streaks achievement", () => {
    const a = findById("streak_3");
    expect(a.category).toBe("streaks");
  });

  it("streak_14 is a streaks achievement", () => {
    const a = findById("streak_14");
    expect(a.category).toBe("streaks");
  });

  it("streak_60 is a streaks achievement", () => {
    const a = findById("streak_60");
    expect(a.category).toBe("streaks");
  });
});

// ---------------------------------------------------------------------------
// New achievements — XP milestones
// ---------------------------------------------------------------------------

describe("ACHIEVEMENT_DEFINITIONS — XP milestone achievements", () => {
  function findById(id: string): AchievementDefinition {
    const found = ACHIEVEMENT_DEFINITIONS.find((a) => a.id === id);
    if (!found) throw new Error(`Achievement not found: ${id}`);
    return found;
  }

  it("xp_100 is an xp achievement", () => {
    const a = findById("xp_100");
    expect(a.category).toBe("xp");
  });

  it("xp_500 is an xp achievement", () => {
    const a = findById("xp_500");
    expect(a.category).toBe("xp");
  });

  it("xp_1000 is an xp achievement", () => {
    const a = findById("xp_1000");
    expect(a.category).toBe("xp");
  });

  it("xp_5000 is an xp achievement", () => {
    const a = findById("xp_5000");
    expect(a.category).toBe("xp");
  });

  it("xp_10000 is an xp achievement with xpReward 1000", () => {
    const a = findById("xp_10000");
    expect(a.category).toBe("xp");
    expect(a.xpReward).toBe(1000);
  });

  it("xp milestones have strictly increasing xpReward values", () => {
    const milestones = ["xp_100", "xp_500", "xp_1000", "xp_5000", "xp_10000"];
    const rewards = milestones.map((id) => {
      const found = ACHIEVEMENT_DEFINITIONS.find((a) => a.id === id);
      if (!found) throw new Error(`Achievement not found: ${id}`);
      return found.xpReward;
    });
    for (let i = 1; i < rewards.length; i++) {
      expect(rewards[i]).toBeGreaterThan(rewards[i - 1]!);
    }
  });
});

// ---------------------------------------------------------------------------
// New achievements — credentials
// ---------------------------------------------------------------------------

describe("ACHIEVEMENT_DEFINITIONS — credential achievements", () => {
  function findById(id: string): AchievementDefinition {
    const found = ACHIEVEMENT_DEFINITIONS.find((a) => a.id === id);
    if (!found) throw new Error(`Achievement not found: ${id}`);
    return found;
  }

  it("first_credential is a skills achievement", () => {
    const a = findById("first_credential");
    expect(a.category).toBe("skills");
  });

  it("credential_3 is a skills achievement", () => {
    const a = findById("credential_3");
    expect(a.category).toBe("skills");
  });

  it("credential_5 is a skills achievement", () => {
    const a = findById("credential_5");
    expect(a.category).toBe("skills");
  });

  it("credential_10 is a skills achievement with xpReward 1500", () => {
    const a = findById("credential_10");
    expect(a.category).toBe("skills");
    expect(a.xpReward).toBe(1500);
  });
});

// ---------------------------------------------------------------------------
// New achievements — social / community
// ---------------------------------------------------------------------------

describe("ACHIEVEMENT_DEFINITIONS — social and community achievements", () => {
  function findById(id: string): AchievementDefinition {
    const found = ACHIEVEMENT_DEFINITIONS.find((a) => a.id === id);
    if (!found) throw new Error(`Achievement not found: ${id}`);
    return found;
  }

  it("first_post is a community achievement", () => {
    const a = findById("first_post");
    expect(a.category).toBe("community");
  });

  it("course_sharer is a community achievement", () => {
    const a = findById("course_sharer");
    expect(a.category).toBe("community");
  });

  it("mentor is a community achievement", () => {
    const a = findById("mentor");
    expect(a.category).toBe("community");
  });
});

// ---------------------------------------------------------------------------
// New achievements — explorer
// ---------------------------------------------------------------------------

describe("ACHIEVEMENT_DEFINITIONS — explorer achievements", () => {
  function findById(id: string): AchievementDefinition {
    const found = ACHIEVEMENT_DEFINITIONS.find((a) => a.id === id);
    if (!found) throw new Error(`Achievement not found: ${id}`);
    return found;
  }

  it("category_explorer is a special achievement", () => {
    const a = findById("category_explorer");
    expect(a.category).toBe("special");
  });

  it("polyglot_learner is a special achievement", () => {
    const a = findById("polyglot_learner");
    expect(a.category).toBe("special");
  });
});

// ---------------------------------------------------------------------------
// isAchievementUnlocked
// ---------------------------------------------------------------------------

describe("isAchievementUnlocked — bitmap checks", () => {
  it("returns false for any index when bitmap is 0n", () => {
    expect(isAchievementUnlocked(0n, 0)).toBe(false);
    expect(isAchievementUnlocked(0n, 7)).toBe(false);
    expect(isAchievementUnlocked(0n, 14)).toBe(false);
    expect(isAchievementUnlocked(0n, 39)).toBe(false);
  });

  it("returns true for index 0 when bit 0 is set", () => {
    expect(isAchievementUnlocked(1n, 0)).toBe(true);
  });

  it("returns false for index 1 when only bit 0 is set", () => {
    expect(isAchievementUnlocked(1n, 1)).toBe(false);
  });

  it("returns true for index 1 when bit 1 is set", () => {
    expect(isAchievementUnlocked(2n, 1)).toBe(true);
  });

  it("returns true for index 5 when bit 5 is set", () => {
    const bitmap = 1n << 5n;
    expect(isAchievementUnlocked(bitmap, 5)).toBe(true);
  });

  it("returns false for index 4 when only bit 5 is set", () => {
    const bitmap = 1n << 5n;
    expect(isAchievementUnlocked(bitmap, 4)).toBe(false);
  });

  it("returns true for index 14 when bit 14 is set", () => {
    const bitmap = 1n << 14n;
    expect(isAchievementUnlocked(bitmap, 14)).toBe(true);
  });

  it("returns true for index 39 when bit 39 is set", () => {
    const bitmap = 1n << 39n;
    expect(isAchievementUnlocked(bitmap, 39)).toBe(true);
  });

  it("returns false for index 38 when only bit 39 is set", () => {
    const bitmap = 1n << 39n;
    expect(isAchievementUnlocked(bitmap, 38)).toBe(false);
  });

  it("correctly identifies multiple unlocked achievements simultaneously", () => {
    const bitmap = (1n << 0n) | (1n << 5n) | (1n << 14n) | (1n << 31n);
    expect(isAchievementUnlocked(bitmap, 0)).toBe(true);
    expect(isAchievementUnlocked(bitmap, 5)).toBe(true);
    expect(isAchievementUnlocked(bitmap, 14)).toBe(true);
    expect(isAchievementUnlocked(bitmap, 31)).toBe(true);
    expect(isAchievementUnlocked(bitmap, 1)).toBe(false);
    expect(isAchievementUnlocked(bitmap, 7)).toBe(false);
  });

  it("bitmap with all bits set returns true for all defined achievement indices", () => {
    const allSet = (1n << 256n) - 1n;
    for (const def of ACHIEVEMENT_DEFINITIONS) {
      expect(isAchievementUnlocked(allSet, def.bitmapIndex)).toBe(true);
    }
  });
});

// ---------------------------------------------------------------------------
// Category filtering
// ---------------------------------------------------------------------------

describe("ACHIEVEMENT_DEFINITIONS — category filtering", () => {
  it("filtering by progress returns only progress achievements", () => {
    const progress = ACHIEVEMENT_DEFINITIONS.filter((a) => a.category === "progress");
    expect(progress.every((a) => a.category === "progress")).toBe(true);
  });

  it("filtering by xp returns only xp achievements", () => {
    const xpAchievements = ACHIEVEMENT_DEFINITIONS.filter((a) => a.category === "xp");
    expect(xpAchievements.every((a) => a.category === "xp")).toBe(true);
  });

  it("all categories together cover all achievements", () => {
    const allCategories: AchievementCategory[] = ["progress", "streaks", "skills", "community", "special", "xp"];
    const total = allCategories.reduce(
      (sum, cat) => sum + ACHIEVEMENT_DEFINITIONS.filter((a) => a.category === cat).length,
      0
    );
    expect(total).toBe(ACHIEVEMENT_DEFINITIONS.length);
  });
});

// ---------------------------------------------------------------------------
// CATEGORIES array
// ---------------------------------------------------------------------------

describe("CATEGORIES — structure", () => {
  it("has 6 categories", () => {
    expect(CATEGORIES).toHaveLength(6);
  });

  it("includes all expected category keys", () => {
    const keys = CATEGORIES.map((c) => c.key);
    expect(keys).toContain("progress");
    expect(keys).toContain("streaks");
    expect(keys).toContain("skills");
    expect(keys).toContain("community");
    expect(keys).toContain("special");
    expect(keys).toContain("xp");
  });

  it("every category has a non-empty color string", () => {
    for (const cat of CATEGORIES) {
      expect(cat.color).toBeTruthy();
    }
  });

  it("progress category uses blue color", () => {
    const prog = CATEGORIES.find((c) => c.key === "progress");
    expect(prog?.color).toContain("blue");
  });

  it("streaks category uses orange color", () => {
    const streaks = CATEGORIES.find((c) => c.key === "streaks");
    expect(streaks?.color).toContain("orange");
  });

  it("xp category uses cyan color", () => {
    const xpCat = CATEGORIES.find((c) => c.key === "xp");
    expect(xpCat?.color).toContain("cyan");
  });
});
