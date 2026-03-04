import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import nacl from "tweetnacl";
import { PublicKey } from "@solana/web3.js";
import bs58 from "bs58";
import { createHmac } from "crypto";

function signWallet(address: string): string {
  const secret = process.env.AUTH_SECRET!;
  const sig = createHmac("sha256", secret).update(address).digest("hex");
  return `${address}.${sig}`;
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id && !session?.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  let body: {
    walletAddress?: string;
    signature?: string;
    message?: string;
    timestamp?: number;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { walletAddress, signature, message, timestamp } = body;
  if (!walletAddress || !signature || !message || !timestamp) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Verify timestamp is within 5 minutes
  if (Math.abs(Date.now() - timestamp) > 5 * 60 * 1000) {
    return NextResponse.json({ error: "Message expired" }, { status: 400 });
  }

  // Verify message format
  const expectedMessage = `superteam-academy:link-wallet:${timestamp}`;
  if (message !== expectedMessage) {
    return NextResponse.json({ error: "Invalid message format" }, { status: 400 });
  }

  try {
    const publicKey = new PublicKey(walletAddress);
    const sigBytes = bs58.decode(signature);
    const msgBytes = new TextEncoder().encode(message);

    const isValid = nacl.sign.detached.verify(msgBytes, sigBytes, publicKey.toBytes());
    if (!isValid) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const linkedAddress = publicKey.toBase58();
    const useSecureCookies = process.env.AUTH_URL?.startsWith("https://") ?? process.env.NODE_ENV === "production";

    const response = NextResponse.json({ success: true, walletAddress: linkedAddress });
    // Store the linked wallet in a cookie so it persists across serverless instances.
    // HttpOnly prevents client-side JS from tampering; the link-status route reads it server-side.
    response.cookies.set("academy_linked_wallet", signWallet(linkedAddress), {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: useSecureCookies,
      maxAge: 60 * 60 * 24 * 365, // 1 year
    });
    return response;
  } catch {
    return NextResponse.json({ error: "Verification failed" }, { status: 400 });
  }
}
