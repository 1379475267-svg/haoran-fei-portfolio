import { motion } from "framer-motion";
import { ArrowUpRight, Github, Mail, Terminal } from "lucide-react";
import { contact } from "../data/profile";
import ChromaOrb from "./ChromaOrb";

export default function Contact() {
  return (
    <footer id="contact" className="relative px-4 pb-8 pt-20 sm:px-8 lg:px-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.75 }}
        className="contact-card section-shell"
      >
        <div className="contact-beam" />
        <ChromaOrb compact className="contact-chroma" />
        <div className="contact-copy">
          <p className="eyebrow-mini text-cyan-300">06 / CONTACT</p>
          <h2>{contact.title}</h2>
          <p className="contact-subtitle">{contact.subtitle}</p>

          <div className="contact-details">
            <a href={`mailto:${contact.email}`}>
              <span><Mail size={16} /></span>
              <div>
                <small>Email</small>
                <strong>{contact.email}</strong>
              </div>
            </a>
            <a href={contact.github} target="_blank" rel="noreferrer">
              <span><Github size={16} /></span>
              <div>
                <small>GitHub</small>
                <strong>github.com/1379475267</strong>
              </div>
            </a>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <a href={`mailto:${contact.email}`} className="button-primary">
              Send Email <Mail size={16} />
            </a>
            <a href={contact.github} target="_blank" rel="noreferrer" className="button-secondary">
              View GitHub <ArrowUpRight size={16} />
            </a>
          </div>
        </div>

        <div className="contact-terminal">
          <div className="terminal-bar">
            <div><i /><i /><i /></div>
            <span><Terminal size={12} /> haoran@portfolio</span>
          </div>
          <div className="terminal-body">
            <p><span className="terminal-prompt">&gt;</span> contact --haoran</p>
            <p><span>status:</span> <b>{contact.status}</b></p>
            <p><span>email:</span> {contact.email}</p>
            <p><span>interests:</span> engineering, music, ideas</p>
            <p><span>response:</span> let's make something useful</p>
            <div className="terminal-cursor">_</div>
          </div>
        </div>
      </motion.div>

      <div className="section-shell flex flex-col items-center justify-between gap-4 py-8 text-xs text-slate-600 sm:flex-row">
        <span>Copyright 2026 Haoran Fei. All rights reserved.</span>
        <span>Designed with code, curiosity & rhythm.</span>
      </div>
    </footer>
  );
}
