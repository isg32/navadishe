'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { formatDate } from '@/lib/format';

// Display label -> DB column for the fields an admin may edit. Anything not
// listed here (Id, Code, Timestamp, Created By, State) is shown read-only.
const EDITABLE = {
  'School Name': 'school_name',
  'School Address': 'school_address',
  City: 'city',
  District: 'district',
  'Pin-code': 'pincode',
  'School Board': 'board',
  'Branch Name': 'branch_name',
  'School Contact Number': 'school_phone',
  'School Email Id': 'school_email',
  'Principal Name': 'principal_name',
  'Principal Mobile Number': 'principal_phone',
  'Principal Email Id': 'principal_email',
  'Coordinator Name': 'coordinator_name',
  'Coordinator Mobile Number': 'coordinator_phone',
  'Coordinator Email Id': 'coordinator_email',
  'Students Class 1st-9th': 'students_1_9',
  'Students Class 10th': 'students_10',
  'Students Class 11th': 'students_11',
  'Students Class 12th': 'students_12',
  'News First POC Name': 'news_first_poc_name',
  'News First POC Mobile Number': 'news_first_poc_phone',
  'Vendor Name': 'vendor_name',
  'Vendor Mobile Number': 'vendor_phone',
  'Test Date': 'test_date',
  Message: 'message',
};
const NUM_LABELS = new Set(['Students Class 1st-9th', 'Students Class 10th', 'Students Class 11th', 'Students Class 12th']);
const READ_ONLY_ORDER = ['Id', 'Code', 'Timestamp', 'Created By', 'State'];

export default function DetailOverlay({ row, onClose, canEdit = false, onSaved }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({});
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState(null);

  if (!row) return null;

  function startEdit() {
    const d = {};
    for (const label of Object.keys(EDITABLE)) {
      d[label] = row[label] == null ? '' : String(row[label]);
    }
    setDraft(d);
    setErr(null);
    setEditing(true);
  }

  async function save() {
    setSaving(true);
    setErr(null);
    const fields = {};
    for (const [label, col] of Object.entries(EDITABLE)) {
      const orig = row[label] == null ? '' : String(row[label]);
      if (draft[label] !== orig) fields[col] = draft[label];
    }
    if (!Object.keys(fields).length) {
      setEditing(false);
      setSaving(false);
      return;
    }
    try {
      const res = await fetch('/api/leads', {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ sheet: 'dashboard', id: row.Id, fields }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.result !== 'success') throw new Error(data.error || 'Save failed');
      setEditing(false);
      onSaved?.();
      onClose();
    } catch (e) {
      setErr(e.message || 'Could not save changes.');
    } finally {
      setSaving(false);
    }
  }

  const readOnlyEntries = READ_ONLY_ORDER
    .filter((k) => row[k] !== '' && row[k] !== null && row[k] !== undefined)
    .map((k) => [k, k === 'Timestamp' ? formatDate(row[k]) : String(row[k])]);

  const viewEntries = Object.entries(row).filter(
    ([k, v]) => v !== '' && v !== null && v !== undefined && !READ_ONLY_ORDER.includes(k)
  );

  return (
    <div className="detail-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="detail-card">
        <button type="button" className="detail-close" aria-label="Close" onClick={onClose}><X size={20} strokeWidth={1.8} /></button>
        <h3>{editing ? 'Edit Registration' : 'Registration Details'}</h3>

        {err && <div className="form-status error" style={{ marginBottom: 16 }}>{err}</div>}

        {!editing && (
          <>
            <dl className="detail-list">
              {[...readOnlyEntries, ...viewEntries].map(([k, v]) => (
                <div key={k} style={{ display: 'contents' }}>
                  <dt>{k}</dt>
                  <dd>{k === 'Timestamp' ? formatDate(row[k]) : String(v)}</dd>
                </div>
              ))}
            </dl>
            {canEdit && (
              <div className="detail-actions">
                <button type="button" className="btn btn-primary" onClick={startEdit}>Edit</button>
              </div>
            )}
          </>
        )}

        {editing && (
          <>
            <dl className="detail-list">
              {readOnlyEntries.map(([k, v]) => (
                <div key={k} style={{ display: 'contents' }}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
            <div className="detail-edit-grid">
              {Object.keys(EDITABLE).map((label) => (
                <label key={label} className="detail-edit-field">
                  <span>{label}</span>
                  {label === 'Message' ? (
                    <textarea
                      rows={3}
                      value={draft[label] ?? ''}
                      onChange={(e) => setDraft((d) => ({ ...d, [label]: e.target.value }))}
                    />
                  ) : (
                    <input
                      type={NUM_LABELS.has(label) ? 'number' : label === 'Test Date' ? 'date' : 'text'}
                      value={draft[label] ?? ''}
                      onChange={(e) => setDraft((d) => ({ ...d, [label]: e.target.value }))}
                    />
                  )}
                </label>
              ))}
            </div>
            <div className="detail-actions">
              <button type="button" className="btn btn-ghost" onClick={() => setEditing(false)} disabled={saving}>Cancel</button>
              <button type="button" className="btn btn-primary" onClick={save} disabled={saving}>
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
