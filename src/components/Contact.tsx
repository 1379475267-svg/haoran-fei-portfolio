import { ArrowUpRight, Github, Mail } from "lucide-react";
import { contact } from "../data/profile";

export default function Contact() {
  return (
    <footer id="contact" className="soft-footer">
      <div className="soft-shell">
        <p className="soft-footer-label">Open to thoughtful collaboration</p>
        <h2>Let’s build something worth testing.</h2>
        <p className="soft-footer-lede">{contact.subtitle}</p>

        <div className="soft-footer-actions">
          <a href={`mailto:${contact.email}`} className="soft-footer-primary">
            <Mail size={18} aria-hidden="true" />
            {contact.email}
          </a>
          <a href={contact.github} target="_blank" rel="noreferrer">
            <Github size={18} aria-hidden="true" />
            GitHub
            <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </div>

        <div className="soft-footer-meta">
          <span>Haoran Fei · 2026</span>
          <span>{contact.status}</span>
          <a href="#home">Back to top</a>
        </div>
      </div>
    </footer>
  );
}
