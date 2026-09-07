export default function Hero() {
  return (
    <section className="hero">
      <div className="wrap">
        <div className="hero-copy">
          <div className="eyebrow">Presented by News First · Future Forward</div>
          <h1>
            Your Talent.<br />
            Your Choice.<br />
            <span className="accent">Your Nava Dishe.</span>
          </h1>
          <p className="lead">
            A free, statewide talent recognition examination for Class 10, 11 and 12 students across
            Karnataka — created to identify talent, celebrate merit and connect students with
            educational opportunities.
          </p>
          <div className="hero-ctas">
            <a href="#register" className="btn btn-primary">Register Your School</a>
            <a href="#about" className="btn btn-outline">Explore Nava Dishe</a>
          </div>
          <div className="hero-stats">
            <div className="hero-stat"><div className="num">₹1 Cr</div><div className="lbl">Prizes &amp; Rewards</div></div>
            <div className="hero-stat"><div className="num">31</div><div className="lbl">Districts Reached</div></div>
            <div className="hero-stat"><div className="num">₹0</div><div className="lbl">Registration Fee</div></div>
          </div>
        </div>
        <div className="hero-art">
          <img src="/images/banner.png" alt="Two Karnataka school students in uniform, cheering" width="480" height="720" />
        </div>
      </div>
    </section>
  );
}
