import { Github } from "lucide-react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { profile } from "../data/profile";
import V3BrandLogo from "./V3BrandLogo";
import V3ChapterStrike from "./V3ChapterStrike";
import V3ContactKinetics from "./V3ContactKinetics";
import { useV3Language } from "./V3Language";

const footerEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

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

const footerClosureVariants: Variants = {
  hidden: {},
  visible: {
    transition: { delayChildren: 0.08, staggerChildren: 0.08 },
  },
};

const footerClosureLineVariants: Variants = {
  hidden: { opacity: 0, scaleX: 0 },
  visible: {
    opacity: 1,
    scaleX: 1,
    transition: { duration: 0.72, ease: footerEase },
  },
};

const footerClosureMarkVariants: Variants = {
  hidden: { opacity: 0, scale: 0.84 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.56, ease: footerEase },
  },
};

export default function V3Footer() {
  const { language, t } = useV3Language();
  const reduceMotion = Boolean(useReducedMotion());

  return (
    <footer className="v3-footer" id="contact">
      <V3ChapterStrike tone="dark" />
      <motion.div
        className="v3-footer-closure"
        aria-hidden="true"
        initial={reduceMotion ? false : "hidden"}
        whileInView={reduceMotion ? undefined : "visible"}
        viewport={{ once: true, amount: 0.2 }}
        variants={footerClosureVariants}
      >
        <motion.i className="v3-footer-closure-line is-left" variants={footerClosureLineVariants} />
        <motion.span className="v3-footer-closure-mark" variants={footerClosureMarkVariants}>
          <V3BrandLogo decorative />
        </motion.span>
        <motion.i className="v3-footer-closure-line is-right" variants={footerClosureLineVariants} />
      </motion.div>
      <div className="v3-footer-cta">
        <V3ContactKinetics
          contactTitle={t.footer.title}
          question={t.footer.question}
        />
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
            <motion.div variants={footerItemVariants}>
              <dt>{t.footer.whatsapp}</dt>
              <dd>{profile.whatsapp}<small>{t.footer.scan}</small></dd>
            </motion.div>
          </motion.dl>
          <motion.div className="v3-contact-qr-grid" variants={footerItemVariants}>
            <figure className="v3-wechat-qr">
              <img
                src={profile.wechatQr}
                alt={`${t.footer.qrAlt}：${profile.wechat}`}
                width={640}
                height={640}
                loading="lazy"
                decoding="async"
              />
              <figcaption>{t.footer.qrCaption}</figcaption>
            </figure>
            <figure className="v3-whatsapp-qr">
              <img
                src={profile.whatsappQr}
                alt={`${t.footer.whatsappQrAlt}：${profile.whatsapp}`}
                width={560}
                height={560}
                loading="lazy"
                decoding="async"
              />
              <figcaption>{t.footer.whatsappQrCaption}</figcaption>
            </figure>
          </motion.div>
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
