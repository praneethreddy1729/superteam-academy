"use client";

import { useSession } from "next-auth/react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useXpBalance } from "@/hooks/useXpBalance";
import { useProgressStore } from "@/stores/progress-store";
import { getLevel, formatXp } from "@/lib/utils";
import { Flame, Zap, Shield } from "lucide-react";
import { motion } from "framer-motion";

export function NavGamification() {
    const { data: session } = useSession();
    const { connected } = useWallet();
    const { xp } = useXpBalance();
    const { streakDays } = useProgressStore();
    const isWalletAuthenticated = connected || !!session?.user?.walletAddress;

    if (!isWalletAuthenticated) return null;

    const currentLevel = getLevel(xp);

    return (
        <div className="flex items-center gap-2 xl:gap-3 rounded-full border dark:border-white/5 border-border/30 dark:bg-white/5 bg-muted/30 px-2.5 xl:px-3 py-1.5 backdrop-blur-md">
            {/* Level Badge */}
            <div className="flex items-center gap-1.5 font-medium text-primary whitespace-nowrap">
                <Shield className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span className="text-sm">Lvl {currentLevel}</span>
            </div>

            <div className="h-4 w-px dark:bg-white/10 bg-border" aria-hidden="true" />

            {/* XP Counter */}
            <div className="flex items-center gap-1.5 font-medium text-secondary whitespace-nowrap">
                <Zap className="h-4 w-4 shrink-0" aria-hidden="true" />
                <motion.span
                    key={xp}
                    initial={{ y: -5, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-sm"
                >
                    {formatXp(xp)} XP
                </motion.span>
            </div>

            <div className="h-4 w-px dark:bg-white/10 bg-border" aria-hidden="true" />

            {/* Streak Counter */}
            <div className={`flex items-center gap-1.5 font-medium whitespace-nowrap ${streakDays > 0 ? "text-orange-500" : "text-muted-foreground"}`}>
                <Flame className={`h-4 w-4 shrink-0 ${streakDays > 0 ? "fill-orange-500/20" : ""}`} aria-hidden="true" />
                <span className="text-sm">{streakDays}</span>
            </div>
        </div>
    );
}
