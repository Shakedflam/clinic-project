import { API_BASE } from "../config";

export async function createAppointment(formData) {
  const res = await fetch(`${API_BASE}/api/appointments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return await res.json();
}