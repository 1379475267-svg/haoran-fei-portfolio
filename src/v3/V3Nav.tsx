import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import V3MusicControl from "./V3MusicControl";

const links = [
  { label: "About", href: "#about" },
  { label: "Capabilities", href: "#capabilities" },
  { label: "Projects", href: "#projects" },
];

export default function V3Nav() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.header
      className="v3-nav-shell"
      initial={reduceMotion ? false : { opacity: 0, y: -18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="v3-nav">
        <a className="v3-nav-mark" href="#home" aria-label="Haoran Fei, back to top">
          HF <span>/ 03</span>
        </a>
        <nav aria-label="Primary navigation">
          {links.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
        <div className="v3-nav-actions">
          <V3MusicControl />
          <a className="v3-nav-contact" href="#contact">
            Contact <ArrowUpRight aria-hidden="true" />
          </a>
        </div>
      </div>
    </motion.header>
  );
}
