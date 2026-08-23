import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import About from './components/About.jsx';
import Eligibility from './components/Eligibility.jsx';
import ExamPattern from './components/ExamPattern.jsx';
import Pillars from './components/Pillars.jsx';
import CroreHighlight from './components/CroreHighlight.jsx';
import Rewards from './components/Rewards.jsx';
import Reach from './components/Reach.jsx';
import Partners from './components/Partners.jsx';
import HowToJoin from './components/HowToJoin.jsx';
import Register from './components/Register.jsx';
import FinalCTA from './components/FinalCTA.jsx';
import Footer from './components/Footer.jsx';

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Eligibility />
        <ExamPattern />
        <Pillars />
        <CroreHighlight />
        <Rewards />
        <Reach />
        <Partners />
        <HowToJoin />
        <Register />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
