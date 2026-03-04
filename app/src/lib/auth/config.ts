import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import nacl from "tweetnacl";
import { PublicKey } from "@solana/web3.js";
import bs58 from "bs58";

const useSecureCookies = process.env.AUTH_URL?.startsWith("https://") ?? process.env.NODE_ENV === "production";
const cookiePrefix = useSecureCookies ? "__Secure-" : "";

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  cookies: {
    pkceCodeVerifier: {
      name: `${cookiePrefix}authjs.pkce.code_verifier`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: useSecureCookies,
      },
    },
    callbackUrl: {
      name: `${cookiePrefix}authjs.callback-url`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: useSecureCookies,
      },
    },
    csrfToken: {
      name: `${cookiePrefix}authjs.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: useSecureCookies,
      },
    },
  },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
    Credentials({
      id: "solana",
      name: "Solana Wallet",
      credentials: {
        publicKey: { type: "text" },
        signature: { type: "text" },
        message: { type: "text" },
      },
      async authorize(credentials) {
        if (
          !credentials?.publicKey ||
          !credentials?.signature ||
          !credentials?.message
        ) {
          return null;
        }

        try {
          const publicKey = new PublicKey(credentials.publicKey as string);
          const signature = bs58.decode(credentials.signature as string);
          const message = new TextEncoder().encode(
            credentials.message as string
          );

          const isValid = nacl.sign.detached.verify(
            message,
            signature,
            publicKey.toBytes()
          );
          if (!isValid) return null;

          // Strict format: "Sign in to Superteam Academy\nWallet: <base58>\nTimestamp: <number>"
          const msgStr = credentials.message as string;
          const expectedPrefix = "Sign in to Superteam Academy\nWallet: ";
          if (!msgStr.startsWith(expectedPrefix)) return null;

          // Validate wallet address in message matches claimed publicKey
          const lines = msgStr.split("\n");
          const walletLine = lines.find(l => l.startsWith("Wallet: "));
          const messagePubkey = walletLine?.replace("Wallet: ", "").trim();
          if (messagePubkey !== (credentials.publicKey as string)) return null;

          // Mandatory timestamp check
          const timestampMatch = msgStr.match(/Timestamp: (\d+)/);
          if (!timestampMatch?.[1]) return null;
          const ts = parseInt(timestampMatch[1]);
          if (Date.now() - ts > 5 * 60 * 1000) return null;

          const address = publicKey.toBase58();
          return {
            id: address,
            name: address.slice(0, 8) + "...",
            walletAddress: address,
          };
        } catch {
          return null;
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/auth/signin" },
  callbacks: {
    jwt({ token, user }) {
      if (user && "walletAddress" in user && user.walletAddress) {
        token.walletAddress = user.walletAddress as string;
      }
      return token;
    },
    session({ session, token }) {
      if (token.walletAddress) {
        session.user.walletAddress = token.walletAddress as string;
      }
      return session;
    },
  },
});
