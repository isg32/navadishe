export default function Eligibility() {
  return (
    <section id="eligibility" className="section-alt">
      <div className="wrap">
        <div className="section-head reveal">
          <div>
            <div className="eyebrow">Who Can Participate</div>
            <h2>Open Doors,<br />Zero Fees</h2>
          </div>
          <p>Open to all high-school and higher-secondary students, regardless of board.</p>
        </div>

        <div className="elig-banner reveal">
          <img src="/images/eligibility.jpg" alt="Three Karnataka students carrying books, ready for the exam" width="1200" height="230" />
        </div>

        <div className="elig-grid reveal">
          <div className="elig-card">
            <div className="elig-tag">Category 1</div>
            <div className="elig-num">10</div>
            <div className="elig-desc">Class 10 Students</div>
          </div>
          <div className="elig-card">
            <div className="elig-tag">Category 2</div>
            <div className="elig-num">11/12</div>
            <div className="elig-desc">Class 11 &amp; 12 Students</div>
          </div>
        </div>

        <div className="boards-row reveal">
          <span>CBSE</span><span className="sep">/</span><span>ICSE</span><span className="sep">/</span><span>State Boards</span>
        </div>
      </div>
    </section>
  );
}
