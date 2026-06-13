"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type TrialStatus = "none" | "preview" | "claimed" | "converted" | "expired";

type GuestSessionResponse = {
  data: {
    status: TrialStatus;
    expiresAt?: string;
    remainingSeconds?: number;
    slug?: string;
  } | null;
  error: { code: string; message: string } | null;
};

type UseTrialTimerOptions = {
  onExpire?: () => void;
  pollIntervalMs?: number;
};

export function useTrialTimer({ onExpire, pollIntervalMs = 10_000 }: UseTrialTimerOptions = {}) {
  const [status, setStatus] = useState<TrialStatus>("none");
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [slug, setSlug] = useState<string | null>(null);
  const expiredCallbackSent = useRef(false);

  const syncWithServer = useCallback(async () => {
    try {
      const response = await fetch("/api/guest-session", { cache: "no-store" });
      const json = (await response.json()) as GuestSessionResponse;
      const nextStatus = json.data?.status ?? "none";

      setStatus((previousStatus) =>
        nextStatus === "none" &&
        (previousStatus === "preview" || previousStatus === "claimed" || previousStatus === "expired")
          ? "expired"
          : nextStatus,
      );
      setRemainingSeconds(json.data?.remainingSeconds ?? 0);
      setSlug(json.data?.slug ?? null);
    } catch (error) {
      console.error("[useTrialTimer] Failed to synchronize timer:", error);
    }
  }, []);

  useEffect(() => {
    void syncWithServer();
    const poll = window.setInterval(() => void syncWithServer(), pollIntervalMs);
    return () => window.clearInterval(poll);
  }, [pollIntervalMs, syncWithServer]);

  useEffect(() => {
    if (status !== "preview" && status !== "claimed") return;
    const timer = window.setInterval(() => {
      setRemainingSeconds((previous) => Math.max(0, previous - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [status]);

  const isExpired = status === "expired" || (status !== "none" && status !== "converted" && remainingSeconds <= 0);

  useEffect(() => {
    if (isExpired && !expiredCallbackSent.current) {
      expiredCallbackSent.current = true;
      onExpire?.();
    } else if (!isExpired) {
      expiredCallbackSent.current = false;
    }
  }, [isExpired, onExpire]);

  return {
    remainingSeconds,
    status,
    slug,
    isExpired,
    isExpiringSoon: remainingSeconds > 0 && remainingSeconds < 60,
  };
}
