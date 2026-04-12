"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

/* eslint-disable @next/next/no-img-element */

type Skill = { name: string; icon: string; color: string; category: string };

// Fallback SVG data URIs for icons that don't load from CDN
const ICON_FALLBACKS: Record<string, string> = {
  AWS: `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill='%23FF9900' d='M6.763 10.036c0 .296.032.535.088.71.064.176.144.368.256.576.04.063.056.127.056.183 0 .08-.048.16-.152.24l-.503.335a.383.383 0 0 1-.208.072c-.08 0-.16-.04-.239-.112a2.47 2.47 0 0 1-.287-.375 6.18 6.18 0 0 1-.248-.471c-.622.734-1.405 1.101-2.347 1.101-.67 0-1.205-.191-1.596-.574-.391-.384-.59-.894-.59-1.533 0-.678.239-1.23.726-1.644.487-.415 1.133-.623 1.955-.623.272 0 .551.024.846.064.296.04.6.104.918.176v-.583c0-.607-.127-1.03-.375-1.277-.255-.248-.686-.367-1.3-.367-.28 0-.568.031-.863.103-.295.072-.583.16-.862.272a2.287 2.287 0 0 1-.28.104.488.488 0 0 1-.127.023c-.112 0-.168-.08-.168-.247v-.391c0-.128.016-.224.056-.28a.597.597 0 0 1 .224-.167c.279-.144.614-.264 1.005-.36a4.84 4.84 0 0 1 1.246-.151c.95 0 1.644.216 2.091.647.439.43.662 1.085.662 1.963v2.586zm-3.24 1.214c.263 0 .534-.048.822-.144.287-.096.543-.271.758-.51.128-.152.224-.32.272-.512.047-.191.08-.423.08-.694v-.335a6.66 6.66 0 0 0-.735-.136 6.02 6.02 0 0 0-.75-.048c-.535 0-.926.104-1.19.32-.263.215-.39.518-.39.917 0 .375.095.655.295.846.191.2.47.296.838.296zm6.41.862c-.144 0-.24-.024-.304-.08-.064-.048-.12-.16-.168-.311L7.586 5.55a1.398 1.398 0 0 1-.072-.32c0-.128.064-.2.191-.2h.783c.151 0 .255.025.31.08.065.048.113.16.16.312l1.342 5.284 1.245-5.284c.04-.16.088-.264.151-.312a.549.549 0 0 1 .32-.08h.638c.152 0 .256.025.32.08.063.048.12.16.151.312l1.261 5.348 1.381-5.348c.048-.16.104-.264.16-.312a.52.52 0 0 1 .311-.08h.743c.127 0 .2.065.2.2 0 .04-.009.08-.017.128a1.137 1.137 0 0 1-.056.2l-1.923 6.17c-.048.16-.104.263-.168.311a.51.51 0 0 1-.303.08h-.687c-.151 0-.255-.024-.32-.08-.063-.056-.119-.16-.15-.32l-1.238-5.148-1.23 5.14c-.04.16-.087.264-.15.32-.065.056-.177.08-.32.08zm10.256.215c-.415 0-.83-.048-1.229-.143-.399-.096-.71-.2-.918-.32-.128-.071-.215-.151-.247-.223a.563.563 0 0 1-.048-.224v-.407c0-.167.064-.247.183-.247.048 0 .096.008.144.024.048.016.12.048.2.08.271.12.566.215.878.279.319.064.63.096.95.096.502 0 .894-.088 1.165-.264a.86.86 0 0 0 .415-.758.777.777 0 0 0-.215-.559c-.144-.151-.416-.287-.807-.415l-1.157-.36c-.583-.183-1.014-.454-1.277-.813a1.902 1.902 0 0 1-.4-1.158c0-.335.073-.63.216-.886.144-.255.335-.479.575-.654.24-.184.51-.32.83-.415.32-.096.655-.136 1.006-.136.175 0 .359.008.535.032.183.024.35.056.518.088.16.04.312.08.455.127.144.048.256.096.336.144a.69.69 0 0 1 .24.2.43.43 0 0 1 .071.263v.375c0 .168-.064.256-.184.256a.83.83 0 0 1-.303-.096 3.652 3.652 0 0 0-1.532-.311c-.455 0-.815.071-1.062.223-.248.152-.375.383-.375.71 0 .224.08.416.24.567.159.152.454.304.877.44l1.134.358c.574.184.99.44 1.237.767.247.327.367.702.367 1.117 0 .343-.072.655-.207.926-.144.272-.336.511-.583.703-.248.2-.543.343-.886.447-.36.111-.734.167-1.142.167z'/></svg>`,
  Twilio: `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill='%23F22F46' d='M12 0C5.381 0 0 5.381 0 12s5.381 12 12 12 12-5.381 12-12S18.619 0 12 0zm0 20.8c-4.847 0-8.8-3.953-8.8-8.8S7.153 3.2 12 3.2s8.8 3.953 8.8 8.8-3.953 8.8-8.8 8.8zm5.44-11.76a2.48 2.48 0 1 1-4.96 0 2.48 2.48 0 0 1 4.96 0zm0 5.92a2.48 2.48 0 1 1-4.96 0 2.48 2.48 0 0 1 4.96 0zm-5.92 0a2.48 2.48 0 1 1-4.96 0 2.48 2.48 0 0 1 4.96 0zm0-5.92a2.48 2.48 0 1 1-4.96 0 2.48 2.48 0 0 1 4.96 0z'/></svg>`,
};

const skills: Skill[] = [
  { name: "JavaScript",  icon: "https://cdn.simpleicons.org/javascript/F7DF1E",    color: "#F7DF1E", category: "Language"  },
  { name: "TypeScript",  icon: "https://cdn.simpleicons.org/typescript/3178C6",    color: "#3178C6", category: "Language"  },
  { name: "Node.js",     icon: "https://cdn.simpleicons.org/nodedotjs/339933",     color: "#339933", category: "Runtime"   },
  { name: "Express",     icon: "https://cdn.simpleicons.org/express/ffffff",       color: "#ffffff", category: "Framework" },
  { name: "NestJS",      icon: "https://cdn.simpleicons.org/nestjs/E0234E",        color: "#E0234E", category: "Framework" },
  { name: "MongoDB",     icon: "https://cdn.simpleicons.org/mongodb/47A248",       color: "#47A248", category: "Database"  },
  { name: "PostgreSQL",  icon: "https://cdn.simpleicons.org/postgresql/4169E1",    color: "#4169E1", category: "Database"  },
  { name: "MySQL",       icon: "https://cdn.simpleicons.org/mysql/4479A1",         color: "#4479A1", category: "Database"  },
  { name: "Redis",       icon: "https://cdn.simpleicons.org/redis/DC382D",         color: "#DC382D", category: "Cache"     },
  { name: "Socket.IO",   icon: "https://cdn.simpleicons.org/socketdotio/ffffff",   color: "#ffffff", category: "Realtime"  },
  { name: "Sequelize",   icon: "https://cdn.simpleicons.org/sequelize/52B0E7",     color: "#52B0E7", category: "ORM"       },
  { name: "Prisma",      icon: "https://cdn.simpleicons.org/prisma/ffffff",        color: "#ffffff", category: "ORM"       },
  { name: "Git",         icon: "https://cdn.simpleicons.org/git/F05032",           color: "#F05032", category: "DevOps"    },
  { name: "AWS",         icon: ICON_FALLBACKS.AWS,                                 color: "#FF9900", category: "Cloud"     },
  { name: "Docker",      icon: "https://cdn.simpleicons.org/docker/2496ED",        color: "#2496ED", category: "DevOps"    },
  { name: "Stripe",      icon: "https://cdn.simpleicons.org/stripe/635BFF",        color: "#635BFF", category: "Payment"   },
  { name: "PayPal",      icon: "https://cdn.simpleicons.org/paypal/003087",        color: "#003087", category: "Payment"   },
  { name: "Twilio",      icon: ICON_FALLBACKS.Twilio,                              color: "#F22F46", category: "API"       },
  { name: "Neo4j",       icon: "https://cdn.simpleicons.org/neo4j/008CC1",         color: "#008CC1", category: "Database"  },
  { name: "Postman",     icon: "https://cdn.simpleicons.org/postman/FF6C37",       color: "#FF6C37", category: "Tool"      },
];

// Group by category for the schema diagram
const categories = ["Language", "Runtime", "Framework", "Database", "Cache", "ORM", "Realtime", "DevOps", "Cloud", "Payment", "API", "Tool"] as const;
const grouped = categories.reduce((acc, cat) => {
  acc[cat] = skills.filter((s) => s.category === cat);
  return acc;
}, {} as Record<string, Skill[]>);

const softSkills = [
  { name: "Team Leadership",      cmd: "lead" },
  { name: "Client Communication", cmd: "comm" },
  { name: "Project Management",   cmd: "mgmt" },
  { name: "Problem Solving",      cmd: "solve" },
  { name: "Code Review",          cmd: "review" },
  { name: "System Design",        cmd: "design" },
];

const MarqueeRow = ({ items, reverse = false }: { items: Skill[]; reverse?: boolean }) => {
  const doubled = [...items, ...items, ...items, ...items];
  return (
    <div className="flex w-full select-none marquee-mask overflow-hidden">
      <div
        className={`flex gap-6 py-3 flex-shrink-0 ${reverse ? "marquee-right" : "marquee-left"} will-change-transform`}
        style={{ width: "max-content" }}
      >
        {doubled.map((skill, i) => (
          <SkillPill key={i} skill={skill} />
        ))}
      </div>
    </div>
  );
};

const SkillPill = ({ skill }: { skill: Skill }) => {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="flex items-center gap-2 px-3 py-1.5 flex-shrink-0 transition-all duration-200 cursor-default"
      style={{
        border: `1px solid ${hov ? skill.color + "80" : "rgba(0,240,255,0.1)"}`,
        background: hov ? skill.color + "12" : "rgba(13,17,23,0.6)",
        boxShadow: hov ? `0 0 12px ${skill.color}30` : "none",
      }}
    >
      <img
        src={ICON_FALLBACKS[skill.name] || skill.icon}
        alt={skill.name}
        className="w-4 h-4 object-contain flex-shrink-0"
        onError={(e) => {
          const fb = ICON_FALLBACKS[skill.name];
          if (fb) { (e.target as HTMLImageElement).src = fb; }
          else { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(skill.name[0])}&background=0d1117&color=00f0ff&size=16&bold=true&format=svg`; }
        }}
      />
      <span className="font-mono-ts text-[11px] whitespace-nowrap" style={{ color: hov ? skill.color : "#94a3b8" }}>
        {skill.name}
      </span>
      <span
        className="font-mono-ts text-[9px] px-1 py-0.5 uppercase tracking-wider"
        style={{ background: skill.color + "15", color: skill.color, border: `1px solid ${skill.color}30` }}
      >
        {skill.category}
      </span>
    </div>
  );
};

export default function Skills() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const row1 = skills.slice(0, 10);
  const row2 = skills.slice(10);

  return (
    <section ref={ref} id="skills" className="py-24 overflow-hidden relative bg-[#050505]">
      <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none" />

      {/* Header */}
      <div className="container mx-auto px-4 mb-10 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="section-label">02 / TECH_STACK</span>
          <h2 className="font-display text-4xl md:text-6xl font-bold text-white mt-3 leading-tight">
            Dependencies<span className="neon-cyan-glow" style={{ color: "var(--cyan)" }}>.</span>json
          </h2>
          <p className="font-mono-ts text-sm text-slate-500 mt-2">
            <span style={{ color: "var(--green)" }}>$</span> npm list --depth=0 | grep &lt;installed&gt;
          </p>
        </motion.div>
      </div>

      {/* Schema diagram */}
      <div className="container mx-auto px-4 mb-10 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="terminal-window"
        >
          <div className="terminal-titlebar">
            <span className="terminal-dot" style={{ background: "#ff5f57" }} />
            <span className="terminal-dot" style={{ background: "#ffbd2e" }} />
            <span className="terminal-dot" style={{ background: "#28c840" }} />
            <span className="font-mono-ts text-[11px] text-slate-500 ml-2">
              neel@portfolio ~ $ cat package.json | jq .dependencies
            </span>
          </div>
          <div className="p-5 overflow-x-auto">
            <div className="flex gap-4 flex-wrap">
              {Object.entries(grouped).map(([cat, items]) => (
                items.length > 0 && (
                  <div key={cat} className="min-w-[140px]" style={{ border: "1px solid rgba(0,240,255,0.1)", background: "#0a0f14" }}>
                    <div className="px-3 py-1.5 font-mono-ts text-[10px] font-bold uppercase tracking-widest border-b" style={{ color: "var(--cyan)", borderColor: "rgba(0,240,255,0.1)" }}>
                      {cat}
                    </div>
                    <div className="p-2 space-y-1">
                      {items.map((skill, i) => (
                        <div key={i} className="flex items-center gap-2 font-mono-ts text-[10px]">
                          <img src={skill.icon} alt={skill.name} className="w-3 h-3 object-contain"
                            onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${skill.name[0]}&background=0d1117&color=00f0ff&size=12&format=svg`; }} />
                          <span className="text-slate-400">&quot;{skill.name.toLowerCase().replace(/\s/, "-")}&quot;:</span>
                          <span style={{ color: "var(--green)" }}>&quot;*&quot;</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              ))}
            </div>
            <div className="mt-4 font-mono-ts text-[10px]" style={{ color: "var(--green)" }}>
              npm notice ✓ 20 packages installed — 0 vulnerabilities found
            </div>
          </div>
        </motion.div>
      </div>

      {/* Marquee rows */}
      <div className="space-y-2 relative z-10 mb-10">
        <MarqueeRow items={row1} />
        <MarqueeRow items={row2} reverse />
      </div>

      {/* Soft skills */}
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="font-mono-ts text-[10px] tracking-widest uppercase text-slate-500 mb-4">
            // soft_skills — non-technical packages
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {softSkills.map((skill, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                whileHover={{ y: -3 }}
                className="ts-panel corner-bracket p-4 text-center cursor-default group transition-all duration-200 hover:glow-cyan"
              >
                <div className="font-mono-ts text-[10px] mb-1.5" style={{ color: "var(--green)" }}>
                  ./{skill.cmd}
                </div>
                <div className="font-mono-ts text-[10px] text-slate-400 leading-tight">{skill.name}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
