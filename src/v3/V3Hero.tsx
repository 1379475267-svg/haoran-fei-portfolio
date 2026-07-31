import { ArrowDownRight, ArrowUpRight, Crosshair } from "lucide-react";
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { profile } from "../data/profile";
import V3Magnet from "./V3Magnet";
import { useV3Language } from "./V3Language";

const ENTER_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const COMPACT_MOTION_QUERY = "(max-width: 40rem)";
const HERO_VIDEO_POSTER_TIME = 2.3;

const domainVariants: Variants = {
  hidden: {},
  visible: {
    transition: { delayChildren: 0.08, staggerChildren: 0.09 },
  },
};

const domainItemVariants: Variants = {
  hidden: { opacity: 0, y: 4 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.38, ease: ENTER_EASE },
  },
};

const domainVariants: Variants = {
  hidden: {},
  visible: {
    transition: { delayChildren: 0.08, staggerChildren: 0.09 },
  },
};

const domainItemVariants: Variants = {
  hidden: { opacity: 0, y: 4 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.38, ease: ENTER_EASE },
  },
};

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

interface V3HeroProps {
  ready: boolean;
}

export default function V3Hero({ ready }: V3HeroProps) {
  const reduceMotion = Boolean(useReducedMotion());
  const compactMotion = useCompactMotion();
  const heroRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const heroInView = useInView(heroRef, { amount: 0.08 });
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const smoothedScrollProgress = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 32,
    mass: 0.28,
  });
  const handoffY = useTransform(
    smoothedScrollProgress,
    [0, 0.58, 1],
    [0, 0, compactMotion ? -18 : -56],
  );
  const handoffOpacity = useTransform(
    smoothedScrollProgress,
    [0, 0.62, 1],
    [1, 1, 0.18],
  );
  const handoffScale = useTransform(
    smoothedScrollProgress,
    [0, 0.62, 1],
    [1, 1, compactMotion ? 0.995 : 0.982],
  );
  const [mediaReady, setMediaReady] = useState(false);
  const [mediaVisible, setMediaVisible] = useState(false);
  const variants = useMemo(
    () => createHeroMotionVariants(compactMotion),
    [compactMotion],
  );
  const handoffOpacity = useTransform(
    smoothedScrollProgress,
    [0, 0.62, 1],
    [1, 1, 0.18],
  );
  const handoffScale = useTransform(
    smoothedScrollProgress,
    [0, 0.62, 1],
    [1, 1, compactMotion ? 0.995 : 0.982],
  );
  const [mediaReady, setMediaReady] = useState(false);
  const [mediaVisible, setMediaVisible] = useState(false);
  const variants = useMemo(
    () => createHeroMotionVariants(compactMotion),
    [compactMotion],
  );
  const { language, t } = useV3Language();
  const initialState = reduceMotion ? false : "hidden";
  const animateState = ready ? "visible" : "hidden";

  useEffect(() => {
    const video = videoRef.current;

    if (!video || reduceMotion) return undefined;
    let active = true;

    const syncPlayback = () => {
      const shouldPlay = ready
        && mediaReady
        && heroInView
        && document.visibilityState === "visible";

      if (!shouldPlay) {
        video.pause();
        setMediaVisible(false);
        return;
      }

      void video.play().then(
        () => {
          if (active) setMediaVisible(true);
        },
        () => {
          if (active) setMediaVisible(false);
        },
      );
    };

    if (!ready || !mediaReady || !heroInView) {
      video.pause();
      setMediaVisible(false);
      return undefined;
    }

    syncPlayback();
    document.addEventListener("visibilitychange", syncPlayback);

    return () => {
      active = false;
      document.removeEventListener("visibilitychange", syncPlayback);
      video.pause();
    };
  }, [heroInView, mediaReady, ready, reduceMotion]);

  const prepareVideoPosterFrame = () => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = Math.min(HERO_VIDEO_POSTER_TIME, video.duration || HERO_VIDEO_POSTER_TIME);
  };

  const confirmVideoPosterFrame = () => {
    const video = videoRef.current;
    if (!video) return;

    if (Math.abs(video.currentTime - HERO_VIDEO_POSTER_TIME) < 0.2) {
      setMediaReady(true);
    }
  };

  return (
    <section
      className="v3-hero"
      id="home"
      ref={heroRef}
      aria-labelledby="v3-hero-title"
      data-ready={ready || undefined}
    >
      <motion.div
        className="v3-hero-scroll-frame"
        style={reduceMotion ? undefined : {
          y: handoffY,
          opacity: handoffOpacity,
          scale: handoffScale,
        }}
      >
        <div className="v3-hero-grid" />
      </motion.div>

      <motion.div
        className="v3-hero-scroll-frame"
        style={reduceMotion ? undefined : {
          y: handoffY,
          opacity: handoffOpacity,
          scale: handoffScale,
        }}
      >
        <motion.div
          className="v3-hero-inner"
          variants={variants.sequence}
          initial={initialState}
          animate={animateState}
        >
        <motion.div className="v3-hero-kicker" variants={variants.supportItem}>
          <span>{t.hero.kicker}</span>
          <span>{t.hero.location} / 31.2304° N</span>
        </motion.div>

        <motion.div className="v3-hero-title-wrap" variants={variants.titleGroup}>
          <h1 id="v3-hero-title">
            <motion.span className="v3-hero-greeting" variants={variants.titleLine}>
              {t.hero.greeting}
            </motion.span>
            <motion.strong className="v3-hero-name-filled" variants={variants.titleLine}>
              Haoran
            </motion.strong>
            <motion.strong className="v3-hero-name-outline" variants={variants.titleLine}>
              Fei
            </motion.strong>
          </h1>
        </motion.div>

        <motion.div className="v3-hero-support" variants={variants.supportGroup}>
          <motion.div className="v3-hero-media-reveal" variants={variants.media}>
            <div className="v3-hero-media-stage">
              <V3Magnet className="v3-hero-media-magnet" strength={8}>
                <div className="v3-hero-media" data-live={mediaVisible || undefined}>
                  <img
                    src="./projects/nonconvex-navigation.webp"
                    alt={reduceMotion ? t.hero.mediaAlt : ""}
                    aria-hidden={reduceMotion ? undefined : true}
                    width={568}
                    height={320}
                    loading="eager"
                    decoding="async"
                    draggable={false}
                  />
                  {!reduceMotion && (
                    <video
                      ref={videoRef}
                      className={mediaVisible ? "is-visible" : undefined}
                      muted
                      loop
                      playsInline
                      preload="auto"
                      poster="./projects/nonconvex-navigation.webp"
                      aria-label={t.hero.mediaAria}
                      width={568}
                      height={320}
                      onLoadedMetadata={prepareVideoPosterFrame}
                      onCanPlay={confirmVideoPosterFrame}
                      onSeeked={confirmVideoPosterFrame}
                      onError={() => {
                        setMediaReady(false);
                        setMediaVisible(false);
                      }}
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

        <motion.div className="v3-hero-copy-block" variants={variants.body}>
          <p className="v3-hero-intro">{t.hero.body}</p>
          <motion.div
            className="v3-hero-domain"
            aria-label="Sense, plan, fly"
            variants={domainVariants}
          >
            <motion.span variants={domainItemVariants}><Crosshair aria-hidden="true" /> Sense</motion.span>
            <motion.span variants={domainItemVariants}>Plan</motion.span>
            <motion.span variants={domainItemVariants}>Fly</motion.span>
          </motion.div>
        </motion.div>

        <motion.div className="v3-hero-cta-reveal" variants={variants.action}>
          <V3Magnet className="v3-hero-cta-magnet" strength={5}>
            <a
              className="v3-action"
              href="#projects"
            >
              {t.hero.viewProject} <ArrowUpRight aria-hidden="true" />
            </a>
          </V3Magnet>
        </motion.div>

        <motion.div className="v3-hero-final-details" variants={variants.finalGroup}>
          <motion.span
            className="v3-hero-version"
            aria-hidden="true"
            variants={variants.versionItem}
          >
            <motion.span variants={domainItemVariants}><Crosshair aria-hidden="true" /> Sense</motion.span>
            <motion.span variants={domainItemVariants}>Plan</motion.span>
            <motion.span variants={domainItemVariants}>Fly</motion.span>
          </motion.div>
        </motion.div>

        <motion.div className="v3-hero-cta-reveal" variants={variants.action}>
          <V3Magnet className="v3-hero-cta-magnet" strength={5}>
            <a
              className="v3-action"
              href="#projects"
            >
              {t.hero.viewProject} <ArrowUpRight aria-hidden="true" />
            </a>
          </V3Magnet>
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
            <span className="v3-scroll-cue-icon" aria-hidden="true">
              <ArrowDownRight />
            </span>
          </motion.a>
        </motion.div>
        </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
