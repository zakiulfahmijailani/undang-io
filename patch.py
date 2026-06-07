import os
import re

file_path = r'c:\project_undang-io\src\components\themes\jawa-agung\JawaAgungSVG.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# BatikBorder
batik_border_new = """export function BatikBorder({ color = "#D4A843", opacity = 1, className }: BaseSvgProps) {
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
}"""
content = re.sub(r'export function BatikBorder.*?^}', batik_border_new, content, flags=re.MULTILINE|re.DOTALL)

# KawungBackground
kawung_new = """export function KawungBackground({ color = "#D4A843", opacity = 0.04, className }: BaseSvgProps) {
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
}"""
content = re.sub(r'export function KawungBackground.*?^}', kawung_new, content, flags=re.MULTILINE|re.DOTALL)

# SparkleField
sparkle_new = """export function SparkleField({ count = 18, color = "#D4A843", opacity = 1, className }: SparkleFieldProps) {
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
}"""
content = re.sub(r'export function SparkleField.*?^}', sparkle_new, content, flags=re.MULTILINE|re.DOTALL)

# CornerOrnamentElaborate
corner_new = """export function CornerOrnamentElaborate({ position = "tl", color = "#B6812C", opacity = 1, size = 180, className }: CornerOrnamentProps) {
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
}"""
content = re.sub(r'export function CornerOrnamentElaborate.*?^}', corner_new, content, flags=re.MULTILINE|re.DOTALL)

# BorderFrame
border_new = """export function BorderFrame({ color = "#B6812C", opacity = 1, inset = 10, className }: BorderFrameProps) {
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
}"""
content = re.sub(r'export function BorderFrame.*?^}', border_new, content, flags=re.MULTILINE|re.DOTALL)

# GununganCrown
gunungan_new = """export function GununganCrown({ color = "#8A5518", opacity = 1, className }: BaseSvgProps) {
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
}"""
content = re.sub(r'export function GununganCrown.*?^}', gunungan_new, content, flags=re.MULTILINE|re.DOTALL)

# BottomArch
arch_new = """export function BottomArch({ color = "#B6812C", opacity = 1, width = 360, className }: CoverDateArchProps) {
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
}"""
content = re.sub(r'export function BottomArch.*?^}', arch_new, content, flags=re.MULTILINE|re.DOTALL)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
