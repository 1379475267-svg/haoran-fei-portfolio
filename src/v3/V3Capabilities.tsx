import { useV3Language, type V3Language } from "./V3Language";

const capabilities: Record<V3Language, Array<{ area: string; description: string; tools: string }>> = {
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

export default function V3Capabilities() {
  const { language, t } = useV3Language();

  return (
    <section className="v3-capabilities" id="capabilities" aria-labelledby="capabilities-title">
      <div className="v3-capabilities-inner">
        <p className="v3-section-label">{t.capabilities.eyebrow}</p>
        <h2 id="capabilities-title">{t.capabilities.title}</h2>
        <div className="v3-capability-list" role="list">
          {capabilities[language].map((capability, index) => (
            <article className="v3-capability-row" role="listitem" key={capability.area}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{capability.area}</h3>
              <p>{capability.description}</p>
              <small>{capability.tools}</small>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
