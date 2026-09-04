'use client';

import { useEffect, useState } from 'react';
import { formatDate } from '@/lib/format';

const ROLE_BADGE = { admin: 'badge-admin', poc: 'badge-poc', reader: 'badge-reader' };

const EMPTY_FORM = { username: '', password: '', role: 'reader', districts: '' };

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState('loading');
  const [statusMsg, setStatusMsg] = useState({ kind: '', text: '' });
  const [form, setForm] = useState(EMPTY_FORM);
  const [editing, setEditing] = useState(null); // username being edited, or null
  const [saving, setSaving] = useState(false);

  function load() {
    setStatus('loading');
    fetch('/api/users')
      .then((res) => res.json().then((body) => ({ ok: res.ok, body })))
      .then(({ ok, body }) => {
        if (!ok || body.result !== 'success') throw new Error(body.error || 'Could not load users');
        setUsers(body.users);
        setStatus('ready');
      })
      .catch((err) => {
        setStatusMsg({ kind: 'error', text: err.message || 'Could not load users.' });
        setStatus('error');
      });
  }

  useEffect(load, []);

  function startEdit(u) {
    setEditing(u.username);
    setForm({ username: u.username, password: '', role: u.role, districts: (u.districts || []).join(', ') });
    document.getElementById('userForm')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function cancelEdit() {
    setEditing(null);
    setForm(EMPTY_FORM);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setStatusMsg({ kind: '', text: '' });

    const districts = form.districts.split(',').map((d) => d.trim()).filter(Boolean);
    const payload = { username: form.username.trim(), role: form.role, districts };
    if (form.password) payload.password = form.password;

    try {
      const res = await fetch('/api/users', {
        method: editing ? 'PATCH' : 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.result !== 'success') throw new Error(data.error || 'Could not save user');
      cancelEdit();
      load();
    } catch (err) {
      setStatusMsg({ kind: 'error', text: err.message || 'Could not save user.' });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(username) {
    if (!confirm(`Delete user "${username}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/users?username=${encodeURIComponent(username)}`, { method: 'DELETE' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.result !== 'success') throw new Error(data.error || 'Could not delete user');
      load();
    } catch (err) {
      setStatusMsg({ kind: 'error', text: err.message || 'Could not delete user.' });
    }
  }

  return (
    <>
      <p className="panel-intro">Create dashboard logins and set who can see which districts.</p>

      <form id="userForm" className="user-form" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="newUsername">Username</label>
          <input
            id="newUsername" value={form.username} disabled={!!editing} required
            onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
          />
        </div>
        <div className="field">
          <label htmlFor="newPassword">Password</label>
          <input
            id="newPassword" value={form.password}
            placeholder={editing ? 'Leave blank to keep current password' : 'min. 6 characters'}
            required={!editing}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
          />
        </div>
        <div className="field">
          <label htmlFor="newRole">Role</label>
          <select id="newRole" value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}>
            <option value="admin">Admin — full access</option>
            <option value="poc">POC — submits registrations only</option>
            <option value="reader">Reader — read-only, by district</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="newDistricts">Districts (reader only, comma-separated)</label>
          <input
            id="newDistricts" value={form.districts} placeholder="e.g. Mysuru, Bengaluru Urban"
            onChange={(e) => setForm((f) => ({ ...f, districts: e.target.value }))}
          />
        </div>
        <div className="field field-wide" style={{ display: 'flex', gap: 12 }}>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving…' : editing ? 'Update User' : 'Add User'}
          </button>
          {editing && <button type="button" className="btn btn-ghost" onClick={cancelEdit}>Cancel</button>}
        </div>
      </form>

      {statusMsg.text && <div className={`form-status ${statusMsg.kind}`}>{statusMsg.text}</div>}

      <div className="table-wrap">
        <table className="dash-table">
          <thead>
            <tr>
              <th>Username</th><th>Role</th><th>Districts</th><th>Created</th><th></th>
            </tr>
          </thead>
          <tbody>
            {status === 'loading' && (
              <tr className="table-empty-row"><td colSpan={5}>Loading…</td></tr>
            )}
            {status === 'ready' && users.length === 0 && (
              <tr className="table-empty-row"><td colSpan={5}>No users yet.</td></tr>
            )}
            {users.map((u) => (
              <tr key={u.username}>
                <td>{u.username}</td>
                <td><span className={`badge ${ROLE_BADGE[u.role] || ''}`}>{u.role}</span></td>
                <td>{u.districts && u.districts.length ? u.districts.join(', ') : '—'}</td>
                <td>{formatDate(u.created_at)}</td>
                <td className="user-row-actions">
                  <button type="button" className="icon-btn" onClick={() => startEdit(u)}>Edit</button>
                  <button type="button" className="icon-btn danger" onClick={() => handleDelete(u.username)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
