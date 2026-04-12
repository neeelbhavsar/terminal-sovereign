"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";

const contactInfo = [
  {
    method: "POST",
    endpoint: "/api/email",
    label: "Email",
    value: "neelbhavsar124@gmail.com",
    href: "mailto:neelbhavsar124@gmail.com",
    color: "#00ff41",
  },
  {
    method: "GET",
    endpoint: "/api/linkedin",
    label: "LinkedIn",
    value: "linkedin.com/in/neeelbhavsar",
    href: "https://linkedin.com/in/neeelbhavsar",
    color: "#00f0ff",
  },
  {
    method: "GET",
    endpoint: "/api/github",
    label: "GitHub",
    value: "github.com/neeelbhavsar",
    href: "https://github.com/neeelbhavsar",
    color: "#00f0ff",
  },
];

/* ── Mini email preview component ─────────────────────────────────────── */
function EmailPreview({ name, email, message }: { name: string; email: string; message: string }) {
  const ts = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  return (
    <motion.div
      key="preview"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="terminal-window text-[11px] font-mono-ts"
      style={{ fontSize: 11 }}
    >
      {/* chrome */}
      <div className="terminal-titlebar justify-between">
        <div className="flex items-center gap-2">
          <span className="terminal-dot" style={{ background: "#ff5f57" }} />
          <span className="terminal-dot" style={{ background: "#ffbd2e" }} />
          <span className="terminal-dot" style={{ background: "#28c840" }} />
          <span className="font-mono-ts text-[10px] text-slate-500 ml-1">email_preview.html</span>
        </div>
        <span className="font-mono-ts text-[10px]" style={{ color: "var(--green)" }}>LIVE</span>
      </div>

      {/* header banner */}
      <div className="p-4 border-b" style={{ background: "#04100a", borderColor: "#00ff4118" }}>
        <p className="text-[10px] tracking-widest mb-1" style={{ color: "var(--green)" }}>// event: inbound_contact_request</p>
        <p className="text-base font-bold tracking-widest" style={{ color: "var(--cyan)" }}>NEW_MESSAGE_RECEIVED</p>
        <p className="text-[10px] text-slate-500 mt-0.5">{ts} — portfolio-mailer</p>
      </div>

      {/* headers table */}
      <div className="p-4 space-y-2 border-b" style={{ borderColor: "var(--border)" }}>
        <p className="text-[10px] tracking-widest text-slate-500 mb-2">// request_headers</p>
        {[
          { key: "X-Sender-Name",  val: name  || "John Doe",           color: "#e2e8f0" },
          { key: "X-Sender-Email", val: email || "john@example.com",   color: "var(--green)" },
          { key: "X-Method",       val: "POST /api/contact",           color: "var(--cyan)" },
          { key: "X-Status",       val: "200 OK",                      color: "var(--cyan)" },
        ].map((row, i) => (
          <div key={i} className="flex gap-3 pb-1.5 border-b" style={{ borderColor: "#1a2a2a" }}>
            <span style={{ color: "var(--cyan)", minWidth: 120 }}>{row.key}</span>
            <span style={{ color: row.color }}>{row.val}</span>
          </div>
        ))}
      </div>

      {/* message body */}
      <div className="p-4">
        <p className="text-[10px] tracking-widest text-slate-500 mb-2">// request_body</p>
        <div className="p-3 border-l-2" style={{ borderColor: "var(--cyan)", background: "#05080a" }}>
          <p className="text-[10px] mb-1.5" style={{ color: "var(--green)" }}>&gt; message payload:</p>
          <p className="text-slate-400 leading-relaxed whitespace-pre-wrap">{message || "Your message will appear here..."}</p>
        </div>
      </div>

      {/* log */}
      <div className="px-4 pb-3 space-y-0.5">
        <p style={{ color: "var(--green)" }}>[INFO] Validation: PASSED</p>
        <p style={{ color: "var(--green)" }}>[INFO] Delivered → neelbhavsar124@gmail.com</p>
        <p className="text-slate-500">[INFO] Auto-reply queued for {email || "sender"}</p>
      </div>
    </motion.div>
  );
}

/* ── Main section ──────────────────────────────────────────────────────── */
export default function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [focused, setFocused] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const fieldsFilled = form.name.length > 0 || form.email.length > 0 || form.message.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send");
      setSubmitted(true);
      setShowPreview(false);
      setForm({ name: "", email: "", message: "" });
      setTimeout(() => setSubmitted(false), 7000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "SYSTEM_FAILURE: please retry");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      ref={ref}
      id="contact"
      aria-label="Contact section"
      className="py-24 relative overflow-hidden bg-[#050505]"
    >
      <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <span className="section-label">05 / CONTACT</span>
          <h2 className="font-display text-4xl md:text-6xl font-bold text-white mt-3 leading-tight">
            Open <span className="neon-cyan-glow" style={{ color: "var(--cyan)" }}>Endpoints</span>
          </h2>
          <p className="font-mono-ts text-sm text-slate-500 mt-2">
            <span style={{ color: "var(--green)" }}>$</span> curl -X POST /api/contact -H &quot;Content-Type: application/json&quot;
          </p>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 max-w-7xl">

          {/* ── Col 1: Endpoint directory + status ── */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="space-y-4"
          >
            {/* Endpoint list */}
            <div className="terminal-window">
              <div className="terminal-titlebar">
                <span className="terminal-dot" style={{ background: "#ff5f57" }} />
                <span className="terminal-dot" style={{ background: "#ffbd2e" }} />
                <span className="terminal-dot" style={{ background: "#28c840" }} />
                <span className="font-mono-ts text-[11px] text-slate-500 ml-2">contact-api — OpenAPI v3.0</span>
              </div>
              <div className="p-5 space-y-3">
                <p className="font-mono-ts text-[10px] tracking-widest uppercase text-slate-500 mb-4">// available_endpoints</p>
                {contactInfo.map((info, i) => (
                  <motion.a
                    key={i}
                    href={info.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, x: -10 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="flex items-start gap-3 group ts-panel p-3 hover:glow-cyan transition-all duration-200 block"
                    style={{ textDecoration: "none" }}
                  >
                    <span
                      className="font-mono-ts text-[10px] font-bold flex-shrink-0 mt-0.5 px-1.5 py-0.5"
                      style={{ background: `${info.color}15`, color: info.color, border: `1px solid ${info.color}35` }}
                    >
                      {info.method}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-mono-ts text-[10px] text-slate-500">{info.endpoint}</p>
                      <p className="font-mono-ts text-xs mt-0.5 truncate group-hover:text-white transition-colors duration-200"
                        style={{ color: info.color }}>
                        {info.value}
                      </p>
                    </div>
                    <span className="ml-auto font-mono-ts text-[10px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0"
                      style={{ color: "var(--green)" }}>200 →</span>
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Availability */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.65 }}
              className="ts-panel p-4 flex items-center gap-4">
              <div className="relative flex-shrink-0">
                <div className="w-3 h-3 rounded-full status-pulse" style={{ background: "var(--green)" }} />
              </div>
              <div>
                <p className="font-mono-ts text-sm text-white font-semibold tracking-wide">STATUS: AVAILABLE_FOR_HIRE</p>
                <p className="font-mono-ts text-[11px] text-slate-500 mt-0.5">Open to full-time roles & freelance</p>
              </div>
            </motion.div>

            {/* Response SLA */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.75 }}
              className="ts-panel p-4 space-y-2.5">
              <p className="font-mono-ts text-[10px] tracking-widest uppercase text-slate-500 mb-1">// response_sla</p>
              {[
                { label: "Email reply",    val: "< 24h",  color: "var(--green)" },
                { label: "LinkedIn reply", val: "< 12h",  color: "var(--cyan)"  },
                { label: "Availability",   val: "Immediate", color: "var(--green)" },
              ].map((row, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="font-mono-ts text-[11px] text-slate-500">{row.label}</span>
                  <span className="font-mono-ts text-[11px] font-bold" style={{ color: row.color }}>{row.val}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* ── Col 2: Terminal form ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.25 }}
          >
            <form
              onSubmit={handleSubmit}
              className="terminal-window h-full flex flex-col"
              aria-label="Contact form"
              noValidate
            >
              <div className="terminal-titlebar justify-between">
                <div className="flex items-center gap-2">
                  <span className="terminal-dot" style={{ background: "#ff5f57" }} aria-hidden="true" />
                  <span className="terminal-dot" style={{ background: "#ffbd2e" }} aria-hidden="true" />
                  <span className="terminal-dot" style={{ background: "#28c840" }} aria-hidden="true" />
                  <span className="font-mono-ts text-[11px] text-slate-500 ml-1">new_request.sh</span>
                </div>
                {fieldsFilled && (
                  <button
                    type="button"
                    onClick={() => setShowPreview((p) => !p)}
                    className="font-mono-ts text-[10px] px-2 py-0.5 transition-all duration-200"
                    style={{
                      border: `1px solid ${showPreview ? "var(--cyan)" : "rgba(0,240,255,0.2)"}`,
                      color: showPreview ? "var(--cyan)" : "#4b5563",
                      background: showPreview ? "rgba(0,240,255,0.08)" : "transparent",
                    }}
                  >
                    {showPreview ? "HIDE_PREVIEW" : "PREVIEW_EMAIL"}
                  </button>
                )}
              </div>

              <div className="p-6 space-y-5 flex-1">
                {/* Prompt */}
                <p className="font-mono-ts text-[10px] text-slate-500">
                  <span style={{ color: "var(--green)" }}>$</span> send --request POST /api/contact --data &apos;
                </p>

                {/* Fields */}
                {[
                  { id: "name",  label: '"name"',    type: "text",  placeholder: '"John Doe"', ariaLabel: "Your full name" },
                  { id: "email", label: '"email"',   type: "email", placeholder: '"john@example.com"', ariaLabel: "Your email address" },
                ].map((field) => (
                  <div key={field.id} className="relative">
                    <div className="flex items-center gap-2">
                      <span className="font-mono-ts text-[11px] flex-shrink-0 w-4 text-right" style={{ color: "var(--green)" }} aria-hidden="true">›</span>
                      <label
                        htmlFor={field.id}
                        className="font-mono-ts text-[11px] flex-shrink-0"
                        style={{ color: "var(--cyan)" }}
                      >
                        {field.label}:
                      </label>
                      <input
                        id={field.id}
                        type={field.type}
                        value={form[field.id as keyof typeof form]}
                        onChange={(e) => setForm((p) => ({ ...p, [field.id]: e.target.value }))}
                        onFocus={() => setFocused(field.id)}
                        onBlur={() => setFocused(null)}
                        placeholder={field.placeholder}
                        required
                        autoComplete={field.id === "email" ? "email" : "name"}
                        aria-label={field.ariaLabel}
                        aria-describedby={focused === field.id ? `${field.id}-help` : undefined}
                        className="input-ts flex-1 font-mono-ts text-[12px]"
                        style={{
                          borderBottomColor: focused === field.id ? "var(--cyan)" : undefined,
                          color: "#e2e8f0",
                        }}
                      />
                    </div>
                    {focused === field.id && (
                      <p className="font-mono-ts text-[9px] text-slate-500 ml-7 mt-0.5">// required field — string</p>
                    )}
                  </div>
                ))}

                {/* Message textarea */}
                <div>
                  <div className="flex items-start gap-2">
                    <span className="font-mono-ts text-[11px] flex-shrink-0 w-4 text-right mt-2" style={{ color: "var(--green)" }} aria-hidden="true">›</span>
                    <label
                      htmlFor="message"
                      className="font-mono-ts text-[11px] flex-shrink-0 mt-2"
                      style={{ color: "var(--cyan)" }}
                    >
                      &quot;message&quot;:
                    </label>
                    <textarea
                      id="message"
                      value={form.message}
                      onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                      onFocus={() => setFocused("message")}
                      onBlur={() => setFocused(null)}
                      placeholder='"Tell me about your project..."'
                      required
                      minLength={10}
                      maxLength={5000}
                      rows={5}
                      aria-label="Your message"
                      aria-describedby={focused === "message" ? "message-help" : undefined}
                      className="input-ts flex-1 resize-none font-mono-ts text-[12px]"
                      style={{
                        borderBottomColor: focused === "message" ? "var(--cyan)" : undefined,
                        color: "#e2e8f0",
                      }}
                    />
                  </div>
                  {focused === "message" && (
                    <p className="font-mono-ts text-[9px] text-slate-500 ml-7 mt-0.5">// required field — string | min: 10 chars</p>
                  )}
                </div>

                {/* Close JSON */}
                <p className="font-mono-ts text-[10px] text-slate-500">&apos;</p>

                {/* Char counter */}
                {form.message.length > 0 && (
                  <p className="font-mono-ts text-[10px] text-right" style={{ color: form.message.length >= 10 ? "var(--green)" : "#ff5f57" }}>
                    {form.message.length} chars — {form.message.length >= 10 ? "✓ valid" : `need ${10 - form.message.length} more`}
                  </p>
                )}

                {error && (
                  <div className="ts-panel p-3 border-l-2" style={{ borderColor: "#ff5f57" }}>
                    <p className="font-mono-ts text-[11px]" style={{ color: "#ff5f57" }}>
                      [ERROR] {error}
                    </p>
                  </div>
                )}

                {/* Submit */}
                <AnimatePresence mode="wait">
                  {submitted ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="ts-panel p-4 border-l-2 space-y-1"
                      style={{ borderColor: "var(--green)" }}
                    >
                      <p className="font-mono-ts text-[11px]" style={{ color: "var(--green)" }}>
                        [201] Message delivered ✓
                      </p>
                      <p className="font-mono-ts text-[10px] text-slate-500">Auto-reply sent to your inbox. Talk soon!</p>
                    </motion.div>
                  ) : (
                    <motion.button
                      key="submit"
                      type="submit"
                      disabled={loading}
                      whileHover={{ scale: loading ? 1 : 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full font-mono-ts text-[12px] py-3 tracking-widest uppercase transition-all duration-200 disabled:opacity-60"
                      style={{
                        border: "1px solid var(--cyan)",
                        background: loading ? "rgba(0,240,255,0.05)" : "rgba(0,240,255,0.1)",
                        color: "var(--cyan)",
                      }}
                    >
                      {loading
                        ? "$ SENDING_REQUEST..."
                        : "$ send --request POST ↵"
                      }
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </form>
          </motion.div>

          {/* ── Col 3: Email preview (always visible on xl, toggle on smaller) ── */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="hidden xl:block"
          >
            <EmailPreview name={form.name} email={form.email} message={form.message} />
          </motion.div>

        </div>

        {/* Mobile col-3: shown only when preview toggled AND field filled */}
        <AnimatePresence>
          {showPreview && fieldsFilled && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="xl:hidden mt-6 overflow-hidden max-w-2xl"
            >
              <EmailPreview name={form.name} email={form.email} message={form.message} />
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
