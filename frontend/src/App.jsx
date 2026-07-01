import { useEffect, useState } from "react";
import defaultData from "./content/portfolio.json";
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
import EditPanel from "./components/EditPanel.jsx";

const DRAFT_KEY = "portfolio_draft";

function initialData() {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return defaultData;
}

function initialEditMode() {
  if (typeof window === "undefined") return false;
  return new URLSearchParams(window.location.search).get("edit") === "1";
}

export default function App() {
  const [data, setData] = useState(initialData);
  const [activeVideo, setActiveVideo] = useState(null);
  const [editing, setEditing] = useState(initialEditMode);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "e") {
        e.preventDefault();
        setEditing((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const { name, role } = data.profile;
    document.title = name && role ? `${name} — ${role}` : name || document.title;
  }, [data.profile.name, data.profile.role]);

  return (
    <div className={editing ? "app editing" : "app"}>
      <Navbar profile={data.profile} />
      <main>
        <Hero profile={data.profile} />
        <About profile={data.profile} />
        <Experience experience={data.experience} />
        <Skills skills={data.skills} />
        <Projects projects={data.projects} onPlay={setActiveVideo} />
        <YouTube youtube={data.youtube} onPlay={setActiveVideo} />
        <Contact
          profile={data.profile}
          formspreeEndpoint={data.formspreeEndpoint}
        />
      </main>
      <Footer profile={data.profile} />
      {activeVideo && (
        <VideoModal video={activeVideo} onClose={() => setActiveVideo(null)} />
      )}
      {editing && (
        <EditPanel
          data={data}
          setData={setData}
          onClose={() => setEditing(false)}
        />
      )}
    </div>
  );
}
