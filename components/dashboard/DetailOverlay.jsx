'use client';

import { formatDate } from '@/lib/format';

export default function DetailOverlay({ row, onClose }) {
  if (!row) return null;

  const entries = Object.entries(row).filter(([, v]) => v !== '' && v !== null && v !== undefined);

  return (
    <div className="detail-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="detail-card">
        <button type="button" className="detail-close" aria-label="Close" onClick={onClose}>&times;</button>
        <h3>Registration Details</h3>
        <dl className="detail-list">
          {entries.map(([k, v]) => (
            <div key={k} style={{ display: 'contents' }}>
              <dt>{k}</dt>
              <dd>{k === 'Timestamp' ? formatDate(v) : String(v)}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
