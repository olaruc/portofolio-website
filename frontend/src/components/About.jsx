import Reveal from "./Reveal.jsx";

export default function About({ profile }) {
  return (
    <section className="section" id="about">
      <div className="container">
        <Reveal className="section-head">
          <span className="eyebrow">About</span>
          <h2 className="section-title">
            Behind the <span className="gradient-text">timeline</span>
          </h2>
        </Reveal>

        <div className="about-grid">
          <Reveal>
            <p className="about-bio">{profile.bio}</p>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="about-card">
              <h4>Quick facts</h4>
              <ul className="about-list">
                <li>
                  <span className="key">ROLE</span>
                  {profile.role}
                </li>
                <li>
                  <span className="key">BASED</span>
                  {profile.location}
                </li>
                <li>
                  <span className="key">STATUS</span>
                  {profile.available ? "Open to work" : "Currently booked"}
                </li>
                <li>
                  <span className="key">FOCUS</span>
                  Editing · Color · Motion · Sound
                </li>
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
