import { motion, useReducedMotion } from "framer-motion";
import { useV3Language } from "./V3Language";
import V3RevealTitle from "./V3RevealTitle";

export default function V3About() {
  const { t, language } = useV3Language();
  const reduced = Boolean(useReducedMotion());
  return (
    <section className="v3-about journal-about nightflight-about" id="about" aria-labelledby="about-title">
      <div className="journal-section-heading">
        <p className="journal-eyebrow">02 / {language === "zh" ? "关于我" : "A LITTLE ABOUT ME"}</p>
        <h2 id="about-title"><V3RevealTitle key={language} text={language === "zh" ? "从兴趣出发，" : "Led by curiosity."} /><br />
          <V3RevealTitle key={language + "-second"} className="journal-muted-title" text={language === "zh" ? "在真实世界里验证。" : "Grounded in practice."} /></h2>
      </div>
      <motion.div className="journal-about-body" initial={reduced ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.8 }}>
        <p>{t.about.lead}</p><p>{t.about.priority}</p>
      </motion.div>
      <div className="nightflight-desk-note">
        <span>AT THE WORKBENCH</span>
        <p>{language === "zh"
          ? "从吉他与钢琴的练习，到无人机的定位、规划与控制。我喜欢反复试验，让抽象的知识拥有声音、画面和真实的反馈。这里记录完成的作品，也记录仍在推进的实验。"
          : "From guitar and piano practice to localization, planning and flight control. I like giving abstract ideas a sound, a shape and a real response. This studio holds finished work alongside experiments still unfolding."}</p>
      </div>
      <div className="journal-about-note"><span>SENSE / PLAN / FLY</span><p>{t.about.bridge}</p></div>
    </section>
  );
}
