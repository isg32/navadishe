const STEPS = [
  { src: '/images/step1.jpg', alt: 'School coordinating with News First bureau', tag: 'Step 01', title: 'Partner School Connects', copy: 'School coordinates with its local News First bureau.' },
  { src: '/images/step2.jpg', alt: 'Students taking the exam on campus', tag: 'Step 02', title: 'On-Campus Exam Day', copy: 'Nava Dishe is conducted at the school using OMR sheets.' },
  { src: '/images/step3.jpg', alt: 'Papers being evaluated and ranked', tag: 'Step 03', title: 'Evaluation & Ranking', copy: 'Papers are graded; state-level ranks are determined.' },
  { src: '/images/step4.jpg', alt: 'Online results dashboard', tag: 'Step 04', title: 'Online Results Dashboard', copy: 'Score dashboards are published on the official Nava Dishe portal.' },
];

export default function HowToJoin() {
  return (
    <section id="join" className="section-alt">
      <div className="wrap">
        <div className="section-head reveal">
          <div>
            <div className="eyebrow">A Bulk-Enrolment Drive, Not an Individual Sign-Up</div>
            <h2>How Schools<br />Join</h2>
          </div>
          <p>Designed to reach hundreds of thousands of students — together.</p>
        </div>

        <div className="steps-grid reveal">
          {STEPS.map((s) => (
            <div className="step" key={s.tag}>
              <img className="step-photo" src={s.src} alt={s.alt} width="500" height="360" />
              <div className="step-tag">{s.tag}</div>
              <h4>{s.title}</h4>
              <p>{s.copy}</p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 48, textAlign: 'center' }} className="reveal">
          <a href="#register" className="btn btn-primary">Register Your School Today</a>
        </div>
      </div>
    </section>
  );
}
