import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: 80, background: "#1B1526", color: "#fff", fontFamily: "sans-serif" }}>
        <div style={{ fontSize: 28, color: "#b3a8ff" }}>pdev-labs · systems developer, 16</div>
        <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.05, margin: "16px 0" }}>
          OS tools, firmware &amp; Python utilities.
        </div>
        <div style={{ fontSize: 30, color: "#b3abd0" }}>Linux-For-Android · pdev (.pl) · FluxMedia · ESP32</div>
      </div>
    ),
    { ...size }
  );
}
