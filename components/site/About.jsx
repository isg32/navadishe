export default function About() {
  return (
    <section id="about">
      <div className="wrap">
        <div className="section-head reveal">
          <div>
            <div className="eyebrow">About the Exam</div>
            <h2>What is<br />Nava Dishe?</h2>
          </div>
          <p>A talent movement built for every classroom in Karnataka — not just the ones that can afford it.</p>
        </div>

        <div className="about-grid">
          <div className="about-copy reveal">
            <p>Nava Dishe is an annual, free-of-cost talent recognition exam open to high-school students across Karnataka. It&rsquo;s built as a benchmarking platform — one that measures critical thinking, aptitude and general awareness, while removing the financial barriers that usually stand between a student and a fair shot.</p>
            <p>No coaching-class fees. No entry cost. Just a single, well-designed paper that lets ability speak for itself.</p>
            <div className="chip-row">
              <div className="chip"><span className="dot" />Free to Enter</div>
              <div className="chip"><span className="dot" />Merit-Based</div>
              <div className="chip"><span className="dot" />Statewide Reach</div>
            </div>
          </div>

          <div className="reveal">
            <div className="omr">
              <div className="omr-head">
                <span>Nava Dishe · OMR Sheet</span>
                <span>Roll No. 00042</span>
              </div>
              <div className="omr-row"><span className="omr-q">01</span><span className="bubble">A</span><span className="bubble fill">B</span><span className="bubble">C</span><span className="bubble">D</span></div>
              <div className="omr-row"><span className="omr-q">02</span><span className="bubble">A</span><span className="bubble">B</span><span className="bubble">C</span><span className="bubble fill-accent">D</span></div>
              <div className="omr-row"><span className="omr-q">03</span><span className="bubble fill">A</span><span className="bubble">B</span><span className="bubble">C</span><span className="bubble">D</span></div>
              <div className="omr-row"><span className="omr-q">04</span><span className="bubble">A</span><span className="bubble fill-accent">B</span><span className="bubble">C</span><span className="bubble">D</span></div>
              <div className="omr-row"><span className="omr-q">05</span><span className="bubble">A</span><span className="bubble">B</span><span className="bubble fill">C</span><span className="bubble">D</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
