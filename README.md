# Portfolio Website

A dark, cinematic video-editing portfolio with neon accents.

- **Backend** — Python / FastAPI, serves portfolio content and handles the contact form.
- **Frontend** — React (Vite) + Framer Motion, single-page site with smooth section navigation.

Sections: About / Bio · Work Experience · Skills · Projects · YouTube / Content · Contact.

## Project structure

```
backend/
  main.py                 FastAPI app (API + contact endpoint)
  requirements.txt
  data/portfolio.json     All editable site content lives here
frontend/
  src/
    api.js                API client
    App.jsx
    components/           Section components
    index.css            Theme + all styles
```

## Running locally

Run the backend and frontend in two terminals.

### 1. Backend (http://localhost:8000)

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 2. Frontend (http://localhost:5173)

```bash
cd frontend
npm install
npm run dev
```

The Vite dev server proxies `/api/*` to the backend, so no extra config is needed.

## Editing your content

All text, projects, jobs, skills, and links live in **`backend/data/portfolio.json`** —
edit that file and refresh. No code changes needed.

- Replace project/video `thumbnail` URLs with your own images.
- Set `videoUrl` / `url` to your YouTube links (watch or `youtu.be` links both work).
- Update `profile`, `experience`, `skills`, and `socials`.

Contact-form submissions are appended to `backend/data/messages.json` (gitignored).

## API endpoints

| Method | Path             | Description                       |
|--------|------------------|-----------------------------------|
| GET    | `/api/health`    | Health check                      |
| GET    | `/api/portfolio` | Full content payload              |
| GET    | `/api/profile`   | Profile / bio                     |
| GET    | `/api/experience`| Work experience                   |
| GET    | `/api/skills`    | Skills grouped by category        |
| GET    | `/api/projects`  | Projects                          |
| GET    | `/api/youtube`   | YouTube channel + videos          |
| POST   | `/api/contact`   | Submit a contact message          |

## Production build

```bash
cd frontend
npm run build      # outputs to frontend/dist
```

Serve `frontend/dist` from any static host and point it at the deployed API
via the `VITE_API_URL` environment variable at build time.
