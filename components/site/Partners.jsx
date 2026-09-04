const CATEGORIES = [
  { label: 'Civil Services', names: ['Drishti IAS'] },
  { label: 'Defence', names: ['Centurion Defence Academy', 'Dreamers'] },
  { label: 'Coaching & Technology', names: ['PhysicsWallah', 'Saffalta', 'Scholars Den'] },
  { label: 'University Partners', names: ['Galgotias University', 'Chandigarh University', 'GLA University', 'Graphic Era University'] },
];

export default function Partners() {
  return (
    <section id="partners">
      <div className="wrap">
        <div className="section-head reveal">
          <div>
            <div className="eyebrow">Building the Bridge from Exam to Career</div>
            <h2>An Ecosystem<br />of Partners</h2>
          </div>
          <p>Where a single test opens many doors.</p>
        </div>

        <div className="partners-wrap reveal">
          <div className="partner-photo">
            <img src="/images/partners.jpg" alt="Students representing different career paths — civil services, defence, and higher education" width="700" height="520" />
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
