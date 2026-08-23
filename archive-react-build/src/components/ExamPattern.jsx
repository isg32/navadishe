import SectionHeading from './ui/SectionHeading.jsx';
import Reveal from './Reveal.jsx';

const STATS = [
  { value: '40', label: 'Minutes' },
  { value: '40', label: 'MCQs' },
  { value: '80', label: 'Total Marks' },
  { value: '0', label: 'Negative Marking', accent: true },
];

export default function ExamPattern() {
  return (
    <section id="pattern" className="bg-surface py-16 md:py-28">
      <div className="mx-auto max-w-container px-6">
        <Reveal>
          <SectionHeading
            eyebrow="The Exam at a Glance"
            title="Familiar Format, Real Stakes"
            subline="Offline · OMR-based · conducted right on school campuses."
          />
        </Reveal>

        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
          {STATS.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 100}>
              <div className="rounded-lg border border-outline-variant bg-surface-container-lowest p-6 text-center">
                <p
                  className={`font-display text-[52px] leading-none font-bold ${
                    stat.accent ? 'text-secondary-container' : 'text-primary'
                  }`}
                >
                  {stat.value}
                </p>
                <p className="mt-2.5 text-[11px] uppercase tracking-wide text-on-surface-variant">{stat.label}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200}>
          <p className="mt-10 max-w-2xl font-serif italic text-[22px] text-on-surface-variant">
            "A familiar OMR-based experience, designed to mirror real competitive exams."
          </p>
        </Reveal>
      </div>
    </section>
  );
}
