import { motion, useReducedMotion } from "framer-motion";
import { useId } from "react";

const DRAW_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const LOGO_SOURCE = "./brand/haoran-fei-brand-mark.png";

interface V3BrandLogoProps {
  animated?: boolean;
  className?: string;
  decorative?: boolean;
  label?: string;
}

export default function V3BrandLogo({
  animated = false,
  className,
  decorative = false,
  label = "Haoran Fei logo",
}: V3BrandLogoProps) {
  const reduceMotion = Boolean(useReducedMotion());
  const shouldAnimate = animated && !reduceMotion;
  const clipId = useId().replace(/:/g, "");
  const classes = ["v3-brand-logo", className].filter(Boolean).join(" ");

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
            initial={{ opacity: 0, scale: 0.965 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.48, ease: DRAW_EASE }}
            style={{ transformOrigin: "512px 480px" }}
          >
            <image href={LOGO_SOURCE} width="1024" height="1024" />
          </motion.g>
          <motion.g
            clipPath={`url(#${clipId}-left)`}
            initial={{ opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.32, duration: 0.28, ease: DRAW_EASE }}
          >
            <image href={LOGO_SOURCE} width="1024" height="1024" />
          </motion.g>
          <motion.g
            clipPath={`url(#${clipId}-stem)`}
            initial={{ opacity: 0, y: -22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.3, ease: DRAW_EASE }}
          >
            <image href={LOGO_SOURCE} width="1024" height="1024" />
          </motion.g>
          <motion.g
            clipPath={`url(#${clipId}-bowl)`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.3, ease: DRAW_EASE }}
          >
            <image href={LOGO_SOURCE} width="1024" height="1024" />
          </motion.g>
          <motion.g
            clipPath={`url(#${clipId}-leg)`}
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.3, ease: DRAW_EASE }}
          >
            <image href={LOGO_SOURCE} width="1024" height="1024" />
          </motion.g>
          <motion.g
            clipPath={`url(#${clipId}-node)`}
            initial={{ opacity: 0, scale: 0.35 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.18, duration: 0.24, ease: DRAW_EASE }}
            style={{ transformOrigin: "737px 315px" }}
          >
            <image href={LOGO_SOURCE} width="1024" height="1024" />
          </motion.g>
          <motion.image
            href={LOGO_SOURCE}
            width="1024"
            height="1024"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.38, duration: 0.16, ease: "linear" }}
          />
        </>
      ) : (
        <image href={LOGO_SOURCE} width="1024" height="1024" />
      )}
    </svg>
  );
}
