/**
 * Deterministic topographic contour generator.
 * Produces closed, smooth, irregular rings around "peaks" so the same seed
 * always renders the same terrain (safe for static prerendering).
 */

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function hashString(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

type Pt = [number, number];

/** Catmull-Rom → cubic Bézier for a closed loop. */
function smoothClosedPath(pts: Pt[]) {
  const n = pts.length;
  const f = (v: number) => v.toFixed(1);
  let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % n];
    const p3 = pts[(i + 2) % n];
    const c1: Pt = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2: Pt = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${f(c1[0])} ${f(c1[1])} ${f(c2[0])} ${f(c2[1])} ${f(p2[0])} ${f(p2[1])}`;
  }
  return d + "Z";
}

export type Peak = { x: number; y: number; rings: number; step: number; start?: number };

export type ContourRing = { d: string; index: number; major: boolean };

export function contourRings(peaks: Peak[], seed: number): ContourRing[] {
  const rand = mulberry32(seed);
  const out: ContourRing[] = [];
  const samples = 28;

  for (const peak of peaks) {
    // Per-peak harmonic "terrain" so rings share a coherent shape.
    const harmonics = Array.from({ length: 4 }, (_, k) => ({
      amp: (0.22 / (k + 1)) * (0.6 + rand()),
      freq: k + 2,
      phase: rand() * Math.PI * 2,
    }));
    const stretch = 0.75 + rand() * 0.6;
    const tilt = rand() * Math.PI;

    for (let r = 0; r < peak.rings; r++) {
      const radius = (peak.start ?? peak.step) + r * peak.step;
      const pts: Pt[] = [];
      for (let i = 0; i < samples; i++) {
        const a = (i / samples) * Math.PI * 2;
        let k = 1;
        for (const h of harmonics) {
          // Outer rings get slightly more irregular.
          k += h.amp * (1 + r * 0.05) * Math.sin(h.freq * a + h.phase + r * 0.12);
        }
        const rx = radius * k * stretch;
        const ry = radius * k;
        const x = rx * Math.cos(a);
        const y = ry * Math.sin(a);
        pts.push([
          peak.x + x * Math.cos(tilt) - y * Math.sin(tilt),
          peak.y + x * Math.sin(tilt) + y * Math.cos(tilt),
        ]);
      }
      out.push({ d: smoothClosedPath(pts), index: r, major: r % 5 === 4 });
    }
  }
  return out;
}

/* ---------- Map projection for the Java inset ---------- */

export const MAP = { w: 640, h: 220, lon0: 105.0, lon1: 114.8, lat0: -5.7, lat1: -8.9 };

export function project(lon: number, lat: number): Pt {
  const x = ((lon - MAP.lon0) / (MAP.lon1 - MAP.lon0)) * MAP.w;
  const y = ((lat - MAP.lat0) / (MAP.lat1 - MAP.lat0)) * MAP.h;
  return [x, y];
}

/** Simplified outline of Java (lon, lat), stylised for an inset map. */
const JAVA: Pt[] = [
  [105.22, -6.78], [105.6, -6.35], [105.85, -6.0], [106.1, -5.93], [106.5, -6.02],
  [106.85, -6.08], [107.2, -5.98], [107.6, -6.15], [108.0, -6.28], [108.32, -6.25],
  [108.6, -6.68], [109.0, -6.85], [109.55, -6.86], [110.1, -6.9], [110.42, -6.93],
  [110.7, -6.6], [110.9, -6.42], [111.2, -6.6], [111.7, -6.74], [112.2, -6.86],
  [112.65, -6.9], [112.8, -7.25], [113.3, -7.55], [113.9, -7.7], [114.42, -7.78],
  [114.6, -8.15], [114.45, -8.65], [113.9, -8.45], [113.3, -8.32], [112.6, -8.42],
  [111.9, -8.3], [111.2, -8.25], [110.5, -8.12], [109.8, -7.85], [109.3, -7.72],
  [108.7, -7.7], [108.1, -7.78], [107.6, -7.55], [107.0, -7.45], [106.45, -7.38],
  [106.05, -7.05], [105.6, -6.86],
];

export const javaPath = (() => {
  const pts = JAVA.map(([lon, lat]) => project(lon, lat));
  return smoothClosedPath(pts);
})();

/** Graticule lines every whole degree. */
export function graticule() {
  const lines: { d: string; label: string; axis: "lon" | "lat"; at: number }[] = [];
  for (let lon = 106; lon <= 114; lon += 2) {
    const [x] = project(lon, 0);
    lines.push({ d: `M${x} 0V${MAP.h}`, label: `${lon}°E`, axis: "lon", at: x });
  }
  for (let lat = -6; lat >= -8; lat -= 1) {
    const [, y] = project(0, lat);
    lines.push({ d: `M0 ${y}H${MAP.w}`, label: `${Math.abs(lat)}°S`, axis: "lat", at: y });
  }
  return lines;
}
