import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import V3About from "./V3About";
import V3Capabilities from "./V3Capabilities";
import V3Footer from "./V3Footer";
import V3Hero from "./V3Hero";
import type { V3MusicControlHandle } from "./V3MusicControl";
import V3Nav from "./V3Nav";
import V3OpeningSequence, {
  type OpeningCompletionReason,
} from "./V3OpeningSequence";
import V3ProjectReel from "./V3ProjectReel";
import V3Projects from "./V3Projects";
import { V3LanguageProvider, useV3Language } from "./V3Language";

function shouldPlayOpening() {
  if (typeof window === "undefined") return false;

  const forceReplay = new URLSearchParams(window.location.search).get("intro") === "1";
  if (forceReplay) return true;
  if (window.location.hash && window.location.hash !== "#home") return false;
  if (window.scrollY > 0) return false;

  const navigation = performance.getEntriesByType("navigation")[0] as
    | PerformanceNavigationTiming
    | undefined;
  if (navigation?.type === "back_forward") return false;

  return true;
}

function V3PortfolioContent() {
  const { language, t } = useV3Language();
  const [openingState, setOpeningState] = useState(() => {
    const openingActive = shouldPlayOpening();
    return { openingActive, contentReady: !openingActive };
  });
  const musicControlRef = useRef<V3MusicControlHandle>(null);
  const siteContentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!openingState.openingActive) return undefined;

    const previousRestoration = window.history.scrollRestoration;
    const resetScroll = () => window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    window.history.scrollRestoration = "manual";
    resetScroll();
    const frame = window.requestAnimationFrame(resetScroll);
    const followUp = window.setTimeout(resetScroll, 120);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(followUp);
      window.history.scrollRestoration = previousRestoration;
    };
  }, [openingState.openingActive]);

  useEffect(() => {
    const siteContent = siteContentRef.current;
    document.body.classList.toggle("intro-locked", openingState.openingActive);

    if (siteContent) siteContent.inert = openingState.openingActive;

    return () => {
      document.body.classList.remove("intro-locked");
      if (siteContent) siteContent.inert = false;
    };
  }, [openingState.openingActive]);

  const finishOpening = useCallback((_reason: OpeningCompletionReason) => {
    setOpeningState({ openingActive: false, contentReady: true });
  }, []);

  const revealOpening = useCallback(() => {
    setOpeningState((current) => (
      current.contentReady ? current : { ...current, contentReady: true }
    ));
  }, []);

  const startOpening = useCallback(() => {
    return musicControlRef.current?.startFromGesture() ?? Promise.resolve(null);
  }, []);

  return (
    <div className="v3-site" lang={language === "zh" ? "zh-CN" : "en"} data-language={language}>
      {openingState.openingActive ? (
        <V3OpeningSequence
          onStart={startOpening}
          onReveal={revealOpening}
          onComplete={finishOpening}
        />
      ) : null}
      <div
        ref={siteContentRef}
        className="v3-site-content"
        aria-hidden={openingState.openingActive || undefined}
      >
        <a className="v3-skip-link" href="#main-content">
          {t.skip}
        </a>
        <V3Nav ready={openingState.contentReady} musicControlRef={musicControlRef} />
        <main id="main-content" tabIndex={-1}>
          <V3Hero ready={openingState.contentReady} />
          <V3ProjectReel />
          <V3About />
          <V3Capabilities />
          <V3Projects />
        </main>
        <V3Footer />
      </div>
    </div>
  );
}

export default function V3Portfolio() {
  return (
    <V3LanguageProvider>
      <V3PortfolioContent />
    </V3LanguageProvider>
  );
}
