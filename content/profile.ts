export const profile = {
  name: "Muhammad Anshar Al Faruq",
  shortName: "Ed Faruq",
  role: "Full-Stack Web Developer",
  roleTrilingual: ["Developer", "开发者", "Pengembang"],
  tagline:
    "I build multilingual platforms, monitoring dashboards and spatial data tools for mining, energy and disaster-management work.",
  intro:
    "Computer Science graduate from Diponegoro University. I've shipped production web platforms for two mining companies, a security monitoring dashboard for an energy company, and a hazard-mapping WebGIS built through fieldwork with local communities. I care about reliable, well-documented systems and interfaces that stay usable on any screen.",
  location: "Semarang – Jakarta, Indonesia",
  coords: "6.99°S 110.42°E",
  email: "14.alfaruq@gmail.com",
  links: {
    linkedin: "https://www.linkedin.com/in/edfaruq",
    github: "https://github.com/edfaruq",
  },
  cv: "/cv-muhammad-anshar-al-faruq.pdf",
} as const;

export const skills: { group: string; items: string[] }[] = [
  { group: "Backend", items: ["Laravel", "PHP", "REST API integration", "MySQL"] },
  { group: "Frontend", items: ["React", "Next.js", "TypeScript", "Inertia.js"] },
  { group: "Data & Spatial", items: ["Leaflet / WebGIS", "Python", "Reporting & PDF/CSV export"] },
  { group: "Practice", items: ["i18n (ID / EN / ZH)", "Site search", "Responsive UI", "ICONIX process"] },
];

export const education = {
  school: "Universitas Diponegoro",
  place: "Semarang",
  degree: "Bachelor of Computer Science",
  period: "Aug 2022 – Sep 2026",
  thesis:
    "Design and Development of a Web-Based B2B Exporter E-Commerce Application Using the ICONIX Process (case study: PT Telaga Cipta)",
};

export const certifications = [
  {
    title: "Alibaba Cloud Certified Associate: Cloud Computing",
    issuer: "Alibaba Cloud",
    year: "2024",
    pdf: "/certificates/alibaba-cloud-aca-cloud-computing.pdf",
  },
  {
    title: "Database Programming with SQL",
    issuer: "Oracle Academy",
    year: "2024",
    pdf: "/certificates/oracle-database-programming-with-sql.pdf",
  },
  { title: "Database Design", issuer: "Oracle Academy", year: "2023", pdf: "/certificates/oracle-database-design.pdf" },
];

export const organization = {
  name: "Himpunan Mahasiswa Informatika UNDIP (HMIF)",
  role: "Staff, Art & Sport Division (Seniora)",
  period: "Feb 2023 – Feb 2025",
  summary:
    "Organised performances and workshops for students in the arts, and mentored junior members of the division.",
  certificates: [
    { label: "2023 term", pdf: "/certificates/hmif-2023-seni-olahraga.pdf" },
    { label: "2024 term", pdf: "/certificates/hmif-2024-seni-olahraga.pdf" },
  ],
};

/** Career layers for the core-sample timeline, newest on top. */
export type Stratum = {
  period: string;
  title: string;
  org: string;
  kind: "work" | "intern" | "education" | "organization";
  note: string;
  href?: string;
};

export const strata: Stratum[] = [
  {
    period: "Aug – Dec 2025",
    title: "Full-Stack Web Developer",
    org: "PT Cidata Mining Servis",
    kind: "work",
    note: "Trilingual product & company platform, heavy-equipment catalog, site search.",
    href: "/projects/cidata-mining-platform",
  },
  {
    period: "Jul – Dec 2025",
    title: "Full-Stack Web Developer",
    org: "PT Kristalin Ekalestari",
    kind: "work",
    note: "18-page trilingual corporate site with a 16-module content system.",
    href: "/projects/kristalin-corporate-site",
  },
  {
    period: "Jan – Feb 2025",
    title: "General Support Intern",
    org: "PT Pertamina Gas (Pertagas)",
    kind: "intern",
    note: "Security monitoring dashboard on the Sophos Central API.",
    href: "/projects/pertagas-security-dashboard",
  },
  {
    period: "Feb 2023 – Feb 2025",
    title: "Staff, Seniora Division",
    org: "HMIF UNDIP",
    kind: "organization",
    note: "Arts programmes, workshops and mentoring for informatics students.",
  },
  {
    period: "Aug 2022 – Sep 2026",
    title: "B.Sc. Computer Science",
    org: "Universitas Diponegoro",
    kind: "education",
    note: "KKN-T Best Program Award for the hazard-mapping WebGIS.",
    href: "/about",
  },
];
