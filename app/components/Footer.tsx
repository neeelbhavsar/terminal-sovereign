"use client";

import { motion } from "framer-motion";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#050505] border-t relative overflow-hidden" style={{ borderColor: "rgba(0,240,255,0.08)" }}>
      <div className="absolute inset-0 cyber-grid opacity-15 pointer-events-none" />

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">

          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="font-display text-2xl font-bold tracking-tight" style={{ color: "var(--cyan)" }}>
              NEEL_BHAVSAR
            </div>
            <p className="font-mono-ts text-[11px] text-slate-400 mt-1">Node.js Developer // Backend Architect</p>
          </motion.div>

          {/* Nav */}
          <motion.nav
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap gap-x-6 gap-y-2"
          >
            {["about", "skills", "experience", "projects", "contact"].map((s) => (
              <a
                key={s}
                href={`#${s}`}
                className="font-mono-ts text-[11px] uppercase tracking-widest text-slate-400 hover:text-[#00f0ff] transition-colors duration-200"
              >
                /{s}
              </a>
            ))}
          </motion.nav>

          {/* Links */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-4"
          >
            <a href="mailto:neelbhavsar124@gmail.com" className="font-mono-ts text-[11px] text-slate-400 hover:text-[#00ff41] transition-colors duration-200">EMAIL</a>
            <a href="https://linkedin.com/in/neeelbhavsar" target="_blank" rel="noopener noreferrer" className="font-mono-ts text-[11px] text-slate-400 hover:text-[#00ff41] transition-colors duration-200">LINKEDIN</a>
            <a href="https://github.com/neeelbhavsar" target="_blank" rel="noopener noreferrer" className="font-mono-ts text-[11px] text-slate-400 hover:text-[#00ff41] transition-colors duration-200">GITHUB</a>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="mt-8 mb-6 h-px" style={{ background: "linear-gradient(to right, transparent, rgba(0,240,255,0.15), transparent)" }} />

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-mono-ts text-[10px] text-slate-400">
            © {year} Neel Bhavsar — All rights reserved
          </p>
          <p className="font-mono-ts text-[10px] text-slate-400">
            Built with{" "}
            <span style={{ color: "var(--cyan)" }}>Next.js</span> +{" "}
            <span style={{ color: "var(--green)" }}>Framer Motion</span>
          </p>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full status-pulse" style={{ background: "var(--green)" }} />
            <span className="font-mono-ts text-[10px]" style={{ color: "var(--green)" }}>SYSTEM_ONLINE</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
