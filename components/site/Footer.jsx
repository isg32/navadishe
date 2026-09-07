const LINKS = [
  { href: '#about', label: 'About' },
  { href: '#examformat', label: 'The Exam' },
  { href: '#rewards', label: 'Rewards' },
  { href: '#schools', label: 'For Schools' },
  { href: '#partner', label: 'Partner' },
];

export default function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="foot-grid">
          <a href="#top" className="foot-brand">
            <svg width="24" height="24" viewBox="0 0 40 40" fill="none" aria-hidden="true">
              <circle cx="20" cy="20" r="19" stroke="#E0A93A" strokeWidth="1.4" strokeDasharray="1.4 5" fill="none" />
              <path d="M20 10 L26 24 L20 20 L14 24 Z" fill="#12928F" />
              <circle cx="18" cy="14" r="4" fill="#fff" />
            </svg>
            Nava Dishe
          </a>
          <div className="foot-links">
            {LINKS.map((l) => (
              <a href={l.href} key={l.href}>{l.label}</a>
            ))}
          </div>
        </div>
        <div className="foot-bottom">
          <span>© 2026 Nava Dishe · Presented by News First</span>
          <span>Karnataka&rsquo;s Annual Mega Scholarship &amp; Talent Recognition Exam</span>
        </div>
      </div>
    </footer>
  );
}
