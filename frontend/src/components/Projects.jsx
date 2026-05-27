import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Reveal from "./Reveal.jsx";

export default function Projects({ projects, onPlay }) {
  const categories = useMemo(
    () => ["All", ...new Set(projects.map((p) => p.category))],
    [projects]
  );
  const [filter, setFilter] = useState("All");

  const visible =
    filter === "All" ? projects : projects.filter((p) => p.category === filter);

  return (
    <section className="section" id="work">
      <div className="container">
        <Reveal className="section-head">
          <span className="eyebrow">Selected Work</span>
          <h2 className="section-title">
            Projects & <span className="gradient-text">edits</span>
          </h2>
          <p className="section-sub">
            A selection of recent edits. Click any project to watch the reel.
          </p>
        </Reveal>

        <Reveal className="filters">
          {categories.map((c) => (
            <button
              key={c}
              className={`filter ${filter === c ? "active" : ""}`}
              onClick={() => setFilter(c)}
            >
              {c}
            </button>
          ))}
        </Reveal>

        <motion.div className="projects-grid" layout>
          <AnimatePresence mode="popLayout">
            {visible.map((p) => (
              <motion.article
                key={p.id}
                className="project-card"
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35 }}
                onClick={() => onPlay({ title: p.title, url: p.videoUrl })}
              >
                <img className="project-thumb" src={p.thumbnail} alt={p.title} loading="lazy" />
                {p.featured && <span className="featured-badge">Featured</span>}
                <div className="project-play">▶</div>
                <div className="project-overlay">
                  <span className="project-cat">
                    {p.category} · {p.year}
                  </span>
                  <h3 className="project-title">{p.title}</h3>
                  <div className="project-tags">
                    {p.tags.map((t) => (
                      <span className="chip" key={t}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
