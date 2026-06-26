const splineSceneUrl =
  "https://community.spline.design/file/cea96ce0-da30-46cc-bd5c-dc73a6497abd";

const splinePreviewUrl =
  "https://community-filepreview.spline.design/webp-90/cea96ce0-da30-46cc-bd5c-dc73a6497abd.webp";

export default function SplineBackground() {
  return (
    <div className="spline-background" aria-hidden="true">
      <img className="spline-background-fallback" src={splinePreviewUrl} alt="" />
      <iframe
        title="Particle Nebula Spline background"
        src={splineSceneUrl}
        className="spline-background-frame"
        loading="eager"
        tabIndex={-1}
      />
      <div className="spline-background-scrim" />
    </div>
  );
}
