import { ImageResponse } from "next/og";

// 32×32 favicon: brass capital B on deep-navy ground, tracked tight.
// Routes that import `next/og` are generated at build time and served as
// static assets. No runtime cost.

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#0a1428",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#c9a961",
          fontFamily: "Georgia, serif",
          fontStyle: "italic",
          fontSize: 44,
          letterSpacing: "-0.04em",
          lineHeight: 1,
        }}
      >
        B
      </div>
    ),
    { ...size },
  );
}
