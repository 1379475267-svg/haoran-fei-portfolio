import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import type { Variants } from "framer-motion";
import { useRef } from "react";
import ProjectCover from "../components/ProjectCover";
import { projects, type Project } from "../data/profile";
import { getProjectLanguage, useV3Language } from "./V3Language";
import V3ChapterStrike from "./V3ChapterStrike";

const selectedReelIds = [
  "nonconvex-alpha",
  "rail-drone-mission-studio",
  "string-blade",
  "chordpilot",
  "interactive-particle-saturn",
  "fretboard-caged-lab",
  "gamememory",
] as const;

interface ReelEntry {
  project: Project;
  projectIndex: number;
  duplicate: boolean;
}

const reelProjects = selectedReelIds
  .map((id) => projects.find((project) => project.id === id))
  .filter((project): project is Project => Boolean(project));

const baseEntries = reelProjects.map((project, projectIndex) => ({
  project,
  projectIndex,
}));

const reverseBaseEntries = [
  ...baseEntries.slice(3),
  ...baseEntries.slice(0, 3),
];

const makeMovingRow = (
  entries: typeof baseEntries,
  accessible: boolean,
): ReelEntry[] => [
  ...entries.map((entry) => ({ ...entry, duplicate: !accessible })),
  ...entries.map((entry) => ({ ...entry, duplicate: true })),
];

const forwardRow = makeMovingRow(baseEntries, true);
const reverseRow = makeMovingRow(reverseBaseEntries, false);
const staticRow = baseEntries.map((entry) => ({ ...entry, duplicate: false }));

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
    transition: { delayChildren: 0.08, staggerChildren: 0.045 },
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
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = Boolean(useReducedMotion());
  const sectionInView = useInView(sectionRef, { amount: 0.05 });
  const { language, t } = useV3Language();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const forwardX = useTransform(scrollYProgress, [0, 1], ["-5%", "-29%"]);
  const reverseX = useTransform(scrollYProgress, [0, 1], ["-29%", "-5%"]);

  const renderTile = (
    entry: ReelEntry,
    row: "forward" | "reverse" | "static",
    instanceIndex: number,
  ) => {
    const { project, projectIndex, duplicate } = entry;
    const localized = getProjectLanguage(project, language);
    const title = displayTitle(project.id, project.title);
    const primaryUrl = project.globalDemo ?? project.chinaDemo ?? project.github;
    const newTabSuffix = language === "zh"
      ? "（新标签页打开）"
      : ", opens in a new tab";
    const key = `${row}-${project.id}-${instanceIndex}`;

    const content = (
      <>
        <ProjectCover
          type={project.coverType}
          image={project.coverPoster}
          title={title}
          label={localized.coverLabel}
          language={language}
        />
        <span>{String(projectIndex + 1).padStart(2, "0")}</span>
        <strong>{title}</strong>
      </>
    );

    if (duplicate) {
      return (
        <motion.div
          className="v3-reel-tile is-duplicate"
          data-reel-project={project.id}
          key={key}
          aria-hidden="true"
          variants={tileVariants}
        >
          {content}
        </motion.div>
      );
    }

    return (
      <motion.a
        className="v3-reel-tile"
        data-reel-project={project.id}
        href={primaryUrl}
        target="_blank"
        rel="noreferrer"
        key={key}
        aria-label={`${t.reel.open} ${title}${newTabSuffix}`}
        variants={tileVariants}
        onFocus={(event) => {
          const tile = event.currentTarget;
          const shell = tile.closest<HTMLElement>(
            ".v3-reel-row-shell",
          );
          if (!shell) return;

          window.requestAnimationFrame(() => {
            const shellRect = shell.getBoundingClientRect();
            const tileRect = tile.getBoundingClientRect();
            shell.scrollTo({
              left: Math.max(
                0,
                shell.scrollLeft
                  + tileRect.left
                  - shellRect.left
                  - (shell.clientWidth - tileRect.width) / 2,
              ),
              behavior: "auto",
            });
          });
        }}
      >
        {content}
      </motion.a>
    );
  };

  return (
    <section
      className="v3-reel"
      id="project-reel"
      ref={sectionRef}
      aria-labelledby="reel-title"
      data-static={reduceMotion || undefined}
      data-in-view={sectionInView || undefined}
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
            <motion.div
              className="v3-reel-row v3-reel-row-forward"
              style={reduceMotion ? undefined : { x: forwardX }}
              variants={reelVariants}
            >
              {(reduceMotion ? staticRow : forwardRow).map((entry, index) =>
                renderTile(entry, reduceMotion ? "static" : "forward", index),
              )}
            </motion.div>
          </motion.div>

          {!reduceMotion ? (
            <motion.div
              className="v3-reel-row-shell v3-reel-row-shell-reverse"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.18 }}
              variants={reelVariants}
              aria-hidden="true"
            >
              <motion.div
                className="v3-reel-row v3-reel-row-reverse"
                style={{ x: reverseX }}
                variants={reelVariants}
              >
                {reverseRow.map((entry, index) =>
                  renderTile(entry, "reverse", index),
                )}
              </motion.div>
            </motion.div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
