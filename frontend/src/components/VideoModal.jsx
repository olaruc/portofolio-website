import { useEffect } from "react";
import { motion } from "framer-motion";

function toEmbed(url) {
  try {
    const u = new URL(url);
    let id = "";
    if (u.hostname.includes("youtu.be")) id = u.pathname.slice(1);
    else if (u.searchParams.get("v")) id = u.searchParams.get("v");
    else if (u.pathname.includes("/embed/")) return url;
    return id ? `https://www.youtube.com/embed/${id}?autoplay=1` : null;
  } catch {
    return null;
  }
}

export default function VideoModal({ video, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const embed = toEmbed(video.url);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <button className="modal-close" onClick={onClose} aria-label="Close">
        ✕
      </button>
      <motion.div
        className="modal"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="modal-video">
          {embed ? (
            <iframe
              src={embed}
              title={video.title}
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="loader" style={{ minHeight: "100%" }}>
              <p style={{ color: "var(--muted)" }}>
                Video unavailable.{" "}
                <a href={video.url} target="_blank" rel="noreferrer" style={{ color: "var(--neon-cyan)" }}>
                  Open externally →
                </a>
              </p>
            </div>
          )}
        </div>
        <div className="modal-body">
          <h3>{video.title}</h3>
        </div>
      </motion.div>
    </div>
  );
}
