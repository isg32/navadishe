import './dashboard.css';

export const metadata = {
  robots: { index: false, follow: false },
};

// Shared by /dashboard/login (bare) and the (shell)-grouped pages (sidebar
// shell added by their own nested layout) — this level only owns the CSS
// and keeps the dashboard out of search results.
export default function DashboardLayout({ children }) {
  return <div className="dashboard-body">{children}</div>;
}
