import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import V3BrandLogo from "./V3BrandLogo";

const OPENING_DURATION = 3.2;
const OPENING_REVEAL_TIME = 2.66;
const OPENING_FADE_TIME = 2.95;
const REDUCED_OPENING_DURATION = 0.18;
const START_FALLBACK_DELAY = 800;

export type OpeningCompletionReason = "natural" | "skipped";

interface V3OpeningSequenceProps {
  onComplete: (reason: OpeningCompletionReason) => void;
  onReveal: () => void;
  onStart: () => Promise<HTMLAudioElement | null>;
}

export default function V3OpeningSequence({
  onComplete,
  onReveal,
  onStart,
}: V3OpeningSequenceProps) {
  const reduceMotion = Boolean(useReducedMotion());
  const [phase, setPhase] = useState<"idle" | "erasing">("idle");
  const startedRef = useRef(false);
  const eraseStartedRef = useRef(false);
  const revealedRef = useRef(false);
  const completedRef = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fallbackStartRef = useRef(0);
  const startFallbackRef = useRef<number | null>(null);
  const openingClock = useMotionValue(0);
  const openingDuration = reduceMotion
    ? REDUCED_OPENING_DURATION
    : OPENING_DURATION;
  const openingOpacity = useTransform(
    openingClock,
    reduceMotion
      ? [0, 0.01, REDUCED_OPENING_DURATION]
      : [0, OPENING_FADE_TIME, OPENING_DURATION],
    [1, 1, 0],
  );

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

  const beginErasing = useCallback((audio: HTMLAudioElement | null) => {
    if (eraseStartedRef.current) return;

    if (audio) audioRef.current = audio;
    eraseStartedRef.current = true;
    fallbackStartRef.current = performance.now();
    openingClock.set(0);
    setPhase("erasing");
  }, [openingClock]);

  const start = useCallback(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    startFallbackRef.current = window.setTimeout(
      () => beginErasing(null),
      reduceMotion ? 0 : START_FALLBACK_DELAY,
    );

    // onStart calls audio.play() in this click handler; the resolved player clock
    // then becomes the source of truth for each disappearing logo stroke.
    void onStart().then(
      (audio) => beginErasing(audio),
      () => beginErasing(null),
    );
  }, [beginErasing, onStart, reduceMotion]);

  useEffect(() => {
    return () => {
      if (startFallbackRef.current !== null) {
        window.clearTimeout(startFallbackRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (phase !== "erasing") return undefined;
    if (startFallbackRef.current !== null) {
      window.clearTimeout(startFallbackRef.current);
      startFallbackRef.current = null;
    }

    const hardFallback = window.setTimeout(
      () => finish("natural"),
      Math.ceil((openingDuration + 1.2) * 1000),
    );

    return () => window.clearTimeout(hardFallback);
  }, [finish, openingDuration, phase]);

  useAnimationFrame(() => {
    if (phase !== "erasing" || completedRef.current) return;

    const audio = audioRef.current;
    const fallbackElapsed = (performance.now() - fallbackStartRef.current) / 1000;
    const elapsed = (
      !reduceMotion
      && audio
      && !audio.paused
      && Number.isFinite(audio.currentTime)
    )
      ? audio.currentTime
      : fallbackElapsed;

    openingClock.set(Math.min(elapsed, openingDuration));
    if (elapsed >= (reduceMotion ? 0 : OPENING_REVEAL_TIME)) reveal();
    if (elapsed >= openingDuration) finish("natural");
  });

  return (
    <motion.div
      className="v3-opening"
      data-phase={phase}
      role="dialog"
      aria-modal="true"
      aria-label="Portfolio entry"
      initial={false}
      style={{ opacity: phase === "erasing" ? openingOpacity : 1 }}
    >
      <button
        className="v3-opening-entry"
        type="button"
        aria-label="Enter Haoran Fei's portfolio and start background music"
        title="Enter portfolio"
        disabled={phase === "erasing"}
        onClick={start}
        onKeyDown={(event) => {
          if (event.key === "Tab") {
            event.preventDefault();
            return;
          }
          if (event.key !== "Enter" && event.key !== " ") return;
          event.preventDefault();
          start();
        }}
      >
        <span className="v3-opening-logo-frame">
          <V3BrandLogo
            animationMode={phase === "erasing" ? "erase" : "static"}
            eraseTimeline={phase === "erasing" ? openingClock : undefined}
            className="v3-brand-logo--opening"
            decorative
          />
        </span>
      </button>
    </motion.div>
  );
}
