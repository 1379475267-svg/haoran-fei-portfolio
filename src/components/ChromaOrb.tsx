import { useRef } from "react";

interface ChromaOrbProps {
  className?: string;
  compact?: boolean;
}

export default function ChromaOrb({ className = "", compact = false }: ChromaOrbProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number>(0);

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    window.cancelAnimationFrame(frameRef.current);
    const { clientX, clientY, currentTarget } = event;
    const rect = currentTarget.getBoundingClientRect();
    const x = (clientX - rect.left) / rect.width - 0.5;
    const y = (clientY - rect.top) / rect.height - 0.5;

    frameRef.current = window.requestAnimationFrame(() => {
      rootRef.current?.style.setProperty("--chroma-x", `${x * 12}deg`);
      rootRef.current?.style.setProperty("--chroma-y", `${y * -12}deg`);
      rootRef.current?.style.setProperty("--light-x", `${42 + x * 20}%`);
      rootRef.current?.style.setProperty("--light-y", `${34 + y * 18}%`);
    });
  };

  const resetPointer = () => {
    rootRef.current?.style.setProperty("--chroma-x", "0deg");
    rootRef.current?.style.setProperty("--chroma-y", "0deg");
    rootRef.current?.style.setProperty("--light-x", "42%");
    rootRef.current?.style.setProperty("--light-y", "34%");
  };

  return (
    <div
      ref={rootRef}
      className={`chroma-stage ${compact ? "is-compact" : ""} ${className}`}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
      aria-hidden="true"
    >
      <div className="chroma-coordinate coordinate-top">CHROMA / 01</div>
      <div className="chroma-coordinate coordinate-side">HF—2026</div>
      <div className="chroma-frame">
        <span className="frame-corner corner-tl" />
        <span className="frame-corner corner-tr" />
        <span className="frame-corner corner-bl" />
        <span className="frame-corner corner-br" />
        <div className="chroma-orb">
          <div className="chroma-grain" />
          <div className="chroma-highlight" />
          <div className="chroma-shadow" />
        </div>
        <div className="chroma-title">
          <strong>Haoran</strong>
          <span>Portfolio / Personal System</span>
        </div>
        <span className="chroma-mark">HF</span>
      </div>
      <div className="chroma-axis axis-horizontal" />
      <div className="chroma-axis axis-vertical" />
    </div>
  );
}
