const splineEmbedUrl = "https://my.spline.design/nexbotrobotcharacterconcept-683ef88c9ba798b61413588b4d67c4d7/";
const splinePreviewUrl = "https://filespreview.spline.design/297fb66c-aaae-4f45-8767-4bcd8c1339aa.jpg";

export default function AboutIntroSpline() {
  return (
    <div className="about-intro-spline" aria-label="Interactive NEXBOT Spline visual">
      <img className="about-intro-spline-fallback" src={splinePreviewUrl} alt="" />
      <iframe
        title="Interactive NEXBOT robot character"
        src={splineEmbedUrl}
        className="about-intro-spline-frame"
        loading="lazy"
        allow="autoplay; fullscreen"
      />
      <div className="about-intro-orbit about-intro-orbit-a" aria-hidden="true" />
      <div className="about-intro-orbit about-intro-orbit-b" aria-hidden="true" />
      <div className="about-intro-scan" aria-hidden="true" />
      <div className="about-intro-spline-scrim" />
      <div className="about-intro-spline-copy">
        <span>INTERACTIVE PROFILE / NEXBOT</span>
        <h2>Creative Systems</h2>
        <p>Move the pointer across the scene.</p>
      </div>
      <div className="about-intro-spline-meta" aria-hidden="true">
        <span>PROFILE SYSTEM / 01</span>
        <span>HAORAN FEI - ABOUT</span>
      </div>
      <span className="about-intro-corner about-intro-corner-tl" />
      <span className="about-intro-corner about-intro-corner-tr" />
      <span className="about-intro-corner about-intro-corner-bl" />
      <span className="about-intro-corner about-intro-corner-br" />
    </div>
  );
}
