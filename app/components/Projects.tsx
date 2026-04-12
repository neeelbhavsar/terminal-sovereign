"use client";

import { motion, useScroll, useTransform, MotionValue, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";

/* eslint-disable @next/next/no-img-element */

type Project = {
  title: string;
  version: string;
  tagline: string;
  description: string;
  image: string;
  logLines: string[];
  tags: string[];
  accentColor: string;
  status: "RUNNING" | "STANDBY" | "DEPLOYED";
  pid: string;
  period: string;
  bullets: string[];
};

const projects: Project[] = [
  {
    title: "Braganza",
    version: "v2.1.0",
    pid: "PID_4821",
    status: "RUNNING",
    tagline: "Car Rental Platform with Crypto Payments",
    description: "A full-stack car rental platform enabling users to discover, book, and rent vehicles through a secure, scalable system.",
    image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=900&auto=format&fit=crop",
    logLines: [
      "[09:23:01] ✓ Car rental platform initializing...",
      "[09:23:02] ✓ Booqable inventory sync: ACTIVE",
      "[09:23:03] ✓ Crypto payment wallet: ONLINE",
      "[09:23:04] ✓ WebSocket server: LISTENING :3001",
      "[09:23:05] ✓ AWS SES mailer: CONNECTED",
      "[09:23:06] ✓ Redis cache: READY — 0ms latency",
    ],
    bullets: ["Integrated Booqable for vehicle inventory", "Designed custom crypto payment flow", "Real-time booking via WebSockets", "AWS SES transactional emails"],
    tags: ["Node.js", "Express", "Prisma", "PostgreSQL", "Redis", "AWS", "WebSockets"],
    accentColor: "#00f0ff",
    period: "Jan 2026 – Present",
  },
  {
    title: "Streamerdap",
    version: "v1.8.0",
    pid: "PID_3917",
    status: "RUNNING",
    tagline: "Live Streaming Platform with OBS Integration",
    description: "A web-based live streaming platform empowering creators to stream directly from OBS Browser.",
    image: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?q=80&w=900&auto=format&fit=crop",
    logLines: [
      "[14:11:07] ✓ OBS browser source: CONNECTED",
      "[14:11:08] ✓ Multi-role auth: streamers | managers",
      "[14:11:09] ✓ PayPal payout engine: ACTIVE",
      "[14:11:10] ✓ MySQL query optimizer: RUNNING",
      "[14:11:11] ✓ Subscription billing: INITIALIZED",
      "[14:11:12] ✓ Wallet service: READY",
    ],
    bullets: ["Multi-role system: streamers, managers, brand managers", "PayPal payout based on view counts & duration", "Subscription and billing flows with invoice generation", "Wallet system for campaign creation"],
    tags: ["Node.js", "MySQL", "PayPal API", "Socket.IO", "Sequelize", "OBS"],
    accentColor: "#00ff41",
    period: "Jul 2025 – Dec 2025",
  },
  {
    title: "Jolt",
    version: "v1.5.0",
    pid: "PID_3310",
    status: "DEPLOYED",
    tagline: "Dual-purpose CMS & Film Streaming Interface",
    description: "A dual-purpose platform serving as both a CMS and a public film streaming interface.",
    image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=900&auto=format&fit=crop",
    logLines: [
      "[10:42:01] ✓ CMS admin module: LOADED",
      "[10:42:02] ✓ Film upload pipeline: ACTIVE",
      "[10:42:03] ✓ CDN content delivery: OPTIMIZED",
      "[10:42:04] ✓ Role-based access: ENFORCED",
      "[10:42:05] ✓ Media metadata API: READY",
    ],
    bullets: ["Scalable backend for film uploads and metadata", "Content publishing workflows with role-based access", "Optimized performance across devices", "Efficient CDN-backed media handling"],
    tags: ["Node.js", "CMS", "Video Streaming", "PostgreSQL", "Scalable Architecture"],
    accentColor: "#00f0ff",
    period: "Mar 2025 – Jul 2025",
  },
  {
    title: "SpingR",
    version: "v1.2.0",
    pid: "PID_2788",
    status: "STANDBY",
    tagline: "Digital Business Card Platform with Graph Search",
    description: "A platform to design, share, and manage digital business cards with graph-based networking.",
    image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?q=80&w=900&auto=format&fit=crop",
    logLines: [
      "[08:00:01] ✓ Neo4j graph DB: CONNECTED",
      "[08:00:02] ✓ Business card API: READY",
      "[08:00:03] ✓ Real-time chat: WEBSOCKET OPEN",
      "[08:00:04] ✓ JWT auth system: ACTIVE",
      "[08:00:05] ✓ Contact book service: INDEXED",
    ],
    bullets: ["Graph-based search with Neo4j for targeted networking", "Real-time chat system using WebSockets", "Secure user management with registration and auth", "Digital contact book for connection management"],
    tags: ["Node.js", "Neo4j", "WebSockets", "MongoDB", "JWT"],
    accentColor: "#00ff41",
    period: "Sep 2024 – Feb 2025",
  },
  {
    title: "iMentor",
    version: "v2.0.0",
    pid: "PID_2201",
    status: "DEPLOYED",
    tagline: "Educational CMS with Automated Matching",
    description: "A CMS-driven educational platform with multi-role admin support and automated mentor–mentee matching.",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=900&auto=format&fit=crop",
    logLines: [
      "[07:30:01] ✓ CMS admin panel: LOADED",
      "[07:30:02] ✓ Matching algorithm: COMPUTED",
      "[07:30:03] ✓ Course tracking API: ACTIVE",
      "[07:30:04] ✓ Socket.IO channels: OPEN",
      "[07:30:05] ✓ Questionnaire engine: READY",
    ],
    bullets: ["Automated mentor-mentee matching via questionnaires", "Course management and progress tracking", "Real-time communication via Socket.IO", "Multi-role admin support for institutions"],
    tags: ["Node.js", "Socket.IO", "MongoDB", "Algorithm", "CMS"],
    accentColor: "#00f0ff",
    period: "Aug 2023 – Jun 2024",
  },
  {
    title: "Diamond Connect",
    version: "v3.0.0",
    pid: "PID_1099",
    status: "DEPLOYED",
    tagline: "Baseball Event Management & Scheduling Engine",
    description: "A cross-platform application for managing baseball tournaments with automated scheduling.",
    image: "https://images.unsplash.com/photo-1566577739112-5180d4bf9390?q=80&w=900&auto=format&fit=crop",
    logLines: [
      "[06:00:01] ✓ Scheduling engine: OPTIMIZED",
      "[06:00:02] ✓ Score feed API: CONNECTED",
      "[06:00:03] ✓ Socket.IO live scores: STREAMING",
      "[06:00:04] ✓ Stripe payments: INITIALIZED",
      "[06:00:05] ✓ Cross-platform APIs: WEB | iOS | Android",
    ],
    bullets: ["Automated game scheduling engine for optimized fixtures", "Real-time score updates via Socket.IO", "Cross-platform: Web, iOS, Android", "Stripe integration for payment processing"],
    tags: ["Node.js", "Socket.IO", "Stripe", "MySQL", "Cross-platform"],
    accentColor: "#00ff41",
    period: "Jun 2021 – Jul 2023",
  },
];

// ── Modal ──────────────────────────────────────────────────────────────────
const ProjectModal = ({ project, onClose }: { project: Project; onClose: () => void }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    onClick={onClose}
    className="fixed inset-0 z-50 flex items-center justify-center p-4"
    style={{ background: "rgba(0,0,0,0.88)", backdropFilter: "blur(6px)" }}
  >
    <motion.div
      initial={{ y: 60, opacity: 0, scale: 0.96 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ y: 60, opacity: 0, scale: 0.96 }}
      transition={{ type: "spring", damping: 28, stiffness: 320 }}
      onClick={(e) => e.stopPropagation()}
      className="terminal-window w-full max-w-2xl max-h-[90vh] flex flex-col relative"
    >
      {/* Title bar */}
      <div className="terminal-titlebar justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="terminal-dot cursor-pointer hover:opacity-70 transition-opacity" style={{ background: "#ff5f57" }} />
          <span className="terminal-dot" style={{ background: "#ffbd2e" }} />
          <span className="terminal-dot" style={{ background: "#28c840" }} />
          <span className="font-mono-ts text-[11px] text-slate-400 ml-1">{project.pid} | {project.title} {project.version}</span>
        </div>
        <span className={`badge-${project.status === "RUNNING" ? "online" : "cyan"} text-[9px]`}>{project.status}</span>
      </div>

      <div className="overflow-y-auto flex-1">
        {/* Image */}
        <div className="relative w-full overflow-hidden" style={{ height: 160 }}>
          <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{
            background: "linear-gradient(to bottom, transparent 40%, rgba(13,17,23,1) 100%)"
          }} />
          <div className="absolute bottom-3 left-5">
            <h2 className="font-display text-xl font-bold text-white">{project.title} {project.version}</h2>
            <p className="font-mono-ts text-[11px]" style={{ color: "var(--cyan)" }}>{project.tagline}</p>
          </div>
        </div>

        <div className="p-6 space-y-5">
        <div>
          <p className="font-mono-ts text-[10px] text-slate-500">{project.period}</p>
          <p className="text-slate-300 text-sm leading-relaxed mt-2">{project.description}</p>
        </div>

        {/* Logs */}
        <div>
          <p className="font-mono-ts text-[10px] tracking-widest uppercase text-slate-500 mb-2">// process_log</p>
          <div className="space-y-1">
            {project.logLines.map((line, i) => (
              <p key={i} className="font-mono-ts text-[11px]" style={{ color: "var(--green)" }}>{line}</p>
            ))}
          </div>
        </div>

        {/* Bullets */}
        <div>
          <p className="font-mono-ts text-[10px] tracking-widest uppercase text-slate-500 mb-2">// key_highlights</p>
          <ul className="space-y-1.5">
            {project.bullets.map((b, i) => (
              <li key={i} className="flex gap-2 text-sm text-slate-400">
                <span style={{ color: "var(--cyan)" }} className="flex-shrink-0">›</span> {b}
              </li>
            ))}
          </ul>
        </div>

        {/* Tags */}
        <div>
          <p className="font-mono-ts text-[10px] tracking-widest uppercase text-slate-500 mb-2">// stack</p>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag, i) => (
              <span key={i} className="skill-tag">{tag}</span>
            ))}
          </div>
        </div>
        </div>
      </div>
    </motion.div>
  </motion.div>
);

// ── Card ───────────────────────────────────────────────────────────────────
const ProjectCard = ({
  project, index, progress, range, targetScale, onOpen,
}: {
  project: Project; index: number; progress: MotionValue<number>; range: number[]; targetScale: number; onOpen: (p: Project) => void;
}) => {
  const scale = useTransform(progress, range, [1, targetScale]);
  const statusColor = project.status === "RUNNING" ? "var(--green)" : project.status === "DEPLOYED" ? "var(--cyan)" : "#94a3b8";

  return (
    <div className="min-h-screen md:h-screen flex items-center justify-center sticky top-0 pointer-events-none py-4 md:py-0">
      <motion.div
        style={{ scale, top: `calc(-5vh + ${index * 26}px)` }}
        className="relative w-full max-w-5xl pointer-events-auto origin-top terminal-window mx-2 md:mx-4"
      >
        {/* Title bar */}
        <div className="terminal-titlebar justify-between flex-wrap gap-y-1">
          <div className="flex items-center gap-3">
            <span className="terminal-dot" style={{ background: "#ff5f57" }} />
            <span className="terminal-dot" style={{ background: "#ffbd2e" }} />
            <span className="terminal-dot" style={{ background: "#28c840" }} />
            <span className="font-mono-ts text-[10px] md:text-[11px] text-slate-400 ml-1 truncate">
              {project.pid} | {project.title.toLowerCase()} {project.version}
            </span>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <span className="font-mono-ts text-[9px] md:text-[10px] text-slate-500 hidden sm:inline">{project.period}</span>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full status-pulse" style={{ background: statusColor }} />
              <span className="font-mono-ts text-[9px] md:text-[10px]" style={{ color: statusColor }}>{project.status}</span>
            </div>
          </div>
        </div>

        {/* Content: 3-column layout when md+ */}
        <div className="flex flex-col md:flex-row">
          {/* Image panel */}
          <div className="relative w-full md:w-56 flex-shrink-0 overflow-hidden" style={{ minHeight: 140 }}>
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
              style={{ minHeight: 140, maxHeight: 180 }}
            />
            {/* Neon cyan overlay */}
            <div className="absolute inset-0 pointer-events-none" style={{
              background: `linear-gradient(135deg, ${project.accentColor}22 0%, transparent 60%), rgba(5,5,5,0.35)`,
              mixBlendMode: "multiply",
            }} />
            {/* Scan-line stripe */}
            <div className="absolute inset-0 pointer-events-none" style={{
              backgroundImage: "repeating-linear-gradient(transparent 0px, transparent 3px, rgba(0,0,0,0.12) 3px, rgba(0,0,0,0.12) 4px)",
            }} />
            {/* Version badge */}
            <div className="absolute bottom-2 left-2 font-mono-ts text-[10px] px-1.5 py-0.5"
              style={{ background: "rgba(0,0,0,0.75)", color: project.accentColor, border: `1px solid ${project.accentColor}40` }}>
              {project.version}
            </div>
          </div>

          {/* Log feed - hidden on mobile to save space */}
          <div className="hidden md:block flex-1 p-5 border-r border-l" style={{ borderColor: "var(--border)" }}>
            <p className="font-mono-ts text-[10px] tracking-widest uppercase text-slate-500 mb-3">// deployment_log</p>
            <div className="space-y-1">
              {project.logLines.map((line, i) => (
                <p key={i} className="font-mono-ts text-[11px]" style={{ color: "var(--green)" }}>{line}</p>
              ))}
            </div>
          </div>

          {/* Info panel */}
          <div className="w-full md:w-72 flex-shrink-0 p-4 md:p-5 flex flex-col">
            <h2 className="font-display text-lg md:text-xl font-bold text-white mb-1">{project.title}</h2>
            <p className="font-mono-ts text-[11px] mb-2 md:mb-3" style={{ color: "var(--cyan)" }}>{project.tagline}</p>
            <p className="text-slate-400 text-xs leading-relaxed mb-3 md:mb-4 flex-1">{project.description}</p>
            <div className="flex flex-wrap gap-1.5 mb-3 md:mb-4">
              {project.tags.slice(0, 4).map((tag, i) => (
                <span key={i} className="skill-tag text-[10px] px-2 py-0.5">{tag}</span>
              ))}
              {project.tags.length > 4 && <span className="skill-tag text-[10px] px-2 py-0.5 text-slate-500">+{project.tags.length - 4}</span>}
            </div>
            <button
              onClick={() => onOpen(project)}
              className="btn-outline-ts text-left text-[11px] flex items-center justify-between group w-full md:w-auto"
            >
              <span>VIEW_FULL_LOG</span>
              <span className="group-hover:translate-x-1 transition-transform" style={{ color: "var(--cyan)" }}>→</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// ── Section ────────────────────────────────────────────────────────────────
export default function Projects() {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({ target: container, offset: ["start start", "end end"] });
  const [selected, setSelected] = useState<Project | null>(null);

  return (
    <section id="projects" ref={container} className="bg-[#050505] relative">
      <div className="absolute inset-0 cyber-grid opacity-15 pointer-events-none" />

      <div className="container mx-auto px-4 pt-24 pb-10 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="section-label">04 / DEPLOYED_SYSTEMS</span>
          <h2 className="font-display text-4xl md:text-6xl font-bold text-white mt-3 leading-tight mb-3">
            Active <span className="neon-cyan-glow" style={{ color: "var(--cyan)" }}>Deployments</span>
          </h2>
          <p className="font-mono-ts text-sm text-slate-500">
            <span style={{ color: "var(--green)" }}>$</span> kubectl get deployments --all-namespaces
          </p>
        </motion.div>
      </div>

      <div className="px-4 pb-[20vh]">
        {projects.map((project, i) => {
          const targetScale = 1 - (projects.length - i) * 0.035;
          return (
            <ProjectCard
              key={i}
              index={i}
              project={project}
              progress={scrollYProgress}
              range={[i / projects.length, 1]}
              targetScale={targetScale}
              onOpen={setSelected}
            />
          );
        })}
      </div>

      <AnimatePresence>
        {selected && <ProjectModal project={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </section>
  );
}
