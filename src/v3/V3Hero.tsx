import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { profile } from "../data/profile";
import V3Magnet from "./V3Magnet";
import { useV3Language } from "./V3Language";

const container: Variants = {
  hidden: {},
  visible: {
    transition: { delayChildren: 0.1, staggerChildren: 0.13 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 34 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function V3Hero() {
  const reduceMotion = useReducedMotion();
  const { language, t } = useV3Language();

  return (
    <section className="v3-hero" id="home" aria-labelledby="v3-hero-title">
      <div className="v3-hero-grid" aria-hidden="true" />
      <motion.div
        className="v3-hero-inner"
        variants={container}
        initial={reduceMotion ? false : "hidden"}
        animate="visible"
      >
        <motion.div className="v3-hero-kicker" variants={item}>
          <span>{t.hero.kicker}</span>
          <span>{t.hero.location}</span>
        </motion.div>

        <div className="v3-hero-title-wrap">
          <motion.h1 id="v3-hero-title" variants={item}>
            <span>{t.hero.greeting}</span>
            <strong>Haoran</strong>
          </motion.h1>
        </div>

        <motion.div className="v3-hero-media-stage" variants={item}>
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
        </motion.div>

        <motion.div className="v3-hero-bottom" variants={item}>
          <p>{t.hero.body}</p>
          <V3Magnet className="v3-hero-cta-magnet" strength={5}>
            <a className="v3-action" href="#projects">
              {t.hero.viewProject} <ArrowUpRight aria-hidden="true" />
            </a>
          </V3Magnet>
          <a className="v3-scroll-cue" href="#project-reel" aria-label={t.hero.exploreAria}>
            {t.hero.explore} <ArrowDownRight aria-hidden="true" />
          </a>
        </motion.div>
      </motion.div>
      <span className="v3-hero-version" aria-hidden="true">V03 / {profile.name.toUpperCase()}</span>
    </section>
  );
}
