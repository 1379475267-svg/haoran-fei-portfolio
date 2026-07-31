import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import V3BrandLogo from "./V3BrandLogo";

const ENTER_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const ORBIT_TIMES: [number, number, number, number, number] = [
  0,
  0.2,
  0.72,
  0.9,
  1,
];
const OPENING_TIMING = {
  duration: 3,
  completeFallbackMs: 3400,
  identityDuration: 2.28,
  orbitDuration: 2.42,
  orbitDelay: 0.12,
} as const;

export type OpeningCompletionReason = "natural" | "skipped";

interface V3OpeningSequenceProps {
  onComplete: (reason: OpeningCompletionReason) => void;
  onReveal: () => void;
}

export default function V3OpeningSequence({
  onComplete,
  onReveal,
}: V3OpeningSequenceProps) {
  const reduceMotion = Boolean(useReducedMotion());
  const [playbackActive, setPlaybackActive] = useState(
    () => typeof document === "undefined" || document.visibilityState === "visible",
  );
  const revealedRef = useRef(false);
  const completedRef = useRef(false);

  const reveal = useCallback(() => {
    if (revealedRef.current) return;
    revealedRef.current = true;
    onReveal();
  }, [onReveal]);

  const finish = useCallback((reason: OpeningCompletionReason) => {
    if (completedRef.current) return;
    completedRef.current = true;
    reveal();
    onComplete(reason);
  }, [onComplete, reveal]);

  const skip = useCallback(() => {
    finish("skipped");
  }, [finish]);

  useEffect(() => {
    const syncPlaybackVisibility = () => {
      setPlaybackActive(document.visibilityState === "visible");
    };

    syncPlaybackVisibility();
    document.addEventListener("visibilitychange", syncPlaybackVisibility);
    return () => {
      document.removeEventListener("visibilitychange", syncPlaybackVisibility);
    };
  }, []);

  useEffect(() => {
    if (!playbackActive) return undefined;

    if (reduceMotion) {
      finish("natural");
      return undefined;
    }

    const completeFallback = window.setTimeout(
      () => finish("natural"),
      OPENING_TIMING.completeFallbackMs,
    );
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") skip();
      if (event.key === "Tab") skip();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.clearTimeout(completeFallback);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [finish, playbackActive, reduceMotion, reveal, skip]);

  return (
    <motion.div
      className="v3-opening"
      aria-hidden="true"
      initial={{ opacity: 1 }}
      animate={playbackActive && !reduceMotion ? { opacity: [1, 1, 0] } : { opacity: 1 }}
      transition={{
        duration: OPENING_TIMING.duration,
        times: [0, 0.74, 1],
        ease: "linear",
      }}
      onAnimationComplete={() => {
        if (playbackActive && !reduceMotion) finish("natural");
      }}
      onPointerDown={skip}
      onWheel={skip}
    >
      {playbackActive ? (
        <>
          <div className="v3-opening-shutter v3-opening-shutter-top" />
          <div className="v3-opening-shutter v3-opening-shutter-bottom" />

          <motion.div
            className="v3-opening-identity"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: [0, 1, 1, 0], y: [8, 0, 0, -6] }}
            transition={{
              duration: OPENING_TIMING.identityDuration,
              times: [0, 0.12, 0.82, 1],
              ease: ENTER_EASE,
            }}
          >
            <span>HF / V03</span>
            <span>31.2304 N / SIGNAL READY</span>
          </motion.div>

          <div className="v3-opening-brand">
            <motion.div
              className="v3-opening-brand-inner"
              initial={{ opacity: 0, y: 8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.28, ease: ENTER_EASE }}
            >
              <V3BrandLogo
                animated
                className="v3-brand-logo--opening"
                decorative
              />
              <span className="v3-opening-brand-label">HAORAN FEI / FLIGHT SYSTEMS</span>
            </motion.div>
          </div>

          <motion.div
            className="v3-opening-orbit"
            initial={{ opacity: 0, x: -32, rotate: -14, scale: 0.98 }}
            animate={{
              opacity: [0, 0.58, 0.52, 0.22, 0],
              x: [-32, -18, 5, 20, 30],
              rotate: [-14, -12.5, -10.5, -9, -8],
              scale: [0.98, 0.992, 1, 1.012, 1.02],
            }}
            transition={{
              duration: OPENING_TIMING.orbitDuration,
              delay: OPENING_TIMING.orbitDelay,
              times: ORBIT_TIMES,
              ease: ENTER_EASE,
            }}
          />
        </>
      ) : null}
    </motion.div>
  );
}
