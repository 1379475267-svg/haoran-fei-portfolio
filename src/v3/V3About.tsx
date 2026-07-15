import { Github, Mail } from "lucide-react";
import { profile } from "../data/profile";
import { useV3Language } from "./V3Language";

export default function V3About() {
  const { t } = useV3Language();

  return (
    <section className="v3-about" id="about" aria-labelledby="about-title">
      <div className="v3-about-orbit v3-about-orbit-one" aria-hidden="true"><i /></div>
      <div className="v3-about-orbit v3-about-orbit-two" aria-hidden="true"><i /></div>
      <span className="v3-about-cross v3-about-cross-one" aria-hidden="true">+</span>
      <span className="v3-about-cross v3-about-cross-two" aria-hidden="true">+</span>
      <div className="v3-about-inner">
        <p className="v3-section-label">{t.about.eyebrow}</p>
        <h2 id="about-title">{t.about.title}</h2>
        <div className="v3-about-copy">
          <p>{t.about.lead}</p>
          <p>{t.about.priority}</p>
        </div>
        <div className="v3-about-links">
          <a href={profile.github} target="_blank" rel="noreferrer">
            <Github aria-hidden="true" /> GitHub
          </a>
          <a href="#contact">
            <Mail aria-hidden="true" /> {t.about.email}
          </a>
        </div>
      </div>
    </section>
  );
}
