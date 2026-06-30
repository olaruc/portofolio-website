import { useState } from "react";
import data from "./content/portfolio.json";
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
  const [activeVideo, setActiveVideo] = useState(null);

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
        <Contact
          profile={data.profile}
          formspreeEndpoint={data.formspreeEndpoint}
        />
      </main>
      <Footer profile={data.profile} />
      {activeVideo && (
        <VideoModal video={activeVideo} onClose={() => setActiveVideo(null)} />
      )}
    </>
  );
}
