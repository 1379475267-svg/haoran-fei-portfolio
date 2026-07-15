import { skills, techStack } from "../data/profile";
import Reveal from "./Reveal";
import SectionHeader from "./SectionHeader";

export default function Skills() {
  return (
    <section id="skills" className="soft-section soft-skills">
      <Reveal className="soft-shell soft-skills-layout">
        <div className="soft-skills-intro">
          <SectionHeader
            label="Capabilities"
            title="Hardware, software, and expression share one workbench."
            description="These are working capabilities shaped by active projects—not fixed scores or decorative progress bars."
          />

          <div className="soft-tech-cloud" aria-label="Technology stack">
            {techStack.map((tech) => (
              <span key={tech}>{tech}</span>
            ))}
          </div>
        </div>

        <div className="soft-skill-list">
          {skills.map(({ title, description, level, icon: Icon }) => (
            <article key={title} className="soft-skill-row">
              <span className="soft-skill-icon" aria-hidden="true">
                <Icon size={19} />
              </span>
              <div>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
              <span className="soft-skill-level">{level}</span>
            </article>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
