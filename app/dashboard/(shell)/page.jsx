'use client';

import { useEffect, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';
import MiniTable from '@/components/dashboard/MiniTable';
import MetricChart from '@/components/dashboard/MetricChart';
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
  const [metricPage, setMetricPage] = useState(0);

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

  const metricPages = [
    {
      key: 'activity',
      title: isOwn ? 'Your Registration Activity' : 'Registration Activity',
      unit: 'registrations',
      data: data.dailyActivity.map((d) => ({
        label: new Date(`${d.date}T00:00:00Z`).toLocaleDateString('en-IN', { day: '2-digit', timeZone: 'UTC' }),
        value: d.registrations,
      })),
    },
    {
      key: 'class',
      title: 'Strength by Class',
      unit: 'students',
      data: [
        { label: 'Class 1–9', value: data.classBreakdown.c1_9 },
        { label: 'Class 10', value: data.classBreakdown.c10 },
        { label: 'Class 11', value: data.classBreakdown.c11 },
        { label: 'Class 12', value: data.classBreakdown.c12 },
      ],
    },
    ...(!isOwn ? [
      {
        key: 'board',
        title: 'Registrations by Board',
        unit: 'schools',
        data: data.boardBreakdown.map((b) => ({ label: b.board, value: b.count })),
      },
      {
        key: 'district',
        title: 'Registrations by District',
        unit: 'schools',
        data: data.districtBreakdown.map((d) => ({ label: d.district, value: d.count })),
      },
    ] : []),
  ];
  const activeMetric = metricPages[metricPage % metricPages.length];

  return (
    <div>
      <div className="stat-grid-cards">
        <StatCard icon="schools" variant="1" value={nf(data.totals.schools)} label={isOwn ? 'Your Schools Onboarded' : 'Total Schools Onboarded'} />
        <StatCard icon="strength" variant="2" value={nf(data.totals.strength)} label="Total Strength" />
        <StatCard icon="participated" variant="3" value={nf(data.totals.participated)} label="Total Students Participated" />
        {!isOwn && (
          <StatCard icon="districts" variant="4" value={nf(data.totals.districts)} label="Districts Covered" />
        )}
      </div>

      <div className="analytics-panel" style={{ marginBottom: 20 }}>
        <div className="metrics-panel-head">
          <h3>{activeMetric.title}</h3>
          {metricPages.length > 1 && (
            <button
              type="button"
              className="metrics-next-btn"
              onClick={() => setMetricPage((p) => (p + 1) % metricPages.length)}
              aria-label="Show next metric"
              title="Show next metric"
            >
              <ChevronRight size={17} strokeWidth={2.2} />
            </button>
          )}
        </div>
        <MetricChart data={activeMetric.data} unitLabel={activeMetric.unit} />
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
