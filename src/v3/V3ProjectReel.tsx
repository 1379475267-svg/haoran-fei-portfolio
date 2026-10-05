import { ArrowUpRight, Volume2 } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import JournalProjectMedia from "./JournalProjectMedia";
import { projects, type Project } from "../data/profile";
import { useV3Language, type V3Language } from "./V3Language";
import useV3CompactScreen from "./useV3CompactScreen";

const findProject = (id: string) => projects.find((project) => project.id === id);
const drone = findProject("nonconvex-alpha");
const stringBlade = findProject("string-blade");
const docpilot = findProject("docpilot");

interface StudyChord {
  name: string;
  label: Record<V3Language, string>;
  notes: string;
  frequencies: number[];
}

const studyChords: StudyChord[] = [
  { name: "C", label: { zh: "C 大三和弦", en: "C major" }, notes: "C · E · G", frequencies: [130.81, 164.81, 196, 261.63, 329.63] },
  { name: "Am", label: { zh: "A 小三和弦", en: "A minor" }, notes: "A · C · E", frequencies: [110, 164.81, 220, 261.63, 329.63] },
  { name: "G", label: { zh: "G 大三和弦", en: "G major" }, notes: "G · B · D", frequencies: [98, 123.47, 196, 246.94, 293.66] },
];

/** A small, explicitly synthetic listening study, independent of String Blade. */
function ChordStudy() {
  const { language } = useV3Language();
  const context = useRef<AudioContext | null>(null);
  const voices = useRef<OscillatorNode[]>([]);
  const timer = useRef<number | null>(null);
  const generation = useRef(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const announceSample = (active: boolean) => window.dispatchEvent(new CustomEvent("fhr-audio-sample", { detail: { active } }));

  useEffect(() => () => {
    generation.current += 1;
    if (timer.current !== null) window.clearTimeout(timer.current);
    voices.current.forEach((voice) => { try { voice.stop(); } catch { /* Already finished. */ } });
    if (context.current) void context.current.close();
    announceSample(false);
  }, []);

  const listen = async (index: number) => {
    const turn = ++generation.current;
    if (timer.current !== null) window.clearTimeout(timer.current);
    voices.current.forEach((voice) => { try { voice.stop(); } catch { /* Already finished. */ } });
    voices.current = [];
    setSelected(index);
    setFailed(false);
    announceSample(true);
    try {
      const audio = context.current ?? new AudioContext();
      context.current = audio;
      await audio.resume();
      if (generation.current !== turn) return;
      setPlaying(true);
      studyChords[index].frequencies.forEach((frequency, note) => {
        const start = audio.currentTime + note * 0.022;
        const oscillator = audio.createOscillator();
        const gain = audio.createGain();
        const filter = audio.createBiquadFilter();
        oscillator.type = "triangle";
        oscillator.frequency.value = frequency;
        filter.type = "lowpass";
        filter.frequency.value = 1500;
        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.exponentialRampToValueAtTime(0.045, start + 0.008);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.9);
        oscillator.connect(filter);
        filter.connect(gain);
        gain.connect(audio.destination);
        oscillator.onended = () => {
          oscillator.disconnect();
          filter.disconnect();
          gain.disconnect();
        };
        oscillator.start(start);
        oscillator.stop(start + 0.92);
        voices.current.push(oscillator);
      });
      timer.current = window.setTimeout(() => {
        setPlaying(false);
        voices.current = [];
        timer.current = null;
        announceSample(false);
      }, 1100);
    } catch {
      if (generation.current !== turn) return;
      voices.current.forEach((voice) => { try { voice.stop(); } catch { /* Already finished. */ } });
      voices.current = [];
      setPlaying(false);
      setFailed(true);
      announceSample(false);
    }
  };

  return <div className="nf-chord-study" data-playing={playing || undefined}>
    <div className="nf-study-label"><Volume2 aria-hidden="true" /><span>{language === "zh" ? "和弦小实验" : "CHORD STUDY"}</span><span>{selected === null ? "—" : String(selected + 1).padStart(2, "0")} / 03</span></div>
    <div className="nf-chord-controls" role="group" aria-label={language === "zh" ? "合成和弦试听" : "Synthetic chord listening sample"}>
      {studyChords.map((chord, index) => <button key={chord.name} type="button" onClick={() => void listen(index)} aria-pressed={selected === index}
        aria-label={(language === "zh" ? "试听 " : "Listen to ") + chord.label[language]}>
        <span>{chord.name}</span><span>{chord.notes}</span>
      </button>)}
    </div>
    <p className="nf-study-status" role="status">{failed
      ? language === "zh" ? "当前浏览器无法播放试听。" : "Audio preview is unavailable in this browser."
      : selected !== null
        ? `${studyChords[selected].label[language]} / ${studyChords[selected].notes}`
        : language === "zh" ? "点一个和弦，听见音程之间的关系。" : "Choose a chord. Hear how the notes relate."}</p>
    <p className="nf-study-note">{language === "zh" ? "合成音色试听；完整游戏在 String Blade 中体验。" : "A synthesized listening sample. Explore the full game in String Blade."}</p>
  </div>;
}

function ProjectMedia({ project, destination, language, contain = false }: { project: Project; destination: string; language: V3Language; contain?: boolean }) {
  const showGame = project.id === "string-blade";
  return <a className={`nf-project-media${contain ? " nf-project-media--interface" : ""}`} href={destination}
    aria-label={`${language === "zh" ? "查看项目：" : "Explore project: "}${project.title}`}>
    <JournalProjectMedia image={showGame ? "./projects/string-blade.webp" : project.coverPoster}
      videoWebm={showGame ? undefined : project.coverVideoWebm}
      videoMp4={showGame ? undefined : project.coverVideoMp4} title={project.title} language={language} />
    <span className="nf-media-open" aria-hidden="true"><ArrowUpRight /></span>
  </a>;
}

function SupportingIndex({ ids, language }: { ids: string[]; language: V3Language }) {
  const descriptions: Record<string, Record<V3Language, string>> = {
    "rail-drone-mission-studio": { zh: "车—机协同任务 / 浏览器原型", en: "Robot–drone handoff / browser prototype" },
    chordpilot: { zh: "从音频到和弦时间线", en: "From audio to a chord timeline" },
    "fretboard-caged-lab": { zh: "连接指板、琴键与乐理", en: "Fretboard, keys & music theory" },
    "interactive-particle-saturn": { zh: "手势与轨道之间的实验", en: "A study of gestures & orbits" },
    deadtime: { zh: "复活等待间的 Windows 助手 / v0.1 Beta", en: "A Windows respawn-time companion / v0.1 beta" },
  };
  return <div className="nf-supporting-index">
    <p className="nf-index-label">{language === "zh" ? "同一条线上的实验" : "ALONG THE SAME LINE"}</p>
    {ids.map((id) => {
      const project = findProject(id);
      if (!project) return null;
      const title = id === "interactive-particle-saturn" ? "Particle Saturn" : id === "fretboard-caged-lab" ? "Fret & Key" : project.title;
      return <a className="nf-index-entry" key={id} href={`#project-${id}`}>
        <span className="nf-index-title">{title}</span><span className="nf-index-description">{descriptions[id]?.[language] ?? project.tagline}</span><ArrowUpRight aria-hidden="true" />
      </a>;
    })}
  </div>;
}

function ChapterLabel({ index, word, caption }: { index: string; word: string; caption: string }) {
  return <div className="nf-chapter-label"><span>{index} /</span><span>{caption}</span><span>{word}</span></div>;
}

export default function V3ProjectReel() {
  const { language } = useV3Language();
  const reduced = Boolean(useReducedMotion());
  const compact = useV3CompactScreen();
  const reveal = {
    initial: reduced || compact ? false as const : { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.08 },
    transition: { duration: reduced || compact ? 0 : 0.65 },
  };
  return <section className="nightflight-reel" id="project-reel" aria-labelledby="reel-title">
    <div className="nf-reel-intro nf-inner">
      <p>01 / {language === "zh" ? "精选作品" : "SELECTED WORK"}</p>
      <h2 id="reel-title">{language === "zh" ? <>三个方向。<br /><span>一条持续构建的线。</span></> : <>Three directions.<br /><span>One ongoing practice.</span></>}</h2>
      <nav aria-label={language === "zh" ? "精选作品章节" : "Selected work chapters"}>
        <a href="#nightflight-sense">01 SENSE</a><a href="#nightflight-play">02 PLAY</a><a href="#nightflight-build">03 BUILD</a>
      </nav>
    </div>

    {drone && <motion.article {...reveal} className="nf-chapter nf-chapter--sense" id="nightflight-sense" aria-labelledby="nf-sense-title" data-featured-project={drone.id}>
      <div className="nf-inner">
        <ChapterLabel index="01" word="SENSE" caption={language === "zh" ? "感知与飞行" : "PERCEPTION & FLIGHT"} />
        <div className="nf-sense-heading"><h3 id="nf-sense-title">SENSE<span aria-hidden="true">.</span></h3><p>{language === "zh" ? <>读懂环境，<br />再让系统行动。</> : <>Read the world.<br />Then move through it.</>}</p></div>
        <figure className="nf-sense-figure">
          <ProjectMedia project={drone} destination="#flight-notes" language={language} />
          <figcaption><span>NONCONVEX α / DRONE LAB</span><span>{language === "zh" ? "真实导航测试 · 学生团队在研" : "Navigation test · student team R&D"}</span></figcaption>
        </figure>
        <div className="nf-sense-caption"><div><h4>Nonconvex α</h4><p>{language === "zh" ? "从激光雷达定位建图，到局部轨迹规划与 PX4 控制。一套真实无人机系统，也是一份持续更新的团队工程记录。" : "LiDAR localization and mapping, local trajectory planning, and PX4 control. A real drone stack, with a team engineering record that grows alongside it."}</p></div>
          <div className="nf-project-foot"><p>JETSON ORIN NX / MID-360 / PX4</p><a className="nf-text-link" href="#flight-notes">{language === "zh" ? "翻开飞行笔记" : "Open the flight notes"}<ArrowUpRight aria-hidden="true" /></a></div>
        </div>
        <SupportingIndex ids={["rail-drone-mission-studio"]} language={language} />
      </div>
    </motion.article>}

    {stringBlade && <motion.article {...reveal} className="nf-chapter nf-chapter--play" id="nightflight-play" aria-labelledby="nf-play-title" data-featured-project={stringBlade.id}>
      <div className="nf-inner">
        <ChapterLabel index="02" word="PLAY" caption={language === "zh" ? "音乐与交互" : "MUSIC & INTERACTION"} />
        <div className="nf-play-layout">
          <div className="nf-play-copy"><h3 id="nf-play-title">PLAY<span aria-hidden="true">.</span></h3><h4>String Blade</h4><p className="nf-project-lead">{language === "zh" ? "让一个和弦，拥有看得见的回应。" : "Give a chord a visible response."}</p><p>{language === "zh" ? "通过麦克风和弦识别与 Web MIDI，把吉他练习连接到战斗与节奏。让听、弹与玩，发生在同一刻。" : "Microphone chord recognition and Web MIDI connect guitar practice to combat and rhythm. Listening, playing, and learning meet in one moment."}</p>
            <a className="nf-text-link" href={stringBlade.chinaDemo || stringBlade.demo} target="_blank" rel="noopener noreferrer">{language === "zh" ? "进入 String Blade" : "Play String Blade"}<ArrowUpRight aria-hidden="true" /></a>
            {stringBlade.recognition && <a className="nf-recognition" href={stringBlade.recognition.url} target="_blank" rel="noopener noreferrer">{language === "zh" ? "已被独立游戏平台" : "Curated by"} {stringBlade.recognition.name}{language === "zh" ? " 收录" : ""}<ArrowUpRight aria-hidden="true" /></a>}
          </div>
          <div className="nf-play-stage"><ProjectMedia project={stringBlade} destination="#project-string-blade" language={language} /><p className="nf-image-credit">STRING BLADE / PHASER × WEB AUDIO × WEB MIDI</p><ChordStudy /></div>
        </div>
        <SupportingIndex ids={["chordpilot", "fretboard-caged-lab", "interactive-particle-saturn"]} language={language} />
      </div>
    </motion.article>}

    {docpilot && <motion.article {...reveal} className="nf-chapter nf-chapter--build" id="nightflight-build" aria-labelledby="nf-build-title" data-featured-project={docpilot.id}>
      <div className="nf-inner">
        <ChapterLabel index="03" word="BUILD" caption={language === "zh" ? "日常与工具" : "EVERYDAY TOOLS"} />
        <div className="nf-build-heading"><h3 id="nf-build-title">BUILD<span aria-hidden="true">.</span></h3><p>{language === "zh" ? "把日常里的小麻烦，做成好用的小工具。" : "Small tools for everyday friction."}</p></div>
        <div className="nf-build-layout"><div className="nf-build-media"><ProjectMedia project={docpilot} destination={docpilot.downloadPage || docpilot.demo} language={language} contain /><p className="nf-image-credit">DOCPILOT / WINDOWS DESKTOP / v0.1</p></div>
          <div className="nf-build-copy"><h4>DocPilot</h4><p className="nf-project-lead">{language === "zh" ? "文件有序，思路也有序。" : "A little order, a clearer head."}</p><p>{language === "zh" ? "在本机扫描文档，给出可编辑的命名与目录建议。每一步先预览，再确认；整理后的变化可追溯。" : "Scan documents locally for editable filename and folder suggestions. Preview each change, confirm it, and keep the result traceable."}</p>
            <ol className="nf-build-steps"><li><span>01</span>{language === "zh" ? "扫描文档" : "Scan documents"}</li><li><span>02</span>{language === "zh" ? "核对建议" : "Review suggestions"}</li><li><span>03</span>{language === "zh" ? "确认整理" : "Confirm changes"}</li></ol>
            <a className="nf-text-link" href={docpilot.downloadPage || docpilot.demo}>{language === "zh" ? "下载与使用说明" : "Download & guide"}<ArrowUpRight aria-hidden="true" /></a>
          </div>
        </div>
        <SupportingIndex ids={["deadtime"]} language={language} />
        <a href="#projects" className="nf-archive-link"><span>{language === "zh" ? "继续浏览项目档案" : "Continue to the project archive"}</span><span>PROJECT INDEX<ArrowUpRight aria-hidden="true" /></span></a>
      </div>
    </motion.article>}
  </section>;
}
