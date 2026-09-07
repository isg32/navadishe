const CATEGORIES = [
  {
    label: 'Choice 1 · 16 Partner Universities & Colleges',
    names: ['Galgotias', 'PSIT', 'GLA', 'Chandigarh', 'Graphic Era', 'GNIOT', 'Mangalayatan', 'Invertis', 'Chitkara', 'Dronacharya', 'Doon Defence Dreamers', '& more'],
  },
  {
    label: 'Choice 2 · Courses & Fields',
    names: ['Engineering', 'Management', 'Pharmacy', 'Law', 'Architecture & Planning', 'Agriculture', 'Graduation (Science / Commerce / Humanities & Arts)', 'Defence', 'Civil Services'],
  },
];

export default function Partners() {
  return (
    <section id="partners">
      <div className="wrap">
        <div className="section-head reveal">
          <div>
            <div className="eyebrow">One OMR Sheet · Two Student Choices</div>
            <h2>The Student<br />Picks the Target</h2>
          </div>
          <p>Beyond 60 answers, the sheet captures two choices that drive the outcome — the universities a student wants scholarships from, and the fields that fit their future.</p>
        </div>

        <div className="partners-wrap reveal">
          <div className="partner-photo">
            <img src="/images/partners.jpg" alt="School students walking to class with backpacks" width="700" height="520" />
          </div>
          <div className="partner-cats">
            {CATEGORIES.map((cat) => (
              <div className="partner-cat" key={cat.label}>
                <div className="partner-cat-label">{cat.label}</div>
                <div className="partner-names">
                  {cat.names.map((name) => <span key={name}>{name}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
