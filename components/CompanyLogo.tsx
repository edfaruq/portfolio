import Image from "next/image";
import type { Logo } from "@/content/projects";

/**
 * A company logo drawn in the surrounding text colour (CSS mask over `currentColor`), so it
 * matches the dark site and the coloured case-study headers from a single file.
 * With `reveal`, hovering the nearest `.group` swaps in the original full-colour logo.
 *
 * `area` keeps wide wordmarks and stacked marks visually balanced: the logo is sized to
 * roughly `area × area` square pixels whatever its aspect ratio.
 */
export function CompanyLogo({
  logo,
  name,
  area = 72,
  reveal = false,
  className = "",
}: {
  logo: Logo;
  name: string;
  area?: number;
  reveal?: boolean;
  className?: string;
}) {
  const aspect = logo.width / logo.height;
  const height = Math.round(area / Math.sqrt(aspect));
  const width = Math.round(height * aspect);
  const mask = `url(${logo.src})`;

  return (
    <span role="img" aria-label={name} className={`relative inline-block shrink-0 ${className}`} style={{ width, height }}>
      <span
        aria-hidden
        className={`absolute inset-0 bg-current transition-opacity duration-300 ${reveal ? "group-hover:opacity-0" : ""}`}
        style={{
          maskImage: mask,
          WebkitMaskImage: mask,
          maskSize: "contain",
          WebkitMaskSize: "contain",
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
          maskPosition: "center",
          WebkitMaskPosition: "center",
        }}
      />
      {reveal && (
        <Image
          src={logo.src}
          alt=""
          fill
          sizes={`${width}px`}
          className="object-contain opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
      )}
    </span>
  );
}
