// export const analyzeeRepo = async (repoUrl) => {
//   const token = localStorage.getItem("token");

//   const response = await fetch(
//     `http://127.0.0.1:8000/analyze?repo_url=${repoUrl}`,
//     {
//       headers: {
//         Authorization: `Bearer ${token}`
//       }
//     }
//   );

//   return await response.json();
// };
// api.js — BugHunter Frontend API Client
// Supports: GitHub Repo, Pasted Code, File Upload, URL scan

// api.js — BugHunter Frontend API Client
// Supports: GitHub Repo, Pasted Code, File Upload, URL scan

const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function handleError(data, res) {
  if (!res.ok) {
    throw new Error(
      typeof data.detail === "string"
        ? data.detail
        : data.detail?.[0]?.msg || `Request failed (${res.status})`
    );
  }
}

// ── 1. GitHub Repo ────────────────────────────────────────────────────────────
export async function analyzeeRepo(repoUrl) {
  const res = await fetch(
    `${BASE_URL}/analyze?repo_url=${encodeURIComponent(repoUrl)}`,
    { method: "GET", headers: getAuthHeaders() }
  );
  const data = await res.json();
  handleError(data, res);
  return data;
}

// ── 2. Pasted Code ────────────────────────────────────────────────────────────
export async function analyzePaste(code, fileName = "snippet.txt") {
  const res = await fetch(`${BASE_URL}/analyze/paste`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ code, file_name: fileName }),
  });
  const data = await res.json();
  handleError(data, res);
  return data;
}

// ── 3. File Upload ────────────────────────────────────────────────────────────
export async function analyzeFile(file) {
  const token = localStorage.getItem("token");
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${BASE_URL}/analyze/file`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });
  const data = await res.json();
  handleError(data, res);
  return data;
}

// ── 4. Website URL ────────────────────────────────────────────────────────────
export async function analyzeWebUrl(url) {
  const res = await fetch(`${BASE_URL}/analyze/url`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ url }),
  });
  const data = await res.json();
  handleError(data, res);
  return data;
}