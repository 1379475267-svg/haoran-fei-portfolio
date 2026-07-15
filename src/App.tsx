import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import Timeline from "./components/Timeline";
import Contact from "./components/Contact";
import ScrollProgress from "./components/ScrollProgress";
import NowFocus from "./components/NowFocus";

export default function App() {
  return (
    <div className="soft-site">
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Projects />
        <Skills />
        <NowFocus />
        <Timeline />
        <Contact />
      </main>
    </div>
  );
}
