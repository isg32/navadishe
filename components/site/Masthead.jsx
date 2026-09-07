'use client';

import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { href: '#about', label: 'About' },
  { href: '#examformat', label: 'The Exam' },
  { href: '#rewards', label: 'Rewards' },
  { href: '#howitworks', label: 'How It Works' },
  { href: '#schools', label: 'Schools' },
];

const BrandMark = () => (
  <svg width="30" height="30" viewBox="0 0 40 40" fill="none" aria-hidden="true">
    <circle cx="20" cy="20" r="19" stroke="#E0A93A" strokeWidth="1.4" strokeDasharray="1.4 5" fill="none" />
    <path d="M20 10 L26 24 L20 20 L14 24 Z" fill="#0F7A78" />
    <circle cx="18" cy="14" r="4" fill="#16324A" />
  </svg>
);

export default function Masthead() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header id="siteHeader" className={scrolled ? 'scrolled' : undefined}>
        <div className="navwrap">
          <a href="#top" className="brand">
            <BrandMark />
            Nava&nbsp;<span className="navadishe-tag">Dishe</span>
          </a>
          <nav className="links">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href}>{link.label}</a>
            ))}
          </nav>
          <div className="navcta">
            <a href="#register" className="btn btn-outline">Register School</a>
            <a href="#final" className="btn btn-primary">Explore</a>
            <button
              className="menu-toggle"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? <X size={24} strokeWidth={1.8} /> : <Menu size={24} strokeWidth={1.8} />}
            </button>
          </div>
        </div>
      </header>

      <div className={`mobile-nav${menuOpen ? ' open' : ''}`}>
        {NAV_LINKS.map((link) => (
          <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>{link.label}</a>
        ))}
        <a href="#register" className="btn btn-primary" onClick={() => setMenuOpen(false)}>Register Your School</a>
      </div>
    </>
  );
}
