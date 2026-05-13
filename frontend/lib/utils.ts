import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * Configure tailwind-merge so it understands our custom font-size scale
 * (text-display / text-heading / text-body / text-caption) and doesn't
 * strip them when used alongside text-color (e.g. text-bone-cream) or
 * text-wrap (e.g. text-balance) classes.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        { text: ["display", "heading", "body", "caption"] },
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
