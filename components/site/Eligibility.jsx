const CLASSES = [
  { num: '10', lbl: 'Class Ten' },
  { num: '11', lbl: 'Class Eleven' },
  { num: '12', lbl: 'Class Twelve' },
];

export default function Eligibility() {
  return (
    <section className="section elig" id="eligibility">
      <div className="wrap">
        <div className="section-head center reveal">
          <div className="eyebrow">Who Can Participate</div>
          <h2>If You&rsquo;re in Class 10, 11 or 12 — Nava Dishe Is For You</h2>
          <p>Open to students across Karnataka, studying under CBSE, ICSE or the Karnataka State Board.</p>
        </div>
        <div className="elig-grid reveal">
          {CLASSES.map((c) => (
            <div className="class-card" key={c.num}>
              <div className="num">{c.num}</div>
              <div className="lbl">{c.lbl}</div>
            </div>
          ))}
        </div>
        <div className="board-row reveal">
          <span className="board-chip">CBSE</span>
          <span className="board-chip">ICSE</span>
          <span className="board-chip">Karnataka State Board</span>
        </div>
        <div className="fee-banner reveal">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="#C98F22" strokeWidth="1.6" />
            <path d="M8 12h8M8 9h5.5M9 15c0 1.4 1.3 2 3 2s3-.7 3-2" stroke="#C98F22" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          <strong>Zero Registration Fees</strong>
        </div>
      </div>
    </section>
  );
}
