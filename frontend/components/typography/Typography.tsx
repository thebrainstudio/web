"use client";

import {
  createElement,
  forwardRef,
  useEffect,
  useMemo,
  useRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

/**
 * Semantic typography system.
 *
 * Six components — Display / Heading / Body / Caption / Mono / Hand —
 * are the only sanctioned way to render content text in this site.
 * Italic is a prop on the editorial components (italic-as-voice).
 * Sizes are locked to the four design tokens (display / heading / body / caption).
 */

const editorialClass = "font-editorial";

type CommonRest = Omit<HTMLAttributes<HTMLElement>, "className" | "style">;

/**
 * Visual-elevation Fix 8 — Display and Heading drive their wght
 * axis from the scroll-velocity CSS variable, set by
 * <ScrollWeight />. Body / Caption / Mono / Hand stay at their
 * book weights. Reduced-motion users get a static --scroll-wght:
 * 400 (declared in globals.css and re-pinned by ScrollWeight on
 * mount).
 */
const scrollWeightStyle: React.CSSProperties = {
  fontVariationSettings: '"wght" var(--scroll-wght, 400)',
};

// --- Display ---------------------------------------------------------------

type DisplayProps = {
  children: ReactNode;
  italic?: boolean;
  as?: "h1" | "h2" | "div" | "span";
  className?: string;
} & CommonRest;

export const Display = forwardRef<HTMLElement, DisplayProps>(
  function Display({ children, italic, as = "h1", className, ...rest }, ref) {
    return createElement(
      as,
      {
        ref,
        className: cn(
          editorialClass,
          "text-display text-balance",
          italic && "italic",
          className,
        ),
        style: scrollWeightStyle,
        ...rest,
      },
      children,
    );
  },
);

// --- Heading ---------------------------------------------------------------

type HeadingProps = {
  children: ReactNode;
  italic?: boolean;
  as?: "h2" | "h3" | "div" | "span";
  className?: string;
} & CommonRest;

export const Heading = forwardRef<HTMLElement, HeadingProps>(
  function Heading({ children, italic, as = "h2", className, ...rest }, ref) {
    return createElement(
      as,
      {
        ref,
        className: cn(
          editorialClass,
          "text-heading text-balance",
          "font-[400]",
          italic && "italic",
          className,
        ),
        style: scrollWeightStyle,
        ...rest,
      },
      children,
    );
  },
);

// --- Body -------------------------------------------------------------------

type BodyProps = {
  children: ReactNode;
  italic?: boolean;
  as?: "p" | "div" | "span";
  className?: string;
} & CommonRest;

export const Body = forwardRef<HTMLElement, BodyProps>(
  function Body({ children, italic, as = "p", className, ...rest }, ref) {
    return createElement(
      as,
      {
        ref,
        className: cn(
          editorialClass,
          "text-body",
          "font-[400]",
          italic && "italic",
          className,
        ),
        ...rest,
      },
      children,
    );
  },
);

// --- Caption ----------------------------------------------------------------

type CaptionProps = {
  children: ReactNode;
  uppercase?: boolean;
  italic?: boolean;
  as?: "span" | "p" | "div";
  className?: string;
} & CommonRest;

export const Caption = forwardRef<HTMLElement, CaptionProps>(
  function Caption(
    { children, uppercase, italic, as = "span", className, ...rest },
    ref,
  ) {
    return createElement(
      as,
      {
        ref,
        className: cn(
          editorialClass,
          "text-caption",
          "font-[400]",
          uppercase && "uppercase tracking-[0.28em]",
          italic && "italic",
          className,
        ),
        ...rest,
      },
      children,
    );
  },
);

// --- Mono -------------------------------------------------------------------

type MonoVariant = "value" | "label" | "code";

type MonoProps = {
  children: ReactNode;
  variant?: MonoVariant;
  as?: "span" | "p" | "div" | "code";
  className?: string;
} & CommonRest;

const monoVariantClass: Record<MonoVariant, string> = {
  value: "font-mono text-display font-[500] tabular tracking-tight",
  label: "font-mono text-caption font-[400] tabular tracking-tight",
  code: "font-mono text-caption font-[400] tabular bg-indigo-smoke/40 px-1.5 py-0.5 rounded-sm",
};

export const Mono = forwardRef<HTMLElement, MonoProps>(
  function Mono({ children, variant = "label", as, className, ...rest }, ref) {
    const tag = as ?? (variant === "code" ? "code" : "span");
    return createElement(
      tag,
      {
        ref,
        className: cn(monoVariantClass[variant], className),
        ...rest,
      },
      children,
    );
  },
);

// --- Hand -------------------------------------------------------------------

/**
 * Marginalia handwriting. Rotation is picked once per instance and frozen.
 * Hard soft-cap: dev console warning if >10 instances mount on a page.
 */

let handInstanceCount = 0;
let handWarnedThisPage = false;

if (typeof window !== "undefined") {
  window.addEventListener("popstate", () => {
    handInstanceCount = 0;
    handWarnedThisPage = false;
  });
}

type HandProps = {
  children: ReactNode;
  rotate?: number;
  className?: string;
} & Omit<HTMLAttributes<HTMLSpanElement>, "className" | "style">;

export const Hand = forwardRef<HTMLSpanElement, HandProps>(
  function Hand({ children, rotate, className, ...rest }, ref) {
    const frozenRotation = useRef<number | null>(null);
    if (frozenRotation.current === null) {
      frozenRotation.current = rotate ?? Math.random() * 2 - 1;
    }

    useEffect(() => {
      if (process.env.NODE_ENV === "production") return;
      handInstanceCount += 1;
      if (handInstanceCount > 10 && !handWarnedThisPage) {
        handWarnedThisPage = true;
        console.warn(
          `[Typography] <Hand> has rendered more than 10 times on this page. ` +
            `Marginalia is meant to be sparse — if you genuinely need this many, ` +
            `something else is probably wrong.`,
        );
      }
      return () => {
        handInstanceCount = Math.max(0, handInstanceCount - 1);
      };
    }, []);

    const style = useMemo(
      () => ({
        display: "inline-block",
        transform: `rotate(${frozenRotation.current ?? 0}deg)`,
      }),
      [],
    );

    return (
      <span
        ref={ref}
        className={cn("font-hand text-body font-[400]", className)}
        style={style}
        {...rest}
      >
        {children}
      </span>
    );
  },
);
