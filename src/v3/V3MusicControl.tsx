import { LoaderCircle, Volume2, VolumeX } from "lucide-react";
import { createPortal } from "react-dom";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { useV3Language } from "./V3Language";
import { emitV3MusicFrame } from "./V3MusicEvents";
import { V3_BACKGROUND_TRACK } from "./V3MusicTrack";
import "../styles/v3-manifold-player.css";

const CROSSFADE_SECONDS = V3_BACKGROUND_TRACK.crossfadeSeconds;

export interface V3MusicControlHandle {
  startFromGesture: () => Promise<HTMLAudioElement | null>;
  settleAfterOpening: () => void;
}

interface PlaybackState {
  playing: boolean;
  loading: boolean;
  error: boolean;
  blocked: boolean;
  samplePaused: boolean;
}
const INITIAL_STATE: PlaybackState = { playing: false, loading: false, error: false, blocked: false, samplePaused: false };

function savedVolume() {
  try {
    // A track change keeps any volume the visitor already chose, including mute.
    for (const key of [V3_BACKGROUND_TRACK.volumeStorage, V3_BACKGROUND_TRACK.legacyVolumeStorage]) {
      const saved = localStorage.getItem(key);
      if (saved !== null && saved.trim() !== "") {
        const value = Number(saved);
        if (Number.isFinite(value) && value >= 0 && value <= 1) return value;
      }
    }
  } catch {
    // Playback still works when storage is unavailable.
  }
  return V3_BACKGROUND_TRACK.defaultVolume;
}

function errorName(error: unknown) {
  return typeof error === "object" && error !== null && "name" in error
    ? String((error as { name: unknown }).name) : "";
}

/** One persistent player owns both elements; the second overlaps the loop boundary. */
class ManifoldPlayback {
  private state: PlaybackState = { ...INITIAL_STATE };
  private active = 0;
  private generation = 0;
  private disposed = false;
  private interval: number | null = null;
  private preference: number;
  private outputVolume: number;
  private adjustedByUser = false;
  private settled = false;
  private crossfade: { from: number; to: number; pending: boolean } | null = null;
  private loopAttempted = false;
  private previousTime = 0;
  private volumeFade: { from: number; to: number; start: number } | null = null;
  private context: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private samples = new Uint8Array(512);
  private graphConnected = false;
  private demoPaused = false;
  private demoLeftPage = false;
  private sampleActive = false;
  private resumeAfterSample = false;
  private sampleResumePending = false;
  private reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  private listeners: Array<() => void> = [];

  constructor(
    private audios: [HTMLAudioElement, HTMLAudioElement],
    volume: number,
    private onState: (state: PlaybackState) => void,
  ) {
    this.preference = volume;
    this.outputVolume = volume;
    audios.forEach((audio, index) => {
      const playing = () => {
        if (index !== this.active && index !== this.crossfade?.to) return;
        this.update({ playing: true, loading: false, error: false, blocked: false });
        this.startClock();
      };
      const pause = () => {
        if (audios.some((element) => !element.paused)) return;
        this.update({ playing: false, loading: false });
        this.stopClock();
        this.sendFrame(0);
      };
      const waiting = () => {
        if (index === this.active && !audio.paused) this.update({ loading: true });
      };
      const canplay = () => {
        if (index === this.active) this.update({ loading: false });
      };
      const error = () => {
        if (index !== this.active) return;
        this.generation += 1;
        this.crossfade = null;
        audios.forEach((element) => element.pause());
        this.update({ error: true, playing: false, loading: false, blocked: false });
        this.stopClock();
        this.sendFrame(0);
      };
      Object.entries({ playing, pause, waiting, canplay, error }).forEach(([name, listener]) => {
        audio.addEventListener(name, listener);
        this.listeners.push(() => audio.removeEventListener(name, listener));
      });
    });
    const visibility = () => {
      if (document.hidden || this.reducedMotion.matches) this.sendFrame(0);
      if (this.demoPaused && document.hidden) this.demoLeftPage = true;
      if (!document.hidden && document.hasFocus()) this.resumeAfterDemo();
    };
    const blur = () => { if (this.demoPaused) this.demoLeftPage = true; };
    const focus = () => this.resumeAfterDemo();
    const audioSample = (event: Event) => {
      const detail = (event as CustomEvent<{ active?: unknown }>).detail;
      if (typeof detail?.active !== "boolean") return;
      if (detail.active) {
        if (this.sampleActive) return;
        this.sampleActive = true;
        this.resumeAfterSample = this.state.playing || this.state.loading || this.sampleResumePending;
        this.sampleResumePending = false;
        if (this.state.playing || this.state.loading) this.pause();
        this.update({ samplePaused: this.resumeAfterSample });
      } else {
        if (!this.sampleActive) return;
        this.sampleActive = false;
        const resume = this.resumeAfterSample;
        this.resumeAfterSample = false;
        this.update({ samplePaused: false });
        if (resume) {
          this.sampleResumePending = true;
          const request = this.play();
          const generation = this.generation;
          void request.finally(() => {
            if (generation === this.generation) this.sampleResumePending = false;
          });
        }
      }
    };
    const demoClick = (event: MouseEvent) => {
      if (event.defaultPrevented || !(event.target instanceof Element)) return;
      const link = event.target.closest("a[href]");
      if (!(link instanceof HTMLAnchorElement)) return;
      const url = new URL(link.href, window.location.href);
      if (url.hostname !== window.location.hostname
        && url.hostname !== "fhrzz.me"
        && url.hostname !== "stringblade.netlify.app") return;
      if (url.hostname !== "stringblade.netlify.app"
        && !/^\/projects\/(string-blade|chordpilot)(\/|$)/.test(url.pathname)) return;
      if (this.state.playing) {
        this.pause();
        this.demoPaused = true;
        this.demoLeftPage = false;
      }
    };
    document.addEventListener("visibilitychange", visibility);
    this.reducedMotion.addEventListener("change", visibility);
    document.addEventListener("click", demoClick);
    window.addEventListener("blur", blur);
    window.addEventListener("focus", focus);
    window.addEventListener("fhr-audio-sample", audioSample);
    this.listeners.push(
      () => document.removeEventListener("visibilitychange", visibility),
      () => this.reducedMotion.removeEventListener("change", visibility),
      () => document.removeEventListener("click", demoClick),
      () => window.removeEventListener("blur", blur),
      () => window.removeEventListener("focus", focus),
      () => window.removeEventListener("fhr-audio-sample", audioSample),
    );
    this.applyVolumes();
  }

  private update(patch: Partial<PlaybackState>) {
    if (this.disposed) return;
    const next = { ...this.state, ...patch };
    if (Object.keys(next).every((key) => next[key as keyof PlaybackState] === this.state[key as keyof PlaybackState])) return;
    this.state = next;
    this.onState(next);
  }

  private initialiseAnalyser() {
    if (this.reducedMotion.matches || this.disposed) return;
    try {
      this.context ??= new AudioContext();
      const context = this.context;
      // Request resume in the click. Attaching sources only after it succeeds keeps
      // native media playback available if the browser rejects Web Audio.
      void context.resume().then(() => {
        if (this.disposed || context.state !== "running" || this.graphConnected) return;
        const analyser = context.createAnalyser();
        analyser.fftSize = 512;
        analyser.smoothingTimeConstant = 0.8;
        analyser.connect(context.destination);
        let connected = false;
        this.audios.forEach((audio) => {
          try {
            context.createMediaElementSource(audio).connect(analyser);
            connected = true;
          } catch {
            // An unsupported element remains on its native output path.
          }
        });
        this.graphConnected = connected;
        this.analyser = connected ? analyser : null;
      }).catch(() => {
        // Native media play() remains the fallback when AudioContext cannot resume.
      });
    } catch {
      // The track can play without Web Audio or visual energy.
    }
  }

  private sendFrame(energy: number) {
    if (this.disposed) return;
    emitV3MusicFrame({ playing: this.state.playing, time: this.audios[this.active].currentTime, energy });
  }

  private applyVolumes() {
    if (this.crossfade && !this.crossfade.pending) {
      const progress = Math.min(1, this.audios[this.crossfade.to].currentTime / CROSSFADE_SECONDS);
      this.audios[this.crossfade.from].volume = this.outputVolume * (1 - progress);
      this.audios[this.crossfade.to].volume = this.outputVolume * progress;
    } else {
      this.audios.forEach((audio, index) => { audio.volume = index === this.active ? this.outputVolume : 0; });
    }
  }

  private startClock() {
    if (this.interval !== null) return;
    // Audio fades run at 20 Hz; the hidden-tab path skips all visual analysis.
    this.interval = window.setInterval(() => this.tick(), 50);
    this.tick();
  }

  private stopClock() {
    if (this.interval !== null) window.clearInterval(this.interval);
    this.interval = null;
  }

  private tick() {
    if (this.disposed) return;
    if (this.volumeFade) {
      const progress = Math.min(1, (performance.now() - this.volumeFade.start) / 1800);
      const eased = progress * progress * (3 - 2 * progress);
      this.outputVolume = this.volumeFade.from + (this.volumeFade.to - this.volumeFade.from) * eased;
      if (progress >= 1) this.volumeFade = null;
    }
    const audio = this.audios[this.active];
    if (audio.currentTime < this.previousTime - 1) this.loopAttempted = false;
    this.previousTime = audio.currentTime;
    if (!this.crossfade && !this.loopAttempted && !audio.paused
      && Number.isFinite(audio.duration) && audio.duration > CROSSFADE_SECONDS * 2
      && audio.currentTime >= audio.duration - CROSSFADE_SECONDS) this.startCrossfade();

    if (this.crossfade && !this.crossfade.pending) {
      const incoming = this.audios[this.crossfade.to];
      if (incoming.currentTime >= CROSSFADE_SECONDS) {
        const outgoing = this.audios[this.crossfade.from];
        this.active = this.crossfade.to;
        this.crossfade = null;
        outgoing.pause();
        this.previousTime = incoming.currentTime;
        this.loopAttempted = false;
      }
    }
    this.applyVolumes();
    if (document.hidden || this.reducedMotion.matches) return;
    let energy = 0;
    if (this.analyser && this.context?.state === "running" && this.state.playing) {
      this.analyser.getByteTimeDomainData(this.samples);
      let squared = 0;
      for (const sample of this.samples) squared += ((sample - 128) / 128) ** 2;
      energy = Math.min(1, Math.sqrt(squared / this.samples.length) * 5);
    }
    this.sendFrame(energy);
  }

  private startCrossfade() {
    const from = this.active;
    const to = 1 - from;
    const outgoing = this.audios[from];
    const incoming = this.audios[to];
    const generation = this.generation;
    const transition = { from, to, pending: true };
    this.loopAttempted = true;
    this.crossfade = transition;
    incoming.volume = 0;
    try {
      incoming.currentTime = 0;
      void incoming.play().then(() => {
        if (this.disposed || generation !== this.generation || this.crossfade !== transition) {
          incoming.pause();
          return;
        }
        // If buffering outlasted the tail, keep the outgoing element's native loop.
        if (outgoing.currentTime < outgoing.duration - CROSSFADE_SECONDS) {
          incoming.pause();
          this.crossfade = null;
          return;
        }
        transition.pending = false;
      }).catch(() => {
        if (this.crossfade === transition) this.crossfade = null;
        // Native loop covers browsers that deny the second element's play request.
      });
    } catch {
      this.crossfade = null;
    }
  }

  private play(): Promise<HTMLAudioElement | null> {
    const audio = this.audios[this.active];
    const generation = ++this.generation;
    this.update({ loading: true, blocked: false, error: false });
    this.initialiseAnalyser();
    this.applyVolumes();
    try {
      // Invoke play inside the user gesture, before any awaited operation.
      const request = audio.play();
      if (this.crossfade && !this.crossfade.pending) {
        const incoming = this.audios[this.crossfade.to];
        void incoming.play().catch(() => {
          incoming.pause();
          this.crossfade = null;
          this.applyVolumes();
        });
      }
      return request.then(() => {
        if (this.disposed || generation !== this.generation) return null;
        this.update({ playing: true, loading: false, blocked: false, error: false });
        this.startClock();
        const standby = this.audios[1 - this.active];
        if (standby.preload !== "auto") {
          standby.preload = "auto";
          standby.load();
        }
        return audio;
      }).catch((error: unknown) => {
        if (this.disposed || generation !== this.generation) return null;
        const name = errorName(error);
        this.update({ playing: false, loading: false, blocked: name === "NotAllowedError", error: name !== "NotAllowedError" && name !== "AbortError" });
        this.stopClock();
        this.sendFrame(0);
        return null;
      });
    } catch (error) {
      this.update({ playing: false, loading: false, blocked: errorName(error) === "NotAllowedError", error: errorName(error) !== "NotAllowedError" });
      this.stopClock();
      this.sendFrame(0);
      return Promise.resolve(null);
    }
  }

  startFromGesture() {
    this.resumeAfterSample = false;
    this.sampleResumePending = false;
    this.update({ samplePaused: false });
    this.demoPaused = false;
    this.generation += 1;
    this.audios.forEach((audio) => audio.pause());
    this.active = 0;
    this.crossfade = null;
    this.loopAttempted = false;
    this.previousTime = 0;
    this.volumeFade = null;
    this.outputVolume = this.adjustedByUser || this.settled
      ? this.preference : Math.min(1, this.preference * V3_BACKGROUND_TRACK.openingVolumeMultiplier);
    try { this.audios[0].currentTime = 0; } catch { /* Metadata may not be available yet. */ }
    return this.play();
  }

  settleAfterOpening() {
    if (this.settled) return;
    this.settled = true;
    if (this.adjustedByUser) return;
    if (!this.state.playing) {
      this.outputVolume = this.preference;
      this.applyVolumes();
      return;
    }
    this.volumeFade = { from: this.outputVolume, to: this.preference, start: performance.now() };
    this.startClock();
  }

  private pause() {
    this.generation += 1;
    if (this.crossfade?.pending) this.crossfade = null;
    this.audios.forEach((audio) => audio.pause());
    this.update({ playing: false, loading: false });
    this.stopClock();
    this.sendFrame(0);
  }

  private resumeAfterDemo() {
    if (!this.demoPaused || !this.demoLeftPage || document.hidden) return;
    this.demoPaused = false;
    this.demoLeftPage = false;
    void this.play();
  }

  toggle() {
    this.demoPaused = false;
    if (this.sampleActive) {
      // An explicit request waits for the short sample instead of overlapping it.
      this.resumeAfterSample = !this.resumeAfterSample;
      this.sampleResumePending = false;
      this.pause();
      this.update({ samplePaused: this.resumeAfterSample });
      return;
    }
    this.resumeAfterSample = false;
    this.sampleResumePending = false;
    this.update({ samplePaused: false });
    if (this.state.playing || this.state.loading) { this.pause(); return; }
    if (this.state.error) this.audios[this.active].load();
    void this.play();
  }

  setVolume(volume: number) {
    this.adjustedByUser = true;
    this.preference = volume;
    this.outputVolume = volume;
    this.volumeFade = null;
    this.applyVolumes();
    try { localStorage.setItem(V3_BACKGROUND_TRACK.volumeStorage, String(volume)); } catch { /* Volume still applies to this visit. */ }
  }

  dispose() {
    this.disposed = true;
    this.generation += 1;
    this.stopClock();
    this.listeners.forEach((remove) => remove());
    this.audios.forEach((audio) => audio.pause());
    this.analyser?.disconnect();
    if (this.context) void this.context.close().catch(() => undefined);
  }
}

const V3MusicControl = forwardRef<V3MusicControlHandle>(function V3MusicControl(_, ref) {
  const { language, t } = useV3Language();
  const firstAudioRef = useRef<HTMLAudioElement>(null);
  const secondAudioRef = useRef<HTMLAudioElement>(null);
  const engineRef = useRef<ManifoldPlayback | null>(null);
  const [state, setState] = useState<PlaybackState>(INITIAL_STATE);
  const [volume, setVolume] = useState(savedVolume);
  const [visible, setVisible] = useState(false);
  const initialVolumeRef = useRef(volume);

  useEffect(() => {
    const first = firstAudioRef.current;
    const second = secondAudioRef.current;
    if (!first || !second) return;
    const engine = new ManifoldPlayback([first, second], initialVolumeRef.current, setState);
    engineRef.current = engine;
    return () => {
      engine.dispose();
      if (engineRef.current === engine) engineRef.current = null;
    };
  }, []);

  useImperativeHandle(ref, () => ({
    startFromGesture: () => engineRef.current?.startFromGesture() ?? Promise.resolve(null),
    settleAfterOpening: () => {
      setVisible(true);
      engineRef.current?.settleAfterOpening();
    },
  }), []);

  const requested = state.playing || state.loading || state.samplePaused;
  const enabled = requested && volume > 0;
  const status = state.error ? t.music.error
    : state.blocked ? (language === "zh" ? "点击播放以开启音乐" : "Tap play to enable sound")
      : state.samplePaused ? (language === "zh" ? "试听期间暂时暂停背景音乐" : "Background music paused during the sample")
        : state.loading ? (language === "zh" ? "正在加载音乐" : "Loading music")
        : state.playing && volume > 0 ? (language === "zh" ? "正在播放" : "Playing")
          : (language === "zh" ? "音乐已暂停" : "Music paused");
  const actionLabel = state.error ? t.music.retry : enabled
    ? language === "zh" ? "背景音乐已开启，点击关闭" : "Background music on, turn off"
    : language === "zh" ? "背景音乐已关闭，点击开启" : "Background music off, turn on";
  const toggleMusic = () => {
    const engine = engineRef.current;
    if (!engine) return;
    // The single switch must also recover an old zero-volume preference.
    if (volume === 0) {
      setVolume(V3_BACKGROUND_TRACK.defaultVolume);
      engine.setVolume(V3_BACKGROUND_TRACK.defaultVolume);
      if (requested) return;
    }
    engine.toggle();
  };

  return (
    <>
      <audio ref={firstAudioRef} src={V3_BACKGROUND_TRACK.source} loop preload="none" playsInline hidden />
      <audio ref={secondAudioRef} src={V3_BACKGROUND_TRACK.source} loop preload="none" playsInline hidden />
      {visible && createPortal(
        <div className="nf-music-control">
          <button
            type="button"
            className="nf-music-toggle"
            data-enabled={enabled || undefined}
            data-loading={state.loading || undefined}
            onClick={toggleMusic}
            aria-pressed={enabled}
            aria-busy={state.loading || undefined}
            aria-label={actionLabel}
            title={actionLabel}
          >
            {state.loading ? <LoaderCircle aria-hidden="true" />
              : enabled ? <Volume2 aria-hidden="true" /> : <VolumeX aria-hidden="true" />}
          </button>
          <span className="v3-manifold-status" role="status">{status}</span>
        </div>, document.body,
      )}
    </>
  );
});

V3MusicControl.displayName = "V3MusicControl";
export default V3MusicControl;
