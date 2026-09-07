const MINI_STEPS = [
  'The school coordinates with the local News First Karnataka bureau.',
  'Nava Dishe is conducted on-campus using official OMR exam materials.',
  'Student responses are evaluated and state-level rankings are determined.',
  'Score dashboards are published on the official Nava Dishe & News First digital portal.',
];

export default function Schools() {
  return (
    <section className="section" id="schools" style={{ background: 'var(--paper)' }}>
      <div className="wrap">
        <div className="twocol-cta">
          <div className="cta-card dark reveal">
            <div className="eyebrow">For Schools</div>
            <h3>Bring Nava Dishe to Your School</h3>
            <p>A bulk-enrolment drive — not an individual sign-up. One coordinated programme brings a statewide talent-recognition opportunity directly to your students.</p>
            <div className="mini-steps">
              {MINI_STEPS.map((step, i) => (
                <div className="mini-step" key={i}>
                  <b>{String(i + 1).padStart(2, '0')}</b> {step}
                </div>
              ))}
            </div>
            <a href="#register" className="btn btn-gold">Register Your School</a>
          </div>
          <div className="cta-card teal reveal" id="partner">
            <div className="eyebrow">Partner With Nava Dishe</div>
            <h3>Be Part of Karnataka&rsquo;s Largest Student Talent Movement</h3>
            <p>Nava Dishe brings together students, schools, universities and News First on one statewide platform — print, digital and on-ground mediums across Karnataka, plus on-air features on News 1st Kannada.</p>
            <p>For universities, colleges and educational organizations, it is a direct line to high-intent, opt-in student leads and felicitation alongside Karnataka&rsquo;s Cabinet Ministers.</p>
            <a href="#register" className="btn btn-outline-light" style={{ marginTop: 8 }}>Reach the Students</a>
          </div>
        </div>
      </div>
    </section>
  );
}
