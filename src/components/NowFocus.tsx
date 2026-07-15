import { focusItems } from "../data/profile";
import SectionHeader from "./SectionHeader";

export default function NowFocus() {
  return (
    <section id="now" className="soft-section soft-now">
      <div className="soft-shell">
        <SectionHeader
          label="Now"
          title="The current work is specific."
          description="A live snapshot of what I am trying to understand, validate, and document inside the drone project."
        />

        <div className="soft-focus-list">
          {focusItems.map((item) => (
            <article key={item.title} className="soft-focus-row">
              <span>{item.index}</span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
              <ul aria-label={`${item.title} topics`}>
                {item.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
