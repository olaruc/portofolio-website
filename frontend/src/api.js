const BASE = import.meta.env.VITE_API_URL || "";

export async function fetchPortfolio() {
  const res = await fetch(`${BASE}/api/portfolio`);
  if (!res.ok) throw new Error("Failed to load portfolio");
  return res.json();
}

export async function sendContact(payload) {
  const res = await fetch(`${BASE}/api/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.detail?.[0]?.msg || "Failed to send message");
  }
  return data;
}
