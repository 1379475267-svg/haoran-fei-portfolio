import { ArrowUpRight, Pause, Play } from "lucide-react";
import { useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useV3Language } from "./V3Language";

const copy = {
  zh: {
    chapter: "01 / 感知与飞行",
    title: "从走廊开始。",
    introduction: "一段飞行，背后是一整个闭环。",
    project: "Nonconvex α · 学生团队研发",
    views: "选择项目影像",
    scene: "实飞片段",
    perception: "感知画面",
    sceneAlt: "无人机在有树木的走廊中飞行，裁剪后的画面只保留真实场景",
    perceptionAlt: "项目原始画面：右侧是无人机飞行，左侧是彩色建图和黑白深度视图",
    sceneCaption: "走廊中的导航片段 · 裁剪自现有项目影像，循环播放。",
    perceptionCaption: "同一段影像的记录帧 · 左侧保留建图与深度视图，供观察系统感知。",
    archiveLabel: "项目影像 / 记录帧",
    recordedLabel: "记录影像 / 4.6 秒",
    pause: "暂停片段",
    play: "播放片段",
    problem: "问题",
    problemText: "如何保留厂家基线，同时逐步迭代真实无人机的定位、规划与控制？",
    decision: "取舍",
    decisionText: "原始备份、稳定主线与实验分支分开保存。让感知、轨迹规划与 PX4 控制在可追溯的配置下连接起来。",
    status: "当前进度",
    statusText: "团队在研。按仿真、拆桨与受控实飞分阶段验证；当前配置面向这套实机。",
    focus: "这份记录关注团队系统与实验流程。",
    next: "下一次实验",
    nextText: "继续验证链路，记录每次配置变化、实验现象与下一步调整。",
    github: "打开工程记录",
    stack: "目前使用",
  },
  en: {
    chapter: "01 / SENSE & FLY",
    title: "Start with a corridor.",
    introduction: "A short flight. A complete loop behind it.",
    project: "Nonconvex α · Student team R&D",
    views: "Choose project footage",
    scene: "Flight clip",
    perception: "Perception frame",
    sceneAlt: "A drone flying through a tree-lined corridor, cropped to show the real scene",
    perceptionAlt: "Original project footage: the drone on the right, mapping and depth views on the left",
    sceneCaption: "Corridor navigation · A cropped loop from the existing project footage.",
    perceptionCaption: "A recorded frame from the same footage · Mapping and depth views remain visible on the left.",
    archiveLabel: "PROJECT FOOTAGE / STILL FRAME",
    recordedLabel: "RECORDED FOOTAGE / 4.6 SECONDS",
    pause: "Pause clip",
    play: "Play clip",
    problem: "Question",
    problemText: "How do we preserve the vendor baseline while extending a real drone's localization, planning, and control?",
    decision: "Decision",
    decisionText: "Keep raw backups, stable main, and experiments separate. Connect sensing, trajectory planning, and PX4 control through traceable configuration.",
    status: "Current stage",
    statusText: "Active team R&D. Simulation, prop-off, and controlled-flight validation proceed in stages; the configuration is specific to this hardware.",
    focus: "These notes focus on the team's system and experimental process.",
    next: "Next experiment",
    nextText: "Continue validating the chain, recording configuration changes, observations, and the next adjustment.",
    github: "Open engineering archive",
    stack: "Current stack",
  },
} as const;

export default function V3FlightNotes() {
  const { language } = useV3Language();
  const text = copy[language];
  const reducedMotion = Boolean(useReducedMotion());
  const evidenceRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const inView = useInView(evidenceRef, { amount: 0.08 });
  const [view, setView] = useState<"scene" | "perception">("scene");
  const [playRequested, setPlayRequested] = useState(!reducedMotion);
  const [playRequest, setPlayRequest] = useState(0);
  const [playing, setPlaying] = useState(false);

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;
    if (playing) {
      setPlayRequested(false);
      video.pause();
    } else {
      setPlayRequested(true);
      // A repeated request can retry playback, but visibility remains the gate.
      setPlayRequest((request) => request + 1);
    }
  };

  useEffect(() => {
    if (!reducedMotion) return;
    // Turning on reduced motion stops autoplay; an explicit later Play remains available.
    setPlayRequested(false);
    videoRef.current?.pause();
  }, [reducedMotion]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const syncPlayback = () => {
      if (view !== "scene" || !inView || !playRequested || document.visibilityState !== "visible") {
        video.pause();
        return;
      }
      void video.play().catch(() => setPlaying(false));
    };

    syncPlayback();
    document.addEventListener("visibilitychange", syncPlayback);
    return () => {
      video.pause();
      document.removeEventListener("visibilitychange", syncPlayback);
    };
  }, [inView, playRequest, playRequested, view]);

  return (
    <section className="nf-flight-notes" id="flight-notes" aria-labelledby="nf-flight-title">
      <div className="nf-flight-inner">
        <header className="nf-flight-heading">
          <div className="nf-flight-folio">
            <span>FIELD NOTES</span>
            <span>{text.chapter}</span>
          </div>
          <div className="nf-flight-title-row">
            <h2 id="nf-flight-title">{text.title}</h2>
            <p>{text.introduction}</p>
          </div>
        </header>

        <div className="nf-flight-study">
          <figure className="nf-flight-figure">
            <div className="nf-flight-view-controls" role="group" aria-label={text.views}>
              <button type="button" aria-pressed={view === "scene"} aria-controls="nf-flight-evidence"
                onClick={() => setView("scene")}>
                <span aria-hidden="true">01</span>{text.scene}
              </button>
              <button type="button" aria-pressed={view === "perception"} aria-controls="nf-flight-evidence"
                onClick={() => setView("perception")}>
                <span aria-hidden="true">02</span>{text.perception}
              </button>
            </div>

            <div className="nf-flight-evidence" id="nf-flight-evidence" ref={evidenceRef} data-view={view}>
              {view === "scene" ? (
                <video ref={videoRef} muted loop playsInline preload="metadata"
                  poster="./projects/nightflight-corridor.webp" width={408} height={320}
                  aria-label={text.sceneAlt}
                  onPlaying={() => setPlaying(true)} onPause={() => setPlaying(false)}
                  onError={() => setPlaying(false)}>
                  <source src="./projects/nightflight-corridor.webm" type="video/webm" />
                  <source src="./projects/nightflight-corridor.mp4" type="video/mp4" />
                </video>
              ) : (
                <img src="./projects/nightflight-perception.webp" alt={text.perceptionAlt}
                  width={568} height={320} loading="lazy" decoding="async" />
              )}
            </div>

            <figcaption>
              <div>
                <span className="nf-flight-capture-label">{view === "scene" ? text.recordedLabel : text.archiveLabel}</span>
                <p aria-live="polite">{view === "scene" ? text.sceneCaption : text.perceptionCaption}</p>
              </div>
              {view === "scene" && (
                <button type="button" className="nf-flight-play" aria-label={playing ? text.pause : text.play}
                  onClick={togglePlayback}>
                  {playing ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
                  <span>{playing ? text.pause : text.play}</span>
                </button>
              )}
            </figcaption>
          </figure>

          <div className="nf-flight-record">
            <p className="nf-flight-project">{text.project}</p>
            <dl className="nf-flight-decisions">
              <div><dt>{text.problem}</dt><dd>{text.problemText}</dd></div>
              <div><dt>{text.decision}</dt><dd>{text.decisionText}</dd></div>
              <div><dt>{text.status}</dt><dd>{text.statusText}</dd></div>
            </dl>
            <p className="nf-flight-attribution">{text.focus}</p>
            <a className="nf-flight-github" href="https://github.com/1379475267-svg/nonconvex-alpha-standard"
              target="_blank" rel="noreferrer">
              {text.github}<ArrowUpRight aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="nf-flight-footnote">
          <div className="nf-flight-stack">
            <span>{text.stack}</span>
            <p>Mid-360 / Faster-LIO / Diff-Planner / PX4</p>
          </div>
          <div className="nf-flight-next">
            <span>{text.next}</span>
            <p>{text.nextText}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
