const capabilities = [
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
];

export default function V3Capabilities() {
  return (
    <section className="v3-capabilities" id="capabilities" aria-labelledby="capabilities-title">
      <div className="v3-capabilities-inner">
        <p className="v3-section-label">Capabilities / what I build</p>
        <h2 id="capabilities-title">What I build</h2>
        <div className="v3-capability-list" role="list">
          {capabilities.map((capability, index) => (
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
