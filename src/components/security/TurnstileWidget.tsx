"use client";

import { Turnstile } from "@marsidev/react-turnstile";
import { useEffect } from "react";

interface TurnstileWidgetProps {
  onSuccess: (token: string) => void;
  onError?: () => void;
  onExpire?: () => void;
}

export function TurnstileWidget({ onSuccess, onError, onExpire }: TurnstileWidgetProps) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  useEffect(() => {
    if (!siteKey) {
      onSuccess("dev-bypass-no-site-key");
    }
  }, [siteKey, onSuccess]);

  if (!siteKey) return null;

  return (
    <Turnstile
      siteKey={siteKey}
      onSuccess={onSuccess}
      onError={onError}
      onExpire={onExpire}
      options={{
        theme: "light",
        size: "invisible",
        execution: "render",
        language: "id",
      }}
    />
  );
}
