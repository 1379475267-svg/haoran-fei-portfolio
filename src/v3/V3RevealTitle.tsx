import { motion, useReducedMotion, type Variants } from "framer-motion";

type LetterTiming = { delay: number; duration: number };

const letter: Variants = {
  hidden: { y: "112%", opacity: 0 },
  visible: (timing: LetterTiming) => ({
    y: "0%",
    opacity: 1,
    transition: { delay: timing.delay, duration: timing.duration, ease: [0.22, 1, 0.36, 1] },
  }),
};

/** One accessible label; its ornamental characters reveal once through a mask. */
export default function V3RevealTitle({ text, ready, className = "", slow = false, delay = 0 }: { text: string; ready?: boolean; className?: string; slow?: boolean; delay?: number }) {
  const reduced = Boolean(useReducedMotion());
  const delayStep = slow
    ? Math.min(0.06, 0.55 / Math.max(1, Array.from(text).length))
    : Math.min(0.035, 0.3 / Math.max(1, Array.from(text).length));
  const duration = slow ? 1.12 : 0.8;
  // Keep Latin words together, while Chinese characters retain natural wrap points.
  const tokens = text.match(/[A-Za-z0-9]+(?:[’'-][A-Za-z0-9]+)*[.,!?;:]?|\s+|./gu) ?? [];
  let characterIndex = 0;
  const characters = tokens.map((token, tokenIndex) => {
    const offset = characterIndex;
    characterIndex += Array.from(token).length;
    if (/^\s+$/u.test(token)) {
      return <span aria-hidden="true" key={`space-${tokenIndex}`}>{token}</span>;
    }
    const letters = Array.from(token).map((character, index) => (
      <span className="journal-letter-mask" aria-hidden="true" key={`${character}-${offset + index}`}>
        <motion.span
          variants={letter}
          custom={{ delay: reduced ? 0 : delay + (offset + index) * delayStep, duration: reduced ? 0 : duration }}
        >{character}</motion.span>
      </span>
    ));
    return /^[A-Za-z0-9]/u.test(token)
      ? <span className="journal-word" aria-hidden="true" key={`word-${tokenIndex}`}>{letters}</span>
      : <span className="journal-character" aria-hidden="true" key={`character-${tokenIndex}`}>{letters}</span>;
  });
  return (
    <motion.span className={`journal-reveal ${className}`}
      initial={reduced ? false : "hidden"}
      animate={reduced || ready === true ? "visible" : ready === false ? "hidden" : undefined}
      whileInView={ready === undefined && !reduced ? "visible" : undefined}
      viewport={{ once: true, amount: 0.4 }}
      variants={{ hidden: {}, visible: {} }}>
      <span className="journal-sr-only">{text}</span>
      {characters}
    </motion.span>
  );
}
