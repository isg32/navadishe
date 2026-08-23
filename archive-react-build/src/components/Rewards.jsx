import { Bike, Laptop, TabletSmartphone, Watch } from 'lucide-react';
import Poster from './ui/Poster.jsx';
import SectionHeading from './ui/SectionHeading.jsx';
import Reveal from './Reveal.jsx';

const REWARDS = [
  { rank: 'State 1st', icon: Bike, title: 'E-Bike / Electric Scooter' },
  { rank: 'State 2nd', icon: Laptop, title: 'Laptop' },
  { rank: 'State 3rd', icon: TabletSmartphone, title: 'Tablet / Smartphone' },
  { rank: 'Also Awarded', icon: Watch, title: 'Smartwatch + Career Counselling' },
];

export default function Rewards() {
  return (
    <section id="rewards" className="bg-surface py-16 md:py-28">
      <div className="mx-auto max-w-container px-6">
        <Reveal>
          <SectionHeading
            eyebrow="State Rankers Win Life-Upgrade Prizes"
            title="Rewards for the Toppers"
            subline="Every prize is designed to power what comes next."
          />
        </Reveal>

        <Reveal delay={80}>
          <Poster
            name="rewards-banner"
            alt="Students who cleared the exam, standing proudly."
            widths={[1200, 600]}
            width={910}
            height={480}
            className="mt-10"
          />
        </Reveal>

        <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-4">
          {REWARDS.map((reward, i) => (
            <Reveal key={reward.rank} delay={i * 100}>
              <div className="h-full rounded-lg bg-surface-container-lowest p-6 text-center transition-shadow duration-200 hover:shadow-level2 hover:-translate-y-1 transform-gpu">
                <span className="inline-flex rounded-full bg-on-surface px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wide text-surface">
                  {reward.rank}
                </span>
                <div className="mt-5 flex justify-center">
                  <reward.icon className="h-9 w-9 text-secondary-container" strokeWidth={1.75} aria-hidden="true" />
                </div>
                <p className="mt-4 text-[19px] font-semibold text-on-surface">{reward.title}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
