import { Music2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useV3Language } from "./V3Language";

const TRACK_TITLE = "脚踏车 — 周杰伦 / Terdsak Janpan";

export default function V3MusicControl() {
  const { language, t } = useV3Language();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [hasError, setHasError] = useState(false);
  const manuallyPausedRef = useRef(false);

  const startPlayback = useCallback((audio: HTMLAudioElement) => {
    audio.volume = 0.32;
    void audio.play().then(
      () => {
        setIsBlocked(false);
        setHasError(false);
      },
      (error: unknown) => {
        const errorName =
          error instanceof DOMException
            ? error.name
            : typeof error === "object" && error !== null && "name" in error
              ? String((error as { name?: unknown }).name)
              : "";

        if (errorName === "NotAllowedError") {
          setIsBlocked(true);
          return;
        }

        if (errorName === "AbortError") {
          return;
        }

        setHasError(true);
      },
    );
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    manuallyPausedRef.current = false;
    audio.volume = 0.32;
    startPlayback(audio);
  }, [startPlayback]);

  useEffect(() => {
    if (isPlaying || hasError || manuallyPausedRef.current) return;

    const unlockPlayback = (event: Event) => {
      if (manuallyPausedRef.current) return;

      const target = event.target;
      if (target instanceof Element && target.closest(".v3-music-toggle")) return;

      const audio = audioRef.current;
      if (!audio || !audio.paused) return;
      startPlayback(audio);
    };

    const listenerOptions: AddEventListenerOptions = { capture: true, passive: true };
    window.addEventListener("pointerdown", unlockPlayback, listenerOptions);
    window.addEventListener("touchstart", unlockPlayback, listenerOptions);
    window.addEventListener("keydown", unlockPlayback, listenerOptions);

    return () => {
      window.removeEventListener("pointerdown", unlockPlayback, listenerOptions);
      window.removeEventListener("touchstart", unlockPlayback, listenerOptions);
      window.removeEventListener("keydown", unlockPlayback, listenerOptions);
    };
  }, [hasError, isPlaying, startPlayback]);

  const togglePlayback = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (hasError) {
      setHasError(false);
      setIsBlocked(false);
      manuallyPausedRef.current = false;
      audio.load();
    }

    if (audio.paused || hasError) {
      manuallyPausedRef.current = false;
      startPlayback(audio);
    } else {
      manuallyPausedRef.current = true;
      setIsBlocked(false);
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
