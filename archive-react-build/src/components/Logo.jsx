export default function Logo({ light = false }) {
  return (
    <a href="#top" className="flex items-center shrink-0" aria-label="Nava Dishe home">
      <span
        className={`font-display text-[22px] font-bold tracking-tight ${
          light ? 'text-white' : 'text-on-surface'
        }`}
      >
        Nava Dishe
      </span>
    </a>
  );
}
