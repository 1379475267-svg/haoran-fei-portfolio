import { useCallback, useEffect, useState } from "react";
import V3About from "./V3About";
import V3Capabilities from "./V3Capabilities";
import V3Footer from "./V3Footer";
import V3Hero from "./V3Hero";
import V3Nav from "./V3Nav";
import V3OpeningSequence from "./V3OpeningSequence";
import V3ProjectReel from "./V3ProjectReel";
import V3Projects from "./V3Projects";
import V3SignalInterlude from "./V3SignalInterlude";
import { V3LanguageProvider, useV3Language } from "./V3Language";

const OPENING_SESSION_KEY = "hf-v3-opening-seen";

function shouldPlayOpening() {
  if (typeof window === "undefined") return false;

  const forceReplay = new URLSearchParams(window.location.search).get("intro") === "1";
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return false;
  if (forceReplay) return true;
  if (window.location.hash || window.scrollY > 0) return false;

  const navigation = performance.getEntriesByType("navigation")[0] as
    | PerformanceNavigationTiming
    | undefined;
  if (navigation?.type === "back_forward") return false;

  try {
    return window.sessionStorage.getItem(OPENING_SESSION_KEY) !== "1";
  } catch {
    return true;
  }
}

function V3PortfolioContent() {
  const { language, t } = useV3Language();
  const [openingState, setOpeningState] = useState(() => {
    const openingActive = shouldPlayOpening();
    return { openingActive, contentReady: !openingActive };
  });

  useEffect(() => {
    if (!openingState.openingActive) return;

    try {
      window.sessionStorage.setItem(OPENING_SESSION_KEY, "1");
    } catch {
      // The intro still works when session storage is unavailable.
    }
  }, [openingState.openingActive]);

  const revealContent = useCallback(() => {
    setOpeningState((current) => (
      current.contentReady ? current : { ...current, contentReady: true }
    ));
  }, []);

  const finishOpening = useCallback(() => {
    setOpeningState({ openingActive: false, contentReady: true });
  }, []);

  return (
    <div className="v3-site" lang={language === "zh" ? "zh-CN" : "en"} data-language={language}>
      <a
        className="v3-skip-link"
        href="#main-content"
        onClick={openingState.openingActive ? finishOpening : undefined}
      >
        {t.skip}
      </a>
      {openingState.openingActive ? (
        <V3OpeningSequence
          onReveal={revealContent}
          onComplete={finishOpening}
        />
      ) : null}
      <V3Nav ready={openingState.contentReady} />
      <main id="main-content" tabIndex={-1}>
        <V3Hero ready={openingState.contentReady} />
        <V3ProjectReel />
        <V3About />
        <V3SignalInterlude />
        <V3Capabilities />
        <V3Projects />
      </main>
      <V3Footer />
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
