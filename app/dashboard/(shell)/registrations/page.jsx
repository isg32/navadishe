'use client';

import { useEffect, useMemo, useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { useTableState } from '@/hooks/useTableState';
import { formatDate } from '@/lib/format';
import { useSession } from '@/components/dashboard/SessionContext';
import DetailOverlay from '@/components/dashboard/DetailOverlay';

function computeContact(row) {
  return row['Principal Name'] || row['Coordinator Name'] || row['School Name'] || '—';
}
function computePhone(row) {
  return row['Principal Mobile Number'] || row['School Contact Number'] || row['Coordinator Mobile Number'] || '—';
}

export default function RegistrationsPage() {
  const { user } = useSession();
  const isAdmin = user?.role === 'admin';

  const [rows, setRows] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | ready | error
  const [errorMsg, setErrorMsg] = useState('');
  const [boardFilter, setBoardFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [selected, setSelected] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const COLUMNS = useMemo(() => [
    { sort: 'Timestamp', label: 'Date' },
    { sort: 'Code', label: 'Code' },
    { sort: '_contact', label: 'Contact' },
    { sort: '_phone', label: 'Phone' },
    { sort: 'City', label: 'City' },
    { sort: 'District', label: 'District' },
    { sort: 'School Name', label: 'School' },
    { sort: 'School Board', label: 'Board' },
    { sort: 'Created By', label: 'Added By' },
    ...(isAdmin ? [{ sort: null, label: '' }] : []),
  ], [isAdmin]);

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

  const scopedRows = useMemo(
    () => rows.filter(
      (r) => (!boardFilter || r['School Board'] === boardFilter)
        && (!cityFilter || r['City'] === cityFilter)
    ),
    [rows, boardFilter, cityFilter]
  );

  const { search, setSearch, sortKey, sortDir, toggleSort, visibleRows } = useTableState({
    rows: scopedRows,
    defaultSortKey: 'Timestamp',
    computed: { _contact: computeContact, _phone: computePhone },
    searchGetters: (row) => [
      row['Code'], computeContact(row), computePhone(row), row['City'], row['District'], row['School Name'],
      row['School Email Id'], row['Principal Name'], row['Coordinator Name'], row['Created By'], row['Message'],
    ],
  });

  const boards = useMemo(
    () => Array.from(new Set(rows.map((r) => r['School Board']).filter(Boolean))).sort(),
    [rows]
  );
  const cities = useMemo(
    () => Array.from(new Set(rows.map((r) => r['City']).filter(Boolean))).sort(),
    [rows]
  );

  async function handleDelete(row, e) {
    e.stopPropagation();
    const label = row['Code'] || row['School Name'] || `entry #${row['Id']}`;
    if (!window.confirm(`Delete ${label}? This cannot be undone.`)) return;
    setBusyId(row['Id']);
    try {
      const res = await fetch(`/api/leads?sheet=dashboard&id=${row['Id']}`, { method: 'DELETE' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.result !== 'success') throw new Error(data.error || 'Delete failed');
      setRows((rs) => rs.filter((r) => r['Id'] !== row['Id']));
    } catch (err) {
      window.alert(err.message || 'Could not delete this entry.');
    } finally {
      setBusyId(null);
    }
  }

  const colCount = COLUMNS.length;

  return (
    <>
      <div className="table-toolbar">
        <input
          type="search" className="table-search" placeholder="Search code, contact, phone, district, school…"
          value={search} onChange={(e) => setSearch(e.target.value)}
        />
        <select className="table-filter" value={cityFilter} onChange={(e) => setCityFilter(e.target.value)}>
          <option value="">All Cities</option>
          {cities.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
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
              {COLUMNS.map((c, i) => (
                <th
                  key={c.sort || `col-${i}`}
                  className={[
                    c.sort && sortKey === c.sort ? (sortDir === 'asc' ? 'is-sorted' : 'is-sorted-desc') : '',
                    c.sort ? '' : 'col-actions',
                  ].filter(Boolean).join(' ') || undefined}
                  onClick={c.sort ? () => toggleSort(c.sort) : undefined}
                >
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {status === 'ready' && visibleRows.length === 0 && (
              <tr className="table-empty-row"><td colSpan={colCount}>No registrations match your filters.</td></tr>
            )}
            {visibleRows.map((row) => (
              <tr key={row['Id']} onClick={() => setSelected(row)}>
                <td>{formatDate(row['Timestamp'])}</td>
                <td>{row['Code'] || '—'}</td>
                <td>{computeContact(row)}</td>
                <td>{computePhone(row)}</td>
                <td>{row['City'] || '—'}</td>
                <td>{row['District'] || '—'}</td>
                <td>{row['School Name'] || '—'}</td>
                <td>{row['School Board'] || '—'}</td>
                <td>{row['Created By'] || '—'}</td>
                {isAdmin && (
                  <td className="row-actions" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button" className="icon-btn" title="Edit"
                      onClick={(e) => { e.stopPropagation(); setSelected(row); }}
                    >
                      <Pencil size={15} strokeWidth={1.8} />
                    </button>
                    <button
                      type="button" className="icon-btn danger" title="Delete"
                      disabled={busyId === row['Id']}
                      onClick={(e) => handleDelete(row, e)}
                    >
                      <Trash2 size={15} strokeWidth={1.8} />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <DetailOverlay
        row={selected}
        canEdit={isAdmin}
        onSaved={load}
        onClose={() => setSelected(null)}
      />
    </>
  );
}
