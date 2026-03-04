"use client";

import { useTranslations } from "next-intl";
import { useWallet } from "@solana/wallet-adapter-react";
import { Link } from "@/i18n/routing";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Award, ExternalLink, WalletMinimal, ArrowRight } from "lucide-react";
import { useCredentials } from "@/hooks/useCredentials";
import { SOLANA_NETWORK } from "@/lib/solana/constants";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";

function CertificateCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="p-6 space-y-4">
        <Skeleton className="h-16 w-16 rounded-xl mx-auto" />
        <Skeleton className="h-5 w-3/4 mx-auto" />
        <Skeleton className="h-4 w-1/2 mx-auto" />
        <div className="flex justify-center gap-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-16" />
        </div>
        <Skeleton className="h-9 w-full" />
      </div>
    </Card>
  );
}

export function CertificatesList() {
  const t = useTranslations("certificatesPage");
  const tc = useTranslations("common");
  const { publicKey } = useWallet();
  const { credentials, loading, error } = useCredentials();

  const breadcrumbs = (
    <Breadcrumbs
      ariaLabel={tc("breadcrumb")}
      items={[
        { label: tc("home"), href: "/" },
        { label: t("title") },
      ]}
    />
  );

  // No wallet connected
  if (!publicKey) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        {breadcrumbs}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{t("title")}</h1>
          <p className="mt-2 text-muted-foreground">{t("subtitle")}</p>
        </div>
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <WalletMinimal
              className="mb-4 h-12 w-12 text-muted-foreground"
              aria-hidden="true"
            />
            <h2 className="text-lg font-semibold">{t("connectWallet")}</h2>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              {t("connectWalletDesc")}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Loading
  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        {breadcrumbs}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{t("title")}</h1>
          <p className="mt-2 text-muted-foreground">{t("subtitle")}</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <CertificateCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        {breadcrumbs}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{t("title")}</h1>
          <p className="mt-2 text-muted-foreground">{t("subtitle")}</p>
        </div>
        <Card className="border-destructive/50">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-sm text-destructive">{t("errorLoading")}</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              {tc("retry")}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Empty state
  if (credentials.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        {breadcrumbs}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{t("title")}</h1>
          <p className="mt-2 text-muted-foreground">{t("subtitle")}</p>
        </div>
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Award
              className="mb-4 h-12 w-12 text-muted-foreground"
              aria-hidden="true"
            />
            <h2 className="text-lg font-semibold">{t("emptyTitle")}</h2>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              {t("emptyDesc")}
            </p>
            <Button variant="outline" className="mt-6 gap-2" asChild>
              <Link href="/courses">
                {tc("browseCourses")}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Credentials list
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      {breadcrumbs}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <p className="mt-2 text-muted-foreground">{t("subtitle")}</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("count", { count: credentials.length })}
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {credentials.map((asset) => {
          const courseName =
            asset.content.metadata.attributes?.find(
              (a) => a.trait_type === "Course"
            )?.value ??
            asset.content.metadata.name;

          const track =
            asset.content.metadata.attributes?.find(
              (a) => a.trait_type === "Track"
            )?.value ?? null;

          const xp =
            asset.content.metadata.attributes?.find(
              (a) => a.trait_type === "XP"
            )?.value ?? null;

          const mintDate =
            asset.content.metadata.attributes?.find(
              (a) => a.trait_type === "Issued At"
            )?.value ?? null;

          const nftImage = asset.content?.links?.image ?? null;

          return (
            <Card
              key={asset.id}
              className="group overflow-hidden transition-colors hover:border-primary/40"
            >
              <CardContent className="flex flex-col items-center p-6 text-center">
                {nftImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={nftImage}
                    alt={courseName}
                    className="mb-4 h-20 w-20 rounded-xl object-cover ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all"
                  />
                ) : (
                  <Award
                    className="mb-4 h-16 w-16 text-primary/70 group-hover:text-primary transition-colors"
                    aria-hidden="true"
                  />
                )}

                <h3 className="text-base font-semibold line-clamp-2">
                  {courseName}
                </h3>

                {mintDate && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {mintDate}
                  </p>
                )}

                <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                  {track && (
                    <Badge variant="outline" className="text-xs">
                      {track}
                    </Badge>
                  )}
                  {xp && (
                    <Badge variant="outline" className="text-xs">
                      {xp} XP
                    </Badge>
                  )}
                </div>

                <p className="mt-2 font-mono text-[10px] text-muted-foreground">
                  {asset.id.slice(0, 6)}...{asset.id.slice(-6)}
                </p>

                <div className="mt-4 flex w-full gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 min-w-0 gap-1.5"
                    asChild
                  >
                    <Link href={`/certificates/${asset.id}` as string}>
                      <span className="truncate">{t("viewCertificate")}</span>
                      <ArrowRight className="h-3 w-3 shrink-0" aria-hidden="true" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="shrink-0 gap-1.5 text-muted-foreground"
                    asChild
                  >
                    <a
                      href={`https://explorer.solana.com/address/${asset.id}?cluster=${SOLANA_NETWORK}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={t("verifyOnChain")}
                    >
                      <ExternalLink className="h-3 w-3" aria-hidden="true" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
