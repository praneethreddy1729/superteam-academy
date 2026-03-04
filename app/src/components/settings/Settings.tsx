"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@/components/wallet/CustomWalletModalProvider";
import { signIn, signOut, useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { LocaleSwitcher } from "@/components/layout/LocaleSwitcher";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Moon, Sun, Monitor, Download, Wallet, User, ShieldCheck, Link, Upload } from "lucide-react";
import { GoogleIcon } from "@/components/icons/GoogleIcon";
import { GitHubIcon } from "@/components/icons/GitHubIcon";
import { useProgressStore } from "@/stores/progress-store";
import { useActivityStore } from "@/stores/activity-store";
import { toast } from "sonner";
import { truncateAddress } from "@/lib/utils";
import bs58 from "bs58";

function useLinkedWallet() {
  const [linkedWallet, setLinkedWallet] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refetch = async () => {
    try {
      const res = await fetch("/api/auth/link-status");
      if (res.ok) {
        const data = await res.json();
        setLinkedWallet(data.linkedWallet ?? null);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, []);

  return { linkedWallet, loading, refetch };
}

const NOTIF_KEY = "academy:notifications";
const PROFILE_VISIBILITY_KEY = "academy:profile-public";
const EMAIL_KEYS = {
  updated: "superteam-email-updated",
  notification: "superteam-email-notification",
} as const;

const PROFILE_KEYS = {
  name: "superteam-profile-name",
  bio: "superteam-profile-bio",
  avatar: "superteam-profile-avatar",
  twitter: "superteam-profile-twitter",
  github: "superteam-profile-github",
} as const;

function loadProfileField(key: string): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(key) ?? "";
}

function loadNotifPrefs() {
  if (typeof window === "undefined") return { email: false, push: false };
  try {
    const parsed = JSON.parse(localStorage.getItem(NOTIF_KEY) ?? "{}");
    return { email: false, push: false, ...parsed };
  } catch {
    return { email: false, push: false };
  }
}

export function Settings() {
  const t = useTranslations("settings");
  const tc = useTranslations("common");
  const { theme, setTheme } = useTheme();
  const { publicKey, connected, disconnect, signMessage } = useWallet();
  const { setVisible: setWalletModalVisible } = useWalletModal();
  const { data: session } = useSession();
  const { completedLessons, streakFreezeCount, streakFreezeUsedDates } = useProgressStore();
  const { activities } = useActivityStore();

  const [notifications, setNotifications] = useState({ email: false, push: false });
  const [isProfilePublic, setIsProfilePublic] = useState(true);
  const [linkingWallet, setLinkingWallet] = useState(false);
  const { linkedWallet, refetch: refetchLinkedWallet } = useLinkedWallet();

  // Profile fields
  const [profileName, setProfileName] = useState("");
  const [profileBio, setProfileBio] = useState("");
  const [profileAvatar, setProfileAvatar] = useState("");
  const [profileTwitter, setProfileTwitter] = useState("");
  const [profileGithub, setProfileGithub] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Email management
  const [updatedEmail, setUpdatedEmail] = useState("");
  const [notificationEmail, setNotificationEmail] = useState("");
  const [emailSaved, setEmailSaved] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNotifications(loadNotifPrefs());
    const storedVisibility = localStorage.getItem(PROFILE_VISIBILITY_KEY);
    setIsProfilePublic(storedVisibility !== "false");
    setProfileName(loadProfileField(PROFILE_KEYS.name));
    setProfileBio(loadProfileField(PROFILE_KEYS.bio));
    setProfileAvatar(loadProfileField(PROFILE_KEYS.avatar));
    setProfileTwitter(loadProfileField(PROFILE_KEYS.twitter));
    setProfileGithub(loadProfileField(PROFILE_KEYS.github));
    setUpdatedEmail(loadProfileField(EMAIL_KEYS.updated));
    setNotificationEmail(loadProfileField(EMAIL_KEYS.notification));
  }, []);

  const saveProfile = () => {
    try {
      localStorage.setItem(PROFILE_KEYS.name, profileName.trim());
      localStorage.setItem(PROFILE_KEYS.bio, profileBio.trim());
      localStorage.setItem(PROFILE_KEYS.avatar, profileAvatar.trim());
      localStorage.setItem(PROFILE_KEYS.twitter, profileTwitter.trim());
      localStorage.setItem(PROFILE_KEYS.github, profileGithub.trim());
      toast.success(t("profile.saved"));
    } catch {
      toast.error(t("profile.saveFailed"));
    }
  };

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const dataUrl = evt.target?.result as string;
      setProfileAvatar(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const saveEmails = () => {
    try {
      localStorage.setItem(EMAIL_KEYS.updated, updatedEmail.trim());
      localStorage.setItem(EMAIL_KEYS.notification, notificationEmail.trim());
      setEmailSaved(true);
      setTimeout(() => setEmailSaved(false), 2000);
      toast.success(t("email.saved"));
    } catch {
      toast.error(t("email.saveFailed"));
    }
  };

  const toggleProfileVisibility = (value: boolean) => {
    setIsProfilePublic(value);
    localStorage.setItem(PROFILE_VISIBILITY_KEY, String(value));
  };

  const updateNotif = (key: "email" | "push", value: boolean) => {
    const next = { ...notifications, [key]: value };
    setNotifications(next);
    localStorage.setItem(NOTIF_KEY, JSON.stringify(next));
  };

  const handleExport = () => {
    const { xp, streakDays } = useProgressStore.getState();
    const data = {
      wallet: publicKey?.toBase58() ?? null,
      xp,
      streakDays,
      completedLessons: Object.fromEntries(
        Object.entries(completedLessons).map(([k, set]) => [k, Array.from(set)])
      ),
      activities,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "superteam-academy-progress.json";
    a.click();
    URL.revokeObjectURL(url);
    toast.success(tc("progressExported"));
  };

  const isSocialSession = !!session?.user && !session.user.walletAddress;

  const handleLinkWallet = async () => {
    if (!connected || !publicKey || !signMessage) {
      setWalletModalVisible(true);
      return;
    }

    setLinkingWallet(true);
    try {
      const timestamp = Date.now();
      const message = `superteam-academy:link-wallet:${timestamp}`;
      const msgBytes = new TextEncoder().encode(message);
      const sigBytes = await signMessage(msgBytes);
      const signature = bs58.encode(sigBytes);

      const res = await fetch("/api/auth/link-wallet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          walletAddress: publicKey.toBase58(),
          signature,
          message,
          timestamp,
        }),
      });

      if (res.ok) {
        await refetchLinkedWallet();
        toast.success(t("accounts.walletLinked"));
      } else {
        const data = await res.json();
        toast.error(data.error ?? t("accounts.walletLinkFailed"));
      }
    } catch {
      toast.error(t("accounts.walletLinkFailed"));
    } finally {
      setLinkingWallet(false);
    }
  };

  // Determine which OAuth provider was used from the session image URL (Google vs GitHub)
  // next-auth JWT doesn't expose provider name directly, but image URL differs
  const isGoogleUser = session?.user?.image?.includes("googleusercontent.com") ?? false;
  const isGithubUser =
    session?.user?.image?.includes("avatars.githubusercontent.com") ?? false;

  // If neither matches by image, treat any signed-in session as potentially either;
  // we still show the correct connected/disconnected state per provider.
  const googleConnected = !!session?.user && isGoogleUser;
  const githubConnected = !!session?.user && isGithubUser;
  const walletConnected = connected && !!publicKey;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Breadcrumbs
        ariaLabel={tc("breadcrumb")}
        items={[
          { label: tc("home"), href: "/" },
          { label: tc("settings") },
        ]}
      />
      <h1 className="mb-8 text-3xl font-bold">{t("title")}</h1>
      <div className="space-y-6">
        {/* Profile */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" aria-hidden="true" />
              {t("profile.title")}
            </CardTitle>
            <CardDescription>{t("profile.description")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="profile-name">{t("profile.displayName")}</Label>
              <Input
                id="profile-name"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                placeholder={t("profile.displayNamePlaceholder")}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="profile-bio">{t("profile.bio")}</Label>
              <Textarea
                id="profile-bio"
                value={profileBio}
                onChange={(e) => setProfileBio(e.target.value)}
                placeholder={t("profile.bioPlaceholder")}
                rows={3}
                maxLength={500}
              />
            </div>
            <div className="space-y-1.5">
              <Label>{t("profile.avatar")}</Label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Avatar className="h-16 w-16 shrink-0">
                  <AvatarImage src={profileAvatar || undefined} alt={profileName || "avatar"} />
                  <AvatarFallback>
                    <User className="h-7 w-7" aria-hidden="true" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarFileChange}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-3.5 w-3.5" aria-hidden="true" />
                    {t("profile.uploadAvatar")}
                  </Button>
                  <p className="text-xs text-muted-foreground">{t("profile.avatarUrlFallback")}</p>
                  <Input
                    id="profile-avatar"
                    type="url"
                    value={profileAvatar.startsWith("data:") ? "" : profileAvatar}
                    onChange={(e) => setProfileAvatar(e.target.value)}
                    placeholder="https://example.com/avatar.png"
                  />
                </div>
              </div>
            </div>
            <Separator />
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {t("profile.socialLinks")}
            </p>
            <div className="space-y-1.5">
              <Label htmlFor="profile-twitter">{t("profile.twitter")}</Label>
              <div className="flex items-center">
                <span className="flex h-9 items-center rounded-l-md border border-r-0 border-input bg-muted px-3 text-sm text-muted-foreground">
                  @
                </span>
                <Input
                  id="profile-twitter"
                  value={profileTwitter}
                  onChange={(e) => setProfileTwitter(e.target.value)}
                  placeholder="yourtwitterhandle"
                  className="rounded-l-none"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="profile-github">{t("profile.github")}</Label>
              <div className="flex items-center">
                <span className="flex h-9 items-center rounded-l-md border border-r-0 border-input bg-muted px-2 sm:px-3 text-xs sm:text-sm text-muted-foreground shrink-0">
                  github.com/
                </span>
                <Input
                  id="profile-github"
                  value={profileGithub}
                  onChange={(e) => setProfileGithub(e.target.value)}
                  placeholder="yourusername"
                  className="rounded-l-none"
                />
              </div>
            </div>
            <Button onClick={saveProfile} className="mt-2">
              {t("profile.saveButton")}
            </Button>
          </CardContent>
        </Card>

        {/* Email */}
        <Card>
          <CardHeader>
            <CardTitle>{t("email.title")}</CardTitle>
            <CardDescription>{t("email.description")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label>{t("email.primary")}</Label>
              <p className="text-sm text-muted-foreground">
                {session?.user?.email ?? t("email.notSignedIn")}
              </p>
              <p className="text-xs text-muted-foreground">{t("email.primaryNote")}</p>
            </div>
            <Separator />
            <div className="space-y-1.5">
              <Label htmlFor="email-updated">{t("email.updateLabel")}</Label>
              <Input
                id="email-updated"
                type="email"
                value={updatedEmail}
                onChange={(e) => setUpdatedEmail(e.target.value)}
                placeholder={t("email.updatePlaceholder")}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email-notification">{t("email.notificationLabel")}</Label>
              <Input
                id="email-notification"
                type="email"
                value={notificationEmail}
                onChange={(e) => setNotificationEmail(e.target.value)}
                placeholder={t("email.notificationPlaceholder")}
              />
              <p className="text-xs text-muted-foreground">{t("email.notificationNote")}</p>
            </div>
            <Button onClick={saveEmails} size="sm">
              {emailSaved ? t("email.saved") : t("email.saveButton")}
            </Button>
          </CardContent>
        </Card>

        {/* Language */}
        <Card>
          <CardHeader>
            <CardTitle>{t("language.title")}</CardTitle>
            <CardDescription>{t("language.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <LocaleSwitcher />
          </CardContent>
        </Card>

        {/* Theme */}
        <Card>
          <CardHeader>
            <CardTitle>{t("theme.title")}</CardTitle>
            <CardDescription>{t("theme.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {(
                [
                  { value: "dark", icon: Moon, label: t("theme.dark") },
                  { value: "light", icon: Sun, label: t("theme.light") },
                  { value: "system", icon: Monitor, label: t("theme.system") },
                ] as const
              ).map(({ value, icon: Icon, label }) => (
                <Button
                  key={value}
                  variant={theme === value ? "default" : "outline"}
                  className="gap-2"
                  aria-pressed={theme === value}
                  onClick={() => setTheme(value)}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Connected Accounts */}
        <Card>
          <CardHeader>
            <CardTitle>{t("accounts.title")}</CardTitle>
            <CardDescription>{t("accounts.description")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Google */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted">
                  <GoogleIcon />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium">{t("accounts.google")}</p>
                  {googleConnected && session?.user?.email && (
                    <p className="text-xs text-muted-foreground truncate">{session.user.email}</p>
                  )}
                  <Badge
                    variant={googleConnected ? "secondary" : "outline"}
                    className="mt-0.5 text-xs"
                  >
                    {googleConnected ? t("accounts.connected") : t("accounts.notConnected")}
                  </Badge>
                </div>
              </div>
              {googleConnected ? (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      {t("accounts.signOut")}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        {t("accounts.signOutConfirmTitle")}
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        {t("accounts.signOutConfirmDescription", { provider: t("accounts.google") })}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>{t("accounts.confirmCancel")}</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => {
                          signOut({ redirect: false });
                          toast.success(t("accounts.unlinkSuccess", { provider: t("accounts.google") }));
                        }}
                      >
                        {t("accounts.confirmSignOut")}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => signIn("google", { callbackUrl: "/settings" })}
                >
                  {t("accounts.link")}
                </Button>
              )}
            </div>

            <Separator />

            {/* GitHub */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted">
                  <GitHubIcon />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium">{t("accounts.github")}</p>
                  {githubConnected && session?.user?.email && (
                    <p className="text-xs text-muted-foreground truncate">{session.user.email}</p>
                  )}
                  <Badge
                    variant={githubConnected ? "secondary" : "outline"}
                    className="mt-0.5 text-xs"
                  >
                    {githubConnected ? t("accounts.connected") : t("accounts.notConnected")}
                  </Badge>
                </div>
              </div>
              {githubConnected ? (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      {t("accounts.signOut")}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        {t("accounts.signOutConfirmTitle")}
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        {t("accounts.signOutConfirmDescription", { provider: t("accounts.github") })}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>{t("accounts.confirmCancel")}</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => {
                          signOut({ redirect: false });
                          toast.success(t("accounts.unlinkSuccess", { provider: t("accounts.github") }));
                        }}
                      >
                        {t("accounts.confirmSignOut")}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => signIn("github", { callbackUrl: "/settings" })}
                >
                  {t("accounts.link")}
                </Button>
              )}
            </div>

            <Separator />

            {/* Wallet */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Wallet className="h-4 w-4 text-primary" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium">{t("accounts.wallet")}</p>
                  {walletConnected && (
                    <p className="font-mono text-xs text-muted-foreground truncate">
                      {truncateAddress(publicKey.toBase58(), 8)}
                    </p>
                  )}
                  {linkedWallet && !walletConnected && (
                    <p className="font-mono text-xs text-muted-foreground truncate">
                      {truncateAddress(linkedWallet, 8)}
                    </p>
                  )}
                  <Badge
                    variant={walletConnected || linkedWallet ? "secondary" : "outline"}
                    className="mt-0.5 text-xs"
                  >
                    {walletConnected
                      ? t("accounts.connected")
                      : linkedWallet
                        ? t("accounts.linked")
                        : t("accounts.notConnected")}
                  </Badge>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {isSocialSession && !linkedWallet && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLinkWallet}
                    disabled={linkingWallet}
                    className="gap-1.5"
                  >
                    <Link className="h-3.5 w-3.5" aria-hidden="true" />
                    {linkingWallet
                      ? t("accounts.linking")
                      : connected
                        ? t("accounts.linkWallet")
                        : t("accounts.connectAndLink")}
                  </Button>
                )}
                {walletConnected ? (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        {t("accounts.unlink")}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          {t("accounts.disconnectWalletTitle")}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          {t("accounts.disconnectWalletDescription")}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>{t("accounts.confirmCancel")}</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => {
                            disconnect();
                            toast.success(t("accounts.walletDisconnected"));
                          }}
                        >
                          {t("accounts.confirmDisconnect")}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                ) : !isSocialSession || linkedWallet ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setWalletModalVisible(true)}
                  >
                    {t("accounts.link")}
                  </Button>
                ) : null}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle>{t("notifications.title")}</CardTitle>
            <CardDescription>{t("notifications.description")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="notif-email" className="cursor-pointer">
                {t("notifications.email")}
              </Label>
              <Switch
                id="notif-email"
                checked={notifications.email}
                onCheckedChange={(v) => updateNotif("email", v)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <Label htmlFor="notif-push" className="cursor-pointer">
                {t("notifications.push")}
              </Label>
              <Switch
                id="notif-push"
                checked={notifications.push}
                onCheckedChange={(v) => updateNotif("push", v)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Privacy */}
        <Card>
          <CardHeader>
            <CardTitle>{t("privacy.title")}</CardTitle>
            <CardDescription>{t("privacy.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <Label htmlFor="profile-public" className="cursor-pointer font-medium">
                  {isProfilePublic ? t("privacy.public") : t("privacy.private")}
                </Label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {isProfilePublic ? t("privacy.publicDesc") : t("privacy.privateDesc")}
                </p>
              </div>
              <Switch
                id="profile-public"
                checked={isProfilePublic}
                onCheckedChange={toggleProfileVisibility}
                aria-label={isProfilePublic ? t("privacy.public") : t("privacy.private")}
              />
            </div>
          </CardContent>
        </Card>

        {/* Streak Freeze */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-blue-600 dark:text-blue-500" aria-hidden="true" />
              {t("streakFreeze.title")}
            </CardTitle>
            <CardDescription>{t("streakFreeze.description")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-500/10">
                <ShieldCheck className="h-6 w-6 text-blue-600 dark:text-blue-500" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <p className="text-lg font-bold">
                  {t("streakFreeze.freezesRemaining", { count: streakFreezeCount })}
                </p>
                <p className="text-xs text-muted-foreground">{t("streakFreeze.earnMore")}</p>
              </div>
            </div>
            {streakFreezeUsedDates.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  {t("streakFreeze.recentlyUsed")}
                </p>
                <div className="flex flex-wrap gap-2">
                  {streakFreezeUsedDates.slice(-7).map((date) => (
                    <Badge
                      key={date}
                      variant="secondary"
                      className="gap-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
                    >
                      <ShieldCheck className="h-3 w-3" aria-hidden="true" />
                      {date}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Export */}
        <Card>
          <CardHeader>
            <CardTitle>{t("export.title")}</CardTitle>
            <CardDescription>{t("export.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="gap-2" onClick={handleExport}>
              <Download className="h-4 w-4" aria-hidden="true" />
              {t("export.button")}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
