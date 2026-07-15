import { Github } from "lucide-react";
import { profile } from "../data/profile";

export default function V3Footer() {
  return (
    <footer className="v3-footer" id="contact">
      <div className="v3-footer-cta">
        <div className="v3-footer-intro">
          <p>Have a question about the work?</p>
          <h2>Contact</h2>
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
            <dt>WeChat</dt>
            <dd>{profile.wechat}<small>Scan to add</small></dd>
          </div>
        </dl>
        <figure className="v3-wechat-qr">
          <img src={profile.wechatQr} alt={`WeChat QR code for ${profile.wechat}`} loading="lazy" />
          <figcaption>WeChat / 微信</figcaption>
        </figure>
      </div>
      <div className="v3-footer-line">
        <span>© 2026 {profile.name}</span>
        <span>Portfolio / version 03</span>
        <div>
          <a href={profile.github} target="_blank" rel="noreferrer" aria-label="GitHub">
            <Github aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}
