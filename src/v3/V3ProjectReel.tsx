import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import type { Variants } from "framer-motion";
import { useRef } from "react";
import ProjectCover from "../components/ProjectCover";
import { projects } from "../data/profile";
import { getProjectLanguage, useV3Language } from "./V3Language";
import V3ChapterStrike from "./V3ChapterStrike";

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
  const sectionInView = useInView(sectionRef, { amount: 0.05 });
  const { language, t } = useV3Language();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const { scrollYProgress: arrivalScrollProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "start start"],
  });
  const smoothedArrivalProgress = useSpring(arrivalScrollProgress, {
    stiffness: 170,
    damping: 30,
    mass: 0.3,
  });
  const rowOneX = useTransform(scrollYProgress, [0, 1], ["-7%", "-29%"]);
  const rowTwoX = useTransform(scrollYProgress, [0, 1], ["-30%", "-6%"]);
  const headingOpacity = useTransform(smoothedArrivalProgress, [0, 0.18, 0.72], [0, 0.08, 1]);
  const headingY = useTransform(smoothedArrivalProgress, [0, 0.72], [44, 0]);
  const rowsOpacity = useTransform(smoothedArrivalProgress, [0, 0.24, 0.86], [0, 0.06, 1]);
  const rowsY = useTransform(smoothedArrivalProgress, [0, 0.86], [68, 0]);
  const rowsScale = useTransform(smoothedArrivalProgress, [0, 0.86], [0.985, 1]);

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
  const staticRow = projects.map((project) => ({ project, duplicate: false }));

  const renderTile = (
    item: { project: (typeof projects)[number]; duplicate: boolean },
    index: number,
    row: number,
  ) => {
    const { project, duplicate } = item;
    const localized = getProjectLanguage(project, language);
    const title = displayTitle(project.id, project.title);

    const content = (
      <>
        <ProjectCover
          type={project.coverType}
          image={project.coverPoster}
          title={title}
          label={localized.coverLabel}
          language={language}
        />
        <span>{String((index % projects.length) + 1).padStart(2, "0")}</span>
        <strong>{title}</strong>
      </>
    );

    if (duplicate) {
      return (
        <div
          className="v3-reel-tile is-duplicate"
          key={`${row}-${project.id}-${index}`}
          aria-hidden="true"
        >
          {content}
        </div>
      );
    }

    const content = (
      <>
        <ProjectCover
          type={project.coverType}
          image={project.coverPoster}
          title={title}
          label={localized.coverLabel}
          language={language}
        />
        <span>{String((index % projects.length) + 1).padStart(2, "0")}</span>
        <strong>{title}</strong>
      </>
    );

    if (duplicate) {
      return (
        <div
          className="v3-reel-tile is-duplicate"
          key={`${row}-${project.id}-${index}`}
          aria-hidden="true"
        >
          {content}
        </div>
      );
    }

    return (
      <a
        className="v3-reel-tile"
        data-reel-project={project.id}
        href={project.github}
        target="_blank"
        rel="noreferrer"
        key={`${row}-${project.id}-${index}`}
        aria-label={`${t.reel.open} ${title}${
          language === "zh" ? "（新标签页打开）" : ", opens in a new tab"
        }`}
        onFocus={(event) => {
          if (!noSpatialMotion) return;
          const tile = event.currentTarget;
          const shell = tile.closest<HTMLElement>(".v3-reel-row-shell");
          if (!shell) return;

          window.requestAnimationFrame(() => {
            shell.scrollTo({
              left: Math.max(
                0,
                tile.offsetLeft - (shell.clientWidth - tile.offsetWidth) / 2,
              ),
              behavior: reduceMotion ? "auto" : "smooth",
            });
          });
        }}
      >
        {content}
      </a>
    );
  };

  return (
    <section
      className="v3-reel"
      id="project-reel"
      ref={sectionRef}
      aria-labelledby="reel-title"
      data-static={noSpatialMotion || undefined}
      data-in-view={sectionInView || undefined}
    >
      <V3ChapterStrike tone="light" />
      <motion.div
        className="v3-reel-arrival-heading"
        style={noSpatialMotion ? undefined : { opacity: headingOpacity, y: headingY }}
      >
        <motion.div
          className="v3-reel-heading"
          initial={false}
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={headingVariants}
        >
          <div className="v3-reel-heading-copy">
            <motion.p variants={eyebrowVariants}>{t.reel.eyebrow}</motion.p>
            <motion.h2 id="reel-title" variants={titleVariants}>
              <span>{t.reel.title}</span>
              <span className="v3-reel-title-outline" aria-hidden="true">
                {t.reel.title}
              </span>
            </motion.h2>
          </div>
        </motion.div>
      </motion.div>
      <motion.div
        className="v3-reel-arrival-rows"
        style={noSpatialMotion ? undefined : {
          opacity: rowsOpacity,
          y: rowsY,
          scale: rowsScale,
        }}
      >
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
            initial={false}
            whileInView="visible"
            viewport={{ once: true, amount: 0.18 }}
            variants={rowVariants}
          >
            <motion.div className="v3-reel-row" style={noSpatialMotion ? undefined : { x: rowOneX }}>
              {(noSpatialMotion ? staticRow : rowOne).map((project, index) => renderTile(project, index, 1))}
            </motion.div>
          </motion.div>
          {!noSpatialMotion ? (
            <motion.div
              className="v3-reel-row-shell v3-reel-row-shell-reverse"
              custom={-1}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.18 }}
              variants={rowVariants}
            >
              <motion.div className="v3-reel-row v3-reel-row-reverse" style={{ x: rowTwoX }}>
                {rowTwo.map((project, index) => renderTile(project, index, 2))}
              </motion.div>
            </motion.div>
          ) : null}
        </div>
      </motion.div>
    </section>
  );
}
