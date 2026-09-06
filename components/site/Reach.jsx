const CITIES = ['Belagavi', 'Hubballi-Dharwad', 'Kalaburagi', 'Shivamogga', 'Udupi', 'Mangaluru', 'Mysuru', 'Bengaluru'];

export default function Reach() {
  return (
    <section id="reach" className="section-alt">
      <div className="wrap">
        <div className="section-head reveal">
          <div>
            <div className="eyebrow">News First&rsquo;s Home State</div>
            <h2>Across<br />Karnataka</h2>
          </div>
          <p>A focused regional reach — touching hundreds of thousands of students.</p>
        </div>

        <div className="reach-grid reveal">
          <div className="city-list">
            {CITIES.map((city) => (
              <div className="city-item" key={city}><span className="pin">●</span>{city}</div>
            ))}
          </div>
          <div className="reach-photo">
            <img src="/images/reach.jpg" alt="Map of Karnataka with Nava Dishe exam districts marked" width="900" height="520" />
          </div>
        </div>
      </div>
    </section>
  );
}
