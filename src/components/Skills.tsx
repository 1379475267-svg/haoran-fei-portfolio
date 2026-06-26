import { motion } from "framer-motion";
import { Braces, Layers3, Sparkles } from "lucide-react";
import { skills, techStack } from "../data/profile";
import SectionHeader from "./SectionHeader";

export default function Skills() {
  return (
    <section id="skills" className="section-space section-divider relative">
      <div className="skills-orb" />
      <div className="section-shell relative">
        <SectionHeader
          eyebrow="03 / CAPABILITIES"
          title="Skills & Strengths"
          description="Not a static checklist, but a practical system of abilities growing through projects, documentation and long-term practice."
        />

        <div className="skills-layout mt-14">
          <motion.aside
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.7 }}
            className="skills-overview"
          >
            <div className="flex items-center justify-between">
              <div className="icon-shell"><Layers3 size={21} /></div>
              <span className="live-label"><i /> EVOLVING</span>
            </div>
            <p className="eyebrow-mini mt-10">SKILLS OVERVIEW</p>
            <h3 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-slate-100">
              Learning across the boundary of hardware, software and expression.
            </h3>
            <p className="mt-5 text-sm leading-7 text-slate-400">
              My strongest pattern is connecting ideas: engineering with interface design, AI tools with
              disciplined workflows, and technical projects with clear storytelling.
            </p>

            <div className="skill-radar mt-10">
              <div className="radar-ring radar-one" />
              <div className="radar-ring radar-two" />
              <div className="radar-ring radar-three" />
              <div className="radar-axis radar-axis-a" />
              <div className="radar-axis radar-axis-b" />
              <div className="radar-core"><Braces size={22} /></div>
              <span className="radar-point point-a" />
              <span className="radar-point point-b" />
              <span className="radar-point point-c" />
            </div>

            <div className="mt-10 flex flex-wrap gap-2">
              {techStack.slice(0, 8).map((tech) => <span key={tech} className="tag-pill">{tech}</span>)}
            </div>
          </motion.aside>

          <motion.div
            className="skill-matrix"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.08 }}
            transition={{ staggerChildren: 0.07 }}
          >
            {skills.map(({ title, description, level, progress, icon: Icon }, index) => (
              <motion.article
                key={title}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                className="skill-cell group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="icon-shell"><Icon size={20} /></div>
                  <span className="skill-index">0{index + 1}</span>
                </div>
                <h3 className="mt-6 text-lg font-semibold text-slate-100">{title}</h3>
                <p className="mt-3 min-h-[76px] text-sm leading-6 text-slate-400">{description}</p>
                <div className="mt-5 flex items-center justify-between text-[10px] uppercase tracking-[0.16em]">
                  <span className="text-cyan-200">{level}</span>
                  <span className="text-slate-600">{progress}%</span>
                </div>
                <div className="skill-progress mt-2">
                  <motion.i
                    initial={{ width: 0 }}
                    whileInView={{ width: `${progress}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, delay: index * 0.06 }}
                  />
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-600">
          <Sparkles size={14} className="text-violet-300/70" />
          Familiarity bars describe current practice, not fixed limits.
        </div>
      </div>
    </section>
  );
}
