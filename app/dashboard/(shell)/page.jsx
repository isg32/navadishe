'use client';

import { useEffect, useState } from 'react';
import StatCard from '@/components/dashboard/StatCard';
import MiniTable from '@/components/dashboard/MiniTable';
import { formatDate } from '@/lib/format';

const nf = (n) => Number(n || 0).toLocaleString('en-IN');

function ClassTable({ cls }) {
  const total = (cls.c1_9 || 0) + (cls.c10 || 0) + (cls.c11 || 0) + (cls.c12 || 0);
  return (
    <table className="mini-table">
      <thead>
        <tr><th>Class</th><th className="num">Students</th></tr>
      </thead>
      <tbody>
        <tr><td>Class 1st – 9th</td><td className="num">{nf(cls.c1_9)}</td></tr>
        <tr><td>Class 10th</td><td className="num">{nf(cls.c10)}</td></tr>
        <tr><td>Class 11th</td><td className="num">{nf(cls.c11)}</td></tr>
        <tr><td>Class 12th</td><td className="num">{nf(cls.c12)}</td></tr>
        <tr className="mini-table-total"><td>Total strength</td><td className="num">{nf(total)}</td></tr>
      </tbody>
    </table>
  );
}

function TodayTable({ today }) {
  return (
    <table className="mini-table">
      <thead>
        <tr><th>Today</th><th className="num">Count</th></tr>
      </thead>
      <tbody>
        <tr><td>Schools onboarded</td><td className="num">{nf(today.registrations)}</td></tr>
        <tr><td>Total strength added</td><td className="num">{nf(today.strength)}</td></tr>
        <tr><td>Students participated</td><td className="num">{nf(today.participated)}</td></tr>
      </tbody>
    </table>
  );
}

export default function SummaryPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/analytics')
      .then((res) => res.json().then((body) => ({ ok: res.ok, body })))
      .then(({ ok, body }) => {
        if (cancelled) return;
        if (!ok || body.result !== 'success') throw new Error(body.error || 'Could not load summary');
        setData(body);
      })
      .catch((err) => { if (!cancelled) setError(err.message || 'Could not load summary.'); });
    return () => { cancelled = true; };
  }, []);

  if (error) return <div className="form-status error">{error}</div>;
  if (!data) return <p className="empty-note">Loading…</p>;

  const isOwn = data.scope === 'own';

  return (
    <div>
      <div className="stat-grid-cards">
        <StatCard icon="schools" tone="ink" value={nf(data.totals.schools)} label={isOwn ? 'Your Schools Onboarded' : 'Total Schools Onboarded'} />
        <StatCard icon="strength" tone="teal" value={nf(data.totals.strength)} label="Total Strength" />
        <StatCard icon="participated" tone="gold" value={nf(data.totals.participated)} label="Total Students Participated" />
        {!isOwn && (
          <StatCard icon="districts" tone="rose" value={nf(data.totals.districts)} label="Districts Covered" />
        )}
      </div>

      <div className="analytics-grid">
        <div className="analytics-panel">
          <h3>Strength by Class</h3>
          <ClassTable cls={data.classBreakdown} />
        </div>
        <div className="analytics-panel">
          <h3>Today</h3>
          <TodayTable today={data.today} />
        </div>
      </div>

      {!isOwn && (
        <>
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
        </>
      )}

      <div className="analytics-grid">
        <div className="analytics-panel">
          <h3>{isOwn ? 'Your Recent Submissions' : 'Recent Registrations'}</h3>
          <MiniTable
            headers={[{ label: 'Date' }, { label: 'Code' }, { label: 'School' }, { label: 'District' }]}
            emptyText="No registrations yet."
            rows={data.recentRegistrations.map((r, i) => (
              <tr key={i}>
                <td>{formatDate(r.created_at)}</td>
                <td>{r.code || '—'}</td>
                <td>{r.school_name || '—'}</td>
                <td>{r.district || '—'}</td>
              </tr>
            ))}
          />
        </div>
        {!isOwn && (
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
        )}
      </div>
    </div>
  );
}
