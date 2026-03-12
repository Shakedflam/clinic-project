import { API_BASE } from "../config";
import { getAdminToken } from "./auth";

export async function loadAppointments(status) {
  const token = getAdminToken();

  let url = `${API_BASE}/api/appointments`;
  if (status) {
    url += `?status=${status}`;
  }

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

export async function updateAppointment(id, updates) {
  const token = getAdminToken();

  const res = await fetch(`${API_BASE}/api/appointments/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updates),
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return await res.json();
}