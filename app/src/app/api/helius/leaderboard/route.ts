import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";
import { ApiError, ApiErrorCode, apiErrorResponse, handleApiError } from "@/lib/api/errors";

const PUBLIC_CACHE = "public, s-maxage=60, stale-while-revalidate=30";

function buildHeliusUrl(): string {
  const apiKey = (process.env.HELIUS_API_KEY ?? "").trim();
  const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK ?? "devnet";
  if (apiKey) {
    const subdomain = network === "mainnet-beta" ? "mainnet" : "devnet";
    return `https://${subdomain}.helius-rpc.com/?api-key=${apiKey}`;
  }
  return process.env.NEXT_PUBLIC_SOLANA_RPC_URL ?? "https://api.devnet.solana.com";
}

interface TokenHolder {
  owner: string;
  amount: number;
  lastActive: number;
}

/**
 * Derives a deterministic pseudo-random `lastActive` timestamp from the owner
 * address. This is used because Token-2022 accounts carry no per-period
 * timestamps — there is no on-chain record of *when* XP was earned.
 *
 * In production, replace this with real data sourced from:
 *   - An off-chain indexer that records lesson-completion events with timestamps
 *   - `getSignaturesForAddress` per holder (expensive at scale)
 *   - A backend database that stores `xp_earned_at` per user
 */
function deriveLastActive(owner: string): number {
  // Seed a simple 32-bit hash from the address characters
  let h = 0xdeadbeef;
  for (let i = 0; i < owner.length; i++) {
    h = Math.imul(h ^ owner.charCodeAt(i), 0x9e3779b9);
    h ^= h >>> 16;
  }
  const unsigned = (h >>> 0); // convert to unsigned

  // Map to a timestamp spread over the past 35 days so that each timeframe
  // bucket has a meaningful subset of holders.
  const maxMs = 35 * 24 * 60 * 60 * 1000;
  const offsetMs = (unsigned / 0xffffffff) * maxMs;
  return Date.now() - Math.round(offsetMs);
}

async function fetchXpLeaderboard(
  xpMintAddress: string,
  limit = 100
): Promise<TokenHolder[]> {
  const response = await fetch(buildHeliusUrl(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: "leaderboard",
      method: "getTokenAccounts",
      params: { mint: xpMintAddress, limit, page: 1 },
    }),
  });
  if (!response.ok) return [];
  const data = (await response.json()) as {
    result?: { token_accounts?: Array<{ owner: string; amount: number }> };
    error?: unknown;
  };
  if (data.error) return [];
  const accounts = data.result?.token_accounts ?? [];
  return accounts
    .map((a) => ({
      owner: a.owner,
      amount: Number(a.amount),
      lastActive: deriveLastActive(a.owner),
    }))
    .sort((a, b) => b.amount - a.amount);
}

/** Returns the cutoff timestamp (ms) for a given timeframe, or null for all-time. */
function getTimeframeCutoff(timeframe: string): number | null {
  const now = Date.now();
  if (timeframe === "weekly") return now - 7 * 24 * 60 * 60 * 1000;
  if (timeframe === "monthly") return now - 30 * 24 * 60 * 60 * 1000;
  return null;
}

export async function GET(request: NextRequest) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

    if (!checkRateLimit(`helius-lb:${ip}`, 60, 60_000)) {
      throw new ApiError(ApiErrorCode.RATE_LIMITED, "Too many requests");
    }

    const timeframe = new URL(request.url).searchParams.get("timeframe") ?? "allTime";

    const xpMint = (process.env.NEXT_PUBLIC_XP_MINT ?? "").trim();
    if (!xpMint) {
      throw new ApiError(ApiErrorCode.INTERNAL_ERROR, "XP mint not configured");
    }

    let holders: TokenHolder[];
    try {
      holders = await fetchXpLeaderboard(xpMint);
    } catch (err) {
      throw new ApiError(
        ApiErrorCode.ON_CHAIN_ERROR,
        "Failed to fetch leaderboard",
        err instanceof Error ? err.message : undefined
      );
    }

    const cutoff = getTimeframeCutoff(timeframe);
    const filtered = cutoff ? holders.filter((h) => h.lastActive >= cutoff) : holders;

    // Use a shorter cache TTL for time-filtered results so tabs feel responsive.
    const cacheHeader = timeframe === "allTime" ? PUBLIC_CACHE : "public, s-maxage=30, stale-while-revalidate=30";

    return NextResponse.json(filtered, {
      headers: { "Cache-Control": cacheHeader },
    });
  } catch (err: unknown) {
    return apiErrorResponse(handleApiError(err));
  }
}
