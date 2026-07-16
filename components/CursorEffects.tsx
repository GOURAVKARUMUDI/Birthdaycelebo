"use client";

import React, { useEffect, useRef } from "react";

const COLORS = ["#FFB7B2", "#FFDAC1", "#C7CEEA", "#FFC6FF", "#B5EAD7", "#BDB2FF"];
const SHAPES = ["♥", "★", "✦", "✿", "·", "✶"];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  shape: string;
  size: number;
}

export default function CursorEffects() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);
  const activeRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Size canvas to viewport
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    // RAF-based particle loop — single DOM element, no React re-renders
    function loop() {
      const ctx = canvas!.getContext("2d");
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas!.width, canvas!.height);

      let hasAlive = false;
      particlesRef.current = particlesRef.current.filter((p) => {
        p.life -= 1 / p.maxLife;
        if (p.life <= 0) return false;
        hasAlive = true;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.05; // gravity
        ctx.save();
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.font = `${p.size}px sans-serif`;
        ctx.fillText(p.shape, p.x, p.y);
        ctx.restore();
        return true;
      });

      if (hasAlive) {
        rafRef.current = requestAnimationFrame(loop);
      } else {
        activeRef.current = false;
      }
    }

    function spawnParticles(x: number, y: number) {
      for (let i = 0; i < 8; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1.5 + Math.random() * 2.5;
        particlesRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1.5,
          life: 1,
          maxLife: 40 + Math.floor(Math.random() * 20),
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
          size: 12 + Math.random() * 8,
        });
      }
      if (particlesRef.current.length > 80) {
        particlesRef.current = particlesRef.current.slice(-80);
      }
      if (!activeRef.current) {
        activeRef.current = true;
        loop();
      }
    }

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      )
        return;
      spawnParticles(e.clientX, e.clientY);
    };

    window.addEventListener("click", handleClick, { passive: true });

    return () => {
      window.removeEventListener("click", handleClick);
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9999]"
      style={{ contain: "strict" }}
    />
  );
}
