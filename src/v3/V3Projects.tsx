import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useIsPresent,
  useReducedMotion,
} from "framer-motion";
import type { Variants } from "framer-motion";
import type { KeyboardEvent } from "react";
import { useEffect, useRef, useState } from "react";
import ProjectCover from "../components/ProjectCover";
import { projects, type Project } from "../data/profile";
import {
  categoryLabel,
  getProjectLanguage,
  highlightLabel,
  type V3Language,
  useV3Language,
} from "./V3Language";
import V3ChapterStrike from "./V3ChapterStrike";

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

const STATIC_PROJECT_LAYOUT_QUERY =
  "(max-width: 63.999rem), (pointer: coarse), (pointer: none)";

const displayTitle = (project: Project) => {
  if (project.id === "nonconvex-alpha") return "Nonconvex α / Drone Lab";
  if (project.id === "interactive-particle-saturn") return "Particle Saturn";
  return project.title;
};

interface ProjectEvidence {
  problem: string;
  decision: string;
  outcome: string;
}

const projectEvidence: Record<string, Record<V3Language, ProjectEvidence>> = {
  "nonconvex-alpha": {
    zh: {
      problem: "在保留厂家基线的同时，安全迭代真实激光雷达无人机的定位、规划与控制链路。",
      decision: "分离原始备份、稳定主线和实验分支；串联 Mid-360、Faster-LIO、Diff-Planner 与 PX4。",
      outcome: "团队在研；按仿真、拆桨与受控实飞分阶段验证，配置仅面向当前实机。",
    },
    en: {
      problem: "Iterate a real LiDAR drone stack without losing the vendor baseline or a safe path to flight tests.",
      decision: "Separate raw backup, stable main, and experimental branches across Mid-360, Faster-LIO, Diff-Planner, and PX4.",
      outcome: "Active team R&D with simulation, prop-off, and controlled-flight validation; configuration is hardware-specific.",
    },
  },
  "rail-drone-mission-studio": {
    zh: {
      problem: "在接入真实 ROS、PX4 与机械机构前，先暴露车—机交接的协议、互锁与故障恢复问题。",
      decision: "把任务编排、接触线复核和协同闭环拆成三个工作区，并用状态机与审计快照约束流程。",
      outcome: "浏览器工程原型；可做确定性虚拟闭环与视频影子运行，但不等同于真实飞控界面。",
    },
    en: {
      problem: "Expose protocol, interlock, and recovery failures before connecting ROS, PX4, or physical handoff hardware.",
      decision: "Split mission planning, contact-line review, and cooperative control into three state-machine-driven workspaces.",
      outcome: "A browser engineering prototype with deterministic and video-shadow runs, not a real flight-control interface.",
    },
  },
  "string-blade": {
    zh: {
      problem: "把噪声环境中的吉他和弦输入转换成及时、可玩的战斗动作。",
      decision: "并行支持麦克风、Web MIDI 与校准流程，通过频谱评分、多帧投票和节奏判定降低误触。",
      outcome: "已形成 Duel 与 Progression 两种玩法；识别效果仍受设备、环境与和弦集合影响。",
    },
    en: {
      problem: "Turn guitar chords captured in noisy rooms into responsive, playable combat actions.",
      decision: "Combine microphone and Web MIDI input with calibration, spectral scoring, multi-frame voting, and rhythm checks.",
      outcome: "Playable Duel and Progression modes; recognition remains sensitive to hardware, environment, and chord coverage.",
    },
  },
  chordpilot: {
    zh: {
      problem: "从本地 MP3/WAV 生成可继续修正的和弦草稿，同时抑制噪声、旋律与节拍抖动。",
      decision: "组合 CQT Chroma、根音强化、节拍同步、模板匹配与 HMM/Viterbi 平滑。",
      outcome: "输出同步时间轴与 TXT/JSON；复杂编曲、转位和高阶和弦仍是明确边界。",
    },
    en: {
      problem: "Generate an editable chord draft from MP3/WAV while reducing noise, melody bleed, and timing jitter.",
      decision: "Combine CQT chroma, root emphasis, beat sync, template matching, and HMM/Viterbi smoothing.",
      outcome: "Produces a synchronized timeline and TXT/JSON export; dense arrangements and advanced chords remain constraints.",
    },
  },
  "interactive-particle-saturn": {
    zh: {
      problem: "让摄像头手势成为稳定、可理解的视觉控制输入，而不是一次性特效触发。",
      decision: "拆分手势、映射、粒子与混沌层，用手掌张开度连续控制尺度、亮度与扰动。",
      outcome: "实现稳定轨道、受控混沌与重建；需要摄像头权限，桌面浏览器体验更完整。",
    },
    en: {
      problem: "Make camera gestures a legible continuous control signal instead of a one-shot visual effect.",
      decision: "Separate gesture, mapping, particle, and chaos layers, mapping palm openness to scale, brightness, and turbulence.",
      outcome: "Moves from stable orbit to controlled chaos and reconstruction; camera access and desktop browsers work best.",
    },
  },
  "fretboard-caged-lab": {
    zh: {
      problem: "帮助学习者把吉他指板、钢琴键盘、音程与五线谱理解为同一套关系。",
      decision: "按乐器进入 CAGED 或键盘视图，共享 Root、音阶与音程模型，并保留中英双语状态。",
      outcome: "轻量静态交互学习页；五线谱部分定位为入门可视化，而非专业制谱系统。",
    },
    en: {
      problem: "Help learners read fretboard, keyboard, intervals, and staff notation as one connected system.",
      decision: "Route into CAGED or keyboard views while sharing root, scale, interval, language, and URL state.",
      outcome: "A lightweight bilingual learning tool; staff notation is introductory rather than a full scoring system.",
    },
  },
  gamememory: {
    zh: {
      problem: "把 RAWG、Steam、SteamGridDB 与个人评分、评论和公开记忆统一成可持久化档案。",
      decision: "采用 Vue、Netlify Functions 与 Supabase；外部 API 和敏感写入全部经过服务端函数。",
      outcome: "支持搜索导入、Steam 库、统计与导出；当前尚未加入用户认证和私有档案。",
    },
    en: {
      problem: "Unify RAWG, Steam, SteamGridDB, personal ratings, reviews, and public memories into a durable archive.",
      decision: "Use Vue, Netlify Functions, and Supabase, keeping external APIs and privileged writes behind server functions.",
      outcome: "Supports search, Steam import, statistics, and export; authentication and private archives are not yet included.",
    },
  },
};

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

const archiveGroupVariants: Variants = {
  hidden: {},
  visible: {
    transition: { delayChildren: 0.04, staggerChildren: 0.06 },
  },
};

const archiveCardVariants: Variants = {
  hidden: { y: 16 },
  visible: {
    y: 0,
    transition: {
      duration: 0.48,
      ease: quietEase,
    },
  },
};

const archiveItemVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.4, ease: quietEase },
  },
};

const archiveBodyVariants: Variants = {
  hidden: {},
  visible: {
    transition: { delayChildren: 0.08, staggerChildren: 0.1 },
  },
};

const archiveMetaVariants: Variants = {
  hidden: {},
  visible: {
    transition: { delayChildren: 0.04, staggerChildren: 0.08 },
  },
};

const archiveVisualVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.99,
    clipPath: "inset(0 4% 0 0 round 0.5rem)",
  },
  visible: {
    opacity: 1,
    scale: 1,
    clipPath: "inset(0 0% 0 0 round 0.5rem)",
    transition: { duration: 0.48, ease: quietEase },
  },
};

function useStaticProjectLayout(reducedMotion: boolean) {
  const [mediaRequiresStaticLayout, setMediaRequiresStaticLayout] = useState(() =>
    typeof window === "undefined"
      ? true
      : window.matchMedia(STATIC_PROJECT_LAYOUT_QUERY).matches,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia(STATIC_PROJECT_LAYOUT_QUERY);
    const updateLayout = () => setMediaRequiresStaticLayout(mediaQuery.matches);

    updateLayout();
    mediaQuery.addEventListener("change", updateLayout);
    return () => mediaQuery.removeEventListener("change", updateLayout);
  }, []);

  return reducedMotion || mediaRequiresStaticLayout;
}

interface ProjectCardProps {
  project: Project;
  index: number;
  active: boolean;
  staticLayout: boolean;
  reducedMotion: boolean;
}

function ProjectCard({
  project,
  index,
  active,
  staticLayout,
  reducedMotion,
}: ProjectCardProps) {
  const isPresent = useIsPresent();
  const cardRef = useRef<HTMLDivElement>(null);
  const { language, t } = useV3Language();
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
  const visualUrl = primaryUrl;
  const newTabSuffix = language === "zh" ? "（新标签页打开）" : ", opens in a new tab";
  const labels = language === "zh"
    ? {
        liveDemo: "在线体验",
        globalDemo: "Global",
        chinaDemo: "中国大陆",
        globalUnavailable: "Global · 暂未部署",
        chinaUnavailable: "中国大陆 · 暂未部署",
        noDemo: "暂无公开体验",
        github: isDrone ? "查看项目档案 · GitHub" : "查看源码 · GitHub",
        openDemo: "打开在线体验",
        problem: "问题",
        decision: "技术决策",
        outcome: "当前形态 / 约束",
      }
    : {
        liveDemo: "Live demo",
        globalDemo: "Global",
        chinaDemo: "China",
        globalUnavailable: "Global · Not deployed",
        chinaUnavailable: "China · Not deployed",
        noDemo: "No public demo",
        github: isDrone ? "Project archive · GitHub" : "View source · GitHub",
        openDemo: "Open live demo",
        problem: "Problem",
        decision: "Technical decision",
        outcome: "Current form / constraint",
      };
  const recognitionLabel = project.recognition
    ? language === "zh"
      ? `${project.recognition.name} · 已收录`
      : `Featured · ${project.recognition.name}`
    : null;
  const evidence = projectEvidence[project.id]?.[language];
  const details = evidence
    ? [
        { label: labels.problem, value: evidence.problem },
        { label: labels.decision, value: evidence.decision },
        { label: labels.outcome, value: evidence.outcome },
      ]
    : project.highlights
      ? project.highlights.map((detail) => ({
          ...detail,
          label: language === "zh"
            ? (highlightLabel[detail.label] ?? detail.label)
            : detail.label,
        }))
      : project.tech.slice(0, 3).map((value, techIndex) => ({
          label: t.projects.detailLabels[techIndex],
          value,
        }));
  const interactive = isPresent && (staticLayout || active);

  useEffect(() => {
    if (cardRef.current) cardRef.current.inert = !interactive;
  }, [interactive]);

  return (
    <motion.div
      ref={cardRef}
      className="v3-project-card-wrap"
      id={`project-${project.id}`}
      data-project-index={index}
      data-project={project.id}
      data-active={active || undefined}
      aria-hidden={interactive ? undefined : true}
    >
      <motion.article
        className="v3-project-card"
        data-project={project.id}
        data-active={active || undefined}
        data-archive-motion={staticLayout ? "static" : "stage"}
        initial={reducedMotion ? false : "hidden"}
        animate={reducedMotion || !staticLayout ? "visible" : undefined}
        whileInView={reducedMotion || !staticLayout ? undefined : "visible"}
        viewport={{ once: true, amount: 0.1 }}
        variants={archiveCardVariants}
      >
        <motion.i
          className="v3-project-card-active-signal"
          aria-hidden="true"
          initial={false}
          animate={{ opacity: active ? 1 : 0, scaleX: active ? 1 : 0 }}
          transition={reducedMotion
            ? { duration: 0 }
            : { duration: 0.36, ease: quietEase }}
        />
        <motion.div className="v3-project-card-head" variants={archiveGroupVariants}>
          <motion.span variants={archiveItemVariants}>
            {String(index + 1).padStart(2, "0")}
          </motion.span>
          <motion.div variants={archiveItemVariants}>
            <p>{categoryLabel[project.category][language]} / {isDrone ? t.projects.active : t.projects.personal}</p>
            <h3>{title}</h3>
          </motion.div>
          <motion.div className="v3-project-card-links" variants={archiveItemVariants}>
            <div className="v3-project-card-demo-group">
              <span>{labels.liveDemo}</span>
              <div>
                {project.globalDemo ? (
                  <a
                    href={project.globalDemo}
                    target="_blank"
                    rel="noreferrer"
                    tabIndex={interactive ? undefined : -1}
                    aria-label={`${labels.liveDemo} · ${labels.globalDemo}: ${title}${newTabSuffix}`}
                  >
                    <span>{labels.globalDemo}</span>
                    <ArrowUpRight aria-hidden="true" />
                  </a>
                ) : project.globalDemoUnavailable ? (
                  <span className="v3-project-card-link-unavailable">
                    {labels.globalUnavailable}
                  </span>
                ) : null}
                {project.chinaDemo ? (
                  <a
                    href={project.chinaDemo}
                    target="_blank"
                    rel="noreferrer"
                    tabIndex={interactive ? undefined : -1}
                    aria-label={`${labels.liveDemo} · ${labels.chinaDemo}: ${title}${newTabSuffix}`}
                  >
                    <span>{labels.chinaDemo}</span>
                    <ArrowUpRight aria-hidden="true" />
                  </a>
                ) : project.chinaDemoUnavailable ? (
                  <span className="v3-project-card-link-unavailable">
                    {labels.chinaUnavailable}
                  </span>
                ) : null}
                {!project.globalDemo
                  && !project.globalDemoUnavailable
                  && !project.chinaDemo
                  && !project.chinaDemoUnavailable ? (
                    <span className="v3-project-card-link-unavailable">
                      {labels.noDemo}
                    </span>
                  ) : null}
              </div>
            </div>
            <div className="v3-project-card-meta-links">
              {project.recognition && recognitionLabel ? (
                <a
                  className="v3-project-card-recognition-badge"
                  href={project.recognition.url}
                  target="_blank"
                  rel="noreferrer"
                  tabIndex={interactive ? undefined : -1}
                  aria-label={`${recognitionLabel}: ${title}${newTabSuffix}`}
                >
                  <span>{recognitionLabel}</span>
                  <ArrowUpRight aria-hidden="true" />
                </a>
              ) : null}
              <a
                className="v3-project-card-source-link"
                href={project.github}
                target="_blank"
                rel="noreferrer"
                tabIndex={interactive ? undefined : -1}
                aria-label={`${t.projects.openAria}：${title}${newTabSuffix}`}
              >
                <span>{labels.github}</span>
                <ArrowUpRight aria-hidden="true" />
              </a>
            </div>
          </motion.div>
        </motion.div>
        <motion.div className="v3-project-card-body" variants={archiveBodyVariants}>
          <motion.div className="v3-project-card-notes" variants={archiveMetaVariants}>
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
            tabIndex={interactive ? undefined : -1}
            variants={archiveVisualVariants}
            whileHover={reducedMotion
              ? undefined
              : { scale: 1.008, transition: { duration: 0.2, ease: quietEase } }}
            whileFocus={reducedMotion
              ? undefined
              : { scale: 1.008, transition: { duration: 0.2, ease: quietEase } }}
            aria-label={`${
              project.globalDemo || project.chinaDemo ? labels.openDemo : t.projects.openAria
            }: ${title}${newTabSuffix}`}
          >
            <ProjectCover
              type={project.coverType}
              featured={isDrone}
              image={project.coverPoster}
              videoWebm={interactive ? project.coverVideoWebm : undefined}
              videoMp4={interactive ? project.coverVideoMp4 : undefined}
              title={title}
              label={localized.coverLabel}
              language={language}
            />
          </motion.a>
        </motion.div>
      </motion.article>
      <span className="v3-project-card-edge-label" aria-hidden="true">
        <b>{String(index + 1).padStart(2, "0")}</b>
        <span>{title}</span>
      </span>
    </motion.div>
  );
}

const projectStageVariants: Variants = {
  enter: (direction: number) => ({ opacity: 0, x: direction * 20 }),
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.48, ease: quietEase },
  },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction * -10,
    transition: { duration: 0.16, ease: quietEase },
  }),
};

const projectHashIndex = () => typeof window === "undefined"
  ? -1
  : selectedProjects.findIndex((project) => window.location.hash === `#project-${project.id}`);

export default function V3Projects() {
  const reduceMotion = Boolean(useReducedMotion());
  const { language, t } = useV3Language();
  const staticLayout = useStaticProjectLayout(reduceMotion);
  const [activeIndex, setActiveIndex] = useState(() => Math.max(0, projectHashIndex()));
  const [direction, setDirection] = useState(1);
  const directoryRef = useRef<HTMLElement>(null);
  const totalProjects = selectedProjects.length;
  const activeProject = selectedProjects[activeIndex];
  const labels = language === "zh"
    ? { directory: "选择项目", previous: "上一个项目", next: "下一个项目", all: "完整项目档案", jump: "快速跳转", browse: "选择一个项目，查看它的构建过程。" }
    : { directory: "Choose a project", previous: "Previous project", next: "Next project", all: "Complete project archive", jump: "Jump to a project", browse: "Choose a project to explore how it was built." };

  const selectProject = (index: number) => {
    if (index < 0 || index >= totalProjects || index === activeIndex) return;
    setDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
    // Keep deep links meaningful without letting a selection move the viewport.
    window.history.replaceState(window.history.state, "", `#project-${selectedProjects[index].id}`);
  };

  useEffect(() => {
    // Keep the selection when moving between the mobile archive and desktop stage.
    const currentIndex = projectHashIndex();
    if (currentIndex >= 0) setActiveIndex(currentIndex);
  }, [staticLayout]);

  useEffect(() => {
    const syncProjectHash = () => {
      const nextIndex = projectHashIndex();
      if (nextIndex < 0) return;
      setDirection(nextIndex > activeIndex ? 1 : -1);
      setActiveIndex(nextIndex);
      if (staticLayout) return;
      // The selected case may still be entering; scroll to the always-present stage.
      document.getElementById("project-stage")?.scrollIntoView({ block: "start", behavior: "auto" });
    };
    window.addEventListener("hashchange", syncProjectHash);
    return () => window.removeEventListener("hashchange", syncProjectHash);
  }, [staticLayout, activeIndex]);

  const onDirectoryKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex = index;
    if (event.key === "ArrowDown" || event.key === "ArrowRight") nextIndex = (index + 1) % totalProjects;
    else if (event.key === "ArrowUp" || event.key === "ArrowLeft") nextIndex = (index - 1 + totalProjects) % totalProjects;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = totalProjects - 1;
    else return;
    event.preventDefault();
    selectProject(nextIndex);
    directoryRef.current?.querySelector<HTMLButtonElement>(`[data-selector-index="${nextIndex}"]`)?.focus();
  };

  return (
    <section
      className="v3-projects"
      id="projects"
      aria-labelledby="projects-title"
      data-project-layout={staticLayout ? "static" : "stage"}
    >
      <V3ChapterStrike tone="light" />
      <motion.div
        className="v3-projects-heading"
        initial={reduceMotion ? false : "hidden"}
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={headingVariants}
      >
        <div className="v3-project-heading-main">
          <motion.p className="v3-section-label" variants={eyebrowVariants}>
            {t.projects.eyebrow}
          </motion.p>
          <motion.h2 id="projects-title" variants={headingTitleVariants}>
            {t.projects.title}
          </motion.h2>
        </div>
        <motion.p className="v3-project-heading-note" variants={eyebrowVariants}>
          {t.projects.intro}
        </motion.p>
      </motion.div>
      <div className="v3-projects-body">
        <div className="v3-project-browser">
          <nav
            className="v3-project-directory"
            ref={directoryRef}
            aria-label={staticLayout ? labels.jump : labels.directory}
          >
            <div className="v3-project-directory-heading">
              <span>{staticLayout ? labels.jump : labels.directory}</span>
              <span>{String(totalProjects).padStart(2, "0")}</span>
            </div>
            <ol>
              {selectedProjects.map((project, index) => {
                const title = displayTitle(project);
                const content = (
                  <>
                    <span className="v3-project-selector-number">{String(index + 1).padStart(2, "0")}</span>
                    <span className="v3-project-selector-copy">
                      <strong>{title}</strong>
                      <small>{categoryLabel[project.category][language]}</small>
                    </span>
                    <ArrowUpRight aria-hidden="true" />
                  </>
                );
                return (
                  <li key={project.id}>
                    {staticLayout ? (
                      <a href={`#project-${project.id}`} className="v3-project-selector">
                        {content}
                      </a>
                    ) : (
                      <button
                        type="button"
                        className="v3-project-selector"
                        id={`project-selector-${project.id}`}
                        data-selector-index={index}
                        aria-pressed={index === activeIndex}
                        aria-controls="project-stage"
                        onClick={() => selectProject(index)}
                        onKeyDown={(event) => onDirectoryKeyDown(event, index)}
                      >
                        {index === activeIndex ? (
                          <motion.i
                            className="v3-project-selector-signal"
                            layoutId="project-selector-signal"
                            transition={{ duration: 0.4, ease: quietEase }}
                            aria-hidden="true"
                          />
                        ) : null}
                        {content}
                      </button>
                    )}
                  </li>
                );
              })}
            </ol>
            {!staticLayout ? (
              <div className="v3-project-directory-footer">
                <p>{labels.browse}</p>
                <div className="v3-project-stage-controls">
                  <button type="button" onClick={() => selectProject(activeIndex - 1)} disabled={activeIndex === 0} aria-label={labels.previous} aria-controls="project-stage">
                    <ArrowLeft aria-hidden="true" />
                  </button>
                  <span
                    aria-live="polite"
                    aria-atomic="true"
                    aria-label={language === "zh"
                      ? `当前项目：第 ${activeIndex + 1} 个，共 ${totalProjects} 个`
                      : `Current project: ${activeIndex + 1} of ${totalProjects}`}
                  >
                    <b>{String(activeIndex + 1).padStart(2, "0")}</b>
                    <span aria-hidden="true"> / </span>
                    {String(totalProjects).padStart(2, "0")}
                  </span>
                  <button type="button" onClick={() => selectProject(activeIndex + 1)} disabled={activeIndex === totalProjects - 1} aria-label={labels.next} aria-controls="project-stage">
                    <ArrowRight aria-hidden="true" />
                  </button>
                </div>
              </div>
            ) : null}
          </nav>
          <div className="v3-project-stack" data-layout={staticLayout ? "static" : "stage"}>
            {staticLayout ? (
              <div className="v3-project-static-list" aria-label={labels.all}>
                {selectedProjects.map((project, index) => (
                  <ProjectCard key={project.id} project={project} index={index} active={false} staticLayout reducedMotion={reduceMotion} />
                ))}
              </div>
            ) : (
              <div
                className="v3-project-stage"
                id="project-stage"
                role="region"
                aria-labelledby={`project-selector-${activeProject.id}`}
                data-current-project={activeProject.id}
              >
                <AnimatePresence initial={false} mode="wait" custom={direction}>
                  <motion.div
                    className="v3-project-stage-content"
                    key={activeProject.id}
                    custom={direction}
                    variants={projectStageVariants}
                    initial="enter"
                    animate="visible"
                    exit="exit"
                  >
                    <ProjectCard project={activeProject} index={activeIndex} active staticLayout={false} reducedMotion={reduceMotion} />
                  </motion.div>
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
