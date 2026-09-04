export default function MiniTable({ headers, rows, emptyText }) {
  if (!rows.length) return <p className="empty-note">{emptyText}</p>;

  return (
    <table className="mini-table">
      <thead>
        <tr>
          {headers.map((h) => (
            <th key={h.label} className={h.num ? 'num' : undefined}>{h.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}
