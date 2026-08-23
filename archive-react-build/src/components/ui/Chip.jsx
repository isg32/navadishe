export default function Chip({ children, tone = 'primary' }) {
  const tones = {
    primary: 'bg-surface-container-high text-on-surface',
    secondary: 'bg-secondary-fixed text-on-secondary-fixed',
  };

  return (
    <span
      className={`inline-flex items-center rounded px-3 py-1.5 text-[12px] font-bold uppercase tracking-wide ${tones[tone]}`}
    >
      {children}
    </span>
  );
}
