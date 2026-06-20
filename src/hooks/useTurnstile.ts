"use client";

import { useCallback, useRef, useState } from "react";

export interface UseTurnstileReturn {
  token: string | null;
  isReady: boolean;
  isError: boolean;
  getToken: () => string | null;
  onSuccess: (token: string) => void;
  onError: () => void;
  onExpire: () => void;
  reset: () => void;
}

export function useTurnstile(): UseTurnstileReturn {
  const [token, setToken] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isError, setIsError] = useState(false);
  const tokenRef = useRef<string | null>(null);

  const onSuccess = useCallback((nextToken: string) => {
    tokenRef.current = nextToken;
    setToken(nextToken);
    setIsReady(true);
    setIsError(false);
  }, []);

  const onError = useCallback(() => {
    tokenRef.current = null;
    setToken(null);
    setIsReady(false);
    setIsError(true);
  }, []);

  const onExpire = useCallback(() => {
    tokenRef.current = null;
    setToken(null);
    setIsReady(false);
  }, []);

  const reset = useCallback(() => {
    tokenRef.current = null;
    setToken(null);
    setIsReady(false);
    setIsError(false);
  }, []);

  const getToken = useCallback(() => tokenRef.current, []);

  return { token, isReady, isError, getToken, onSuccess, onError, onExpire, reset };
}
