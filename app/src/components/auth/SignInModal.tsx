"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { OAuthButtons } from "@/components/auth/OAuthButtons";

interface SignInModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  callbackUrl?: string;
}

export function SignInModal({ open, onOpenChange, callbackUrl = "/courses" }: SignInModalProps) {
  const t = useTranslations("auth");
  const tc = useTranslations("common");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        closeLabel={tc("close")}
        className="sm:max-w-[420px] overflow-hidden border-0 p-0"
        style={{
          background: "linear-gradient(135deg, #0a2e1a 0%, #1a3a2a 50%, #0d2418 100%)",
          border: "1px solid rgba(20, 241, 149, 0.15)",
          boxShadow: "0 0 60px rgba(20, 241, 149, 0.08), 0 25px 50px rgba(0, 0, 0, 0.5)",
        }}
      >
        {/* Decorative glow effects */}
        <div
          className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2"
          style={{
            width: "300px",
            height: "200px",
            background: "radial-gradient(ellipse, rgba(20, 241, 149, 0.12) 0%, transparent 70%)",
          }}
        />

        <div className="relative z-10 px-8 py-8">
          {/* Logo */}
          <div className="mb-5 flex justify-center">
            <Image
              src="/superteam-brasil.png"
              alt="Superteam Brasil"
              width={64}
              height={64}
              className="rounded-xl"
            />
          </div>

          <DialogHeader className="mb-6 text-center sm:text-center">
            <DialogTitle className="text-2xl font-bold tracking-tight text-white">
              {t("signInModalTitle")}
            </DialogTitle>
            <DialogDescription className="mt-2 text-sm text-[#a3b8a8]">
              {t("signInModalSubtitle")}
            </DialogDescription>
          </DialogHeader>

          <OAuthButtons callbackUrl={callbackUrl} variant="modal" onCloseModal={() => onOpenChange(false)} />

          <p className="mt-6 text-center text-xs text-[#6b8a6f]">
            {t("termsText")}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
