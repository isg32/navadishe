import Masthead from '@/components/site/Masthead';
import ScrollReveal from '@/components/site/ScrollReveal';
import Hero from '@/components/site/Hero';
import About from '@/components/site/About';
import Eligibility from '@/components/site/Eligibility';
import ExamPattern from '@/components/site/ExamPattern';
import Pillars from '@/components/site/Pillars';
import CroreBanner from '@/components/site/CroreBanner';
import Rewards from '@/components/site/Rewards';
import Reach from '@/components/site/Reach';
import Partners from '@/components/site/Partners';
import HowToJoin from '@/components/site/HowToJoin';
import RegisterSection from '@/components/site/RegisterSection';
import FinalCta from '@/components/site/FinalCta';
import Footer from '@/components/site/Footer';

export default function HomePage() {
  return (
    <>
      <ScrollReveal />
      <Masthead />
      <main id="top">
        <Hero />
        <About />
        <Eligibility />
        <ExamPattern />
        <Pillars />
        <CroreBanner />
        <Rewards />
        <Reach />
        <Partners />
        <HowToJoin />
        <RegisterSection />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
