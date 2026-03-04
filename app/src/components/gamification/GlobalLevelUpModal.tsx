"use client";

import { LevelUpModal, useLevelUp } from "@/components/gamification/LevelUpModal";

/**
 * Mounts the LevelUpModal at the app root so it can fire on any page
 * (lessons, challenges, dashboard, etc.) whenever the learner's XP
 * crosses a level boundary.
 */
export function GlobalLevelUpModal() {
  const { levelUpOpen, oldLevel, newLevel, closeLevelUp } = useLevelUp();

  return (
    <LevelUpModal
      open={levelUpOpen}
      onClose={closeLevelUp}
      oldLevel={oldLevel}
      newLevel={newLevel}
    />
  );
}
