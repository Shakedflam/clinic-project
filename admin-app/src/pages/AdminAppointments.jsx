import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { loadAppointments, updateAppointment } from "../api/appointments";
import { logoutAdmin, isAdminLoggedIn  } from "../api/auth";

function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // for logout:
  const navigate = useNavigate();
  const warningTimerRef = useRef(null);


  async function loadPending() {
  setLoading(true);
  setErr("");
  try {
    const data = await loadAppointments("pending");
    setAppointments(data);
  } catch (e) {
    console.error(e);
    setErr("לא הועלו תורים מהשרת");
    setAppointments([]);
  } finally {
    setLoading(false);
  }
}


useEffect(() => {
  if (!isAdminLoggedIn()) {
    navigate("/login");
    return;
  }

  loadPending();
}, [navigate]);

  // asking patch from the server in order to approve
  async function approve(id) {
  try {
    const updated = await updateAppointment(id, { status: "approved" });
    setAppointments((prev) => prev.filter((a) => a.id !== updated.id));
  } catch (e) {
    console.error(e);
    setErr("לא הצלחתי לאשר את התור");
  }
}

async function cancel(id) {
  try {
    const updated = await updateAppointment(id, { status: "canceled" });
    setAppointments((prev) => prev.filter((a) => a.id !== updated.id));
  } catch (e) {
    console.error(e);
    setErr("לא הצלחתי לבטל את התור");
  }
}

  function logout() {
    logoutAdmin();
    navigate("/login");
  }

  function clearAdminTimers() {
    if (warningTimerRef.current) {
      clearTimeout(warningTimerRef.current);
    }
  }

  function startAdminTimers() {
    clearAdminTimers();

    warningTimerRef.current = setTimeout(() => {
      const keepGoing = window.confirm(
      "Approve in order to stay connected."
    );
    if (keepGoing) {
      resetAdminInactivity();
    } else {
      logout();
    }
    }, 5 * 60 * 1000);
  }

  function resetAdminInactivity() {
    startAdminTimers();
  }

  // run the code as the component loads
  useEffect(() => {
    // events that we consider as activity, no mousemove as it will be inefficient to recal timers on every small mouse move
    const activityEvents = ["click", "keydown", "scroll"];

    function handleActivity() {
      resetAdminInactivity();
    }

    activityEvents.forEach((eventName) => {
      window.addEventListener(eventName, handleActivity);
    });
    startAdminTimers();

    return () => {
      activityEvents.forEach((eventName) => {
        window.removeEventListener(eventName, handleActivity);
      });
      clearAdminTimers();
    };
    // the [] ,makes sure that the useEffect runs only once
  }, []);

  return (
    <div style={{ maxWidth: 900 }}>
      <h2>ניהול תורים (Roni Admin)</h2>
    
      <button onClick={loadPending} disabled={loading}> 
        רענון
      </button>

      <button  style={{ color: "red" }} onClick={logout}>
        התנתקות
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