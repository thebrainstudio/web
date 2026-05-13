"use client";

import { useEffect } from "react";

/**
 * Keeps `<html lang>` in sync with the active locale on the client.
 *
 * The root layout sets `lang="en"` by default (it has no awareness of
 * the URL locale). This component runs inside the [locale] layout and
 * updates the attribute on every locale change, so screen readers and
 * the browser switch language correctly without a full page reload.
 */
export default function LocaleLangSync({ locale }: { locale: string }) {
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale;
    }
  }, [locale]);
  return null;
}
