import { useState } from "react";
import Reveal from "./Reveal.jsx";

const ICONS = {
  YouTube: "▶",
  Instagram: "◎",
  LinkedIn: "in",
  Email: "✉",
};

function getEmail(profile) {
  const email = profile.socials.find((s) => s.platform === "Email");
  if (!email) return null;
  return email.url.replace(/^mailto:/, "");
}

export default function Contact({ profile, formspreeEndpoint }) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState(null);
  const [sending, setSending] = useState(false);

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const email = getEmail(profile);
  const useFormspree = Boolean(formspreeEndpoint);

  const submit = async (e) => {
    e.preventDefault();
    setStatus(null);

    if (!useFormspree) {
      // Mailto fallback: open the user's mail client with prefilled body
      if (!email) {
        setStatus({ type: "err", text: "No email configured." });
        return;
      }
      const subject = encodeURIComponent(`Portfolio inquiry from ${form.name}`);
      const body = encodeURIComponent(
        `${form.message}\n\n— ${form.name}\n${form.email}`
      );
      window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
      setStatus({ type: "ok", text: "Opening your email client…" });
      return;
    }

    setSending(true);
    try {
      const res = await fetch(formspreeEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Couldn't send — please try again.");
      setStatus({ type: "ok", text: "Thanks — your message has been sent." });
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      setStatus({ type: "err", text: err.message });
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="section" id="contact">
      <div className="container">
        <div className="contact-grid">
          <Reveal className="contact-info">
            <span className="eyebrow">Contact</span>
            <h2>
              Let's make something{" "}
              <span className="gradient-text">unforgettable</span>
            </h2>
            <p>
              Got a project, a rough cut, or just an idea? Send a message and
              I'll get back to you within a day or two.
            </p>
            <div className="socials">
              {profile.socials.map((s) => (
                <a
                  key={s.platform}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="social-link"
                >
                  <span aria-hidden>{ICONS[s.platform] || "→"}</span>
                  {s.platform}
                </a>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <form className="contact-form" onSubmit={submit}>
              <div className="field">
                <label htmlFor="name">Name</label>
                <input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={update}
                  placeholder="Jane Director"
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={update}
                  placeholder="jane@studio.com"
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={form.message}
                  onChange={update}
                  placeholder="Tell me about your project..."
                  required
                />
              </div>
              {status && (
                <div className={`form-status ${status.type}`}>{status.text}</div>
              )}
              <button
                className="btn btn-primary"
                type="submit"
                disabled={sending}
              >
                {sending
                  ? "Sending..."
                  : useFormspree
                  ? "Send message"
                  : "Send via email"}
              </button>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
