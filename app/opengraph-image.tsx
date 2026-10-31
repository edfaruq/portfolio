import { ImageResponse } from "next/og";
import { profile } from "@/content/profile";
import { contourRings } from "@/lib/contours";

export const alt = `${profile.name}, ${profile.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  const rings = contourRings(
    [
      { x: 900, y: 280, rings: 20, step: 18, start: 10 },
      { x: 150, y: 620, rings: 10, step: 22 },
    ],
    20220801,
  );
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><g fill="none" stroke="#d4ff3a">${rings
    .map((r) => `<path d="${r.d}" stroke-width="${r.major ? 2 : 1}" stroke-opacity="${r.major ? 0.45 : 0.18}"/>`)
    .join("")}</g><path d="M900 266L911 286H889Z" fill="none" stroke="#ff5b1f" stroke-width="3"/></svg>`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#0d0e0b",
          position: "relative",
          color: "#f1ece0",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`data:image/svg+xml;utf8,${encodeURIComponent(svg)}`}
          width={1200}
          height={630}
          alt=""
          style={{ position: "absolute", top: 0, left: 0 }}
        />
        <div style={{ display: "flex", flexDirection: "column", padding: "72px 80px", width: "100%" }}>
          <div style={{ fontSize: 22, letterSpacing: 4, color: "#a7a294", textTransform: "uppercase" }}>
            Full-Stack Web Developer · Semarang – Jakarta
          </div>
          <div style={{ fontSize: 88, fontWeight: 600, lineHeight: 1.02, marginTop: 28, display: "flex", flexDirection: "column" }}>
            <span>Muhammad Anshar</span>
            <span>
              Al Faruq<span style={{ color: "#ff5b1f" }}>.</span>
            </span>
          </div>
          <div style={{ fontSize: 28, color: "#d4ff3a", marginTop: 28, maxWidth: 760, lineHeight: 1.35 }}>
            WebGIS hazard mapping · Trilingual mining platforms · Energy-sector security dashboard
          </div>
          <div
            style={{
              marginTop: "auto",
              display: "flex",
              border: "2px solid #f1ece0",
              fontSize: 18,
              width: 640,
              background: "rgba(13,14,11,0.85)",
            }}
          >
            {[
              ["SHEET", "01 / 01"],
              ["DATUM", profile.coords],
              ["SURVEYOR", profile.shortName],
            ].map(([k, v]) => (
              <div key={k} style={{ display: "flex", flexDirection: "column", padding: "10px 16px", flex: 1, borderRight: "1px solid #3a3b33" }}>
                <span style={{ color: "#a7a294", fontSize: 14, letterSpacing: 2 }}>{k}</span>
                <span>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
