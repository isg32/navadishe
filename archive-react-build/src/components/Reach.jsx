import Poster from './ui/Poster.jsx';
import Reveal from './Reveal.jsx';

export default function Reach() {
  return (
    <section id="reach" className="bg-surface-container-low py-16 md:py-28">
      <div className="mx-auto max-w-container px-6">
        <h2 className="sr-only">
          Across Karnataka — News First's home state, a focused regional reach across
          Belagavi, Hubballi-Dharwad, Kalaburagi, Shivamogga, Udupi, Mangaluru, Mysuru and
          Bengaluru.
        </h2>
        <Reveal>
          <Poster
            name="reach"
            alt="Map of Karnataka marking eight cities: Belagavi, Hubballi-Dharwad, Kalaburagi, Shivamogga, Udupi, Mangaluru, Mysuru and Bengaluru — touching hundreds of thousands of Karnataka students."
            sizes="100vw"
          />
        </Reveal>
      </div>
    </section>
  );
}
