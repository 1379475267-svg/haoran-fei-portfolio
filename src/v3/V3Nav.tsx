import { ArrowUpRight } from "lucide-react";
import { LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import V3MusicControl from "./V3MusicControl";
import { useV3Language } from "./V3Language";

const sectionTargets = [
  { id: "home", href: "#home" },
  { id: "project-reel", href: "#projects" },
  { id: "about", href: "#about" },
  { id: "capabilities", href: "#capabilities" },
  { id: "projects", href: "#projects" },
  { id: "contact", href: "#contact" },
] as const;

export default function V3Nav() {
  const reduceMotion = useReducedMotion();
  const { language, setLanguage, t } = useV3Language();
  const [activeHref, setActiveHref] = useState("#home");
  const links = [
    { label: t.nav.about, href: "#about" },
    { label: t.nav.capabilities, href: "#capabilities" },
    { label: t.nav.projects, href: "#projects" },
  ];

  useEffect(() => {
    let frameId = 0;

    const updateActiveSection = () => {
      const markerY = window.innerHeight * 0.34;
      let nextHref = "#home";

      for (const target of sectionTargets) {
        const section = document.getElementById(target.id);
        if (!section) continue;

        const bounds = section.getBoundingClientRect();
        if (bounds.top <= markerY) nextHref = target.href;
        if (bounds.top <= markerY && bounds.bottom > markerY) break;
      }

      const atPageEnd =
        window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
      if (atPageEnd) nextHref = "#contact";

      setActiveHref((currentHref) => (
        currentHref === nextHref ? currentHref : nextHref
      ));
    };

    const queueActiveSectionUpdate = () => {
      if (frameId) return;
      frameId = window.requestAnimationFrame(() => {
        frameId = 0;
        updateActiveSection();
      });
    };

    updateActiveSection();
    window.addEventListener("scroll", queueActiveSectionUpdate, { passive: true });
    window.addEventListener("resize", queueActiveSectionUpdate);

    return () => {
      window.removeEventListener("scroll", queueActiveSectionUpdate);
      window.removeEventListener("resize", queueActiveSectionUpdate);
      if (frameId) window.cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <motion.header
      className="v3-nav-shell"
      initial={reduceMotion ? false : { opacity: 0, y: -18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="v3-nav">
        <a
          className={`v3-nav-mark${activeHref === "#home" ? " is-active" : ""}`}
          href="#home"
          aria-label={language === "zh" ? "费浩然，返回顶部" : "Haoran Fei, back to top"}
          aria-current={activeHref === "#home" ? "location" : undefined}
        >
          HF
        </a>
        <nav aria-label={language === "zh" ? "主导航" : "Primary navigation"}>
          <LayoutGroup id="v3-nav-sections">
            {links.map((link) => {
              const active = activeHref === link.href;

              return (
                <a
                  className={active ? "is-active" : undefined}
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "location" : undefined}
                >
                  <span>{link.label}</span>
                  {active ? (
                    <motion.i
                      className="v3-nav-active-line"
                      layoutId="v3-nav-active-line"
                      transition={
                        reduceMotion
                          ? { duration: 0 }
                          : { duration: 0.32, ease: [0.16, 1, 0.3, 1] }
                      }
                      aria-hidden="true"
                    />
                  ) : null}
                </a>
              );
            })}
          </LayoutGroup>
        </nav>
        <div className="v3-nav-actions">
          <button
            type="button"
            className="v3-language-toggle"
            onClick={() => setLanguage(language === "zh" ? "en" : "zh")}
            aria-label={t.switchLanguage}
            title={t.switchLanguage}
          >
            <span className={language === "zh" ? "is-active" : ""}>中</span>
            <i aria-hidden="true">/</i>
            <span className={language === "en" ? "is-active" : ""}>EN</span>
          </button>
          <V3MusicControl />
          <a
            className={`v3-nav-contact${activeHref === "#contact" ? " is-active" : ""}`}
            href="#contact"
            aria-current={activeHref === "#contact" ? "location" : undefined}
          >
            <span>{t.nav.contact}</span>
            <ArrowUpRight aria-hidden="true" />
          </a>
        </div>
      </div>
    </motion.header>
  );
}
