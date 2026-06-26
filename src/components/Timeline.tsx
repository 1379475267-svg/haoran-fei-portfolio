import { motion } from "framer-motion";
import { timeline } from "../data/profile";
import SectionHeader from "./SectionHeader";

export default function Timeline() {
  return (
    <section id="timeline" className="section-space section-divider relative">
      <div className="section-shell">
        <SectionHeader
          eyebrow="05 / JOURNEY"
          title="Growth Timeline"
          description="A short record of interests becoming disciplines, and disciplines slowly becoming a personal direction."
        />

        <motion.div
          className="timeline-list mt-14"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          transition={{ staggerChildren: 0.1 }}
        >
          {timeline.map((item) => (
            <motion.article
              key={item.year}
              variants={{
                hidden: { opacity: 0, y: 24 },
                visible: { opacity: 1, y: 0 },
              }}
              className={`timeline-row ${item.current ? "is-current" : ""}`}
            >
              <div className="timeline-year">
                <span>{item.year}</span>
              </div>
              <div className="timeline-rail">
                <i />
              </div>
              <div className="timeline-content">
                {item.current && <span className="current-badge">CURRENT FOCUS</span>}
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
