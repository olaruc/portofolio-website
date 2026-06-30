# Portfolio Website

A dark, cinematic video-editing portfolio with neon accents — fully static, deployable to **GitHub Pages**.

Sections: About / Bio · Work Experience · Skills · Projects · YouTube / Content · Contact.

Built with **React (Vite)** and **Framer Motion**. All content lives in one editable JSON file, so you can update text, projects, links and thumbnails without touching code.

## Editing your details

Open **`frontend/src/content/portfolio.json`** and edit:

- `profile` — your name, role, tagline, bio, location, stats, and social links (YouTube / Instagram / LinkedIn / Email).
- `experience` — your work history (each job has `role`, `company`, `period`, `description`, `highlights[]`).
- `skills` — grouped by category, each with a list of `items`.
- `projects` — each with `title`, `category`, `year`, `description`, `tags[]`, `thumbnail` (image URL), `videoUrl` (YouTube link) and an optional `featured: true`.
- `youtube` — your channel info and a few highlighted videos.
- `formspreeEndpoint` — optional; see **Contact form** below.

Save the file and the dev server hot-reloads. Push to `main` and GitHub Pages rebuilds automatically.

## Running locally

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173.

## Contact form

Two options — both work without a backend:

1. **Mailto (default).** Leave `formspreeEndpoint` as `""`. The form opens the visitor's email client with the message pre-filled, addressed to the `Email` social you set in `profile.socials`.
2. **Formspree** (real form submissions, free tier). Sign up at https://formspree.io, create a form, copy the endpoint URL (looks like `https://formspree.io/f/xxxxxxx`) into `formspreeEndpoint`, redeploy.

## Deploying to GitHub Pages

The repo includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that builds and publishes the site on every push to `main`.

**One-time setup:**

1. Push your changes to `main`.
2. In your repo on GitHub → **Settings → Pages → Build and deployment → Source:** select **GitHub Actions**.
3. Push any commit to `main`. The **Deploy to GitHub Pages** workflow will run and publish the site.
4. Once green, the URL appears on the Pages settings page — for this repo it will be:
   **https://olaruc.github.io/portofolio-website/**

If you fork or rename the repo, update the `PROD_BASE` in `frontend/vite.config.js` to match the new path (e.g. `/your-repo-name/`). For a **custom domain**, set `PROD_BASE = "/"` or pass `VITE_BASE=/` to the build.

## Production build (manual)

```bash
cd frontend
npm run build         # outputs static site to frontend/dist
npm run preview       # serve the build locally for testing
```
