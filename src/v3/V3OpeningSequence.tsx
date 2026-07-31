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

const OPENING_DURATION = 3.82;
const OPENING_CONTENT_READY_TIME = 2.78;
const OPENING_REVEAL_TIME = 3.08;
const OPENING_REVEAL_END_TIME = 3.58;
const OPENING_FADE_TIME = 3.64;
const REDUCED_OPENING_DURATION = 0.18;
const START_FALLBACK_DELAY = 800;

function clampUnit(value: number) {
  return Math.min(Math.max(value, 0), 1);
}

function easeOutQuad(value: number) {
  const progress = clampUnit(value);
  return 1 - (1 - progress) ** 2;
}

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
  const audioStartTimeRef = useRef(0);
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
  const openingRevealMask = useTransform(openingClock, (time) => {
    const progress = easeOutQuad(
      (time - OPENING_REVEAL_TIME) / (OPENING_REVEAL_END_TIME - OPENING_REVEAL_TIME),
    );
    // 72vmax reaches the far corner even on square viewports while preserving
    // a readable circular edge during the first half-beat of the reveal.
    const radius = 72 * progress;
    const edge = radius + 0.7;

    return `radial-gradient(circle at 50% 50%, transparent ${radius.toFixed(3)}vmax, #000 ${edge.toFixed(3)}vmax)`;
  });

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

    if (audio) {
      audioRef.current = audio;
      audioStartTimeRef.current = Number.isFinite(audio.currentTime)
        ? audio.currentTime
        : 0;
    }
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

    // onStart calls audio.play() in this click handler; its relative clock then
    // becomes the source of truth for each disappearing logo stroke.
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
      ? Math.max(0, audio.currentTime - audioStartTimeRef.current)
      : fallbackElapsed;

    openingClock.set(Math.min(elapsed, openingDuration));
    if (elapsed >= (reduceMotion ? 0 : OPENING_CONTENT_READY_TIME)) reveal();
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
      <motion.div
        className="v3-opening-veil"
        aria-hidden="true"
        initial={false}
        style={{
          WebkitMaskImage: openingRevealMask,
          maskImage: openingRevealMask,
        }}
      />
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
            openingMoon
            className="v3-brand-logo--opening"
            decorative
          />
        </span>
      </button>
    </motion.div>
  );
}
