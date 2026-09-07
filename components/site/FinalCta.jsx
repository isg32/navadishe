const BADGES = ['Prizes Worth ₹1 Crore', 'Free to Enter', 'Open to Class 10–12', 'Across Karnataka'];

export default function FinalCta() {
  return (
    <section className="final" id="final">
      <div className="wrap">
        <div className="eyebrow">Give Every Student a Fair Shot</div>
        <h2>Your Talent. Your Choice.<br />Your Nava Dishe.</h2>
        <div className="tagline">&ldquo;It is a platform for talent, recognition, opportunity and direction.&rdquo;</div>
        <div className="badges">
          {BADGES.map((b) => (
            <span className="badge" key={b}>{b}</span>
          ))}
        </div>
        <div className="final-ctas">
          <a href="#register" className="btn btn-gold">Register Your School</a>
          <a href="#about" className="btn btn-outline-light">Explore Nava Dishe</a>
        </div>
      </div>
    </section>
  );
}
