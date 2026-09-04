export default function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="foot-top">
          <div className="foot-brand">
            <a href="#top" className="nav-brand-link">
              <img src="/images/01_NavaDishe_emblem_icon.png" alt="" className="brand-logo" />
              <span className="brand-word brand-word--footer">Nava Dishe</span>
            </a>
            <p>Nava Dishe is an annual, free-of-cost scholarship and talent recognition exam by News First, open to Class 10–12 students across Karnataka.</p>
            <img src="/images/02_News1st_logo.png" alt="News First" className="foot-partner-logo" />
          </div>
          <div className="foot-col">
            <h5>Explore</h5>
            <a href="#about">About the Exam</a>
            <a href="#eligibility">Eligibility</a>
            <a href="#pattern">Exam Pattern</a>
            <a href="#rewards">Rewards</a>
          </div>
          <div className="foot-col">
            <h5>Programme</h5>
            <a href="#reach">Our Reach</a>
            <a href="#partners">Partners</a>
            <a href="#join">How Schools Join</a>
          </div>
          <div className="foot-col">
            <h5>Partner With Us</h5>
            <a href="#register">Register Your School</a>
            <a href="#">Download Info Kit</a>
            <a href="#">Contact the Bureau</a>
          </div>
        </div>
        <div className="foot-bottom">
          <span>© 2026 Nava Dishe · A News First Initiative</span>
          <span>Karnataka State · Class 10–12 · Free to Enter</span>
        </div>
      </div>
    </footer>
  );
}
