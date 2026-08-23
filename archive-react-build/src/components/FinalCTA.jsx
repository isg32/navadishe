import Button from './ui/Button.jsx';
import Poster from './ui/Poster.jsx';
import Reveal from './Reveal.jsx';

const STATS = ['Free to Enter', '₹1 Crore in Rewards', 'Open to Class 10–12'];

export default function FinalCTA() {
  return (
    <section className="bg-gradient-to-br from-surface-container-low to-surface-container-high py-20 md:py-32">
      <div className="mx-auto max-w-container px-6">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <p className="text-[12.5px] font-bold uppercase tracking-[0.16em] text-secondary">The Mission</p>
            <h2 className="mt-4 text-[42px] leading-[1.02] md:text-[74px] text-on-surface">
              Give every student a <span className="text-secondary-container">fair</span> shot.
            </h2>
            <p className="mt-6 max-w-xl font-serif italic text-[19px] text-on-surface-variant">
              Nava Dishe is more than an exam. It is a doorway — to scholarships, to mentors, to
              a future built on merit, not means.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-3 text-[12.5px] font-bold uppercase tracking-wide text-on-surface">
              {STATS.map((stat, i) => (
                <span key={stat} className="flex items-center gap-3">
                  {i > 0 && <span className="hidden h-1.5 w-1.5 rounded-full bg-outline sm:inline-block" />}
                  {stat}
                </span>
              ))}
            </div>

            <div className="mt-10">
              <Button href="#register" variant="primary">
                Partner With News First
              </Button>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <Poster
              name="final-photo"
              alt="Sunrise over Karnataka with a graduation cap."
              widths={[1200, 600]}
              width={650}
              height={1000}
              className="mx-auto max-w-xs"
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
