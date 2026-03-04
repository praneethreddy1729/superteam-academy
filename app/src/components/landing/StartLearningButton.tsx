"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { GraduationCap } from "lucide-react";
import { SignInModal } from "@/components/auth/SignInModal";

export function StartLearningButton() {
  const { data: session } = useSession();
  const router = useRouter();
  const t = useTranslations("landing");
  const [modalOpen, setModalOpen] = useState(false);

  function handleClick() {
    if (session) {
      router.push("/courses");
    } else {
      setModalOpen(true);
    }
  }

  return (
    <>
      <Button
        size="lg"
        className="gap-2 rounded-sm text-sm font-bold transition-all duration-200 hover:brightness-110 hover:shadow-[0_0_20px_rgba(20,241,149,0.3)]"
        style={{
          background: "#14F195",
          border: "none",
          color: "#08080C",
          fontFamily: "var(--font-mono)",
          padding: "0 2rem",
        }}
        onClick={handleClick}
      >
        <GraduationCap className="h-4 w-4" aria-hidden="true" />
        {t("hero.cta")}
      </Button>
      <SignInModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        callbackUrl="/courses"
      />
    </>
  );
}
