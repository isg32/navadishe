const STEPS = [
  { n: '01', title: 'Test Announcement', copy: 'The Nava Dishe examination is announced across News First TV, print, digital and offline mediums throughout Karnataka.' },
  { n: '02', title: 'School Registration', copy: 'The on-ground News First team registers 5,000+ schools across all 31 districts of Karnataka.' },
  { n: '03', title: 'Student Outreach', copy: 'Students are introduced to Nava Dishe through in-school outreach, print and digital mediums.' },
  { n: '04', title: 'OMR Sheets Dispatch', copy: 'Official examination materials are sent to all participating schools across Karnataka.' },
  { n: '05', when: 'September – October', title: 'Examination', copy: '5,000+ Karnataka schools host the test on their own campuses.' },
  { n: '06', when: 'April', title: 'Result Day', copy: 'After the Karnataka Board exams, students check their results on the Nava Dishe / News First website.' },
  { n: '07', title: 'Student Felicitation', copy: 'Outstanding students are honoured in the presence of the Chief Minister, Ministers, principals, students and parents.' },
  { n: '08', title: 'Winners Featured', copy: 'State rankers are featured on News First TV.' },
];

export default function HowItWorks() {
  return (
    <section className="section" id="howitworks">
      <div className="wrap">
        <div className="section-head center reveal">
          <div className="eyebrow">How Nava Dishe Works</div>
          <h2>From Examination to Opportunity</h2>
        </div>
        <div className="timeline reveal">
          <div className="timeline-track">
            <div className="timeline-spine" />
            {STEPS.map((s) => (
              <div className="t-item" key={s.n}>
                <div className="t-node">{s.n}</div>
                <div className="t-content">
                  {s.when && <span className="when">{s.when}</span>}
                  <h4>{s.title}</h4>
                  <p>{s.copy}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
