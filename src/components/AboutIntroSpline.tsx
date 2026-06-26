const splineSceneUrl = "https://app.spline.design/file/1fcc3fe6-6538-40d6-9b06-f554da7873bb";
const splinePreviewUrl = "https://filespreview.spline.design/1fcc3fe6-6538-40d6-9b06-f554da7873bb.jpg";

export default function AboutIntroSpline() {
  return (
    <div className="about-intro-spline" aria-label="Profile Spline visual">
      <img className="about-intro-spline-fallback" src={splinePreviewUrl} alt="" />
      <iframe
        title="Haoran profile Spline visual"
        src={splineSceneUrl}
        className="about-intro-spline-frame"
        loading="lazy"
        tabIndex={-1}
      />
      <div className="about-intro-spline-scrim" />
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
