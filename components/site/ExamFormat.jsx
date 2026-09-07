const STATS = [
  { val: '60', cap: 'Minutes total\nduration' },
  { val: '60', cap: 'Multiple-choice\nquestions' },
  { val: '240', cap: 'Marks\ntotal score' },
  { val: 'No', cap: 'Negative\nmarking' },
  { val: 'OMR', cap: 'Familiar\nexam format' },
];

export default function ExamFormat() {
  return (
    <section className="section examformat" id="examformat">
      <div className="wrap">
        <div className="section-head center reveal">
          <div className="eyebrow">The Exam Format</div>
          <h2>Competitive Exam Experience. Built for Every Student.</h2>
          <p>Nava Dishe is conducted offline on participating school campuses through an OMR-based examination format.</p>
        </div>
        <div className="stat-grid reveal">
          {STATS.map((s, i) => (
            <div className="stat-cell" key={i}>
              <div className="val">{s.val}</div>
              <div className="cap">
                {s.cap.split('\n').map((line, j) => (
                  <span key={j}>{line}{j === 0 ? <br /> : null}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
