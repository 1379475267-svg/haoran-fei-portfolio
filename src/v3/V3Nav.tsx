import { ArrowUpRight, Menu, X } from "lucide-react";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useReducedMotion,
  useScroll,
} from "framer-motion";
import { useEffect, useRef, useState, type RefObject } from "react";
import V3BrandLogo from "./V3BrandLogo";
import V3MusicControl, { type V3MusicControlHandle } from "./V3MusicControl";
import { useV3Language } from "./V3Language";

const sectionTargets = [
  { id: "home", href: "#home" },
  { id: "project-reel", href: "#project-reel" },
  { id: "about", href: "#about" },
  { id: "capabilities", href: "#capabilities" },
  { id: "projects", href: "#projects" },
  { id: "journey", href: "#journey" },
  { id: "contact", href: "#contact" },
] as const;

type SectionId = (typeof sectionTargets)[number]["id"];

function getSectionFromHash(): SectionId | null {
  if (typeof window === "undefined") return null;

  const targetId = decodeURIComponent(window.location.hash.slice(1));
  if (targetId.startsWith("project-")) return "projects";

  return sectionTargets.find((target) => target.id === targetId)?.id ?? null;
}

interface V3NavProps {
  ready: boolean;
  musicControlRef: RefObject<V3MusicControlHandle>;
}

export default function V3Nav({ ready, musicControlRef }: V3NavProps) {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const { language, setLanguage, t } = useV3Language();
  const [activeSection, setActiveSection] = useState<SectionId>(
    () => getSectionFromHash() ?? "home",
  );
  const [navFloating, setNavFloating] = useState(false);
  const [mobileCompact, setMobileCompact] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuToggleRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLElement>(null);
  const navMarkRef = useRef<HTMLAnchorElement>(null);
  const activeHref = sectionTargets.find((target) => target.id === activeSection)?.href ?? "#home";
  const links = [
    { label: t.nav.about, href: "#about", index: "01", sections: ["about", "capabilities"] },
    { label: t.nav.projects, href: "#projects", index: "02", sections: ["project-reel", "projects"] },
    { label: t.nav.journey, href: "#journey", index: "03", sections: ["journey"] },
  ];
  const activeLabel = activeHref === "#home"
    ? (language === "zh" ? "首页" : "Home")
    : activeHref === "#contact"
        ? t.nav.contact
        : links.find((link) => link.sections.includes(activeSection))?.label ?? t.nav.projects;

  const navigationSurface = activeSection === "project-reel" || activeSection === "projects"
    ? "light"
    : "dark";

  const closeMobileMenu = (restoreFocus = false) => {
    if (mobileMenuRef.current) mobileMenuRef.current.inert = true;
    setMobileMenuOpen(false);
    if (restoreFocus) menuToggleRef.current?.focus({ preventScroll: true });
  };

  const selectMobileSection = (sectionId: SectionId) => {
    closeMobileMenu();
    setActiveSection(sectionId);
    setMobileCompact(false);

    // Move keyboard reading order to the destination without changing anchor scrolling.
    const section = document.getElementById(sectionId);
    if (!section) return;
    const hadTabIndex = section.hasAttribute("tabindex");
    if (!hadTabIndex) {
      section.tabIndex = -1;
      section.addEventListener("blur", () => section.removeAttribute("tabindex"), { once: true });
    }
    section.focus({ preventScroll: true });
  };

  useEffect(() => {
    if (!mobileMenuOpen) return;
    if (mobileMenuRef.current) mobileMenuRef.current.inert = false;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      closeMobileMenu(true);
    };
    const handleOutsidePointer = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (mobileMenuRef.current?.contains(target) || menuToggleRef.current?.contains(target)) return;
      closeMobileMenu();
    };
    const handleFocus = (event: FocusEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (mobileMenuRef.current?.contains(target) || menuToggleRef.current?.contains(target)) return;
      closeMobileMenu();
    };
    const desktop = window.matchMedia("(min-width: 64rem)");
    const handleDesktop = () => {
      if (!desktop.matches) return;
      const focusWasInMenu = mobileMenuRef.current?.contains(document.activeElement)
        || document.activeElement === menuToggleRef.current;
      closeMobileMenu();
      if (focusWasInMenu) navMarkRef.current?.focus({ preventScroll: true });
    };

    document.addEventListener("keydown", handleEscape);
    document.addEventListener("pointerdown", handleOutsidePointer);
    document.addEventListener("focusin", handleFocus);
    desktop.addEventListener("change", handleDesktop);
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("pointerdown", handleOutsidePointer);
      document.removeEventListener("focusin", handleFocus);
      desktop.removeEventListener("change", handleDesktop);
    };
  }, [mobileMenuOpen]);

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

  useEffect(() => {
    let cancelled = false;
    let frame = 0;

    const syncSectionFromHash = () => {
      if (cancelled) return;
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const nextSection = getSectionFromHash();
        if (nextSection) setActiveSection(nextSection);
      });
    };

    syncSectionFromHash();
    void document.fonts.ready.then(syncSectionFromHash);
    window.addEventListener("hashchange", syncSectionFromHash);

    return () => {
      cancelled = true;
      window.removeEventListener("hashchange", syncSectionFromHash);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    let frame = 0;

    setNavFloating(window.scrollY > 80);

    const handleScroll = () => {
      if (frame) return;

      frame = window.requestAnimationFrame(() => {
        setNavFloating(window.scrollY > 80);
        frame = 0;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    let previousY = window.scrollY;
    let frame = 0;

    const handleScrollDirection = () => {
      if (frame) return;

      frame = window.requestAnimationFrame(() => {
        const nextY = window.scrollY;

        if (nextY < 80 || nextY < previousY - 8) {
          setMobileCompact(false);
        } else if (nextY > previousY + 8) {
          setMobileCompact(true);
        }

        previousY = nextY;
        frame = 0;
      });
    };

    window.addEventListener("scroll", handleScrollDirection, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScrollDirection);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <motion.header
      className="v3-nav-shell"
      data-surface={navigationSurface}
      data-section={activeSection}
      data-floating={navFloating || undefined}
      data-compact={mobileCompact || undefined}
      data-mobile-menu-open={mobileMenuOpen || undefined}
      initial={reduceMotion ? false : { opacity: 0, y: -18 }}
      animate={ready || reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -18 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="v3-nav">
        <a
          ref={navMarkRef}
          className={`v3-nav-mark${activeSection === "home" ? " is-active" : ""}`}
          href="#home"
          aria-label={language === "zh" ? "费浩然，返回顶部" : "Haoran Fei, back to top"}
          aria-current={activeSection === "home" ? "location" : undefined}
          onClick={() => {
            setActiveSection("home");
            setMobileCompact(false);
            closeMobileMenu();
          }}
        >
          <V3BrandLogo className="v3-brand-logo--nav" revealOrigin decorative />
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
              const active = link.sections.includes(activeSection);

              return (
                <a
                  className={active ? "is-active" : undefined}
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "location" : undefined}
                  onClick={() => {
                    setActiveSection(link.href.slice(1) as SectionId);
                    setMobileCompact(false);
                  }}
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
          <button
            ref={menuToggleRef}
            type="button"
            className="v3-mobile-menu-toggle"
            aria-expanded={mobileMenuOpen}
            aria-controls={mobileMenuOpen ? "v3-mobile-menu" : undefined}
            aria-label={language === "zh"
              ? (mobileMenuOpen ? "关闭导航菜单" : "打开导航菜单")
              : (mobileMenuOpen ? "Close navigation menu" : "Open navigation menu")}
            onClick={() => mobileMenuOpen ? closeMobileMenu() : setMobileMenuOpen(true)}
          >
            <span>{language === "zh" ? "菜单" : "Menu"}</span>
            {mobileMenuOpen ? <X className="v3-mobile-menu-icon" aria-hidden="true" /> : <Menu className="v3-mobile-menu-icon" aria-hidden="true" />}
          </button>
          <a
            className={`v3-nav-contact${activeSection === "contact" ? " is-active" : ""}`}
            href="#contact"
            aria-label={t.nav.contact}
            aria-current={activeSection === "contact" ? "location" : undefined}
            onClick={() => {
              setActiveSection("contact");
              setMobileCompact(false);
            }}
          >
            <span>{t.nav.contact}</span>
            <ArrowUpRight aria-hidden="true" />
          </a>
        </div>
      </div>
      <AnimatePresence initial={false}>
        {mobileMenuOpen && (
          <motion.nav
            ref={mobileMenuRef}
            id="v3-mobile-menu"
            className="v3-mobile-menu"
            aria-label={language === "zh" ? "移动端导航" : "Mobile navigation"}
            initial={reduceMotion ? false : { opacity: 0, y: -8, clipPath: "inset(0 0 16% 0 round 12px)" }}
            animate={{ opacity: 1, y: 0, clipPath: "inset(0 0 0% 0 round 12px)" }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -5 }}
            transition={{ duration: reduceMotion ? 0 : 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="v3-mobile-menu-heading">
              <span>{language === "zh" ? "页面导航" : "Explore"}</span>
              <span aria-hidden="true">HAORAN FEI</span>
            </div>
            <a
              href="#home"
              aria-current={activeSection === "home" ? "location" : undefined}
              onClick={() => selectMobileSection("home")}
            >
              <span><b aria-hidden="true">00</b>{language === "zh" ? "首页" : "Home"}</span>
              <ArrowUpRight aria-hidden="true" />
            </a>
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                aria-current={link.sections.includes(activeSection) ? "location" : undefined}
                onClick={() => selectMobileSection(link.href.slice(1) as SectionId)}
              >
                <span><b aria-hidden="true">{link.index}</b>{link.label}</span>
                <ArrowUpRight aria-hidden="true" />
              </a>
            ))}
            <div className="v3-mobile-menu-footer">
              <button
                type="button"
                className="v3-mobile-language"
                onClick={() => setLanguage(language === "zh" ? "en" : "zh")}
                aria-label={`中 / EN：${t.switchLanguage}`}
              >
                <span className={language === "zh" ? "is-active" : ""}>中</span>
                <i aria-hidden="true">/</i>
                <span className={language === "en" ? "is-active" : ""}>EN</span>
              </button>
              <a
                href="#contact"
                aria-current={activeSection === "contact" ? "location" : undefined}
                onClick={() => selectMobileSection("contact")}
              >
                {t.nav.contact}<ArrowUpRight aria-hidden="true" />
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
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
    </motion.header>
  );
}
