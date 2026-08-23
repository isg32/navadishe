import Logo from './Logo.jsx';

const COLUMNS = [
  {
    title: 'Explore',
    links: [
      { label: 'About the Exam', href: '#about' },
      { label: 'Eligibility', href: '#eligibility' },
      { label: 'Exam Pattern', href: '#pattern' },
      { label: 'Rewards', href: '#rewards' },
    ],
  },
  {
    title: 'Programme',
    links: [
      { label: 'Our Reach', href: '#reach' },
      { label: 'Partners', href: '#partners' },
      { label: 'How Schools Join', href: '#join' },
    ],
  },
  {
    title: 'Partner With Us',
    links: [
      { label: 'Register Your School', href: '#register' },
      { label: 'Download Info Kit', href: '#' },
      { label: 'Contact the Bureau', href: '#' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-inverse-surface text-inverse-on-surface">
      <div className="mx-auto max-w-container px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <Logo light />
            <p className="mt-4 max-w-xs text-[14.5px] leading-[1.5] text-inverse-on-surface/70">
              Nava Dishe is an annual, free-of-cost scholarship and talent recognition exam by
              News First, open to Class 10–12 students across Karnataka.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="text-[11.5px] font-bold uppercase tracking-wider text-inverse-on-surface/50">
                {col.title}
              </p>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-[14.5px] text-inverse-on-surface/80 transition-colors hover:text-secondary-container"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-8 text-[11.5px] text-inverse-on-surface/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Nava Dishe · A News First Initiative</p>
          <p>Karnataka State · Class 10–12 · Free to Enter</p>
        </div>
      </div>
    </footer>
  );
}
