import { motion } from "framer-motion";
import { useCallback, useEffect, useRef } from "react";

const ENTER_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const REVEAL_DELAY = 1400;
const COMPLETE_DELAY = 2850;

interface V3OpeningSequenceProps {
  onComplete: () => void;
  onReveal: () => void;
}

export default function V3OpeningSequence({
  onComplete,
  onReveal,
}: V3OpeningSequenceProps) {
  const revealedRef = useRef(false);
  const completedRef = useRef(false);

  const reveal = useCallback(() => {
    if (revealedRef.current) return;
    revealedRef.current = true;
    onReveal();
  }, [onReveal]);

  const finish = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    reveal();
    onComplete();
  }, [onComplete, reveal]);

  useEffect(() => {
    const revealTimer = window.setTimeout(reveal, REVEAL_DELAY);
    const completeTimer = window.setTimeout(finish, COMPLETE_DELAY);
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") finish();
      if (event.key === "Tab") finish();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.clearTimeout(revealTimer);
      window.clearTimeout(completeTimer);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [finish, reveal]);

  return (
    <div
      className="v3-opening"
      aria-hidden="true"
      onPointerDown={finish}
      onWheel={finish}
    >
      <motion.div
        className="v3-opening-shutter v3-opening-shutter-top"
        initial={{ y: 0 }}
        animate={{ y: "-101%" }}
        transition={{ duration: 1.05, delay: 1.55, ease: ENTER_EASE }}
      />
      <motion.div
        className="v3-opening-shutter v3-opening-shutter-bottom"
        initial={{ y: 0 }}
        animate={{ y: "101%" }}
        transition={{ duration: 1.05, delay: 1.55, ease: ENTER_EASE }}
      />

      <motion.div
        className="v3-opening-identity"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: [0, 1, 1, 0], y: [8, 0, 0, -6] }}
        transition={{
          duration: 1.45,
          times: [0, 0.22, 0.68, 1],
          ease: ENTER_EASE,
        }}
      >
        <span>HF / V03</span>
        <span>31.2304 N / SIGNAL READY</span>
      </motion.div>

      <div className="v3-opening-lockup">
        <span>
          <motion.strong
            initial={{ y: "112%" }}
            animate={{ y: ["112%", "0%", "0%", "-112%"] }}
            transition={{
              duration: 1.55,
              times: [0, 0.24, 0.72, 1],
              ease: ENTER_EASE,
            }}
          >
            HAORAN
          </motion.strong>
        </span>
        <span>
          <motion.strong
            initial={{ y: "112%" }}
            animate={{ y: ["112%", "0%", "0%", "-112%"] }}
            transition={{
              duration: 1.55,
              delay: 0.12,
              times: [0, 0.24, 0.72, 1],
              ease: ENTER_EASE,
            }}
          >
            FEI
          </motion.strong>
        </span>
      </div>

      <motion.span
        className="v3-opening-signal"
        initial={{ opacity: 0, scale: 0.72 }}
        animate={{ opacity: [0, 1, 0], scale: [0.72, 1, 1.34] }}
        transition={{
          duration: 1.05,
          delay: 0.35,
          times: [0, 0.45, 1],
          ease: ENTER_EASE,
        }}
      />

      <motion.div
        className="v3-opening-sweep"
        initial={{ x: "-112%" }}
        animate={{ x: "112%" }}
        transition={{ duration: 1.7, delay: 0.75, ease: ENTER_EASE }}
      >
        <span>HF / AUTONOMOUS FLIGHT</span>
      </motion.div>
    </div>
  );
}
