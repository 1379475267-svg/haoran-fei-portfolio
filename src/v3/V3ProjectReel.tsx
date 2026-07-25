import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import ProjectCover from "../components/ProjectCover";
import { projects } from "../data/profile";
import { getProjectLanguage, useV3Language } from "./V3Language";

const displayTitle = (id: string, title: string) =>
  id === "nonconvex-alpha" ? "Nonconvex α / Drone Lab" : title;

export default function V3ProjectReel() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { language, t } = useV3Language();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const rowOneX = useTransform(scrollYProgress, [0, 1], ["-7%", "-29%"]);
  const rowTwoX = useTransform(scrollYProgress, [0, 1], ["-30%", "-6%"]);

  const noSpatialMotion = Boolean(reduceMotion);
  const rowOne = [...projects.slice(0, 5), ...projects.slice(0, 5)];
  const rowTwo = [...projects.slice(3), ...projects.slice(3)];

  const renderTile = (project: (typeof projects)[number], index: number, row: number) => {
    const localized = getProjectLanguage(project, language);
    const title = displayTitle(project.id, project.title);

    return (
      <a
        className="v3-reel-tile"
        href={project.github}
        target="_blank"
        rel="noreferrer"
        key={`${row}-${project.id}-${index}`}
        aria-label={`${t.reel.open} ${title}`}
      >
        <ProjectCover
          type={project.coverType}
          image={project.coverPoster}
          title={title}
          label={localized.coverLabel}
          language={language}
        />
        <span>{String((index % projects.length) + 1).padStart(2, "0")}</span>
        <strong>{title}</strong>
      </a>
    );
  };

  return (
    <section className="v3-reel" id="project-reel" ref={sectionRef} aria-labelledby="reel-title">
      <div className="v3-reel-heading">
        <p>{t.reel.eyebrow}</p>
        <h2 id="reel-title">{t.reel.title}</h2>
      </div>
      <div className="v3-reel-rows">
        <motion.div className="v3-reel-row" style={noSpatialMotion ? undefined : { x: rowOneX }}>
          {rowOne.map((project, index) => renderTile(project, index, 1))}
        </motion.div>
        <motion.div className="v3-reel-row v3-reel-row-reverse" style={noSpatialMotion ? undefined : { x: rowTwoX }}>
          {rowTwo.map((project, index) => renderTile(project, index, 2))}
        </motion.div>
      </div>
    </section>
  );
}
