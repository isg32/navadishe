'use client';

import { useEffect, useState } from 'react';
import StatCard from '@/components/dashboard/StatCard';
import MiniTable from '@/components/dashboard/MiniTable';
import { formatDate } from '@/lib/format';

export default function HomePage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/analytics')
      .then((res) => res.json().then((body) => ({ ok: res.ok, body })))
      .then(({ ok, body }) => {
        if (cancelled) return;
        if (!ok || body.result !== 'success') throw new Error(body.error || 'Could not load analytics');
        setData(body);
      })
      .catch((err) => { if (!cancelled) setError(err.message || 'Could not load analytics.'); });
    return () => { cancelled = true; };
  }, []);

  if (error) return <div className="form-status error">{error}</div>;
  if (!data) return <p className="empty-note">Loading…</p>;

  if (data.scope === 'own') {
    return (
      <div>
        <div className="stat-grid-cards">
          <StatCard icon="registrations" tone="ink" value={data.totals.schoolRegistrations} label="Your Registrations" />
        </div>
        <div className="analytics-panel">
          <h3>Your Recent Submissions</h3>
          <MiniTable
            headers={[{ label: 'Date' }, { label: 'School' }, { label: 'District' }, { label: 'Board' }]}
            emptyText="No registrations submitted yet."
            rows={data.recentRegistrations.map((r, i) => (
              <tr key={i}>
                <td>{formatDate(r.created_at)}</td>
                <td>{r.school_name || '—'}</td>
                <td>{r.district || '—'}</td>
                <td>{r.board || '—'}</td>
              </tr>
            ))}
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="stat-grid-cards">
        <StatCard icon="registrations" tone="ink" value={data.totals.schoolRegistrations} label="School Registrations" />
        <StatCard icon="leads" tone="teal" value={data.totals.websiteLeads} label="Website Leads" />
        <StatCard icon="callback" tone="gold" value={data.totals.callbackRequests} label="Callback Requests" />
        <StatCard icon="districts" tone="rose" value={data.totals.districts} label="Districts Covered" />
      </div>

      <div className="analytics-grid">
        <div className="analytics-panel">
          <h3>Registrations by Board</h3>
          <MiniTable
            headers={[{ label: 'Board' }, { label: 'Count', num: true }]}
            emptyText="No registrations yet."
            rows={data.boardBreakdown.map((b) => (
              <tr key={b.board}><td>{b.board}</td><td className="num">{b.count}</td></tr>
            ))}
          />
        </div>
        <div className="analytics-panel">
          <h3>Registrations by District</h3>
          <MiniTable
            headers={[{ label: 'District' }, { label: 'Count', num: true }]}
            emptyText="No registrations yet."
            rows={data.districtBreakdown.map((d) => (
              <tr key={d.district}><td>{d.district}</td><td className="num">{d.count}</td></tr>
            ))}
          />
        </div>
      </div>

      <div className="analytics-section-title">Recent Activity</div>
      <div className="analytics-grid">
        <div className="analytics-panel">
          <h3>Recent Registrations</h3>
          <MiniTable
            headers={[{ label: 'Date' }, { label: 'School' }, { label: 'District' }, { label: 'Board' }]}
            emptyText="No registrations yet."
            rows={data.recentRegistrations.map((r, i) => (
              <tr key={i}>
                <td>{formatDate(r.created_at)}</td>
                <td>{r.school_name || '—'}</td>
                <td>{r.district || '—'}</td>
                <td>{r.board || '—'}</td>
              </tr>
            ))}
          />
        </div>
        <div className="analytics-panel">
          <h3>Recent Website Leads</h3>
          <MiniTable
            headers={[{ label: 'Date' }, { label: 'Name' }, { label: 'District' }, { label: 'Callback' }]}
            emptyText="No leads yet."
            rows={data.recentLeads.map((l, i) => (
              <tr key={i}>
                <td>{formatDate(l.created_at)}</td>
                <td>{l.name || '—'}</td>
                <td>{l.district || '—'}</td>
                <td>{l.request_callback
                  ? <span className="badge badge-yes">Yes</span>
                  : <span className="badge badge-no">No</span>}</td>
              </tr>
            ))}
          />
        </div>
      </div>
    </div>
  );
}
