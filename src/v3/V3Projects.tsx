import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import ProjectCover from "../components/ProjectCover";
import { projects, type Project } from "../data/profile";
import {
  categoryLabel,
  getProjectLanguage,
  highlightLabel,
  useV3Language,
} from "./V3Language";

const selectedIds = [
  "nonconvex-alpha",
  "chordpilot",
  "interactive-particle-saturn",
  "fretboard-caged-lab",
  "gamememory",
];
const selectedProjects = selectedIds
  .map((id) => projects.find((project) => project.id === id))
  .filter((project): project is Project => Boolean(project));

const displayTitle = (project: Project) =>
  project.id === "nonconvex-alpha" ? "Nonconvex α / Drone Lab" : project.title;

interface ProjectCardProps {
  project: Project;
  index: number;
  total: number;
  staticLayout: boolean;
}

function ProjectCard({ project, index, total, staticLayout }: ProjectCardProps) {
  const { language, t } = useV3Language();
  const wrapRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end start"],
  });
  const targetScale = 1 - (total - 1 - index) * 0.015;
  const scale = useTransform(scrollYProgress, [0, 1], [1, targetScale]);
  const title = displayTitle(project);
  const isDrone = project.id === "nonconvex-alpha";
  const localized = getProjectLanguage(project, language);
  const details = project.highlights
    ? project.highlights.map((detail) => ({
        ...detail,
        label: language === "zh" ? (highlightLabel[detail.label] ?? detail.label) : detail.label,
      }))
    : project.tech.slice(0, 3).map((value, techIndex) => ({
        label: t.projects.detailLabels[techIndex],
        value,
      }));

  return (
    <div
      className="v3-project-card-wrap"
      ref={wrapRef}
      style={{ "--v3-card-offset": `${index * 1.45}rem` } as CSSProperties}
    >
      <motion.article
        className="v3-project-card"
        data-project={project.id}
        style={staticLayout ? undefined : { scale }}
      >
        <div className="v3-project-card-head">
          <span>{String(index + 1).padStart(2, "0")}</span>
          <div>
            <p>{categoryLabel[project.category][language]} / {isDrone ? t.projects.active : t.projects.personal}</p>
            <h3>{title}</h3>
          </div>
          <a
            href={project.github}
            target="_blank"
            rel="noreferrer"
            aria-label={`${t.projects.openAria}：${title}`}
          >
            {t.projects.open} <ArrowUpRight aria-hidden="true" />
          </a>
        </div>
        <div className="v3-project-card-body">
          <div className="v3-project-card-notes">
            <p>{localized.longDescription}</p>
            <dl>
              {details.map((detail) => (
                <div key={`${detail.label}-${detail.value}`}>
                  <dt>{detail.label}</dt>
                  <dd>{detail.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <a
            className="v3-project-card-visual"
            href={project.github}
            target="_blank"
            rel="noreferrer"
            aria-label={`${t.projects.openAria}：${title}`}
          >
            <ProjectCover
              type={project.coverType}
              featured={isDrone}
              image={project.coverPoster}
              videoWebm={project.coverVideoWebm}
              videoMp4={project.coverVideoMp4}
              title={title}
              label={localized.coverLabel}
              language={language}
            />
          </a>
        </div>
      </motion.article>
    </div>
  );
}

export default function V3Projects() {
  const reduceMotion = useReducedMotion();
  const { t } = useV3Language();
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 60rem)");
    const update = () => setCompact(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return (
    <section className="v3-projects" id="projects" aria-labelledby="projects-title">
      <div className="v3-projects-heading">
        <p className="v3-section-label">{t.projects.eyebrow}</p>
        <h2 id="projects-title">{t.projects.title}</h2>
        <p>{t.projects.intro}</p>
      </div>
      <div className="v3-project-stack">
        {selectedProjects.map((project, index) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={index}
            total={selectedProjects.length}
            staticLayout={Boolean(reduceMotion || compact)}
          />
        ))}
      </div>
    </section>
  );
}
