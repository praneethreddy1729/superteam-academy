import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { GraduationCap } from "lucide-react";
import Image from "next/image";
import { NewsletterForm } from "./NewsletterForm";

export async function Footer() {
  const t = await getTranslations("footer");
  const tc = await getTranslations("common");

  return (
    <footer role="contentinfo" className="border-t border-border/40 bg-background">
      {/* Newsletter strip */}
      <div className="border-b border-border/40 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold text-sm">{t("newsletter.title")}</p>
              <p className="text-sm text-muted-foreground mt-0.5">{t("newsletter.placeholder")}</p>
            </div>
            <NewsletterForm
              placeholder={t("newsletter.inputPlaceholder")}
              buttonLabel={t("newsletter.button")}
              successMessage={t("newsletter.success")}
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Image
                src="/superteam-brasil.png"
                alt="Superteam Brasil"
                width={36}
                height={36}
                className="rounded-md"
              />
              <GraduationCap className="h-6 w-6 text-primary" aria-hidden="true" />
              <span className="font-bold">Superteam Academy</span>
            </div>
            <p className="text-sm text-muted-foreground">{t("description")}</p>
          </div>
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">{t("links.courses")}</h4>
            <div className="flex flex-col gap-2">
              <Link href="/courses" className="text-sm text-muted-foreground hover:text-foreground">
                {t("links.courses")}
              </Link>
              <Link href="/leaderboard" className="text-sm text-muted-foreground hover:text-foreground">
                {t("links.leaderboard")}
              </Link>
              <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">
                {t("links.dashboard")}
              </Link>
              <Link href="/profile" className="text-sm text-muted-foreground hover:text-foreground">
                {t("links.profile")}
              </Link>
              <Link href="/settings" className="text-sm text-muted-foreground hover:text-foreground">
                {t("links.settings")}
              </Link>
            </div>
          </div>
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">{t("links.about")}</h4>
            <div className="flex flex-col gap-2">
              <a href="https://superteam.fun" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground" aria-label={`Superteam (${tc("opensInNewTab")})`}>
                Superteam
              </a>
              <a href="https://solana.com" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground" aria-label={`Solana (${tc("opensInNewTab")})`}>
                Solana
              </a>
            </div>
          </div>
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">{t("social.title")}</h4>
            <div className="flex flex-col gap-2">
              <a href="https://twitter.com/SuperteamBR" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground" aria-label={`${t("social.twitter")} (${tc("opensInNewTab")})`}>
                {t("social.twitter")}
              </a>
              <a href="https://discord.gg/superteam" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground" aria-label={`${t("social.discord")} (${tc("opensInNewTab")})`}>
                {t("social.discord")}
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-border/40 pt-8 flex flex-col items-center gap-2 sm:flex-row sm:justify-between text-sm text-muted-foreground">
          <span>{t("copyright", { year: new Date().getFullYear() })}</span>
          <span
            className="font-mono text-xs tracking-widest uppercase"
            style={{ color: "rgba(20, 241, 149, 0.5)" }}
          >
            Powered by Solana
          </span>
        </div>
      </div>
    </footer>
  );
}
