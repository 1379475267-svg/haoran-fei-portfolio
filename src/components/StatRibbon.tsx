import { ribbonItems } from "../data/profile";

export default function StatRibbon() {
  return (
    <div className="section-shell relative z-20 -mt-6">
      <div className="stat-ribbon">
        <div className="ribbon-shine" />
        {ribbonItems.map((item, index) => (
          <div key={item.label} className="ribbon-item">
            <span className="ribbon-index">0{index + 1}</span>
            <div>
              <strong>{item.label}</strong>
              <p>{item.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
