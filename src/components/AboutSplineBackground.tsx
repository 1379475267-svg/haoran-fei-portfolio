import { motion, useScroll, useTransform } from "framer-motion";
import type { RefObject } from "react";

const splineSceneUrl = "https://app.spline.design/file/f8c273d9-b2bb-49de-9394-76daf008fc2c";
const splinePreviewUrl = "https://filespreview.spline.design/f8c273d9-b2bb-49de-9394-76daf008fc2c.jpg";

interface AboutSplineBackgroundProps {
  targetRef: RefObject<HTMLElement>;
}

export default function AboutSplineBackground({ targetRef }: AboutSplineBackgroundProps) {
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "10%"]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.08, 1.16, 1.05]);
  const opacity = useTransform(scrollYProgress, [0, 0.22, 0.82, 1], [0.08, 0.28, 0.2, 0.06]);
  const rotate = useTransform(scrollYProgress, [0, 1], [-1.8, 1.4]);

  return (
    <div className="about-spline-background" aria-hidden="true">
      <motion.div className="about-spline-motion" style={{ y, scale, opacity, rotate }}>
        <img className="about-spline-fallback" src={splinePreviewUrl} alt="" />
        <iframe
          title="Order Spline profile background"
          src={splineSceneUrl}
          className="about-spline-frame"
          loading="lazy"
          tabIndex={-1}
        />
      </motion.div>
      <div className="about-spline-scrim" />
    </div>
  );
}
