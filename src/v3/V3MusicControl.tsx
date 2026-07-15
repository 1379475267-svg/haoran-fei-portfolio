import { Music2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useV3Language } from "./V3Language";

const TRACK_TITLE = "脚踏车 — 周杰伦 / Terdsak Janpan";

export default function V3MusicControl() {
  const { t } = useV3Language();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.32;
    let unlockArmed = false;

    const removeUnlockListeners = () => {
      if (!unlockArmed) return;
      window.removeEventListener("click", unlockPlayback, true);
      window.removeEventListener("keydown", unlockPlayback, true);
      unlockArmed = false;
    };

    const unlockPlayback = (event: Event) => {
      const target = event.target;
      if (target instanceof Element && target.closest(".v3-music-toggle")) return;
      void audio.play().then(removeUnlockListeners).catch(() => setIsBlocked(true));
    };

    const armUnlock = () => {
      if (unlockArmed) return;
      unlockArmed = true;
      window.addEventListener("click", unlockPlayback, true);
      window.addEventListener("keydown", unlockPlayback, true);
    };

    void audio.play().catch(() => {
      setIsBlocked(true);
      armUnlock();
    });

    return removeUnlockListeners;
  }, []);

  const togglePlayback = () => {
    const audio = audioRef.current;
    if (!audio || hasError) return;

    if (audio.paused) {
      void audio.play().catch(() => setIsBlocked(true));
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
        autoPlay
        loop
        preload="auto"
        onPlay={() => {
          setIsPlaying(true);
          setIsBlocked(false);
        }}
        onPause={() => setIsPlaying(false)}
        onError={() => {
          setHasError(true);
          setIsPlaying(false);
        }}
      />
      <button
        type="button"
        className={`v3-music-toggle ${isPlaying ? "is-playing" : ""} ${isBlocked ? "is-blocked" : ""}`}
        onClick={togglePlayback}
        aria-label={`${isPlaying ? t.music.pause : t.music.play}：${TRACK_TITLE}`}
        aria-pressed={isPlaying}
        title={TRACK_TITLE}
        disabled={hasError}
      >
        <Music2 aria-hidden="true" />
        <span>BGM</span>
        <span className="v3-music-state">{stateLabel}</span>
        <span className="v3-music-bars" aria-hidden="true"><i /><i /><i /></span>
      </button>
    </>
  );
}
