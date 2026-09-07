const REWARDS = [
  {
    rank: 'State 1',
    title: 'E-Bike / Electric Scooter',
    amt: 'Up to ₹1 Lakh',
    copy: 'Supporting mobility, independence and the journey ahead.',
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
        <circle cx="6" cy="17" r="3" stroke="#E0A93A" strokeWidth="1.5" />
        <circle cx="18" cy="17" r="3" stroke="#E0A93A" strokeWidth="1.5" />
        <path d="M6 17l3-8h5l3 5M9 9l-1.5-3H5" stroke="#E0A93A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    rank: 'State 2',
    title: 'Laptop',
    amt: 'Up to ₹50,000',
    copy: 'Technology to support learning and future ambitions.',
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
        <rect x="4" y="5" width="16" height="10" rx="1.2" stroke="#E0A93A" strokeWidth="1.5" />
        <path d="M2 18h20" stroke="#E0A93A" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    rank: 'State 3',
    title: 'Tablet / Smartphone',
    amt: 'Up to ₹25,000',
    copy: 'Digital access to learning and educational opportunities.',
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
        <rect x="6" y="3" width="12" height="18" rx="2" stroke="#E0A93A" strokeWidth="1.5" />
        <path d="M11 18h2" stroke="#E0A93A" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    rank: 'State 4',
    title: 'Smartwatch + Wireless Earbuds',
    amt: 'Up to ₹11,000',
    copy: 'Recognition for the next stage of the journey.',
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
        <rect x="7" y="6" width="10" height="12" rx="3" stroke="#E0A93A" strokeWidth="1.5" />
        <path d="M12 9.5v3l2 1.5" stroke="#E0A93A" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    rank: 'State 5',
    title: 'Premium Wireless Headphones',
    amt: 'Up to ₹5,000',
    copy: 'A reward that carries the focus forward.',
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
        <path d="M4 14v-2a8 8 0 0116 0v2" stroke="#E0A93A" strokeWidth="1.5" strokeLinecap="round" />
        <rect x="3" y="13" width="4" height="7" rx="1.6" stroke="#E0A93A" strokeWidth="1.5" />
        <rect x="17" y="13" width="4" height="7" rx="1.6" stroke="#E0A93A" strokeWidth="1.5" />
      </svg>
    ),
  },
];

export default function Rewards() {
  return (
    <section className="section rewards" id="rewards">
      <div className="wrap">
        <div className="rewards-top reveal">
          <div className="eyebrow" style={{ justifyContent: 'center' }}>Scholarships &amp; Rewards</div>
          <div className="crore">₹1 Crore</div>
          <div className="crore-sub">
            Total scholarship &amp; rewards pool — awarded to the State rankers, because talent deserves to be recognized.
          </div>
        </div>
        <div className="reward-grid reveal">
          {REWARDS.map((r) => (
            <div className="reward-card" key={r.rank}>
              <div className="icn">{r.icon}</div>
              <div className="rank">{r.rank}</div>
              <h4>{r.title}</h4>
              <p>{r.copy}</p>
              <div className="amt">{r.amt}</div>
            </div>
          ))}
        </div>
        <div className="rewards-tag reveal">&ldquo;Big talent deserves a big opportunity.&rdquo;</div>
      </div>
    </section>
  );
}
