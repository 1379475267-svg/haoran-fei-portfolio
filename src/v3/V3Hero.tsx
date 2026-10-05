import { ArrowUpRight } from "lucide-react";
import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";
import { useEffect, useMemo, useRef, useState, type PointerEvent } from "react";
import V3RevealTitle from "./V3RevealTitle";
import { useV3Language } from "./V3Language";

const ENTER_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const COMPACT_MOTION_QUERY = "(max-width: 40rem), (pointer: coarse)";
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
  const pointerBounds = useRef<DOMRect | null>(null);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const imageX = useSpring(pointerX, { stiffness: 90, damping: 24, mass: 0.5 });
  const imageY = useSpring(pointerY, { stiffness: 90, damping: 24, mass: 0.5 });
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
    [0, 0, -24],
  );
  const handoffScale = useTransform(
    smoothedScrollProgress,
    [0, 0.62, 1],
    [1, 1, 0.985],
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

  const resetDepth = () => {
    pointerBounds.current = null;
    pointerX.set(0);
    pointerY.set(0);
  };
  const moveDepth = (event: PointerEvent<HTMLElement>) => {
    if (!ready || reduceMotion || compactMotion || event.pointerType !== "mouse") return;
    const bounds = pointerBounds.current ?? event.currentTarget.getBoundingClientRect();
    pointerBounds.current = bounds;
    pointerX.set(Math.max(-1, Math.min(1, (event.clientX - bounds.left) / bounds.width * 2 - 1)) * -7);
    pointerY.set(Math.max(-1, Math.min(1, (event.clientY - bounds.top) / bounds.height * 2 - 1)) * -4);
  };

  useEffect(() => {
    if (reduceMotion || compactMotion) {
      pointerX.set(0);
      pointerY.set(0);
    }
    const clearBounds = () => { pointerBounds.current = null; };
    window.addEventListener("scroll", clearBounds, { passive: true });
    window.addEventListener("resize", clearBounds);
    return () => {
      window.removeEventListener("scroll", clearBounds);
      window.removeEventListener("resize", clearBounds);
    };
  }, [compactMotion, reduceMotion, pointerX, pointerY]);

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
  }, [compactMotion, heroInView, mediaReady, ready, reduceMotion]);

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
    <section className="v3-hero journal-hero" id="home" ref={heroRef}
      aria-labelledby="v3-hero-title" data-ready={ready || undefined}
      onPointerMove={moveDepth} onPointerLeave={resetDepth} onPointerCancel={resetDepth}>
      <motion.div className="journal-hero-handoff"
        style={{
          y: reduceMotion || compactMotion ? 0 : handoffY,
          scale: reduceMotion || compactMotion ? 1 : handoffScale,
          opacity: 1,
          transformOrigin: "50% 0%",
        }}>
      <motion.div className="journal-hero-inner" initial={initialState} animate={animateState} variants={variants.sequence}>
        <motion.div className="journal-hero-eyebrow" variants={variants.supportItem}>
          <span>{t.hero.greeting}</span><span>{t.hero.kicker} / 2026</span>
        </motion.div>
        <h1 id="v3-hero-title" className="journal-masthead">
          <V3RevealTitle text="HAORAN" ready={ready} />
          <V3RevealTitle text="FEI" ready={ready} className="journal-name-gold" />
        </h1>
        <div className="journal-hero-body">
          <motion.figure className="journal-hero-figure" variants={variants.media}>
            <motion.div className="journal-hero-media-mask"
              initial={reduceMotion ? false : { clipPath: "inset(0 0 100% 0)" }}
              animate={ready ? { clipPath: "inset(0 0 0% 0)" } : undefined}
              transition={{ duration: 1.15, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}>
              <div className="journal-hero-media">
                <motion.img style={reduceMotion || compactMotion ? undefined : { x: imageX, y: imageY, scale: 1.045 }}
                  src="./projects/nonconvex-navigation.webp" alt={t.hero.mediaAlt}
                  width={568} height={320} loading="eager" decoding="async" draggable={false} />
                {!reduceMotion && <motion.video ref={videoRef}
                  className={mediaVisible ? "is-visible" : undefined}
                  style={reduceMotion ? undefined : { x: imageX, y: imageY, scale: compactMotion ? 1.02 : 1.045 }}
                  muted loop playsInline preload={compactMotion ? "metadata" : "auto"} poster="./projects/nonconvex-navigation.webp"
                  aria-label={t.hero.mediaAria} width={568} height={320}
                  onLoadedMetadata={prepareVideoPosterFrame} onCanPlay={confirmVideoPosterFrame}
                  onSeeked={confirmVideoPosterFrame}
                  onError={() => { setMediaReady(false); setMediaVisible(false); }}>
                  <source src="./projects/nonconvex-navigation.webm" type="video/webm" />
                  <source src="./projects/nonconvex-navigation.mp4" type="video/mp4" />
                  <track kind="captions" src="./projects/nonconvex-navigation.vtt"
                    srcLang={language === "zh" ? "zh" : "en"} label={language === "zh" ? "中文字幕" : "English"} />
                </motion.video>}
              </div>
            </motion.div>
            <figcaption><span><b>01</b> NONCONVEX α <i>/</i> AUTONOMOUS SYSTEMS</span>
              <span>{language === "zh" ? "感知 / 规划 / 飞行" : "SENSE / PLAN / FLY"}</span></figcaption>
          </motion.figure>
          <motion.div className="journal-hero-note" variants={variants.supportGroup}>
            <motion.p className="journal-hero-statement" variants={variants.supportItem}>
              {language === "zh" ? <>把热爱，<br />做成真实系统。</> : <>Build what <br />moves you.</>}
            </motion.p>
            <motion.p className="journal-hero-description" variants={variants.supportItem}>{t.hero.body}</motion.p>
            <motion.div variants={variants.action}>
              <a className="journal-hero-action" href="#project-reel">
                <span className="journal-action-circle"><ArrowUpRight aria-hidden="true" /></span>
                <span>{language === "zh" ? "探索项目" : "Explore the work"}</span>
              </a>
            </motion.div>
            <motion.a className="journal-hero-featured-link" href="#project-nonconvex-alpha" variants={variants.finalItem}>
              {t.hero.viewProject}<ArrowUpRight aria-hidden="true" />
            </motion.a>
          </motion.div>
        </div>
      </motion.div>
      </motion.div>
    </section>
  );
}
