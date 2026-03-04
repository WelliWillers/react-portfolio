import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          borderRadius: 40,
          background: "linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* shine */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 60%)",
          }}
        />

        <svg
          width="180"
          height="180"
          viewBox="0 0 180 180"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ position: "absolute" }}
        >
          {/* Left < */}
          <path d="M34 90L62 62" stroke="white" strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M34 90L62 118" stroke="white" strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" />
          {/* Right > */}
          <path d="M146 90L118 62" stroke="white" strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M146 90L118 118" stroke="white" strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" />
          {/* Slash / */}
          <path d="M108 56L72 124" stroke="white" strokeWidth="13" strokeLinecap="round" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
