import { ArrowUpRight } from "lucide-react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import type { Variants } from "framer-motion";
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
  "rail-drone-mission-studio",
  "string-blade",
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

const quietEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

const headingVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.04,
      staggerChildren: 0.1,
    },
  },
};

const eyebrowVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.48, ease: quietEase },
  },
};

const headingTitleVariants: Variants = {
  hidden: { opacity: 0, y: 24, clipPath: "inset(0 0 100% 0)" },
  visible: {
    opacity: 1,
    y: 0,
    clipPath: "inset(0 0 0% 0)",
    transition: { duration: 0.72, ease: quietEase },
  },
};

const headingCopyVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.62, ease: quietEase },
  },
};

const archiveGroupVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.06,
      staggerChildren: 0.06,
    },
  },
};

const archiveItemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.52, ease: quietEase },
  },
};

const archiveVisualVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.985,
    clipPath: "inset(0 10% 0 0 round 1.5rem)",
  },
  visible: {
    opacity: 1,
    scale: 1,
    clipPath: "inset(0 0% 0 0 round 1.5rem)",
    transition: { duration: 0.72, ease: quietEase },
  },
};

interface ProjectCardProps {
  project: Project;
  index: number;
  total: number;
  staticLayout: boolean;
  reducedMotion: boolean;
}

function ProjectCard({ project, index, total, staticLayout, reducedMotion }: ProjectCardProps) {
  const { language, t } = useV3Language();
  const wrapRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end start"],
  });
  const targetScale = 1 - (total - 1 - index) * 0.006;
  const scale = useTransform(scrollYProgress, [0, 1], [1, targetScale]);
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.88, 1],
    [1, 0.92, index === total - 1 ? 1 : 0.78],
  );
  const title = displayTitle(project);
  const isDrone = project.id === "nonconvex-alpha";
  const localized = getProjectLanguage(project, language);
  const isChinaSite = typeof window !== "undefined" && [
    "47.109.136.234",
    "fhrzz.me",
    "www.fhrzz.me",
  ].includes(window.location.hostname);
  const primaryUrl = isChinaSite
    ? (project.chinaDemo ?? project.globalDemo ?? project.github)
    : (project.globalDemo ?? project.chinaDemo ?? project.github);
  const visualUrl = project.recognition?.url ?? primaryUrl;
  const labels = language === "zh"
    ? {
        globalDemo: "在线体验 · Global",
        chinaDemo: "在线体验 · 中国大陆",
        globalUnavailable: "Global 体验 · 暂未部署",
        chinaUnavailable: "中国大陆体验 · 暂未部署",
        github: isDrone ? "查看项目档案 · GitHub" : "查看源码 · GitHub",
        openDemo: "打开在线体验",
      }
    : {
        globalDemo: "Live demo · Global",
        chinaDemo: "Live demo · China",
        globalUnavailable: "Global demo · Not deployed",
        chinaUnavailable: "China demo · Not deployed",
        github: isDrone ? "Project archive · GitHub" : "View source · GitHub",
        openDemo: "Open live demo",
      };
  const recognitionLabel = project.recognition
    ? language === "zh"
      ? `${project.recognition.name} · 已收录`
      : `Featured · ${project.recognition.name}`
    : null;
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
        style={staticLayout ? undefined : { scale, opacity }}
        initial={reducedMotion ? false : "hidden"}
        whileInView="visible"
        viewport={{ once: true, amount: 0.18 }}
        variants={archiveGroupVariants}
      >
        <motion.div className="v3-project-card-head" variants={archiveGroupVariants}>
          <motion.span variants={archiveItemVariants}>
            {String(index + 1).padStart(2, "0")}
          </motion.span>
          <motion.div variants={archiveItemVariants}>
            <p>{categoryLabel[project.category][language]} / {isDrone ? t.projects.active : t.projects.personal}</p>
            <h3>{title}</h3>
          </motion.div>
          <motion.div className="v3-project-card-links" variants={archiveItemVariants}>
            {project.globalDemo ? (
              <a href={project.globalDemo} target="_blank" rel="noreferrer" aria-label={`${labels.globalDemo}: ${title}`}>
                {labels.globalDemo} <ArrowUpRight aria-hidden="true" />
              </a>
            ) : null}
            {project.globalDemoUnavailable ? (
              <span className="v3-project-card-link-unavailable">
                {labels.globalUnavailable}
              </span>
            ) : null}
            {project.chinaDemo ? (
              <a href={project.chinaDemo} target="_blank" rel="noreferrer" aria-label={`${labels.chinaDemo}: ${title}`}>
                {labels.chinaDemo} <ArrowUpRight aria-hidden="true" />
              </a>
            ) : null}
            {project.chinaDemoUnavailable ? (
              <span className="v3-project-card-link-unavailable">
                {labels.chinaUnavailable}
              </span>
            ) : null}
            {project.recognition && recognitionLabel ? (
              <a
                className="v3-project-card-link-recognition"
                href={project.recognition.url}
                target="_blank"
                rel="noreferrer"
                aria-label={`${recognitionLabel}: ${title}`}
              >
                {recognitionLabel} <ArrowUpRight aria-hidden="true" />
              </a>
            ) : null}
            <a
              href={project.github}
              target="_blank"
              rel="noreferrer"
              aria-label={`${t.projects.openAria}：${title}`}
            >
              {labels.github} <ArrowUpRight aria-hidden="true" />
            </a>
          </motion.div>
        </motion.div>
        <motion.div className="v3-project-card-body" variants={archiveGroupVariants}>
          <motion.div className="v3-project-card-notes" variants={archiveGroupVariants}>
            <motion.p variants={archiveItemVariants}>{localized.longDescription}</motion.p>
            <motion.dl variants={archiveGroupVariants}>
              {details.map((detail) => (
                <motion.div key={`${detail.label}-${detail.value}`} variants={archiveItemVariants}>
                  <dt>{detail.label}</dt>
                  <dd>{detail.value}</dd>
                </motion.div>
              ))}
            </motion.dl>
          </motion.div>
          <motion.a
            className="v3-project-card-visual"
            href={visualUrl}
            target="_blank"
            rel="noreferrer"
            variants={archiveVisualVariants}
            aria-label={project.recognition
              ? `${recognitionLabel}: ${title}`
              : `${project.globalDemo || project.chinaDemo ? labels.openDemo : t.projects.openAria}: ${title}`}
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
          </motion.a>
        </motion.div>
      </motion.article>
    </div>
  );
}

export default function V3Projects() {
  const reduceMotion = useReducedMotion();
  const { t } = useV3Language();
  const stackRef = useRef<HTMLDivElement>(null);
  const [compact, setCompact] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const { scrollYProgress: sectionScrollProgress } = useScroll({
    target: stackRef,
    offset: ["start start", "end end"],
  });
  const progressScale = useTransform(sectionScrollProgress, [0, 1], [0, 1]);

  useMotionValueEvent(sectionScrollProgress, "change", (latest) => {
    const nextIndex = Math.min(
      selectedProjects.length - 1,
      Math.max(0, Math.floor(latest * selectedProjects.length)),
    );
    setActiveIndex((current) => (current === nextIndex ? current : nextIndex));
  });

  useEffect(() => {
    const media = window.matchMedia("(max-width: 60rem)");
    const update = () => setCompact(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return (
    <section className="v3-projects" id="projects" aria-labelledby="projects-title">
      <motion.div
        className="v3-projects-heading"
        initial={reduceMotion ? false : "hidden"}
        whileInView="visible"
        viewport={{ once: true, amount: 0.45 }}
        variants={headingVariants}
      >
        <motion.p className="v3-section-label" variants={eyebrowVariants}>
          {t.projects.eyebrow}
        </motion.p>
        <motion.h2 id="projects-title" variants={headingTitleVariants}>
          {t.projects.title}
        </motion.h2>
        <motion.p variants={headingCopyVariants}>{t.projects.intro}</motion.p>
      </motion.div>
      <div className="v3-projects-body">
        <aside className="v3-project-index" aria-hidden="true">
          <span>{String(activeIndex + 1).padStart(2, "0")}</span>
          <span className="v3-project-index-track">
            <motion.i
              style={{
                scaleY: reduceMotion ? 0 : progressScale,
                transformOrigin: "top",
              }}
            />
          </span>
          <span>{String(selectedProjects.length).padStart(2, "0")}</span>
        </aside>
        <div className="v3-project-stack" ref={stackRef}>
          {selectedProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              total={selectedProjects.length}
              staticLayout={Boolean(reduceMotion || compact)}
              reducedMotion={Boolean(reduceMotion)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
