import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: "linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* shine overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 100%)",
            borderRadius: 8,
          }}
        />

        {/* < bracket */}
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ position: "absolute" }}
        >
          <path d="M6 16L11 11" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6 16L11 21" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M26 16L21 11" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M26 16L21 21" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M19 10L13 22" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
