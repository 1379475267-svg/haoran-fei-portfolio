import { motion, useAnimationFrame, useMotionValue, useReducedMotion, useTransform, type MotionStyle } from "framer-motion";
import { VolumeX } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import V3BrandLogo from "./V3BrandLogo";
import { HOME_HEART_MOTION, V3_BACKGROUND_TRACK } from "./V3MusicTrack";

const IS_HOME_HEART = V3_BACKGROUND_TRACK.id === "home-heart";

const {
  duration: OPENING_DURATION,
  contentReveal: CONTENT_REVEAL_TIME,
  logoFlightStart: LOGO_FLIGHT_START,
  logoFlightEnd: LOGO_FLIGHT_END,
  apertureStart: APERTURE_START,
  apertureEnd: APERTURE_END,
} = V3_BACKGROUND_TRACK.opening;
const REDUCED_OPENING_DURATION = 0.28;
const AUDIO_START_TIMEOUT = 3000;
const AUDIO_STALL_TIMEOUT = 400;
const GEOMETRY_SAMPLE_INTERVAL = 1000 / 30;
// V3Nav's reveal takes 0.7 s; the extra frame margin covers its React commit.
const HEADER_REVEAL_SETTLE_TIME = 0.8;

function smoothstep(value: number) {
  const progress = Math.min(Math.max(value, 0), 1);
  return progress * progress * (3 - 2 * progress);
}

export type OpeningCompletionReason = "natural" | "skipped";

interface V3OpeningSequenceProps {
  onComplete: (reason: OpeningCompletionReason) => void;
  onReveal: () => void;
  onStart: () => Promise<HTMLAudioElement | null>;
}

export default function V3OpeningSequence({ onComplete, onReveal, onStart }: V3OpeningSequenceProps) {
  const reduceMotion = Boolean(useReducedMotion());
  const [phase, setPhase] = useState<"idle" | "waiting" | "playing">("idle");
  const [soundUnavailable, setSoundUnavailable] = useState(false);
  const startedRef = useRef(false);
  const revealedRef = useRef(false);
  const completedRef = useRef(false);
  const animationStartedRef = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioStartTimeRef = useRef(0);
  const lastAudioTimeRef = useRef(0);
  const lastAudioProgressRef = useRef(0);
  const wallAnchorRef = useRef(0);
  const wallElapsedRef = useRef(0);
  const elapsedRef = useRef(0);
  const waitingTimeoutRef = useRef<number | null>(null);
  const mountedRef = useRef(true);
  const anchorRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLSpanElement>(null);
  const navLogoRef = useRef<SVGSVGElement | null>(null);
  const lastGeometrySampleRef = useRef(0);
  const landingMeasuredRef = useRef(false);
  const soundButtonRef = useRef<HTMLButtonElement>(null);
  const skipButtonRef = useRef<HTMLButtonElement>(null);
  const clock = useMotionValue(0);
  const anchorX = useMotionValue(0);
  const anchorY = useMotionValue(0);
  const logoSize = useMotionValue(0);
  const targetX = useMotionValue(0);
  const targetY = useMotionValue(0);
  const targetScale = useMotionValue(0.18);
  const maxRadius = useMotionValue(0);
  const openingDuration = reduceMotion ? REDUCED_OPENING_DURATION : OPENING_DURATION;
  const flightProgress = useTransform(clock, (time) => (
    reduceMotion ? 0 : smoothstep((time - LOGO_FLIGHT_START) / (LOGO_FLIGHT_END - LOGO_FLIGHT_START))
  ));
  const logoX = useTransform(() => targetX.get() * flightProgress.get());
  const logoY = useTransform(() => targetY.get() * flightProgress.get());
  // The mark settles in the centre before travelling; its scale arrives with its position.
  const logoScale = useTransform(() => {
    if (!IS_HOME_HEART) return 1 + (targetScale.get() - 1) * flightProgress.get();
    const gather = smoothstep((clock.get() - HOME_HEART_MOTION.gatherEnd) / (LOGO_FLIGHT_START - HOME_HEART_MOTION.gatherEnd));
    return 1 - 0.09 * gather + (targetScale.get() - 0.91) * flightProgress.get();
  });
  const moonOpacity = useTransform(clock,
    IS_HOME_HEART ? [0, HOME_HEART_MOTION.wake, 0.4, LOGO_FLIGHT_START, LOGO_FLIGHT_END] : [3.6, LOGO_FLIGHT_END],
    IS_HOME_HEART ? [0.78, 1, 0.88, 0.88, 0] : [1, 0]);
  const baseOpacity = useTransform(clock,
    IS_HOME_HEART ? [0, 0.34, HOME_HEART_MOTION.gatherStart, 2.20, HOME_HEART_MOTION.gatherEnd]
      : [0, 0.24, 1.7, 3.45, LOGO_FLIGHT_END],
    IS_HOME_HEART ? [0.92, 0.17, 0.17, 0.17, 1] : [0.9, 0.16, 0.22, 0.22, 1]);
  const baseBrightness = useTransform(clock,
    IS_HOME_HEART ? [HOME_HEART_MOTION.gatherEnd, LOGO_FLIGHT_END] : [3.45, LOGO_FLIGHT_END],
    ["brightness(1.22)", "brightness(1)"]);
  const gatherOpacity = useTransform(clock,
    IS_HOME_HEART ? [0, 2.41, 2.66] : [3.45, LOGO_FLIGHT_END],
    IS_HOME_HEART ? [1, 1, 0] : [1, 0]);
  // No separately running SVG animation: every stroke follows the same media clock.
  const drawClock = useTransform(clock,
    [HOME_HEART_MOTION.gatherStart, HOME_HEART_MOTION.gatherAccent, HOME_HEART_MOTION.gatherEnd],
    [0, 0.8, 1.54]);
  const copyOpacity = useTransform(clock, IS_HOME_HEART ? [0, 0.28] : [0, 1.38, 2.35], IS_HOME_HEART ? [1, 0] : [1, 1, 0]);
  const lightOpacity = useTransform(clock,
    IS_HOME_HEART ? [0.56, HOME_HEART_MOTION.sweepStart, 1.12, HOME_HEART_MOTION.sweepEnd] : [0, 0.4, 1.68, 2.15],
    IS_HOME_HEART ? [0, 0.72, 0.55, 0] : [0, 0.7, 0.7, 0]);
  const lightMask = useTransform(clock, (time) => {
    const progress = IS_HOME_HEART
      ? (time - 0.56) / (HOME_HEART_MOTION.sweepEnd - 0.56) : time / 2.05;
    const position = -35 + smoothstep(progress) * 180;
    return `linear-gradient(115deg, transparent ${position - 18}%, #000 ${position}%, transparent ${position + 18}%)`;
  });
  const veilOpacity = useTransform(
    clock,
    reduceMotion ? [0, REDUCED_OPENING_DURATION] : [0, IS_HOME_HEART ? 4.76 : 4.5, OPENING_DURATION],
    reduceMotion ? [1, 0] : [1, 1, 0],
  );

  // The opening moon belongs to the existing artwork's 624 × 624 viewBox.
  const moonX = useTransform(() => anchorX.get() + logoX.get() + logoSize.get() * logoScale.get() * (225 / 624));
  const moonY = useTransform(() => anchorY.get() + logoY.get() - logoSize.get() * logoScale.get() * (166 / 624));
  const apertureRadius = useTransform(clock, (time) => reduceMotion ? 0 : (
    maxRadius.get() * smoothstep((time - APERTURE_START) / (APERTURE_END - APERTURE_START))
  ));
  const apertureMask = useTransform(() => {
    const radius = apertureRadius.get();
    const feather = IS_HOME_HEART && radius > 0 ? 28 : 2;
    return `radial-gradient(circle at ${moonX.get().toFixed(1)}px ${moonY.get().toFixed(1)}px, transparent ${radius.toFixed(1)}px, #000 ${(radius + feather).toFixed(1)}px)`;
  });
  const apertureSize = useTransform(apertureRadius, (radius) => `${radius * 2}px`);
  const apertureOpacity = useTransform(clock,
    IS_HOME_HEART ? [APERTURE_START, 3.48, 4.3, APERTURE_END] : [APERTURE_START, 3.34, 4.2, APERTURE_END],
    IS_HOME_HEART ? [0, 0.22, 0.10, 0] : [0, 0.42, 0.18, 0]);

  const syncTargetGeometry = useCallback(() => {
    if (!navLogoRef.current?.isConnected) {
      navLogoRef.current = document.querySelector<SVGSVGElement>(".v3-nav-mark [data-v3-reveal-origin]");
    }
    const navBounds = navLogoRef.current?.getBoundingClientRect();
    const destinationX = navBounds ? navBounds.left + navBounds.width / 2 : 44;
    const destinationY = navBounds ? navBounds.top + navBounds.height / 2 : 44;
    targetX.set(destinationX - anchorX.get());
    targetY.set(destinationY - anchorY.get());
    targetScale.set(navBounds && logoSize.get() ? navBounds.width / logoSize.get() : 0.18);
    lastGeometrySampleRef.current = performance.now();
  }, [anchorX, anchorY, logoSize, targetScale, targetX, targetY]);

  const syncGeometry = useCallback(() => {
    const anchor = anchorRef.current?.getBoundingClientRect();
    const frame = frameRef.current;
    if (!anchor || !frame) return;
    const sourceX = anchor.left;
    const sourceY = anchor.top;
    const sourceSize = Number.parseFloat(window.getComputedStyle(frame).width);
    anchorX.set(sourceX);
    anchorY.set(sourceY);
    logoSize.set(sourceSize);
    syncTargetGeometry();
    // Cover the viewport while the source moon travels towards the header.
    maxRadius.set(Math.hypot(window.innerWidth, window.innerHeight) + sourceSize);
  }, [anchorX, anchorY, logoSize, maxRadius, syncTargetGeometry]);

  const reveal = useCallback(() => {
    if (revealedRef.current) return;
    revealedRef.current = true;
    onReveal();
  }, [onReveal]);

  const finish = useCallback((reason: OpeningCompletionReason) => {
    if (completedRef.current) return;
    completedRef.current = true;
    if (waitingTimeoutRef.current !== null) {
      window.clearTimeout(waitingTimeoutRef.current);
      waitingTimeoutRef.current = null;
    }
    reveal();
    onComplete(reason);
  }, [onComplete, reveal]);

  const beginAnimation = useCallback((audio: HTMLAudioElement | null) => {
    if (!mountedRef.current || completedRef.current || animationStartedRef.current) return;
    animationStartedRef.current = true;
    if (waitingTimeoutRef.current !== null) {
      window.clearTimeout(waitingTimeoutRef.current);
      waitingTimeoutRef.current = null;
    }
    const now = performance.now();
    const audioTime = audio && Number.isFinite(audio.currentTime) ? audio.currentTime : 0;
    audioRef.current = reduceMotion ? null : audio;
    // Home's cues refer to the MP3 itself, including time elapsed while play() resolves.
    audioStartTimeRef.current = IS_HOME_HEART ? 0 : audioTime;
    lastAudioTimeRef.current = audioTime;
    lastAudioProgressRef.current = now;
    wallAnchorRef.current = now;
    wallElapsedRef.current = 0;
    elapsedRef.current = 0;
    landingMeasuredRef.current = false;
    syncGeometry();
    clock.set(0);
    setPhase("playing");
  }, [clock, reduceMotion, syncGeometry]);

  const start = useCallback((withSound: boolean) => {
    if (startedRef.current) return;
    startedRef.current = true;
    if (!withSound) {
      beginAnimation(null);
      return;
    }
    setPhase("waiting");
    // Playback is requested on the gesture's synchronous call chain. Only its
    // successful resolution starts the song-driven visual timeline.
    waitingTimeoutRef.current = window.setTimeout(() => beginAnimation(null), AUDIO_START_TIMEOUT);
    const recoverWithoutSound = () => {
      if (!mountedRef.current || completedRef.current) return;
      setSoundUnavailable(true);
      beginAnimation(null);
    };
    try {
      void onStart().then(
        (audio) => {
          if (audio && !audio.paused && !audio.error) beginAnimation(audio);
          else recoverWithoutSound();
        },
        recoverWithoutSound,
      );
    } catch {
      recoverWithoutSound();
    }
  }, [beginAnimation, onStart]);

  const advance = useCallback(() => {
    if (!animationStartedRef.current || completedRef.current) return;
    const now = performance.now();
    const audio = audioRef.current;
    let elapsed = wallElapsedRef.current + (now - wallAnchorRef.current) / 1000;
    if (audio) {
      const audioTime = audio.currentTime;
      if (Number.isFinite(audioTime) && audioTime > lastAudioTimeRef.current + 0.001) {
        lastAudioTimeRef.current = audioTime;
        lastAudioProgressRef.current = now;
      }
      if (!audio.paused && !audio.ended && !audio.error && Number.isFinite(audioTime)
        && now - lastAudioProgressRef.current < AUDIO_STALL_TIMEOUT) {
        elapsed = Math.max(elapsedRef.current, audioTime - audioStartTimeRef.current);
        wallAnchorRef.current = now;
        wallElapsedRef.current = elapsed;
      } else {
        // Continue from the last displayed moment if playback pauses, errors,
        // or stalls; never rewind the reveal when the audio later recovers.
        audioRef.current = null;
      }
    }
    elapsed = Math.max(elapsedRef.current, elapsed, 0);
    elapsedRef.current = elapsed;
    // Source size stays fixed throughout the flight. Only the header's short
    // reveal changes its target, so don't force layout reads every media frame.
    const headerIsRevealing = elapsed >= CONTENT_REVEAL_TIME
      && elapsed <= CONTENT_REVEAL_TIME + HEADER_REVEAL_SETTLE_TIME;
    if (!reduceMotion && headerIsRevealing
      && now - lastGeometrySampleRef.current >= GEOMETRY_SAMPLE_INTERVAL) {
      syncTargetGeometry();
    }
    // Take an unthrottled final sample before the logo reaches the target.
    if (!reduceMotion && elapsed >= LOGO_FLIGHT_END && !landingMeasuredRef.current) {
      syncTargetGeometry();
      landingMeasuredRef.current = true;
    }
    clock.set(Math.min(elapsed, openingDuration));
    if (elapsed >= (reduceMotion ? 0 : CONTENT_REVEAL_TIME)) reveal();
    if (elapsed >= openingDuration) {
      if (!reduceMotion) syncTargetGeometry();
      finish("natural");
    }
  }, [clock, finish, openingDuration, reduceMotion, reveal, syncTargetGeometry]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (waitingTimeoutRef.current !== null) window.clearTimeout(waitingTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    syncGeometry();
    const frame = frameRef.current;
    const observer = frame && typeof ResizeObserver !== "undefined" ? new ResizeObserver(syncGeometry) : null;
    if (frame) observer?.observe(frame);
    window.addEventListener("resize", syncGeometry);
    window.visualViewport?.addEventListener("resize", syncGeometry);
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", syncGeometry);
      window.visualViewport?.removeEventListener("resize", syncGeometry);
    };
  }, [syncGeometry]);

  useEffect(() => {
    if (phase === "idle") {
      soundButtonRef.current?.focus({ preventScroll: true });
      return undefined;
    }
    skipButtonRef.current?.focus({ preventScroll: true });
    if (phase === "waiting") return undefined;
    // Advance outside rAF too, so a hidden tab or suspended frame updates cannot
    // strand the entry gate while the media clock continues.
    const timer = window.setInterval(advance, 100);
    return () => window.clearInterval(timer);
  }, [advance, phase]);

  useAnimationFrame(() => {
    if (phase !== "playing" || completedRef.current) return;
    advance();
  });

  return (
    <div
      className="v3-opening v3-opening--manifold"
      data-choreography={IS_HOME_HEART ? "home-heart" : undefined}
      data-phase={phase}
      data-reduced-motion={reduceMotion || undefined}
      role="dialog"
      aria-modal="true"
      aria-label="Haoran Fei"
      onKeyDown={(event) => {
        if (event.key !== "Escape") return;
        event.preventDefault();
        finish("skipped");
      }}
    >
      <motion.div
        className="v3-opening-veil"
        aria-hidden="true"
        initial={false}
        style={{
          opacity: phase === "playing" ? veilOpacity : 1,
          WebkitMaskImage: reduceMotion || phase !== "playing" ? undefined : apertureMask,
          maskImage: reduceMotion || phase !== "playing" ? undefined : apertureMask,
        }}
      />
      <motion.span
        className="v3-opening-aperture"
        aria-hidden="true"
        initial={false}
        style={{ top: moonY, left: moonX, width: apertureSize, height: apertureSize, opacity: reduceMotion || phase !== "playing" ? 0 : apertureOpacity }}
      />
      <div ref={anchorRef} className="v3-opening-anchor" aria-hidden="true">
        <motion.span
          ref={frameRef}
          className="v3-opening-logo-frame"
          initial={false}
          style={{
            x: phase === "playing" ? logoX : 0,
            y: phase === "playing" ? logoY : 0,
            scale: phase === "playing" ? logoScale : 1,
            opacity: phase === "playing" && reduceMotion ? veilOpacity : 1,
            "--opening-moon-opacity": phase === "playing" ? moonOpacity : 1,
          } as MotionStyle}
        >
          <motion.span className="v3-opening-mark-base" initial={false} style={{
            opacity: phase === "playing" && !reduceMotion ? baseOpacity : 0.92,
            filter: phase === "playing" && !reduceMotion ? baseBrightness : "brightness(1.22)",
          }}>
            <V3BrandLogo animationMode="static" openingMoon className="v3-brand-logo--opening" decorative />
          </motion.span>
          {phase === "playing" && !reduceMotion ? (
            <motion.span className="v3-opening-mark-gather" initial={false} style={{ opacity: gatherOpacity }}>
              <V3BrandLogo animationMode="draw" drawTimeline={IS_HOME_HEART ? drawClock : undefined}
                openingMoon className="v3-brand-logo--opening" decorative />
            </motion.span>
          ) : null}
          <motion.span
            className="v3-opening-light-pass"
            initial={false}
            style={{ opacity: phase === "playing" && !reduceMotion ? lightOpacity : 0, WebkitMaskImage: lightMask, maskImage: lightMask }}
          >
            <V3BrandLogo animationMode="static" className="v3-brand-logo--opening" decorative />
          </motion.span>
        </motion.span>
      </div>
      <motion.button ref={soundButtonRef} className="v3-opening-sound-entry" type="button" initial={false}
        style={{ opacity: phase === "playing" ? (reduceMotion ? veilOpacity : copyOpacity) : 1 }}
        aria-label="Click anywhere to enter with sound" aria-hidden={phase === "playing" || undefined}
        disabled={phase !== "idle"} onClick={() => start(true)}>
        <span className="v3-opening-copy">{phase === "waiting" ? "Loading…" : "Click to enter"}</span>
      </motion.button>
      <button className="v3-opening-silent-entry" type="button" aria-label="Enter silently"
        title="Enter silently" disabled={phase !== "idle"} onClick={() => start(false)}>
        <VolumeX aria-hidden="true" />
      </button>
      {phase !== "idle" ? (
        <button ref={skipButtonRef} className="v3-opening-skip" type="button" onClick={() => finish("skipped")}>
          Skip
        </button>
      ) : null}
      <p className="v3-opening-live-status" role="status" aria-live="polite">
        {soundUnavailable
          ? "Music is unavailable. Entering the portfolio."
          : (phase === "waiting"
            ? "Preparing music. You can skip at any time."
            : (phase === "playing" ? "Entering the portfolio. You can skip the intro." : ""))}
      </p>
    </div>
  );
}
