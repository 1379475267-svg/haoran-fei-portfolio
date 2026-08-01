import { motion, useReducedMotion } from "framer-motion";
import type { Variants } from "framer-motion";
import ProjectCover from "../components/ProjectCover";
import { projects } from "../data/profile";
import { getProjectLanguage, useV3Language } from "./V3Language";
import V3ChapterStrike from "./V3ChapterStrike";

const featuredReelIds = [
  "nonconvex-alpha",
  "string-blade",
  "interactive-particle-saturn",
] as const;

const reelProjects = featuredReelIds
  .map((id) => projects.find((project) => project.id === id))
  .filter((project): project is (typeof projects)[number] => Boolean(project));

const displayTitle = (id: string, title: string) => {
  if (id === "nonconvex-alpha") return "Nonconvex α / Drone Lab";
  if (id === "interactive-particle-saturn") return "Particle Saturn";
  return title;
};

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

const reelVariants: Variants = {
  hidden: {},
  visible: {
    transition: { delayChildren: 0.08, staggerChildren: 0.08 },
  },
};

const tileVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.48, ease: quietEase },
  },
};

export default function V3ProjectReel() {
  const reduceMotion = Boolean(useReducedMotion());
  const { language, t } = useV3Language();

  const renderTile = (project: (typeof projects)[number], index: number) => {
    const localized = getProjectLanguage(project, language);
    const title = displayTitle(project.id, project.title);
    const primaryUrl = project.globalDemo ?? project.chinaDemo ?? project.github;
    const newTabSuffix = language === "zh" ? "（新标签页打开）" : ", opens in a new tab";

    return (
      <motion.a
        className="v3-reel-tile"
        data-reel-project={project.id}
        href={primaryUrl}
        target="_blank"
        rel="noreferrer"
        key={project.id}
        aria-label={`${t.reel.open} ${title}${newTabSuffix}`}
        variants={tileVariants}
      >
        <ProjectCover
          type={project.coverType}
          image={project.coverPoster}
          title={title}
          label={localized.coverLabel}
          language={language}
        />
        <span>{String(index + 1).padStart(2, "0")}</span>
        <strong>{title}</strong>
      </motion.a>
    );
  };

  return (
    <section
      className="v3-reel"
      id="project-reel"
      aria-labelledby="reel-title"
    >
      <V3ChapterStrike tone="light" />
      <div className="v3-reel-arrival-heading">
        <motion.div
          className="v3-reel-heading"
          initial={reduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={headingVariants}
        >
          <div className="v3-reel-heading-copy">
            <motion.p variants={eyebrowVariants}>{t.reel.eyebrow}</motion.p>
            <motion.h2 id="reel-title" variants={titleVariants}>
              <span>{t.reel.title}</span>
            </motion.h2>
          </div>
        </motion.div>
      </div>
      <div className="v3-reel-arrival-rows">
        <div className="v3-reel-rows">
          <motion.div
            className="v3-reel-row-shell"
            initial={reduceMotion ? false : "hidden"}
            whileInView="visible"
            viewport={{ once: true, amount: 0.18 }}
            variants={reelVariants}
          >
            <motion.div className="v3-reel-row" variants={reelVariants}>
              {reelProjects.map(renderTile)}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
