import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import Logo from './Logo.jsx';
import Button from './ui/Button.jsx';

const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Eligibility', href: '#eligibility' },
  { label: 'Exam Pattern', href: '#pattern' },
  { label: 'Rewards', href: '#rewards' },
  { label: 'Reach', href: '#reach' },
  { label: 'Partners', href: '#partners' },
  { label: 'How to Join', href: '#join' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <header id="top" className="sticky top-0 z-50 bg-surface">
      <div className="hidden min-[981px]:block border-b border-outline-variant/70 bg-surface-container-low">
        <div className="mx-auto flex max-w-container items-center justify-between px-6 py-1.5 text-[11px] uppercase tracking-wide text-on-surface-variant">
          <span>Karnataka Edition · 2026</span>
          <span>A News First Initiative</span>
        </div>
      </div>

      <div
        className={`transition-shadow duration-200 ${
          scrolled ? 'shadow-[0_1px_0_0_#D9CBA3]' : ''
        }`}
      >
        <nav
          aria-label="Primary"
          className="mx-auto flex max-w-container items-center justify-between px-6 py-4"
        >
          <Logo />

          <ul className="hidden min-[981px]:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-[12.5px] font-bold uppercase tracking-wide text-on-surface-variant transition-colors hover:text-primary-container"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="hidden min-[981px]:block">
            <Button href="#register" variant="primary">
              Register Your School
            </Button>
          </div>

          <button
            type="button"
            className="min-[981px]:hidden flex h-11 w-11 items-center justify-center rounded text-on-surface"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobileMenu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>
      </div>

      {menuOpen && (
        <div
          id="mobileMenu"
          className="min-[981px]:hidden absolute inset-x-0 top-full bg-surface shadow-level3"
        >
          <ul className="flex flex-col divide-y divide-outline-variant px-6">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex min-h-[44px] items-center text-[13px] font-bold uppercase tracking-wide text-on-surface"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="px-6 pb-6 pt-4">
            <Button href="#register" variant="primary" className="w-full" onClick={() => setMenuOpen(false)}>
              Register Your School
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
