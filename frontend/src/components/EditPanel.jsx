import { useEffect, useState } from "react";
import { GITHUB_CONFIG, publishContent, verifyToken } from "../lib/github.js";

const TOKEN_KEY = "portfolio_gh_token";
const DRAFT_KEY = "portfolio_draft";

const TABS = [
  { id: "setup", label: "Setup" },
  { id: "profile", label: "Profile" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "youtube", label: "YouTube" },
];

function Field({ label, value, onChange, type = "text", rows }) {
  if (type === "textarea") {
    return (
      <label className="ep-field">
        <span>{label}</span>
        <textarea
          rows={rows || 4}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
        />
      </label>
    );
  }
  if (type === "checkbox") {
    return (
      <label className="ep-field ep-check">
        <input
          type="checkbox"
          checked={!!value}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span>{label}</span>
      </label>
    );
  }
  return (
    <label className="ep-field">
      <span>{label}</span>
      <input
        type={type}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

function StringList({ label, items, onChange, placeholder }) {
  return (
    <div className="ep-list">
      <div className="ep-list-label">{label}</div>
      {items.map((v, i) => (
        <div key={i} className="ep-row">
          <input
            value={v}
            placeholder={placeholder}
            onChange={(e) => {
              const next = [...items];
              next[i] = e.target.value;
              onChange(next);
            }}
          />
          <button
            type="button"
            className="ep-x"
            onClick={() => onChange(items.filter((_, j) => j !== i))}
            aria-label="Remove"
          >
            ×
          </button>
        </div>
      ))}
      <button
        type="button"
        className="ep-add"
        onClick={() => onChange([...items, ""])}
      >
        + Add
      </button>
    </div>
  );
}

function Card({ title, onRemove, children }) {
  const [open, setOpen] = useState(true);
  return (
    <div className={`ep-card ${open ? "open" : ""}`}>
      <div className="ep-card-head">
        <button
          type="button"
          className="ep-card-toggle"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "▾" : "▸"} {title}
        </button>
        {onRemove && (
          <button type="button" className="ep-x" onClick={onRemove}>
            ×
          </button>
        )}
      </div>
      {open && <div className="ep-card-body">{children}</div>}
    </div>
  );
}

export default function EditPanel({ data, setData, onClose }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || "");
  const [tokenSaved, setTokenSaved] = useState(!!localStorage.getItem(TOKEN_KEY));
  const [ghUser, setGhUser] = useState(null);
  const [status, setStatus] = useState(null);
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState(tokenSaved ? "profile" : "setup");

  useEffect(() => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    if (!tokenSaved) return;
    verifyToken(token).then(setGhUser).catch(() => setGhUser(null));
  }, [tokenSaved, token]);

  const set = (mutator) => setData((prev) => {
    const next = structuredClone(prev);
    mutator(next);
    return next;
  });

  const saveToken = async () => {
    setStatus(null);
    setBusy(true);
    try {
      const user = await verifyToken(token);
      localStorage.setItem(TOKEN_KEY, token);
      setTokenSaved(true);
      setGhUser(user);
      setStatus({ type: "ok", text: `Signed in as ${user.login}` });
      setTab("profile");
    } catch (e) {
      setStatus({ type: "err", text: e.message });
    } finally {
      setBusy(false);
    }
  };

  const clearToken = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken("");
    setTokenSaved(false);
    setGhUser(null);
    setTab("setup");
    setStatus(null);
  };

  const resetDraft = () => {
    if (!confirm("Discard local changes and reload the published content?")) return;
    localStorage.removeItem(DRAFT_KEY);
    window.location.reload();
  };

  const publish = async () => {
    if (!tokenSaved) return;
    setBusy(true);
    setStatus(null);
    try {
      const content = JSON.stringify(data, null, 2) + "\n";
      await publishContent(token, content);
      setStatus({
        type: "ok",
        text: "Published! Your site will rebuild in about a minute.",
      });
      localStorage.removeItem(DRAFT_KEY);
    } catch (e) {
      setStatus({ type: "err", text: e.message });
    } finally {
      setBusy(false);
    }
  };

  return (
    <aside className="ep">
      <header className="ep-head">
        <div>
          <div className="ep-title">Edit mode</div>
          <div className="ep-sub">
            {ghUser ? `Signed in as ${ghUser.login}` : "Not signed in"}
          </div>
        </div>
        <button className="ep-close" onClick={onClose} aria-label="Close edit panel">
          ✕
        </button>
      </header>

      <nav className="ep-tabs">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={`ep-tab ${tab === t.id ? "active" : ""}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <div className="ep-body">
        {tab === "setup" && (
          <SetupTab
            token={token}
            setToken={setToken}
            tokenSaved={tokenSaved}
            saveToken={saveToken}
            clearToken={clearToken}
            busy={busy}
          />
        )}

        {tab === "profile" && (
          <div>
            <Field label="Name" value={data.profile.name} onChange={(v) => set((d) => { d.profile.name = v; })} />
            <Field label="Role" value={data.profile.role} onChange={(v) => set((d) => { d.profile.role = v; })} />
            <Field label="Tagline" value={data.profile.tagline} onChange={(v) => set((d) => { d.profile.tagline = v; })} />
            <Field label="Location" value={data.profile.location} onChange={(v) => set((d) => { d.profile.location = v; })} />
            <Field label="Available for work" type="checkbox" value={data.profile.available} onChange={(v) => set((d) => { d.profile.available = v; })} />
            <Field label="Bio" type="textarea" rows={6} value={data.profile.bio} onChange={(v) => set((d) => { d.profile.bio = v; })} />

            <h4 className="ep-h">Stats</h4>
            {data.profile.stats.map((s, i) => (
              <Card
                key={i}
                title={s.label || `Stat ${i + 1}`}
                onRemove={() => set((d) => { d.profile.stats.splice(i, 1); })}
              >
                <Field label="Label" value={s.label} onChange={(v) => set((d) => { d.profile.stats[i].label = v; })} />
                <Field label="Value" value={s.value} onChange={(v) => set((d) => { d.profile.stats[i].value = v; })} />
              </Card>
            ))}
            <button type="button" className="ep-add" onClick={() => set((d) => { d.profile.stats.push({ label: "New stat", value: "" }); })}>
              + Add stat
            </button>

            <h4 className="ep-h">Socials</h4>
            {data.profile.socials.map((s, i) => (
              <Card
                key={i}
                title={s.platform || `Social ${i + 1}`}
                onRemove={() => set((d) => { d.profile.socials.splice(i, 1); })}
              >
                <Field label="Platform (YouTube / Instagram / LinkedIn / Email)" value={s.platform} onChange={(v) => set((d) => { d.profile.socials[i].platform = v; })} />
                <Field label="URL" value={s.url} onChange={(v) => set((d) => { d.profile.socials[i].url = v; })} />
              </Card>
            ))}
            <button type="button" className="ep-add" onClick={() => set((d) => { d.profile.socials.push({ platform: "", url: "" }); })}>
              + Add social
            </button>
          </div>
        )}

        {tab === "experience" && (
          <div>
            {data.experience.map((job, i) => (
              <Card
                key={job.id ?? i}
                title={`${job.role || "Role"} — ${job.company || "Company"}`}
                onRemove={() => set((d) => { d.experience.splice(i, 1); })}
              >
                <Field label="Role" value={job.role} onChange={(v) => set((d) => { d.experience[i].role = v; })} />
                <Field label="Company" value={job.company} onChange={(v) => set((d) => { d.experience[i].company = v; })} />
                <Field label="Period" value={job.period} onChange={(v) => set((d) => { d.experience[i].period = v; })} />
                <Field label="Location" value={job.location} onChange={(v) => set((d) => { d.experience[i].location = v; })} />
                <Field label="Description" type="textarea" value={job.description} onChange={(v) => set((d) => { d.experience[i].description = v; })} />
                <StringList
                  label="Highlights"
                  items={job.highlights || []}
                  placeholder="Achievement / responsibility"
                  onChange={(next) => set((d) => { d.experience[i].highlights = next; })}
                />
              </Card>
            ))}
            <button
              type="button"
              className="ep-add"
              onClick={() => set((d) => {
                const nextId = Math.max(0, ...d.experience.map((j) => j.id || 0)) + 1;
                d.experience.push({
                  id: nextId,
                  company: "New Company",
                  role: "Role",
                  period: "Year — Year",
                  location: "Location",
                  description: "",
                  highlights: [],
                });
              })}
            >
              + Add job
            </button>
          </div>
        )}

        {tab === "skills" && (
          <div>
            {data.skills.map((group, i) => (
              <Card
                key={i}
                title={group.category || `Group ${i + 1}`}
                onRemove={() => set((d) => { d.skills.splice(i, 1); })}
              >
                <Field label="Category" value={group.category} onChange={(v) => set((d) => { d.skills[i].category = v; })} />
                <StringList
                  label="Items"
                  items={group.items || []}
                  placeholder="Skill / tool"
                  onChange={(next) => set((d) => { d.skills[i].items = next; })}
                />
              </Card>
            ))}
            <button type="button" className="ep-add" onClick={() => set((d) => { d.skills.push({ category: "New category", items: [] }); })}>
              + Add category
            </button>
          </div>
        )}

        {tab === "projects" && (
          <div>
            {data.projects.map((p, i) => (
              <Card
                key={p.id ?? i}
                title={p.title || `Project ${i + 1}`}
                onRemove={() => set((d) => { d.projects.splice(i, 1); })}
              >
                <Field label="Title" value={p.title} onChange={(v) => set((d) => { d.projects[i].title = v; })} />
                <Field label="Category" value={p.category} onChange={(v) => set((d) => { d.projects[i].category = v; })} />
                <Field label="Year" value={p.year} onChange={(v) => set((d) => { d.projects[i].year = v; })} />
                <Field label="Description" type="textarea" value={p.description} onChange={(v) => set((d) => { d.projects[i].description = v; })} />
                <Field label="Thumbnail URL" value={p.thumbnail} onChange={(v) => set((d) => { d.projects[i].thumbnail = v; })} />
                <Field label="Video URL" value={p.videoUrl} onChange={(v) => set((d) => { d.projects[i].videoUrl = v; })} />
                <Field label="Featured" type="checkbox" value={p.featured} onChange={(v) => set((d) => { d.projects[i].featured = v; })} />
                <StringList
                  label="Tags"
                  items={p.tags || []}
                  onChange={(next) => set((d) => { d.projects[i].tags = next; })}
                />
              </Card>
            ))}
            <button
              type="button"
              className="ep-add"
              onClick={() => set((d) => {
                const nextId = Math.max(0, ...d.projects.map((p) => p.id || 0)) + 1;
                d.projects.push({
                  id: nextId,
                  title: "New Project",
                  category: "Category",
                  year: "2025",
                  description: "",
                  tags: [],
                  thumbnail: "",
                  videoUrl: "",
                  featured: false,
                });
              })}
            >
              + Add project
            </button>
          </div>
        )}

        {tab === "youtube" && (
          <div>
            <Field label="Channel name" value={data.youtube.channelName} onChange={(v) => set((d) => { d.youtube.channelName = v; })} />
            <Field label="Channel URL" value={data.youtube.channelUrl} onChange={(v) => set((d) => { d.youtube.channelUrl = v; })} />
            <Field label="Subscribers (display)" value={data.youtube.subscribers} onChange={(v) => set((d) => { d.youtube.subscribers = v; })} />
            <Field label="Description" type="textarea" value={data.youtube.description} onChange={(v) => set((d) => { d.youtube.description = v; })} />

            <h4 className="ep-h">Videos</h4>
            {data.youtube.videos.map((v, i) => (
              <Card
                key={v.id ?? i}
                title={v.title || `Video ${i + 1}`}
                onRemove={() => set((d) => { d.youtube.videos.splice(i, 1); })}
              >
                <Field label="Title" value={v.title} onChange={(nv) => set((d) => { d.youtube.videos[i].title = nv; })} />
                <Field label="Views" value={v.views} onChange={(nv) => set((d) => { d.youtube.videos[i].views = nv; })} />
                <Field label="Duration" value={v.duration} onChange={(nv) => set((d) => { d.youtube.videos[i].duration = nv; })} />
                <Field label="Thumbnail URL" value={v.thumbnail} onChange={(nv) => set((d) => { d.youtube.videos[i].thumbnail = nv; })} />
                <Field label="Video URL" value={v.url} onChange={(nv) => set((d) => { d.youtube.videos[i].url = nv; })} />
              </Card>
            ))}
            <button
              type="button"
              className="ep-add"
              onClick={() => set((d) => {
                const nextId = Math.max(0, ...d.youtube.videos.map((v) => v.id || 0)) + 1;
                d.youtube.videos.push({
                  id: nextId,
                  title: "New video",
                  views: "",
                  duration: "",
                  thumbnail: "",
                  url: "",
                });
              })}
            >
              + Add video
            </button>

            <h4 className="ep-h">Contact</h4>
            <Field
              label="Formspree endpoint (optional — leave blank for mailto)"
              value={data.formspreeEndpoint}
              onChange={(v) => set((d) => { d.formspreeEndpoint = v; })}
            />
          </div>
        )}
      </div>

      <footer className="ep-foot">
        {status && (
          <div className={`ep-status ${status.type}`}>{status.text}</div>
        )}
        <div className="ep-actions">
          <button
            type="button"
            className="ep-btn ghost"
            onClick={resetDraft}
            disabled={busy}
          >
            Discard changes
          </button>
          <button
            type="button"
            className="ep-btn primary"
            onClick={publish}
            disabled={busy || !tokenSaved}
            title={
              tokenSaved
                ? "Commit portfolio.json to main"
                : "Add a GitHub token in Setup first"
            }
          >
            {busy ? "Working…" : "Publish"}
          </button>
        </div>
        <div className="ep-hint">
          Publishes to{" "}
          <code>
            {GITHUB_CONFIG.owner}/{GITHUB_CONFIG.repo}@{GITHUB_CONFIG.branch}
          </code>
        </div>
      </footer>
    </aside>
  );
}

function SetupTab({ token, setToken, tokenSaved, saveToken, clearToken, busy }) {
  return (
    <div className="ep-setup">
      <h4 className="ep-h">GitHub token</h4>
      <p className="ep-p">
        To publish edits, you need a GitHub{" "}
        <a
          href="https://github.com/settings/personal-access-tokens/new"
          target="_blank"
          rel="noreferrer"
        >
          fine-grained personal access token
        </a>{" "}
        with <b>Contents: Read and write</b> on{" "}
        <code>
          {GITHUB_CONFIG.owner}/{GITHUB_CONFIG.repo}
        </code>
        . The token is stored in this browser only and never leaves your device
        except in calls to <code>api.github.com</code>.
      </p>
      <Field
        label="Personal access token"
        type="password"
        value={token}
        onChange={setToken}
      />
      <div className="ep-actions" style={{ marginTop: 12 }}>
        {tokenSaved ? (
          <button
            type="button"
            className="ep-btn ghost"
            onClick={clearToken}
            disabled={busy}
          >
            Remove token
          </button>
        ) : (
          <button
            type="button"
            className="ep-btn primary"
            onClick={saveToken}
            disabled={busy || !token}
          >
            {busy ? "Verifying…" : "Save token"}
          </button>
        )}
      </div>
      <p className="ep-p ep-muted">
        Tip: open the edit panel any time with <kbd>Ctrl</kbd>+<kbd>E</kbd> or the
        URL <code>?edit=1</code>.
      </p>
    </div>
  );
}
