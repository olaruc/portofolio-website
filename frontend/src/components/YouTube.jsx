import Reveal from "./Reveal.jsx";

export default function YouTube({ youtube, onPlay }) {
  return (
    <section className="section" id="youtube">
      <div className="container">
        <Reveal className="section-head">
          <span className="eyebrow">YouTube / Content</span>
          <h2 className="section-title">
            From the <span className="gradient-text">channel</span>
          </h2>
        </Reveal>

        <Reveal>
          <div className="yt-head">
            <div className="yt-channel">
              <div className="yt-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="#fff">
                  <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.3 31.3 0 0 0 0 12a31.3 31.3 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.3 31.3 0 0 0 24 12a31.3 31.3 0 0 0-.5-5.8zM9.6 15.6V8.4l6.2 3.6z" />
                </svg>
              </div>
              <div>
                <h3>{youtube.channelName}</h3>
                <div className="yt-subs">
                  {youtube.subscribers} subscribers · {youtube.description}
                </div>
              </div>
            </div>
            <a
              href={youtube.channelUrl}
              target="_blank"
              rel="noreferrer"
              className="btn btn-ghost"
            >
              Visit channel
            </a>
          </div>
        </Reveal>

        <div className="yt-grid">
          {youtube.videos.map((v, i) => (
            <Reveal key={v.id} delay={i * 0.08}>
              <article
                className="yt-card"
                onClick={() => onPlay({ title: v.title, url: v.url })}
                style={{ cursor: "pointer" }}
              >
                <div className="yt-thumb-wrap">
                  <img src={v.thumbnail} alt={v.title} loading="lazy" />
                  <span className="yt-duration">{v.duration}</span>
                  <div className="yt-play">
                    <div className="project-play" style={{ opacity: 1, transform: "scale(1)" }}>
                      ▶
                    </div>
                  </div>
                </div>
                <div className="yt-info">
                  <h4>{v.title}</h4>
                  <div className="yt-views">{v.views} views</div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
