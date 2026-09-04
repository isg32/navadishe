'use client';

import { useEffect, useState } from 'react';
import { useTableState } from '@/hooks/useTableState';
import { formatDate } from '@/lib/format';
import DetailOverlay from '@/components/dashboard/DetailOverlay';

const COLUMNS = [
  { sort: 'Timestamp', label: 'Date' },
  { sort: 'Name', label: 'Name' },
  { sort: 'District', label: 'District' },
  { sort: 'Phone', label: 'Phone' },
  { sort: 'Request Callback', label: 'Callback' },
];

export default function LeadsPage() {
  const [rows, setRows] = useState([]);
  const [status, setStatus] = useState('loading');
  const [errorMsg, setErrorMsg] = useState('');
  const [callbackFilter, setCallbackFilter] = useState('');
  const [selected, setSelected] = useState(null);

  function load() {
    setStatus('loading');
    fetch('/api/leads?sheet=website')
      .then((res) => res.json().then((body) => ({ ok: res.ok, body })))
      .then(({ ok, body }) => {
        if (!ok || body.result !== 'success') throw new Error(body.error || 'Could not load registrations');
        setRows(body.rows || []);
        setStatus('ready');
      })
      .catch((err) => {
        setErrorMsg(err.message || 'Could not load registrations.');
        setStatus('error');
      });
  }

  useEffect(load, []);

  const { search, setSearch, sortKey, sortDir, toggleSort, visibleRows } = useTableState({
    rows: callbackFilter ? rows.filter((r) => r['Request Callback'] === callbackFilter) : rows,
    defaultSortKey: 'Timestamp',
    searchGetters: (row) => [row['Name'], row['District'], row['Phone']],
  });

  return (
    <>
      <div className="table-toolbar">
        <input
          type="search" className="table-search" placeholder="Search name, phone, district…"
          value={search} onChange={(e) => setSearch(e.target.value)}
        />
        <select className="table-filter" value={callbackFilter} onChange={(e) => setCallbackFilter(e.target.value)}>
          <option value="">Callback: All</option>
          <option value="Yes">Callback: Requested</option>
          <option value="No">Callback: Not requested</option>
        </select>
        <button type="button" className="btn btn-ghost table-refresh" onClick={load}>Refresh</button>
        <span className="table-count">
          {status === 'loading' ? 'Loading…' : status === 'ready' ? `${visibleRows.length} of ${rows.length}` : ''}
        </span>
      </div>

      {status === 'error' && <div className="form-status error">{errorMsg}</div>}

      <div className="table-wrap">
        <table className="dash-table">
          <thead>
            <tr>
              {COLUMNS.map((c) => (
                <th
                  key={c.sort}
                  className={sortKey === c.sort ? (sortDir === 'asc' ? 'is-sorted' : 'is-sorted-desc') : undefined}
                  onClick={() => toggleSort(c.sort)}
                >
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {status === 'ready' && visibleRows.length === 0 && (
              <tr className="table-empty-row"><td colSpan={5}>No registrations match your filters.</td></tr>
            )}
            {visibleRows.map((row, i) => (
              <tr key={i} onClick={() => setSelected(row)}>
                <td>{formatDate(row['Timestamp'])}</td>
                <td>{row['Name'] || '—'}</td>
                <td>{row['District'] || '—'}</td>
                <td>{row['Phone'] || '—'}</td>
                <td>
                  {row['Request Callback'] === 'Yes'
                    ? <span className="badge badge-yes">Yes</span>
                    : <span className="badge badge-no">{row['Request Callback'] || 'No'}</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <DetailOverlay row={selected} onClose={() => setSelected(null)} />
    </>
  );
}
