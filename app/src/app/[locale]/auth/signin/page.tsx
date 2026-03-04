"use client";

import Image from "next/image";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/routing";
import { useEffect, Suspense } from "react";
import { OAuthButtons } from "@/components/auth/OAuthButtons";
import { routing } from "@/i18n/routing";

/** Returns the URL only if it is a safe relative path (starts with / but not //).
 *  Also strips any locale prefix (e.g. /en/courses -> /courses) so that
 *  next-intl's router handles locale resolution from the cookie, not the URL. */
function getSafeCallbackUrl(raw: string | null): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) {
    return "/courses";
  }
  for (const locale of routing.locales) {
    if (raw === `/${locale}` || raw.startsWith(`/${locale}/`)) {
      const stripped = raw.slice(`/${locale}`.length) || "/";
      return stripped;
    }
  }
  return raw;
}

function SignInContent() {
  const t = useTranslations("auth");
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  const callbackUrl = getSafeCallbackUrl(searchParams.get("callbackUrl"));

  useEffect(() => {
    if (status === "authenticated" && session) {
      router.replace(callbackUrl);
    }
  }, [status, session, router, callbackUrl]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: "#070f0b" }}>
        <div
          role="status"
          aria-label="Loading"
          className="h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"
          style={{ borderColor: "#14F195", borderTopColor: "transparent" }}
        />
      </div>
    );
  }

  if (status === "authenticated") {
    return null;
  }

  return (
    <div
      className="flex min-h-screen items-center justify-center px-4"
      style={{ background: "radial-gradient(ellipse at center top, #0d2418 0%, #070f0b 50%, #08080C 100%)" }}
    >
      <div className="w-full max-w-[420px]">
        <div
          className="relative overflow-hidden rounded-2xl p-8"
          style={{
            background: "linear-gradient(135deg, #0a2e1a 0%, #1a3a2a 50%, #0d2418 100%)",
            border: "1px solid rgba(20, 241, 149, 0.15)",
            boxShadow: "0 0 80px rgba(20, 241, 149, 0.08), 0 25px 50px rgba(0, 0, 0, 0.5)",
          }}
        >
          {/* Decorative glow */}
          <div
            className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2"
            style={{
              width: "300px",
              height: "200px",
              background: "radial-gradient(ellipse, rgba(20, 241, 149, 0.12) 0%, transparent 70%)",
            }}
          />

          <div className="relative z-10">
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

            {/* Heading */}
            <div className="mb-8 text-center">
              <h1 className="text-2xl font-bold tracking-tight text-white">
                {t("signInModalTitle")}
              </h1>
              <p className="mt-2 text-sm text-[#a3b8a8]">
                {t("signInModalSubtitle")}
              </p>
            </div>

            <OAuthButtons callbackUrl={callbackUrl} variant="modal" />

            <p className="mt-6 text-center text-xs text-[#6b8a6f]">
              {t("termsText")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center" style={{ background: "#070f0b" }}>
          <div
            role="status"
            aria-label="Loading"
            className="h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"
            style={{ borderColor: "#14F195", borderTopColor: "transparent" }}
          />
        </div>
      }
    >
      <SignInContent />
    </Suspense>
  );
}
