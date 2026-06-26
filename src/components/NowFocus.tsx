import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { focusItems } from "../data/profile";
import SectionHeader from "./SectionHeader";

export default function NowFocus() {
  return (
    <section id="now" className="section-space section-divider relative">
      <div className="section-shell">
        <SectionHeader
          eyebrow="04 / IN PROGRESS"
          title="Now / Current Focus"
          description="A living snapshot of what I am learning, building and trying to understand right now."
        />

        <motion.div
          className="mt-12 grid gap-4 lg:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.18 }}
          transition={{ staggerChildren: 0.1 }}
        >
          {focusItems.map((item) => (
            <motion.article
              key={item.title}
              variants={{
                hidden: { opacity: 0, y: 24 },
                visible: { opacity: 1, y: 0 },
              }}
              className="focus-card group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold tracking-[0.22em] text-cyan-300">{item.index}</span>
                <ArrowUpRight size={16} className="text-slate-600 transition group-hover:text-cyan-200" />
              </div>
              <h3 className="mt-12 text-xl font-semibold text-slate-100">{item.title}</h3>
              <p className="mt-3 min-h-14 text-sm leading-7 text-slate-400">{item.description}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {item.tags.map((tag) => <span key={tag} className="tag-pill">{tag}</span>)}
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
