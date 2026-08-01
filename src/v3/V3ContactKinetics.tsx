import { motion, useReducedMotion, type Variants } from "framer-motion";

const contactEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

type ContactNodeId = "wechat" | "qq" | "whatsapp";

interface ContactNodeOffset {
  x: number;
  y: number;
  rotate: number;
  delay: number;
}

interface ContactNode {
  id: ContactNodeId;
  icon: string;
  offset: ContactNodeOffset;
}

const contactNodes: ContactNode[] = [
  {
    id: "wechat",
    icon: "/contact/wechat.svg",
    offset: { x: -16, y: 10, rotate: -7, delay: 0.18 },
  },
  {
    id: "qq",
    icon: "/contact/qq.svg",
    offset: { x: 14, y: -12, rotate: 6, delay: 0.28 },
  },
  {
    id: "whatsapp",
    icon: "/contact/whatsapp.svg",
    offset: { x: 12, y: 14, rotate: 8, delay: 0.38 },
  },
];

const contactStageVariants: Variants = {
  hidden: {},
  visible: {
    transition: { delayChildren: 0.04 },
  },
};

const contactCopyVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: contactEase },
  },
};

const contactTitleVariants: Variants = {
  hidden: { opacity: 0, y: 28, clipPath: "inset(0 0 100% 0)" },
  visible: {
    opacity: 1,
    y: 0,
    clipPath: "inset(0 0 0% 0)",
    transition: { duration: 0.5, ease: contactEase, delay: 0.08 },
  },
};

const contactNodeVariants: Variants = {
  hidden: (offset: ContactNodeOffset) => ({
    opacity: 0,
    x: offset.x,
    y: offset.y,
    scale: 0.72,
    rotate: offset.rotate,
  }),
  visible: (offset: ContactNodeOffset) => ({
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    rotate: 0,
    transition: {
      duration: 0.4,
      ease: contactEase,
      delay: offset.delay,
    },
  }),
};

const contactTraceVariants: Variants = {
  hidden: { opacity: 0, scaleX: 0 },
  visible: {
    opacity: 1,
    scaleX: 1,
    transition: { duration: 0.62, ease: contactEase, delay: 0.12 },
  },
};

interface V3ContactKineticsProps {
  contactTitle: string;
  question: string;
}

export default function V3ContactKinetics({
  contactTitle,
  question,
}: V3ContactKineticsProps) {
  const reduceMotion = Boolean(useReducedMotion());

  return (
    <motion.div
      className="v3-contact-kinetics"
      initial={reduceMotion ? false : "hidden"}
      whileInView={reduceMotion ? undefined : "visible"}
      viewport={{ once: true, amount: 0.32 }}
      variants={contactStageVariants}
    >
      <motion.p className="v3-contact-kinetics-question" variants={contactCopyVariants}>
        {question}
      </motion.p>
      <div className="v3-contact-kinetics-stage">
        <motion.i
          className="v3-contact-kinetics-trace"
          aria-hidden="true"
          variants={contactTraceVariants}
        />
        <motion.h2 aria-label={`${contactTitle} / Contact me`} variants={contactTitleVariants}>
          <span>CONTACT</span>
          <span>ME</span>
        </motion.h2>
        <ul className="v3-contact-brand-nodes" aria-hidden="true">
          {contactNodes.map((node) => (
            <motion.li
              key={node.id}
              className="v3-contact-brand-node"
              data-platform={node.id}
              custom={node.offset}
              initial={reduceMotion ? false : "hidden"}
              whileInView={reduceMotion ? undefined : "visible"}
              viewport={{ once: true, amount: 0.5 }}
              variants={contactNodeVariants}
            >
              <img src={node.icon} alt="" />
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
