import { Github, Mail } from "lucide-react";
import { profile } from "../data/profile";

export default function V3About() {
  return (
    <section className="v3-about" id="about" aria-labelledby="about-title">
      <div className="v3-about-orbit v3-about-orbit-one" aria-hidden="true"><i /></div>
      <div className="v3-about-orbit v3-about-orbit-two" aria-hidden="true"><i /></div>
      <span className="v3-about-cross v3-about-cross-one" aria-hidden="true">+</span>
      <span className="v3-about-cross v3-about-cross-two" aria-hidden="true">+</span>
      <div className="v3-about-inner">
        <p className="v3-section-label">Profile / current direction</p>
        <h2 id="about-title">About me</h2>
        <div className="v3-about-copy">
          <p>{profile.about}</p>
          <p>
            My current priority is a real LiDAR autonomous-flight stack: understanding how
            localization, planning, control, hardware, and team documentation connect in practice.
          </p>
        </div>
        <div className="v3-about-links">
          <a href={profile.github} target="_blank" rel="noreferrer">
            <Github aria-hidden="true" /> GitHub
          </a>
          <a href="#contact">
            <Mail aria-hidden="true" /> Email me
          </a>
        </div>
      </div>
    </section>
  );
}
