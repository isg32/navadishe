export default function Hero() {
  return (
    <section className="hero">
      <div className="wrap">
        <div className="hero-grid">
          <div>
            <div className="eyebrow">Presented by News First</div>
            <h1 className="hero-headline">
              <span className="l1">Nava</span><br />
              <span className="l2">Dishe</span>
            </h1>
            <div className="hero-sub">Annual Mega-Scholarship &amp; Talent Recognition Exam</div>
            <p className="hero-quote"><span>&ldquo;</span>A statewide search for Karnataka&rsquo;s brightest minds.<span>&rdquo;</span></p>
            <div className="hero-ctas">
              <a href="#register" className="btn btn-primary">Register Your School</a>
              <a href="#about" className="btn btn-ghost">Explore the Exam</a>
            </div>
          </div>
          <div className="hero-visual reveal">
            <div className="hero-photo-frame">
              <img src="/images/hero.jpg" alt="Student holding an OMR answer sheet, with Karnataka landmarks in the background" width="800" height="900" />
              <div className="hero-stamp">Free<br />to<br />Enter</div>
            </div>
          </div>
        </div>

        <div className="ticket reveal">
          <div className="ticket-item">
            <span className="ticket-num">₹1 Cr</span>
            <span className="ticket-label">Total Rewards Pool</span>
          </div>
          <div className="ticket-item">
            <span className="ticket-num">Karnataka</span>
            <span className="ticket-label">Statewide Exam</span>
          </div>
          <div className="ticket-item">
            <span className="ticket-num">10–12</span>
            <span className="ticket-label">Class Eligibility</span>
          </div>
          <div className="ticket-item">
            <span className="ticket-num">₹0</span>
            <span className="ticket-label">Entry Fee</span>
          </div>
        </div>
      </div>
    </section>
  );
}
