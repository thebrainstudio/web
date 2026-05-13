/**
 * Tour registry. Add new tours by importing the module and adding
 * it to `tours`. The order here is the order shown on the index
 * page. New tours need a corresponding entry in lib/searchIndex.ts.
 */

import type { Tour } from "@/lib/tours";
import { actOfRememberingTour } from "./the-act-of-remembering";
import { howYouReadThisSentenceTour } from "./how-you-read-this-sentence";
import { whatsStillYouTour } from "./whats-still-you-when-you-stop-trying";
import { whenSomethingMattersTour } from "./when-something-matters";
import { howAFaceBecomesSomeoneYouKnowTour } from "./how-a-face-becomes-someone-you-know";
import { hearingMusicTour } from "./hearing-music";

/**
 * Display order: language → memory → DMN → salience → faces →
 * music. Roughly the order of cognitive depth, from the cleanest
 * sensorimotor pipeline (reading a sentence) to the most
 * integrative (the felt sense of a piece of music). Six tours, six
 * angles on the brain in motion.
 */
export const tours: Tour[] = [
  howYouReadThisSentenceTour,
  actOfRememberingTour,
  whatsStillYouTour,
  whenSomethingMattersTour,
  howAFaceBecomesSomeoneYouKnowTour,
  hearingMusicTour,
];

export const toursById: Record<string, Tour> = Object.fromEntries(
  tours.map((t) => [t.id, t]),
);

export function tourById(id: string): Tour | undefined {
  return toursById[id];
}
