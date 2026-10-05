import { ArrowDown, ArrowUpRight, Pause, Play } from "lucide-react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import V3RevealTitle from "./V3RevealTitle";
import { useV3Language } from "./V3Language";
import { V3_BACKGROUND_TRACK } from "./V3MusicTrack";
import useV3CompactScreen from "./useV3CompactScreen";

const HOME_REVEAL = V3_BACKGROUND_TRACK.id === "home-heart";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const chapters = [
  { id: "sense", word: "SENSE", zh: "感知与飞行", en: "Autonomous systems" },
  { id: "play", word: "PLAY", zh: "音乐与交互", en: "Music & interaction" },
  { id: "build", word: "BUILD", zh: "日常与工具", en: "Useful tools" },
] as const;

export default function V3NightFlightHero({ ready }: { ready: boolean }) {
  const { language } = useV3Language();
  const reduced = Boolean(useReducedMotion());
  const compact = useV3CompactScreen();
  const filmRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const inView = useInView(filmRef, { amount: 0.12 });
  const [paused, setPaused] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let active = true;
    const sync = () => {
      if (!ready || !inView || !videoReady || paused || reduced || document.visibilityState !== "visible") {
        video.pause(); setPlaying(false); return;
      }
      void video.play().then(() => { if (active) setPlaying(true); }, () => { if (active) setPlaying(false); });
    };
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => { active = false; video.pause(); document.removeEventListener("visibilitychange", sync); };
  }, [ready, inView, videoReady, paused, reduced]);

  const reveal = (delay = 0) => ({
    initial: reduced ? false as const : { opacity: 0, y: 18 },
    animate: ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 },
    transition: { duration: reduced ? 0 : 0.85, delay: reduced ? 0 : delay, ease: EASE },
  });

  return (
    <section className="v3-hero journal-hero nightflight-hero" id="home"
      aria-labelledby="v3-hero-title" data-ready={ready || undefined}>
      <div className="nightflight-hero-inner">
        <motion.div className="nightflight-hero-kicker" {...reveal(HOME_REVEAL ? 0.48 : 0)}>
          <span>{language === "zh" ? "电子信息 / 开发者" : "ELECTRONIC INFORMATION / DEVELOPER"} <i>2026</i></span>
        </motion.div>
        <h1 id="v3-hero-title" className="journal-masthead">
          <V3RevealTitle text="HAORAN" ready={ready} delay={HOME_REVEAL ? 0.26 : 0} />
          <V3RevealTitle text="FEI" ready={ready} delay={HOME_REVEAL ? 0.43 : 0} className="journal-name-gold" />
        </h1>
        <div className="nightflight-hero-stage">
          <motion.figure className="nightflight-hero-film" {...reveal(HOME_REVEAL ? 0.55 : 0.12)}>
            <div className="nightflight-film-window" ref={filmRef}>
              <img src="./projects/nightflight-corridor.webp"
                alt={language === "zh" ? "无人机在林荫走廊中进行飞行测试" : "A drone during a corridor flight test"}
                width={408} height={320} decoding="async" />
              {!reduced && <video ref={videoRef} className={playing ? "is-playing" : ""}
                muted loop playsInline preload="metadata" width={408} height={320}
                poster="./projects/nightflight-corridor.webp"
                aria-label={language === "zh" ? "无人机真实飞行片段，无声循环" : "Real drone flight footage, silent loop"}
                onCanPlay={() => setVideoReady(true)} onError={() => { setVideoReady(false); setPlaying(false); }}>
                <source src="./projects/nightflight-corridor.webm" type="video/webm" />
                <source src="./projects/nightflight-corridor.mp4" type="video/mp4" />
              </video>}
              {!reduced && <button className="nightflight-film-toggle" type="button"
                onClick={() => setPaused((value) => !value)} aria-pressed={paused}
                aria-label={paused ? language === "zh" ? "播放飞行画面" : "Play flight footage" : language === "zh" ? "暂停飞行画面" : "Pause flight footage"}>
                {paused ? <Play aria-hidden="true" /> : <Pause aria-hidden="true" />}
              </button>}
            </div>
            <figcaption><span><b>FIELD / 01</b> NONCONVEX α</span>
              <span>{language === "zh" ? "真实实验记录" : "FROM THE FIELD"}</span></figcaption>
          </motion.figure>
          <motion.div className="nightflight-hero-editorial" {...(compact ? { initial: false, animate: { opacity: 1, y: 0 } } : reveal(HOME_REVEAL ? 0.72 : 0.3))}>
            <p className="nightflight-margin-label">SENSE. PLAN. FLY.</p>
            <p className="nightflight-hero-statement">{language === "zh" ? <>让想法，<br />飞起来。</> : <>Built<br />to move.</>}</p>
            <p className="nightflight-hero-description">{language === "zh"
              ? "在自主飞行、音乐与代码之间，把好奇心做成可以体验的作品。"
              : "Turning curiosity into tangible work, across autonomous flight, music and code."}</p>
            <a className="nightflight-field-link" href="#flight-notes">
              <span>{language === "zh" ? "走进一次飞行实验" : "Inside a flight experiment"}</span><ArrowUpRight aria-hidden="true" />
            </a>
            <a className="nightflight-scroll-link" href="#project-reel">
              <ArrowDown aria-hidden="true" /><span>{language === "zh" ? "向下探索" : "SCROLL TO EXPLORE"}</span>
            </a>
          </motion.div>
        </div>
        <motion.nav className="nightflight-chapter-index" aria-label={language === "zh" ? "作品章节" : "Work chapters"} {...(compact ? { initial: false, animate: { opacity: 1, y: 0 } } : reveal(HOME_REVEAL ? 0.90 : 0.42))}>
          {chapters.map((chapter, index) => <a href={`#nightflight-${chapter.id}`} key={chapter.id}>
            <span className="nightflight-index-number">0{index + 1}</span><span>{chapter.word}<small>{chapter[language]}</small></span>
            <ArrowUpRight aria-hidden="true" />
          </a>)}
        </motion.nav>
      </div>
    </section>
  );
}
