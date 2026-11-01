export type Sector = "disaster" | "mining" | "energy" | "academic";

export const sectors: Record<Sector, { label: string; symbol: string }> = {
  disaster: { label: "Disaster mgmt.", symbol: "△" },
  mining: { label: "Mining", symbol: "⛏" },
  energy: { label: "Energy", symbol: "ϟ" },
  academic: { label: "Academic", symbol: "◇" },
};

export type Photo = { src: string; width: number; height: number; alt: string; caption: string };

export type Project = {
  slug: string;
  code: string; // survey-style site code, e.g. "SMG-01"
  color: string; // accent used for this project's visuals
  title: string;
  client: string;
  sector: Sector;
  role: string;
  period: string;
  place: { name: string; lon: number; lat: number };
  award?: string;
  featured: boolean;
  summary: string;
  context: string;
  built: string[];
  metrics: { value: string; label: string }[];
  stack: string[];
  link?: string;
  /** Photos shown as a draggable polaroid stack. */
  gallery?: { title: string; photos: Photo[] };
};

export const projects: Project[] = [
  {
    slug: "semarang-hazard-webgis",
    code: "SMG-01",
    color: "#ff5b1f",
    title: "Hazard-Mapping WebGIS for West Semarang",
    client: "KKN-T 35 KATANA · Universitas Diponegoro",
    sector: "disaster",
    role: "Developer & field surveyor",
    period: "2025",
    place: { name: "West Semarang", lon: 110.38, lat: -6.98 },
    award: "Best Program Award, Gelar Karya KKN UNDIP",
    featured: true,
    summary:
      "An interactive map of flood, landslide and critical-land hazards across 16 districts, built from fieldwork with local communities.",
    context:
      "During community service (KKN-T), our team surveyed hazard-prone areas in West Semarang together with residents. I turned that field data into an interactive WebGIS so local disaster-management teams can see risk zones, evacuation routes and shelters in one place.",
    built: [
      "Interactive Leaflet map with toggleable layers for flood zones, critical land, evacuation routes and shelters.",
      "Data collected through direct fieldwork with residents across 16 districts.",
      "Built with React / Next.js so it runs in a browser without special GIS software.",
    ],
    metrics: [
      { value: "16", label: "districts mapped" },
      { value: "30", label: "flood zones" },
      { value: "35", label: "critical-land areas" },
      { value: "17", label: "evacuation routes" },
      { value: "127", label: "shelters" },
    ],
    stack: ["Next.js", "React", "Leaflet"],
    link: "https://github.com/edfaruq/webgis-semarang-barat",
    gallery: {
      title: "KKN-T 35 KATANA",
      photos: [
        { src: "/images/gallery/kkn-award.jpg", width: 960, height: 1200, alt: "Three team members on stage at Gelar Karya KKN UNDIP holding the Best Program award board and a laptop showing the WebGIS", caption: "Best Program · Gelar Karya" },
        { src: "/images/gallery/kkn-field-team.jpg", width: 1280, height: 800, alt: "The KKN team outdoors holding framed hazard maps and printed posters", caption: "Maps, printed & delivered" },
        { src: "/images/gallery/kkn-kecamatan.jpg", width: 720, height: 900, alt: "Three team members in front of the Kantor Kecamatan Semarang Barat building", caption: "Kecamatan Semarang Barat" },
        { src: "/images/gallery/kkn-gelar-karya.jpg", width: 720, height: 900, alt: "A large crowd of KKN students celebrating in a hall with a certificate and the award board", caption: "The whole cohort, celebrating" },
      ],
    },
  },
  {
    slug: "cidata-mining-platform",
    code: "JKT-01",
    color: "#d4ff3a",
    title: "Trilingual Product & Company Platform",
    client: "PT Cidata Mining Servis",
    sector: "mining",
    role: "Full-Stack Web Developer",
    period: "Aug – Dec 2025",
    place: { name: "Jakarta", lon: 106.85, lat: -6.2 },
    featured: true,
    summary:
      "A production full-stack platform for a mining-services company, with a heavy-equipment catalog in Indonesian, English and Mandarin.",
    context:
      "The company needed one site to present its products, services, portfolio and company profile to clients who read different languages. I delivered it end to end on Laravel + Inertia + React.",
    built: [
      "15+ public pages covering products, portfolio, services and company profile.",
      "A 3-language i18n system (ID / EN / ZH) with 1,700+ translation keys per locale.",
      "A searchable catalog of 7 heavy-equipment models, each with localized specs, features and its own detail page.",
      "Site-wide search with 70+ keyword mappings and autocomplete suggestions.",
    ],
    metrics: [
      { value: "15+", label: "public pages" },
      { value: "3", label: "languages" },
      { value: "1,700+", label: "keys per locale" },
      { value: "7", label: "equipment models" },
      { value: "70+", label: "search keywords" },
    ],
    stack: ["Laravel", "Inertia.js", "React", "TypeScript"],
    link: "https://cidatamining.com/",
  },
  {
    slug: "pertagas-security-dashboard",
    code: "JKT-02",
    color: "#7c9cff",
    title: "Security Monitoring Dashboard",
    client: "PT Pertamina Gas (Pertagas)",
    sector: "energy",
    role: "General Support Intern",
    period: "Jan – Feb 2025",
    place: { name: "Jakarta", lon: 106.85, lat: -6.2 },
    featured: true,
    summary:
      "A Laravel dashboard that pulls alerts, SIEM, endpoint and XDR data from Sophos Central into one near real-time view.",
    context:
      "During my internship in the IT support team, I built an internal dashboard so security data from Sophos Central could be monitored, filtered and reported from a single place, inside a corporate cybersecurity environment.",
    built: [
      "Integration with the Sophos Central API across 4 sources: alerts, SIEM, endpoint and XDR.",
      "5 admin modules: analytics, endpoint monitoring, alert tracking, reporting and user access.",
      "Alerts grouped into 3 severity levels; access split across 2 roles.",
      "Near real-time metrics with a 5-minute cache and up to 3 API retries, plus PDF/CSV exports.",
    ],
    metrics: [
      { value: "4", label: "API data sources" },
      { value: "5", label: "admin modules" },
      { value: "3", label: "severity levels" },
      { value: "5 min", label: "cache window" },
      { value: "2", label: "access roles" },
    ],
    stack: ["Laravel", "Sophos Central API", "PDF/CSV export"],
    gallery: {
      title: "Pertagas & Internship",
      photos: [
        { src: "/images/gallery/pertagas-team.jpg", width: 1280, height: 960, alt: "Faruq with the Pertamina Gas team giving thumbs up in front of the company's establishment wall", caption: "The team · Pertamina Gas" },
        { src: "/images/gallery/pertagas-interns.jpg", width: 960, height: 1200, alt: "Four interns with MAGANG lanyards posing playfully in front of the Pertamina logo", caption: "Magang crew" },
        { src: "/images/gallery/pertagas-coffee.jpg", width: 720, height: 900, alt: "A group selfie of interns working on laptops at a long café table", caption: "Laptops out, coffee in" },
        { src: "/images/gallery/pertagas-after-hours.jpg", width: 960, height: 1200, alt: "Faruq and two friends pulling funny faces at night", caption: "After hours" },
      ],
    },
  },
  {
    slug: "kristalin-corporate-site",
    code: "JKT-03",
    color: "#ffc83a",
    title: "Trilingual Corporate Website",
    client: "PT Kristalin Ekalestari",
    sector: "mining",
    role: "Full-Stack Web Developer",
    period: "Jul – Dec 2025",
    place: { name: "Jakarta", lon: 106.85, lat: -6.2 },
    featured: false,
    summary:
      "An 18-page corporate profile site in Indonesian, English and Mandarin for employees and external clients.",
    context:
      "A mining company needed a corporate site serving both internal employees and external clients across three languages, with a news section the team could keep updating.",
    built: [
      "18 public pages built on Laravel + Inertia.js.",
      "Structured content across 16 modules, including a news section of 38 articles in 10 categories.",
      "Site-wide search that scans page content in all 3 languages and returns relevant snippets, 10 results per page.",
    ],
    metrics: [
      { value: "18", label: "public pages" },
      { value: "16", label: "content modules" },
      { value: "38", label: "news articles" },
      { value: "3", label: "languages searched" },
    ],
    stack: ["Laravel", "Inertia.js"],
    link: "https://kristalin.co.id/",
  },
  {
    slug: "b2b-exporter-ecommerce",
    code: "SMG-02",
    color: "#ff8fd8",
    title: "B2B Exporter E-Commerce (Thesis)",
    client: "Case study: PT Telaga Cipta",
    sector: "academic",
    role: "Undergraduate thesis",
    period: "2026",
    place: { name: "Semarang", lon: 110.44, lat: -7.05 },
    featured: false,
    summary:
      "Design and development of a web-based B2B e-commerce application for an exporter, following the ICONIX process.",
    context:
      "My undergraduate thesis at Diponegoro University: modelling and building a B2B ordering platform for an exporting company, using ICONIX to trace requirements from use cases through robustness and sequence diagrams to code.",
    built: [
      "Requirements and domain modelled with the ICONIX process (use case → robustness → sequence).",
      "Web-based B2B e-commerce application for PT Telaga Cipta as the case study.",
    ],
    metrics: [{ value: "ICONIX", label: "design process" }],
    stack: ["Web application", "ICONIX / UML"],
    link: "https://github.com/edfaruq/b2b-telagacipta",
    gallery: {
      title: "Thesis Defense & Graduation",
      photos: [
        { src: "/images/gallery/thesis-graduation.jpg", width: 960, height: 1200, alt: "Faruq on campus wearing a maroon graduation sash reading M. Anshar Al Faruq, S.Kom., holding a bouquet", caption: "M. Anshar Al Faruq, S.Kom." },
        { src: "/images/gallery/thesis-gown.jpg", width: 960, height: 1200, alt: "Faruq in a black graduation gown with a blue hood, leaning on a railing and smiling", caption: "Graduation Day · Universitas Diponegoro" },
        { src: "/images/gallery/thesis-class.jpg", width: 960, height: 1200, alt: "Faruq and six classmates in graduation caps and gowns pulling playful faces", caption: "Class of 2026, caps on" },
      ],
    },
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
