import type { ProjectCoverType } from "../data/profile";

interface ProjectCoverProps {
  type: ProjectCoverType;
  featured?: boolean;
  image?: string;
  title?: string;
}

function GameCover() {
  return (
    <div className="cover-scene game-cover">
      <div className="game-sidebar">
        <span />
        <span />
        <span />
      </div>
      <div className="game-library">
        {["8.9", "9.4", "8.6", "9.1"].map((score, index) => (
          <div key={score} className={`game-tile game-tile-${index + 1}`}>
            <i />
            <b>{score}</b>
          </div>
        ))}
      </div>
      <div className="game-rating">
        <span>RECENTLY PLAYED</span>
        <div><i /><i /><i /><i /><i /></div>
      </div>
    </div>
  );
}

function MusicCover() {
  return (
    <div className="cover-scene music-cover">
      <div className="music-staff">
        {Array.from({ length: 5 }).map((_, index) => <i key={index} />)}
        <b className="note note-one">N1</b>
        <b className="note note-two">N2</b>
        <b className="note note-three">N3</b>
      </div>
      <div className="fretboard">
        {Array.from({ length: 6 }).map((_, index) => <i key={index} />)}
        <span className="fret-dot fret-a" />
        <span className="fret-dot fret-b" />
        <span className="fret-dot fret-c" />
      </div>
    </div>
  );
}

function SaturnCover() {
  return (
    <div className="cover-scene saturn-cover">
      <div className="saturn-planet" />
      <div className="saturn-ring ring-a" />
      <div className="saturn-ring ring-b" />
      {Array.from({ length: 12 }).map((_, index) => (
        <i
          key={index}
          style={{
            left: `${8 + ((index * 29) % 84)}%`,
            top: `${10 + ((index * 47) % 78)}%`,
          }}
        />
      ))}
    </div>
  );
}

function EmbeddedCover() {
  return (
    <div className="cover-scene embedded-cover">
      <div className="chip">
        <span>STM32</span>
      </div>
      <div className="circuit-line circuit-a" />
      <div className="circuit-line circuit-b" />
      <div className="circuit-line circuit-c" />
      <div className="sensor-panel">
        <span>SENSOR / MPU6050</span>
        <div className="sensor-wave">
          {Array.from({ length: 12 }).map((_, index) => (
            <i key={index} style={{ height: `${20 + ((index * 23) % 68)}%` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

function DroneCover() {
  const mapPoints = [
    [12, 24], [22, 18], [31, 32], [42, 20], [54, 37], [66, 24],
    [76, 41], [86, 29], [18, 58], [33, 68], [48, 55], [61, 72],
    [74, 61], [88, 76], [25, 84], [48, 86],
  ];

  return (
    <div className="cover-scene drone-cover">
      <svg className="drone-route-map" viewBox="0 0 100 100" aria-hidden="true">
        <path className="drone-route-line" d="M10 82 C22 70 25 48 41 55 S61 74 70 50 S78 24 92 18" />
        <circle cx="10" cy="82" r="2.5" />
        <circle cx="41" cy="55" r="2.5" />
        <circle cx="70" cy="50" r="2.5" />
        <circle cx="92" cy="18" r="3.2" />
      </svg>
      {mapPoints.map(([x, y], index) => (
        <i key={index} className="drone-map-point" style={{ left: `${x}%`, top: `${y}%` }} />
      ))}
      <div className="drone-glyph" aria-hidden="true">
        <span className="drone-arm drone-arm-a" />
        <span className="drone-arm drone-arm-b" />
        <i className="drone-rotor rotor-a" />
        <i className="drone-rotor rotor-b" />
        <i className="drone-rotor rotor-c" />
        <i className="drone-rotor rotor-d" />
        <b />
      </div>
    </div>
  );
}

function AiCover() {
  return (
    <div className="cover-scene ai-cover">
      <div className="ai-feed">
        <div className="recognition-box">
          <span>PERSON / 98%</span>
        </div>
      </div>
      <div className="ai-metrics">
        <span>MODEL STATUS</span>
        <strong>YOLOv7</strong>
        <div><i style={{ width: "82%" }} /></div>
        <div><i style={{ width: "64%" }} /></div>
        <div><i style={{ width: "74%" }} /></div>
      </div>
    </div>
  );
}

function CosmosCover() {
  const nodes = [
    [18, 28], [34, 18], [52, 34], [72, 20], [82, 46], [64, 68], [40, 72], [22, 58],
  ];
  return (
    <div className="cover-scene cosmos-cover">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <path d="M18 28 L34 18 L52 34 L72 20 L82 46 L64 68 L40 72 L22 58 Z" />
        <path d="M18 28 L52 34 L64 68 M34 18 L40 72 M72 20 L22 58" />
      </svg>
      {nodes.map(([x, y], index) => (
        <i key={index} style={{ left: `${x}%`, top: `${y}%` }} />
      ))}
      <div className="cosmos-core">N</div>
    </div>
  );
}

export default function ProjectCover({ type, featured = false, image, title }: ProjectCoverProps) {
  const scenes = {
    drone: <DroneCover />,
    game: <GameCover />,
    music: <MusicCover />,
    saturn: <SaturnCover />,
    embedded: <EmbeddedCover />,
    ai: <AiCover />,
    cosmos: <CosmosCover />,
  };

  return (
    <div className={`project-visual project-visual-${type} ${featured ? "is-featured" : ""} ${image ? "has-cover-image" : ""}`}>
      {image ? (
        <>
          <img
            className="project-cover-image"
            src={image}
            alt={`${title ?? type} preview`}
            loading="lazy"
            onError={(event) => {
              event.currentTarget.style.display = "none";
              event.currentTarget.parentElement?.classList.add("is-cover-image-missing");
            }}
          />
          <div className="project-cover-scrim" />
        </>
      ) : null}
      <div className="cover-grid" />
      <span className="project-cover-label">
        {type === "drone" ? "FLIGHT SYSTEM / PROJECT" : `${type.toUpperCase()} / PROJECT`}
      </span>
      <div className="project-cover-fallback">{scenes[type]}</div>
      {type === "drone" ? (
        <div className="drone-flight-overlay" aria-hidden="true">
          <span className="drone-flight-status"><i /> LIO ONLINE</span>
          <div>
            <span>LOCALIZATION</span>
            <strong>Faster-LIO</strong>
          </div>
          <div>
            <span>PLANNING</span>
            <strong>Diff-Planner</strong>
          </div>
        </div>
      ) : null}
    </div>
  );
}
