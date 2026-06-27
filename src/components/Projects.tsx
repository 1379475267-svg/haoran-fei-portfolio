import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Github } from "lucide-react";
import { useMemo, useState } from "react";
import {
  projectCategories,
  projects,
  type Project,
} from "../data/profile";
import ProjectCover from "./ProjectCover";
import SectionHeader from "./SectionHeader";

type Filter = (typeof projectCategories)[number];

function ProjectCard({ project }: { project: Project }) {
  const openProject = () => {
    window.open(project.demo, "_blank", "noopener,noreferrer");
  };

  return (
    <motion.article
      role="link"
      tabIndex={0}
      aria-label={`Open ${project.title} project`}
      layout
      initial={{ opacity: 0, scale: 0.97, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: 12 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      onClick={openProject}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openProject();
        }
      }}
      className={`project-card-v2 group ${project.featured ? "project-featured" : ""}`}
    >
      <ProjectCover type={project.coverType} featured={project.featured} />
      <div className="project-copy">
        <div className="flex items-center justify-between gap-3">
          <span className="project-category">{project.category}</span>
          <span className="text-[10px] tracking-[0.18em] text-slate-600">{project.id.toUpperCase()}</span>
        </div>
        <h3 className="mt-5 text-2xl font-semibold tracking-tight text-slate-100">{project.title}</h3>
        <p className="mt-2 text-sm font-medium leading-6 text-cyan-100/70">{project.tagline}</p>
        <p className="mt-4 flex-1 text-sm leading-7 text-slate-400">
          {project.featured ? project.longDescription : project.description}
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {project.tech.map((tech) => (
            <span key={tech} className="tag-pill project-tech">{tech}</span>
          ))}
        </div>
        <div className="mt-7 flex items-center gap-3 border-t border-white/8 pt-5">
          <a
            href={project.demo}
            target="_blank"
            rel="noreferrer"
            className="project-link"
            onClick={(event) => event.stopPropagation()}
          >
            View Details <ArrowUpRight size={14} />
          </a>
          <a
            href={project.github}
            target="_blank"
            rel="noreferrer"
            className="project-link subtle"
            aria-label={`${project.title} GitHub`}
            onClick={(event) => event.stopPropagation()}
          >
            <Github size={15} /> GitHub
          </a>
        </div>
      </div>
    </motion.article>
  );
}

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState<Filter>("All");
  const filteredProjects = useMemo(
    () =>
      activeFilter === "All"
        ? projects
        : projects.filter((project) => project.category === activeFilter),
    [activeFilter],
  );

  return (
    <section id="projects" className="section-space section-divider relative">
      <div className="section-shell">
        <div className="flex flex-col justify-between gap-8 xl:flex-row xl:items-end">
          <SectionHeader
            eyebrow="02 / SELECTED WORK"
            title="Work with shape, not noise."
            description="A tighter view of projects across music tools, embedded practice, data learning and visual experiments."
          />
          <div className="project-filters" aria-label="Filter projects">
            {projectCategories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveFilter(category)}
                className={activeFilter === category ? "is-active" : ""}
                aria-pressed={activeFilter === category}
              >
                {activeFilter === category && (
                  <motion.span
                    layoutId="active-filter"
                    className="filter-active-bg"
                    transition={{ type: "spring", stiffness: 350, damping: 28 }}
                  />
                )}
                <span className="relative z-10">{category}</span>
              </button>
            ))}
          </div>
        </div>

        <motion.div layout className="projects-bento mt-12">
          <AnimatePresence>
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
