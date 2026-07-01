// Where your editable JSON lives. Change these if you fork/rename the repo.
export const GITHUB_CONFIG = {
  owner: "olaruc",
  repo: "portofolio-website",
  branch: "main",
  path: "frontend/src/content/portfolio.json",
};

const API = "https://api.github.com";

function utf8ToBase64(str) {
  const bytes = new TextEncoder().encode(str);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

async function ghFetch(path, opts, token) {
  const res = await fetch(`${API}${path}`, {
    ...opts,
    headers: {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      Authorization: `Bearer ${token}`,
      ...(opts?.headers || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || `GitHub API error ${res.status}`);
  }
  return data;
}

export async function verifyToken(token) {
  return ghFetch("/user", {}, token);
}

export async function getContentSha(token) {
  const { owner, repo, path, branch } = GITHUB_CONFIG;
  const file = await ghFetch(
    `/repos/${owner}/${repo}/contents/${encodeURIComponent(path).replace(/%2F/g, "/")}?ref=${branch}`,
    {},
    token
  );
  return file.sha;
}

export async function publishContent(token, content, message = "Update portfolio content") {
  const { owner, repo, path, branch } = GITHUB_CONFIG;
  const sha = await getContentSha(token);
  return ghFetch(
    `/repos/${owner}/${repo}/contents/${encodeURIComponent(path).replace(/%2F/g, "/")}`,
    {
      method: "PUT",
      body: JSON.stringify({
        message,
        content: utf8ToBase64(content),
        sha,
        branch,
      }),
    },
    token
  );
}
