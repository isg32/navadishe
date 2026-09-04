import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { canAccess } from '@/lib/auth';

const PATH_NAV_KEY = {
  '/dashboard': 'home',
  '/dashboard/new': 'form',
  '/dashboard/registrations': 'registrations',
  '/dashboard/leads': 'leads',
  '/dashboard/users': 'users',
  '/dashboard/sync': 'sync',
};

// This is Next.js's "proxy" convention (proxy.js — the renamed successor to
// middleware.js as of Next 16). Gates everything under /dashboard except
// /dashboard/login: no valid session cookie -> redirect to the login page.
// Already logged in and hitting /dashboard/login -> redirect straight to
// the dashboard home. Also blocks page access for roles that shouldn't see
// it (e.g. a "poc" navigating straight to /dashboard/users by URL) —
// belt-and-suspenders on top of every route handler already enforcing this
// server-side too.
export async function proxy(request) {
  const { pathname } = request.nextUrl;
  const session = await getSession(request);
  const isLoginPage = pathname === '/dashboard/login';

  if (!session && !isLoginPage) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard/login';
    return NextResponse.redirect(url);
  }

  if (session && isLoginPage) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  const navKey = PATH_NAV_KEY[pathname];
  if (session && navKey && !canAccess(session.role, navKey)) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/dashboard/:path*',
};
