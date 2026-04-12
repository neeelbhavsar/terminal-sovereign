"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const experiences = [
  {
    company: "Artoon Solution Pvt Ltd",
    role: "Node.js Developer",
    period: "April 2021 — Present",
    duration: "4+ years",
    pid: "PID_001",
    status: "RUNNING",
    description: [
      "Developed high-performance backend applications using Node.js and Express.js, optimizing for low latency and efficient request handling.",
      "Designed and implemented secure, scalable REST APIs for web and mobile platforms ensuring smooth integration and reliable data transactions.",
      "Implemented real-time communication features using WebSocket and Socket.IO, enhancing user engagement and live data updates.",
      "Participated in code reviews, debugging, and refactoring to improve code quality and enforce consistent coding standards.",
      "Applied TypeScript best practices to build scalable, readable codebases, reducing runtime errors and improving maintainability.",
    ],
    technologies: ["Node.js", "Express", "TypeScript", "PostgreSQL", "MongoDB", "Redis", "Socket.IO", "AWS"],
  },
];

export default function Experience() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="experience" ref={ref} className="py-24 px-4 md:px-8 relative overflow-hidden bg-[#050505]">
      <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <span className="section-label">03 / WORK_HISTORY</span>
          <h2 className="font-display text-4xl md:text-6xl font-bold text-white mt-3 leading-tight">
            Process <span className="neon-cyan-glow" style={{ color: "var(--cyan)" }}>Monitor</span>
          </h2>
          <p className="font-mono-ts text-sm text-slate-500 mt-3">
            <span style={{ color: "var(--green)" }}>$</span> ps aux | grep &quot;neel-bhavsar&quot;
          </p>
        </motion.div>

        {experiments.map((exp, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.25 }}
          >
            {/* Process header bar */}
            <div className="terminal-window mb-0">
              <div className="terminal-titlebar justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="terminal-dot" style={{ background: "#ff5f57" }} />
                  <span className="terminal-dot" style={{ background: "#ffbd2e" }} />
                  <span className="terminal-dot" style={{ background: "#28c840" }} />
                  <span className="font-mono-ts text-[10px] md:text-[11px] text-slate-400 ml-1 truncate">{exp.pid} | {exp.role} | {exp.company}</span>
                </div>
                <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
                  <span className="badge-online">
                    <span className="w-1.5 h-1.5 rounded-full status-pulse" style={{ background: "var(--green)" }} />
                    {exp.status}
                  </span>
                  <span className="font-mono-ts text-[9px] md:text-[10px] text-slate-500 hidden sm:inline">{exp.period}</span>
                </div>
              </div>

              {/* Log entries */}
              <div className="p-6 space-y-2">
                {exp.description.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.4 + i * 0.08 }}
                    className="flex items-start gap-3 font-mono-ts text-xs"
                  >
                    <span className="flex-shrink-0 mt-0.5" style={{ color: "var(--cyan)" }}>[INFO]</span>
                    <span className="text-slate-400 leading-relaxed">{item}</span>
                  </motion.div>
                ))}
              </div>

              {/* Tech stack footer */}
              <div className="border-t px-6 py-4 flex flex-wrap gap-2" style={{ borderColor: "var(--border)" }}>
                <span className="font-mono-ts text-[10px] text-slate-500 mr-2 self-center">DEPENDENCIES:</span>
                {exp.technologies.map((tech, i) => (
                  <span key={i} className="skill-tag text-[10px] px-2 py-0.5">{tech}</span>
                ))}
              </div>
            </div>

            {/* Summary metrics */}
            <div className="grid grid-cols-3 gap-px mt-px">
              {[
                { k: "DURATION", v: exp.duration },
                { k: "TYPE",     v: "Full-Time" },
                { k: "ENV",      v: "Production" },
              ].map(({ k, v }) => (
                <div key={k} className="ts-panel px-4 py-3 text-center">
                  <div className="font-mono-ts text-[9px] text-slate-500 uppercase tracking-wider">{k}</div>
                  <div className="font-mono-ts text-sm mt-0.5" style={{ color: "var(--green)" }}>{v}</div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// alias so the variable name matches usage inside array map
const experiments = experiences;
