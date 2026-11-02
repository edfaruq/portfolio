/**
 * One-off: turns real elevation data around each project's location into contour paths.
 *
 * Source: AWS Terrain Tiles (Terrarium PNG, SRTM-based, public). Output goes to
 * content/terrain/<slug>.json and is committed, so builds never hit the network.
 *
 *   npm run terrain
 */
import { contours } from "d3-contour";
import { mkdir, writeFile } from "node:fs/promises";
import { PNG } from "pngjs";

// Keep in step with `place` in content/projects.ts.
const SITES = [
  { slug: "semarang-hazard-webgis", lat: -6.985, lon: 110.39 },
  { slug: "cidata-mining-platform", lat: -6.2917, lon: 106.8199 },
  { slug: "pertagas-security-dashboard", lat: -6.1772, lon: 106.8312 },
  // Same office as Cidata: framed wider and turned so the two maps don't look identical.
  { slug: "kristalin-corporate-site", lat: -6.2917, lon: 106.8199, rotate: 90, km: 4.2 },
  { slug: "b2b-exporter-ecommerce", lat: -7.0505, lon: 110.4384 },
];

const Z = 14;
const VW = 600, VH = 450; // ContourArt viewBox
const PAD = 0.18; // extra terrain around the frame, so hover rotation never shows bare corners
const GW = 260, GH = 195; // sampling grid over the padded frame
const LEVELS = 22, MAJOR = 5;

const tiles = new Map();
function tile(x, y) {
  // Cache the promise, not the result, so concurrent samples share one download per tile.
  const key = `${x}/${y}`;
  if (!tiles.has(key))
    tiles.set(
      key,
      fetch(`https://s3.amazonaws.com/elevation-tiles-prod/terrarium/${Z}/${x}/${y}.png`).then(async (res) => {
        if (!res.ok) throw new Error(`tile ${key}: ${res.status}`);
        return PNG.sync.read(Buffer.from(await res.arrayBuffer()));
      }),
    );
  return tiles.get(key);
}

const n = 2 ** Z;
const toPx = (lat, lon) => {
  const r = (lat * Math.PI) / 180;
  return [((lon + 180) / 360) * n * 256, ((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2) * n * 256];
};

async function elevationAt(px, py) {
  const t = await tile(Math.floor(px / 256), Math.floor(py / 256));
  const i = ((Math.floor(py) % 256) * 256 + (Math.floor(px) % 256)) * 4;
  return t.data[i] * 256 + t.data[i + 1] + t.data[i + 2] / 256 - 32768;
}

async function sample(px, py) {
  // Bilinear, so the upsampled 30 m data doesn't step.
  const x0 = Math.floor(px), y0 = Math.floor(py), fx = px - x0, fy = py - y0;
  const [a, b, c, d] = await Promise.all([elevationAt(x0, y0), elevationAt(x0 + 1, y0), elevationAt(x0, y0 + 1), elevationAt(x0 + 1, y0 + 1)]);
  return a * (1 - fx) * (1 - fy) + b * fx * (1 - fy) + c * (1 - fx) * fy + d * fx * fy;
}

function blur(v, w, h, r) {
  const out = new Float64Array(v.length);
  const pass = (src, dst, dx, dy) => {
    for (let y = 0; y < h; y++)
      for (let x = 0; x < w; x++) {
        let s = 0, c = 0;
        for (let k = -r; k <= r; k++) {
          const xx = x + k * dx, yy = y + k * dy;
          if (xx < 0 || yy < 0 || xx >= w || yy >= h) continue;
          s += src[yy * w + xx]; c++;
        }
        dst[y * w + x] = s / c;
      }
  };
  for (let i = 0; i < 2; i++) {
    pass(v, out, 1, 0);
    pass(out, v, 0, 1);
  }
  return v;
}

const length = (l) => l.reduce((s, p, i) => (i ? s + Math.hypot(p[0] - l[i - 1][0], p[1] - l[i - 1][1]) : 0), 0);

/** Douglas–Peucker. */
function simplify(pts, tol) {
  if (pts.length < 3) return pts;
  const [a, b] = [pts[0], pts[pts.length - 1]];
  const len = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
  let max = 0, idx = 0;
  for (let i = 1; i < pts.length - 1; i++) {
    const p = pts[i];
    const dist = len === 1 && a[0] === b[0] && a[1] === b[1]
      ? Math.hypot(p[0] - a[0], p[1] - a[1])
      : Math.abs((b[0] - a[0]) * (a[1] - p[1]) - (a[0] - p[0]) * (b[1] - a[1])) / len;
    if (dist > max) { max = dist; idx = i; }
  }
  if (max <= tol) return [a, b];
  return [...simplify(pts.slice(0, idx + 1), tol).slice(0, -1), ...simplify(pts.slice(idx), tol)];
}

function percentile(v, p) {
  const s = [...v].sort((a, b) => a - b);
  return s[Math.floor((s.length - 1) * p)];
}

async function build({ slug, lat, lon, rotate = 0, km = 3 }) {
  const [cx, cy] = toPx(lat, lon);
  const mPerPx = (40075016.686 * Math.cos((lat * Math.PI) / 180)) / (n * 256);
  const halfW = ((km * 1000) / mPerPx / 2) * (1 + PAD * 2);
  const halfH = halfW * (VH / VW);
  const rot = (rotate * Math.PI) / 180;

  const grid = new Float64Array(GW * GH);
  await Promise.all(
    Array.from({ length: GW * GH }, async (_, i) => {
      const u = ((i % GW) / (GW - 1)) * 2 - 1, w = (Math.floor(i / GW) / (GH - 1)) * 2 - 1;
      const dx = u * halfW, dy = w * halfH;
      grid[i] = await sample(cx + dx * Math.cos(rot) - dy * Math.sin(rot), cy + dx * Math.sin(rot) + dy * Math.cos(rot));
    }),
  );
  // Flat city ground is mostly building noise in SRTM, so smooth it harder than hills.
  const relief = percentile(grid, 0.98) - percentile(grid, 0.02);
  blur(grid, GW, GH, relief < 80 ? 9 : 4);

  const lo = percentile(grid, 0.02), hi = percentile(grid, 0.98);
  const interval = (hi - lo) / LEVELS;
  const thresholds = Array.from({ length: LEVELS }, (_, k) => lo + interval * (k + 0.5));

  // Grid coords → viewBox coords, with the padding spilling outside 0..600 × 0..450.
  const sx = (VW * (1 + PAD * 2)) / (GW - 1), sy = (VH * (1 + PAD * 2)) / (GH - 1);
  const ox = -VW * PAD, oy = -VH * PAD;
  const onEdge = ([x, y]) => x <= 0.01 || y <= 0.01 || x >= GW - 1.01 || y >= GH - 1.01;
  const f = (v) => Math.round(v * 10) / 10;

  const paths = contours().size([GW, GH]).thresholds(thresholds)(grid).map((c, k) => {
    // Split each ring into polylines, dropping the segments d3 adds along the grid border
    // (they aren't real contour lines), then simplify and skip tiny blobs.
    const lines = [];
    for (const poly of c.coordinates)
      for (const ring of poly) {
        let cur = [];
        for (let i = 0; i < ring.length; i++) {
          const p = ring[i];
          if (onEdge(p) && (i === 0 || onEdge(ring[i - 1]))) {
            if (cur.length > 1) lines.push(cur);
            cur = [];
            continue;
          }
          cur.push([ox + p[0] * sx, oy + p[1] * sy]);
        }
        if (cur.length > 1) lines.push(cur);
      }
    const d = lines
      .map((l) => simplify(l, 0.9))
      .filter((l) => length(l) > 40)
      .map((l) => l.map(([x, y], i) => `${i ? "L" : "M"}${f(x)} ${f(y)}`).join(""))
      .join("");
    return { d, major: (k + 1) % MAJOR === 0 };
  }).filter((p) => p.d);

  const data = { lat, lon, min: Math.round(Math.min(...grid)), max: Math.round(Math.max(...grid)), interval: Math.round(interval * 10) / 10, paths };
  await writeFile(`content/terrain/${slug}.json`, JSON.stringify(data));
  console.log(slug, `${data.min}–${data.max} m`, `every ${data.interval} m`, `${paths.length} levels`, `${(JSON.stringify(data).length / 1024).toFixed(1)} KB`);
}

await mkdir("content/terrain", { recursive: true });
for (const s of SITES) await build(s);
