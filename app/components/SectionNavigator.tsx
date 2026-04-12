"use client";

import clsx from "clsx";
import { useEffect, useMemo, useState } from "react";

type SectionLink = {
  label: string;
  href: string;
};

export default function SectionNavigator({
  links,
}: Readonly<{
  links: SectionLink[];
}>) {
  const ids = useMemo(() => links.map((link) => link.href.replace("#", "")), [links]);
  const [activeId, setActiveId] = useState(ids[0] ?? "");

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    ids.forEach((id) => {
      const element = document.getElementById(id);
      if (!element) {
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveId(id);
            }
          });
        },
        {
          rootMargin: "-35% 0px -45% 0px",
          threshold: 0.15,
        }
      );

      observer.observe(element);
      observers.push(observer);
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, [ids]);

  return (
    <>
      <nav className="pointer-events-none fixed right-4 top-10 z-20 hidden 2xl:block">
        <div className="section-frame rounded-[2rem] px-5 py-4">
          <div className="font-mono text-[10px] uppercase tracking-[0.32em] text-[var(--muted)]">
            Field Notes
          </div>
          <div className="mt-4 flex flex-col gap-2 pointer-events-auto">
            {links.map((link, index) => {
              const isActive = activeId === link.href.replace("#", "");

              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={clsx(
                    "group flex items-center gap-3 rounded-full px-3 py-2 font-mono text-[11px] uppercase tracking-[0.22em] transition-all duration-300",
                    isActive
                      ? "bg-[rgba(243,196,108,0.12)] text-[var(--accent-soft)]"
                      : "text-[var(--text)] hover:text-[var(--accent-soft)]"
                  )}
                >
                  <span
                    className={clsx(
                      "inline-flex h-6 w-6 items-center justify-center rounded-full border text-[10px] transition-all duration-300",
                      isActive
                        ? "border-[rgba(243,196,108,0.35)] bg-[rgba(243,196,108,0.18)]"
                        : "border-[var(--line)] text-[var(--muted)] group-hover:border-[rgba(243,196,108,0.25)]"
                    )}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span>{link.label}</span>
                </a>
              );
            })}
          </div>
        </div>
      </nav>

      <nav className="fixed bottom-4 left-1/2 z-30 w-[min(calc(100%-1rem),680px)] -translate-x-1/2 2xl:hidden">
        <div className="section-frame flex items-center justify-between gap-2 rounded-full px-2 py-2 backdrop-blur-xl">
          {links.map((link, index) => {
            const isActive = activeId === link.href.replace("#", "");

            return (
              <a
                key={link.href}
                href={link.href}
                className={clsx(
                  "flex min-w-0 flex-1 items-center justify-center rounded-full px-3 py-3 text-center font-mono text-[10px] uppercase tracking-[0.18em] transition-all duration-300",
                  isActive
                    ? "bg-[rgba(243,196,108,0.14)] text-[var(--accent-soft)]"
                    : "text-[var(--muted)]"
                )}
              >
                <span className="hidden sm:inline">{link.label}</span>
                <span className="sm:hidden">{index + 1}</span>
              </a>
            );
          })}
        </div>
      </nav>
    </>
  );
}
