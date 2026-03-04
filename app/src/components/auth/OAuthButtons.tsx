"use client";

import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@/components/wallet/CustomWalletModalProvider";
import { useEffect, useRef, useState } from "react";
import bs58 from "bs58";
import { toast } from "sonner";
import { GoogleIcon } from "@/components/icons/GoogleIcon";
import { GitHubIcon } from "@/components/icons/GitHubIcon";
import { Wallet } from "lucide-react";

interface OAuthButtonsProps {
  callbackUrl?: string;
  variant?: "modal" | "page";
  onCloseModal?: () => void;
}

export function OAuthButtons({ callbackUrl = "/courses", variant = "page", onCloseModal }: OAuthButtonsProps) {
  const t = useTranslations("auth");
  const { publicKey, signMessage, connected } = useWallet();
  const { setVisible } = useWalletModal();
  const [walletLoading, setWalletLoading] = useState(false);
  const pendingSignIn = useRef(false);

  useEffect(() => {
    if (connected && publicKey && signMessage && pendingSignIn.current) {
      pendingSignIn.current = false;
      void performWalletSignIn();
    }
    if (!connected) {
      pendingSignIn.current = false;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected, publicKey, signMessage]);

  async function performWalletSignIn() {
    if (!publicKey || !signMessage) return;
    setWalletLoading(true);
    try {
      const message = `Sign in to Superteam Academy\nWallet: ${publicKey.toBase58()}\nTimestamp: ${Date.now()}`;
      const encoded = new TextEncoder().encode(message);
      const signature = await signMessage(encoded);

      await signIn("solana", {
        publicKey: publicKey.toBase58(),
        signature: bs58.encode(signature),
        message,
        callbackUrl,
      });
    } catch {
      toast.error(t("signInFailed"));
    } finally {
      setWalletLoading(false);
    }
  }

  async function handleWalletSignIn() {
    if (!connected || !publicKey || !signMessage) {
      pendingSignIn.current = true;
      // Close the sign-in modal first so the wallet adapter modal isn't blocked
      onCloseModal?.();
      // Small delay to let the modal close before opening wallet selector
      setTimeout(() => setVisible(true), 150);
      return;
    }
    await performWalletSignIn();
  }

  const isModal = variant === "modal";

  return (
    <div className="space-y-4">
      {/* Google & GitHub side by side */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => signIn("google", { callbackUrl })}
          className="flex h-11 items-center justify-center gap-2.5 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          style={isModal ? {
            background: "rgba(255, 255, 255, 0.95)",
            color: "#1a1a1a",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          } : {
            background: "rgba(255, 255, 255, 0.95)",
            color: "#1a1a1a",
            border: "1px solid rgba(0, 0, 0, 0.1)",
          }}
        >
          <GoogleIcon />
          {t("continueWithGoogle")}
        </button>

        <button
          type="button"
          onClick={() => signIn("github", { callbackUrl })}
          className="flex h-11 items-center justify-center gap-2.5 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          style={isModal ? {
            background: "rgba(30, 30, 30, 0.9)",
            color: "#ffffff",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          } : {
            background: "rgba(30, 30, 30, 0.95)",
            color: "#ffffff",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <GitHubIcon />
          {t("continueWithGithub")}
        </button>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1" style={{ background: isModal ? "rgba(20, 241, 149, 0.15)" : "rgba(128, 128, 128, 0.2)" }} />
        <span
          className="text-[10px] font-semibold tracking-widest"
          style={{ color: isModal ? "#6b8a6f" : "rgba(128, 128, 128, 0.6)" }}
        >
          {t("orContinueWith")}
        </span>
        <div className="h-px flex-1" style={{ background: isModal ? "rgba(20, 241, 149, 0.15)" : "rgba(128, 128, 128, 0.2)" }} />
      </div>

      {/* Wallet button — golden / prominent */}
      <button
        type="button"
        onClick={handleWalletSignIn}
        disabled={walletLoading}
        className="flex h-12 w-full items-center justify-center gap-2.5 rounded-lg text-sm font-bold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none"
        style={{
          background: "linear-gradient(135deg, #FFDF00 0%, #C9903A 100%)",
          color: "#08080C",
          border: "1px solid rgba(255, 223, 0, 0.3)",
          boxShadow: "0 0 20px rgba(255, 223, 0, 0.15), 0 4px 12px rgba(0, 0, 0, 0.3)",
        }}
      >
        <Wallet className="h-5 w-5" />
        {walletLoading ? t("connectingWallet") : t("continueWithWallet")}
      </button>
    </div>
  );
}
