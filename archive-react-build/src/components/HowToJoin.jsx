import Button from './ui/Button.jsx';
import Poster from './ui/Poster.jsx';
import SectionHeading from './ui/SectionHeading.jsx';
import Reveal from './Reveal.jsx';

const STEPS = [
  {
    art: 'step1-photo',
    artSize: [440, 310],
    artAlt: 'School coordinating with News First bureau.',
    step: 'Step 01',
    title: 'Partner School Connects',
    description: 'School coordinates with its local News First bureau.',
  },
  {
    art: 'step2-photo',
    artSize: [430, 310],
    artAlt: 'Students taking the exam on campus.',
    step: 'Step 02',
    title: 'On-Campus Exam Day',
    description: 'Nava Dishe is conducted at the school using OMR sheets.',
  },
  {
    art: 'step3-photo',
    artSize: [440, 310],
    artAlt: 'Papers being evaluated and ranked.',
    step: 'Step 03',
    title: 'Evaluation & Ranking',
    description: 'Papers are graded; state-level ranks are determined.',
  },
  {
    art: 'step4-photo',
    artSize: [470, 310],
    artAlt: 'Online results dashboard.',
    step: 'Step 04',
    title: 'Online Results Dashboard',
    description: 'Score dashboards are published on the official Nava Dishe portal.',
  },
];

export default function HowToJoin() {
  return (
    <section id="join" className="bg-surface-container-low py-16 md:py-28">
      <div className="mx-auto max-w-container px-6">
        <Reveal>
          <SectionHeading
            eyebrow="A Bulk-Enrolment Drive, Not an Individual Sign-Up"
            title="How Schools Join"
            subline="Designed to reach hundreds of thousands of students — together."
          />
        </Reveal>

        <div className="mt-10 grid gap-6 md:grid-cols-4">
          {STEPS.map((s, i) => (
            <Reveal key={s.step} delay={i * 100}>
              <div className="h-full rounded-lg bg-surface-container-lowest p-5">
                <Poster
                  name={s.art}
                  alt={s.artAlt}
                  widths={[1200, 600]}
                  width={s.artSize[0]}
                  height={s.artSize[1]}
                />
                <p className="mt-4 text-[11.5px] font-bold uppercase tracking-wider text-secondary">
                  {s.step}
                </p>
                <h3 className="mt-1 text-[20px] leading-[1.15] text-on-surface">{s.title}</h3>
                <p className="mt-2.5 text-[14.5px] leading-[1.5] text-on-surface-variant">{s.description}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={300}>
          <div className="mt-12 text-center">
            <Button href="#register" variant="secondary">
              Register Your School Today
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
