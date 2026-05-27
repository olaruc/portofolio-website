import { useEffect, useState } from "react";
import { fetchPortfolio } from "./api";
import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import About from "./components/About.jsx";
import Experience from "./components/Experience.jsx";
import Skills from "./components/Skills.jsx";
import Projects from "./components/Projects.jsx";
import YouTube from "./components/YouTube.jsx";
import Contact from "./components/Contact.jsx";
import Footer from "./components/Footer.jsx";
import VideoModal from "./components/VideoModal.jsx";

export default function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [activeVideo, setActiveVideo] = useState(null);

  useEffect(() => {
    fetchPortfolio().then(setData).catch((e) => setError(e.message));
  }, []);

  if (error) {
    return (
      <div className="loader">
        <p style={{ color: "var(--muted)" }}>
          Couldn't reach the API. Is the backend running on :8000?
        </p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="loader">
        <div className="logo">
          Loading reel<span className="dot">.</span>
        </div>
        <div className="loader-bar">
          <span />
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar profile={data.profile} />
      <main>
        <Hero profile={data.profile} />
        <About profile={data.profile} />
        <Experience experience={data.experience} />
        <Skills skills={data.skills} />
        <Projects projects={data.projects} onPlay={setActiveVideo} />
        <YouTube youtube={data.youtube} onPlay={setActiveVideo} />
        <Contact profile={data.profile} />
      </main>
      <Footer profile={data.profile} />
      {activeVideo && (
        <VideoModal video={activeVideo} onClose={() => setActiveVideo(null)} />
      )}
    </>
  );
}
