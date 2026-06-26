import { motion } from "framer-motion";
import { Cpu, Gauge, Music2, Sparkles } from "lucide-react";
import { profile } from "../data/profile";
import BentoCard from "./BentoCard";
import SectionHeader from "./SectionHeader";
import ChromaOrb from "./ChromaOrb";

const reveal = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export default function About() {
  return (
    <section id="about" className="section-space section-divider relative">
      <div className="section-shell">
        <SectionHeader
          eyebrow="01 / PROFILE"
          title="More than a list of tools."
          description="A profile shaped by engineering practice, long-term music learning and the habit of turning curiosity into tangible work."
        />

        <motion.div
          className="about-bento mt-14"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.12 }}
          transition={{ staggerChildren: 0.08 }}
        >
          <motion.div variants={reveal} className="about-profile">
            <BentoCard className="h-full overflow-hidden p-5" accent="cyan">
              <div className="profile-portrait">
                <img
                  src="/src/assets/avatar.jpg"
                  alt="Haoran Fei"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
                <ChromaOrb compact className="profile-chroma" />
                <span className="portrait-coordinate">23.1° N / BUILDING</span>
              </div>
              <div className="px-2 pb-2 pt-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-semibold tracking-tight text-slate-100">Haoran Fei</h3>
                    <p className="mt-1 text-sm text-cyan-200/80">Electronic Information Student</p>
                  </div>
                  <span className="online-pulse" />
                </div>
                <p className="mt-5 border-t border-white/8 pt-5 text-sm italic text-slate-400">
                  “{profile.signature}”
                </p>
              </div>
            </BentoCard>
          </motion.div>

          <motion.div variants={reveal} className="about-story">
            <BentoCard className="relative h-full overflow-hidden p-8 sm:p-10" accent="blue">
              <span className="bento-number">01</span>
              <p className="eyebrow-mini">STORY / ABOUT ME</p>
              <h3 className="mt-7 max-w-xl text-2xl font-semibold leading-tight text-slate-100 sm:text-3xl">
                Building is how I turn learning into something real.
              </h3>
              <p className="mt-6 max-w-2xl text-[15px] leading-8 text-slate-400">{profile.about}</p>
              <div className="mt-8 flex items-center gap-3 text-xs text-slate-500">
                <Sparkles size={15} className="text-cyan-300" />
                Engineering · Expression · Iteration
              </div>
            </BentoCard>
          </motion.div>

          <motion.div variants={reveal} className="about-music">
            <BentoCard className="h-full p-7" accent="violet">
              <div className="flex items-center justify-between">
                <div className="icon-shell violet-icon"><Music2 size={20} /></div>
                <span className="eyebrow-mini">SINCE 2016</span>
              </div>
              <h3 className="mt-8 text-xl font-semibold text-slate-100">Music Since 2016</h3>
              <p className="mt-2 text-sm text-slate-400">Guitar · Piano · Fingerstyle · Arrangement</p>
              <div className="audio-wave mt-8">
                {Array.from({ length: 28 }).map((_, index) => (
                  <i key={index} style={{ height: `${18 + ((index * 31) % 76)}%` }} />
                ))}
              </div>
            </BentoCard>
          </motion.div>

          <motion.div variants={reveal} className="about-engineering">
            <BentoCard className="engineering-bento h-full overflow-hidden p-7" accent="cyan">
              <div className="flex items-center justify-between">
                <div className="icon-shell"><Cpu size={20} /></div>
                <Gauge size={17} className="text-slate-600" />
              </div>
              <h3 className="mt-8 text-xl font-semibold text-slate-100">Engineering Practice</h3>
              <p className="mt-2 text-sm text-slate-400">STM32 · Sensors · Web · AI Tools</p>
              <div className="circuit-decoration" aria-hidden="true">
                <span /><span /><span /><span />
              </div>
            </BentoCard>
          </motion.div>

          <motion.div variants={reveal} className="about-values">
            <BentoCard className="h-full p-7" accent="blue">
              <p className="eyebrow-mini">WHAT I CARE ABOUT</p>
              <div className="mt-7 grid grid-cols-2 gap-3">
                {["Clarity", "Persistence", "Expression", "Long-term Growth"].map((value, index) => (
                  <div key={value} className="value-chip">
                    <span>0{index + 1}</span>
                    {value}
                  </div>
                ))}
              </div>
            </BentoCard>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
