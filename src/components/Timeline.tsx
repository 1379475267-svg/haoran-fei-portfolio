import { timeline } from "../data/profile";
import SectionHeader from "./SectionHeader";

export default function Timeline() {
  return (
    <section id="timeline" className="soft-section soft-timeline">
      <div className="soft-shell soft-timeline-layout">
        <SectionHeader
          label="Timeline"
          title="A long direction, built in small steps."
          description="Music became a discipline. Engineering became a practice. Projects are where the two keep meeting."
        />

        <ol className="soft-timeline-list">
          {timeline.map((item) => (
            <li key={item.year} className={item.current ? "is-current" : undefined}>
              <time>{item.year}</time>
              <div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
