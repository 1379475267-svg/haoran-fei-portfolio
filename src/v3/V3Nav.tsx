import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import V3MusicControl from "./V3MusicControl";
import { useV3Language } from "./V3Language";

export default function V3Nav() {
  const reduceMotion = useReducedMotion();
  const { language, setLanguage, t } = useV3Language();
  const links = [
    { label: t.nav.about, href: "#about" },
    { label: t.nav.capabilities, href: "#capabilities" },
    { label: t.nav.projects, href: "#projects" },
  ];

  return (
    <motion.header
      className="v3-nav-shell"
      initial={reduceMotion ? false : { opacity: 0, y: -18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="v3-nav">
        <a className="v3-nav-mark" href="#home" aria-label={language === "zh" ? "费浩然，返回顶部" : "Haoran Fei, back to top"}>
          HF
        </a>
        <nav aria-label={language === "zh" ? "主导航" : "Primary navigation"}>
          {links.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
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
          <a className="v3-nav-contact" href="#contact">
            {t.nav.contact} <ArrowUpRight aria-hidden="true" />
          </a>
        </div>
      </div>
    </motion.header>
  );
}
