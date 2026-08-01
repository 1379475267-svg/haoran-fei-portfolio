import { ArrowUpRight, Github } from "lucide-react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useV3Language, type V3Language } from "./V3Language";

type MilestoneTone = "complete" | "active";

interface JourneyLink {
  label: string;
  href: string;
  kind?: "github" | "external";
}

interface JourneyMilestone {
  id: string;
  time: string;
  title: string;
  work: string;
  outcome: string;
  status: string;
  tone: MilestoneTone;
  current?: boolean;
  next?: string;
  links?: JourneyLink[];
}

interface JourneyLanguageCopy {
  eyebrow: string;
  title: string;
  intro: string;
  originLabel: string;
  currentLabel: string;
  workLabel: string;
  outcomeLabel: string;
  nextLabel: string;
  routeLabel: string;
  newTabLabel: string;
  milestones: JourneyMilestone[];
}

const journeyCopy: Record<V3Language, JourneyLanguageCopy> = {
  zh: {
    eyebrow: "成长轨迹 / FLIGHT LOG",
    title: "一路把兴趣，变成真实系统。",
    intro:
      "从第一次写下代码，到把软件、硬件、音乐与无人系统做成可运行的项目。这不是技能清单，而是一条仍在延伸的实践路径。",
    originLabel: "起点",
    currentLabel: "当前",
    workLabel: "实践",
    outcomeLabel: "结果",
    nextLabel: "下一航段",
    routeLabel: "成长轨迹时间线",
    newTabLabel: "在新标签页打开",
    milestones: [
      {
        id: "first-code",
        time: "2019",
        title: "第一次接触编程",
        work: "初中时期第一次接触编程，开始尝试通过代码让计算机按照自己的想法运行。",
        outcome:
          "对软件、自动化与技术创造的长期兴趣由此开始，也为后来学习电子信息、嵌入式和无人系统打下基础。",
        status: "已完成",
        tone: "complete",
      },
      {
        id: "embedded-shift",
        time: "2025.10",
        title: "从软件走向嵌入式",
        work:
          "正式接触单片机和嵌入式硬件，学习传感器、控制器与程序如何协同，并开始练习硬件连接、程序烧录和系统调试。",
        outcome:
          "建立了单片机与嵌入式开发的基础认识，技术视野从纯软件扩展到软硬件结合。",
        status: "进行中",
        tone: "active",
      },
      {
        id: "saturn-launch",
        time: "2026.04",
        title: "完成第一个真正上线的项目",
        work:
          "完成 Interactive Particle Saturn，用 Three.js 构建粒子化土星、动态轨道与沉浸式交互，并加入手势控制、动态光影和稳定到混沌的状态变化。",
        outcome:
          "第一次独立走完开发、完善与公开部署的完整流程，实践了 Three.js、MediaPipe、GLSL、粒子系统和实时交互。",
        status: "已完成 / 持续迭代",
        tone: "complete",
        links: [
          {
            label: "GitHub",
            href: "https://github.com/1379475267-svg/interactive-particle-saturn",
            kind: "github",
          },
          {
            label: "在线体验",
            href: "https://1379475267-svg.github.io/interactive-particle-saturn/",
            kind: "external",
          },
        ],
      },
      {
        id: "music-technology",
        time: "2026.05—2026.06",
        title: "让音乐兴趣成为技术方向",
        work:
          "先完成双语交互式乐理工具 Fret & Key Theory Lab，随后开发 ChordPilot，把方向从乐理可视化推进到音频上传、和弦分析与播放同步时间轴。",
        outcome:
          "形成了从学习可视化到音频分析的两层实践，覆盖 Vue 3、FastAPI、librosa、NumPy、SciPy，以及前后端协作与结果导出。",
        status: "进行中 / 持续迭代",
        tone: "active",
        links: [
          {
            label: "Fret & Key / GitHub",
            href: "https://github.com/1379475267-svg/fretboard-caged-lab",
            kind: "github",
          },
          {
            label: "Fret & Key / 在线体验",
            href: "https://1379475267-svg.github.io/fretboard-caged-lab/",
            kind: "external",
          },
          {
            label: "ChordPilot / GitHub",
            href: "https://github.com/1379475267-svg/ChordPilot",
            kind: "github",
          },
          {
            label: "ChordPilot / 在线体验",
            href: "https://fhrzz.me/projects/chordpilot/",
            kind: "external",
          },
        ],
      },
      {
        id: "string-blade-recognition",
        time: "2026.07",
        title: "String Blade 被外部平台收录",
        work: "独立完成并发布 String Blade，把作品打磨成可以直接在线体验的互动项目。",
        outcome:
          "项目被 DEAD.ARMY 正式收录，并获得收录页面管理权限。这是作品第一次被外部平台主动发现与展示。",
        status: "已完成 / 持续维护",
        tone: "complete",
        links: [
          {
            label: "GitHub",
            href: "https://github.com/1379475267-svg/String-Blade",
            kind: "github",
          },
          {
            label: "DEAD.ARMY 收录页",
            href: "https://dead.army/games/string-blade-c8627c",
            kind: "external",
          },
        ],
      },
      {
        id: "rail-drone-studio",
        time: "2026.07.10—至今",
        title: "构建无人机与机器人协同软件原型",
        work:
          "围绕激光雷达自主无人机方向，完成 RailDrone Mission Studio：以航点任务编辑、接触线识别复核和机器人—无人机协同闭环三个工作区，验证任务规划与越障流程。",
        outcome:
          "原型已实现路线仿真、事件驱动状态机、双端互锁、故障注入、异常恢复和数据导出。目前仍是浏览器端验证系统，尚未连接真实飞控、机器人或机械执行机构。",
        status: "进行中 / 下一步",
        tone: "active",
        current: true,
        next:
          "继续接入真实感知、通信、飞控与机械执行系统，推动无人机与四川锐恩智铁自主避障机器人形成空中接驳式协同闭环。",
        links: [
          {
            label: "GitHub",
            href: "https://github.com/1379475267-svg/rail-drone-mission-studio",
            kind: "github",
          },
          {
            label: "GitHub Pages",
            href: "https://1379475267-svg.github.io/rail-drone-mission-studio/",
            kind: "external",
          },
          {
            label: "个人网站体验",
            href: "https://fhrzz.me/projects/rail-drone-mission-studio/",
            kind: "external",
          },
        ],
      },
    ],
  },
  en: {
    eyebrow: "GROWTH JOURNEY / FLIGHT LOG",
    title: "Turning curiosity into working systems.",
    intro:
      "From the first line of code to deployable work across software, hardware, music, and autonomous systems. This is not a skill list, but a practice route that is still unfolding.",
    originLabel: "Origin",
    currentLabel: "Current",
    workLabel: "Practice",
    outcomeLabel: "Outcome",
    nextLabel: "Next vector",
    routeLabel: "Personal growth timeline",
    newTabLabel: "Open in a new tab",
    milestones: [
      {
        id: "first-code",
        time: "2019",
        title: "First contact with programming",
        work: "I began programming in middle school, experimenting with code as a way to make a computer follow an idea of my own.",
        outcome:
          "That first encounter created a lasting interest in software, automation, and technical making, later supporting my work in electronics, embedded systems, and autonomy.",
        status: "Completed",
        tone: "complete",
      },
      {
        id: "embedded-shift",
        time: "2025.10",
        title: "From software into embedded systems",
        work:
          "I moved into microcontrollers and embedded hardware, learning how programs, sensors, and controllers work together through wiring, flashing, and system debugging.",
        outcome:
          "I gained a foundation in embedded development and expanded my focus from software alone to integrated hardware-software systems.",
        status: "In progress",
        tone: "active",
      },
      {
        id: "saturn-launch",
        time: "2026.04",
        title: "First fully deployed project",
        work:
          "I built Interactive Particle Saturn with a particle-based planet, dynamic rings, gesture control, lighting, and transitions between stable and chaotic visual states.",
        outcome:
          "It was my first project taken through development, refinement, and public deployment, using Three.js, MediaPipe, GLSL, particle systems, and real-time interaction.",
        status: "Completed / iterating",
        tone: "complete",
        links: [
          {
            label: "GitHub",
            href: "https://github.com/1379475267-svg/interactive-particle-saturn",
            kind: "github",
          },
          {
            label: "Live project",
            href: "https://1379475267-svg.github.io/interactive-particle-saturn/",
            kind: "external",
          },
        ],
      },
      {
        id: "music-technology",
        time: "2026.05—2026.06",
        title: "Turning music into a technical direction",
        work:
          "I first completed the bilingual Fret & Key Theory Lab, then built ChordPilot to move from theory visualization into uploaded-audio analysis and a playback-synchronized chord timeline.",
        outcome:
          "Together they span learning visualization and audio analysis, with Vue 3, FastAPI, librosa, NumPy, SciPy, full-stack integration, and result export.",
        status: "In progress / iterating",
        tone: "active",
        links: [
          {
            label: "Fret & Key / GitHub",
            href: "https://github.com/1379475267-svg/fretboard-caged-lab",
            kind: "github",
          },
          {
            label: "Fret & Key / Live",
            href: "https://1379475267-svg.github.io/fretboard-caged-lab/",
            kind: "external",
          },
          {
            label: "ChordPilot / GitHub",
            href: "https://github.com/1379475267-svg/ChordPilot",
            kind: "github",
          },
          {
            label: "ChordPilot / Live",
            href: "https://fhrzz.me/projects/chordpilot/",
            kind: "external",
          },
        ],
      },
      {
        id: "string-blade-recognition",
        time: "2026.07",
        title: "String Blade featured by an external platform",
        work: "I independently completed and released String Blade as an interactive project that can be played directly online.",
        outcome:
          "DEAD.ARMY formally listed the project and granted me access to manage its page. It was the first time my work was independently discovered and presented by an external platform.",
        status: "Completed / maintained",
        tone: "complete",
        links: [
          {
            label: "GitHub",
            href: "https://github.com/1379475267-svg/String-Blade",
            kind: "github",
          },
          {
            label: "DEAD.ARMY listing",
            href: "https://dead.army/games/string-blade-c8627c",
            kind: "external",
          },
        ],
      },
      {
        id: "rail-drone-studio",
        time: "2026.07.10—NOW",
        title: "Building a drone-robot collaboration prototype",
        work:
          "I built RailDrone Mission Studio around LiDAR autonomous flight: waypoint mission editing, contact-line detection review, and a robot-drone state-machine loop for planning and obstacle-transfer validation.",
        outcome:
          "The prototype covers route simulation, event-driven control, dual-end interlocks, fault injection, recovery, and data export. It remains a browser-based validation system and is not yet connected to real vehicles or mechanisms.",
        status: "In progress / next step",
        tone: "active",
        current: true,
        next:
          "Connect real perception, communication, flight control, and mechanical execution to develop an aerial handoff loop with Sichuan Ruien Zhitie autonomous obstacle-avoidance robots.",
        links: [
          {
            label: "GitHub",
            href: "https://github.com/1379475267-svg/rail-drone-mission-studio",
            kind: "github",
          },
          {
            label: "GitHub Pages",
            href: "https://1379475267-svg.github.io/rail-drone-mission-studio/",
            kind: "external",
          },
          {
            label: "Mainland mirror",
            href: "https://fhrzz.me/projects/rail-drone-mission-studio/",
            kind: "external",
          },
        ],
      },
    ],
  },
};

const milestoneDateTime: Record<string, string> = {
  "first-code": "2019",
  "embedded-shift": "2025-10",
  "saturn-launch": "2026-04",
  "music-technology": "2026-05",
  "string-blade-recognition": "2026-07",
  "rail-drone-studio": "2026-07-10",
};

const journeyEntryVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.56, ease: [0.16, 1, 0.3, 1] },
  },
};

const journeyItemVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const journeyNodeVariants: Variants = {
  hidden: { opacity: 0.35, scale: 0.72 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.42, ease: [0.16, 1, 0.3, 1] },
  },
};

const journeyPulseVariants: Variants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: {
    opacity: [0, 0.72, 0],
    scale: [0.5, 1.7, 2.45],
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function V3Journey() {
  const { language } = useV3Language();
  const copy = journeyCopy[language];
  const routeRef = useRef<HTMLDivElement>(null);
  const reduceMotion = Boolean(useReducedMotion());
  const [compactRoute, setCompactRoute] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(max-width: 40rem)").matches
      : false,
  );
  const { scrollYProgress } = useScroll({
    target: routeRef,
    offset: ["start 72%", "end 62%"],
  });
  const routeProgress = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const staticRoute = reduceMotion || compactRoute;

  useEffect(() => {
    const media = window.matchMedia("(max-width: 40rem)");
    const update = () => setCompactRoute(media.matches);

    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return (
    <section className="v3-journey" id="journey" aria-labelledby="journey-title">
      <div className="v3-journey-inner">
        <header className="v3-journey-heading">
          <p className="v3-section-label">{copy.eyebrow}</p>
          <h2 id="journey-title">{copy.title}</h2>
          <p className="v3-journey-intro">{copy.intro}</p>
          <div className="v3-journey-range" aria-hidden="true">
            <span>
              <small>{copy.originLabel}</small>
              <strong>2019</strong>
            </span>
            <i />
            <span>
              <small>{copy.currentLabel}</small>
              <strong>NOW</strong>
            </span>
          </div>
        </header>

        <div className="v3-journey-route" ref={routeRef}>
          <div className="v3-journey-track" aria-hidden="true">
            <span />
            <motion.i
              style={{
                scaleY: staticRoute ? 1 : routeProgress,
                transformOrigin: "top",
              }}
            />
          </div>
          <ol aria-label={copy.routeLabel}>
            {copy.milestones.map((milestone, index) => (
              <motion.li
                className={milestone.current ? "is-current" : undefined}
                data-tone={milestone.tone}
                key={milestone.id}
                aria-current={milestone.current ? "step" : undefined}
                initial={reduceMotion ? false : "hidden"}
                whileInView={reduceMotion ? undefined : "visible"}
                viewport={{ once: true, amount: compactRoute ? 0.14 : 0.24 }}
                variants={journeyItemVariants}
              >
                <motion.span
                  className="v3-journey-node"
                  aria-hidden="true"
                  variants={journeyNodeVariants}
                >
                  <i />
                  <motion.span
                    className="v3-journey-node-pulse"
                    variants={journeyPulseVariants}
                  />
                </motion.span>

                <motion.article variants={journeyEntryVariants}>
                  <div className="v3-journey-meta">
                    <time dateTime={milestoneDateTime[milestone.id]}>{milestone.time}</time>
                    <span className="v3-journey-status">{milestone.status}</span>
                  </div>
                  <div className="v3-journey-entry">
                    <span className="v3-journey-entry-index" aria-hidden="true">
                      /{String(index + 1).padStart(2, "0")}
                    </span>
                    <h3>{milestone.title}</h3>
                    <dl className="v3-journey-copy">
                      <div>
                        <dt>{copy.workLabel}</dt>
                        <dd>{milestone.work}</dd>
                      </div>
                      <div>
                        <dt>{copy.outcomeLabel}</dt>
                        <dd>{milestone.outcome}</dd>
                      </div>
                    </dl>

                    {milestone.next ? (
                      <p className="v3-journey-next">
                        <span>{copy.nextLabel}</span>
                        {milestone.next}
                      </p>
                    ) : null}

                    {milestone.links?.length ? (
                      <div className="v3-journey-links">
                        {milestone.links.map((link) => {
                          const Icon = link.kind === "github" ? Github : ArrowUpRight;

                          return (
                            <a
                              href={link.href}
                              key={`${link.href}-${link.label}`}
                              target="_blank"
                              rel="noreferrer"
                              aria-label={`${link.label} · ${copy.newTabLabel}`}
                            >
                              <Icon aria-hidden="true" />
                              <span>{link.label}</span>
                            </a>
                          );
                        })}
                      </div>
                    ) : null}
                  </div>
                </motion.article>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
