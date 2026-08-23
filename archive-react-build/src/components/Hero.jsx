import { Sparkles } from 'lucide-react';
import Button from './ui/Button.jsx';
import Poster from './ui/Poster.jsx';
import Reveal from './Reveal.jsx';

const STATS = [
  { value: '₹1 Cr', label: 'Total Rewards Pool' },
  { value: 'Karnataka', label: 'Statewide Exam' },
  { value: '10–12', label: 'Class Eligibility' },
  { value: '₹0', label: 'Entry Fee' },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-surface">
      <div className="mx-auto max-w-container px-6 pb-16 pt-12 md:pb-28 md:pt-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <p className="text-[12.5px] font-bold uppercase tracking-[0.16em] text-secondary">
              Presented by News First
            </p>
            <h1 className="mt-4 text-[64px] leading-[0.98] tracking-[-0.01em] md:text-[clamp(64px,9.5vw,128px)] text-on-surface">
              Nava Dishe
            </h1>
            <p className="mt-3 text-[13.5px] font-bold uppercase tracking-[0.1em] text-on-surface-variant">
              Annual Mega-Scholarship &amp; Talent Recognition Exam
            </p>
            <p className="mt-6 font-serif italic text-[24px] text-on-surface-variant">
              "A statewide search for Karnataka's brightest minds."
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Button href="#register" variant="primary">
                Register Your School
              </Button>
              <Button href="#about" variant="outline">
                Explore the Exam
              </Button>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="relative mx-auto max-w-md">
              <Poster
                name="hero-art"
                alt="An illustrated high-school student holding an OMR answer sheet, in front of Karnataka landmarks including the Vidhana Soudha and Hampi's ruins."
                widths={[1400, 700]}
                width={950}
                height={952}
              />
              <div className="absolute -right-3 -top-3 flex h-20 w-20 rotate-[10deg] items-center justify-center rounded-full border-2 border-dashed border-secondary bg-surface text-center shadow-level2 sm:-right-4 sm:-top-4">
                <span className="flex flex-col items-center gap-0.5 text-label-sm font-semibold uppercase leading-tight text-secondary">
                  <Sparkles className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                  Free
                  <br />
                  to
                  <br />
                  Enter
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      <div className="bg-inverse-surface">
        <div className="mx-auto grid max-w-container grid-cols-2 divide-x divide-white/10 px-6 md:grid-cols-4">
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              className={`px-4 py-8 text-center ${i >= 2 ? 'border-t border-white/10 md:border-t-0' : ''}`}
            >
              <p className="font-display text-[30px] font-bold text-white">
                {stat.value}
              </p>
              <p className="mt-2 text-[11px] uppercase tracking-wide text-inverse-on-surface/70">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
