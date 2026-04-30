import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Noor Guide: a step-by-step guide for new Muslims";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background:
            "linear-gradient(135deg, #FEFCF3 0%, #FEFCF3 50%, #F0FDF4 100%)",
          display: "flex",
          flexDirection: "column",
          padding: "80px",
          position: "relative",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {/* Decorative star octagram in upper-right corner */}
        <svg
          viewBox="0 0 100 100"
          width="180"
          height="180"
          style={{
            position: "absolute",
            top: "60px",
            right: "60px",
            opacity: 0.18,
          }}
        >
          <rect
            x="22"
            y="22"
            width="56"
            height="56"
            fill="none"
            stroke="#2D6A4F"
            strokeWidth="2"
          />
          <rect
            x="22"
            y="22"
            width="56"
            height="56"
            fill="none"
            stroke="#2D6A4F"
            strokeWidth="2"
            transform="rotate(45 50 50)"
          />
          <circle cx="50" cy="50" r="6" fill="none" stroke="#2D6A4F" strokeWidth="2" />
        </svg>

        <div style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "center" }}>
          <div
            style={{
              fontSize: 36,
              color: "#2D6A4F",
              fontWeight: 600,
              letterSpacing: "-0.01em",
              marginBottom: 8,
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <span>Noor Guide</span>
            <span style={{ color: "#D4A574", fontSize: 28 }}>نور</span>
          </div>

          <div
            style={{
              fontSize: 88,
              color: "#1A1A2E",
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: "-0.025em",
              maxWidth: 920,
            }}
          >
            Learn Islam,
            <br />
            <span style={{ color: "#2D6A4F" }}>Step by Step.</span>
          </div>

          <div
            style={{
              fontSize: 30,
              color: "#6B7280",
              marginTop: 32,
              maxWidth: 800,
              lineHeight: 1.4,
            }}
          >
            A free guide for new Muslims, backed by authentic sources from the Quran and Sunnah.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: 32,
            borderTop: "2px solid #D4A574",
            color: "#6B7280",
            fontSize: 22,
          }}
        >
          <span>Aqeedah, prayer, Quran, daily duas</span>
          <span style={{ color: "#2D6A4F", fontWeight: 600 }}>noorguide.app</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
