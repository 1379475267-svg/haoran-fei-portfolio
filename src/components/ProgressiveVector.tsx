import { motion } from "framer-motion";
import { useRef } from "react";

interface ProgressiveVectorProps {
  mode?: "section" | "hero";
}

export default function ProgressiveVector({ mode = "section" }: ProgressiveVectorProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number>(0);

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    window.cancelAnimationFrame(frameRef.current);
    const { clientX, clientY, currentTarget } = event;
    const rect = currentTarget.getBoundingClientRect();
    const x = (clientX - rect.left) / rect.width - 0.5;
    const y = (clientY - rect.top) / rect.height - 0.5;

    frameRef.current = window.requestAnimationFrame(() => {
      cardRef.current?.style.setProperty("--vector-x", `${x * 22}px`);
      cardRef.current?.style.setProperty("--vector-y", `${y * 16}px`);
      cardRef.current?.style.setProperty("--vector-rotate", `${x * 2.2}deg`);
    });
  };

  const resetPointer = () => {
    cardRef.current?.style.setProperty("--vector-x", "0px");
    cardRef.current?.style.setProperty("--vector-y", "0px");
    cardRef.current?.style.setProperty("--vector-rotate", "0deg");
  };

  const vectorCard = (
    <motion.div
      ref={cardRef}
      className={`progressive-vector ${mode === "hero" ? "is-hero" : ""}`}
      initial={{ opacity: 0, y: mode === "hero" ? 18 : 34 }}
      animate={mode === "hero" ? { opacity: 1, y: 0 } : undefined}
      whileInView={mode === "section" ? { opacity: 1, y: 0 } : undefined}
      viewport={{ once: true, amount: 0.25 }}
      transition={{
        duration: mode === "hero" ? 0.7 : 0.8,
        delay: mode === "hero" ? 0.2 : 0,
        ease: [0.22, 1, 0.36, 1],
      }}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
    >
      <div className="vector-art" aria-hidden="true">
        <div className="vector-plane vector-plane-top" />
        <div className="vector-plane vector-plane-mid" />
        <div className="vector-plane vector-plane-light" />
        <div className="vector-plane vector-plane-bottom" />
        <div className="vector-horizon" />
        <div className="vector-noise" />
      </div>

      <div className="vector-meta vector-meta-top">
        <span>PROGRESSIVE VECTOR / 02</span>
        <span>HAORAN FEI - 2026</span>
      </div>

      <div className="vector-copy">
        <span className="vector-kicker">ENGINEERING x MUSIC x VISUAL SYSTEMS</span>
        <h2>
          <span className="vector-word word-build">BUILD</span>
          <span className="vector-word word-learn">LEARN</span>
          <span className="vector-word word-create">CREATE</span>
        </h2>
        <p>
          Turning technical practice, patient learning and personal expression into work with a clear point of view.
        </p>
      </div>

      <div className="vector-meta vector-meta-bottom">
        <span>01 / CLARITY</span>
        <span>02 / ITERATION</span>
        <span>03 / EXPRESSION</span>
      </div>

      <span className="vector-corner vector-corner-tl" />
      <span className="vector-corner vector-corner-tr" />
      <span className="vector-corner vector-corner-bl" />
      <span className="vector-corner vector-corner-br" />
    </motion.div>
  );

  if (mode === "hero") {
    return vectorCard;
  }

  return (
    <section id="direction" className="vector-section section-divider relative" aria-label="Creative direction">
      <div className="section-shell">{vectorCard}</div>
    </section>
  );
}
