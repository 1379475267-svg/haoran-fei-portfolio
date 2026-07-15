import V3About from "./V3About";
import V3Capabilities from "./V3Capabilities";
import V3Footer from "./V3Footer";
import V3Hero from "./V3Hero";
import V3Nav from "./V3Nav";
import V3ProjectReel from "./V3ProjectReel";
import V3Projects from "./V3Projects";
import { V3LanguageProvider, useV3Language } from "./V3Language";

function V3PortfolioContent() {
  const { language, t } = useV3Language();

  return (
    <div className="v3-site" lang={language === "zh" ? "zh-CN" : "en"} data-language={language}>
      <a className="v3-skip-link" href="#main-content">
        {t.skip}
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

export default function V3Portfolio() {
  return (
    <V3LanguageProvider>
      <V3PortfolioContent />
    </V3LanguageProvider>
  );
}
