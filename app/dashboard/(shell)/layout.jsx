'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, FilePlus2, ClipboardList, Globe, Users, RefreshCw, Menu, LogOut } from 'lucide-react';
import { ROLE_NAV } from '@/lib/auth';
import { SessionProvider, useSession } from '@/components/dashboard/SessionContext';

const NAV_ITEMS = [
  { key: 'home', href: '/dashboard', label: 'Home', Icon: Home },
  { key: 'form', href: '/dashboard/new', label: 'New Registration', Icon: FilePlus2 },
  { key: 'registrations', href: '/dashboard/registrations', label: 'Registrations', Icon: ClipboardList },
  { key: 'leads', href: '/dashboard/leads', label: 'From Website', Icon: Globe },
  { key: 'users', href: '/dashboard/users', label: 'Users', Icon: Users },
  { key: 'sync', href: '/dashboard/sync', label: 'Sync to Sheets', Icon: RefreshCw },
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
          {NAV_ITEMS.filter((item) => allowed.includes(item.key)).map(({ key, href, label, Icon }) => (
            <Link
              key={key}
              href={href}
              className={`sidebar-link${pathname === href ? ' is-active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <Icon size={19} strokeWidth={1.7} />
              <span>{label}</span>
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
            <Menu size={24} strokeWidth={1.8} />
          </button>
          <h1>{PAGE_TITLES[pathname] || ''}</h1>
          <div className="topbar-right">
            <span className="dash-user">
              Signed in as <strong>{user.username}</strong>
              <span className="role-pill">{user.role}</span>
            </span>
            <button className="btn btn-ghost dash-logout" onClick={logout}>
              <LogOut size={15} strokeWidth={2} style={{ marginRight: 6, verticalAlign: -2 }} />
              Log Out
            </button>
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
