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
            <img src="/images/01_NavaDishe_emblem_icon.png" alt="" className="foot-emblem" />
            <span>Nava Dishe</span>
            <img src="/images/02_News1st_logo.png" alt="News First" className="foot-news" />
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
