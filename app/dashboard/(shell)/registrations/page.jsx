'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTableState } from '@/hooks/useTableState';
import { formatDate } from '@/lib/format';
import DetailOverlay from '@/components/dashboard/DetailOverlay';

function computeContact(row) {
  return row['Principal Name'] || row['Coordinator Name'] || row['School Name'] || '—';
}
function computePhone(row) {
  return row['Principal Mobile Number'] || row['School Contact Number'] || row['Coordinator Mobile Number'] || '—';
}

const COLUMNS = [
  { sort: 'Timestamp', label: 'Date' },
  { sort: '_contact', label: 'Contact' },
  { sort: '_phone', label: 'Phone' },
  { sort: 'District', label: 'District' },
  { sort: 'School Name', label: 'School' },
  { sort: 'School Board', label: 'Board' },
];

export default function RegistrationsPage() {
  const [rows, setRows] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | ready | error
  const [errorMsg, setErrorMsg] = useState('');
  const [boardFilter, setBoardFilter] = useState('');
  const [selected, setSelected] = useState(null);

  function load() {
    setStatus('loading');
    fetch('/api/leads?sheet=dashboard')
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
    rows: boardFilter ? rows.filter((r) => r['School Board'] === boardFilter) : rows,
    defaultSortKey: 'Timestamp',
    computed: { _contact: computeContact, _phone: computePhone },
    searchGetters: (row) => [
      computeContact(row), computePhone(row), row['District'], row['School Name'],
      row['School Email Id'], row['Principal Name'], row['Coordinator Name'], row['Message'],
    ],
  });

  const boards = useMemo(
    () => Array.from(new Set(rows.map((r) => r['School Board']).filter(Boolean))).sort(),
    [rows]
  );

  return (
    <>
      <div className="table-toolbar">
        <input
          type="search" className="table-search" placeholder="Search contact, phone, district, school…"
          value={search} onChange={(e) => setSearch(e.target.value)}
        />
        <select className="table-filter" value={boardFilter} onChange={(e) => setBoardFilter(e.target.value)}>
          <option value="">All Boards</option>
          {boards.map((b) => <option key={b} value={b}>{b}</option>)}
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
              <tr className="table-empty-row"><td colSpan={6}>No registrations match your filters.</td></tr>
            )}
            {visibleRows.map((row, i) => (
              <tr key={i} onClick={() => setSelected(row)}>
                <td>{formatDate(row['Timestamp'])}</td>
                <td>{computeContact(row)}</td>
                <td>{computePhone(row)}</td>
                <td>{row['District'] || '—'}</td>
                <td>{row['School Name'] || '—'}</td>
                <td>{row['School Board'] || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <DetailOverlay row={selected} onClose={() => setSelected(null)} />
    </>
  );
}
