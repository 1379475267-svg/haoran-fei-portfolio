import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import type { PointerEvent, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

interface V3MagnetProps {
  children: ReactNode;
  className?: string;
  strength?: number;
}

export default function V3Magnet({ children, className, strength = 7 }: V3MagnetProps) {
  const reduceMotion = useReducedMotion();
  const [coarsePointer, setCoarsePointer] = useState(false);
  const targetRef = useRef<HTMLDivElement>(null);
  const boundsRef = useRef<DOMRect | null>(null);
  const offsetX = useMotionValue(0);
  const offsetY = useMotionValue(0);
  const springX = useSpring(offsetX, {
    stiffness: 400,
    damping: 40,
    mass: 0.18,
  });
  const springY = useSpring(offsetY, {
    stiffness: 400,
    damping: 40,
    mass: 0.18,
  });

  useEffect(() => {
    const media = window.matchMedia("(pointer: coarse)");
    const update = () => setCoarsePointer(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const disabled = Boolean(reduceMotion || coarsePointer);

  useEffect(() => {
    if (!disabled) return;
    boundsRef.current = null;
    offsetX.set(0);
    offsetY.set(0);
  }, [disabled, offsetX, offsetY]);

  useEffect(() => {
    const clearBounds = () => {
      boundsRef.current = null;
    };

    window.addEventListener("resize", clearBounds);
    window.addEventListener("scroll", clearBounds, true);
    return () => {
      window.removeEventListener("resize", clearBounds);
      window.removeEventListener("scroll", clearBounds, true);
    };
  }, []);

  const cacheBounds = (event: PointerEvent<HTMLDivElement>) => {
    if (disabled || event.pointerType !== "mouse") return;
    boundsRef.current = event.currentTarget.getBoundingClientRect();
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (disabled || event.pointerType !== "mouse") {
      offsetX.set(0);
      offsetY.set(0);
      return;
    }
    const bounds = boundsRef.current ?? event.currentTarget.getBoundingClientRect();
    boundsRef.current = bounds;
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * strength;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * strength;
    offsetX.set(x);
    offsetY.set(y);
  };

  const resetOffset = () => {
    boundsRef.current = null;
    offsetX.set(0);
    offsetY.set(0);
  };

  return (
    <motion.div
      ref={targetRef}
      className={className}
      style={{ x: springX, y: springY }}
      onPointerEnter={cacheBounds}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetOffset}
      onPointerCancel={resetOffset}
    >
      {children}
    </motion.div>
  );
}
