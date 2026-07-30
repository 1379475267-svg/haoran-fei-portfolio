import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

const ENTER_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const LOCKUP_TIMES: [number, number, number, number] = [0, 0.23, 0.87, 1];
const ORBIT_TIMES: [number, number, number, number, number] = [
  0,
  0.2,
  0.72,
  0.9,
  1,
];
const VISIBLE_OPACITY_THRESHOLD = 0.26;
const OPENING_TIMING = {
  revealFallbackMs: 2400,
  completeFallbackMs: 4200,
  shutterDuration: 1.2,
  shutterDelay: 1.92,
  identityDuration: 1.6,
  lockupDuration: 1.82,
  lockupStagger: 0.14,
  orbitDuration: 2.4,
  orbitDelay: 0.4,
} as const;

export type OpeningCompletionReason = "natural" | "skipped";

interface V3OpeningSequenceProps {
  onComplete: (reason: OpeningCompletionReason) => void;
  onVisible: () => void;
  onReveal: () => void;
}

export default function V3OpeningSequence({
  onComplete,
  onVisible,
  onReveal,
}: V3OpeningSequenceProps) {
  const reduceMotion = Boolean(useReducedMotion());
  const [playbackActive, setPlaybackActive] = useState(
    () => typeof document === "undefined" || document.visibilityState === "visible",
  );
  const revealedRef = useRef(false);
  const visibleRef = useRef(false);
  const completedRef = useRef(false);

  const markVisible = useCallback(() => {
    if (visibleRef.current) return;
    visibleRef.current = true;
    onVisible();
  }, [onVisible]);

  const reveal = useCallback(() => {
    if (revealedRef.current) return;
    revealedRef.current = true;
    onReveal();
  }, [onReveal]);

  const finish = useCallback((reason: OpeningCompletionReason) => {
    if (completedRef.current) return;
    completedRef.current = true;
    if (reason === "natural") markVisible();
    reveal();
    onComplete(reason);
  }, [markVisible, onComplete, reveal]);

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

    const revealFallback = window.setTimeout(
      reveal,
      OPENING_TIMING.revealFallbackMs,
    );
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
      window.clearTimeout(revealFallback);
      window.clearTimeout(completeFallback);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [finish, playbackActive, reduceMotion, reveal, skip]);

  return (
    <div
      className="v3-opening"
      aria-hidden="true"
      onPointerDown={skip}
      onWheel={skip}
    >
      {playbackActive ? (
        <>
          <motion.div
            className="v3-opening-shutter v3-opening-shutter-top"
            initial={{ y: 0 }}
            animate={{ y: "-101%" }}
            transition={{
              duration: OPENING_TIMING.shutterDuration,
              delay: OPENING_TIMING.shutterDelay,
              ease: ENTER_EASE,
            }}
          />
          <motion.div
            className="v3-opening-shutter v3-opening-shutter-bottom"
            initial={{ y: 0 }}
            animate={{ y: "101%" }}
            transition={{
              duration: OPENING_TIMING.shutterDuration,
              delay: OPENING_TIMING.shutterDelay,
              ease: ENTER_EASE,
            }}
            onAnimationComplete={() => finish("natural")}
          />

          <motion.div
            className="v3-opening-identity"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: [0, 1, 1, 0], y: [8, 0, 0, -6] }}
            transition={{
              duration: OPENING_TIMING.identityDuration,
              times: [0, 0.22, 0.68, 1],
              ease: ENTER_EASE,
            }}
            onAnimationComplete={reveal}
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
                  duration: OPENING_TIMING.lockupDuration,
                  times: LOCKUP_TIMES,
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
                  duration: OPENING_TIMING.lockupDuration,
                  delay: OPENING_TIMING.lockupStagger,
                  times: LOCKUP_TIMES,
                  ease: ENTER_EASE,
                }}
              >
                FEI
              </motion.strong>
            </span>
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
            onUpdate={(latest) => {
              if (
                typeof latest.opacity === "number"
                && latest.opacity >= VISIBLE_OPACITY_THRESHOLD
              ) {
                markVisible();
              }
            }}
          />
        </>
      ) : null}
    </div>
  );
}
