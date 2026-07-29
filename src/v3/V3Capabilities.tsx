import {
  AudioWaveform,
  Braces,
  Cpu,
  Route,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { useV3Language, type V3Language } from "./V3Language";

type SignalKind = "flight" | "pulse" | "mesh" | "branch" | "wave";

interface Capability {
  area: string;
  description: string;
  tools: string;
  icon: LucideIcon;
  image: string;
  signal: SignalKind;
}

const capabilityFacts: Record<
  V3Language,
  Array<Pick<Capability, "area" | "description" | "tools">>
> = {
  zh: [
    {
      area: "自主飞行",
      description: "阅读并测试激光雷达飞行栈，从建图、局部规划一直连接到 PX4 控制。",
      tools: "ROS 1 / PX4 / Faster-LIO",
    },
    {
      area: "嵌入式系统",
      description: "把传感器、控制逻辑与硬件反馈组合成目标清晰、可以验证的原型。",
      tools: "C / STM32 / 传感器",
    },
    {
      area: "Web 界面",
      description: "为项目构建清晰的浏览器界面，并探索具有交互性的视觉表达。",
      tools: "React / TypeScript / Three.js",
    },
    {
      area: "AI 编程工作流",
      description: "使用 AI 工具辅助原型、重构、文档整理与复杂技术任务拆解。",
      tools: "Python / Git / Codex",
    },
    {
      area: "音乐技术",
      description: "把长期音乐练习与听音、乐理和分析工具连接起来。",
      tools: "音频分析 / 吉他 / 钢琴",
    },
  ],
  en: [
    {
      area: "Autonomous flight",
      description: "Reading and testing a LiDAR flight stack from mapping through local planning and PX4 control.",
      tools: "ROS 1 / PX4 / Faster-LIO",
    },
    {
      area: "Embedded systems",
      description: "Turning sensors, control logic, and hardware feedback into focused working prototypes.",
      tools: "C / STM32 / Sensors",
    },
    {
      area: "Web interfaces",
      description: "Building clear project interfaces and interactive visual experiments for the browser.",
      tools: "React / TypeScript / Three.js",
    },
    {
      area: "AI coding workflow",
      description: "Using AI tools for prototyping, refactoring, documentation, and technical task breakdowns.",
      tools: "Python / Git / Codex",
    },
    {
      area: "Music technology",
      description: "Connecting long-term music practice with small tools for listening, theory, and analysis.",
      tools: "Audio analysis / Guitar / Piano",
    },
  ],
};

const capabilityVisuals: Array<Pick<Capability, "icon" | "image" | "signal">> = [
  {
    icon: Route,
    image: "/media/capability-autonomous-flight.webp",
    signal: "flight",
  },
  {
    icon: Cpu,
    image: "/media/capability-embedded-systems.webp",
    signal: "pulse",
  },
  {
    icon: Braces,
    image: "/media/capability-web-interfaces.webp",
    signal: "mesh",
  },
  {
    icon: Workflow,
    image: "/media/capability-ai-workflow.webp",
    signal: "branch",
  },
  {
    icon: AudioWaveform,
    image: "/media/capability-music-technology.webp",
    signal: "wave",
  },
];

const capabilityEpisodeVariants: Variants = {
  hidden: { opacity: 0, y: 48 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.68,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const capabilityImageVariants: Variants = {
  hidden: { opacity: 0.78, scale: 1.04 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.9,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const capabilitySignalVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 0.18,
    transition: { delay: 0.18, duration: 0.32 },
  },
};

const capabilityAxisVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 0.28,
    transition: { delay: 0.26, duration: 0.3 },
  },
};

const capabilityTraceVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { delay: 0.32, duration: 0.38 },
  },
};

const capabilityNodeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: (node: number) => ({
    opacity: 1,
    transition: { delay: 0.44 + node * 0.09, duration: 0.2 },
  }),
};

export default function V3Capabilities() {
  const { language, t } = useV3Language();
  const reduceMotion = Boolean(useReducedMotion());
  const capabilities: Capability[] = capabilityFacts[language].map((capability, index) => ({
    ...capability,
    ...capabilityVisuals[index],
  }));

  return (
    <section className="v3-capabilities" id="capabilities" aria-labelledby="capabilities-title">
      <div className="v3-capabilities-inner">
        <div className="v3-capabilities-heading">
          <p className="v3-section-label">{t.capabilities.eyebrow}</p>
          <h2 id="capabilities-title">{t.capabilities.title}</h2>
          <span aria-hidden="true">01 — 05</span>
        </div>

        <div className="v3-capability-episodes" role="list">
          {capabilities.map((capability, index) => {
            const Icon = capability.icon;

            return (
              <motion.article
                className={`v3-capability-episode${index % 2 === 1 ? " is-reversed" : ""}`}
                role="listitem"
                key={capability.signal}
                initial={reduceMotion ? false : "hidden"}
                whileInView={reduceMotion ? undefined : "visible"}
                viewport={{ once: true, amount: 0.26 }}
                variants={capabilityEpisodeVariants}
              >
                <div className="v3-capability-episode-visual" aria-hidden="true">
                  <motion.img
                    className="v3-capability-image"
                    src={capability.image}
                    alt=""
                    width={1536}
                    height={1024}
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                    variants={capabilityImageVariants}
                  />
                  <span className="v3-capability-episode-index">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <Icon className="v3-capability-icon" strokeWidth={1.35} />
                  <motion.div
                    className={`v3-capability-signal v3-capability-signal--${capability.signal}`}
                    variants={capabilitySignalVariants}
                  >
                    <motion.span
                      className="v3-capability-signal-axis"
                      variants={capabilityAxisVariants}
                    />
                    <motion.span
                      className="v3-capability-signal-trace"
                      variants={capabilityTraceVariants}
                    />
                    {[0, 1, 2, 3].map((node) => (
                      <motion.i
                        className="v3-capability-signal-node"
                        custom={node}
                        key={node}
                        variants={capabilityNodeVariants}
                      />
                    ))}
                  </motion.div>
                </div>

                <div className="v3-capability-episode-copy">
                  <span className="v3-capability-episode-number" aria-hidden="true">
                    / {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3>{capability.area}</h3>
                  <p className="v3-capability-description">{capability.description}</p>
                  <p className="v3-capability-tools">{capability.tools}</p>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
