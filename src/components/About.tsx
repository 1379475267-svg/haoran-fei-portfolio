import { ArrowDownRight, ArrowUpRight, Radio, UserRound } from "lucide-react";
import { profile, ribbonItems } from "../data/profile";
import Reveal from "./Reveal";
import SectionHeader from "./SectionHeader";

export default function About() {
  return (
    <section id="about" className="soft-section soft-about">
      <div className="soft-shell">
        <div className="soft-entry-grid" aria-label="Portfolio shortcuts">
          <a href="#projects" className="soft-entry-card">
            <span className="soft-entry-icon" aria-hidden="true">
              <Radio size={23} />
            </span>
            <span>
              <small>Current field project</small>
              <strong>Open the Drone Lab</strong>
            </span>
            <ArrowDownRight className="soft-entry-arrow" size={21} aria-hidden="true" />
          </a>

          <a href="#about-note" className="soft-entry-card soft-entry-card-secondary">
            <span className="soft-entry-icon" aria-hidden="true">
              <UserRound size={22} />
            </span>
            <span>
              <small>Profile note</small>
              <strong>Meet the builder</strong>
            </span>
            <ArrowDownRight className="soft-entry-arrow" size={21} aria-hidden="true" />
          </a>
        </div>

        <Reveal className="soft-about-motion">
          <div id="about-note" className="soft-about-layout">
            <SectionHeader
              label="About"
              title="I turn learning into things that can be tested."
              description="Engineering practice, music learning, and a habit of keeping the work visible enough to review and improve."
            />

            <div className="soft-about-note">
              <p>{profile.about}</p>
              <blockquote>“{profile.signature}”</blockquote>
              <a href={`mailto:${profile.email}`} className="soft-text-link">
                Start a conversation
                <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            </div>
          </div>

          <dl className="soft-direction-list">
            {ribbonItems.map((item) => (
              <div key={item.label}>
                <dt>{item.label}</dt>
                <dd>{item.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
