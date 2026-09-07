const SUBJECTS = [
  {
    n: '01 — English',
    title: 'English',
    copy: 'Comprehension, grammar and vocabulary fundamentals.',
    icon: (
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
        <path d="M4 5h11a3 3 0 013 3v11H7a3 3 0 01-3-3V5z" stroke="#16324A" strokeWidth="1.5" />
        <path d="M8 9h6M8 12h6M8 15h4" stroke="#E0A93A" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    n: '02 — Logical Reasoning',
    title: 'Logical Reasoning',
    copy: 'Pattern recognition, deduction and analytical thinking.',
    icon: (
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
        <circle cx="6" cy="6" r="2.4" stroke="#16324A" strokeWidth="1.5" />
        <circle cx="18" cy="6" r="2.4" stroke="#16324A" strokeWidth="1.5" />
        <circle cx="12" cy="18" r="2.4" stroke="#16324A" strokeWidth="1.5" />
        <path d="M8 7.2L15 16M16 7.2L9 16" stroke="#E0A93A" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    n: '03 — General Awareness',
    title: 'General Awareness & Aptitude',
    copy: 'Current affairs, civics and quantitative aptitude.',
    icon: (
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="#16324A" strokeWidth="1.5" />
        <path d="M3 12h18M12 3c2.4 2.4 3.6 5.6 3.6 9s-1.2 6.6-3.6 9c-2.4-2.4-3.6-5.6-3.6-9s1.2-6.6 3.6-9z" stroke="#E0A93A" strokeWidth="1.3" />
      </svg>
    ),
  },
  {
    n: '04 — Mathematics',
    title: 'Mathematics Assessment',
    copy: 'Mathematics assessment — for Class 10 students only.',
    icon: (
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
        <path d="M7 17L11 7h2l4 10M9 13h6M6 4h12M6 20h12" stroke="#16324A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 7.5L11 4.5L14 7.5" stroke="#E0A93A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 16.5L19 19.5L16 22.5" stroke="#E0A93A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function Syllabus() {
  return (
    <section className="section" id="syllabus">
      <div className="wrap">
        <div className="section-head center reveal">
          <div className="eyebrow">Topics and Syllabus</div>
          <h2>Subjects Covered &amp; Syllabus</h2>
          <p>Four parts, one OMR sheet — what every student is evaluated on.</p>
        </div>
        <div className="syll-grid reveal">
          {SUBJECTS.map((s) => (
            <div className="syll-card" key={s.n}>
              <div className="n">{s.n}</div>
              <div className="icn">{s.icon}</div>
              <h4>{s.title}</h4>
              <p>{s.copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
