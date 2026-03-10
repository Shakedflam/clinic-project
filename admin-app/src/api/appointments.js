import { API_BASE } from "../config";

export async function loadPendingAppointments() {
  const res = await fetch(`${API_BASE}/api/appointments?status=pending`);
  if (!res.ok) {
    throw new Error(await res.text());
  }
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

export async function approveAppointment(id) {
  const res = await fetch(`${API_BASE}/api/appointments/${id}/approve`, {
    method: "PATCH",
  });
  if (!res.ok) {
    throw new Error(await res.text());
  }
  return await res.json();
}

export async function cancelAppointment(id) {
  const res = await fetch(`${API_BASE}/api/appointments/${id}/cancel`, {
    method: "PATCH",
  });
  if (!res.ok) {
    throw new Error(await res.text());
  }
  return await res.json();
}