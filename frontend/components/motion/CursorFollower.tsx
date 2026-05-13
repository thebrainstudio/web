"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * A brass-tinted ring that follows the cursor with light damping.
 * Scales up over interactive elements (a, button, [role=button], input).
 * Hidden entirely on touch devices via (hover: none).
 */
export default function CursorFollower() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 380, damping: 30, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 380, damping: 30, mass: 0.4 });
  const [active, setActive] = useState(false);
  const [touch, setTouch] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setTouch(!window.matchMedia("(hover: hover)").matches);
    if (!window.matchMedia("(hover: hover)").matches) return;

    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const target = e.target as HTMLElement | null;
      const isInteractive = !!target?.closest(
        "a, button, [role=button], input, label, summary, [data-hover]",
      );
      setActive(isInteractive);
    };

    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [x, y]);

  if (touch) return null;

  const size = active ? 40 : 16;

  return (
    <motion.div
      aria-hidden
      style={{
        translateX: springX,
        translateY: springY,
        width: size,
        height: size,
      }}
      animate={{ width: size, height: size }}
      transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
      className="pointer-events-none fixed left-0 top-0 z-[100] -translate-x-1/2 -translate-y-1/2 rounded-full border border-brass mix-blend-screen"
    >
      <div
        className="h-full w-full rounded-full bg-brass"
        style={{ opacity: active ? 0.15 : 0.05 }}
      />
    </motion.div>
  );
}
