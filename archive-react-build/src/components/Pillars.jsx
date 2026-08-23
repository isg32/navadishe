import Poster from './ui/Poster.jsx';
import SectionHeading from './ui/SectionHeading.jsx';
import Reveal from './Reveal.jsx';

const PILLARS = [
  {
    art: 'pillar1-photo',
    artSize: [530, 275],
    artAlt: 'Student practicing English comprehension.',
    index: '01 / English',
    title: 'English',
    description: 'Comprehension, grammar and vocabulary fundamentals.',
  },
  {
    art: 'pillar2-photo',
    artSize: [530, 275],
    artAlt: 'Student solving a logical reasoning puzzle.',
    index: '02 / Reasoning',
    title: 'Logical Reasoning',
    description: 'Pattern recognition, deduction and analytical thinking.',
  },
  {
    art: 'pillar3-photo',
    artSize: [550, 275],
    artAlt: 'Student reviewing current affairs and aptitude material.',
    index: '03 / Awareness',
    title: 'General Awareness & Aptitude',
    description: 'Current affairs, civics, and quantitative aptitude.',
  },
];

export default function Pillars() {
  return (
    <section className="bg-surface-container-low py-16 md:py-28">
      <div className="mx-auto max-w-container px-6">
        <Reveal>
          <SectionHeading
            eyebrow="What Every Student Is Evaluated On"
            title="Three Pillars of the Test"
            subline="A statewide benchmark of competitive readiness."
          />
        </Reveal>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {PILLARS.map((pillar, i) => (
            <Reveal key={pillar.title} delay={i * 120}>
              <div className="h-full rounded-lg bg-surface-container-lowest p-6">
                <Poster
                  name={pillar.art}
                  alt={pillar.artAlt}
                  widths={[1200, 600]}
                  width={pillar.artSize[0]}
                  height={pillar.artSize[1]}
                />
                <p className="mt-5 text-[13px] font-bold uppercase tracking-wider text-secondary">
                  {pillar.index}
                </p>
                <h3 className="mt-2 text-[30px] leading-[1.05] text-on-surface">{pillar.title}</h3>
                <p className="mt-2.5 text-[15.5px] leading-[1.5] text-on-surface-variant">{pillar.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
