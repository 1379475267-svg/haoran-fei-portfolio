const splinePreviewUrl = "https://filespreview.spline.design/297fb66c-aaae-4f45-8767-4bcd8c1339aa.jpg";

export default function AboutIntroSpline() {
  return (
    <div className="about-intro-spline" aria-label="Profile Spline visual">
      <img className="about-intro-spline-fallback" src={splinePreviewUrl} alt="" />
      <div className="about-intro-orbit about-intro-orbit-a" aria-hidden="true" />
      <div className="about-intro-orbit about-intro-orbit-b" aria-hidden="true" />
      <div className="about-intro-scan" aria-hidden="true" />
      <div className="about-intro-spline-scrim" />
      <div className="about-intro-spline-copy">
        <span>PROFILE FIELD / INTRO</span>
        <h2>Creative Systems in Motion</h2>
        <p>Engineering practice, music learning and visual experiments shaped into one connected direction.</p>
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
