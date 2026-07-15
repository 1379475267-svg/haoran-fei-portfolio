import { Github } from "lucide-react";
import { profile } from "../data/profile";
import { useV3Language } from "./V3Language";

export default function V3Footer() {
  const { language, t } = useV3Language();

  return (
    <footer className="v3-footer" id="contact">
      <div className="v3-footer-cta">
        <div className="v3-footer-intro">
          <p>{t.footer.question}</p>
          <h2>{t.footer.title}</h2>
        </div>
        <dl className="v3-contact-directory">
          <div>
            <dt>Email</dt>
            <dd>{profile.email}</dd>
          </div>
          <div>
            <dt>QQ</dt>
            <dd>{profile.qq}</dd>
          </div>
          <div>
            <dt>{language === "zh" ? "微信" : "WeChat"}</dt>
            <dd>{profile.wechat}<small>{t.footer.scan}</small></dd>
          </div>
        </dl>
        <figure className="v3-wechat-qr">
          <img src={profile.wechatQr} alt={`${t.footer.qrAlt}：${profile.wechat}`} loading="lazy" />
          <figcaption>{t.footer.qrCaption}</figcaption>
        </figure>
      </div>
      <div className="v3-footer-line">
        <span>© 2026 {profile.name}</span>
        <span>{t.footer.version}</span>
        <div>
          <a href={profile.github} target="_blank" rel="noreferrer" aria-label="GitHub">
            <Github aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}
