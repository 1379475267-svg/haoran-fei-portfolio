import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { profile } from "../data/profile";
import V3Magnet from "./V3Magnet";

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
          <span>Electronic information / developer</span>
          <span>Hangzhou · 2026</span>
        </motion.div>

        <div className="v3-hero-title-wrap">
          <motion.h1 id="v3-hero-title" variants={item}>
            <span>Hi, I&apos;m</span>
            <strong>Haoran</strong>
          </motion.h1>
        </div>

        <motion.div className="v3-hero-media-stage" variants={item}>
          <V3Magnet className="v3-hero-media-magnet" strength={8}>
            <div className="v3-hero-media">
              {reduceMotion ? (
                <img
                  src="./projects/nonconvex-navigation.webp"
                  alt="Autonomous drone navigating through a tree-lined corridor with mapping views"
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
                  aria-label="Autonomous drone navigation test footage"
                >
                  <source src="./projects/nonconvex-navigation.webm" type="video/webm" />
                  <source src="./projects/nonconvex-navigation.mp4" type="video/mp4" />
                  <track
                    kind="captions"
                    src="./projects/nonconvex-navigation.vtt"
                    srcLang="en"
                    label="English"
                  />
                </video>
              )}
              <div className="v3-hero-media-chrome">
                <span><i /> Live project</span>
                <span>Nonconvex α</span>
              </div>
              <div className="v3-hero-media-corner" aria-hidden="true" />
            </div>
          </V3Magnet>
        </motion.div>

        <motion.div className="v3-hero-bottom" variants={item}>
          <p>
            A student developer building autonomous flight systems, embedded tools,
            and creative technology.
          </p>
          <V3Magnet className="v3-hero-cta-magnet" strength={5}>
            <a className="v3-action" href="#projects">
              View drone project <ArrowUpRight aria-hidden="true" />
            </a>
          </V3Magnet>
          <a className="v3-scroll-cue" href="#project-reel" aria-label="Continue to project reel">
            Explore the archive <ArrowDownRight aria-hidden="true" />
          </a>
        </motion.div>
      </motion.div>
      <span className="v3-hero-version" aria-hidden="true">V03 / {profile.name.toUpperCase()}</span>
    </section>
  );
}
