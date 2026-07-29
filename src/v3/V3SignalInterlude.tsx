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
      duration: 0.82,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const detailVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.58,
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

        <h2
          className="v3-signal-interlude-title"
          id="signal-interlude-title"
          aria-label={t.signalInterlude.title}
        >
          {t.signalInterlude.phases.map((phase, index) => (
            <span className="v3-signal-interlude-line" key={phase.word}>
              <motion.span
                className={index === 1 ? "is-outline" : undefined}
                variants={wordVariants}
              >
                {phase.word}
              </motion.span>
              {index < t.signalInterlude.phases.length - 1 ? (
                <span className="v3-signal-interlude-slash" aria-hidden="true">
                  /
                </span>
              ) : null}
            </span>
          ))}
        </h2>

        <motion.p className="v3-signal-interlude-statement" variants={detailVariants}>
          {t.signalInterlude.statement}
        </motion.p>

        <motion.div
          className="v3-signal-route"
          aria-hidden="true"
          variants={detailVariants}
        >
          <motion.span
            className="v3-signal-route-line"
            initial={reduceMotion ? false : { scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.7 }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.24 }
            }
          />
          {t.signalInterlude.phases.map((phase, index) => (
            <i
              className="v3-signal-route-node"
              data-phase={String(index + 1).padStart(2, "0")}
              key={phase.word}
            />
          ))}
        </motion.div>

        <motion.div
          className="v3-signal-interlude-phases"
          role="list"
          variants={interludeVariants}
        >
          {t.signalInterlude.phases.map((phase, index) => (
            <motion.div
              className="v3-signal-interlude-phase"
              role="listitem"
              key={phase.word}
              variants={detailVariants}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <p>{phase.caption}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
