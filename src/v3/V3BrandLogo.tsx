import { motion, useMotionValue, useReducedMotion, useTransform, type MotionValue } from "framer-motion";
import { useId } from "react";

const DRAW_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const LOGO_SOURCE = "./brand/haoran-fei-brand-mark.png";

interface V3BrandLogoProps {
  animated?: boolean;
  animationMode?: "static" | "draw" | "erase";
  eraseTimeline?: MotionValue<number>;
  className?: string;
  decorative?: boolean;
  label?: string;
}

export default function V3BrandLogo({
  animated = false,
  animationMode,
  eraseTimeline,
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
  const ringOpacity = useTransform(timeline, [2.47, 2.95], [1, 0]);
  const ringScale = useTransform(timeline, [2.47, 2.95], [1, 0.965]);
  const leftOpacity = useTransform(timeline, [2.22, 2.44], [1, 0]);
  const leftX = useTransform(timeline, [2.22, 2.44], [0, -18]);
  const stemOpacity = useTransform(timeline, [1.875, 2.125], [1, 0]);
  const stemY = useTransform(timeline, [1.875, 2.125], [0, -22]);
  const bowlOpacity = useTransform(timeline, [1.492, 1.772], [1, 0]);
  const bowlX = useTransform(timeline, [1.492, 1.772], [0, 20]);
  const legOpacity = useTransform(timeline, [0.778, 1.028], [1, 0]);
  const legY = useTransform(timeline, [0.778, 1.028], [0, -16]);
  const nodeOpacity = useTransform(timeline, [0.337, 0.537], [1, 0]);
  const nodeScale = useTransform(timeline, [0.337, 0.537], [1, 0.35]);
  const baseOpacity = useTransform(timeline, [0.18, 0.3], [1, 0]);
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
    >
      {decorative ? null : <title>{label}</title>}
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
            clipPath={`url(#${clipId}-ring)`}
            {...(clockDrivenErase
              ? { initial: false, style: { opacity: ringOpacity, scale: ringScale } }
              : getMotionState(
                { opacity: 1, scale: 1 },
                { opacity: 0, scale: 0.965 },
              ))}
            transition={clockDrivenErase ? undefined : isErasing
              ? { delay: 1.82, duration: 0.42, ease: DRAW_EASE }
              : { duration: 0.48, ease: DRAW_EASE }}
            style={clockDrivenErase
              ? { transformOrigin: "512px 480px", opacity: ringOpacity, scale: ringScale }
              : { transformOrigin: "512px 480px" }}
          >
            <image href={LOGO_SOURCE} width="1024" height="1024" />
          </motion.g>
          <motion.g
            clipPath={`url(#${clipId}-left)`}
            {...(clockDrivenErase
              ? { initial: false, style: { opacity: leftOpacity, x: leftX } }
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
              ? { initial: false, style: { opacity: stemOpacity, y: stemY } }
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
              ? { initial: false, style: { opacity: bowlOpacity, x: bowlX } }
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
              ? { initial: false, style: { opacity: legOpacity, y: legY } }
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
          <motion.image
            href={LOGO_SOURCE}
            width="1024"
            height="1024"
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
    </svg>
  );
}
