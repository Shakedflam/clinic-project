const ADMIN_TOKEN_KEY = "adminToken";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000";

export async function loginAdmin(username, password) {
  const res = await fetch(`${API_BASE}/api/admin/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    throw new Error("Login failed");
  }
  const data = await res.json();
  sessionStorage.setItem(ADMIN_TOKEN_KEY, data.token);
}

export function logoutAdmin() {
  sessionStorage.removeItem(ADMIN_TOKEN_KEY);
}

export function isAdminLoggedIn() {
  return Boolean(sessionStorage.getItem(ADMIN_TOKEN_KEY));
}

export function getAdminToken() {
  return sessionStorage.getItem(ADMIN_TOKEN_KEY);
}