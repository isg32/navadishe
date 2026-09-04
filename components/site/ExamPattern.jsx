export default function ExamPattern() {
  return (
    <section id="pattern">
      <div className="wrap">
        <div className="section-head reveal">
          <div>
            <div className="eyebrow">The Exam at a Glance</div>
            <h2>Familiar Format,<br />Real Stakes</h2>
          </div>
          <p>Offline · OMR-based · conducted right on school campuses.</p>
        </div>

        <div className="glance-wrap">
          <div className="reveal">
            <div className="stat-grid">
              <div className="stat-cell">
                <div className="num">40</div>
                <div className="lbl">Minutes</div>
              </div>
              <div className="stat-cell">
                <div className="num">40</div>
                <div className="lbl">MCQs</div>
              </div>
              <div className="stat-cell">
                <div className="num">80</div>
                <div className="lbl">Total Marks</div>
              </div>
              <div className="stat-cell accent">
                <div className="num">0</div>
                <div className="lbl">Negative Marking</div>
              </div>
            </div>
            <div className="glance-note">Offline &nbsp;·&nbsp; OMR-Based &nbsp;·&nbsp; On School Campuses</div>
          </div>
          <div className="reveal">
            <p className="glance-side">&quot;A familiar OMR-based experience, designed to mirror real competitive exams.&quot;</p>
          </div>
        </div>
      </div>
    </section>
  );
}
