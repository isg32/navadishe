import Poster from './ui/Poster.jsx';
import SectionHeading from './ui/SectionHeading.jsx';
import Reveal from './Reveal.jsx';

const CATEGORIES = [
  { label: 'Civil Services', names: ['Drishti IAS'] },
  { label: 'Defence', names: ['Centurion Defence Academy', 'Dreamers'] },
  {
    label: 'Coaching & Technology',
    names: ['PhysicsWallah (Vidyapeeth)', 'Saffalta', 'Scholars Den'],
  },
  {
    label: 'University Partners',
    names: [
      'Galgotias University',
      'Chandigarh University',
      'GLA University',
      'Graphic Era University',
    ],
  },
];

export default function Partners() {
  return (
    <section id="partners" className="bg-surface py-16 md:py-28">
      <div className="mx-auto max-w-container px-6">
        <Reveal>
          <SectionHeading
            eyebrow="Building the Bridge from Exam to Career"
            title="An Ecosystem of Partners"
            subline="Where a single test opens many doors."
          />
        </Reveal>

        <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:items-start">
          <Reveal>
            <Poster
              name="partners-photo"
              alt="Students representing different career paths — civil services, defence, and higher education."
              widths={[1200, 600]}
              width={840}
              height={1080}
            />
          </Reveal>

          <Reveal delay={120}>
            <div className="flex flex-col divide-y divide-outline-variant">
              {CATEGORIES.map((cat) => (
                <div key={cat.label} className="py-6 first:pt-0">
                  <span className="inline-flex rounded bg-secondary-container/10 px-3 py-1.5 text-[11.5px] font-bold uppercase tracking-wide text-secondary">
                    {cat.label}
                  </span>
                  <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
                    {cat.names.map((name) => (
                      <span key={name} className="font-display text-[19px] font-bold text-on-surface">
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
