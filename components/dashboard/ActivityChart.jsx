const nf = (n) => Number(n || 0).toLocaleString('en-IN');

export default function ActivityChart({ data, valueKey = 'registrations', unitLabel = 'registrations' }) {
  const max = Math.max(1, ...data.map((d) => d[valueKey] || 0));
  const total = data.reduce((sum, d) => sum + (d[valueKey] || 0), 0);

  return (
    <div className="activity-chart">
      <div className="activity-chart-head">
        <span className="activity-chart-total">{nf(total)}</span>
        <span className="activity-chart-sub">{unitLabel} &middot; last {data.length} days</span>
      </div>
      <div className="activity-chart-bars">
        {data.map((d) => {
          const v = d[valueKey] || 0;
          const pct = Math.max(3, Math.round((v / max) * 100));
          const dt = new Date(`${d.date}T00:00:00Z`);
          const dayLabel = dt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', timeZone: 'UTC' });
          return (
            <div className="activity-bar-col" key={d.date} title={`${dayLabel}: ${nf(v)} ${unitLabel}`}>
              <div className="activity-bar" style={{ height: `${pct}%` }} />
              <span className="activity-bar-label">{dt.toLocaleDateString('en-IN', { day: '2-digit', timeZone: 'UTC' })}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
