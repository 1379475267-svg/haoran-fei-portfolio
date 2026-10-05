import { ArrowUpRight, Github } from "lucide-react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { profile } from "../data/profile";
import V3RevealTitle from "./V3RevealTitle";
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

const contactHeadingVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.68, ease: footerEase },
  },
};

const contactRuleVariants: Variants = {
  hidden: { opacity: 0, scaleX: 0 },
  visible: {
    opacity: 1,
    scaleX: 1,
    transition: { duration: 0.95, ease: footerEase, delay: 0.18 },
  },
};

const contactLinkVariants: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: footerEase, delay: 0.55 },
  },
};

const contactCodeVariants: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.94 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 160,
      damping: 22,
      mass: 0.9,
      delay,
      opacity: { duration: 0.4, ease: footerEase, delay },
    },
  }),
};

export default function V3Footer() {
  const { language, t } = useV3Language();
  const reduceMotion = Boolean(useReducedMotion());

  return (
    <footer className="v3-footer nf-footer" id="contact">
      <div className="v3-footer-cta">
        <div className="v3-footer-primary-stage">
          <motion.div
            className="journal-contact-heading"
            initial={reduceMotion ? false : "hidden"}
            whileInView={reduceMotion ? undefined : "visible"}
            viewport={{ once: true, amount: 0.45 }}
            variants={contactHeadingVariants}
          >
            <motion.span className="journal-contact-rule" aria-hidden="true" variants={contactRuleVariants} />
            <p className="journal-eyebrow">05 / {t.footer.question}</p>
            <h2><V3RevealTitle text="LET’S TALK." slow /></h2>
          </motion.div>
          {[profile.email, profile.secondaryEmail].map((email, index) => (
            <motion.a
              key={email}
              className={`v3-footer-primary-link${index > 0 ? " v3-footer-primary-link--additional" : ""}`}
              href={`mailto:${email}`}
              initial={reduceMotion ? false : "hidden"}
              whileInView={reduceMotion ? undefined : "visible"}
              viewport={{ once: true, amount: 0.5 }}
              variants={contactLinkVariants}
            >
              {index === 0 && <span>{language === "zh" ? "写封邮件" : "Write an email"}</span>}
              <strong>{email}</strong>
              <ArrowUpRight aria-hidden="true" />
            </motion.a>
          ))}
        </div>
        <motion.div
          className="v3-footer-directory-stage"
          initial={reduceMotion ? false : "hidden"}
          whileInView={reduceMotion ? undefined : "visible"}
          viewport={{ once: true, amount: 0.24 }}
          variants={footerDirectoryVariants}
          onViewportEnter={() => window.dispatchEvent(new Event("fhr-contact-code-open"))}
        >
          <motion.dl className="v3-contact-directory nf-contact-directory" variants={footerDirectoryVariants}>
            <motion.div variants={footerItemVariants}>
              <dt>QQ</dt>
              <dd>{profile.qq}</dd>
            </motion.div>
            <motion.div variants={footerItemVariants}>
              <dt>{language === "zh" ? "微信" : "WeChat"}</dt>
              <dd className="nf-contact-value">
                <p className="nf-contact-name">{profile.wechat}</p>
                <motion.figure
                  className="nf-contact-code-panel"
                  aria-label={language === "zh" ? "微信二维码" : "WeChat QR code"}
                  initial={reduceMotion ? false : "hidden"}
                  whileInView={reduceMotion ? undefined : "visible"}
                  viewport={{ once: true, amount: 0.2 }}
                  variants={contactCodeVariants}
                  custom={0.1}
                >
                    <img
                      className="nf-contact-code"
                      src={profile.wechatQr}
                      alt={`${t.footer.qrAlt}：${profile.wechat}`}
                      width={640}
                      height={640}
                      loading="lazy"
                      decoding="async"
                    />
                </motion.figure>
              </dd>
            </motion.div>
            <motion.div variants={footerItemVariants}>
              <dt>{t.footer.whatsapp}</dt>
              <dd className="nf-contact-value">
                <p className="nf-contact-name">{profile.whatsapp}</p>
                <motion.figure
                  className="nf-contact-code-panel"
                  aria-label={language === "zh" ? "WhatsApp 二维码" : "WhatsApp QR code"}
                  initial={reduceMotion ? false : "hidden"}
                  whileInView={reduceMotion ? undefined : "visible"}
                  viewport={{ once: true, amount: 0.2 }}
                  variants={contactCodeVariants}
                  custom={0.22}
                >
                    <img
                      className="nf-contact-code"
                      src={profile.whatsappQr}
                      alt={`${t.footer.whatsappQrAlt}：${profile.whatsapp}`}
                      width={560}
                      height={560}
                      loading="lazy"
                      decoding="async"
                    />
                </motion.figure>
              </dd>
            </motion.div>
          </motion.dl>
        </motion.div>
      </div>
      <div className="v3-footer-line">
        <span>© 2026 {profile.name}</span>
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
