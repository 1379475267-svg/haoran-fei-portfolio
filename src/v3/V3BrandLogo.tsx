import { motion, useMotionValue, useReducedMotion, useTransform, type MotionValue } from "framer-motion";
import { useId } from "react";

const DRAW_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const LOGO_SOURCE = "./brand/haoran-fei-brand-mark.png";
const OPENING_MOON = {
  x: 737,
  y: 314,
  radius: 31.5,
} as const;
const LOGO_CORE = { x: 512, y: 480 } as const;
const MOON_FLIGHT_START = 2.18;
const MOON_FLIGHT_END = 2.82;
const MOON_CORE_DISSOLVE_END = 2.98;
const MOON_HALO_DISSOLVE_END = 3.02;

function clampUnit(value: number) {
  return Math.min(Math.max(value, 0), 1);
}

function easeInOutCubic(value: number) {
  const progress = clampUnit(value);
  return progress < 0.5
    ? 4 * progress * progress * progress
    : 1 - ((-2 * progress + 2) ** 3) / 2;
}

function lerp(start: number, end: number, progress: number) {
  return start + (end - start) * progress;
}

function getMoonPosition(time: number) {
  const progress = easeInOutCubic(
    (time - MOON_FLIGHT_START) / (MOON_FLIGHT_END - MOON_FLIGHT_START),
  );
  const inverse = 1 - progress;

  // A shallow orbital curve keeps the moon's change of direction continuous.
  return {
    x: (
      inverse ** 3 * OPENING_MOON.x
      + 3 * inverse ** 2 * progress * 738
      + 3 * inverse * progress ** 2 * 650
      + progress ** 3 * LOGO_CORE.x
    ),
    y: (
      inverse ** 3 * OPENING_MOON.y
      + 3 * inverse ** 2 * progress * 405
      + 3 * inverse * progress ** 2 * 494
      + progress ** 3 * LOGO_CORE.y
    ),
  };
}

interface V3BrandLogoProps {
  animated?: boolean;
  animationMode?: "static" | "draw" | "erase";
  eraseTimeline?: MotionValue<number>;
  openingMoon?: boolean;
  revealOrigin?: boolean;
  className?: string;
  decorative?: boolean;
  label?: string;
}

export default function V3BrandLogo({
  animated = false,
  animationMode,
  eraseTimeline,
  openingMoon = false,
  revealOrigin = false,
  className,
  decorative = false,
  label = "Haoran Fei logo",
}: V3BrandLogoProps) {
  const reduceMotion = Boolean(useReducedMotion());
  const resolvedAnimationMode = animationMode ?? (animated ? "draw" : "static");
  const shouldAnimate = resolvedAnimationMode !== "static" && !reduceMotion;
  const isErasing = resolvedAnimationMode === "erase";
  const fallbackTimeline = useMotionValue(0);
  const timeline = eraseTimeline ?? fallbackTimeline;
  const clockDrivenErase = isErasing && Boolean(eraseTimeline) && !reduceMotion;
  const ringOpacity = useTransform(timeline, [2.86, 3.08], [1, 0]);
  const leftOpacity = useTransform(timeline, [2.22, 2.44], [1, 0]);
  const stemOpacity = useTransform(timeline, [1.875, 2.125], [1, 0]);
  const bowlOpacity = useTransform(timeline, [1.492, 1.772], [1, 0]);
  const legOpacity = useTransform(timeline, [0.778, 1.028], [1, 0]);
  const nodeOpacity = useTransform(timeline, [0.337, 0.537], [1, 0]);
  const nodeScale = useTransform(timeline, [0.337, 0.537], [1, 0.35]);
  const baseOpacity = useTransform(timeline, [0.18, 0.3], [1, 0]);
  const moonCenterX = useTransform(timeline, (time) => getMoonPosition(time).x);
  const moonCenterY = useTransform(timeline, (time) => getMoonPosition(time).y);
  const moonCoreRadius = useTransform(timeline, (time) => {
    const settle = easeInOutCubic(
      (time - MOON_FLIGHT_END) / (MOON_CORE_DISSOLVE_END - MOON_FLIGHT_END),
    );
    return lerp(OPENING_MOON.radius, 4, settle);
  });
  const moonCoreOpacity = useTransform(timeline, (time) => {
    const dissolve = easeInOutCubic(
      (time - MOON_FLIGHT_END) / (MOON_CORE_DISSOLVE_END - MOON_FLIGHT_END),
    );
    return 1 - dissolve;
  });
  const moonHaloRadius = useTransform(timeline, (time) => {
    const flight = easeInOutCubic(
      (time - MOON_FLIGHT_START) / (MOON_FLIGHT_END - MOON_FLIGHT_START),
    );
    return lerp(OPENING_MOON.radius, OPENING_MOON.radius + 2.5, flight);
  });
  const moonHaloOpacity = useTransform(timeline, (time) => {
    const flight = easeInOutCubic(
      (time - MOON_FLIGHT_START) / (MOON_FLIGHT_END - MOON_FLIGHT_START),
    );
    const dissolve = easeInOutCubic(
      (time - MOON_FLIGHT_END) / (MOON_HALO_DISSOLVE_END - MOON_FLIGHT_END),
    );
    return lerp(0.34, 0.58, flight) * (1 - dissolve);
  });
  const clipId = useId().replace(/:/g, "");
  const classes = ["v3-brand-logo", className].filter(Boolean).join(" ");
  const getMotionState = (
    visible: Record<string, number>,
    hidden: Record<string, number>,
  ) => (
    isErasing
      ? { initial: visible, animate: hidden }
      : { initial: hidden, animate: visible }
  );

  return (
    <svg
      className={classes}
      viewBox="200 168 624 624"
      role={decorative ? undefined : "img"}
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : label}
      focusable="false"
      data-logo-mode={resolvedAnimationMode}
      data-v3-reveal-origin={revealOrigin || undefined}
    >
      {decorative ? null : <title>{label}</title>}
      <defs>
        <radialGradient id={`${clipId}-moon-core`} cx="32%" cy="27%" r="76%">
          <stop offset="0%" stopColor="#fff0bb" />
          <stop offset="42%" stopColor="#e8cc78" />
          <stop offset="100%" stopColor="#bd8e35" />
        </radialGradient>
        <filter
          id={`${clipId}-moon-halo`}
          x="-150%"
          y="-150%"
          width="400%"
          height="400%"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur stdDeviation="12" />
        </filter>
      </defs>
      {shouldAnimate ? (
        <>
          <defs>
          <clipPath id={`${clipId}-ring`}>
            <path
              d="M 512 187 A 293 293 0 1 1 511.9 187 Z M 512 248 A 232 232 0 1 0 512.1 248 Z"
                clipRule="evenodd"
              fillRule="evenodd"
            />
          </clipPath>
          <mask
            id={`${clipId}-ring-without-node`}
            x="200"
            y="168"
            width="624"
            height="624"
            maskUnits="userSpaceOnUse"
          >
            <rect x="200" y="168" width="624" height="624" fill="#000000" />
            <path
              d="M 512 187 A 293 293 0 1 1 511.9 187 Z M 512 248 A 232 232 0 1 0 512.1 248 Z"
              clipRule="evenodd"
              fill="#ffffff"
              fillRule="evenodd"
            />
            <circle cx={OPENING_MOON.x} cy={OPENING_MOON.y} r="43" fill="#000000" />
          </mask>
          <mask
            id={`${clipId}-logo-without-node`}
            x="0"
            y="0"
            width="1024"
            height="1024"
            maskUnits="userSpaceOnUse"
          >
            <rect x="0" y="0" width="1024" height="1024" fill="#ffffff" />
            <circle cx={OPENING_MOON.x} cy={OPENING_MOON.y} r="43" fill="#000000" />
          </mask>
            <clipPath id={`${clipId}-left`}>
              <rect x="219" y="370" width="225" height="159" />
            </clipPath>
            <clipPath id={`${clipId}-stem`}>
              <rect x="461" y="313" width="69" height="377" />
            </clipPath>
            <clipPath id={`${clipId}-bowl`}>
              <rect x="540" y="365" width="219" height="209" />
            </clipPath>
            <clipPath id={`${clipId}-leg`}>
              <rect x="540" y="485" width="239" height="239" />
            </clipPath>
            <clipPath id={`${clipId}-node`}>
              <circle cx="737" cy="315" r="42" />
            </clipPath>
          </defs>
          <motion.g
            clipPath={openingMoon ? undefined : `url(#${clipId}-ring)`}
            mask={openingMoon ? `url(#${clipId}-ring-without-node)` : undefined}
            {...(clockDrivenErase
              ? { initial: false, style: { opacity: ringOpacity } }
              : getMotionState(
                { opacity: 1, scale: 1 },
                { opacity: 0, scale: 0.965 },
              ))}
            transition={clockDrivenErase ? undefined : isErasing
              ? { delay: 1.82, duration: 0.42, ease: DRAW_EASE }
              : { duration: 0.48, ease: DRAW_EASE }}
            style={clockDrivenErase
              ? { opacity: ringOpacity }
              : { transformOrigin: "512px 480px" }}
          >
            <image href={LOGO_SOURCE} width="1024" height="1024" />
          </motion.g>
          <motion.g
            clipPath={`url(#${clipId}-left)`}
            {...(clockDrivenErase
              ? { initial: false, style: { opacity: leftOpacity } }
              : getMotionState(
                { opacity: 1, x: 0 },
                { opacity: 0, x: -18 },
              ))}
            transition={clockDrivenErase ? undefined : isErasing
              ? { delay: 1.48, duration: 0.28, ease: DRAW_EASE }
              : { delay: 0.32, duration: 0.28, ease: DRAW_EASE }}
          >
            <image href={LOGO_SOURCE} width="1024" height="1024" />
          </motion.g>
          <motion.g
            clipPath={`url(#${clipId}-stem)`}
            {...(clockDrivenErase
              ? { initial: false, style: { opacity: stemOpacity } }
              : getMotionState(
                { opacity: 1, y: 0 },
                { opacity: 0, y: -22 },
              ))}
            transition={clockDrivenErase ? undefined : isErasing
              ? { delay: 1.14, duration: 0.3, ease: DRAW_EASE }
              : { delay: 0.5, duration: 0.3, ease: DRAW_EASE }}
          >
            <image href={LOGO_SOURCE} width="1024" height="1024" />
          </motion.g>
          <motion.g
            clipPath={`url(#${clipId}-bowl)`}
            {...(clockDrivenErase
              ? { initial: false, style: { opacity: bowlOpacity } }
              : getMotionState(
                { opacity: 1, x: 0 },
                { opacity: 0, x: 20 },
              ))}
            transition={clockDrivenErase ? undefined : isErasing
              ? { delay: 0.8, duration: 0.3, ease: DRAW_EASE }
              : { delay: 0.7, duration: 0.3, ease: DRAW_EASE }}
          >
            <image href={LOGO_SOURCE} width="1024" height="1024" />
          </motion.g>
          <motion.g
            clipPath={`url(#${clipId}-leg)`}
            {...(clockDrivenErase
              ? { initial: false, style: { opacity: legOpacity } }
              : getMotionState(
                { opacity: 1, y: 0 },
                { opacity: 0, y: -16 },
              ))}
            transition={clockDrivenErase ? undefined : isErasing
              ? { delay: 0.48, duration: 0.3, ease: DRAW_EASE }
              : { delay: 0.9, duration: 0.3, ease: DRAW_EASE }}
          >
            <image href={LOGO_SOURCE} width="1024" height="1024" />
          </motion.g>
          {openingMoon ? null : (
            <motion.g
              clipPath={`url(#${clipId}-node)`}
              {...(clockDrivenErase
                ? { initial: false, style: { opacity: nodeOpacity, scale: nodeScale } }
                : getMotionState(
                  { opacity: 1, scale: 1 },
                  { opacity: 0, scale: 0.35 },
                ))}
              transition={clockDrivenErase ? undefined : isErasing
                ? { delay: 0.22, duration: 0.22, ease: DRAW_EASE }
                : { delay: 1.18, duration: 0.24, ease: DRAW_EASE }}
              style={clockDrivenErase
                ? { transformOrigin: "737px 315px", opacity: nodeOpacity, scale: nodeScale }
                : { transformOrigin: "737px 315px" }}
            >
              <image href={LOGO_SOURCE} width="1024" height="1024" />
            </motion.g>
          )}
          <motion.image
            href={LOGO_SOURCE}
            width="1024"
            height="1024"
            mask={openingMoon ? `url(#${clipId}-logo-without-node)` : undefined}
            {...(clockDrivenErase
              ? { initial: false, style: { opacity: baseOpacity } }
              : getMotionState({ opacity: 1 }, { opacity: 0 }))}
            transition={clockDrivenErase ? undefined : isErasing
              ? { delay: 0.04, duration: 0.14, ease: DRAW_EASE }
              : { delay: 1.38, duration: 0.16, ease: DRAW_EASE }}
          />
        </>
      ) : (
        <image href={LOGO_SOURCE} width="1024" height="1024" />
      )}
      {openingMoon ? (
        <g className="v3-brand-logo__moon">
          {isErasing ? (
            <motion.g initial={false}>
              <motion.circle
                className="v3-brand-logo__moon-halo"
                cx={moonCenterX}
                cy={moonCenterY}
                r={moonHaloRadius}
                fill="#d8b655"
                filter={`url(#${clipId}-moon-halo)`}
                style={{ opacity: moonHaloOpacity }}
              />
              <motion.circle
                className="v3-brand-logo__moon-core"
                cx={moonCenterX}
                cy={moonCenterY}
                r={moonCoreRadius}
                fill={`url(#${clipId}-moon-core)`}
                style={{ opacity: moonCoreOpacity }}
              />
            </motion.g>
          ) : (
            <>
              <circle
                className="v3-brand-logo__moon-halo"
                cx={OPENING_MOON.x}
                cy={OPENING_MOON.y}
                r={OPENING_MOON.radius}
                fill="#d8b655"
                filter={`url(#${clipId}-moon-halo)`}
              />
              <circle
                className="v3-brand-logo__moon-core"
                cx={OPENING_MOON.x}
                cy={OPENING_MOON.y}
                r={OPENING_MOON.radius}
                fill={`url(#${clipId}-moon-core)`}
              />
            </>
          )}
        </g>
      ) : null}
    </svg>
  );
}
