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
const OPENING_REVEAL_LOGO_END_TIME = 3.13;
const OPENING_REVEAL_HOLD_END_TIME = 3.28;
const OPENING_REVEAL_END_TIME = 3.66;
const OPENING_FADE_TIME = 3.66;
const REDUCED_OPENING_DURATION = 0.18;
const START_FALLBACK_DELAY = 800;

function clampUnit(value: number) {
  return Math.min(Math.max(value, 0), 1);
}

function smoothstep(value: number) {
  const progress = clampUnit(value);
  return progress * progress * (3 - 2 * progress);
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
  const revealGeometryLockedRef = useRef(false);
  const openingClock = useMotionValue(0);
  const revealOriginX = useMotionValue(0);
  const revealOriginY = useMotionValue(0);
  const revealLogoRadius = useMotionValue(0);
  const revealMaxRadius = useMotionValue(0);
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
  const openingRevealMask = useTransform(() => {
    const time = openingClock.get();
    const logoRadius = revealLogoRadius.get();
    let radius = 0;

    if (time <= OPENING_REVEAL_LOGO_END_TIME) {
      const logoProgress = smoothstep(
        (time - OPENING_REVEAL_TIME)
          / (OPENING_REVEAL_LOGO_END_TIME - OPENING_REVEAL_TIME),
      );
      radius = logoRadius * logoProgress;
    } else if (time <= OPENING_REVEAL_HOLD_END_TIME) {
      radius = logoRadius;
    } else {
      const revealProgress = smoothstep(
        (time - OPENING_REVEAL_HOLD_END_TIME)
          / (OPENING_REVEAL_END_TIME - OPENING_REVEAL_HOLD_END_TIME),
      );
      radius = logoRadius
        + (revealMaxRadius.get() - logoRadius) * revealProgress;
    }
    const edge = radius + 0.7;

    return `radial-gradient(circle at ${revealOriginX.get().toFixed(2)}px ${revealOriginY.get().toFixed(2)}px, transparent ${radius.toFixed(2)}px, #000 ${edge.toFixed(2)}px)`;
  });

  const syncRevealGeometry = useCallback(() => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const logo = document.querySelector<SVGSVGElement>("[data-v3-reveal-origin]");
    const bounds = logo?.getBoundingClientRect();
    const sourceX = Number(logo?.getAttribute("data-v3-reveal-origin-x"));
    const sourceY = Number(logo?.getAttribute("data-v3-reveal-origin-y"));
    const matrix = logo?.getScreenCTM();
    let originX = bounds ? bounds.left + bounds.width / 2 : viewportWidth / 2;
    let originY = bounds ? bounds.top + bounds.height / 2 : viewportHeight / 2;

    if (logo && matrix && Number.isFinite(sourceX) && Number.isFinite(sourceY)) {
      const sourcePoint = logo.createSVGPoint();
      sourcePoint.x = sourceX;
      sourcePoint.y = sourceY;
      const screenPoint = sourcePoint.matrixTransform(matrix);
      originX = screenPoint.x;
      originY = screenPoint.y;
    }
    const farthestX = Math.max(originX, viewportWidth - originX);
    const farthestY = Math.max(originY, viewportHeight - originY);
    const logoRadius = bounds
      ? Math.hypot(
          Math.max(originX - bounds.left, bounds.right - originX),
          Math.max(originY - bounds.top, bounds.bottom - originY),
        ) + 2
      : 18;

    revealOriginX.set(originX);
    revealOriginY.set(originY);
    revealLogoRadius.set(logoRadius);
    revealMaxRadius.set(Math.hypot(farthestX, farthestY) + 2);
  }, [revealLogoRadius, revealMaxRadius, revealOriginX, revealOriginY]);

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
    revealGeometryLockedRef.current = false;
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
    syncRevealGeometry();

    const logo = document.querySelector<SVGSVGElement>("[data-v3-reveal-origin]");
    const resizeObserver = logo ? new ResizeObserver(syncRevealGeometry) : null;
    if (logo) resizeObserver?.observe(logo);
    window.addEventListener("resize", syncRevealGeometry);
    window.visualViewport?.addEventListener("resize", syncRevealGeometry);

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener("resize", syncRevealGeometry);
      window.visualViewport?.removeEventListener("resize", syncRevealGeometry);
    };
  }, [syncRevealGeometry]);

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

    if (!reduceMotion && !revealGeometryLockedRef.current) {
      syncRevealGeometry();
      if (elapsed >= OPENING_REVEAL_HOLD_END_TIME) {
        revealGeometryLockedRef.current = true;
      }
    }
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
