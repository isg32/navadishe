'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ROLE_NAV } from '@/lib/auth';
import { SessionProvider, useSession } from '@/components/dashboard/SessionContext';

const NAV_ITEMS = [
  {
    key: 'home', href: '/dashboard', label: 'Home',
    icon: <><path d="M3 9.5 10 3l7 6.5" /><path d="M5 8.5V17h10V8.5" /></>,
  },
  {
    key: 'form', href: '/dashboard/new', label: 'New Registration',
    icon: <><path d="M11.5 3H5.5A1.5 1.5 0 0 0 4 4.5v11A1.5 1.5 0 0 0 5.5 17h9a1.5 1.5 0 0 0 1.5-1.5V8.5z" /><path d="M11.5 3v4.5H16" /><path d="M10 10.5v4M8 12.5h4" /></>,
  },
  {
    key: 'registrations', href: '/dashboard/registrations', label: 'Registrations',
    icon: <><rect x="4" y="3" width="12" height="14" rx="1.3" /><path d="M7 7.5h6M7 10.5h6M7 13.5h4" /></>,
  },
  {
    key: 'leads', href: '/dashboard/leads', label: 'From Website',
    icon: <><circle cx="10" cy="10" r="7" /><path d="M3 10h14M10 3c1.8 2 2.8 4.4 2.8 7s-1 5-2.8 7c-1.8-2-2.8-4.4-2.8-7s1-5 2.8-7Z" /></>,
  },
  {
    key: 'users', href: '/dashboard/users', label: 'Users',
    icon: <><circle cx="7.5" cy="6.5" r="2.5" /><path d="M2.8 16c.6-2.6 2.4-4 4.7-4s4.1 1.4 4.7 4" /><circle cx="14.5" cy="7" r="2" /><path d="M13 16c.4-1.9 1.6-3 3.2-3" /></>,
  },
  {
    key: 'sync', href: '/dashboard/sync', label: 'Sync to Sheets',
    icon: <><path d="M16 9A6 6 0 0 0 5.6 5.6L4 7.2M4 11a6 6 0 0 0 10.4 3.4L16 12.8" /><path d="M4 4v3.5h3.5M16 16v-3.5h-3.5" /></>,
  },
];

const PAGE_TITLES = Object.fromEntries(NAV_ITEMS.map((i) => [i.href, i.label]));
PAGE_TITLES['/dashboard'] = 'Home';

function Shell({ children }) {
  const { user, loading, logout } = useSession();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading || !user) {
    return null; // middleware already redirects unauthenticated requests; this is just the brief client fetch
  }

  const allowed = ROLE_NAV[user.role] || [];

  return (
    <div className="dash-shell">
      {sidebarOpen && <div className="sidebar-scrim" onClick={() => setSidebarOpen(false)} />}

      <aside className={`dash-sidebar${sidebarOpen ? ' is-open' : ''}`}>
        <div className="sidebar-brand">
          <img src="/images/01_NavaDishe_emblem_icon.png" alt="" />
          <span>Nava Dishe</span>
        </div>

        <nav className="sidebar-nav">
          {NAV_ITEMS.filter((item) => allowed.includes(item.key)).map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={`sidebar-link${pathname === item.href ? ' is-active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                {item.icon}
              </svg>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <img src="/images/02_News1st_logo.png" alt="News First" />
          <span>presented by News First</span>
        </div>
      </aside>

      <div className="dash-main-col">
        <header className="dash-topbar">
          <button className="hamburger-btn" aria-label="Open menu" onClick={() => setSidebarOpen(true)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M3 6h18M3 12h18M3 18h18" /></svg>
          </button>
          <h1>{PAGE_TITLES[pathname] || ''}</h1>
          <div className="topbar-right">
            <span className="dash-user">
              Signed in as <strong>{user.username}</strong>
              <span className="role-pill">{user.role}</span>
            </span>
            <button className="btn btn-ghost dash-logout" onClick={logout}>Log Out</button>
          </div>
        </header>

        <main className="dash-content">{children}</main>
      </div>
    </div>
  );
}

export default function ShellLayout({ children }) {
  return (
    <SessionProvider>
      <Shell>{children}</Shell>
    </SessionProvider>
  );
}
