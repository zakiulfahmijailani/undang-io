"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

type PetalKind = "blue" | "ivory" | "gold";

type Petal = {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  kind: PetalKind;
};

type BurstParticle = Petal & {
  vx: number;
  vy: number;
  life: number;
};

export type PetalsCanvasHandle = {
  triggerPetalBurst: (originX: number, originY: number) => void;
};

const COLORS: Record<PetalKind, { fill: string; stroke: string }> = {
  blue: { fill: "#DCECF5", stroke: "#9FB9CF" },
  ivory: { fill: "#FFFDF8", stroke: "#E3D0A3" },
  gold: { fill: "#D9C28C", stroke: "#A9864E" },
};

const TOTAL_PETALS = 14;
const BURST_COUNT = 18;

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function randomKind(): PetalKind {
  const r = Math.random();
  if (r < 0.5) return "blue";
  if (r < 0.86) return "ivory";
  return "gold";
}

function createPetal(width: number, height: number, above = false): Petal {
  return {
    x: rand(0, width),
    y: above ? rand(-height * 0.45, -20) : rand(-20, height),
    size: rand(5, 12),
    speedY: rand(0.18, 0.62),
    speedX: rand(-0.12, 0.16),
    rotation: rand(0, Math.PI * 2),
    rotationSpeed: rand(-0.008, 0.008),
    opacity: rand(0.14, 0.32),
    kind: randomKind(),
  };
}

function createBurst(originX: number, originY: number): BurstParticle {
  const angle = rand(0, Math.PI * 2);
  const velocity = rand(1.8, 6);
  return {
    ...createPetal(1, 1),
    x: originX,
    y: originY,
    vx: Math.cos(angle) * velocity,
    vy: Math.sin(angle) * velocity,
    speedX: 0,
    speedY: 0,
    opacity: rand(0.28, 0.46),
    life: rand(0.82, 1),
  };
}

function drawPetal(ctx: CanvasRenderingContext2D, petal: Petal) {
  const { fill, stroke } = COLORS[petal.kind];
  ctx.save();
  ctx.translate(petal.x, petal.y);
  ctx.rotate(petal.rotation);
  ctx.globalAlpha = petal.opacity;
  ctx.beginPath();
  ctx.moveTo(0, -petal.size);
  ctx.bezierCurveTo(petal.size * 0.72, -petal.size * 0.42, petal.size * 0.62, petal.size * 0.62, 0, petal.size);
  ctx.bezierCurveTo(-petal.size * 0.62, petal.size * 0.62, -petal.size * 0.72, -petal.size * 0.42, 0, -petal.size);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 0.6;
  ctx.stroke();
  ctx.restore();
}

export const PetalsCanvas = forwardRef<PetalsCanvasHandle>(function PetalsCanvas(_, ref) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const burstRef = useRef<BurstParticle[]>([]);

  useImperativeHandle(ref, () => ({
    triggerPetalBurst(originX: number, originY: number) {
      burstRef.current = Array.from({ length: BURST_COUNT }, () => createBurst(originX, originY));
    },
  }));

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return undefined;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return undefined;

    const setSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setSize();

    const petals = Array.from({ length: TOTAL_PETALS }, () => createPetal(canvas.width, canvas.height));
    let frame = 0;
    let animId = 0;

    const animate = () => {
      frame += 1;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      petals.forEach((petal) => {
        petal.x += petal.speedX + Math.sin(frame * 0.006 + petal.size) * 0.08;
        petal.y += petal.speedY;
        petal.rotation += petal.rotationSpeed;
        if (petal.y > canvas.height + 24 || petal.x < -30 || petal.x > canvas.width + 30) {
          Object.assign(petal, createPetal(canvas.width, canvas.height, true));
        }
        drawPetal(ctx, petal);
      });

      for (let i = burstRef.current.length - 1; i >= 0; i -= 1) {
        const particle = burstRef.current[i];
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vx *= 0.965;
        particle.vy = particle.vy * 0.965 + 0.035;
        particle.rotation += particle.rotationSpeed * 2;
        particle.life -= 0.024;
        particle.opacity = Math.max(0, particle.opacity * 0.965);
        if (particle.life <= 0 || particle.opacity <= 0.04) {
          burstRef.current.splice(i, 1);
          continue;
        }
        drawPetal(ctx, particle);
      }

      animId = requestAnimationFrame(animate);
    };
    animate();

    window.addEventListener("resize", setSize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", setSize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fateha-petals-canvas" aria-hidden="true" />;
});
