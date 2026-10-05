/** Keep the full original timeline; the query option makes phone listening comparisons easy. */
const useOriginalMaster = typeof window !== "undefined"
  && new URLSearchParams(window.location.search).get("bgm") === "original";

const MANIFOLD_TRACK = {
  id: "manifold",
  title: "Manifold",
  compactTitle: "Manifold",
  artist: "weird inside",
  source: useOriginalMaster
    ? "./audio/manifold-weird-inside.mp3"
    : "./audio/manifold-speaker-eq-v1.mp3",
  volumeStorage: "fhr-background-music-volume",
  legacyVolumeStorage: "fhr-manifold-volume",
  defaultVolume: 0.26,
  openingVolumeMultiplier: 1.62,
  crossfadeSeconds: 1.8,
  opening: {
    duration: 4.72,
    contentReveal: 2.9,
    logoFlightStart: 2.62,
    logoFlightEnd: 4.16,
    apertureStart: 3.02,
    apertureEnd: 4.56,
  },
} as const;

const HOME_HEART_TRACK = {
  id: "home-heart",
  title: "Home Is Where My Heart Is",
  compactTitle: "Home",
  artist: "Kupla",
  source: "./audio/home-is-where-my-heart-is-kupla.mp3",
  volumeStorage: "fhr-background-music-volume",
  legacyVolumeStorage: "fhr-manifold-volume",
  defaultVolume: 0.32,
  openingVolumeMultiplier: 1.55,
  crossfadeSeconds: 1.8,
  opening: {
    duration: 5.10,
    contentReveal: 3.18,
    logoFlightStart: 2.93,
    logoFlightEnd: 4.30,
    apertureStart: 3.18,
    apertureEnd: 4.96,
  },
} as const;

/** Measured transient landmarks of this MP3, rounded to 10 ms (analysis uncertainty ±25 ms). */
export const HOME_HEART_MOTION = {
  wake: 0.16,
  sweepStart: 0.69,
  sweepEnd: 1.29,
  gatherStart: 1.29,
  gatherAccent: 1.87,
  gatherEnd: 2.41,
  bloomStart: 12.08,
  bloomEnd: 15.1,
} as const;

/** Home is the published soundtrack; an explicit build flag retains the old comparison master. */
export const V3_BACKGROUND_TRACK = import.meta.env.VITE_SOUNDTRACK_PREVIEW === "manifold"
  ? MANIFOLD_TRACK : HOME_HEART_TRACK;
