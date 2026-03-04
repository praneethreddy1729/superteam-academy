import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { getFeaturedCourses, SanityCourse } from "@/lib/sanity/queries";
import { LandingContent } from "@/components/landing/LandingContent";
import { LandingContent as OptionA } from "@/components/landing/LandingOption_A";
import { LandingContent as OptionB } from "@/components/landing/LandingOption_B";
import { LandingContent as OptionC } from "@/components/landing/LandingOption_C";
import { LandingContent as OptionD } from "@/components/landing/LandingOption_D";
import { LandingContent as OptionE } from "@/components/landing/LandingOption_E";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ v?: string }>;
};

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "common" });
  const tLanding = await getTranslations({ locale, namespace: "landing" });
  const title = t("appName");
  const description = tLanding("hero.subtitle");
  return {
    title,
    description,
    openGraph: { title, description, type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function LandingPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { v } = await searchParams;
  setRequestLocale(locale);

  let featuredCourses: SanityCourse[] = [];
  try {
    featuredCourses = await getFeaturedCourses(locale, 3);
  } catch {
    // Sanity not configured — skip featured section
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://superteam-academy.vercel.app/#website",
        name: "Superteam Academy",
        description: "Learn Solana development, earn on-chain credentials",
        url: "https://superteam-academy.vercel.app",
        inLanguage: ["pt-BR", "en", "es"],
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: "https://superteam-academy.vercel.app/courses?q={search_term_string}",
          },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "EducationalOrganization",
        "@id": "https://superteam-academy.vercel.app/#organization",
        name: "Superteam Academy",
        description: "A decentralized learning platform on Solana. Complete courses, earn on-chain XP, and receive soulbound credential NFTs.",
        url: "https://superteam-academy.vercel.app",
        sameAs: ["https://superteam.fun"],
      },
    ],
  };

  // Pick variant based on ?v= query param (dev preview only)
  // Option E is the production default
  let Content = OptionE;
  if (v === "default") Content = LandingContent;
  else if (v === "A") Content = OptionA;
  else if (v === "B") Content = OptionB;
  else if (v === "C") Content = OptionC;
  else if (v === "D") Content = OptionD;
  else if (v === "E") Content = OptionE;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <Content featuredCourses={featuredCourses} />
    </>
  );
}
