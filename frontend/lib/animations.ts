/**
 * The approved easings. Matches CSS vars in globals.css.
 * Framer Motion accepts these as `ease` arrays.
 */

export const easeCinematic = [0.16, 1, 0.3, 1] as const;
export const easeExpressive = [0.83, 0, 0.17, 1] as const;
export const easeStandard = [0.4, 0, 0.2, 1] as const;
// Phase 11: a slightly tighter cinematic curve — used for the "most
// important moments" per the design-critic brief. Same family as
// easeCinematic but the trailing tail settles slightly faster.
export const easeImportant = [0.22, 1, 0.36, 1] as const;

export const durationMicro = 0.2;
export const durationSmall = 0.4;
export const durationPage = 0.8;
export const durationHero = 1.6;

/**
 * Sibling stagger window. Groups enter with 60–120ms between elements.
 */
export const staggerTight = 0.06;
export const staggerLoose = 0.12;
