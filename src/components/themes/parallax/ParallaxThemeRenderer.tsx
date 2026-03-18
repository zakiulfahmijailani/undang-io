'use client';

import React, {
    useEffect,
    useRef,
    useState,
    useCallback,
    CSSProperties,
    ReactNode,
} from 'react';
import Image from 'next/image';
import {
    ParallaxTheme,
    ParallaxAssetSlot,
    ParallaxRenderState,
    SLOT_DEPTH_PRESETS,
    SLOT_ZINDEX_PRESETS,
    DEFAULT_LAYER_SETTINGS,
} from '@/types/theme';

export interface ParallaxThemeRendererProps {
    theme: ParallaxTheme;
    photoGroom?: string | null;
    photoBride?: string | null;
    children?: ReactNode;
    className?: string;
    staticMode?: boolean;
}

function lerp(current: number, target: number, factor: number): number {
    return current + (target - current) * factor;
}

function computeLayerTransform(
    slot: ParallaxAssetSlot,
    renderState: ParallaxRenderState,
    tiltStrength: number,
    scrollStrength: number,
    staticMode: boolean
): CSSProperties {
    if (staticMode || renderState.reducedMotion) {
        return { transform: slot.settings.offsetTransform ?? 'none' };
    }
    const depth =
        slot.settings.depth ??
        SLOT_DEPTH_PRESETS[slot.slotKey] ??
        DEFAULT_LAYER_SETTINGS.depth;
    const shiftX = renderState.tiltX * tiltStrength * depth;
    const shiftY = renderState.tiltY * tiltStrength * depth;
    const isScrollZoomLayer =
        slot.settings.scrollZoom || slot.slotKey === 'bg' || slot.slotKey === 'bg_detail';
    const scale = isScrollZoomLayer
        ? 1 + scrollStrength * renderState.scrollProgress
        : 1;
    const base = slot.settings.offsetTransform ? `${slot.settings.offsetTransform} ` : '';
    return {
        transform: `${base}translate(${shiftX}px, ${shiftY}px) scale(${scale})`,
        willChange: 'transform',
    };
}

interface LayerProps {
    slot: ParallaxAssetSlot;
    renderState: ParallaxRenderState;
    tiltStrength: number;
    scrollStrength: number;
    staticMode: boolean;
    srcOverride?: string;
}

function ParallaxLayer({ slot, renderState, tiltStrength, scrollStrength, staticMode, srcOverride }: LayerProps) {
    const src = srcOverride ?? slot.assetUrl;
    if (!src) return null;

    const zIndex = slot.settings.zIndex ?? SLOT_ZINDEX_PRESETS[slot.slotKey] ?? 0;
    const opacity = slot.settings.opacity ?? 1;
    const blendMode = (slot.settings.blendMode ?? 'normal') as CSSProperties['mixBlendMode'];
    const floatLoop = slot.settings.floatLoop && !staticMode && !renderState.reducedMotion;
    const floatDuration = slot.settings.floatDuration ?? 6;
    const transformStyle = computeLayerTransform(slot, renderState, tiltStrength, scrollStrength, staticMode);

    return (
        <div
            aria-hidden="true"
            data-slot={slot.slotKey}
            style={{
                position: 'absolute',
                inset: '-10%',
                zIndex,
                opacity,
                mixBlendMode: blendMode,
                pointerEvents: 'none',
                transition: staticMode ? 'none' : 'transform 0.05s linear',
                animation: floatLoop
                    ? `parallax-float ${floatDuration}s ease-in-out infinite alternate`
                    : undefined,
                ...transformStyle,
            }}
        >
            <Image
                src={src}
                alt=""
                fill
                sizes="120vw"
                style={{
                    objectFit: slot.slotKey === 'photo_groom' || slot.slotKey === 'photo_bride' ? 'contain' : 'cover',
                    objectPosition: 'center',
                    pointerEvents: 'none',
                    userSelect: 'none',
                }}
                priority={slot.slotKey === 'bg'}
                draggable={false}
            />
        </div>
    );
}

export function ParallaxThemeRenderer({
    theme, photoGroom, photoBride, children, className = '', staticMode = false,
}: ParallaxThemeRendererProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const rafRef = useRef<number | null>(null);
    const currentTilt = useRef({ x: 0, y: 0 });
    const targetTilt = useRef({ x: 0, y: 0 });

    const [renderState, setRenderState] = useState<ParallaxRenderState>({
        tiltX: 0, tiltY: 0, scrollProgress: 0, isMobile: false, reducedMotion: false,
    });

    const { config } = theme;
    const { tiltStrength, scrollStrength, lerpFactor, gyroEnabled, zoomEnabled } = config.animation;

    useEffect(() => {
        const isMobile = window.matchMedia('(pointer: coarse)').matches;
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        setRenderState((prev) => ({ ...prev, isMobile, reducedMotion }));
    }, []);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (staticMode) return;
        const el = containerRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        targetTilt.current = {
            x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
            y: ((e.clientY - rect.top) / rect.height - 0.5) * 2,
        };
    }, [staticMode]);

    const handleDeviceOrientation = useCallback((e: DeviceOrientationEvent) => {
        if (staticMode || !gyroEnabled) return;
        targetTilt.current = {
            x: Math.max(-1, Math.min(1, (e.gamma ?? 0) / 30)),
            y: Math.max(-1, Math.min(1, (e.beta ?? 0) / 30)),
        };
    }, [staticMode, gyroEnabled]);

    const handleScroll = useCallback(() => {
        if (staticMode || !zoomEnabled) return;
        const el = containerRef.current;
        if (!el) return;
        const { top, height } = el.getBoundingClientRect();
        setRenderState((prev) => ({
            ...prev,
            scrollProgress: Math.max(0, Math.min(1, -top / (height * 0.5))),
        }));
    }, [staticMode, zoomEnabled]);

    useEffect(() => {
        if (staticMode) return;
        function tick() {
            const lf = lerpFactor ?? 0.08;
            currentTilt.current.x = lerp(currentTilt.current.x, targetTilt.current.x, lf);
            currentTilt.current.y = lerp(currentTilt.current.y, targetTilt.current.y, lf);
            setRenderState((prev) => ({ ...prev, tiltX: currentTilt.current.x, tiltY: currentTilt.current.y }));
            rafRef.current = requestAnimationFrame(tick);
        }
        rafRef.current = requestAnimationFrame(tick);
        return () => { if (rafRef.current !== null) cancelAnimationFrame(rafRef.current); };
    }, [staticMode, lerpFactor]);

    useEffect(() => {
        if (staticMode) return;
        const el = containerRef.current;
        if (!el) return;
        el.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('scroll', handleScroll, { passive: true });
        if (renderState.isMobile && gyroEnabled)
            window.addEventListener('deviceorientation', handleDeviceOrientation);
        return () => {
            el.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('deviceorientation', handleDeviceOrientation);
        };
    }, [staticMode, renderState.isMobile, gyroEnabled, handleMouseMove, handleScroll, handleDeviceOrientation]);

    const cssVars = {
        '--parallax-primary': config.palette.primary,
        '--parallax-accent': config.palette.accent,
        '--parallax-text': config.palette.text,
        '--parallax-surface': config.palette.surface ?? 'rgba(255,255,255,0.08)',
        '--parallax-overlay': config.palette.overlay ?? 'rgba(0,0,0,0.3)',
        '--parallax-font-heading': config.fonts.heading,
        '--parallax-font-body': config.fonts.body,
    } as CSSProperties;

    const activeSlots = theme.assetSlots
        .filter((s) => s.isActive)
        .sort((a, b) => a.displayOrder - b.displayOrder);

    return (
        <>
            <style>{`
        @keyframes parallax-float {
          from { transform: translateY(0px); }
          to   { transform: translateY(-18px); }
        }
      `}</style>
            <div
                ref={containerRef}
                className={`parallax-renderer ${className}`}
                style={{
                    position: 'relative',
                    width: '100%',
                    minHeight: '100dvh',
                    overflow: 'hidden',
                    isolation: 'isolate',
                    fontFamily: `var(--parallax-font-body, 'Inter', sans-serif)`,
                    ...cssVars,
                }}
            >
                {activeSlots.map((slot) => {
                    let srcOverride: string | undefined;
                    if (slot.slotKey === 'photo_groom' && photoGroom) srcOverride = photoGroom;
                    if (slot.slotKey === 'photo_bride' && photoBride) srcOverride = photoBride;
                    if ((slot.slotKey === 'photo_groom' || slot.slotKey === 'photo_bride') && !srcOverride && !slot.assetUrl)
                        return null;
                    return (
                        <ParallaxLayer
                            key={slot.id}
                            slot={slot}
                            renderState={renderState}
                            tiltStrength={tiltStrength}
                            scrollStrength={scrollStrength}
                            staticMode={staticMode}
                            srcOverride={srcOverride}
                        />
                    );
                })}
                {children && (
                    <div style={{ position: 'relative', zIndex: 100, width: '100%', minHeight: '100dvh' }}>
                        {children}
                    </div>
                )}
            </div>
        </>
    );
}

export default ParallaxThemeRenderer;