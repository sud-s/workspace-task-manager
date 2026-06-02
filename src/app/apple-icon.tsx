import { ImageResponse } from "next/og"

export const size = { width: 180, height: 180 }
export const contentType = "image/png"

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#059669",
          borderRadius: 32,
          fontFamily: "Geist, sans-serif",
          fontWeight: 700,
          fontSize: 96,
          color: "white",
        }}
      >
        G
      </div>
    ),
    { ...size },
  )
}
