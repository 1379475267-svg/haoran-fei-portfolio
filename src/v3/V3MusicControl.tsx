import { Music2 } from "lucide-react";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { useV3Language } from "./V3Language";

const TRACK_TITLE = "Take Your Time (feat. Engelwood)";

export interface V3MusicControlHandle {
  startFromGesture: () => Promise<HTMLAudioElement | null>;
}

function getPlaybackErrorName(error: unknown) {
  if (error instanceof DOMException) return error.name;
  if (typeof error === "object" && error !== null && "name" in error) {
    return String((error as { name?: unknown }).name);
  }

  return "";
}

const V3MusicControl = forwardRef<V3MusicControlHandle>(function V3MusicControl(_, ref) {
  const { t } = useV3Language();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [hasError, setHasError] = useState(false);
  const isPlayingRef = useRef(false);
  const hasErrorRef = useRef(false);
  const manuallyPausedRef = useRef(false);
  const mountedRef = useRef(false);
  const playAttemptRef = useRef<Promise<void> | null>(null);

  const requestPlayback = useCallback((audio: HTMLAudioElement, allowRetry = false): Promise<boolean> => {
    if (
      manuallyPausedRef.current
      || isPlayingRef.current
      || !audio.paused
      || playAttemptRef.current
      || (!allowRetry && hasErrorRef.current)
    ) {
      return Promise.resolve(false);
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
        return Promise.resolve(false);
      }

      if (errorName !== "AbortError") {
        hasErrorRef.current = true;
        if (mountedRef.current) {
          setHasError(true);
          setIsBlocked(false);
        }
      }
      return Promise.resolve(false);
    }

    playAttemptRef.current = request;
    return request.then(
      () => {
        if (playAttemptRef.current === request) playAttemptRef.current = null;
        if (!mountedRef.current) return true;

        isPlayingRef.current = true;
        hasErrorRef.current = false;
        setIsPlaying(true);
        setIsBlocked(false);
        setHasError(false);
        return true;
      },
      (error: unknown) => {
        if (playAttemptRef.current === request) playAttemptRef.current = null;
        if (!mountedRef.current) return false;

        const errorName = getPlaybackErrorName(error);

        if (errorName === "NotAllowedError") {
          setIsBlocked(true);
          return false;
        }

        if (errorName === "AbortError") {
          return false;
        }

        hasErrorRef.current = true;
        setHasError(true);
        setIsBlocked(false);
        return false;
      },
    );
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useImperativeHandle(ref, () => ({
    startFromGesture: () => {
      const audio = audioRef.current;
      if (!audio) return Promise.resolve(null);

      manuallyPausedRef.current = false;
      if (!audio.paused) audio.pause();
      try {
        audio.currentTime = 0;
      } catch {
        // The media element may not have metadata yet; play() will load it.
      }

      // Calling play synchronously here keeps the media request inside the click gesture.
      return requestPlayback(audio, true).then((didStart) => (didStart ? audio : null));
    },
  }), [requestPlayback]);

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
      void requestPlayback(audio, shouldRetry);
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
});

V3MusicControl.displayName = "V3MusicControl";

export default V3MusicControl;
