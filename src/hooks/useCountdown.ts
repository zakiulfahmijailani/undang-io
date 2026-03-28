"use client";

import { useState, useEffect } from "react";

export interface CountdownResult {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

export function useCountdown(target: Date | null): CountdownResult | null {
  const [result, setResult] = useState<CountdownResult | null>(null);

  useEffect(() => {
    if (!target) return;

    function compute() {
      const now = Date.now();
      const diff = target!.getTime() - now;

      if (diff <= 0) {
        setResult({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true });
        return;
      }

      const days    = Math.floor(diff / 86_400_000);
      const hours   = Math.floor((diff % 86_400_000) / 3_600_000);
      const minutes = Math.floor((diff % 3_600_000)  / 60_000);
      const seconds = Math.floor((diff % 60_000)     / 1_000);
      setResult({ days, hours, minutes, seconds, isPast: false });
    }

    compute();
    const id = setInterval(compute, 1_000);
    return () => clearInterval(id);
  }, [target]);

  return result;
}
