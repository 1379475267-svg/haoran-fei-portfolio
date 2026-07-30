import { ArrowUpRight, Github } from "lucide-react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { profile } from "../data/profile";
import { useV3Language } from "./V3Language";

const footerEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

const footerIntroVariants: Variants = {
  hidden: {},
  visible: {
    transition: { delayChildren: 0.04, staggerChildren: 0.1 },
  },
};

const footerTitleVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
    clipPath: "inset(0 0 100% 0)",
  },
  visible: {
    opacity: 1,
    y: 0,
    clipPath: "inset(0 0 0% 0)",
    transition: { duration: 0.72, ease: footerEase },
  },
};

const footerItemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.52, ease: footerEase },
  },
};

const footerDirectoryVariants: Variants = {
  hidden: {},
  visible: {
    transition: { delayChildren: 0.04, staggerChildren: 0.08 },
  },
};

export default function V3Footer() {
  const { language, t } = useV3Language();
  const reduceMotion = Boolean(useReducedMotion());

  return (
    <footer className="v3-footer" id="contact">
      <div className="v3-footer-cta">
        <motion.div
          className="v3-footer-intro"
          initial={reduceMotion ? false : "hidden"}
          whileInView={reduceMotion ? undefined : "visible"}
          viewport={{ once: true, amount: 0.35 }}
          variants={footerIntroVariants}
        >
          <motion.p variants={footerItemVariants}>{t.footer.question}</motion.p>
          <motion.h2 variants={footerTitleVariants}>
            <span>{t.footer.title}</span>
            <span className="v3-footer-title-outline" aria-hidden="true">
              {t.footer.title}
            </span>
          </motion.h2>
          <motion.a
            className="v3-footer-primary-link"
            href={`mailto:${profile.email}`}
            variants={footerItemVariants}
          >
            {profile.email}
            <ArrowUpRight aria-hidden="true" />
          </motion.a>
        </motion.div>
        <motion.div
          className="v3-footer-directory-stage"
          initial={reduceMotion ? false : "hidden"}
          whileInView={reduceMotion ? undefined : "visible"}
          viewport={{ once: true, amount: 0.24 }}
          variants={footerDirectoryVariants}
        >
          <motion.dl className="v3-contact-directory" variants={footerDirectoryVariants}>
            <motion.div variants={footerItemVariants}>
              <dt>Email</dt>
              <dd>
                <a href={`mailto:${profile.email}`}>
                  {profile.email}
                </a>
              </dd>
            </motion.div>
            <motion.div variants={footerItemVariants}>
              <dt>QQ</dt>
              <dd>{profile.qq}</dd>
            </motion.div>
            <motion.div variants={footerItemVariants}>
              <dt>{language === "zh" ? "微信" : "WeChat"}</dt>
              <dd>{profile.wechat}<small>{t.footer.scan}</small></dd>
            </motion.div>
          </motion.dl>
          <motion.figure className="v3-wechat-qr" variants={footerItemVariants}>
            <img
              src={profile.wechatQr}
              alt={`${t.footer.qrAlt}：${profile.wechat}`}
              width={640}
              height={640}
              loading="lazy"
              decoding="async"
            />
            <figcaption>{t.footer.qrCaption}</figcaption>
          </motion.figure>
        </motion.div>
      </div>
      <div className="v3-footer-line">
        <span>© 2026 {profile.name}</span>
        <span>{t.footer.version}</span>
        <div>
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
          >
            <Github aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}
