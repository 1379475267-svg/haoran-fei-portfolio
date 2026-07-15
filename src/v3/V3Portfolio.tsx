import V3About from "./V3About";
import V3Capabilities from "./V3Capabilities";
import V3Footer from "./V3Footer";
import V3Hero from "./V3Hero";
import V3Nav from "./V3Nav";
import V3ProjectReel from "./V3ProjectReel";
import V3Projects from "./V3Projects";

export default function V3Portfolio() {
  return (
    <div className="v3-site">
      <a className="v3-skip-link" href="#main-content">
        Skip to projects
      </a>
      <V3Nav />
      <main id="main-content">
        <V3Hero />
        <V3ProjectReel />
        <V3About />
        <V3Capabilities />
        <V3Projects />
      </main>
      <V3Footer />
    </div>
  );
}
