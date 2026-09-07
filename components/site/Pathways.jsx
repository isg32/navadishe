const UNIVERSITIES = [
  'Galgotias', 'PSIT', 'GLA', 'Chandigarh', 'Graphic Era', 'GNIOT',
  'Mangalayatan', 'Invertis', 'Chitkara', 'Dronacharya', 'Doon Defence Dreamers',
];

const FIELDS = [
  'Engineering', 'Management', 'Pharmacy', 'Law', 'Architecture & Planning',
  'Agriculture', 'Science', 'Commerce', 'Humanities & Arts', 'Defence', 'Civil Services',
];

export default function Pathways() {
  return (
    <section className="section" id="pathways" style={{ background: 'var(--paper)' }}>
      <div className="wrap split-two">
        <div className="chip-panel reveal">
          <div className="eyebrow">Choice 1 · Universities &amp; Colleges</div>
          <h3>Pick the Institutions You Want Scholarships From</h3>
          <div className="sub">16 partner institutes on one page — tick as many as you like:</div>
          <div className="chips">
            {UNIVERSITIES.map((u) => (
              <span className="chip teal" key={u}>{u}</span>
            ))}
            <span className="chip">+ more</span>
          </div>
        </div>
        <div className="chip-panel reveal">
          <div className="eyebrow">Choice 2 · Courses &amp; Fields</div>
          <h3>Choose the Direction That Fits Your Future</h3>
          <div className="sub">Indicate the fields you&rsquo;re interested in for relevant counselling.</div>
          <div className="fields-grid">
            {FIELDS.map((f) => (
              <div className="field-chip" key={f}><span className="dot" />{f}</div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
