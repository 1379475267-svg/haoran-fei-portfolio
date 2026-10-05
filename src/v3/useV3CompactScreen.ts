import { useSyncExternalStore } from "react";

const query = "(max-width: 640px)";
const subscribe = (onChange: () => void) => {
  const media = window.matchMedia(query);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
};
const snapshot = () => window.matchMedia(query).matches;

export default function useV3CompactScreen() {
  return useSyncExternalStore(subscribe, snapshot, () => false);
}
