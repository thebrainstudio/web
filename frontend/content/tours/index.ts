/**
 * Tour registry. Add new tours by importing the module and adding
 * it to `tours`. The order here is the order shown on the index
 * page. New tours need a corresponding entry in lib/searchIndex.ts.
 */

import type { Tour } from "@/lib/tours";
import { actOfRememberingTour } from "./the-act-of-remembering";
import { howYouReadThisSentenceTour } from "./how-you-read-this-sentence";
import { whatsStillYouTour } from "./whats-still-you-when-you-stop-trying";

export const tours: Tour[] = [
  howYouReadThisSentenceTour,
  actOfRememberingTour,
  whatsStillYouTour,
];

export const toursById: Record<string, Tour> = Object.fromEntries(
  tours.map((t) => [t.id, t]),
);

export function tourById(id: string): Tour | undefined {
  return toursById[id];
}
