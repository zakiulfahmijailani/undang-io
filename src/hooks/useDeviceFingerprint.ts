"use client";

import { useEffect, useState } from "react";

const DEVICE_FINGERPRINT_KEY = "device_fp";

export function useDeviceFingerprint(): string | null {
  const [fingerprint, setFingerprint] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadFingerprint() {
      try {
        const cached = sessionStorage.getItem(DEVICE_FINGERPRINT_KEY);
        if (cached) {
          setFingerprint(cached);
          return;
        }

        const FingerprintJS = await import("@fingerprintjs/fingerprintjs");
        const agent = await FingerprintJS.load();
        const result = await agent.get();

        sessionStorage.setItem(DEVICE_FINGERPRINT_KEY, result.visitorId);
        if (isMounted) setFingerprint(result.visitorId);
      } catch (error) {
        console.error("[useDeviceFingerprint] Failed:", error);
      }
    }

    void loadFingerprint();

    return () => {
      isMounted = false;
    };
  }, []);

  return fingerprint;
}
