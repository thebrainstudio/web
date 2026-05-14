"use client";

import { useEffect } from "react";

/**
 * Closes a UI element on Escape and on click outside a marker
 * element. The element must carry `data-nav-panel` on whichever DOM
 * node should count as "inside" — typically the trigger button +
 * the panel together, wrapped in a `<li data-nav-panel>...</li>`.
 *
 * Used by the nav mega-menu so all four panel triggers share one
 * dismissal contract; the hook itself is generic and could be lifted
 * out for other dismissable popovers.
 */
export function useDismissable(
  active: boolean,
  onDismiss: () => void,
  selector: string = "[data-nav-panel]",
) {
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onDismiss();
    };
    const onMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && !target.closest(selector)) onDismiss();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onMouseDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onMouseDown);
    };
  }, [active, onDismiss, selector]);
}
