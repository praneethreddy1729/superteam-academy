import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { createHmac } from "crypto";

function verifyWallet(cookie: string): string | null {
  const [address, sig] = cookie.split(".");
  if (!address || !sig) return null;
  const secret = process.env.AUTH_SECRET!;
  const expected = createHmac("sha256", secret).update(address).digest("hex");
  return sig === expected ? address : null;
}

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id && !session?.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // If the user signed in via Solana wallet, the address is already in the JWT.
  if (session.user.walletAddress) {
    return NextResponse.json({ linkedWallet: session.user.walletAddress });
  }

  // For OAuth (Google/GitHub) users who linked a wallet, we store it in a cookie
  // set by link-wallet/route.ts. Reading it here works across all serverless instances.
  const rawCookie = req.cookies.get("academy_linked_wallet")?.value;
  const linkedWallet = rawCookie ? verifyWallet(rawCookie) : null;
  return NextResponse.json({ linkedWallet });
}
