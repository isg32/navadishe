import Reveal from './Reveal.jsx';

const POINTS = [
  "For Karnataka's Brightest",
  'Across the State',
  'Awarded to Class 10 / 11 / 12 Toppers',
];

export default function CroreHighlight() {
  return (
    <section className="bg-primary py-20 md:py-32">
      <div className="mx-auto max-w-container px-6">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <p className="text-[12px] font-bold uppercase tracking-wider text-white/70">
              Total Scholarship &amp; Rewards Pool
            </p>
            <p className="mt-4 font-display text-[70px] font-extrabold leading-[0.9] tracking-tight text-white md:text-[150px]">
              <span className="text-secondary-container">₹</span>1 Crore
            </p>
            <p className="mt-6 text-[17px] italic text-white/80">
              A scholarship movement on a statewide scale.
            </p>
          </Reveal>

          <Reveal delay={120}>
            <ul className="space-y-4 lg:justify-self-end">
              {POINTS.map((point) => (
                <li key={point} className="flex items-center gap-3 text-[13px] font-bold uppercase tracking-wide text-white">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-secondary-container" />
                  {point}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
