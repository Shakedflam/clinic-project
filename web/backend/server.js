

const express = require("express"); // allows us to create a server and define routes
const cors = require("cors"); // allows get requests from other region (frontend)
const crypto = require("crypto"); // imports uuid - unique id

const CLINIC_OPEN = "09:00";
const CLINIC_CLOSE = "18:00";
const MEETING_MINUTES = 45;

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
    .filter(a => a.date === date && a.status !== "cancelled")
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

// Approve appointment- changes status
app.patch("/api/appointments/:id/approve", (req, res) => {
  const { id } = req.params;

  const appt = appointments.find((a) => a.id === id);
  if (!appt) {
    return res.status(404).json({ error: "Appointment not found" });
  }
  appt.status = "approved";
  res.json(appt);
});


// Cancel appointment
app.patch("/api/appointments/:id/cancel", (req, res) => {
  // id from url
  const { id } = req.params;
  // find appointment with matching id
  const appt = appointments.find((a) => a.id === id);
  if (!appt) {
    return res.status(404).json({ error: "Appointment not found" });
  }

  appt.status = "cancelled";
  res.json(appt);
});


app.get("/api/appointments", (req, res) => {
  res.json(appointments);
});

app.get("/api/slots", (req, res) => {
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({ error: "Missing ?date=YYYY-MM-DD" });
  }

  const available = getAvailableSlots(date);
  res.json({ date, meetingMinutes: MEETING_MINUTES, available });
});


const PORT = 3000;


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});