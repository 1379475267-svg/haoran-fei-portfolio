import { ArrowUpRight } from "lucide-react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import type { Variants } from "framer-motion";
import type { CSSProperties } from "react";
import { useRef } from "react";
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
const featuredProjects = selectedProjects.slice(0, 2);
const archiveProjects = selectedProjects.slice(2);

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

interface ProjectCardProps {
  project: Project;
  index: number;
  total: number;
  active: boolean;
  staticLayout: boolean;
  reducedMotion: boolean;
}

function ProjectCard({
  project,
  index,
  total,
  active,
  staticLayout,
  reducedMotion,
}: ProjectCardProps) {
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

  return (
    <div
      className="v3-project-card-wrap"
      id={`project-${project.id}`}
      ref={wrapRef}
      data-project-index={index}
      style={{ "--v3-card-offset": `${index * 1.45}rem` } as CSSProperties}
    >
      <motion.article
        className="v3-project-card"
        data-project={project.id}
        data-active={active || undefined}
        data-archive-motion={reducedMotion ? "static" : "layered"}
        style={staticLayout ? undefined : { scale, opacity }}
        initial={reducedMotion ? false : "hidden"}
        whileInView="visible"
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

interface CompactProjectRowProps {
  project: Project;
  index: number;
  reducedMotion: boolean;
}

function CompactProjectRow({ project, index, reducedMotion }: CompactProjectRowProps) {
  const { language, t } = useV3Language();
  const localized = getProjectLanguage(project, language);
  const evidence = projectEvidence[project.id]?.[language];
  const title = displayTitle(project);
  const liveUrl = project.globalDemo ?? project.chinaDemo;
  const newTabSuffix = language === "zh" ? "（新标签页打开）" : ", opens in a new tab";
  const labels = language === "zh"
    ? { demo: "在线体验", source: "源代码", featured: "项目收录" }
    : { demo: "Live demo", source: "Source", featured: "Featured" };

  return (
    <motion.article
      className="v3-project-compact-row"
      id={`project-${project.id}`}
      data-project-index={index}
      data-project={project.id}
      initial={reducedMotion ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount: 0.35 }}
      variants={archiveCardVariants}
    >
      <span className="v3-project-compact-index" aria-hidden="true">
        {String(index + 1).padStart(2, "0")}
      </span>
      <div className="v3-project-compact-title">
        <p>{categoryLabel[project.category][language]}</p>
        <h4>{title}</h4>
      </div>
      <p className="v3-project-compact-summary">
        {evidence?.problem ?? localized.longDescription}
      </p>
      <ul className="v3-project-compact-tech" aria-label={language === "zh" ? "技术栈" : "Technology"}>
        {project.tech.slice(0, 3).map((technology) => (
          <li key={technology}>{technology}</li>
        ))}
      </ul>
      <div className="v3-project-compact-actions">
        {project.recognition ? (
          <a
            href={project.recognition.url}
            target="_blank"
            rel="noreferrer"
            aria-label={`${labels.featured}: ${project.recognition.name}${newTabSuffix}`}
          >
            <span>{labels.featured}</span>
            <ArrowUpRight aria-hidden="true" />
          </a>
        ) : null}
        {liveUrl ? (
          <a
            href={liveUrl}
            target="_blank"
            rel="noreferrer"
            aria-label={`${labels.demo}: ${title}${newTabSuffix}`}
          >
            <span>{labels.demo}</span>
            <ArrowUpRight aria-hidden="true" />
          </a>
        ) : null}
        <a
          href={project.github}
          target="_blank"
          rel="noreferrer"
          aria-label={`${t.projects.openAria}: ${title}${newTabSuffix}`}
        >
          <span>{labels.source}</span>
          <ArrowUpRight aria-hidden="true" />
        </a>
      </div>
    </motion.article>
  );
}

export default function V3Projects() {
  const reduceMotion = Boolean(useReducedMotion());
  const { language, t } = useV3Language();

  return (
    <section className="v3-projects" id="projects" aria-labelledby="projects-title">
      <V3ChapterStrike tone="light" />
      <motion.div
        className="v3-projects-heading"
        initial={reduceMotion ? false : "hidden"}
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={headingVariants}
      >
        <motion.p className="v3-section-label" variants={eyebrowVariants}>
          {t.projects.eyebrow}
        </motion.p>
        <motion.h2 id="projects-title" variants={headingTitleVariants}>
          {t.projects.title}
        </motion.h2>
      </motion.div>
      <div className="v3-projects-body">
        <div className="v3-project-stack">
          <div className="v3-project-featured">
          {featuredProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              total={featuredProjects.length}
              active={index === 0}
              staticLayout={reduceMotion}
              reducedMotion={reduceMotion}
            />
          ))}
          </div>
          <section className="v3-project-compact-archive" aria-labelledby="project-index-title">
            <div className="v3-project-compact-heading">
              <div>
                <p>{language === "zh" ? "其余实践" : "Further practice"}</p>
                <h3 id="project-index-title">
                  {language === "zh" ? "项目索引" : "Project index"}
                </h3>
              </div>
              <span aria-label={language === "zh" ? "五个项目" : "Five projects"}>
                {String(archiveProjects.length).padStart(2, "0")}
              </span>
            </div>
            <div className="v3-project-compact-list">
              {archiveProjects.map((project, index) => (
                <CompactProjectRow
                  key={project.id}
                  project={project}
                  index={index + featuredProjects.length}
                  reducedMotion={reduceMotion}
                />
              ))}
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
