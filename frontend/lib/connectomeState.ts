"use client";

import { create } from "zustand";
import type { TractId } from "./tracts";

/**
 * State for the connectome layer. Tracks which tracts are currently
 * visible inside the persistent brain. Atlas pages mount/unmount
 * their own subscriptions, so the store survives navigation cleanly.
 *
 * The Atlas page also sets `focusMode = true` when any tract is
 * visible, so the persistent brain can override its small upper-
 * right anchor and come back centred at a larger scale (otherwise
 * the tracts would be invisible at scale 0.3).
 */
export type ConnectomeState = {
  visibleTracts: ReadonlySet<TractId>;
  focusMode: boolean;

  setTractVisible: (id: TractId, visible: boolean) => void;
  setAllTracts: (ids: ReadonlySet<TractId>) => void;
  toggleTract: (id: TractId) => void;
  clearTracts: () => void;
};

const empty: ReadonlySet<TractId> = new Set<TractId>();

export const useConnectomeState = create<ConnectomeState>((set) => ({
  visibleTracts: empty,
  focusMode: false,

  setTractVisible: (id, visible) =>
    set((s) => {
      const next = new Set(s.visibleTracts);
      if (visible) next.add(id);
      else next.delete(id);
      return { visibleTracts: next, focusMode: next.size > 0 };
    }),

  setAllTracts: (ids) =>
    set(() => ({ visibleTracts: new Set(ids), focusMode: ids.size > 0 })),

  toggleTract: (id) =>
    set((s) => {
      const next = new Set(s.visibleTracts);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return { visibleTracts: next, focusMode: next.size > 0 };
    }),

  clearTracts: () =>
    set(() => ({ visibleTracts: empty, focusMode: false })),
}));

/**
 * Non-hook getter for use in animation loops where Zustand selector
 * subscriptions would cause unnecessary re-renders.
 */
export function getConnectomeState(): ConnectomeState {
  return useConnectomeState.getState();
}
