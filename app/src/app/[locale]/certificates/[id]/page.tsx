import { setRequestLocale, getTranslations } from "next-intl/server";
import { CertificateView } from "@/components/certificates/CertificateView";

export const revalidate = 3600;

type Props = { params: Promise<{ locale: string; id: string }> };

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const t = await getTranslations("certificate");
  const title = `${t("pageTitle")} ${id}`;
  const ogImage = `/api/og/certificate?course=${encodeURIComponent(t("fallbackCourseName"))}&recipient=${id.slice(0, 8)}...${id.slice(-8)}`;
  return {
    title,
    openGraph: {
      title,
      type: "article",
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      images: [ogImage],
    },
  };
}

export default async function CertificatePage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  return <CertificateView assetId={id} />;
}
