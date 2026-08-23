export default function SectionHeading({ eyebrow, title, subline, align = 'left', tone = 'default' }) {
  const alignClass = align === 'center' ? 'text-center mx-auto' : 'text-left';
  const eyebrowTone = tone === 'light' ? 'text-inverse-on-surface/80' : 'text-secondary';
  const titleTone = tone === 'light' ? 'text-white' : 'text-on-surface';
  const sublineTone = tone === 'light' ? 'text-inverse-on-surface/80' : 'text-on-surface-variant';

  return (
    <div className={`max-w-2xl ${alignClass}`}>
      {eyebrow && (
        <p className={`text-[12.5px] font-bold uppercase tracking-[0.16em] ${eyebrowTone}`}>{eyebrow}</p>
      )}
      <h2 className={`mt-3 text-[38px] leading-[1.02] md:text-[58px] ${titleTone}`}>{title}</h2>
      {subline && <p className={`mt-4 text-[17px] leading-[1.6] ${sublineTone}`}>{subline}</p>}
    </div>
  );
}
