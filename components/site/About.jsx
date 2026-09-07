const PILLARS = [
  {
    title: 'Free to Enter',
    copy: 'No registration fee for any student, anywhere in Karnataka.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M12 3L2 8l10 5 10-5-10-5z" stroke="#0F7A78" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M6 11v5c0 1.5 3 3 6 3s6-1.5 6-3v-5" stroke="#0F7A78" strokeWidth="1.6" />
      </svg>
    ),
  },
  {
    title: 'Merit-Based',
    copy: 'Recognition based purely on OMR examination performance.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M9 11l2 2 4-4" stroke="#0F7A78" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="12" r="9" stroke="#0F7A78" strokeWidth="1.6" />
      </svg>
    ),
  },
  {
    title: 'Statewide Reach',
    copy: 'A Karnataka-wide initiative reaching students across all 31 districts.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="#0F7A78" strokeWidth="1.6" />
        <path d="M12 3c2.5 2.5 3.8 5.7 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.7-3.8-9s1.3-6.5 3.8-9z" stroke="#0F7A78" strokeWidth="1.4" />
        <path d="M3 12h18" stroke="#0F7A78" strokeWidth="1.4" />
      </svg>
    ),
  },
];

export default function About() {
  return (
    <section className="section" id="about">
      <div className="wrap about-grid">
        <div className="reveal">
          <div className="eyebrow">What is Nava Dishe</div>
          <h2 style={{ fontSize: 'clamp(26px,3vw,36px)', fontWeight: 600, marginBottom: 22 }}>
            A New Direction for Karnataka&rsquo;s Young Talent
          </h2>
          <div className="about-copy">
            <p>Nava Dishe is an annual, free-of-cost talent recognition examination for high-school students across all 31 districts of Karnataka.</p>
            <p>A statewide talent &amp; scholarship movement by <strong style={{ color: 'var(--navy)' }}>News First</strong>, it is built as a competitive benchmarking platform that measures critical thinking, aptitude and general awareness — while removing financial barriers to quality education.</p>
            <p className="big">&ldquo;It is more than an examination — a platform designed to benchmark talent, recognize merit and help students discover the right direction for their future.&rdquo;</p>
          </div>
        </div>
        <div className="pillar-list reveal">
          {PILLARS.map((p) => (
            <div className="pillar-row" key={p.title}>
              <div className="icn">{p.icon}</div>
              <div>
                <h4>{p.title}</h4>
                <p>{p.copy}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
