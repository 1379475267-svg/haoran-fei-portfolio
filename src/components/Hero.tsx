import { ArrowDown, Cloud, Music2 } from "lucide-react";
import FlightOrbit from "./FlightOrbit";

export default function Hero() {
  return (
    <section id="home" className="soft-hero" aria-labelledby="hero-title">
      <FlightOrbit />

      <div className="soft-hero-signal soft-hero-signal-cloud" aria-hidden="true">
        <Cloud size={21} />
      </div>
      <div className="soft-hero-signal soft-hero-signal-music" aria-hidden="true">
        <Music2 size={19} />
      </div>

      <div className="soft-shell soft-hero-inner">
        <div className="soft-hero-copy">
          <p className="soft-hero-kicker">Electronic information / Builder</p>
          <h1 id="hero-title">
            <span className="soft-hero-line">Build quietly.</span>
            <span className="soft-hero-line">Make it tangible.</span>
          </h1>
        </div>

        <div className="soft-hero-foot">
          <p>Autonomous robotics · Embedded systems · Music technology</p>
          <a href="#about" aria-label="Continue to portfolio">
            Scroll to explore
            <ArrowDown size={16} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
