import type { Project } from "@/content/projects";
import { contourRings, hashString } from "@/lib/contours";

/**
 * Generated terrain artwork for a project, tinted with its accent colour.
 * Rings breathe slowly; parent `.group:hover` speeds the spin up.
 */
export function ContourArt({ project, className = "" }: { project: Project; className?: string }) {
  const seed = hashString(project.slug);
  const px = 220 + (seed % 160);
  const py = 160 + ((seed >> 8) % 80);
  const rings = contourRings(
    [
      { x: px, y: py, rings: 20, step: 13, start: 6 },
      { x: 600 - px * 0.5, y: 420 - py * 0.4, rings: 12, step: 15 },
    ],
    seed,
  );
  return (
    <div className={`relative overflow-hidden ${className}`} style={{ background: project.color }}>
      <svg viewBox="0 0 600 450" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden>
        <g
          className="origin-center transition-transform duration-[1.6s] ease-[cubic-bezier(.2,.7,.2,1)] group-hover:rotate-[14deg] group-hover:scale-[1.18]"
          style={{ transformOrigin: `${px}px ${py}px` }}
          fill="none"
          stroke="#0d0e0b"
        >
          {rings.map((r, i) => (
            <path key={i} d={r.d} strokeWidth={r.major ? 2.2 : 1} strokeOpacity={r.major ? 0.85 : 0.45} />
          ))}
        </g>
        <g transform={`translate(${px} ${py})`}>
          <circle r="7" fill="#0d0e0b" />
          <circle r="16" fill="none" stroke="#0d0e0b" strokeWidth="1.5">
            <animate attributeName="r" values="8;30;8" dur="2.8s" repeatCount="indefinite" />
            <animate attributeName="stroke-opacity" values="1;0;1" dur="2.8s" repeatCount="indefinite" />
          </circle>
        </g>
      </svg>
      <span className="absolute left-4 top-4 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-bg">
        {project.code}
      </span>
    </div>
  );
}
