import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import type { Variants } from "framer-motion";
import { useRef } from "react";
import ProjectCover from "../components/ProjectCover";
import { projects } from "../data/profile";
import { getProjectLanguage, useV3Language } from "./V3Language";

const displayTitle = (id: string, title: string) =>
  id === "nonconvex-alpha" ? "Nonconvex α / Drone Lab" : title;

const quietEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

const headingVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.06,
      staggerChildren: 0.1,
    },
  },
};

const eyebrowVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: quietEase },
  },
};

const titleVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
    clipPath: "inset(0 0 100% 0)",
  },
  visible: {
    opacity: 1,
    y: 0,
    clipPath: "inset(0 0 0% 0)",
    transition: { duration: 0.72, ease: quietEase },
  },
};

const rowVariants: Variants = {
  hidden: (direction: number) => ({
    opacity: 0,
    y: direction * 16,
  }),
  visible: (direction: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.72,
      delay: direction < 0 ? 0.1 : 0,
      ease: quietEase,
    },
  }),
};

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
  const rowOneProjects = projects.slice(0, 5);
  const rowTwoProjects = projects.slice(3);
  const rowOne = [
    ...rowOneProjects.map((project) => ({ project, duplicate: false })),
    ...rowOneProjects.map((project) => ({ project, duplicate: true })),
  ];
  const rowTwo = [
    ...rowTwoProjects.map((project, index) => ({ project, duplicate: index < 2 })),
    ...rowTwoProjects.map((project) => ({ project, duplicate: true })),
  ];

  const renderTile = (
    item: { project: (typeof projects)[number]; duplicate: boolean },
    index: number,
    row: number,
  ) => {
    const { project, duplicate } = item;
    const localized = getProjectLanguage(project, language);
    const title = displayTitle(project.id, project.title);

    return (
      <a
        className="v3-reel-tile"
        href={project.github}
        target="_blank"
        rel="noreferrer"
        key={`${row}-${project.id}-${index}`}
        aria-hidden={duplicate || undefined}
        aria-label={duplicate ? undefined : `${t.reel.open} ${title}`}
        tabIndex={duplicate ? -1 : undefined}
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
      <motion.div
        className="v3-reel-heading"
        initial={noSpatialMotion ? false : "hidden"}
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        variants={headingVariants}
      >
        <motion.p variants={eyebrowVariants}>{t.reel.eyebrow}</motion.p>
        <motion.h2 id="reel-title" variants={titleVariants}>{t.reel.title}</motion.h2>
      </motion.div>
      <div className="v3-reel-rows">
        {!noSpatialMotion ? (
          <motion.span
            className="v3-reel-scanline"
            aria-hidden="true"
            initial={{ opacity: 0, x: "-55vw" }}
            whileInView={{ opacity: [0, 0.58, 0.2, 0], x: ["-55vw", "55vw"] }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 1.35, delay: 0.28, ease: quietEase }}
          />
        ) : null}
        <motion.div
          className="v3-reel-row-shell"
          custom={1}
          initial={noSpatialMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, amount: 0.18 }}
          variants={rowVariants}
        >
          <motion.div className="v3-reel-row" style={noSpatialMotion ? undefined : { x: rowOneX }}>
            {rowOne.map((project, index) => renderTile(project, index, 1))}
          </motion.div>
        </motion.div>
        <motion.div
          className="v3-reel-row-shell v3-reel-row-shell-reverse"
          custom={-1}
          initial={noSpatialMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, amount: 0.18 }}
          variants={rowVariants}
        >
          <motion.div className="v3-reel-row v3-reel-row-reverse" style={noSpatialMotion ? undefined : { x: rowTwoX }}>
            {rowTwo.map((project, index) => renderTile(project, index, 2))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
