import { motion, useReducedMotion } from "framer-motion";
import type { PointerEvent, ReactNode } from "react";
import { useEffect, useState } from "react";

interface V3MagnetProps {
  children: ReactNode;
  className?: string;
  strength?: number;
}

export default function V3Magnet({ children, className, strength = 7 }: V3MagnetProps) {
  const reduceMotion = useReducedMotion();
  const [coarsePointer, setCoarsePointer] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const media = window.matchMedia("(pointer: coarse)");
    const update = () => setCoarsePointer(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const disabled = Boolean(reduceMotion || coarsePointer);

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (disabled) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * strength;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * strength;
    setOffset({ x, y });
  };

  return (
    <motion.div
      className={className}
      animate={disabled ? { x: 0, y: 0 } : offset}
      transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => setOffset({ x: 0, y: 0 })}
    >
      {children}
    </motion.div>
  );
}
