const CITIES = [
  'Bengaluru', 'Mysuru', 'Mangaluru', 'Hubballi-Dharwad', 'Belagavi',
  'Kalaburagi', 'Shivamogga', 'Udupi', 'Tumakuru', 'Davanagere',
];

export default function Reach() {
  return (
    <section className="section reach" id="reach">
      <div className="wrap reach-wrap">
        <div className="reveal">
          <div className="hero-art">
            <img src="/images/map.png" alt="Map of Karnataka with the Nava Dishe exam districts marked" width="480" height="720" />
          </div>
        </div>
        <div className="reveal">
          <div className="eyebrow">Karnataka-Wide Reach</div>
          <h2 style={{ fontSize: 'clamp(26px,3vw,36px)', fontWeight: 600, marginBottom: 20 }}>
            Across Karnataka. For Karnataka&rsquo;s Young Talent.
          </h2>
          <div className="district-badge">
            <span className="big">10</span>
            <span className="txt">key cities reached across the state</span>
          </div>
          <p>Reaching students across the state, with 10 key cities including:</p>
          <div className="city-grid">
            {CITIES.map((city) => (
              <span className="city-chip" key={city}><span className="pin" />{city}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
