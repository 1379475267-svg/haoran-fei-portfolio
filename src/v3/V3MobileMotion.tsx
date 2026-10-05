import { useLayoutEffect, useRef } from "react";
import { useV3Language } from "./V3Language";

const blocks = [
  ".nightflight-margin-label", ".nightflight-hero-statement", ".nightflight-hero-description",
  ".nightflight-field-link", ".nightflight-chapter-index > a",
  ".nf-reel-intro > h2", ".nf-reel-intro > nav", ".nf-chapter-label",
  ".nf-sense-heading", ".nf-sense-caption > div", ".nf-play-copy > h3",
  ".nf-play-copy > h4", ".nf-play-copy > p", ".nf-play-copy > a",
  ".nf-chord-study", ".nf-build-heading", ".nf-build-copy > h4",
  ".nf-build-copy > p", ".nf-build-steps > li", ".nf-build-copy > a",
  ".nf-index-entry", ".nf-archive-link", ".nf-flight-folio",
  ".nf-flight-title-row > h2", ".nf-flight-title-row > p",
  ".nf-flight-decisions > div", ".nf-flight-github", ".nf-flight-footnote > div",
].join(",");
const media = ".nf-sense-figure, .nf-play-stage > .nf-project-media, .nf-build-media, .nf-flight-figure";

/** One observer for small-screen entrances. Finished blocks release their animation layers. */
export default function V3MobileMotion({ ready }: { ready: boolean }) {
  const { language } = useV3Language();
  const completed = useRef(new WeakSet<HTMLElement>());
  const readyRef = useRef(ready);
  const revealVisible = useRef<(() => void) | null>(null);

  useLayoutEffect(() => {
    readyRef.current = ready;
    if (ready) revealVisible.current?.();
  }, [ready]);

  useLayoutEffect(() => {
    const root = document.querySelector<HTMLElement>(".v3-site");
    if (!root) return;
    const compact = window.matchMedia("(max-width: 640px)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let cleanupMotion = () => {};

    const configure = () => {
      cleanupMotion();
      if (!compact.matches || reduced.matches || typeof IntersectionObserver === "undefined") return;
      const nodes = Array.from(root.querySelectorAll<HTMLElement>(`${blocks},${media}`));
      const visible = new Set<HTMLElement>();
      const running = new Map<HTMLElement, number>();
      let observer: IntersectionObserver;
      root.dataset.mobileMotion = "true";

      const settle = (node: HTMLElement) => {
        const timer = running.get(node);
        if (timer !== undefined) window.clearTimeout(timer);
        running.delete(node);
        visible.delete(node);
        observer.unobserve(node);
        completed.current.add(node);
        node.dataset.mobileState = "done";
      };
      const reveal = (node: HTMLElement, immediate = false) => {
        if (node.dataset.mobileState !== "pending") return;
        visible.delete(node);
        observer.unobserve(node);
        // Fast scrolling never queues invisible content behind ongoing entrances.
        if (immediate || running.size >= 3 || document.hidden) { settle(node); return; }
        node.dataset.mobileState = "entering";
        running.set(node, window.setTimeout(() => settle(node), 850));
      };
      const revealEntered = () => {
        if (!readyRef.current) return;
        visible.forEach((node) => reveal(node));
      };
      revealVisible.current = revealEntered;
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          const node = entry.target as HTMLElement;
          if (entry.isIntersecting) visible.add(node);
          else {
            visible.delete(node);
            if (entry.boundingClientRect.bottom < 0 && readyRef.current) reveal(node, true);
          }
        });
        revealEntered();
      }, { threshold: 0.01, rootMargin: "0px 0px -24px 0px" });

      nodes.forEach((node) => {
        node.dataset.mobileKind = node.matches(media) ? "media" : "lift";
        node.dataset.mobileState = completed.current.has(node) ? "done" : "pending";
        if (!completed.current.has(node)) observer.observe(node);
      });
      const animationEnd = (event: AnimationEvent) => {
        const node = event.target as HTMLElement;
        if (running.has(node)) settle(node);
      };
      const focusIn = (event: FocusEvent) => {
        let node = event.target as HTMLElement | null;
        while (node && node !== root) {
          if (node.dataset.mobileState === "pending") reveal(node, true);
          node = node.parentElement;
        }
      };
      const visibility = () => { if (document.hidden) running.forEach((_timer, node) => settle(node)); };
      root.addEventListener("animationend", animationEnd);
      root.addEventListener("focusin", focusIn);
      document.addEventListener("visibilitychange", visibility);
      cleanupMotion = () => {
        observer.disconnect();
        running.forEach((timer) => window.clearTimeout(timer));
        running.clear();
        nodes.forEach((node) => {
          delete node.dataset.mobileKind;
          delete node.dataset.mobileState;
        });
        delete root.dataset.mobileMotion;
        revealVisible.current = null;
        root.removeEventListener("animationend", animationEnd);
        root.removeEventListener("focusin", focusIn);
        document.removeEventListener("visibilitychange", visibility);
      };
    };
    configure();
    compact.addEventListener("change", configure);
    reduced.addEventListener("change", configure);
    return () => {
      cleanupMotion();
      compact.removeEventListener("change", configure);
      reduced.removeEventListener("change", configure);
    };
  }, [language]);

  return null;
}
