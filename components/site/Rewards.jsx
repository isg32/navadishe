const REWARDS = [
  {
    rank: 'State 1',
    title: 'E-Bike / Electric Scooter',
    amt: 'Up to ₹1 Lakh',
    copy: 'Supporting mobility, independence and the journey ahead.',
    img: '/images/reward-ebike.png',
    alt: 'Electric scooter',
  },
  {
    rank: 'State 2',
    title: 'Laptop',
    amt: 'Up to ₹50,000',
    copy: 'Technology to support learning and future ambitions.',
    img: '/images/reward-laptop.png',
    alt: 'Laptop',
  },
  {
    rank: 'State 3',
    title: 'Tablet / Smartphone',
    amt: 'Up to ₹25,000',
    copy: 'Digital access to learning and educational opportunities.',
    img: '/images/reward-tablet.png',
    alt: 'Tablet and smartphone',
  },
  {
    rank: 'State 4',
    title: 'Smartwatch + Wireless Earbuds',
    amt: 'Up to ₹11,000',
    copy: 'Recognition for the next stage of the journey.',
    img: '/images/reward-smartwatch.png',
    alt: 'Smartwatch',
  },
  {
    rank: 'State 5',
    title: 'Premium Wireless Headphones',
    amt: 'Up to ₹5,000',
    copy: 'A reward that carries the focus forward.',
    img: '/images/reward-headphones.png',
    alt: 'Premium wireless headphones',
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
              <div className="icn"><img src={r.img} alt={r.alt} width="88" height="88" loading="lazy" /></div>
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
