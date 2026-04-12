"use client";

import { useScroll, useTransform, motion } from "framer-motion";
import { useEffect, useState } from "react";

const logLines = [
  '{"event":"request","method":"GET","path":"/api/profile","status":200,"ms":12}',
  '{"event":"db_query","table":"projects","rows":6,"latency":"3ms"}',
  '{"event":"cache_hit","key":"skills:all","ttl":3600}',
  '{"event":"auth_verify","token":"Bearer ***","valid":true}',
  '{"event":"request","method":"POST","path":"/api/contact","status":201,"ms":18}',
  '{"event":"websocket","action":"connect","clients":1,"room":"portfolio"}',
  '{"event":"job","queue":"mailer","status":"completed","ms":142}',
  '{"event":"db_query","table":"experience","rows":1,"latency":"2ms"}',
  '{"event":"cdn","asset":"sequence/frame_060.png","cached":true}',
  '{"event":"request","method":"GET","path":"/api/skills","status":200,"ms":8}',
];

function LogFeed() {
  const doubled = [...logLines, ...logLines];
  return (
    <div className="absolute bottom-8 right-6 w-[360px] overflow-hidden h-44 pointer-events-none z-20 hidden md:block">
      <div className="data-stream-up space-y-1 will-change-transform" style={{ display: "flex", flexDirection: "column" }}>
        {doubled.map((line, i) => (
          <span key={i} className="font-mono-ts text-[10px] opacity-50 whitespace-nowrap"
            style={{ color: i % 3 === 0 ? "#00ff41" : "#00f0ff" }}>
            {line}
          </span>
        ))}
      </div>
      <div className="absolute inset-x-0 top-0 h-8 pointer-events-none" style={{ background: "linear-gradient(to bottom, rgba(5,5,5,0.9), transparent)" }} />
      <div className="absolute inset-x-0 bottom-0 h-12 pointer-events-none" style={{ background: "linear-gradient(to top, rgba(5,5,5,1), transparent)" }} />
    </div>
  );
}

interface OverlayProps {
  scrollContainerRef: React.RefObject<HTMLDivElement>;
}

export default function Overlay({ scrollContainerRef }: OverlayProps) {
  // Use the SAME scroll container as ScrollyCanvas so scroll progress is identical
  const { scrollYProgress } = useScroll({
    target: scrollContainerRef,
    offset: ["start start", "end end"],
  });

  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);
  void tick; // suppress unused warning
  const uptime = `${Math.floor((Date.now() - new Date("2021-04-01").getTime()) / (1000 * 60 * 60 * 24))}d`;

  const y1      = useTransform(scrollYProgress, [0, 0.3],            [0, -60]);
  const opacity1 = useTransform(scrollYProgress, [0, 0.15, 0.28],    [1, 1, 0]);

  const y2       = useTransform(scrollYProgress, [0.28, 0.55],       [80, -60]);
  const opacity2 = useTransform(scrollYProgress, [0.28, 0.38, 0.52, 0.6], [0, 1, 1, 0]);

  const y3       = useTransform(scrollYProgress, [0.58, 0.85],       [80, -60]);
  const opacity3 = useTransform(scrollYProgress, [0.58, 0.68, 0.82, 0.92], [0, 1, 1, 0]);

  return (
    /* 
      This div must match the h-[360vh] parent exactly.
      Using absolute inset-0 w-full h-full keeps it bounded.
    */
    <div className="absolute inset-0 w-full h-full pointer-events-none z-10">
      <div className="sticky top-0 h-screen w-full flex flex-col justify-center items-center overflow-hidden">

        {/* ── PHASE 1: Hero ── */}
        <motion.div
          style={{ y: y1, opacity: opacity1 }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center p-4"
        >
          <div className="absolute inset-0 pointer-events-none" style={{
            background: "radial-gradient(ellipse 80% 70% at 50% 50%, rgba(5,5,5,0.45) 0%, rgba(5,5,5,0.72) 60%, rgba(5,5,5,0.97) 100%)"
          }} />

          {/* Status bar — top left, hidden on mobile */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="absolute top-6 left-6 hidden md:flex items-center gap-3 pointer-events-none"
          >
            <div className="flex items-center gap-2 ts-panel px-3 py-1.5">
              <div className="w-2 h-2 rounded-full status-pulse" style={{ background: "var(--green)" }} />
              <span className="font-mono-ts text-[11px]" style={{ color: "var(--green)" }}>SYSTEM_ONLINE</span>
            </div>
            <span className="font-mono-ts text-[10px] text-slate-500">PORT:8080</span>
            <span className="font-mono-ts text-[10px] text-slate-500">UPTIME:{uptime}</span>
          </motion.div>

          {/* Nav — top right on desktop, centered top on mobile */}
          <motion.nav
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="absolute top-6 left-0 right-0 md:left-auto md:right-6 flex items-center justify-center md:justify-end gap-4 md:gap-6 pointer-events-auto px-4 md:px-0"
          >
            {["about", "skills", "experience", "projects", "contact"].map((s) => (
              <a key={s} href={`#${s}`}
                className="font-mono-ts text-[10px] md:text-[11px] uppercase tracking-widest text-slate-500 hover:text-[#00f0ff] transition-colors duration-200">
                {s}
              </a>
            ))}
          </motion.nav>

          {/* Corner brackets + Name */}
          <div className="relative z-20 flex flex-col items-center">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
              className="absolute -top-8 -left-8 font-mono-ts text-3xl leading-none neon-cyan-glow"
              style={{ color: "var(--cyan)" }}>┌</motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
              className="absolute -bottom-8 -right-8 font-mono-ts text-3xl leading-none neon-cyan-glow"
              style={{ color: "var(--cyan)" }}>┘</motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.4 }}
              className="font-display text-[80px] md:text-[130px] font-bold leading-none tracking-tighter mb-2"
            >
              <span className="block text-white" style={{ textShadow: "0 2px 40px rgba(0,0,0,0.9)" }}>NEEL</span>
              <span className="block" style={{ color: "var(--cyan)", textShadow: "0 0 30px rgba(0,240,255,0.6), 0 0 80px rgba(0,240,255,0.2)" }}>
                BHAVSAR
              </span>
            </motion.h1>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9, duration: 0.6 }} className="mt-4 text-left">
              <p className="font-mono-ts text-sm md:text-base" style={{ color: "var(--green)" }}>
                <span className="opacity-50">›</span> Node.js Developer
              </p>
              <p className="font-mono-ts text-sm md:text-base text-slate-400">
                <span className="opacity-50">›</span> Building scalable systems since 2021
                <span className="cursor-blink ml-1" style={{ color: "var(--cyan)" }}>▌</span>
              </p>
            </motion.div>
          </div>

          <LogFeed />

          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 pointer-events-none"
          >
            <span className="font-mono-ts text-[10px] tracking-widest uppercase text-slate-500">SCROLL_TO_INITIALIZE</span>
            <motion.span animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
              className="font-mono-ts text-lg" style={{ color: "var(--cyan)" }}>↓</motion.span>
          </motion.div>
        </motion.div>

        {/* ── PHASE 2 ── */}
        <motion.div
          style={{ y: y2, opacity: opacity2 }}
          className="absolute inset-0 flex items-center justify-start p-8 md:p-24"
        >
          <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(5,5,5,0.92) 0%, rgba(5,5,5,0.7) 50%, transparent 100%)" }} />
          <div className="max-w-2xl text-left relative z-10">
            <span className="section-label block mb-4">// WHAT_I_DO</span>
            <h2 className="font-display text-5xl md:text-8xl font-bold mb-5 text-white leading-tight">
              I build<br />
              <span style={{ color: "var(--cyan)", textShadow: "0 0 20px rgba(0,240,255,0.4)" }}>robust</span><br />
              systems.
            </h2>
            <p className="font-mono-ts text-sm text-slate-400 max-w-md">
              <span style={{ color: "var(--green)" }}>›</span> Designing secure, high-performance APIs<br />
              <span style={{ color: "var(--green)" }}>›</span> Real-time systems with WebSocket & Socket.IO<br />
              <span style={{ color: "var(--green)" }}>›</span> Multi-DB architectures at production scale
            </p>
          </div>
        </motion.div>

        {/* ── PHASE 3 ── */}
        <motion.div
          style={{ y: y3, opacity: opacity3 }}
          className="absolute inset-0 flex items-center justify-end p-8 md:p-24"
        >
          <div className="absolute inset-0" style={{ background: "linear-gradient(to left, rgba(5,5,5,0.92) 0%, rgba(5,5,5,0.7) 50%, transparent 100%)" }} />
          <div className="max-w-2xl text-right relative z-10">
            <span className="section-label block mb-4 text-right">// PHILOSOPHY</span>
            <h2 className="font-display text-5xl md:text-8xl font-bold mb-5 text-white leading-tight">
              Architecture<br />driven by<br />
              <span style={{ color: "var(--cyan)", textShadow: "0 0 20px rgba(0,240,255,0.4)" }}>performance.</span>
            </h2>
            <p className="font-mono-ts text-sm text-slate-400 max-w-md ml-auto">
              <span style={{ color: "var(--green)" }}>›</span> Maintainable codebases that scale<br />
              <span style={{ color: "var(--green)" }}>›</span> Security-first backend design<br />
              <span style={{ color: "var(--green)" }}>›</span> Clean architecture, zero compromise
            </p>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
