"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const neofetchLines = [
  { label: "OS",         value: "Node.js Runtime v20.x" },
  { label: "Host",       value: "Artoon Solution Pvt Ltd" },
  { label: "Kernel",     value: "REST API v4.0" },
  { label: "Uptime",     value: "4+ Years" },
  { label: "Packages",   value: "20+ Libraries" },
  { label: "Shell",      value: "Express.js + NestJS" },
  { label: "Terminal",   value: "Neel Bhavsar" },
  { label: "CPU",        value: "Problem-Solver @ 100%" },
  { label: "Memory",     value: "8 Total Projects (6 Client + 2 Personal)" },
  { label: "GPU",        value: "Real-time WebSocket" },
];

const stats = [
  { value: "4+",   label: "Years_Experience" },
  { value: "8",    label: "Projects_Delivered" },
  { value: "20+",  label: "Technologies" },
  { value: "99%",  label: "Backend_Focus" },
];

const asciiNB = [
  "███╗   ██╗██████╗",
  "████╗  ██║██╔══██╗",
  "██╔██╗ ██║██████╔╝",
  "██║╚██╗██║██╔══██╗",
  "██║ ╚████║██████╔╝",
  "╚═╝  ╚═══╝╚═════╝",
];

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="about"
      ref={ref}
      aria-label="About me section"
      className="relative z-10 py-24 px-4 md:px-8 overflow-hidden bg-[#050505]"
    >
      {/* Background grid */}
      <div className="absolute inset-0 cyber-grid opacity-30 pointer-events-none" aria-hidden="true" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <span className="section-label">01 / SYSTEM_PROFILE</span>
          <h2 className="font-display text-4xl md:text-6xl font-bold text-white mt-3 leading-tight">
            Who is <span className="neon-cyan-glow" style={{ color: "var(--cyan)" }}>Neel_Bhavsar</span><span className="cursor-blink" style={{ color: "var(--cyan)" }}>?</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LEFT: Neofetch terminal */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="terminal-window"
          >
            {/* Title bar */}
            <div className="terminal-titlebar">
              <span className="terminal-dot" style={{ background: "#ff5f57" }} />
              <span className="terminal-dot" style={{ background: "#ffbd2e" }} />
              <span className="terminal-dot" style={{ background: "#28c840" }} />
              <span className="font-mono-ts text-[11px] text-slate-500 ml-2">neel@portfolio ~ $ neofetch</span>
            </div>

            <div className="p-6 flex gap-6 flex-col sm:flex-row">
              {/* ASCII art */}
              <div className="flex-shrink-0">
                {asciiNB.map((line, i) => (
                  <div key={i} className="font-mono-ts text-[9px] leading-tight neon-cyan-glow" style={{ color: "var(--cyan)" }}>
                    {line}
                  </div>
                ))}
                {/* Color blocks */}
                <div className="flex mt-3 gap-1">
                  {["#050505","#00f0ff","#00ff41","#1e3a4a","#0d1117","#334155","#64748b","#e2e8f0"].map((c, i) => (
                    <div key={i} className="w-4 h-4" style={{ background: c }} />
                  ))}
                </div>
              </div>

              {/* Neofetch data */}
              <div className="flex-1 space-y-1">
                <p className="font-mono-ts text-xs font-bold mb-2" style={{ color: "var(--cyan)" }}>neel@bhavsar</p>
                <p className="font-mono-ts text-xs text-slate-500 mb-2">───────────────────────</p>
                {neofetchLines.map(({ label, value }, i) => (
                  <div key={i} className="flex gap-2 font-mono-ts text-xs">
                    <span className="font-bold w-16 flex-shrink-0" style={{ color: "var(--cyan)" }}>{label}</span>
                    <span className="text-slate-400">: {value}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* RIGHT: About text + stats */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="flex flex-col gap-6"
          >
            {/* About text panel */}
            <div className="ts-panel p-6 flex-1">
              <p className="font-mono-ts text-[11px] mb-3 tracking-widest uppercase" style={{ color: "var(--green)" }}>
                // about.txt
              </p>
              <div className="space-y-4 text-slate-300 text-sm leading-relaxed font-sans">
                <p>
                  With over <span className="font-semibold text-white">4 years of experience</span>, I specialize in designing robust RESTful APIs, implementing secure auth flows, and optimizing databases for performance and reliability.
                </p>
                <p>
                  I&apos;ve worked extensively with both relational and NoSQL databases—
                  <span style={{ color: "var(--cyan)" }}> MySQL, PostgreSQL, MongoDB, and Neo4j</span>—focusing on efficient data modeling across polyglot architectures.
                </p>
                <p>
                  My work is about turning business requirements into{" "}
                  <span className="font-semibold text-white">production-ready solutions</span>. Clean architecture, no compromise.
                </p>
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-3">
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
                  className="ts-panel corner-bracket p-5 text-center hover:glow-cyan transition-all duration-300 group"
                >
                  <div
                    className="font-display text-3xl md:text-4xl font-bold mb-1 group-hover:neon-cyan-glow transition-all"
                    style={{ color: "var(--cyan)" }}
                  >
                    {stat.value}
                  </div>
                  <div className="font-mono-ts text-[10px] text-slate-500 uppercase tracking-widest">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
