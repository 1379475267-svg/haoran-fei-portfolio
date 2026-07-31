import { motion, useReducedMotion, type Variants } from "framer-motion";
import { useV3Language } from "./V3Language";
import V3ChapterStrike from "./V3ChapterStrike";

const aboutEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

const aboutSequenceVariants: Variants = {
  hidden: {},
  visible: {
    transition: { delayChildren: 0.04, staggerChildren: 0.11 },
  },
};

const aboutTitleVariants: Variants = {
  hidden: { opacity: 0, y: 16, clipPath: "inset(0 0 100% 0)" },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.56, ease: aboutEase },
  },
};

const aboutCopyVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const aboutCopyItemVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.58, ease: aboutEase },
  },
};

const aboutBridgeVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.56, ease: aboutEase },
  },
};

export default function V3About() {
  const { t } = useV3Language();
  const reduceMotion = Boolean(useReducedMotion());

  return (
    <section className="v3-about" id="about" aria-labelledby="about-title">
      <V3ChapterStrike tone="dark" />
      <div className="v3-about-orbit v3-about-orbit-one" aria-hidden="true"><i /></div>
      <div className="v3-about-orbit v3-about-orbit-two" aria-hidden="true"><i /></div>
      <span className="v3-about-cross v3-about-cross-one" aria-hidden="true">+</span>
      <span className="v3-about-cross v3-about-cross-two" aria-hidden="true">+</span>
      <motion.div
        className="v3-about-inner"
        initial={reduceMotion ? false : "hidden"}
        whileInView={reduceMotion ? undefined : "visible"}
        viewport={{ once: true, amount: 0.32 }}
        variants={aboutSequenceVariants}
      >
        <p className="v3-section-label">{t.about.eyebrow}</p>
        <motion.h2 id="about-title" variants={aboutTitleVariants}>
          {t.about.title}
        </motion.h2>
        <motion.div className="v3-about-copy" variants={aboutCopyVariants}>
          <motion.p variants={aboutCopyItemVariants}>{t.about.lead}</motion.p>
          <motion.p variants={aboutCopyItemVariants}>{t.about.priority}</motion.p>
        </motion.div>
        <motion.div className="v3-about-bridge" variants={aboutBridgeVariants}>
          <span>{t.about.bridgeLabel}</span>
          <p>{t.about.bridge}</p>
          <i aria-hidden="true" />
        </motion.div>
      </motion.div>
    </section>
  );
}
