import { ArrowUpRight } from "lucide-react";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useReducedMotion,
  useScroll,
} from "framer-motion";
import { useEffect, useState, type RefObject } from "react";
import V3BrandLogo from "./V3BrandLogo";
import V3MusicControl, { type V3MusicControlHandle } from "./V3MusicControl";
import { useV3Language } from "./V3Language";

const sectionTargets = [
  { id: "home", href: "#home" },
  { id: "project-reel", href: "#project-reel" },
  { id: "about", href: "#about" },
  { id: "capabilities", href: "#capabilities" },
  { id: "projects", href: "#projects" },
  { id: "contact", href: "#contact" },
] as const;

interface V3NavProps {
  ready: boolean;
  musicControlRef: RefObject<V3MusicControlHandle>;
}

export default function V3Nav({ ready, musicControlRef }: V3NavProps) {
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
    : activeHref === "#project-reel"
      ? (language === "zh" ? "项目进行时" : "Project reel")
      : activeHref === "#contact"
        ? t.nav.contact
        : links.find((link) => link.href === activeHref)?.label ?? t.nav.projects;

  const navigationSurface = activeSection === "project-reel" || activeSection === "projects"
    ? "light"
    : "dark";

  useEffect(() => {
    const sections = sectionTargets
      .map((target) => document.getElementById(target.id))
      .filter((section): section is HTMLElement => Boolean(section));

    const observer = new IntersectionObserver(
      (entries) => {
        const activeEntry = entries.find((entry) => entry.isIntersecting);
        if (!activeEntry) return;

        const nextSection = activeEntry.target.id as (typeof sectionTargets)[number]["id"];
        setActiveSection((currentSection) => (
          currentSection === nextSection ? currentSection : nextSection
        ));
      },
      {
        rootMargin: "-34% 0px -65% 0px",
        threshold: 0,
      },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <motion.header
      className="v3-nav-shell"
      data-surface={navigationSurface}
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
          onClick={() => setActiveSection("home")}
        >
          <V3BrandLogo className="v3-brand-logo--nav" decorative />
          <small>HAORAN FEI</small>
        </a>
        <div className="v3-nav-status" aria-hidden="true">
          <i />
          <V3BrandLogo className="v3-brand-logo--status" decorative />
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
                  onClick={() =>
                    setActiveSection(
                      link.href.slice(1) as "about" | "capabilities" | "projects",
                    )}
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
          <V3MusicControl ref={musicControlRef} />
          <a
            className={`v3-nav-contact${activeSection === "contact" ? " is-active" : ""}`}
            href="#contact"
            aria-label={t.nav.contact}
            aria-current={activeSection === "contact" ? "location" : undefined}
            onClick={() => setActiveSection("contact")}
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
