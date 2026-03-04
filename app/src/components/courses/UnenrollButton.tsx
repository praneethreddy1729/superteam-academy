"use client";

import { useState } from "react";
import { useWallet, useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Loader2, LogOut, TriangleAlert } from "lucide-react";
import { buildCloseEnrollmentTx } from "@/lib/solana/instructions";
import { getCoursePda } from "@/lib/solana/pdas";
import logger from "@/lib/logger";

interface UnenrollButtonProps {
  courseId: string;
  onUnenrolled?: () => void;
  /** Optional extra className on the trigger button */
  className?: string;
}

export function UnenrollButton({ courseId, onUnenrolled, className }: UnenrollButtonProps) {
  const t = useTranslations("courses");
  const tc = useTranslations("common");
  const { publicKey, connected, sendTransaction } = useWallet();
  const anchorWallet = useAnchorWallet();
  const { connection } = useConnection();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!connected || !publicKey) return null;

  const handleUnenroll = async () => {
    if (!anchorWallet) {
      toast.error(t("unenroll.error"));
      return;
    }

    setLoading(true);
    try {
      const [coursePda] = getCoursePda(courseId);
      const tx = await buildCloseEnrollmentTx(anchorWallet, courseId, coursePda);
      tx.feePayer = publicKey;
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
      tx.recentBlockhash = blockhash;

      const signature = await sendTransaction(tx, connection);
      await connection.confirmTransaction(
        { signature, blockhash, lastValidBlockHeight },
        "confirmed"
      );

      toast.success(t("unenroll.success"), {
        description: `Tx: ${signature.slice(0, 8)}...${signature.slice(-8)}`,
      });

      setOpen(false);
      onUnenrolled?.();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "";

      if (msg.includes("User rejected")) {
        toast.error(t("unenroll.error"), { description: t("enrollment.errorCancelled") });
      } else if (msg.includes("UnenrollCooldown")) {
        toast.error(t("unenroll.cooldownError"));
      } else {
        logger.error("Unenroll failed:", err);
        toast.error(t("unenroll.error"), { description: t("enrollment.errorFailed") });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className={`gap-2 border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive ${className ?? ""}`}
        onClick={() => setOpen(true)}
        aria-label={t("unenroll.button")}
      >
        <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
        {t("unenroll.button")}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent closeLabel={tc("close")}>
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive/10">
                <TriangleAlert className="h-5 w-5 text-destructive" aria-hidden="true" />
              </div>
              <DialogTitle>{t("unenroll.confirmTitle")}</DialogTitle>
            </div>
            <DialogDescription className="pt-2">
              {t("unenroll.confirmDescription")}
            </DialogDescription>
          </DialogHeader>

          <p className="rounded-md border border-yellow-500/30 bg-yellow-500/8 px-3 py-2 text-xs text-yellow-300">
            {t("unenroll.cooldownWarning")}
          </p>

          <DialogFooter className="gap-2 sm:gap-0">
            <DialogClose asChild>
              <Button variant="outline" disabled={loading}>
                {tc("cancel")}
              </Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={handleUnenroll}
              disabled={loading}
              aria-label={loading ? tc("loading") : t("unenroll.confirmButton")}
            >
              {loading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" role="status" />
              )}
              {t("unenroll.confirmButton")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
