"use client";

import { createContext, useContext, ReactNode, useMemo, CSSProperties } from 'react';
import { Theme, ThemeAssetSlot } from '@/types/theme';

interface ThemeContextValue {
  theme: Theme;
  getSlot: (slotKey: string) => ThemeAssetSlot | undefined;
  getSlotUrl: (slotKey: string) => string | null;
  cssVars: CSSProperties;
}

const ThemeCtx = createContext<ThemeContextValue | null>(null);

export function useInvitationTheme() {
  const ctx = useContext(ThemeCtx);
  if (!ctx) throw new Error('useInvitationTheme must be used within InvitationThemeProvider');
  return ctx;
}

interface Props {
  theme: Theme;
  children: ReactNode;
}

export function InvitationThemeProvider({ theme, children }: Props) {
  const slotMap = useMemo(
    () => new Map(theme.assetSlots.map((s) => [s.slotKey, s])),
    [theme.assetSlots]
  );

  const getSlot = (key: string) => slotMap.get(key);
  const getSlotUrl = (key: string) => slotMap.get(key)?.assetUrl ?? null;

  const cssVars = useMemo<CSSProperties>(() => {
    const c = theme.colors;
    return {
      '--theme-primary': c.primary,
      '--theme-secondary': c.secondary,
      '--theme-accent': c.accent,
      '--theme-surface': c.surface,
      '--theme-text-primary': c.textPrimary,
      '--theme-text-secondary': c.textSecondary,
    } as CSSProperties;
  }, [theme.colors]);

  return (
    <ThemeCtx.Provider value={{ theme, getSlot, getSlotUrl, cssVars }}>
      <div style={cssVars}>{children}</div>
    </ThemeCtx.Provider>
  );
}
