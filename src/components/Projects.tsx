import { ArrowUpRight, Github } from "lucide-react";
import { projects } from "../data/profile";
import Reveal from "./Reveal";
import SectionHeader from "./SectionHeader";

export default function Projects() {
  const [featured, ...projectIndex] = projects;

  return (
    <section id="projects" className="soft-section soft-projects">
      <div className="soft-shell">
        <Reveal>
          <SectionHeader
            label="Selected work"
            title="A drone stack first. Everything else around it."
            description="The newest work is a real autonomous-flight engineering archive. The rest traces the tools, interfaces, and music systems I build alongside it."
          />

          <article className="soft-featured-project">
            <figure className="soft-featured-media">
              <picture>
                {featured.coverPoster ? (
                  <source media="(prefers-reduced-motion: reduce)" srcSet={featured.coverPoster} />
                ) : null}
                <img
                  src={featured.coverImage}
                  alt="Autonomous drone navigation test from the Nonconvex Alpha project"
                  width="960"
                  height="540"
                  loading="lazy"
                  decoding="async"
                />
              </picture>
              <figcaption>{featured.period}</figcaption>
            </figure>

            <div className="soft-featured-copy">
              <div className="soft-project-meta">
                <span>{featured.category}</span>
                <span>{featured.status}</span>
              </div>
              <h3>{featured.title}</h3>
              <p className="soft-project-tagline">{featured.tagline}</p>
              <p className="soft-project-description">{featured.longDescription}</p>

              {featured.highlights ? (
                <dl className="soft-project-specs">
                  {featured.highlights.map((highlight) => (
                    <div key={highlight.label}>
                      <dt>{highlight.label}</dt>
                      <dd>{highlight.value}</dd>
                    </div>
                  ))}
                </dl>
              ) : null}

              <div className="soft-project-actions">
                <a href={featured.demo} target="_blank" rel="noreferrer" className="soft-action">
                  <span className="soft-action-icon" aria-hidden="true">
                    <ArrowUpRight size={16} />
                  </span>
                  {featured.demoLabel}
                </a>
                <a href={featured.github} target="_blank" rel="noreferrer" className="soft-text-link">
                  <Github size={16} aria-hidden="true" />
                  GitHub
                </a>
              </div>
            </div>
          </article>
        </Reveal>

        <div className="soft-project-index">
          {projectIndex.map((project) => (
            <a
              key={project.id}
              href={project.github}
              target="_blank"
              rel="noreferrer"
              className="soft-project-row"
            >
              <span className="soft-project-row-category">{project.category}</span>
              <span className="soft-project-row-main">
                <strong>{project.title}</strong>
                <small>{project.description}</small>
              </span>
              <span className="soft-project-row-tech">{project.tech.slice(0, 2).join(" / ")}</span>
              <ArrowUpRight size={19} aria-hidden="true" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
