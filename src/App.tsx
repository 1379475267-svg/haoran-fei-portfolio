import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import Timeline from "./components/Timeline";
import Contact from "./components/Contact";
import BackgroundEffects from "./components/BackgroundEffects";
import CursorGlow from "./components/CursorGlow";
import ScrollProgress from "./components/ScrollProgress";
import TechMarquee from "./components/TechMarquee";
import NowFocus from "./components/NowFocus";
import ProgressiveVector from "./components/ProgressiveVector";

export default function App() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-ink text-slate-100">
      <BackgroundEffects />
      <CursorGlow />
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <About />
        <ProgressiveVector />
        <Projects />
        <TechMarquee />
        <Skills />
        <NowFocus />
        <Timeline />
        <Contact />
      </main>
    </div>
  );
}
