import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { profile } from "../data/profile";
import V3Magnet from "./V3Magnet";
import { useV3Language } from "./V3Language";

const ENTER_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const TOGGLE_EASE: [number, number, number, number] = [0.65, 0, 0.35, 1];
const COMPACT_MOTION_QUERY = "(max-width: 40rem)";

interface HeroMotionVariants {
  atmosphere: Variants;
  sequence: Variants;
  titleGroup: Variants;
  titleLine: Variants;
  body: Variants;
  action: Variants;
  supportGroup: Variants;
  supportItem: Variants;
  media: Variants;
  finalGroup: Variants;
  versionItem: Variants;
  finalItem: Variants;
}

function useCompactMotion() {
  const [compact, setCompact] = useState(() =>
    typeof window === "undefined"
      ? false
      : window.matchMedia(COMPACT_MOTION_QUERY).matches,
  );

  useEffect(() => {
    const media = window.matchMedia(COMPACT_MOTION_QUERY);
    const update = () => setCompact(media.matches);

    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return compact;
}

function createHeroMotionVariants(compact: boolean): HeroMotionVariants {
  const durationScale = compact ? 0.82 : 1;
  const primaryDistance = compact ? 10 : 20;
  const subtleDistance = compact ? 5 : 10;
  const duration = (seconds: number) => seconds * durationScale;

  const reveal = (distance: number, seconds: number): Variants => ({
    hidden: { opacity: 0, y: distance },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: duration(seconds), ease: ENTER_EASE },
    },
  });

  return {
    atmosphere: {
      hidden: { opacity: 0, scale: compact ? 0.985 : 0.96 },
      visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: duration(0.9), ease: ENTER_EASE },
      },
    },
    sequence: {
      hidden: {},
      visible: {
        transition: {
          delayChildren: compact ? 0.12 : 0.18,
          staggerChildren: compact ? 0.12 : 0.17,
        },
      },
    },
    titleGroup: {
      hidden: {},
      visible: {
        transition: { staggerChildren: compact ? 0.07 : 0.1 },
      },
    },
    titleLine: reveal(primaryDistance, 0.62),
    body: reveal(primaryDistance * 0.8, 0.52),
    action: reveal(subtleDistance, 0.48),
    supportGroup: {
      hidden: {},
      visible: {
        transition: {
          delayChildren: 0.03,
          staggerChildren: compact ? 0.05 : 0.08,
        },
      },
    },
    supportItem: reveal(subtleDistance, 0.46),
    media: {
      hidden: { opacity: 0, y: subtleDistance, scale: compact ? 0.992 : 0.985 },
      visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: duration(0.7), ease: ENTER_EASE },
      },
    },
    finalGroup: {
      hidden: {},
      visible: {
        transition: {
          delayChildren: 0.03,
          staggerChildren: compact ? 0.04 : 0.06,
        },
      },
    },
    versionItem: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { duration: duration(0.4), ease: ENTER_EASE },
      },
    },
    finalItem: reveal(compact ? 0 : 4, 0.4),
  };
}

export default function V3Hero() {
  const reduceMotion = Boolean(useReducedMotion());
  const compactMotion = useCompactMotion();
  const variants = useMemo(
    () => createHeroMotionVariants(compactMotion),
    [compactMotion],
  );
  const { language, t } = useV3Language();
  const initialState = reduceMotion ? false : "hidden";

  return (
    <section className="v3-hero" id="home" aria-labelledby="v3-hero-title">
      {!reduceMotion ? (
        <div className="v3-hero-aperture" aria-hidden="true">
          <motion.span
            className="v3-hero-aperture-panel v3-hero-aperture-panel-top"
            initial={{ y: 0 }}
            animate={{ y: "-101%" }}
            transition={{ duration: 0.72, delay: 0.16, ease: ENTER_EASE }}
          />
          <motion.span
            className="v3-hero-aperture-panel v3-hero-aperture-panel-bottom"
            initial={{ y: 0 }}
            animate={{ y: "101%" }}
            transition={{ duration: 0.72, delay: 0.16, ease: ENTER_EASE }}
          />
          <motion.span
            className="v3-hero-aperture-line"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: [0, 1, 0], scaleX: [0, 1, 1] }}
            transition={{
              duration: 0.72,
              times: [0, 0.42, 1],
              ease: ENTER_EASE,
            }}
          />
        </div>
      ) : null}

      <motion.div
        className="v3-hero-atmosphere"
        aria-hidden="true"
        variants={variants.atmosphere}
        initial={initialState}
        animate="visible"
      >
        <div className="v3-hero-grid" />
      </motion.div>

      <motion.div
        className="v3-hero-inner"
        variants={variants.sequence}
        initial={initialState}
        animate="visible"
      >
        <motion.div className="v3-hero-title-wrap" variants={variants.titleGroup}>
          <h1 id="v3-hero-title">
            <motion.span variants={variants.titleLine}>{t.hero.greeting}</motion.span>
            <motion.strong variants={variants.titleLine}>Haoran</motion.strong>
          </h1>
        </motion.div>

        <motion.p className="v3-hero-intro" variants={variants.body}>
          {t.hero.body}
        </motion.p>

        <motion.div className="v3-hero-cta-reveal" variants={variants.action}>
          <V3Magnet className="v3-hero-cta-magnet" strength={5}>
            <a className="v3-action" href="#projects">
              {t.hero.viewProject} <ArrowUpRight aria-hidden="true" />
            </a>
          </V3Magnet>
        </motion.div>

        <motion.div className="v3-hero-support" variants={variants.supportGroup}>
          <motion.div className="v3-hero-kicker" variants={variants.supportItem}>
            <span>{t.hero.kicker}</span>
            <span>{t.hero.location}</span>
          </motion.div>

          <motion.div className="v3-hero-media-reveal" variants={variants.media}>
            <div className="v3-hero-media-stage">
              <V3Magnet className="v3-hero-media-magnet" strength={8}>
                <div className="v3-hero-media">
                  {reduceMotion ? (
                    <img
                      src="./projects/nonconvex-navigation.webp"
                      alt={t.hero.mediaAlt}
                    />
                  ) : (
                    <video
                      {...({ fetchpriority: "high" } as { fetchpriority: string })}
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      poster="./projects/nonconvex-navigation.webp"
                      aria-label={t.hero.mediaAria}
                    >
                      <source src="./projects/nonconvex-navigation.webm" type="video/webm" />
                      <source src="./projects/nonconvex-navigation.mp4" type="video/mp4" />
                      <track
                        kind="captions"
                        src="./projects/nonconvex-navigation.vtt"
                        srcLang={language === "zh" ? "zh" : "en"}
                        label={language === "zh" ? "中文字幕" : "English"}
                      />
                    </video>
                  )}
                  <div className="v3-hero-media-chrome">
                    <span><i /> {t.hero.live}</span>
                    <span>Nonconvex α</span>
                  </div>
                  <div className="v3-hero-media-corner" aria-hidden="true" />
                </div>
              </V3Magnet>
            </div>
          </motion.div>
        </motion.div>

        <motion.div className="v3-hero-final-details" variants={variants.finalGroup}>
          <motion.span
            className="v3-hero-version"
            aria-hidden="true"
            variants={variants.versionItem}
          >
            V03 / {profile.name.toUpperCase()}
          </motion.span>
          <motion.a
            className="v3-scroll-cue"
            href="#project-reel"
            aria-label={t.hero.exploreAria}
            variants={variants.finalItem}
          >
            {t.hero.explore}
            <motion.span
              className="v3-scroll-cue-icon"
              aria-hidden="true"
              animate={reduceMotion ? { y: 0 } : { y: [0, 4, 0] }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { duration: 2.2, repeat: Infinity, ease: TOGGLE_EASE }
              }
            >
              <ArrowDownRight />
            </motion.span>
          </motion.a>
        </motion.div>
      </motion.div>
    </section>
  );
}
