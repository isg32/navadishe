const ROWS = [
  { q: '01', fill: 1 }, // B
  { q: '02', fill: 3, accent: true }, // D
  { q: '03', fill: 0 }, // A
  { q: '04', fill: 1, accent: true }, // B
  { q: '05', fill: 2 }, // C
];
const OPTIONS = ['A', 'B', 'C', 'D'];

export default function OMRCard() {
  return (
    <div className="rounded-lg border border-outline-variant bg-surface-container-lowest p-7 shadow-level2">
      <div className="flex items-center justify-between border-b-2 border-on-surface pb-3 text-[11px] uppercase tracking-wide text-on-surface-variant">
        <span>Nava Dishe · OMR Sheet</span>
        <span>Roll No. 00042</span>
      </div>
      <div className="mt-4 space-y-3">
        {ROWS.map((row) => (
          <div key={row.q} className="flex items-center gap-4">
            <span className="w-6 text-[12px] text-on-surface-variant">{row.q}</span>
            <div className="flex gap-3">
              {OPTIONS.map((opt, i) => {
                const filled = row.fill === i;
                return (
                  <span
                    key={opt}
                    className={`flex h-6 w-6 items-center justify-center rounded-full border text-[9px] font-semibold ${
                      filled
                        ? row.accent
                          ? 'border-secondary-container bg-secondary-container text-white'
                          : 'border-on-surface bg-on-surface text-surface'
                        : 'border-outline-variant text-on-surface-variant'
                    }`}
                  >
                    {opt}
                  </span>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
