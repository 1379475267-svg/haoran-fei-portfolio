import { ArrowUpRight } from "lucide-react";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useReducedMotion,
  useScroll,
} from "framer-motion";
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

interface V3NavProps {
  ready: boolean;
}

export default function V3Nav({ ready }: V3NavProps) {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const { language, setLanguage, t } = useV3Language();
  const [activeSection, setActiveSection] = useState<
    (typeof sectionTargets)[number]["id"]
  >("home");
  const activeHref = sectionTargets.find((target) => target.id === activeSection)?.href ?? "#home";
  const links = [
    { label: t.nav.about, href: "#about", index: "01" },
    { label: t.nav.capabilities, href: "#capabilities", index: "02" },
    { label: t.nav.projects, href: "#projects", index: "03" },
  ];
  const activeLabel = activeHref === "#home"
    ? (language === "zh" ? "首页" : "Home")
    : activeHref === "#contact"
      ? t.nav.contact
      : links.find((link) => link.href === activeHref)?.label ?? t.nav.projects;

  useEffect(() => {
    let frameId = 0;

    const updateActiveSection = () => {
      const markerY = window.innerHeight * 0.34;
      let nextSection: (typeof sectionTargets)[number]["id"] = "home";

      for (const target of sectionTargets) {
        const section = document.getElementById(target.id);
        if (!section) continue;

        const bounds = section.getBoundingClientRect();
        if (bounds.top <= markerY) nextSection = target.id;
        if (bounds.top <= markerY && bounds.bottom > markerY) break;
      }

      const atPageEnd =
        window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
      if (atPageEnd) nextSection = "contact";

      setActiveSection((currentSection) => (
        currentSection === nextSection ? currentSection : nextSection
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
  }, [language]);

  return (
    <motion.header
      className="v3-nav-shell"
      initial={reduceMotion ? false : { opacity: 0, y: -18 }}
      animate={ready || reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -18 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="v3-nav">
        <a
          className={`v3-nav-mark${activeSection === "home" ? " is-active" : ""}`}
          href="#home"
          aria-label={language === "zh" ? "费浩然，返回顶部" : "Haoran Fei, back to top"}
          aria-current={activeSection === "home" ? "location" : undefined}
        >
          <span>HF</span>
          <small>HAORAN FEI</small>
        </a>
        <div className="v3-nav-status" aria-hidden="true">
          <i />
          <span>{language === "zh" ? "系统在线" : "Systems online"}</span>
        </div>
        <AnimatePresence initial={false} mode="wait">
          <motion.span
            className="v3-nav-current"
            key={`${activeHref}-${language}`}
            initial={reduceMotion ? false : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -4 }}
            transition={reduceMotion
              ? { duration: 0 }
              : { duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
            aria-hidden="true"
          >
            {activeLabel}
          </motion.span>
        </AnimatePresence>
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
                  <b aria-hidden="true">{link.index}</b>
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
            aria-label={`中 / EN：${t.switchLanguage}`}
            title={t.switchLanguage}
          >
            <span className={language === "zh" ? "is-active" : ""}>中</span>
            <i aria-hidden="true">/</i>
            <span className={language === "en" ? "is-active" : ""}>EN</span>
          </button>
          <V3MusicControl />
          <a
            className={`v3-nav-contact${activeSection === "contact" ? " is-active" : ""}`}
            href="#contact"
            aria-label={t.nav.contact}
            aria-current={activeSection === "contact" ? "location" : undefined}
          >
            <span>{t.nav.contact}</span>
            <ArrowUpRight aria-hidden="true" />
          </a>
        </div>
        <div className="v3-nav-progress" aria-hidden="true">
          <span>00</span>
          <span className="v3-nav-progress-track">
            <motion.i
              style={{
                scaleY: reduceMotion ? 0 : scrollYProgress,
                transformOrigin: "top",
              }}
            />
          </span>
          <span>100</span>
        </div>
      </div>
    </motion.header>
  );
}
