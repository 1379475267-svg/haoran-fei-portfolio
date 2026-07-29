import { useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";
import type { ProjectCoverType } from "../data/profile";

interface ProjectCoverProps {
  type: ProjectCoverType;
  featured?: boolean;
  image?: string;
  videoWebm?: string;
  videoMp4?: string;
  title?: string;
  label?: string;
  language?: "zh" | "en";
}

function GameCover({ language }: { language: "zh" | "en" }) {
  return (
    <div className="cover-scene game-cover">
      <div className="game-sidebar">
        <span />
        <span />
        <span />
      </div>
      <div className="game-library">
        {["8.9", "9.4", "8.6", "9.1"].map((score, index) => (
          <div key={score} className={`game-tile game-tile-${index + 1}`}>
            <i />
            <b>{score}</b>
          </div>
        ))}
      </div>
      <div className="game-rating">
        <span>{language === "zh" ? "最近游玩" : "RECENTLY PLAYED"}</span>
        <div><i /><i /><i /><i /><i /></div>
      </div>
    </div>
  );
}

function MusicCover() {
  return (
    <div className="cover-scene music-cover">
      <div className="music-staff">
        {Array.from({ length: 5 }).map((_, index) => <i key={index} />)}
        <b className="note note-one">N1</b>
        <b className="note note-two">N2</b>
        <b className="note note-three">N3</b>
      </div>
      <div className="fretboard">
        {Array.from({ length: 6 }).map((_, index) => <i key={index} />)}
        <span className="fret-dot fret-a" />
        <span className="fret-dot fret-b" />
        <span className="fret-dot fret-c" />
      </div>
    </div>
  );
}

function SaturnCover() {
  return (
    <div className="cover-scene saturn-cover">
      <div className="saturn-planet" />
      <div className="saturn-ring ring-a" />
      <div className="saturn-ring ring-b" />
      {Array.from({ length: 12 }).map((_, index) => (
        <i
          key={index}
          style={{
            left: `${8 + ((index * 29) % 84)}%`,
            top: `${10 + ((index * 47) % 78)}%`,
          }}
        />
      ))}
    </div>
  );
}

function EmbeddedCover({ language }: { language: "zh" | "en" }) {
  return (
    <div className="cover-scene embedded-cover">
      <div className="chip">
        <span>STM32</span>
      </div>
      <div className="circuit-line circuit-a" />
      <div className="circuit-line circuit-b" />
      <div className="circuit-line circuit-c" />
      <div className="sensor-panel">
        <span>{language === "zh" ? "传感器 / MPU6050" : "SENSOR / MPU6050"}</span>
        <div className="sensor-wave">
          {Array.from({ length: 12 }).map((_, index) => (
            <i key={index} style={{ height: `${20 + ((index * 23) % 68)}%` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

function DroneCover() {
  const mapPoints = [
    [12, 24], [22, 18], [31, 32], [42, 20], [54, 37], [66, 24],
    [76, 41], [86, 29], [18, 58], [33, 68], [48, 55], [61, 72],
    [74, 61], [88, 76], [25, 84], [48, 86],
  ];

  return (
    <div className="cover-scene drone-cover">
      <svg className="drone-route-map" viewBox="0 0 100 100" aria-hidden="true">
        <path className="drone-route-line" d="M10 82 C22 70 25 48 41 55 S61 74 70 50 S78 24 92 18" />
        <circle cx="10" cy="82" r="2.5" />
        <circle cx="41" cy="55" r="2.5" />
        <circle cx="70" cy="50" r="2.5" />
        <circle cx="92" cy="18" r="3.2" />
      </svg>
      {mapPoints.map(([x, y], index) => (
        <i key={index} className="drone-map-point" style={{ left: `${x}%`, top: `${y}%` }} />
      ))}
      <div className="drone-glyph" aria-hidden="true">
        <span className="drone-arm drone-arm-a" />
        <span className="drone-arm drone-arm-b" />
        <i className="drone-rotor rotor-a" />
        <i className="drone-rotor rotor-b" />
        <i className="drone-rotor rotor-c" />
        <i className="drone-rotor rotor-d" />
        <b />
      </div>
    </div>
  );
}

function RailCover({ language }: { language: "zh" | "en" }) {
  return (
    <div className="cover-scene rail-cover">
      <svg className="rail-system-map" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <path className="rail-messenger-wire" d="M-4 23 C22 16 47 27 104 13" />
        <path className="rail-contact-wire" d="M-4 38 C28 31 58 39 104 25" />
        <path className="rail-dropper" d="M12 20 L12 35 M31 20 L31 34 M51 21 L51 34 M72 19 L72 31 M91 16 L91 28" />
        <path className="rail-flight-path" d="M18 75 C34 69 45 58 57 49 S79 37 88 32" />
        <circle className="rail-obstacle-node" cx="18" cy="75" r="2.2" />
        <circle className="rail-wait-node" cx="88" cy="32" r="2.8" />
      </svg>
      <div className="rail-robot-node" aria-hidden="true">
        <i /><i /><span>UGV</span>
      </div>
      <div className="rail-drone-node" aria-hidden="true">
        <i className="rail-drone-arm rail-drone-arm-a" />
        <i className="rail-drone-arm rail-drone-arm-b" />
        <span />
      </div>
      <div className="rail-cover-status">
        <span>{language === "zh" ? "接触线锁定" : "CONTACT LINE LOCK"}</span>
        <strong>{language === "zh" ? "等待下一障碍点" : "WAITING AT NEXT OBSTACLE"}</strong>
      </div>
    </div>
  );
}

function AiCover({ language }: { language: "zh" | "en" }) {
  return (
    <div className="cover-scene ai-cover">
      <div className="ai-feed">
        <div className="recognition-box">
          <span>{language === "zh" ? "人物 / 98%" : "PERSON / 98%"}</span>
        </div>
      </div>
      <div className="ai-metrics">
        <span>{language === "zh" ? "模型状态" : "MODEL STATUS"}</span>
        <strong>YOLOv7</strong>
        <div><i style={{ width: "82%" }} /></div>
        <div><i style={{ width: "64%" }} /></div>
        <div><i style={{ width: "74%" }} /></div>
      </div>
    </div>
  );
}

function CosmosCover() {
  const nodes = [
    [18, 28], [34, 18], [52, 34], [72, 20], [82, 46], [64, 68], [40, 72], [22, 58],
  ];
  return (
    <div className="cover-scene cosmos-cover">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <path d="M18 28 L34 18 L52 34 L72 20 L82 46 L64 68 L40 72 L22 58 Z" />
        <path d="M18 28 L52 34 L64 68 M34 18 L40 72 M72 20 L22 58" />
      </svg>
      {nodes.map(([x, y], index) => (
        <i key={index} style={{ left: `${x}%`, top: `${y}%` }} />
      ))}
      <div className="cosmos-core">N</div>
    </div>
  );
}

export default function ProjectCover({
  type,
  featured = false,
  image,
  videoWebm,
  videoMp4,
  title,
  label,
  language = "en",
}: ProjectCoverProps) {
  const reduceMotion = useReducedMotion();
  const coverRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isInView = useInView(coverRef, { amount: 0.08, margin: "160px 0px" });
  const hasVideo = Boolean(videoWebm || videoMp4);
  const hasMedia = Boolean(image || hasVideo);
  const scenes = {
    drone: <DroneCover />,
    rail: <RailCover language={language} />,
    game: <GameCover language={language} />,
    music: <MusicCover />,
    saturn: <SaturnCover />,
    embedded: <EmbeddedCover language={language} />,
    ai: <AiCover language={language} />,
    cosmos: <CosmosCover />,
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video || reduceMotion || !hasVideo) return;

    const syncPlayback = () => {
      if (isInView && document.visibilityState === "visible") {
        void video.play().catch(() => undefined);
      } else {
        video.pause();
      }
    };

    syncPlayback();
    document.addEventListener("visibilitychange", syncPlayback);

    return () => {
      document.removeEventListener("visibilitychange", syncPlayback);
      video.pause();
    };
  }, [hasVideo, isInView, reduceMotion]);

  return (
    <div
      className={`project-visual project-visual-${type} ${featured ? "is-featured" : ""} ${hasMedia ? "has-cover-image" : ""}`}
      ref={coverRef}
    >
      {image ? (
        <>
          <img
            className="project-cover-image"
            src={image}
            alt={`${title ?? type}${language === "zh" ? " 项目预览" : " preview"}`}
            loading="lazy"
            onError={(event) => {
              event.currentTarget.style.display = "none";
              event.currentTarget.parentElement?.classList.add("is-cover-image-missing");
            }}
          />
          <div className="project-cover-scrim" />
        </>
      ) : null}
      {hasVideo && !reduceMotion ? (
        <video
          className="project-cover-image project-cover-video"
          ref={videoRef}
          loop
          muted
          playsInline
          preload="metadata"
          poster={image}
          aria-label={`${title ?? type}${language === "zh" ? " 动态项目预览" : " animated preview"}`}
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        >
          {videoWebm ? <source src={videoWebm} type="video/webm" /> : null}
          {videoMp4 ? <source src={videoMp4} type="video/mp4" /> : null}
        </video>
      ) : null}
      <div className="cover-grid" aria-hidden="true" />
      <span className="project-cover-label" aria-hidden="true">
        {label ?? (type === "drone" ? "FLIGHT SYSTEM / PROJECT" : `${type.toUpperCase()} / PROJECT`)}
      </span>
      <div className="project-cover-fallback" aria-hidden="true">{scenes[type]}</div>
      {type === "drone" ? (
        <div className="drone-flight-overlay" aria-hidden="true">
          <span className="drone-flight-status"><i /> {language === "zh" ? "LIO 在线" : "LIO ONLINE"}</span>
          <div>
              <span>{language === "zh" ? "定位" : "LOCALIZATION"}</span>
            <strong>Faster-LIO</strong>
          </div>
          <div>
              <span>{language === "zh" ? "规划" : "PLANNING"}</span>
            <strong>Diff-Planner</strong>
          </div>
        </div>
      ) : null}
    </div>
  );
}
