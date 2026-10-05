import { useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface Props {
  image?: string;
  title: string;
  language: "zh" | "en";
  videoWebm?: string;
  videoMp4?: string;
}

/** Real project media, with a poster kept underneath asynchronous playback. */
export default function JournalProjectMedia({ image, title, language, videoWebm, videoMp4 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const inView = useInView(ref, { amount: 0.05 });
  const reduced = Boolean(useReducedMotion());
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const hasVideo = Boolean(videoWebm || videoMp4) && !reduced && !failed;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let disposed = false;
    const sync = () => {
      if (!inView || document.visibilityState !== "visible") {
        video.pause();
        setPlaying(false);
        return;
      }
      void video.play().then(() => {
        if (disposed || !inView || document.visibilityState !== "visible") video.pause();
        else setPlaying(true);
      }, () => { if (!disposed) setPlaying(false); });
    };
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => {
      disposed = true;
      document.removeEventListener("visibilitychange", sync);
      video.pause();
    };
  }, [inView, hasVideo]);

  return <div ref={ref} className="journal-project-media" data-playing={playing && hasVideo || undefined}>
    {image && !imageFailed
      ? <img className="journal-project-poster" src={image} alt={`${title}${language === "zh" ? " 项目预览" : " preview"}`} loading="lazy" decoding="async" onError={() => setImageFailed(true)} />
      : <span className="journal-media-fallback">{language === "zh" ? "预览暂时不可用，请查看项目详情。" : "Preview unavailable. Explore the project for details."}</span>}
    {hasVideo && inView && <video ref={videoRef} className="journal-project-video" muted loop playsInline preload="metadata" poster={image} aria-hidden="true"
      onError={() => { setPlaying(false); setFailed(true); }}>
      {videoWebm && <source src={videoWebm} type="video/webm" />}
      {videoMp4 && <source src={videoMp4} type="video/mp4" />}
    </video>}
  </div>;
}
