"use client";

import { useRef } from "react";
import ScrollyCanvas from "./components/ScrollyCanvas";
import Overlay from "./components/Overlay";
import Projects from "./components/Projects";
import About from "./components/About";
import Skills from "./components/Skills";
import Experience from "./components/Experience";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import NetworkBackground from "./components/NetworkBackground";

export default function Home() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  return (
    <main className="min-h-screen text-white" style={{ background: "var(--background)" }}>
      {/* Fixed node-graph background — visible through all sections */}
      <NetworkBackground />

      {/* Hero — sticky 3D framing sequence */}
      <div ref={scrollContainerRef} className="relative h-[360vh]" style={{ zIndex: 1 }}>
        <ScrollyCanvas scrollContainerRef={scrollContainerRef as React.RefObject<HTMLElement>} />
        {/* Pass same ref so Overlay tracks the same scroll progress as the canvas */}
        <Overlay scrollContainerRef={scrollContainerRef} />
      </div>

      {/* Content sections — semi-transparent so the network bg shows through */}
      <div className="relative" style={{ zIndex: 1 }}>
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Contact />
        <Footer />
      </div>
    </main>
  );
}
