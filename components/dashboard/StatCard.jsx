export default function StatCard({ image, value, label }) {
  return (
    <div className="stat-card">
      <img className="stat-card-bg" src={image} alt="" aria-hidden="true" />
      <div className="stat-card-scrim" />
      <div className="stat-card-content">
        <span className="stat-card-label">
          <span className="stat-card-dot" />
          {label}
        </span>
        <span className="stat-card-value">{value}</span>
      </div>
    </div>
  );
}
