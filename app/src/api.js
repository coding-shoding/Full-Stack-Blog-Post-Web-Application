// Small wrapper around the browser's native fetch()
const BASE = import.meta.env.VITE_API_URL || "http://localhost:5050";

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error || `Request failed (${res.status})`);
  return body;
}

export const api = {
  latest: () => request("/posts/latest"),
  list: () => request("/posts"),
  get: (id) => request(`/posts/${id}`),
  create: (post) => request("/posts", { method: "POST", body: JSON.stringify(post) }),
  update: (id, post) => request(`/posts/${id}`, { method: "PATCH", body: JSON.stringify(post) }),
  remove: (id) => request(`/posts/${id}`, { method: "DELETE" }),
};

export const formatDate = (d) =>
  new Date(d).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
