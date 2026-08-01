import { motion, useReducedMotion, type Variants } from "framer-motion";

type ChapterStrikeTone = "light" | "dark";

interface V3ChapterStrikeProps {
  tone: ChapterStrikeTone;
}

const strikeEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

const strikeSignalVariants: Variants = {
  hidden: { opacity: 0, x: "-120%" },
  visible: {
    opacity: [0, 1, 1, 0],
    x: ["-120%", "0%", "1800%", "1920%"],
    transition: { duration: 0.68, ease: strikeEase },
  },
};

/** A compact section boundary that gives the black/white rhythm a visible beat. */
export default function V3ChapterStrike({ tone }: V3ChapterStrikeProps) {
  const reduceMotion = Boolean(useReducedMotion());

  return (
    <motion.div
      className="v3-chapter-strike"
      data-tone={tone}
      aria-hidden="true"
      initial={reduceMotion ? false : "hidden"}
      whileInView={reduceMotion ? undefined : "visible"}
      viewport={{ once: true, amount: 0.28 }}
      variants={{
        hidden: {},
        visible: {
          transition: { delayChildren: 0.04, staggerChildren: 0.055 },
        },
      }}
    >
      <motion.i
        className="v3-chapter-strike-rail"
        variants={{
          hidden: { opacity: 0, scaleX: 0 },
          visible: {
            opacity: 1,
            scaleX: 1,
            transition: { duration: 0.72, ease: strikeEase },
          },
        }}
      />
      <span className="v3-chapter-strike-keys">
        {[0, 1, 2, 3, 4].map((key) => (
          <motion.i
            key={key}
            variants={{
              hidden: { opacity: 0, scaleY: 0.18 },
              visible: {
                opacity: 1,
                scaleY: 1,
                transition: { duration: 0.32, ease: strikeEase },
              },
            }}
          />
        ))}
      </span>
      <motion.i
        className="v3-chapter-strike-signal"
        variants={strikeSignalVariants}
      />
    </motion.div>
  );
}
