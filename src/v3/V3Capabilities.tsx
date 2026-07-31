import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Bot, Code2, Cpu, Music2, Sparkles } from "lucide-react";
import { useV3Language, type V3Language } from "./V3Language";
import V3ChapterStrike from "./V3ChapterStrike";

interface Capability {
  area: string;
  description: string;
  tools: string;
}

const capabilityIcons = [Bot, Cpu, Code2, Sparkles, Music2];

const capabilityFacts: Record<V3Language, Capability[]> = {
  zh: [
    {
      area: "自主飞行",
      description:
        "从激光雷达定位建图，到局部规划和 PX4 控制，以仿真先行、实机分阶段验证来推进系统。",
      tools: "ROS 1 / PX4 / Faster-LIO / Diff-Planner",
    },
    {
      area: "嵌入式系统",
      description:
        "把传感器输入、控制逻辑与硬件反馈收束成可测量、可复现的工作原型。",
      tools: "C / STM32 / Sensors",
    },
    {
      area: "Web 工程",
      description:
        "用现代前端技术构建能部署、能维护，也能清晰讲述复杂项目的交互界面。",
      tools: "React / Vue / TypeScript / Three.js",
    },
    {
      area: "AI 协作开发",
      description:
        "让 AI 参与任务拆解、原型、重构与文档，同时把判断、验证和版本记录留在工程流程里。",
      tools: "Python / Git / Codex",
    },
    {
      area: "音乐技术",
      description:
        "把长期吉他与钢琴练习转化为和弦分析、音乐可视化与实时输入工具。",
      tools: "Web Audio / Web MIDI / librosa",
    },
  ],
  en: [
    {
      area: "Autonomous flight",
      description:
        "Connecting LiDAR localization and mapping to local planning and PX4 control, with simulation-first and staged hardware validation.",
      tools: "ROS 1 / PX4 / Faster-LIO / Diff-Planner",
    },
    {
      area: "Embedded systems",
      description:
        "Turning sensor input, control logic, and hardware feedback into measurable, reproducible working prototypes.",
      tools: "C / STM32 / Sensors",
    },
    {
      area: "Web engineering",
      description:
        "Building deployable, maintainable interfaces that make complex project systems legible and interactive.",
      tools: "React / Vue / TypeScript / Three.js",
    },
    {
      area: "AI-assisted development",
      description:
        "Using AI for task breakdown, prototyping, refactoring, and documentation while keeping judgment and verification in the engineering loop.",
      tools: "Python / Git / Codex",
    },
    {
      area: "Music technology",
      description:
        "Translating long-term guitar and piano practice into chord analysis, music visualization, and live-input tools.",
      tools: "Web Audio / Web MIDI / librosa",
    },
  ],
};

const listVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.06,
      staggerChildren: 0.07,
    },
  },
};

const rowVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.46,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const markerVariants: Variants = {
  hidden: { opacity: 0, scale: 0.72, clipPath: "inset(0 0 100% 0)" },
  visible: {
    opacity: 1,
    scale: 1,
    clipPath: "inset(0 0 0% 0)",
    transition: { delay: 0.1, duration: 0.42, ease: [0.16, 1, 0.3, 1] },
  },
};

const iconVariants: Variants = {
  hidden: { opacity: 0, y: 5, rotate: -8 },
  visible: {
    opacity: 1,
    y: 0,
    rotate: 0,
    transition: { delay: 0.17, duration: 0.38, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function V3Capabilities() {
  const { language, t } = useV3Language();
  const reduceMotion = Boolean(useReducedMotion());

  return (
    <section className="v3-capabilities" id="capabilities" aria-labelledby="capabilities-title">
      <V3ChapterStrike tone="dark" />
      <div className="v3-capabilities-inner">
        <div className="v3-capabilities-heading">
          <p className="v3-section-label">{t.capabilities.eyebrow}</p>
          <h2 id="capabilities-title">{t.capabilities.title}</h2>
        </div>

        <motion.div
          className="v3-capability-list"
          role="list"
          initial={reduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, amount: 0.22 }}
          variants={listVariants}
        >
          {capabilityFacts[language].map((capability, index) => {
            const Icon = capabilityIcons[index];

            return (
              <motion.article
                className="v3-capability-row"
                role="listitem"
                key={capability.area}
                variants={rowVariants}
                data-capability-index={index + 1}
              >
                <motion.div className="v3-capability-marker" aria-hidden="true" variants={markerVariants}>
                  <span>/{String(index + 1).padStart(2, "0")}</span>
                  <motion.span className="v3-capability-icon-frame" variants={iconVariants}>
                    <Icon className="v3-capability-mark-icon" strokeWidth={1.6} />
                  </motion.span>
                </motion.div>
                <div>
                  <h3>{capability.area}</h3>
                  <p>{capability.description}</p>
                </div>
                <small>{capability.tools}</small>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
