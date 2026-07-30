import { Music2 } from "lucide-react";
import { useRef, useState } from "react";
import { useV3Language } from "./V3Language";

const TRACK_TITLE = "脚踏车 — 周杰伦 / Terdsak Janpan";

export default function V3MusicControl() {
  const { language, t } = useV3Language();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [hasError, setHasError] = useState(false);

  const startPlayback = (audio: HTMLAudioElement) => {
    audio.volume = 0.32;
    void audio.play().catch((error: unknown) => {
      if (error instanceof DOMException && error.name === "NotAllowedError") {
        setIsBlocked(true);
        return;
      }

      setHasError(true);
    });
  };

  const togglePlayback = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (hasError) {
      setHasError(false);
      setIsBlocked(false);
      audio.load();
    }

    if (audio.paused || hasError) {
      startPlayback(audio);
    } else {
      audio.pause();
    }
  };

  const stateLabel = hasError ? "ERR" : isPlaying ? "ON" : isBlocked ? "TAP" : "OFF";

  return (
    <>
      <audio
        ref={audioRef}
        src="./audio/bicycle-bgm.mp3"
        loop
        preload="metadata"
        onPlay={() => {
          setIsPlaying(true);
          setIsBlocked(false);
          setHasError(false);
        }}
        onPause={() => setIsPlaying(false)}
        onError={() => {
          setHasError(true);
          setIsBlocked(false);
          setIsPlaying(false);
        }}
      />
      <button
        type="button"
        className={`v3-music-toggle ${isPlaying ? "is-playing" : ""} ${isBlocked ? "is-blocked" : ""} ${hasError ? "is-error" : ""}`}
        onClick={togglePlayback}
        aria-label={`BGM：${hasError ? t.music.retry : isPlaying ? t.music.pause : t.music.play}：${TRACK_TITLE}`}
        aria-describedby="v3-music-state"
        aria-pressed={isPlaying}
        title={TRACK_TITLE}
      >
        <Music2 aria-hidden="true" />
        <span>BGM</span>
        <span
          id="v3-music-state"
          className="v3-music-state"
          aria-label={hasError ? t.music.error : undefined}
          aria-live="polite"
        >
          {stateLabel}
        </span>
        <span className="v3-music-bars" aria-hidden="true"><i /><i /><i /></span>
      </button>
    </>
  );
}
