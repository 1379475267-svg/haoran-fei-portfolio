import { motion } from "framer-motion";
import { Code2, Cpu, Music2, Radio } from "lucide-react";
import ChromaOrb from "./ChromaOrb";

export default function HeroDashboard() {
  return (
    <motion.div
      className="chroma-dashboard"
      initial={{ opacity: 0, scale: 0.95, y: 22 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="chroma-dashboard-bar">
        <div className="flex items-center gap-2">
          <span className="window-dot bg-rose-400/60" />
          <span className="window-dot bg-amber-300/60" />
          <span className="window-dot bg-emerald-300/60" />
        </div>
        <div className="flex items-center gap-2">
          <Radio size={11} />
          LIVE PROFILE / 2026
        </div>
      </div>

      <div className="chroma-dashboard-canvas">
        <ChromaOrb />

        <motion.div
          className="chroma-note note-focus"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="chroma-note-label"><Code2 size={12} /> CURRENT FOCUS</div>
          <strong>Embedded / AI Coding</strong>
          <span>Web Visualization</span>
        </motion.div>

        <motion.div
          className="chroma-note note-building"
          animate={{ y: [0, 4, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
        >
          <div className="chroma-note-label"><Cpu size={12} /> NOW BUILDING</div>
          <strong>Portfolio V2</strong>
          <div className="chroma-progress"><i /></div>
        </motion.div>

        <motion.div
          className="chroma-note note-music"
          animate={{ x: [0, 4, 0] }}
          transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 1.4 }}
        >
          <div className="chroma-note-label"><Music2 size={12} /> LONG-TERM PRACTICE</div>
          <strong>Guitar / Piano</strong>
        </motion.div>

        <div className="chroma-system-line line-one" />
        <div className="chroma-system-line line-two" />
        <span className="chroma-node node-one" />
        <span className="chroma-node node-two" />
      </div>

      <div className="chroma-dashboard-footer">
        <span>REACT / TYPESCRIPT / STM32 / PYTHON</span>
        <span>QUIETLY BUILDING -&gt;</span>
      </div>
    </motion.div>
  );
}
