import Reveal from "./Reveal.jsx";

export default function Experience({ experience }) {
  return (
    <section className="section" id="experience">
      <div className="container">
        <Reveal className="section-head">
          <span className="eyebrow">Experience</span>
          <h2 className="section-title">
            Where I've <span className="gradient-text">cut</span>
          </h2>
        </Reveal>

        <div className="timeline">
          {experience.map((job, i) => (
            <Reveal key={job.id} delay={i * 0.08}>
              <div className="tl-item">
                <span className="tl-dot" />
                <div className="tl-head">
                  <h3 className="tl-role">
                    {job.role} <span className="tl-company">· {job.company}</span>
                  </h3>
                  <span className="tl-period">
                    {job.period} · {job.location}
                  </span>
                </div>
                <p className="tl-desc">{job.description}</p>
                <ul className="tl-highlights">
                  {job.highlights.map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
