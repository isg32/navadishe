import Masthead from '@/components/site/Masthead';
import ScrollReveal from '@/components/site/ScrollReveal';
import Hero from '@/components/site/Hero';
import MarqueeStrip from '@/components/site/MarqueeStrip';
import About from '@/components/site/About';
import Eligibility from '@/components/site/Eligibility';
import ExamFormat from '@/components/site/ExamFormat';
import Syllabus from '@/components/site/Syllabus';
import Rewards from '@/components/site/Rewards';
import StudentChoice from '@/components/site/StudentChoice';
import Pathways from '@/components/site/Pathways';
import HowItWorks from '@/components/site/HowItWorks';
import Reach from '@/components/site/Reach';
import Schools from '@/components/site/Schools';
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
        <MarqueeStrip />
        <About />
        <Eligibility />
        <ExamFormat />
        <Syllabus />
        <Rewards />
        <StudentChoice />
        <Pathways />
        <HowItWorks />
        <Reach />
        <Schools />
        <RegisterSection />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
