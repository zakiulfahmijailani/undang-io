"use client";

import { useEffect, useState, type RefObject } from "react";

const DEFAULT_NATIVE_WIDTH = 375;

export function usePreviewScale(
  containerRef: RefObject<HTMLElement | null>,
  nativeHeight = 812,
  padding = 32,
  nativeWidth = DEFAULT_NATIVE_WIDTH,
): number {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateScale = () => {
      const availableHeight = Math.max(0, container.clientHeight - padding);
      const availableWidth = Math.max(0, container.clientWidth - padding);
      const nextScale = Math.min(1, availableHeight / nativeHeight, availableWidth / nativeWidth);
      setScale(Number.isFinite(nextScale) && nextScale > 0 ? nextScale : 1);
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(container);
    window.addEventListener("resize", updateScale);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateScale);
    };
  }, [containerRef, nativeHeight, nativeWidth, padding]);

  return scale;
}
