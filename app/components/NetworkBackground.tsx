"use client";

import { useEffect, useRef } from "react";

interface Node {
  x: number; y: number;
  vx: number; vy: number;
  r: number;
  color: string;    // bright neon color
  alpha: number;
  pulse: number;
  pulseSpeed: number;
}

export default function NetworkBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let nodes: Node[] = [];

    // Only use BRIGHT colors — dark ones vanish with mix-blend-mode:screen
    const COLORS = [
      "#00f0ff", // electric cyan
      "#00f0ff",
      "#00f0ff",
      "#00ff41", // matrix green
      "#00ff41",
      "#7df4ff", // light cyan
      "#00dbe9", // dim cyan
    ];

    const init = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;

      const count = Math.min(70, Math.floor((canvas.width * canvas.height) / 14000));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        r:  Math.random() * 2.5 + 1.2,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        alpha: Math.random() * 0.55 + 0.35,   // 0.35–0.9
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.018 + Math.random() * 0.025,
      }));
    };

    const draw = () => {
      // Completely clear to transparent black — so mix-blend-mode: screen hides the background
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      nodes.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;
        n.pulse += n.pulseSpeed;
        if (n.x < 0 || n.x > canvas.width)  n.vx *= -1;
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
      });

      // Draw faint connecting lines
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxD = 160;
          if (dist < maxD) {
            const lineAlpha = (1 - dist / maxD) * 0.5;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(0, 240, 255, ${lineAlpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      // Draw nodes with glow halos
      nodes.forEach((n) => {
        const pulsedAlpha = n.alpha * (0.65 + 0.35 * Math.sin(n.pulse));

        // Outer halo
        const haloR = n.r * 8;
        const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, haloR);
        grad.addColorStop(0,   n.color + "60");
        grad.addColorStop(0.4, n.color + "20");
        grad.addColorStop(1,   n.color + "00");
        ctx.beginPath();
        ctx.arc(n.x, n.y, haloR, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.globalAlpha = pulsedAlpha;
        ctx.fill();

        // Bright core dot
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = n.color;
        ctx.globalAlpha = pulsedAlpha;
        ctx.fill();

        ctx.globalAlpha = 1;
      });

      animId = requestAnimationFrame(draw);
    };

    init();
    draw();

    const handleResize = () => { init(); };
    window.addEventListener("resize", handleResize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{
        zIndex: 50,            // above all content layers
        mixBlendMode: "screen", // black areas vanish, bright neon nodes show through
        opacity: 1,
      }}
    />
  );
}
