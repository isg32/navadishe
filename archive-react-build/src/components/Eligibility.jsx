import Poster from './ui/Poster.jsx';
import SectionHeading from './ui/SectionHeading.jsx';
import Reveal from './Reveal.jsx';

const CATEGORIES = [
  { tag: 'Category 1', number: '10', caption: 'Class 10 Students' },
  { tag: 'Category 2', number: '11/12', caption: 'Class 11 & 12 Students' },
];

export default function Eligibility() {
  return (
    <section id="eligibility" className="bg-surface-container-low py-16 md:py-28">
      <div className="mx-auto max-w-container px-6">
        <Reveal>
          <SectionHeading
            eyebrow="Who Can Participate"
            title="Open Doors, Zero Fees"
            subline="Open to all high-school and higher-secondary students, regardless of board."
          />
        </Reveal>

        <Reveal delay={80}>
          <Poster
            name="eligibility-banner"
            alt="Three Karnataka students carrying books, ready for the exam."
            widths={[1200, 600]}
            width={940}
            height={490}
            className="mt-10"
          />
        </Reveal>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {CATEGORIES.map((cat, i) => (
            <Reveal key={cat.tag} delay={i * 120}>
              <div className="rounded-lg bg-surface-container-lowest p-8">
                <span className="inline-flex rounded bg-surface-container-high px-3 py-1.5 text-[12px] font-bold uppercase tracking-wide text-on-surface">
                  {cat.tag}
                </span>
                <p className="mt-3 font-display text-[64px] leading-none md:text-[88px] text-primary">{cat.number}</p>
                <p className="mt-3 text-[12.5px] font-bold uppercase tracking-wide text-on-surface">{cat.caption}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={240}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
            {['CBSE', 'ICSE', 'State Boards'].map((board) => (
              <span
                key={board}
                className="text-[13px] font-bold uppercase tracking-[0.08em] text-on-surface-variant"
              >
                {board}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
