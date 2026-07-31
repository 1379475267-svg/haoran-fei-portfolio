import { Music2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useV3Language } from "./V3Language";

const TRACK_TITLE = "Take Your Time (feat. Engelwood) — 英雄联盟 / Engelwood";

function getPlaybackErrorName(error: unknown) {
  if (error instanceof DOMException) return error.name;
  if (typeof error === "object" && error !== null && "name" in error) {
    return String((error as { name?: unknown }).name);
  }

  return "";
}

export default function V3MusicControl() {
  const { language, t } = useV3Language();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [hasError, setHasError] = useState(false);
  const isPlayingRef = useRef(false);
  const hasErrorRef = useRef(false);
  const manuallyPausedRef = useRef(false);
  const mountedRef = useRef(false);
  const playAttemptRef = useRef<Promise<void> | null>(null);

  const requestPlayback = useCallback((audio: HTMLAudioElement, allowRetry = false) => {
    if (
      manuallyPausedRef.current
      || isPlayingRef.current
      || !audio.paused
      || playAttemptRef.current
      || (!allowRetry && hasErrorRef.current)
    ) {
      return;
    }

    audio.volume = 0.32;
    audio.muted = false;

    let request: Promise<void>;
    try {
      request = audio.play();
    } catch (error) {
      const errorName = getPlaybackErrorName(error);
      if (errorName === "NotAllowedError") {
        if (mountedRef.current) setIsBlocked(true);
        return;
      }

      if (errorName !== "AbortError") {
        hasErrorRef.current = true;
        if (mountedRef.current) {
          setHasError(true);
          setIsBlocked(false);
        }
      }
      return;
    }

    playAttemptRef.current = request;
    void request.then(
      () => {
        if (playAttemptRef.current === request) playAttemptRef.current = null;
        if (!mountedRef.current) return;

        isPlayingRef.current = true;
        hasErrorRef.current = false;
        setIsPlaying(true);
        setIsBlocked(false);
        setHasError(false);
      },
      (error: unknown) => {
        if (playAttemptRef.current === request) playAttemptRef.current = null;
        if (!mountedRef.current) return;

        const errorName = getPlaybackErrorName(error);

        if (errorName === "NotAllowedError") {
          setIsBlocked(true);
          return;
        }

        if (errorName === "AbortError") {
          return;
        }

        hasErrorRef.current = true;
        setHasError(true);
        setIsBlocked(false);
      },
    );
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    manuallyPausedRef.current = false;
    audio.volume = 0.32;
    requestPlayback(audio);
  }, [requestPlayback]);

  useEffect(() => {
    const unlockPlayback = (event: Event) => {
      if (manuallyPausedRef.current) return;

      const target = event.target;
      if (target instanceof Element && target.closest(".v3-music-toggle")) return;

      const audio = audioRef.current;
      if (!audio) return;
      requestPlayback(audio);
    };

    const listenerOptions: AddEventListenerOptions = { capture: true, passive: true };
    const unlockEvents = ["pointerdown", "touchend", "keydown", "click", "wheel"] as const;
    unlockEvents.forEach((eventName) => {
      window.addEventListener(eventName, unlockPlayback, listenerOptions);
    });

    return () => {
      unlockEvents.forEach((eventName) => {
        window.removeEventListener(eventName, unlockPlayback, listenerOptions);
      });
    };
  }, [requestPlayback]);

  const togglePlayback = () => {
    const audio = audioRef.current;
    if (!audio) return;

    const shouldRetry = hasErrorRef.current;
    if (shouldRetry) {
      hasErrorRef.current = false;
      setHasError(false);
      setIsBlocked(false);
      manuallyPausedRef.current = false;
      audio.load();
    }

    if (audio.paused || shouldRetry) {
      manuallyPausedRef.current = false;
      requestPlayback(audio, shouldRetry);
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
        src="/audio/take-your-time-engelwood.mp3"
        loop
        preload="auto"
        playsInline
        onPlay={() => {
          isPlayingRef.current = true;
          hasErrorRef.current = false;
          setIsPlaying(true);
          setIsBlocked(false);
          setHasError(false);
        }}
        onPause={() => {
          isPlayingRef.current = false;
          setIsPlaying(false);
        }}
        onError={() => {
          hasErrorRef.current = true;
          isPlayingRef.current = false;
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
