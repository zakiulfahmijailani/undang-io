/* SVG-only ornament library for the Jawa Agung royal Javanese wedding theme. */

"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

type OrnamentPosition = "tl" | "tr" | "bl" | "br";

type BaseSvgProps = {
  color?: string;
  opacity?: number;
  className?: string;
};

type CornerOrnamentProps = BaseSvgProps & {
  position?: OrnamentPosition;
  size?: number;
};

type DividerOrnamentProps = BaseSvgProps & {
  width?: number;
};

type WayangSilhouetteProps = BaseSvgProps & {
  width?: number;
  height?: number;
};

type JanurArchProps = BaseSvgProps & {
  width?: number;
};

type MelatiClusterProps = BaseSvgProps & {
  count?: number;
  spread?: number;
};

function safeId(prefix: string, rawId: string) {
  return `${prefix}-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
}

function cornerTransform(position: OrnamentPosition) {
  if (position === "tr") return "scaleX(-1)";
  if (position === "bl") return "scaleY(-1)";
  if (position === "br") return "scale(-1,-1)";
  return undefined;
}

function MelatiFlower({ color = "currentColor", opacity = 1, className }: BaseSvgProps) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
      <g fill={color} opacity={opacity}>
        <ellipse cx="12" cy="5.1" rx="2.7" ry="5" />
        <ellipse cx="18.5" cy="9.1" rx="2.65" ry="4.8" transform="rotate(72 18.5 9.1)" />
        <ellipse cx="16.1" cy="16.6" rx="2.65" ry="4.8" transform="rotate(144 16.1 16.6)" />
        <ellipse cx="7.9" cy="16.6" rx="2.65" ry="4.8" transform="rotate(216 7.9 16.6)" />
        <ellipse cx="5.5" cy="9.1" rx="2.65" ry="4.8" transform="rotate(288 5.5 9.1)" />
      </g>
      <circle cx="12" cy="12" r="2.15" fill="#C8922A" opacity={opacity} />
      <circle cx="12" cy="12" r="0.85" fill="#F5EDD6" opacity={opacity * 0.86} />
    </svg>
  );
}

export function BatikBorder({ color = "#D4A843", opacity = 1, className }: BaseSvgProps) {
  const patternId = safeId("jawa-kawung-border", useId());

  return (
    <svg
      width="100%"
      height="32"
      viewBox="0 0 640 32"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("pointer-events-none block", className)}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <pattern id={patternId} x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
          <path d="M16 2.6C23.7 2.6 29.4 8.6 29.4 16C29.4 23.4 23.7 29.4 16 29.4C8.3 29.4 2.6 23.4 2.6 16C2.6 8.6 8.3 2.6 16 2.6Z" fill="none" stroke={color} strokeWidth="0.8" opacity="0.28" />
          <path d="M16 3.6C21.8 8.5 21.8 23.5 16 28.4C10.2 23.5 10.2 8.5 16 3.6Z" fill="none" stroke={color} strokeWidth="1.05" />
          <path d="M3.6 16C8.5 10.2 23.5 10.2 28.4 16C23.5 21.8 8.5 21.8 3.6 16Z" fill="none" stroke={color} strokeWidth="1.05" />
          <path d="M7.4 7.4L24.6 24.6M24.6 7.4L7.4 24.6" fill="none" stroke={color} strokeWidth="0.55" opacity="0.42" />
          <path d="M16 10.4L21.6 16L16 21.6L10.4 16Z" fill="none" stroke={color} strokeWidth="0.72" opacity="0.82" />
          <circle cx="16" cy="16" r="1.6" fill={color} opacity="0.75" />
        </pattern>
      </defs>
      <rect width="640" height="32" fill={`url(#${patternId})`} opacity={opacity} />
    </svg>
  );
}

export function KawungBackground({ color = "#D4A843", opacity = 0.04, className }: BaseSvgProps) {
  const patternId = safeId("jawa-kawung-bg", useId());

  return (
    <svg
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <pattern id={patternId} x="0" y="0" width="72" height="72" patternUnits="userSpaceOnUse">
          <rect width="72" height="72" fill="transparent" />
          <path d="M36 8C49 17 49 55 36 64C23 55 23 17 36 8Z" fill="none" stroke={color} strokeWidth="1.25" />
          <path d="M8 36C17 23 55 23 64 36C55 49 17 49 8 36Z" fill="none" stroke={color} strokeWidth="1.25" />
          <path d="M36 23L49 36L36 49L23 36Z" fill="none" stroke={color} strokeWidth="0.9" />
          <path d="M0 0L72 72M72 0L0 72" stroke={color} strokeWidth="0.45" opacity="0.55" />
          <circle cx="36" cy="36" r="2.5" fill={color} />
          <circle cx="0" cy="0" r="1.6" fill={color} />
          <circle cx="72" cy="0" r="1.6" fill={color} />
          <circle cx="0" cy="72" r="1.6" fill={color} />
          <circle cx="72" cy="72" r="1.6" fill={color} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} opacity={opacity} />
    </svg>
  );
}

export function CornerOrnament({ position = "tl", color = "#D4A843", opacity = 1, size = 80, className }: CornerOrnamentProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("pointer-events-none block overflow-visible", className)}
      style={{ transform: cornerTransform(position), transformOrigin: "center" }}
      aria-hidden="true"
      focusable="false"
    >
      <g fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" opacity={opacity}>
        <path d="M8 72V8H72" strokeWidth="1.35" />
        <path d="M15 63V15H63" strokeWidth="0.75" opacity="0.65" />
        <path d="M10 59C25 54 38 43 45 27C49 17 55 11 65 9" strokeWidth="1.2" />
        <path d="M18 51C18 40 25 34 36 38C34 49 27 55 18 51Z" strokeWidth="1.05" />
        <path d="M37 35C35 24 42 17 54 17C53 29 46 36 37 35Z" strokeWidth="1.05" />
        <path d="M22 27C33 24 41 28 46 38C35 40 27 36 22 27Z" strokeWidth="0.95" opacity="0.84" />
        <path d="M54 11C68 19 71 31 61 40C55 30 53 21 54 11Z" strokeWidth="0.85" opacity="0.7" />
        <path d="M51 52C55 43 63 39 72 43C68 52 59 57 51 52Z" strokeWidth="0.85" opacity="0.6" />
        <path d="M29 61C37 55 45 55 52 62C43 67 35 67 29 61Z" strokeWidth="0.85" opacity="0.58" />
        <path d="M42 28C46 26 51 28 53 33C49 35 44 33 42 28Z" strokeWidth="0.7" opacity="0.78" />
        <path d="M22 66L28 60L34 66L28 72Z" strokeWidth="0.85" />
        <path d="M57 8L63 2L69 8L63 14Z" strokeWidth="0.85" />
        <path d="M7 73L12 68L17 73L12 78Z" strokeWidth="0.75" opacity="0.75" />
      </g>
      <g fill={color} opacity={opacity}>
        <circle cx="72" cy="8" r="1.7" />
        <circle cx="8" cy="72" r="1.7" />
        <circle cx="45" cy="27" r="1.25" />
      </g>
    </svg>
  );
}

export function DividerOrnament({ color = "#D4A843", opacity = 1, width = 320, className }: DividerOrnamentProps) {
  return (
    <svg
      width={width}
      height={40}
      viewBox="0 0 320 40"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("pointer-events-none block max-w-full", className)}
      aria-hidden="true"
      focusable="false"
    >
      <g fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" opacity={opacity}>
        <path className="jawa-divider-line" d="M16 20H116" strokeWidth="1" />
        <path className="jawa-divider-line" d="M204 20H304" strokeWidth="1" />
        <path d="M30 20L36 14L42 20L36 26Z" strokeWidth="0.85" opacity="0.75" />
        <path d="M278 20L284 14L290 20L284 26Z" strokeWidth="0.85" opacity="0.75" />
        <path d="M113 20C118 16 123 16 128 20C123 24 118 24 113 20Z" strokeWidth="0.85" />
        <path d="M207 20C202 16 197 16 192 20C197 24 202 24 207 20Z" strokeWidth="0.85" />
        <path d="M128 8C124 16 124 24 128 32L134 20Z" strokeWidth="0.9" opacity="0.78" />
        <path d="M192 8C196 16 196 24 192 32L186 20Z" strokeWidth="0.9" opacity="0.78" />
      </g>
      <g transform="translate(148 8)" opacity={opacity}>
        <MelatiFlower color={color} className="h-6 w-6" />
      </g>
      <g fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" opacity={opacity}>
        <path d="M160 8C164 14 164 26 160 32C156 26 156 14 160 8Z" strokeWidth="1.1" />
        <path d="M149 17C155 10 164 10 171 17C163 22 156 22 149 17Z" strokeWidth="0.95" />
        <path d="M150 23C156 30 164 30 170 23C162 19 157 19 150 23Z" strokeWidth="0.95" />
        <circle cx="160" cy="20" r="1.6" fill={color} stroke="none" />
      </g>
    </svg>
  );
}

export function WayangSilhouette({ color = "currentColor", opacity = 0.04, width = 120, height = 280, className }: WayangSilhouetteProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 120 280"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("pointer-events-none block", className)}
      aria-hidden="true"
      focusable="false"
    >
      <g fill={color} opacity={opacity}>
        <path d="M58 4L75 28L72 50L94 31L83 62C101 70 113 88 112 111C111 133 100 151 82 163C96 187 101 224 94 270H32C25 224 30 187 44 163C26 151 15 133 14 111C13 88 25 70 43 62L32 31L55 50L58 4Z" />
        <path d="M45 63C57 70 69 70 82 63C84 83 75 98 62 101C49 98 41 83 45 63Z" opacity="0.95" />
        <path d="M21 106C36 129 82 130 104 106L98 146C81 160 41 160 25 146Z" />
        <path d="M21 119C6 130 2 151 10 173C20 160 26 144 27 126Z" />
        <path d="M98 122C118 136 125 165 112 191C102 174 96 153 98 122Z" />
        <path d="M47 178H77L86 270H38Z" />
      </g>
      <g fill="none" stroke="#F5EDD6" strokeLinecap="round" opacity={opacity * 0.72}>
        <path d="M39 35L59 50L79 35" strokeWidth="2" />
        <path d="M43 114C57 122 76 122 94 112" strokeWidth="4" />
        <path d="M50 190H76M47 209H79M45 228H82" strokeWidth="3" />
        <path d="M59 82C65 85 72 84 78 80" strokeWidth="2" />
      </g>
    </svg>
  );
}

export function JanurArch({ color = "#D4A843", opacity = 1, width = 320, className }: JanurArchProps) {
  const leaves = Array.from({ length: 22 }, (_, index) => {
    const side = index < 11 ? -1 : 1;
    const local = index < 11 ? index : index - 11;
    const x = side < 0 ? 45 + local * 11 : 275 - local * 11;
    const y = 128 - Math.sin((local + 1) / 12 * Math.PI) * 82;
    const rotation = side < 0 ? -64 + local * 8 : 64 - local * 8;
    return { x, y, rotation };
  });

  return (
    <svg
      width={width}
      height={160}
      viewBox="0 0 320 160"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("pointer-events-none block max-w-full", className)}
      aria-hidden="true"
      focusable="false"
    >
      <g fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" opacity={opacity}>
        <path d="M36 146C56 66 106 18 160 18C214 18 264 66 284 146" strokeWidth="2.2" />
        <path d="M58 146C75 79 112 42 160 42C208 42 245 79 262 146" strokeWidth="1.2" opacity="0.6" />
        <path d="M101 146C108 99 128 75 160 75C192 75 212 99 219 146" strokeWidth="0.85" opacity="0.38" strokeDasharray="4 8" />
      </g>
      <g fill={color} opacity={opacity * 0.72}>
        {leaves.map((leaf, index) => (
          <path
            key={`${leaf.x}-${index}`}
            d="M0 0C8 -7 17 -7 24 0C16 7 8 7 0 0Z"
            transform={`translate(${leaf.x} ${leaf.y}) rotate(${leaf.rotation}) scale(.72)`}
          />
        ))}
      </g>
      <g transform="translate(148 8)" opacity={opacity}>
        <MelatiFlower color={color} className="h-8 w-8" />
      </g>
      <g fill={color} opacity={opacity * 0.8}>
        <circle cx="160" cy="18" r="2" />
        <circle cx="36" cy="146" r="2" />
        <circle cx="284" cy="146" r="2" />
      </g>
    </svg>
  );
}

export function MelatiCluster({ count = 5, spread = 60, color = "#D4A843", opacity = 1, className }: MelatiClusterProps) {
  const flowers = Array.from({ length: count }, (_, index) => {
    const angle = (index * 137.5) % 360;
    const radius = spread * (0.12 + ((index * 17) % 48) / 100);
    const radians = (angle * Math.PI) / 180;
    const x = spread / 2 + Math.cos(radians) * radius;
    const y = spread / 2 + Math.sin(radians) * radius;
    const size = 12 + ((index * 7) % 10);
    return { x, y, size, rotation: (index * 41) % 360, opacity: 0.36 + ((index * 13) % 38) / 100 };
  });

  return (
    <svg
      width={spread}
      height={spread}
      viewBox={`0 0 ${spread} ${spread}`}
      xmlns="http://www.w3.org/2000/svg"
      className={cn("pointer-events-none block overflow-visible", className)}
      aria-hidden="true"
      focusable="false"
    >
      {flowers.map((flower, index) => (
        <g key={`${flower.x}-${index}`} transform={`translate(${flower.x} ${flower.y}) rotate(${flower.rotation}) scale(${flower.size / 24})`} opacity={opacity * flower.opacity}>
          <g transform="translate(-12 -12)">
            <MelatiFlower color={index % 3 === 0 ? "#FDF8EA" : color} />
          </g>
        </g>
      ))}
    </svg>
  );
}
