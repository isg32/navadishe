'use client';

import { useState } from 'react';

const NAV_LINKS = [
  { href: '#about', label: 'About' },
  { href: '#eligibility', label: 'Eligibility' },
  { href: '#pattern', label: 'Exam Pattern' },
  { href: '#rewards', label: 'Rewards' },
  { href: '#reach', label: 'Reach' },
  { href: '#partners', label: 'Partners' },
  { href: '#join', label: 'How to Join' },
];

export default function Masthead() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <div className="masthead">
        <div className="masthead-top">
          <div className="wrap">
            <span>Karnataka Edition · 2026</span>
            <span className="masthead-partner">
              <img src="/images/02_News1st_logo.png" alt="News First" className="masthead-partner-logo" />
              A News First Initiative
            </span>
          </div>
        </div>
        <div className="wrap nav">
          <div className="nav-brand">
            <a href="#top" className="nav-brand-link">
              <img src="/images/01_NavaDishe_emblem_icon.png" alt="" className="brand-logo" />
              <span className="brand-word">Nava Dishe</span>
            </a>
            <span className="brand-divider" aria-hidden="true" />
            <img src="/images/02_News1st_logo.png" alt="News First" className="brand-partner-logo" />
          </div>
          <nav className="nav-links">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href}>{link.label}</a>
            ))}
          </nav>
          <div className="nav-cta">
            <a href="#register" className="btn btn-primary">Register Your School</a>
            <button
              className="burger"
              aria-label="Open menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </div>

      <div className="mobile-menu" style={{ display: menuOpen ? 'block' : 'none' }}>
        <div className="wrap mobile-menu-list">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>{link.label}</a>
          ))}
          <a href="#register" className="btn btn-primary mobile-menu-cta" onClick={() => setMenuOpen(false)}>
            Register Your School
          </a>
        </div>
      </div>
    </>
  );
}
