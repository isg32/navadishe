import { Fragment } from 'react';

const Arrow = () => (
  <div className="choice-arrow">
    <svg width="26" height="16" viewBox="0 0 26 16" fill="none">
      <path d="M1 8h22M17 2l6 6-6 6" stroke="#C98F22" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
);

const STEPS = [
  { tag: 'Step One', title: 'Take the Exam', copy: 'Sit the 60-minute Nava Dishe assessment at your school.' },
  { tag: 'Step Two', title: 'Choose Your Direction', copy: 'Pick preferred universities, colleges and fields of study.' },
  { tag: 'Step Three', title: 'Get Matched', copy: 'Connect with scholarships and counselling suited to you.' },
];

export default function StudentChoice() {
  return (
    <section className="section" id="choice">
      <div className="wrap">
        <div className="choice-top reveal">
          <div className="eyebrow" style={{ justifyContent: 'center' }}>Student Choice</div>
          <h2>The Student Chooses the Target.</h2>
          <p style={{ marginTop: 14 }}>
            One OMR sheet · 60 questions · two student choices that drive the outcome. The sheet captures
            student details, school information, class and 60 answers — plus the universities and fields
            each student wants to hear from.
          </p>
        </div>
        <div className="choice-steps reveal">
          {STEPS.map((s, i) => (
            <Fragment key={s.tag}>
              {i > 0 && <Arrow />}
              <div className="choice-step">
                <div className="tag">{s.tag}</div>
                <h4>{s.title}</h4>
                <p>{s.copy}</p>
              </div>
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
