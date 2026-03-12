
const express = require("express"); // allows us to create a server and define routes
const cors = require("cors"); // allows get requests from other region (frontend)
const crypto = require("crypto"); // imports uuid - unique id

const CLINIC_OPEN = "09:00";
const CLINIC_CLOSE = "18:00";
const MEETING_MINUTES = 45;

//login related constants
const ADMIN_USERNAME = "roni";
const ADMIN_PASSWORD = "123456";
const ADMIN_TOKEN = crypto.randomUUID();

function timeToMinutes(t) {
  const [hh, mm] = t.split(":").map(Number);
  return hh * 60 + mm;
}

function minutesToTime(m) {
  const hh = String(Math.floor(m / 60)).padStart(2, "0");
  const mm = String(m % 60).padStart(2, "0");
  return `${hh}:${mm}`;
}

function buildSlotsForDay() {
  const start = timeToMinutes(CLINIC_OPEN);
  const end = timeToMinutes(CLINIC_CLOSE);
  const slots = [];
  for (let t = start; t + MEETING_MINUTES <= end; t += MEETING_MINUTES) {
    slots.push(minutesToTime(t));
  }
  return slots;
}

function getTakenTimesForDate(date) {
  // gets only are not cancelled and return time of them
  return appointments
    .filter(a => a.date === date && a.status !== "canceled")
    .map(a => a.time);
}

function getAvailableSlots(date) {
  const all = buildSlotsForDay();
  const taken = new Set(getTakenTimesForDate(date));
  return all.filter(t => !taken.has(t));
}


// the server instance
const app = express();

app.use(cors());

//Allows server to read JSON from request body
app.use(express.json());

let appointments = [];

app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body;

  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Invalid username or password" });
  }

  res.json({ token: ADMIN_TOKEN });
});

function requireAdminAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Missing Authorization header" });
  }

  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || token !== ADMIN_TOKEN) {
    return res.status(401).json({ error: "Invalid or missing admin token" });
  }

  next();
}

// Handles POST method request
app.post("/api/appointments", (req, res) => {
  //new appointment object, with unique id, time of request and status. copies all properties from request body
  const { date, time } = req.body;
    if (!date || !time) {
    return res.status(400).json({ error: "date and time are required" });
    }

  const allSlots = buildSlotsForDay();
  if (!allSlots.includes(time)) {
    return res.status(400).json({
      error: `Invalid time slot. Must be one of: ${allSlots.join(", ")}`
  });
  }

  const taken = getTakenTimesForDate(date);
  if (taken.includes(time)) {
    return res.status(409).json({ error: "Time slot is already booked" });
  }

  const appointment = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    status: "pending",
    ...req.body,
  };
  appointments.push(appointment);
  console.log("New appointment:", appointment);
 res.status(201).json(appointment);
});

app.patch("/api/appointments/:id", requireAdminAuth, (req, res) => {
  const { id } = req.params;
  const { status, date, time } = req.body;
  const appt = appointments.find((a) => a.id === id);

  if (!appt) {
    return res.status(404).json({ error: "Appointment not found" });
  }
  if (status !== undefined) {
    const allowedStatuses = ["pending", "approved", "canceled"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }
    appt.status = status;
  }
  const nextDate = date !== undefined ? date : appt.date;
  const nextTime = time !== undefined ? time : appt.time;
  if (date !== undefined || time !== undefined) {
    const allSlots = buildSlotsForDay();
    if (!allSlots.includes(nextTime)) {
      return res.status(400).json({
        error: `Invalid time slot. Must be one of: ${allSlots.join(", ")}`
      });
    }
    const conflict = appointments.find(
      (a) =>
        a.id !== id &&
        a.date === nextDate &&
        a.time === nextTime &&
        a.status !== "canceled"
    );
    if (conflict) {
      return res.status(409).json({ error: "Time slot is already booked" });
    }
    appt.date = nextDate;
    appt.time = nextTime;
  }
  res.json(appt);
});


app.get("/api/slots", (req, res) => {
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({ error: "Missing ?date=YYYY-MM-DD" });
  }

  const available = getAvailableSlots(date);
  res.json({ date, meetingMinutes: MEETING_MINUTES, available });
});

app.get("/api/appointments", requireAdminAuth, (req, res) => {
  // support filtering: ?status=pending
  const { status } = req.query; // equals to const status = req.query.status

  if (status) {
    const filtered = appointments.filter((a) => a.status === status);
    return res.json(filtered);
  }

  res.json(appointments);
});

const PORT = 3000;


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});