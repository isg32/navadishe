import Chip from './ui/Chip.jsx';
import OMRCard from './OMRCard.jsx';
import SectionHeading from './ui/SectionHeading.jsx';
import Reveal from './Reveal.jsx';

export default function About() {
  return (
    <section id="about" className="bg-surface py-16 md:py-28">
      <div className="mx-auto max-w-container px-6">
        <Reveal>
          <SectionHeading
            eyebrow="About the Exam"
            title="What is Nava Dishe?"
            subline="A talent movement built for every classroom in Karnataka — not just the ones that can afford it."
          />
        </Reveal>

        <div className="mt-10 grid gap-12 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <div className="space-y-4 text-[18px] leading-[1.6] text-on-surface-variant">
              <p>
                Nava Dishe is an annual, free-of-cost talent recognition exam open to
                high-school students across Karnataka. It's built as a benchmarking platform —
                one that measures critical thinking, aptitude and general awareness, while
                removing the financial barriers that usually stand between a student and a
                fair shot.
              </p>
              <p>
                No coaching-class fees. No entry cost. Just a single, well-designed paper that
                lets ability speak for itself.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Chip>Free to Enter</Chip>
              <Chip>Merit-Based</Chip>
              <Chip>Statewide Reach</Chip>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <OMRCard />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
