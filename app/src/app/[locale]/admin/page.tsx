import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/config";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export const revalidate = 60;

type Props = { params: Promise<{ locale: string }> };

/** Wallet addresses allowed to access the admin dashboard.
 *  Set ADMIN_WALLETS in .env.local as a comma-separated list of base58 public keys.
 *  Example: ADMIN_WALLETS=Abc123...,Xyz789...
 */
function getAllowedWallets(): Set<string> {
  const raw = process.env.ADMIN_WALLETS ?? "";
  return new Set(
    raw
      .split(",")
      .map((w) => w.trim())
      .filter(Boolean)
  );
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "admin" });
  return { title: t("title") };
}

export default async function AdminPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await auth();

  // Not signed in → redirect to sign-in
  if (!session) {
    redirect("/auth/signin");
  }

  // Signed in but not an allowed wallet → 403
  const walletAddress = session.user?.walletAddress as string | undefined;
  const allowed = getAllowedWallets();

  if (allowed.size === 0 || !walletAddress || !allowed.has(walletAddress)) {
    redirect("/");
  }

  return <AdminDashboard />;
}
