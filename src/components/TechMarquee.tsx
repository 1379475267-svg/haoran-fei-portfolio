import { techStack } from "../data/profile";

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
              <i />
              {tech}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
