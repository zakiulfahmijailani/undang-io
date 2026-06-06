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

type RoyalFrameProps = BaseSvgProps & {
  inset?: number;
};

type EventMedallionProps = BaseSvgProps & {
  kind?: "akad" | "resepsi";
  size?: number;
};

type CoverDateArchProps = BaseSvgProps & {
  width?: number;
};

type BorderFrameProps = BaseSvgProps & {
  inset?: number;
};

type SparkleFieldProps = BaseSvgProps & {
  count?: number;
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
      height="36"
      viewBox="0 0 640 36"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("pointer-events-none block", className)}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <pattern id={patternId} x="0" y="0" width="36" height="36" patternUnits="userSpaceOnUse">
          <path d="M18 3.5C26 3.5 32.5 10 32.5 18C32.5 26 26 32.5 18 32.5C10 32.5 3.5 26 3.5 18C3.5 10 10 3.5 18 3.5Z" fill="none" stroke={color} strokeWidth="0.8" opacity="0.35" />
          <path d="M18 4.5C24.5 10 24.5 26 18 31.5C11.5 26 11.5 10 18 4.5Z" fill="none" stroke={color} strokeWidth="1.1" />
          <path d="M4.5 18C10 11.5 26 11.5 31.5 18C26 24.5 10 24.5 4.5 18Z" fill="none" stroke={color} strokeWidth="1.1" />
          <path d="M18 9L27 18L18 27L9 18Z" fill="none" stroke={color} strokeWidth="0.8" opacity="0.85" />
          <path d="M18 12.5L23.5 18L18 23.5L12.5 18Z" fill="none" stroke={color} strokeWidth="0.6" opacity="0.65" />
          <path d="M8.5 8.5L27.5 27.5M27.5 8.5L8.5 27.5" fill="none" stroke={color} strokeWidth="0.6" opacity="0.5" />
          <circle cx="18" cy="18" r="1.8" fill={color} opacity="0.8" />
          <circle cx="18" cy="18" r="0.6" fill="#F5EDD6" />
        </pattern>
      </defs>
      <rect width="640" height="36" fill={`url(#${patternId})`} opacity={opacity} />
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
        <pattern id={patternId} x="0" y="0" width="48" height="48" patternUnits="userSpaceOnUse">
          <rect width="48" height="48" fill="transparent" />
          <path d="M24 5C32.5 11 32.5 37 24 43C15.5 37 15.5 11 24 5Z" fill="none" stroke={color} strokeWidth="1.1" />
          <path d="M5 24C11 15.5 37 15.5 43 24C37 32.5 11 32.5 5 24Z" fill="none" stroke={color} strokeWidth="1.1" />
          <path d="M24 10C28 16 28 32 24 38C20 32 20 16 24 10Z" fill="none" stroke={color} strokeWidth="0.7" opacity="0.7" />
          <path d="M10 24C16 20 32 20 38 24C32 28 16 28 10 24Z" fill="none" stroke={color} strokeWidth="0.7" opacity="0.7" />
          <path d="M24 15L33 24L24 33L15 24Z" fill="none" stroke={color} strokeWidth="0.8" />
          <path d="M0 0L48 48M48 0L0 48" stroke={color} strokeWidth="0.5" opacity="0.6" />
          <circle cx="24" cy="24" r="2.2" fill={color} />
          <circle cx="0" cy="0" r="1.4" fill={color} />
          <circle cx="48" cy="0" r="1.4" fill={color} />
          <circle cx="0" cy="48" r="1.4" fill={color} />
          <circle cx="48" cy="48" r="1.4" fill={color} />
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

export function SparkleField({ count = 18, color = "#D4A843", opacity = 1, className }: SparkleFieldProps) {
  const sparkles = Array.from({ length: count }, (_, index) => {
    const row = Math.floor(index / 3);
    const col = index % 3;
    const baseX = (col + 0.5) * (100 / 3);
    const baseY = (row + 0.5) * (100 / Math.ceil(count / 3));
    const jitterX = ((index * 31) % 40) - 20;
    const jitterY = ((index * 47) % 40) - 20;
    return {
      left: `${Math.max(5, Math.min(95, baseX + jitterX))}%`,
      top: `${Math.max(5, Math.min(95, baseY + jitterY))}%`,
      size: 6 + ((index * 7) % 8),
      delay: `${(index % 9) * 0.45}s`,
      duration: `${3.5 + (index % 6) * 0.6}s`,
    };
  });

  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden="true">
      {sparkles.map((sparkle, index) => (
        <svg
          key={`${sparkle.left}-${sparkle.top}-${index}`}
          viewBox="0 0 20 20"
          className="jawa-sparkle absolute"
          style={{
            left: sparkle.left,
            top: sparkle.top,
            width: sparkle.size,
            height: sparkle.size,
            color,
            opacity,
            animationDelay: sparkle.delay,
            animationDuration: sparkle.duration,
          }}
          aria-hidden="true"
          focusable="false"
        >
          <path d="M10 0C10.8 6.2 13.8 9.2 20 10C13.8 10.8 10.8 13.8 10 20C9.2 13.8 6.2 10.8 0 10C6.2 9.2 9.2 6.2 10 0Z" fill="currentColor" />
          <circle cx="10" cy="10" r="1.5" fill="#FFF9EB" opacity="0.8" />
        </svg>
      ))}
    </div>
  );
}

export function CornerOrnamentElaborate({ position = "tl", color = "#B6812C", opacity = 1, size = 180, className }: CornerOrnamentProps) {
  const patternId = safeId("jawa-dense-corner-kawung", useId());

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 180 180"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("pointer-events-none block overflow-visible", className)}
      style={{ transform: cornerTransform(position), transformOrigin: "center" }}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <pattern id={patternId} width="16" height="16" patternUnits="userSpaceOnUse">
          <path d="M8 1.5C12 4.5 12 11.5 8 14.5C4 11.5 4 4.5 8 1.5ZM1.5 8C4.5 4 11.5 4 14.5 8C11.5 12 4.5 12 1.5 8Z" fill="none" stroke={color} strokeWidth=".5" />
          <path d="M8 4.5L11.5 8L8 11.5L4.5 8Z" fill="none" stroke={color} strokeWidth=".4" />
          <circle cx="8" cy="8" r=".8" fill={color} />
        </pattern>
      </defs>
      <g opacity={opacity}>
        <path d="M0 0H180V25C180 50 165 75 135 100C105 125 80 145 60 180H0V0Z" fill={`url(#${patternId})`} opacity=".65" />
        <g fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round">
          <path d="M28 178C30 170 36 165 44 165C50 165 56 160 56 153C56 146 63 140 70 140C78 140 85 133 85 125C85 116 93 108 103 108C112 108 120 100 120 90C120 80 130 70 140 70C150 70 160 60 160 48C160 38 168 30 178 30" strokeWidth="1.2" opacity="0.8" />
          <path d="M12 178C14 165 24 155 35 155C44 155 50 145 50 135C50 125 60 115 70 115C80 115 90 105 90 95C90 83 102 73 115 73C125 73 135 63 135 53C135 43 148 30 160 25" strokeWidth="0.8" opacity="0.6" />
          <path className="jawa-frame-line" d="M3 177H31C31 142 45 115 72 98C98 81 125 68 142 31V3H177" strokeWidth="2.5" />
          <path d="M10 177H38C38 148 50 123 75 106C100 89 120 70 135 38V10H177" strokeWidth=".8" opacity=".75" />
          <path d="M5 5H172M5 5V172" strokeWidth="1.2" opacity=".8" />
          <path d="M15 15H162M15 15V162" strokeWidth=".5" strokeDasharray="2 4" opacity=".85" />
          <path d="M35 145C45 115 65 95 90 85C115 75 135 55 145 35" strokeWidth="1.8" />
          <path d="M42 142C50 122 68 105 88 95C108 85 125 68 135 45" strokeWidth="0.8" opacity="0.8" />
          <path d="M60 125C50 110 55 95 72 90C78 108 72 120 60 125ZM90 72C108 78 120 72 125 60C110 50 95 55 90 72ZM105 90C95 75 105 65 120 62C125 75 120 85 105 90Z" fill="#9A8142" fillOpacity=".5" strokeWidth=".8" />
        </g>
        <g transform="translate(30 30)" fill="#FFF9EB" stroke={color} strokeWidth=".8">
          {Array.from({ length: 12 }, (_, index) => <ellipse key={index} cy="-18" rx="6" ry="18" transform={`rotate(${index * 30})`} />)}
          {Array.from({ length: 8 }, (_, index) => <ellipse key={`inner-${index}`} cy="-10" rx="3.5" ry="10" transform={`rotate(${index * 45})`} fill="#E4C779" />)}
          <circle r="6" fill="#B6812C" />
        </g>
        <g fill="#FFF9EB" stroke={color} strokeWidth=".8">
          {[{ x: 62, y: 145, s: .7 }, { x: 88, y: 118, s: .85 }, { x: 118, y: 88, s: .85 }, { x: 145, y: 62, s: .7 }].map((flower) => (
            <g key={`${flower.x}-${flower.y}`} transform={`translate(${flower.x} ${flower.y}) scale(${flower.s})`}>
              {Array.from({ length: 5 }, (_, index) => <ellipse key={index} cy="-8" rx="4.5" ry="9" transform={`rotate(${index * 72})`} />)}
              <circle r="2.8" fill="#B6812C" />
            </g>
          ))}
        </g>
      </g>
    </svg>
  );
}

export function BorderFrame({ color = "#B6812C", opacity = 1, inset = 10, className }: BorderFrameProps) {
  return (
    <div className={cn("pointer-events-none absolute", className)} style={{ inset, opacity, color }} aria-hidden="true">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 390 844" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <path className="jawa-frame-line" d="M12 4H378V12H386V832H378V840H12V832H4V12H12Z" fill="none" stroke="currentColor" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
        <path d="M8 8L12 4L16 8L12 12Z M378 4L382 8L378 12L374 8Z M382 836L378 840L374 836L378 832Z M12 840L8 836L12 832L16 836Z" fill="#F5EDD6" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        <path className="jawa-frame-line" d="M18 18H372V826H18Z" fill="none" stroke="currentColor" strokeWidth="1.2" vectorEffect="non-scaling-stroke" opacity="0.85" />
        <path className="jawa-frame-line" d="M22 22H368V822H22Z" fill="none" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 6" vectorEffect="non-scaling-stroke" opacity="0.75" />
        <path className="jawa-frame-line" d="M32 32H358V812H32Z" fill="none" stroke="currentColor" strokeWidth="0.6" vectorEffect="non-scaling-stroke" opacity="0.9" />
      </svg>
      <CornerOrnamentElaborate position="tl" color={color} className="absolute left-0 top-0 h-auto w-[80px] sm:w-[110px] lg:w-[180px]" />
      <CornerOrnamentElaborate position="tr" color={color} className="absolute right-0 top-0 h-auto w-[80px] sm:w-[110px] lg:w-[180px]" />
      <CornerOrnamentElaborate position="bl" color={color} className="absolute bottom-0 left-0 h-auto w-[80px] sm:w-[110px] lg:w-[180px]" />
      <CornerOrnamentElaborate position="br" color={color} className="absolute bottom-0 right-0 h-auto w-[80px] sm:w-[110px] lg:w-[180px]" />
    </div>
  );
}

export function GununganCrown({ color = "#8A5518", opacity = 1, className }: BaseSvgProps) {
  return (
    <svg viewBox="0 0 320 140" xmlns="http://www.w3.org/2000/svg" className={cn("pointer-events-none block overflow-visible", className)} aria-hidden="true" focusable="false">
      <g opacity={opacity} fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round">
        <path d="M160 2C172 26 195 48 200 72C205 98 185 118 160 135C135 118 115 98 120 72C125 48 148 26 160 2Z" strokeWidth="2.2" fill="#FAF4E6" fillOpacity="0.4" />
        <path d="M160 14C168 35 185 52 188 72C190 90 176 106 160 122C144 106 130 90 132 72C135 52 152 35 160 14Z" strokeWidth="1.2" />
        <path d="M160 28C165 44 175 57 176 72C178 86 168 98 160 110C152 98 142 86 144 72C145 57 155 44 160 28Z" strokeWidth="0.8" opacity="0.8" />
        <path d="M160 45V98M148 60C158 68 162 78 160 88M172 60C162 68 158 78 160 88" strokeWidth="1" />
        <path d="M12 110C65 115 102 95 130 65M308 110C255 115 218 95 190 65" strokeWidth="1.8" />
        <path d="M22 118C70 122 108 102 135 78M298 118C250 122 212 102 185 78" strokeWidth="0.8" opacity="0.75" />
        <path d="M38 125C75 128 112 110 140 88M282 125C245 128 208 110 180 88" strokeWidth="0.6" opacity="0.5" />
        <path d="M60 102C52 118 55 130 65 142M260 102C268 118 265 130 255 142" strokeWidth="1.2" />
        <path d="M98 90C85 75 68 75 58 90C72 98 88 98 98 90ZM222 90C235 75 252 75 262 90C248 98 232 98 222 90Z" fill="#78804B" fillOpacity="0.65" strokeWidth="0.8" />
        <path d="M135 70C122 55 105 55 95 70C109 78 125 78 135 70ZM185 70C198 55 215 55 225 70C211 78 195 78 185 70Z" fill="#78804B" fillOpacity="0.45" strokeWidth="0.8" />
        <path d="M125 130H18L8 122M195 130H302L312 122" strokeWidth="1.2" />
        <path d="M125 135H24L15 128M195 135H296L305 128" strokeWidth="0.6" opacity="0.7" />
        <path d="M40 130L44 126L48 130L44 134ZM80 130L84 126L88 130L84 134ZM280 130L276 126L272 130L276 134ZM240 130L236 126L232 130L236 134Z" fill="#D4A843" stroke="none" />
      </g>
      <g fill="#FFF9EB" stroke={color} strokeWidth="0.8" opacity={opacity}>
        {[{ x: 108, y: 78, s: .85 }, { x: 75, y: 98, s: .75 }, { x: 42, y: 112, s: .6 }, 
          { x: 212, y: 78, s: .85 }, { x: 245, y: 98, s: .75 }, { x: 278, y: 112, s: .6 }].map((flower) => (
          <g key={flower.x} transform={`translate(${flower.x} ${flower.y}) scale(${flower.s})`}>
            {Array.from({ length: 5 }, (_, index) => <ellipse key={index} cy="-9" rx="4.5" ry="9" transform={`rotate(${index * 72})`} />)}
            <circle r="3" fill="#B6812C" />
          </g>
        ))}
      </g>
      <g fill={color} opacity={opacity * .85}>
        <path d="M32 45C33 54 36 57 45 58C36 59 33 62 32 71C31 62 28 59 19 58C28 57 31 54 32 45ZM288 38C289 47 292 50 301 51C292 52 289 55 288 64C287 55 284 52 275 51C284 50 287 47 288 38Z" />
        <path d="M70 20C71 26 73 28 79 29C73 30 71 32 70 38C69 32 67 30 61 29C67 28 69 26 70 20ZM250 15C251 21 253 23 259 24C253 25 251 27 250 33C249 27 247 25 241 24C247 23 249 21 250 15Z" opacity="0.6" />
      </g>
    </svg>
  );
}

export function BottomArch({ color = "#B6812C", opacity = 1, width = 360, className }: CoverDateArchProps) {
  return (
    <svg width={width} viewBox="0 0 360 200" xmlns="http://www.w3.org/2000/svg" className={cn("pointer-events-none block max-w-full", className)} aria-hidden="true" focusable="false">
      <g opacity={opacity} fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round">
        <path d="M30 188C40 85 95 30 180 30C265 30 320 85 330 188" strokeWidth="2.2" />
        <path d="M48 188C58 98 106 48 180 48C254 48 302 98 312 188" strokeWidth="1" />
        <path d="M68 188C78 112 120 72 180 72C240 72 282 112 292 188" strokeWidth=".7" strokeDasharray="3 6" opacity=".8" />
        <path d="M20 188H78M282 188H340M38 170V198H60M300 170V198H322" strokeWidth="1.5" />
        <path d="M26 178H72M288 178H334" strokeWidth="0.8" opacity="0.7" />
        <path d="M160 180L165 175L170 180L165 185ZM190 180L195 175L200 180L195 185Z" fill="#D4A843" stroke="none" />
      </g>
      <g fill="#78804B" stroke={color} strokeWidth=".6" opacity={opacity * .8}>
        {Array.from({ length: 14 }, (_, index) => {
          const side = index < 7 ? -1 : 1;
          const local = index % 7;
          const x = side < 0 ? 58 + local * 18 : 302 - local * 18;
          const y = 162 - Math.sin((local + 1) / 8 * Math.PI) * 98;
          return <path key={index} d="M0 0C8-8 18-8 26 0C18 8 8 8 0 0Z" transform={`translate(${x} ${y}) rotate(${side < 0 ? -50 + local * 9 : 50 - local * 9}) scale(.55)`} />;
        })}
      </g>
      <g fill="#FFF9EB" stroke={color} strokeWidth=".7" opacity={opacity}>
        {Array.from({ length: 9 }, (_, index) => {
          if (index === 4) return null;
          const angle = Math.PI - (Math.PI * (index + 1)) / 10;
          const radius = 132;
          const x = 180 + Math.cos(angle) * radius;
          const y = 188 - Math.sin(angle) * radius;
          return (
            <g key={index} transform={`translate(${x} ${y}) scale(0.48)`}>
              {Array.from({ length: 5 }, (_, i) => <ellipse key={i} cy="-8" rx="4" ry="8" transform={`rotate(${i * 72})`} />)}
              <circle r="3" fill="#B6812C" />
            </g>
          );
        })}
      </g>
      <g transform="translate(180 30)" fill="#FFF9EB" stroke={color} strokeWidth=".8" opacity={opacity}>
        {Array.from({ length: 12 }, (_, index) => <ellipse key={index} cy="-20" rx="7" ry="20" transform={`rotate(${index * 30})`} />)}
        {Array.from({ length: 8 }, (_, index) => <ellipse key={`inner-${index}`} cy="-12" rx="4.5" ry="12" transform={`rotate(${index * 45})`} fill="#D8B45B" />)}
        <circle r="5.5" fill="#8A5518" />
      </g>
    </svg>
  );
}

export function RoyalFrame({ color = "#8A5518", opacity = 1, inset = 10, className }: RoyalFrameProps) {
  return (
    <div
      className={cn("pointer-events-none absolute", className)}
      style={{ inset, opacity }}
      aria-hidden="true"
    >
      <div className="absolute inset-0 border border-current" style={{ color }} />
      <div className="absolute inset-2 border border-current opacity-45" style={{ color }} />
      <RoyalFrameCorner color={color} className="absolute left-0 top-0 w-[42%] max-w-[205px]" />
      <RoyalFrameCorner color={color} className="absolute right-0 top-0 w-[42%] max-w-[205px] -scale-x-100" />
      <RoyalFrameCorner color={color} className="absolute bottom-0 left-0 w-[42%] max-w-[205px] -scale-y-100" />
      <RoyalFrameCorner color={color} className="absolute bottom-0 right-0 w-[42%] max-w-[205px] -scale-100" />
      <span className="absolute left-1/2 top-2 h-2.5 w-2.5 -translate-x-1/2 rotate-45 border border-current bg-[#F5EDD6]" style={{ color }} />
      <span className="absolute bottom-2 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rotate-45 border border-current bg-[#F5EDD6]" style={{ color }} />
    </div>
  );
}

export function RoyalCoverFrame({ color = "#B6812C", opacity = 1, className }: BaseSvgProps) {
  return (
    <div className={cn("pointer-events-none absolute inset-3", className)} style={{ opacity }} aria-hidden="true">
      <div className="absolute inset-0 border border-current" style={{ color }} />
      <div className="absolute inset-[7px] border border-current opacity-45" style={{ color }} />
      <CoverFrameCorner color={color} className="absolute left-0 top-0 w-[38%] max-w-[360px]" />
      <CoverFrameCorner color={color} className="absolute right-0 top-0 w-[38%] max-w-[360px] -scale-x-100" />
      <CoverFrameCorner color={color} className="absolute bottom-0 left-0 w-[38%] max-w-[360px] -scale-y-100" />
      <CoverFrameCorner color={color} className="absolute bottom-0 right-0 w-[38%] max-w-[360px] -scale-100" />
      <span className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rotate-45 border border-current bg-[#FBF4E4]" style={{ color }} />
    </div>
  );
}

function CoverFrameCorner({ color, className }: { color: string; className?: string }) {
  const patternId = safeId("jawa-cover-kawung", useId());

  return (
    <svg className={cn("block h-auto", className)} viewBox="0 0 360 360" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
      <defs>
        <pattern id={patternId} width="28" height="28" patternUnits="userSpaceOnUse">
          <path d="M14 2C20 7 20 21 14 26C8 21 8 7 14 2Z" fill="none" stroke={color} strokeWidth=".75" />
          <path d="M2 14C7 8 21 8 26 14C21 20 7 20 2 14Z" fill="none" stroke={color} strokeWidth=".75" />
          <circle cx="14" cy="14" r="1.2" fill={color} />
        </pattern>
      </defs>
      <path d="M0 0H360V42H310V78H268V118H226V163H183V213H139V263H96V310H45V360H0Z" fill={`url(#${patternId})`} opacity=".62" />
      <g fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 352H49V305H98V258H141V208H184V159H228V114H270V74H313V38H352" strokeWidth="2.2" />
        <path d="M18 352H58V313H105V266H149V216H192V167H236V122H278V83H321V48H352" strokeWidth=".7" opacity=".58" />
        <path d="M82 270C107 230 135 205 170 190C202 176 222 154 235 120" strokeWidth="1.25" />
        <path d="M118 232C130 207 150 195 176 199C167 224 148 236 118 232Z" strokeWidth="1" />
        <path d="M164 190C174 163 194 151 221 157C211 183 191 194 164 190Z" strokeWidth="1" />
        <path d="M218 139C230 112 251 102 277 111C265 136 246 146 218 139Z" strokeWidth="1" />
        <path d="M86 275C70 293 65 314 72 338M240 121C258 99 280 88 307 91" strokeWidth=".7" opacity=".75" />
      </g>
      <g fill="#FFF9EB" stroke={color} strokeWidth=".8">
        {[{ x: 105, y: 245, s: .85 }, { x: 157, y: 196, s: .68 }, { x: 225, y: 137, s: .72 }].map((flower) => (
          <g key={`${flower.x}-${flower.y}`} transform={`translate(${flower.x} ${flower.y}) scale(${flower.s})`}>
            <ellipse cy="-10" rx="5.2" ry="10" />
            <ellipse cy="-10" rx="5.2" ry="10" transform="rotate(72)" />
            <ellipse cy="-10" rx="5.2" ry="10" transform="rotate(144)" />
            <ellipse cy="-10" rx="5.2" ry="10" transform="rotate(216)" />
            <ellipse cy="-10" rx="5.2" ry="10" transform="rotate(288)" />
            <circle r="3" fill="#C8922A" />
          </g>
        ))}
      </g>
    </svg>
  );
}

export function CoverDateArch({ color = "#B6812C", opacity = 1, width = 440, className }: CoverDateArchProps) {
  return (
    <svg width={width} viewBox="0 0 440 190" xmlns="http://www.w3.org/2000/svg" className={cn("pointer-events-none block max-w-full", className)} aria-hidden="true" focusable="false">
      <g fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" opacity={opacity}>
        <path d="M64 180C72 89 129 34 220 34C311 34 368 89 376 180" strokeWidth="1.8" />
        <path d="M82 180C89 101 139 52 220 52C301 52 351 101 358 180" strokeWidth=".75" opacity=".62" />
        <path d="M108 180C115 119 153 82 220 82C287 82 325 119 332 180" strokeWidth=".6" opacity=".48" />
        <path d="M102 144H338M136 116H304" strokeWidth=".65" opacity=".5" />
        <path d="M220 12L230 22L220 32L210 22Z" strokeWidth="1" />
        <path d="M54 180H386" strokeWidth=".8" />
      </g>
      <g fill="#9A8142" opacity={opacity * .72}>
        {Array.from({ length: 18 }, (_, index) => {
          const side = index < 9 ? -1 : 1;
          const local = index % 9;
          const x = side < 0 ? 94 + local * 13 : 346 - local * 13;
          const y = 166 - Math.sin((local + 1) / 10 * Math.PI) * 98;
          return <path key={index} d="M0 0C7-7 16-7 23 0C16 7 7 7 0 0Z" transform={`translate(${x} ${y}) rotate(${side < 0 ? -52 + local * 8 : 52 - local * 8}) scale(.55)`} />;
        })}
      </g>
      <g transform="translate(208 10)">
        <MelatiFlower color={color} opacity={opacity} />
      </g>
    </svg>
  );
}

function RoyalFrameCorner({ color, className }: { color: string; className?: string }) {
  const patternId = safeId("jawa-royal-kawung", useId());

  return (
    <svg
      className={cn("pointer-events-none block h-auto", className)}
      viewBox="0 0 190 190"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <pattern id={patternId} width="30" height="30" patternUnits="userSpaceOnUse">
          <path d="M15 3C21 8 21 22 15 27C9 22 9 8 15 3Z" fill="none" stroke={color} strokeWidth=".8" />
          <path d="M3 15C8 9 22 9 27 15C22 21 8 21 3 15Z" fill="none" stroke={color} strokeWidth=".8" />
          <circle cx="15" cy="15" r="1.2" fill={color} />
        </pattern>
      </defs>
      <path d="M0 0H188V34H153C153 59 140 76 116 87C96 96 86 111 82 132C77 159 59 174 30 174V190H0Z" fill={`url(#${patternId})`} opacity=".58" />
      <g fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 188H38C38 159 53 141 80 134C101 128 116 112 121 91C128 63 149 45 188 45" strokeWidth="2" />
        <path d="M17 188H45C45 164 57 149 83 142C108 135 124 118 130 94C136 70 154 55 188 55" strokeWidth=".7" opacity=".68" />
        <path d="M11 11H181M11 11V181" strokeWidth=".75" opacity=".62" />
        <path d="M135 82C153 68 171 72 181 88C162 94 148 92 135 82Z" strokeWidth="1.1" />
        <path d="M82 135C68 153 72 171 88 181C94 162 92 148 82 135Z" strokeWidth="1.1" />
        <path d="M119 96C139 92 153 102 157 121C138 121 125 113 119 96Z" strokeWidth=".95" />
        <path d="M96 119C92 139 102 153 121 157C121 138 113 125 96 119Z" strokeWidth=".95" />
        <path d="M125 87C134 76 146 71 158 72M87 125C76 134 71 146 72 158" strokeWidth=".65" opacity=".75" />
        <circle cx="121" cy="91" r="2.3" fill={color} stroke="none" />
        <circle cx="80" cy="134" r="1.7" fill={color} stroke="none" />
      </g>
      <g fill="#FDF8EA" stroke={color} strokeWidth=".65">
        {[{ x: 118, y: 99, s: 0.78 }, { x: 87, y: 130, s: 0.62 }].map((flower) => (
          <g key={`${flower.x}-${flower.y}`} transform={`translate(${flower.x} ${flower.y}) scale(${flower.s})`}>
            <ellipse cy="-7" rx="3.7" ry="7" />
            <ellipse cy="-7" rx="3.7" ry="7" transform="rotate(72)" />
            <ellipse cy="-7" rx="3.7" ry="7" transform="rotate(144)" />
            <ellipse cy="-7" rx="3.7" ry="7" transform="rotate(216)" />
            <ellipse cy="-7" rx="3.7" ry="7" transform="rotate(288)" />
            <circle r="2" fill="#D4A843" />
          </g>
        ))}
      </g>
    </svg>
  );
}

export function RoyalCoverCrown({ color = "#6D421C", opacity = 1, className }: BaseSvgProps) {
  const gradientId = safeId("jawa-cover-crown", useId());

  return (
    <svg
      viewBox="0 0 640 260"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("pointer-events-none block overflow-visible", className)}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#E1BD66" />
          <stop offset="1" stopColor="#9B641F" />
        </linearGradient>
      </defs>
      <g opacity={opacity}>
        <g fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 198C117 202 178 174 235 122C271 89 299 72 320 66C341 72 369 89 405 122C462 174 523 202 618 198" strokeWidth="2.5" />
          <path d="M42 211C128 211 190 182 244 134M598 211C512 211 450 182 396 134" strokeWidth=".85" opacity=".62" />
          <path d="M320 21C332 48 354 69 358 99C363 134 346 169 320 205C294 169 277 134 282 99C286 69 308 48 320 21Z" fill={`url(#${gradientId})`} fillOpacity=".16" strokeWidth="1.9" />
          <path d="M320 42C328 65 343 81 345 104C348 130 337 154 320 181C303 154 292 130 295 104C297 81 312 65 320 42Z" strokeWidth=".85" />
          <path d="M320 56V175M305 83C318 94 322 109 320 126M335 83C322 94 318 109 320 126" strokeWidth=".75" opacity=".74" />
          <path d="M314 76C299 65 288 73 292 86C296 97 308 97 314 88C304 91 299 85 302 81C305 77 310 79 314 76Z" strokeWidth=".75" />
          <path d="M326 76C341 65 352 73 348 86C344 97 332 97 326 88C336 91 341 85 338 81C335 77 330 79 326 76Z" strokeWidth=".75" />
          <path d="M315 112C296 98 283 108 288 124C293 137 307 137 315 126C303 129 297 122 301 116C305 112 311 114 315 112Z" strokeWidth=".8" />
          <path d="M325 112C344 98 357 108 352 124C347 137 333 137 325 126C337 129 343 122 339 116C335 112 329 114 325 112Z" strokeWidth=".8" />
          <path d="M314 146C301 137 292 144 295 155C299 164 309 164 314 157C306 159 302 154 305 151C307 148 311 149 314 146Z" strokeWidth=".65" />
          <path d="M326 146C339 137 348 144 345 155C341 164 331 164 326 157C334 159 338 154 335 151C333 148 329 149 326 146Z" strokeWidth=".65" />
          <path d="M248 130C224 107 199 111 187 131C211 142 230 142 248 130ZM392 130C416 107 441 111 453 131C429 142 410 142 392 130Z" fill="#77713F" fillOpacity=".82" strokeWidth=".75" />
          <path d="M205 162C180 145 157 151 149 173C174 180 192 176 205 162ZM435 162C460 145 483 151 491 173C466 180 448 176 435 162Z" fill="#77713F" fillOpacity=".72" strokeWidth=".75" />
          <path d="M135 188C119 204 116 224 126 245M505 188C521 204 524 224 514 245" strokeWidth="1.1" />
          <path d="M173 178C162 200 163 224 176 250M467 178C478 200 477 224 464 250" strokeWidth=".85" opacity=".75" />
          <path d="M126 197L135 208L126 219L117 208ZM126 219L135 230L126 241L117 230M514 197L523 208L514 219L505 208ZM514 219L523 230L514 241L505 230" strokeWidth=".75" />
          <path d="M126 241V254M121 248L126 258L131 248M514 241V254M509 248L514 258L519 248" strokeWidth=".7" />
        </g>
        <g fill="#FFF9E9" stroke={color} strokeWidth=".9">
          {[{ x: 219, y: 139, s: 1.1 }, { x: 177, y: 170, s: .82 }, { x: 421, y: 139, s: 1.1 }, { x: 463, y: 170, s: .82 }].map((flower) => (
            <g key={flower.x} transform={`translate(${flower.x} ${flower.y}) scale(${flower.s})`}>
              <ellipse cy="-10" rx="5.2" ry="10" />
              <ellipse cy="-10" rx="5.2" ry="10" transform="rotate(72)" />
              <ellipse cy="-10" rx="5.2" ry="10" transform="rotate(144)" />
              <ellipse cy="-10" rx="5.2" ry="10" transform="rotate(216)" />
              <ellipse cy="-10" rx="5.2" ry="10" transform="rotate(288)" />
              <circle r="3" fill="#C8922A" />
            </g>
          ))}
          {Array.from({ length: 5 }, (_, index) => (
            <g key={index}>
              <path d="M0 0C-5-8-4-16 0-20C4-16 5-8 0 0Z" transform={`translate(${135 + (index % 2) * 3} ${192 + index * 13}) scale(${1 - index * .07})`} />
              <path d="M0 0C-5-8-4-16 0-20C4-16 5-8 0 0Z" transform={`translate(${505 - (index % 2) * 3} ${192 + index * 13}) scale(${1 - index * .07})`} />
            </g>
          ))}
        </g>
        <circle cx="320" cy="111" r="8" fill={`url(#${gradientId})`} stroke={color} strokeWidth=".8" />
      </g>
    </svg>
  );
}

export function GununganCrest({ color = "#8A5518", opacity = 1, className }: BaseSvgProps) {
  const gradientId = safeId("jawa-gunungan-gold", useId());

  return (
    <svg
      viewBox="0 0 220 300"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("pointer-events-none block", className)}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F1D47A" />
          <stop offset=".5" stopColor="#C8922A" />
          <stop offset="1" stopColor="#8A5518" />
        </linearGradient>
      </defs>
      <g opacity={opacity} stroke={color} strokeLinecap="round" strokeLinejoin="round">
        <path d="M110 5C125 43 157 73 166 112C178 165 154 216 110 282C66 216 42 165 54 112C63 73 95 43 110 5Z" fill={`url(#${gradientId})`} fillOpacity=".18" strokeWidth="2.2" />
        <path d="M110 24C119 56 145 82 150 117C158 158 141 201 110 253C79 201 62 158 70 117C75 82 101 56 110 24Z" fill="none" strokeWidth="1.15" />
        <path d="M110 43V247M91 71C109 88 112 109 110 139M129 71C111 88 108 109 110 139" fill="none" strokeWidth="1" opacity=".75" />
        <path d="M106 60C85 47 72 58 78 75C83 88 99 87 107 77C93 79 87 72 92 66C96 62 102 63 106 60Z" fill={`url(#${gradientId})`} fillOpacity=".46" strokeWidth=".8" />
        <path d="M114 60C135 47 148 58 142 75C137 88 121 87 113 77C127 79 133 72 128 66C124 62 118 63 114 60Z" fill={`url(#${gradientId})`} fillOpacity=".46" strokeWidth=".8" />
        <path d="M109 94C88 78 72 91 78 109C83 124 100 123 108 111C94 114 87 106 92 99C96 94 103 96 109 94Z" fill="none" strokeWidth="1.2" />
        <path d="M111 94C132 78 148 91 142 109C137 124 120 123 112 111C126 114 133 106 128 99C124 94 117 96 111 94Z" fill="none" strokeWidth="1.2" />
        <path d="M109 130C85 111 65 126 72 148C78 166 99 164 108 150C91 154 83 144 89 136C94 130 102 133 109 130Z" fill={`url(#${gradientId})`} fillOpacity=".26" strokeWidth="1.15" />
        <path d="M111 130C135 111 155 126 148 148C142 166 121 164 112 150C129 154 137 144 131 136C126 130 118 133 111 130Z" fill={`url(#${gradientId})`} fillOpacity=".26" strokeWidth="1.15" />
        <path d="M109 169C87 151 69 165 75 185C80 201 100 200 108 187C93 190 85 181 91 174C95 168 103 171 109 169Z" fill="none" strokeWidth="1.15" />
        <path d="M111 169C133 151 151 165 145 185C140 201 120 200 112 187C127 190 135 181 129 174C125 168 117 171 111 169Z" fill="none" strokeWidth="1.15" />
        <path d="M109 210C92 195 78 206 83 222C87 235 101 235 108 225C97 227 91 220 95 215C99 211 104 213 109 210Z" fill={`url(#${gradientId})`} fillOpacity=".32" strokeWidth=".9" />
        <path d="M111 210C128 195 142 206 137 222C133 235 119 235 112 225C123 227 129 220 125 215C121 211 116 213 111 210Z" fill={`url(#${gradientId})`} fillOpacity=".32" strokeWidth=".9" />
        <path d="M52 143C31 137 17 148 19 166C21 184 37 190 53 179C39 178 33 169 38 161C41 155 48 155 55 157" fill="none" strokeWidth="1.4" />
        <path d="M168 143C189 137 203 148 201 166C199 184 183 190 167 179C181 178 187 169 182 161C179 155 172 155 165 157" fill="none" strokeWidth="1.4" />
        <path d="M48 181C26 182 18 196 25 211C32 226 49 227 61 213C48 217 39 211 40 202C41 195 48 192 56 191" fill="none" strokeWidth="1.15" />
        <path d="M172 181C194 182 202 196 195 211C188 226 171 227 159 213C172 217 181 211 180 202C179 195 172 192 164 191" fill="none" strokeWidth="1.15" />
        <path d="M74 251C85 263 97 274 110 286C123 274 135 263 146 251" fill="none" strokeWidth="1.4" />
        <circle cx="110" cy="151" r="9" fill={`url(#${gradientId})`} fillOpacity=".55" strokeWidth="1" />
        <circle cx="110" cy="151" r="3" fill="#F5EDD6" strokeWidth=".6" />
      </g>
    </svg>
  );
}

export function JasmineGarland({ color = "#8A5518", opacity = 1, className }: BaseSvgProps) {
  const flowers = [
    { x: 64, y: 72, s: 1.1 },
    { x: 99, y: 53, s: 0.85 },
    { x: 133, y: 69, s: 1.15 },
    { x: 227, y: 69, s: 1.15 },
    { x: 261, y: 53, s: 0.85 },
    { x: 296, y: 72, s: 1.1 },
  ];
  const buds = Array.from({ length: 7 }, (_, index) => ({ y: 96 + index * 13, scale: 1 - index * 0.055 }));

  return (
    <svg
      viewBox="0 0 360 210"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("pointer-events-none block", className)}
      aria-hidden="true"
      focusable="false"
    >
      <g opacity={opacity}>
        <g fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 92C68 100 112 78 151 48C166 37 174 29 180 18C186 29 194 37 209 48C248 78 292 100 348 92" strokeWidth="1.5" />
          <path d="M17 103C74 112 117 92 156 60M343 103C286 112 243 92 204 60" strokeWidth=".75" opacity=".62" />
          <path d="M52 92C45 124 46 156 57 190M308 92C315 124 314 156 303 190" strokeWidth="1" />
          <path d="M82 89C77 116 79 142 88 168M278 89C283 116 281 142 272 168" strokeWidth=".8" opacity=".8" />
        </g>
        <g fill="#FDF8EA" stroke={color} strokeWidth=".7">
          {flowers.map((flower) => (
            <g key={flower.x} transform={`translate(${flower.x} ${flower.y}) scale(${flower.s})`}>
              <ellipse cy="-7" rx="3.7" ry="7" />
              <ellipse cy="-7" rx="3.7" ry="7" transform="rotate(72)" />
              <ellipse cy="-7" rx="3.7" ry="7" transform="rotate(144)" />
              <ellipse cy="-7" rx="3.7" ry="7" transform="rotate(216)" />
              <ellipse cy="-7" rx="3.7" ry="7" transform="rotate(288)" />
              <circle r="2" fill="#D4A843" />
            </g>
          ))}
          {buds.map((bud, index) => (
            <g key={bud.y}>
              <path d="M0 0C-5 -7 -4 -14 0 -18C4 -14 5 -7 0 0Z" transform={`translate(${52 + (index % 2) * 4} ${bud.y}) scale(${bud.scale})`} />
              <path d="M0 0C-5 -7 -4 -14 0 -18C4 -14 5 -7 0 0Z" transform={`translate(${308 - (index % 2) * 4} ${bud.y}) scale(${bud.scale})`} />
            </g>
          ))}
        </g>
        <g fill="#7D713C" stroke={color} strokeWidth=".5">
          <path d="M22 91C35 73 49 72 62 84C47 91 35 94 22 91Z" />
          <path d="M338 91C325 73 311 72 298 84C313 91 325 94 338 91Z" />
          <path d="M112 72C119 51 132 45 148 54C138 66 126 72 112 72Z" />
          <path d="M248 72C241 51 228 45 212 54C222 66 234 72 248 72Z" />
        </g>
        <circle cx="180" cy="18" r="4" fill="#D4A843" stroke={color} strokeWidth=".8" />
      </g>
    </svg>
  );
}

export function EventMedallion({ kind = "akad", color = "#8A5518", opacity = 1, size = 92, className }: EventMedallionProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("pointer-events-none block", className)}
      aria-hidden="true"
      focusable="false"
    >
      <g fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" opacity={opacity}>
        <path d="M50 3L58 8L68 7L73 15L83 18L84 28L92 35L89 45L96 54L89 63L91 73L82 79L79 89L69 90L61 97L50 93L40 97L31 90L21 89L18 79L9 73L11 63L4 54L11 45L8 35L16 28L17 18L27 15L32 7L42 8Z" strokeWidth="1.2" />
        <circle cx="50" cy="50" r="38" strokeWidth=".8" opacity=".65" />
        {kind === "akad" ? (
          <>
            <path d="M50 19C58 36 68 47 66 62C64 75 57 81 50 86C43 81 36 75 34 62C32 47 42 36 50 19Z" strokeWidth="1.4" />
            <path d="M50 28V76M40 44C48 49 52 57 50 67M60 44C52 49 48 57 50 67" strokeWidth=".9" />
          </>
        ) : (
          <>
            <path d="M50 25C64 25 75 36 75 50C75 64 64 75 50 75C36 75 25 64 25 50C25 36 36 25 50 25Z" strokeWidth="1.1" />
            <path d="M50 31C55 39 55 61 50 69C45 61 45 39 50 31ZM31 50C39 45 61 45 69 50C61 55 39 55 31 50Z" strokeWidth=".9" />
            <circle cx="50" cy="50" r="4" fill="#D4A843" strokeWidth=".7" />
          </>
        )}
      </g>
    </svg>
  );
}
