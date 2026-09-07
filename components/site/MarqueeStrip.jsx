const ITEMS = [
  'Class 10 · 11 · 12',
  'Free to Enter',
  'Prizes Worth ₹1 Crore',
  'All 31 Districts of Karnataka',
  'No Negative Marking',
  'Future Forward',
];

export default function MarqueeStrip() {
  return (
    <div className="strip" aria-hidden="true">
      <div className="track">
        {[...ITEMS, ...ITEMS].map((item, i) => (
          <span key={i}>{item}</span>
        ))}
      </div>
    </div>
  );
}
