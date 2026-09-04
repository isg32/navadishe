const ICONS = {
  registrations: <><path d="M6 3h6l4 4v10a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" /><path d="M12 3v4h4" /></>,
  leads: <><circle cx="10" cy="10" r="7" /><path d="M3 10h14M10 3c1.8 2 2.8 4.4 2.8 7s-1 5-2.8 7c-1.8-2-2.8-4.4-2.8-7s1-5 2.8-7Z" /></>,
  callback: <path d="M4 4h6l1.6 4-2 1.4a10 10 0 0 0 4 4l1.4-2 4 1.6v3a1 1 0 0 1-1 1C10 17 3 10 3 5a1 1 0 0 1 1-1Z" />,
  districts: <><path d="M10 17s6-5.3 6-9.5A6 6 0 0 0 4 7.5C4 11.7 10 17 10 17Z" /><circle cx="10" cy="7.5" r="2" /></>,
};

export default function StatCard({ icon, tone, value, label }) {
  return (
    <div className="stat-card">
      <div className={`stat-card-icon ${tone}`}>
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          {ICONS[icon]}
        </svg>
      </div>
      <div className="stat-card-value">{value}</div>
      <div className="stat-card-label">{label}</div>
    </div>
  );
}
