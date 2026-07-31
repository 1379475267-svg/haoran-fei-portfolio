import { motion, useReducedMotion, type Variants } from "framer-motion";
import { useV3Language } from "./V3Language";

const interludeVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.08,
      staggerChildren: 0.12,
    },
  },
};

const wordVariants: Variants = {
  hidden: { opacity: 0, y: "70%" },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.72,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const detailVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.56,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function V3SignalInterlude() {
  const { t } = useV3Language();
  const reduceMotion = Boolean(useReducedMotion());

  return (
    <motion.section
      className="v3-signal-interlude"
      id="flight-loop"
      aria-labelledby="signal-interlude-title"
      initial={reduceMotion ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount: 0.28 }}
      variants={interludeVariants}
    >
      <div className="v3-signal-interlude-inner">
        <motion.div className="v3-signal-interlude-meta" variants={detailVariants}>
          <p className="v3-section-label">{t.signalInterlude.eyebrow}</p>
          <span aria-hidden="true">01 — 03</span>
        </motion.div>

        <motion.div className="v3-signal-interlude-heading" variants={detailVariants}>
          <h2 className="v3-signal-interlude-title" id="signal-interlude-title">
            {t.signalInterlude.title}
          </h2>
          <p className="v3-signal-interlude-statement">{t.signalInterlude.statement}</p>
        </motion.div>

        <motion.div className="v3-signal-loop" role="list" variants={interludeVariants}>
          <span className="v3-signal-loop-rail" aria-hidden="true" />
          {t.signalInterlude.phases.map((phase, index) => (
            <motion.article
              className="v3-signal-loop-step"
              role="listitem"
              key={phase.word}
              variants={detailVariants}
            >
              <span className="v3-signal-loop-index">{String(index + 1).padStart(2, "0")}</span>
              <div className="v3-signal-loop-copy">
                <motion.strong variants={wordVariants}>{phase.word}</motion.strong>
                <p>{phase.caption}</p>
                <small>{phase.detail}</small>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
