import { useEffect, useState } from "react";

function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function loadPending() {
    setLoading(true);
    setErr("");
    try {
      const res = await fetch("http://localhost:3000/api/appointments?status=pending");
      // res.ok is true if status is 200-299, otherwise false
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setAppointments(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setErr("לא הועלו תורים מהשרת");
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPending();
  }, []);

  // asking patch from the server in order to approve
  async function approve(id) {
    try {
      const res = await fetch(`http://localhost:3000/api/appointments/${id}/approve`, {
        method: "PATCH",
      });
      if (!res.ok) throw new Error(await res.text());
      const updated = await res.json();

      // remove from list because it's no longer pending
      setAppointments((prev) => prev.filter((a) => a.id !== updated.id));
    } catch (e) {
      console.error(e);
      alert("אישור נכשל");
    }
  }

  async function cancel(id) {
    try {
      const res = await fetch(`http://localhost:3000/api/appointments/${id}/cancel`, {
        method: "PATCH",
      });
      if (!res.ok) throw new Error(await res.text());
      const updated = await res.json();

      // remove from list because it's no longer pending
      setAppointments((prev) => prev.filter((a) => a.id !== updated.id));
    } catch (e) {
      console.error(e);
      alert("ביטול נכשל");
    }
  }

  return (
    <div style={{ maxWidth: 900 }}>
      <h2>ניהול תורים (Roni Admin)</h2>
        
      <button onClick={loadPending} disabled={loading}> 
        רענון
      </button>

      {err && <div style={{ color: "crimson", marginTop: 8 }}>{err}</div>}
      {loading && <div style={{ marginTop: 8 }}>טוען...</div>}

      {!loading && appointments.length === 0 && (
        <div style={{ marginTop: 12 }}>אין בקשות ממתינות </div>
      )}

      <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
        {appointments.map((a) => (
          <div
            key={a.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: 10,
              padding: 12,
              display: "grid",
              gap: 6,
            }}
          >
            <div>
              <b>{a.name}</b> ({a.phone}) {a.mail ? `• ${a.mail}` : ""}
            </div>
            <div>
              {a.date} @ {a.time}
            </div>
            <div>
              סטטוס: <b>{a.status}</b>
            </div>

            <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
              <button onClick={() => approve(a.id)}>אישור</button>
              <button onClick={() => cancel(a.id)}>ביטול</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminAppointments;