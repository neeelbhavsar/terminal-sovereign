"use client";

import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import { useEffect } from "react";

export default function MouseGlow() {
  const pointerX = useMotionValue(-200);
  const pointerY = useMotionValue(-200);
  const smoothX = useSpring(pointerX, { stiffness: 160, damping: 28, mass: 0.3 });
  const smoothY = useSpring(pointerY, { stiffness: 160, damping: 28, mass: 0.3 });

  useEffect(() => {
    const updatePointer = (event: PointerEvent) => {
      pointerX.set(event.clientX);
      pointerY.set(event.clientY);
    };

    window.addEventListener("pointermove", updatePointer);
    return () => window.removeEventListener("pointermove", updatePointer);
  }, [pointerX, pointerY]);

  const background = useMotionTemplate`
    radial-gradient(280px circle at ${smoothX}px ${smoothY}px, rgba(243,196,108,0.14), transparent 65%)
  `;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[2] hidden md:block"
      style={{ background }}
    />
  );
}
