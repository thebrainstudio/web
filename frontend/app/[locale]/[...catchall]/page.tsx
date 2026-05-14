import { notFound } from "next/navigation";

/**
 * audit-fix: Task 5. Locale-scoped catch-all that triggers the
 * locale-aware not-found.tsx for any URL under /<locale>/* that
 * doesn't match a more specific route. Without this, Next falls
 * through to app/not-found.tsx, which is locale-agnostic and was
 * the source of the stale "three rooms" copy in the audit.
 */
export default function CatchAll(): never {
  notFound();
}
