import { ArrowDownRight, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { navItems } from "../data/profile";

const menuItems = navItems.filter(({ label }) =>
  ["About", "Projects", "Skills", "Now", "Contact"].includes(label),
);

export default function Navbar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  return (
    <header className="soft-nav">
      <nav className="soft-shell soft-nav-inner" aria-label="Primary navigation">
        <a href="#home" className="soft-wordmark" aria-label="Haoran Fei — back to home">
          <span className="soft-wordmark-dot" aria-hidden="true" />
          Haoran Fei
        </a>

        <a href="#projects" className="soft-action soft-nav-action">
          <span className="soft-action-icon" aria-hidden="true">
            <ArrowDownRight size={16} />
          </span>
          Explore work
        </a>

        <button
          type="button"
          className="soft-nav-toggle"
          aria-expanded={open}
          aria-controls="mobile-navigation"
          aria-label={open ? "Close navigation" : "Open navigation"}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      <div
        id="mobile-navigation"
        className={`soft-nav-sheet ${open ? "is-open" : ""}`}
        aria-hidden={!open}
      >
        <div className="soft-shell soft-nav-sheet-inner">
          <p>Navigate</p>
          <div>
            {menuItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                tabIndex={open ? 0 : -1}
                onClick={() => setOpen(false)}
              >
                {item.label}
                <ArrowDownRight size={18} aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
