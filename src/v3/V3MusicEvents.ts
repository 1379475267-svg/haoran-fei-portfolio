export const V3_MUSIC_FRAME_EVENT = "v3:music-frame";

export interface V3MusicFrame {
  playing: boolean;
  time: number;
  /** Measured energy from 0 to 1; zero when visual processing is suspended. */
  energy: number;
}

export function emitV3MusicFrame(frame: V3MusicFrame) {
  window.dispatchEvent(new CustomEvent<V3MusicFrame>(V3_MUSIC_FRAME_EVENT, { detail: frame }));
}
