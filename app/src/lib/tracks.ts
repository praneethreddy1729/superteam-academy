/**
 * Canonical track definitions (REQ-189/405).
 * trackId is the u16 value stored in Sanity and on-chain.
 * i18nKey maps to courses.tracks.{key} in locale messages.
 */
export interface TrackDefinition {
  id: number;
  slug: string;
  i18nKey: string;
}

export const TRACKS: TrackDefinition[] = [
  { id: 1, slug: "solana-fundamentals",  i18nKey: "solanaFundamentals" },
  { id: 2, slug: "anchor-development",   i18nKey: "anchorDevelopment" },
  { id: 3, slug: "nft-gaming",           i18nKey: "nftGaming" },
  { id: 4, slug: "defi-development",     i18nKey: "defiDevelopment" },
  { id: 5, slug: "web3-frontend",        i18nKey: "web3Frontend" },
  { id: 6, slug: "advanced-protocol",    i18nKey: "advancedProtocol" },
];

/** trackId → slug (for URL/filter use) */
export const TRACK_SLUGS: Record<number, string> = Object.fromEntries(
  TRACKS.map((t) => [t.id, t.slug])
);

/** trackId → i18nKey (for useTranslations("courses").("tracks.X")) */
export const TRACK_I18N_KEYS: Record<number, string> = Object.fromEntries(
  TRACKS.map((t) => [t.id, t.i18nKey])
);
