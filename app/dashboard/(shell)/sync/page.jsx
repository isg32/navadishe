'use client';

import { useState } from 'react';

export default function SyncPage() {
  const [syncing, setSyncing] = useState(false);
  const [status, setStatus] = useState(null);

  async function handleSync() {
    setSyncing(true);
    setStatus(null);
    try {
      const res = await fetch('/api/sync-sheets', { method: 'POST' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.result !== 'success') throw new Error(data.error || 'Sync failed');
      setStatus({ kind: 'success', text: `Synced — ${data.websiteRows} website leads, ${data.dashboardRows} school registrations.` });
    } catch (err) {
      setStatus({ kind: 'error', text: err.message || 'Sync failed.' });
    } finally {
      setSyncing(false);
    }
  }

  return (
    <div className="sync-card">
      <p>Neon Postgres is the source of truth for every registration. This replaces the &quot;Website Leads&quot; and &quot;School Registrations&quot; tabs in Google Sheets with whatever is currently in the database — use it whenever you want an up-to-date copy in Sheets.</p>
      <button type="button" className="btn btn-primary" onClick={handleSync} disabled={syncing}>
        {syncing ? 'Syncing…' : 'Sync to Google Sheets'}
      </button>
      {status && <div className={`form-status ${status.kind}`} style={{ marginTop: 20 }}>{status.text}</div>}
    </div>
  );
}
