const REWARDS = [
  { rank: 'State 1', icon: '🛵', title: 'E-Bike / Electric Scooter', value: 'Up to ₹1 Lakh' },
  { rank: 'State 2', icon: '💻', title: 'Laptop', value: 'Up to ₹50,000' },
  { rank: 'State 3', icon: '📱', title: 'Tablet / Smartphone', value: 'Up to ₹25,000' },
  { rank: 'State 4', icon: '⌚', title: 'Smartwatch + Wireless Earbuds', value: 'Up to ₹11,000' },
  { rank: 'State 5', icon: '🎧', title: 'Premium Wireless Headphones', value: 'Up to ₹5,000' },
];

export default function Rewards() {
  return (
    <section id="rewards">
      <div className="wrap">
        <div className="section-head reveal">
          <div>
            <div className="eyebrow">State Rankers Win Life-Upgrade Prizes</div>
            <h2>Rewards for<br />the Toppers</h2>
          </div>
          <p>Every prize is designed to power what comes next.</p>
        </div>

        <div className="rewards-banner reveal">
          <img src="/images/rewards.jpg" alt="A classroom of school students in uniform" width="1200" height="250" />
        </div>

        <div className="rewards-grid reveal">
          {REWARDS.map((r) => (
            <div className="reward-card" key={r.rank}>
              <div className="reward-rank">{r.rank}</div>
              <div className="reward-icon">{r.icon}</div>
              <h4>{r.title}</h4>
              <div className="reward-value">{r.value}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
