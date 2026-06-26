import { motion } from "framer-motion";
import { ArrowUpRight, Github, Mail } from "lucide-react";
import { profile, stats } from "../data/profile";
import HeroDashboard from "./HeroDashboard";
import StatRibbon from "./StatRibbon";
import ChromaOrb from "./ChromaOrb";
import SplineBackground from "./SplineBackground";

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0 },
};

export default function Hero() {
  return (
    <>
      <section id="home" className="hero-grid relative flex min-h-[940px] items-center overflow-hidden pt-24">
        <SplineBackground />
        <video
          className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-1000"
          autoPlay
          muted
          loop
          playsInline
          onCanPlay={(event) => {
            event.currentTarget.style.opacity = "0.1";
          }}
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>
        <div className="hero-vignette absolute inset-0" />

        <div className="section-shell relative z-10 grid items-center gap-12 py-20 lg:grid-cols-[1.02fr_.98fr] xl:gap-16">
          <motion.div initial="hidden" animate="visible" transition={{ staggerChildren: 0.1 }}>
            <motion.div variants={fadeUp} transition={{ duration: 0.6 }} className="status-badge">
              <span />
              OPEN TO IDEAS · COLLABORATION · BUILDING IN PUBLIC
            </motion.div>

            <motion.p
              variants={fadeUp}
              className="mb-4 mt-8 text-xs font-medium tracking-[0.3em] text-slate-500"
            >
              HELLO / 你好 — 2026
            </motion.p>
            <motion.h1
              variants={fadeUp}
              className="max-w-4xl text-[3.6rem] font-semibold leading-[0.94] tracking-[-0.065em] text-slate-100 sm:text-7xl lg:text-[4.9rem] xl:text-[6.15rem]"
            >
              Hi, I'm
              <span className="mt-2 block">
                <span className="gradient-haoran">Haoran</span>{" "}
                <span className="gradient-fei">Fei.</span>
              </span>
            </motion.h1>
            <motion.p variants={fadeUp} className="mt-7 text-base font-medium text-slate-300 sm:text-lg">
              {profile.role}
            </motion.p>
            <motion.p
              variants={fadeUp}
              className="mt-5 max-w-2xl text-[15px] leading-8 text-slate-400 sm:text-base"
            >
              {profile.heroIntro}
            </motion.p>

            <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-3">
              <a href="#projects" className="button-primary">
                View Projects <ArrowUpRight size={17} />
              </a>
              <a href="#contact" className="button-secondary">
                Contact Me <Mail size={16} />
              </a>
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer"
                className="icon-button"
                aria-label="View GitHub profile"
              >
                <Github size={18} />
              </a>
            </motion.div>

            <motion.div variants={fadeUp} className="hero-stats">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            className="mobile-chroma lg:hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
          >
            <ChromaOrb />
            <div className="mobile-chroma-footer">
              <span>CHROMA PROFILE</span>
              <span>HF / 2026</span>
            </div>
          </motion.div>

          <div className="hidden lg:block">
            <HeroDashboard />
          </div>
        </div>
      </section>
      <StatRibbon />
    </>
  );
}
