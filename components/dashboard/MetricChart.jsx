const nf = (n) => Number(n || 0).toLocaleString('en-IN');

// Generic bar chart for a small set of { label, value } pairs — used by
// the Summary page's paginated metrics panel (Strength by Class,
// Registrations by Board, Registrations by District).
export default function MetricChart({ data, unitLabel = '' }) {
  if (!data.length) return <p className="empty-note">No data yet.</p>;

  const max = Math.max(1, ...data.map((d) => d.value || 0));
  const total = data.reduce((sum, d) => sum + (d.value || 0), 0);

  return (
    <div className="metric-chart">
      <div className="metric-chart-sub">{nf(total)} {unitLabel} total</div>
      <div className="metric-chart-bars">
        {data.map((d) => {
          const v = d.value || 0;
          const pct = Math.max(3, Math.round((v / max) * 100));
          return (
            <div className="metric-bar-col" key={d.label} title={`${d.label}: ${nf(v)}`}>
              <div className="metric-bar" style={{ height: `${pct}%` }} />
              <span className="metric-bar-label">{d.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
