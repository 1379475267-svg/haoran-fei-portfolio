export default function FlightOrbit() {
  return (
    <svg
      className="flight-orbit"
      viewBox="0 0 1200 760"
      aria-hidden="true"
      focusable="false"
      preserveAspectRatio="xMidYMid meet"
    >
      <g className="flight-orbit-grid">
        <path d="M130 142H1070M130 286H1070M130 430H1070M130 574H1070" />
        <path d="M250 80V660M490 80V660M730 80V660M970 80V660" />
      </g>

      <g className="flight-orbit-radar">
        <circle cx="825" cy="320" r="196" />
        <circle cx="825" cy="320" r="120" />
        <circle cx="825" cy="320" r="46" />
        <path d="M825 95V545M600 320H1050" />
      </g>

      <path
        className="flight-orbit-route flight-orbit-route-base"
        d="M144 548C270 518 284 364 412 386C548 410 547 192 696 214C788 228 735 408 852 430C971 452 979 272 1090 244"
      />
      <path
        className="flight-orbit-route flight-orbit-route-draw"
        pathLength="1"
        d="M144 548C270 518 284 364 412 386C548 410 547 192 696 214C788 228 735 408 852 430C971 452 979 272 1090 244"
      />
      <g className="flight-orbit-points">
        <circle cx="144" cy="548" r="5" />
        <circle cx="412" cy="386" r="5" />
        <circle cx="696" cy="214" r="5" />
        <circle cx="852" cy="430" r="5" />
        <circle cx="1090" cy="244" r="5" />
      </g>

      <g className="flight-drone" transform="translate(810 290)">
        <path d="M-48-22L-20-10M48-22L20-10M-48 22L-20 10M48 22L20 10" />
        <circle cx="-55" cy="-28" r="17" />
        <circle cx="55" cy="-28" r="17" />
        <circle cx="-55" cy="28" r="17" />
        <circle cx="55" cy="28" r="17" />
        <path className="flight-drone-body" d="M-20-13H20L28 0L20 13H-20L-28 0Z" />
        <circle className="flight-drone-core" cx="0" cy="0" r="4" />
      </g>

      <g className="flight-orbit-labels">
        <text x="142" y="579">ORIGIN</text>
        <text x="840" y="574">LIDAR / LOCAL MAP</text>
        <text x="974" y="229">PLANNED PATH</text>
      </g>
    </svg>
  );
}
