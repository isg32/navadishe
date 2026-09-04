const PILLARS = [
  {
    src: '/images/pillar-english.jpg',
    alt: 'Student practicing English comprehension',
    idx: '01 / English',
    title: 'English',
    copy: 'Comprehension, grammar and vocabulary fundamentals.',
  },
  {
    src: '/images/pillar-reasoning.jpg',
    alt: 'Student solving a logical reasoning puzzle',
    idx: '02 / Reasoning',
    title: 'Logical Reasoning',
    copy: 'Pattern recognition, deduction and analytical thinking.',
  },
  {
    src: '/images/pillar-awareness.jpg',
    alt: 'Student reviewing current affairs and aptitude material',
    idx: '03 / Awareness',
    title: 'General Awareness & Aptitude',
    copy: 'Current affairs, civics, and quantitative aptitude.',
  },
];

export default function Pillars() {
  return (
    <section className="section-alt">
      <div className="wrap">
        <div className="section-head reveal">
          <div>
            <div className="eyebrow">What Every Student Is Evaluated On</div>
            <h2>Three Pillars<br />of the Test</h2>
          </div>
          <p>A statewide benchmark of competitive readiness.</p>
        </div>

        <div className="pillars-grid reveal">
          {PILLARS.map((p) => (
            <div className="pillar" key={p.idx}>
              <img className="pillar-photo" src={p.src} alt={p.alt} width="500" height="280" />
              <div className="pillar-idx">{p.idx}</div>
              <h3>{p.title}</h3>
              <p>{p.copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
