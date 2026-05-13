import { ImageResponse } from "next/og";

// 1200×630 OG image, generated at build time. Brass editorial wordmark
// over deep-navy ground with a faint constellation hint in the lower
// half. Matches the site's voice — no marketing chrome.

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt =
  "The Brain Studio — a cinematic experiment in seeing the mind through a brain-encoding model.";

export default function OG() {
  // Stylized dots representing the 20-region constellation. Kept as a
  // hand-picked subset so the OG doesn't try to be the real visual.
  const dots = [
    { x: 250, y: 410, r: 9, c: "#5cc8d6" },
    { x: 320, y: 480, r: 10, c: "#e8a04a" },
    { x: 410, y: 440, r: 14, c: "#c9a961" },
    { x: 500, y: 510, r: 8, c: "#5cc8d6" },
    { x: 600, y: 470, r: 11, c: "#e8a04a" },
    { x: 700, y: 520, r: 9, c: "#c9a961" },
    { x: 800, y: 460, r: 13, c: "#8b3a3a" },
    { x: 900, y: 500, r: 8, c: "#5cc8d6" },
    { x: 980, y: 430, r: 10, c: "#e8a04a" },
  ];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background:
            "linear-gradient(180deg, #0a1428 0%, #0d162e 50%, #11192e 100%)",
          display: "flex",
          flexDirection: "column",
          padding: "64px 80px",
          color: "#f0e8d8",
          fontFamily: "Georgia, serif",
          position: "relative",
        }}
      >
        <div
          style={{
            fontSize: 22,
            letterSpacing: "0.32em",
            color: "#c9a961",
            textTransform: "uppercase",
          }}
        >
          The Brain Studio
        </div>

        <div
          style={{
            marginTop: 80,
            fontSize: 78,
            fontStyle: "italic",
            letterSpacing: "-0.025em",
            lineHeight: 1.05,
            maxWidth: 980,
          }}
        >
          There is a model that predicts what your brain will do.
        </div>

        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            display: "flex",
          }}
        >
          <svg
            width="1200"
            height="630"
            viewBox="0 0 1200 630"
            style={{ position: "absolute", inset: 0 }}
          >
            <ellipse
              cx="600"
              cy="470"
              rx="450"
              ry="120"
              fill="none"
              stroke="#c9a961"
              strokeOpacity="0.12"
              strokeWidth="1"
            />
            {dots.map((d, i) => (
              <g key={i}>
                <circle
                  cx={d.x}
                  cy={d.y}
                  r={d.r + 6}
                  fill={d.c}
                  opacity={0.18}
                />
                <circle cx={d.x} cy={d.y} r={d.r} fill={d.c} opacity={0.85} />
              </g>
            ))}
          </svg>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 56,
            left: 80,
            right: 80,
            display: "flex",
            justifyContent: "space-between",
            color: "#f0e8d8",
            opacity: 0.6,
            fontSize: 18,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
          }}
        >
          <span>brain-studio-kappa.vercel.app</span>
          <span>TRIBE v2 · 20 regions</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
