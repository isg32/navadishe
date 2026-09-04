const REWARDS = [
  { rank: 'State 1st', icon: '🛵', title: 'E-Bike / Electric Scooter' },
  { rank: 'State 2nd', icon: '💻', title: 'Laptop' },
  { rank: 'State 3rd', icon: '📱', title: 'Tablet / Smartphone' },
  { rank: 'Also Awarded', icon: '⌚', title: 'Smartwatch + Career Counselling' },
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
          <img src="/images/rewards.jpg" alt="Students who cleared the exam, standing proudly" width="1200" height="250" />
        </div>

        <div className="rewards-grid reveal">
          {REWARDS.map((r) => (
            <div className="reward-card" key={r.rank}>
              <div className="reward-rank">{r.rank}</div>
              <div className="reward-icon">{r.icon}</div>
              <h4>{r.title}</h4>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
