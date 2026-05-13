"use client";

import { motion } from "framer-motion";
import { easeCinematic } from "@/lib/animations";

/**
 * Page transition wrapper. Keyed by Next so each route gets a fresh template
 * (and its enter animation). The persistent BrainStage lives in the parent
 * layout, so it doesn't unmount during these transitions — it just glides
 * toward the destination page's first ScrollScene target.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, ease: easeCinematic }}
    >
      {children}
    </motion.div>
  );
}
