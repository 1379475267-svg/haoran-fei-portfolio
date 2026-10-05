import { useEffect, useRef } from "react";
import { HOME_HEART_MOTION, V3_BACKGROUND_TRACK } from "./V3MusicTrack";

interface MusicFrame {
  playing: boolean;
  time: number;
  energy: number;
}

/** The ambient light follows sound; the content keeps its own reading rhythm. */
export default function V3Moonlight({ ready }: { ready: boolean }) {
  const lightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const light = lightRef.current;
    if (!light) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobileMotion = window.matchMedia("(max-width: 640px)");
    let lastPlaying = false;
    let lastEnergy = -1;
    let lastEnergyUpdate = -Infinity;
    let hasBloomed = false;
    let homeVisible = false;
    const home = document.getElementById("home");
    const homeObserver = new IntersectionObserver(([entry]) => {
      homeVisible = Boolean(entry?.isIntersecting);
      if (!homeVisible && V3_BACKGROUND_TRACK.id === "home-heart"
        && light.dataset.bloom !== "false") light.dataset.bloom = "false";
    }, { threshold: 0.12 });
    if (home) homeObserver.observe(home);

    const setBloom = (bloom: boolean) => {
      const value = String(bloom);
      if (light.dataset.bloom !== value) light.dataset.bloom = value;
    };
    const settle = () => {
      if (lastEnergy !== 0) light.style.setProperty("--moon-energy", "0");
      setBloom(false);
      lastEnergy = 0;
    };
    const musicFrame = (event: Event) => {
      const frame = (event as CustomEvent<MusicFrame>).detail;
      if (!frame) return;
      if (lastPlaying !== frame.playing) light.dataset.playing = String(frame.playing);
      lastPlaying = frame.playing;
      if (reducedMotion.matches || document.hidden || !frame.playing) {
        settle();
        return;
      }
      const energy = Math.min(1, Math.max(0, frame.energy));
      const now = performance.now();
      // The glow already eases in CSS. Mobile needs at most 10 small updates/s;
      // the music clock and its one-time bloom remain checked on every event.
      const energyInterval = mobileMotion.matches ? 100 : 0;
      const energyThreshold = mobileMotion.matches ? 0.025 : 0.015;
      if (now - lastEnergyUpdate >= energyInterval
        && Math.abs(energy - lastEnergy) > energyThreshold) {
        light.style.setProperty("--moon-energy", energy.toFixed(3));
        lastEnergy = energy;
        lastEnergyUpdate = now;
      }
      // Home's stronger phrase opens the light once, only while its hero is visible.
      if (V3_BACKGROUND_TRACK.id === "home-heart") {
        if (!hasBloomed && frame.time >= HOME_HEART_MOTION.bloomStart) {
          hasBloomed = true;
          setBloom(frame.time < HOME_HEART_MOTION.bloomEnd
            && homeVisible && light.dataset.ready === "true");
        }
        if (frame.time >= HOME_HEART_MOTION.bloomEnd || !homeVisible) setBloom(false);
      } else if (!hasBloomed && frame.time >= 10.5 && frame.time < 13) {
        setBloom(true);
      } else if (frame.time >= 13) {
        hasBloomed = true;
        setBloom(false);
      }
    };
    const visibility = () => {
      if (document.hidden) settle();
    };
    const preference = () => {
      light.dataset.reduced = String(reducedMotion.matches);
      if (reducedMotion.matches || !lastPlaying) settle();
    };
    preference();
    window.addEventListener("v3:music-frame", musicFrame);
    document.addEventListener("visibilitychange", visibility);
    reducedMotion.addEventListener("change", preference);

    return () => {
      homeObserver.disconnect();
      window.removeEventListener("v3:music-frame", musicFrame);
      document.removeEventListener("visibilitychange", visibility);
      reducedMotion.removeEventListener("change", preference);
    };
  }, []);

  useEffect(() => {
    const light = lightRef.current;
    if (!light || !ready) return;
    const readingSections = new Set(["about", "capabilities", "journey", "contact"]);
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.find((entry) => entry.isIntersecting);
      if (visible) light.dataset.reading = String(readingSections.has(visible.target.id));
    }, { rootMargin: "-30% 0px -50% 0px", threshold: 0 });
    for (const id of ["home", "project-reel", "about", "capabilities", "projects", "journey", "contact"]) {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    }

    const focusProject = (event: Event) => {
      const target = event.target instanceof Element
        ? event.target.closest(".journal-feature-link, .v3-project-card-wrap") : null;
      if (!target) return;
      const bounds = target.getBoundingClientRect();
      light.style.setProperty("--moon-x", `${Math.min(90, Math.max(10, (bounds.left + bounds.width / 2) / window.innerWidth * 100))}%`);
      light.dataset.project = "true";
    };
    const blurProject = (event: Event) => {
      const related = (event as MouseEvent | FocusEvent).relatedTarget;
      if (related instanceof Element && related.closest(".journal-feature-link, .v3-project-card-wrap")) return;
      light.style.setProperty("--moon-x", "76%");
      light.dataset.project = "false";
    };
    document.addEventListener("pointerover", focusProject);
    document.addEventListener("focusin", focusProject);
    document.addEventListener("pointerout", blurProject);
    document.addEventListener("focusout", blurProject);
    return () => {
      observer.disconnect();
      document.removeEventListener("pointerover", focusProject);
      document.removeEventListener("focusin", focusProject);
      document.removeEventListener("pointerout", blurProject);
      document.removeEventListener("focusout", blurProject);
    };
  }, [ready]);

  return (
    <div ref={lightRef} className="v3-moonlight" aria-hidden="true"
      data-ready={ready} data-playing="false" data-reading="false" data-bloom="false">
      <div className="v3-moonlight-glow" />
      <div className="v3-moonlight-reflection" />
    </div>
  );
}
