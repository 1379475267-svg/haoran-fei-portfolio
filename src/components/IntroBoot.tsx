import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

const sessionKey = "haoran-portfolio-intro-seen";

const bootLines = [
  "SYS ONLINE",
  "loading spline field",
  "mounting project index",
  "syncing creative systems",
  "ready",
];

export default function IntroBoot() {
  const prefersReducedMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState(() => {
    if (typeof window === "undefined") {
      return true;
    }

    const forceIntro = window.location.search.includes("intro=1");
    if (forceIntro) {
      return true;
    }

    return window.sessionStorage.getItem(sessionKey) !== "true";
  });

  const shouldAnimate = !prefersReducedMotion;

  const lineDelay = useMemo(() => (shouldAnimate ? 0.22 : 0), [shouldAnimate]);
  const exitIntro = () => {
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(sessionKey, "true");
    }

    setIsVisible(false);
  };

  useEffect(() => {
    if (!isVisible) {
      return;
    }

    document.body.classList.add("intro-locked");

    if (!shouldAnimate) {
      exitIntro();
      return () => document.body.classList.remove("intro-locked");
    }

    const timer = window.setTimeout(exitIntro, 3800);

    return () => {
      window.clearTimeout(timer);
      document.body.classList.remove("intro-locked");
    };
  }, [isVisible, shouldAnimate]);

  useEffect(() => {
    if (!isVisible) {
      document.body.classList.remove("intro-locked");
    }
  }, [isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="intro-boot"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(18px)" }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          role="dialog"
          aria-label="Portfolio opening sequence"
        >
          <div className="intro-boot-grid" />
          <motion.div
            className="intro-boot-orbit"
            initial={{ scale: 1.12, opacity: 0.16 }}
            animate={{ scale: [1.12, 1.24, 1.06], opacity: [0.16, 0.34, 0.2] }}
            transition={{ duration: 3.2, ease: "easeInOut" }}
          />
          <motion.div
            className="intro-boot-scan"
            initial={{ x: "-120%" }}
            animate={{ x: "120%" }}
            transition={{ duration: 1.75, repeat: 1, ease: [0.22, 1, 0.36, 1] }}
          />

          <div className="intro-boot-shell">
            <motion.div
              className="intro-boot-meta"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.42, delay: 0.08 }}
            >
              <span>SYS / ONLINE</span>
              <span>PORTFOLIO.v02</span>
            </motion.div>

            <motion.div
              className="intro-boot-core"
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.58, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="intro-boot-kicker">INITIALIZING CREATIVE SYSTEM</p>
              <h1>
                HAORAN
                <span>FEI</span>
              </h1>
              <p className="intro-boot-subtitle">Autonomous robotics / music tech / creative code</p>
            </motion.div>

            <div className="intro-boot-terminal" aria-hidden="true">
              {bootLines.map((line, index) => (
                <motion.p
                  key={line}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.28, delay: 0.62 + index * lineDelay }}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  {line}
                </motion.p>
              ))}
            </div>

            <motion.div
              className="intro-boot-progress"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.32, delay: 0.65 }}
              aria-hidden="true"
            >
              <motion.i
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 2.8, delay: 0.7, ease: [0.65, 0, 0.35, 1] }}
              />
            </motion.div>

            <motion.button
              className="intro-boot-skip"
              type="button"
              onClick={exitIntro}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.28, delay: 0.8 }}
            >
              Skip
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
