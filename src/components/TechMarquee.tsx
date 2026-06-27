import {
  Box,
  Braces,
  Brush,
  Cpu,
  Database,
  GitBranch,
  Github,
  ScanSearch,
  Server,
  Terminal,
  Waves,
} from "lucide-react";
import { techStack } from "../data/profile";

function TechIcon({ tech }: { tech: string }) {
  switch (tech) {
    case "React":
      return (
        <span className="tech-icon tech-icon-react" aria-hidden="true">
          <span />
          <span />
          <span />
          <b />
        </span>
      );
    case "TypeScript":
      return <span className="tech-icon tech-icon-mark" aria-hidden="true">TS</span>;
    case "Vue":
      return <span className="tech-icon tech-icon-vue" aria-hidden="true" />;
    case "Django":
      return <Server className="tech-icon-svg" size={18} aria-hidden="true" />;
    case "Python":
      return <span className="tech-icon tech-icon-mark tech-icon-python" aria-hidden="true">Py</span>;
    case "C":
      return <span className="tech-icon tech-icon-mark tech-icon-c" aria-hidden="true">C</span>;
    case "STM32":
      return <Cpu className="tech-icon-svg" size={18} aria-hidden="true" />;
    case "Linux":
      return <Terminal className="tech-icon-svg" size={18} aria-hidden="true" />;
    case "Git":
      return <GitBranch className="tech-icon-svg" size={18} aria-hidden="true" />;
    case "Three.js":
      return <Box className="tech-icon-svg" size={18} aria-hidden="true" />;
    case "Canvas":
      return <Brush className="tech-icon-svg" size={18} aria-hidden="true" />;
    case "Tailwind CSS":
      return <Waves className="tech-icon-svg" size={18} aria-hidden="true" />;
    case "Framer Motion":
      return <span className="tech-icon tech-icon-framer" aria-hidden="true"><span /><span /></span>;
    case "YOLOv7":
      return <ScanSearch className="tech-icon-svg" size={18} aria-hidden="true" />;
    case "SQLite":
      return <Database className="tech-icon-svg" size={18} aria-hidden="true" />;
    case "GitHub Pages":
      return <Github className="tech-icon-svg" size={18} aria-hidden="true" />;
    default:
      return <Braces className="tech-icon-svg" size={18} aria-hidden="true" />;
  }
}

export default function TechMarquee() {
  const repeated = [...techStack, ...techStack];

  return (
    <section className="relative py-10" aria-label="Technology stack">
      <div className="section-shell">
        <div className="mb-5 flex items-center gap-3">
          <span className="h-px w-8 bg-cyan-400/60" />
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            Tech Stack I Work With
          </p>
        </div>
      </div>
      <div className="tech-marquee">
        <div className="tech-marquee-track">
          {repeated.map((tech, index) => (
            <span key={`${tech}-${index}`} className="tech-pill">
              <TechIcon tech={tech} />
              {tech}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
