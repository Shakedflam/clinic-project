// allows us to create a server and define routes
const express = require("express"); 
// allows get requests from other region (frontend)
const cors = require("cors"); 
// imports uuid - unique id
const crypto = require("crypto"); 
//sql
const { db, initDb } = require("./db");

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

// the server instance
const app = express();

app.use(cors());

//Allows server to read JSON from request body
app.use(express.json());

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
  const { name, phone, mail, date, time } = req.body;
  if (!name || !phone || !date || !time) {
  return res.status(400).json({ error: "name, phone, date and time are required"});
}

  const allSlots = buildSlotsForDay();
  if (!allSlots.includes(time)) {
    return res.status(400).json({
      error: `Invalid time slot. Must be one of: ${allSlots.join(", ")}`
    });
  }
  const checkSql = `
    SELECT id
    FROM appointments
    WHERE date = ? AND time = ? AND status != 'canceled'
  `;
  db.get(checkSql, [date, time], (checkErr, existingRow) => {
    if (checkErr) {
      console.error("Failed to check slot:", checkErr);
      return res.status(500).json({ error: "Database error while checking slot" });
    }
    if (existingRow) {
      return res.status(409).json({ error: "Time slot is already booked" });
    }
    const appointment = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      status: "pending",
      name,
      phone,
      mail: mail || null,
      date,
      time,
  };
    const insertSql = `
      INSERT INTO appointments (id, created_at, status, name, phone, mail, date, time)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    db.run(
      insertSql,
      [
        appointment.id,
        appointment.createdAt,
        appointment.status,
        appointment.name,
        appointment.phone,
        appointment.mail,
        appointment.date,
        appointment.time,
      ],
      function (insertErr) {
        if (insertErr) {
          console.error("Failed to save appointment:", insertErr);
          return res.status(500).json({ error: "Database error while creating appointment" });
        }

        console.log("New appointment saved:", appointment);
        res.status(201).json(appointment);
      }
    );
  });
});

app.patch("/api/appointments/:id", requireAdminAuth, (req, res) => {
  const { id } = req.params;
  const { status, date, time } = req.body;
  const loadSql = `
    SELECT id, created_at, status, name, phone, mail, date, time
    FROM appointments
    WHERE id = ?
  `;
  db.get(loadSql, [id], (loadErr, row) => {
    if (loadErr) {
      console.error("Failed to load appointment:", loadErr);
      return res.status(500).json({
        error: "Database error while loading appointment",
      });
    }
    if (!row) {
      return res.status(404).json({ error: "Appointment not found" });
    }
    if (status !== undefined) {
      const allowedStatuses = ["pending", "approved", "canceled"];
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }
    }
    const nextStatus = status !== undefined ? status : row.status;
    const nextDate = date !== undefined ? date : row.date;
    const nextTime = time !== undefined ? time : row.time;
    const allSlots = buildSlotsForDay();
    if (!allSlots.includes(nextTime)) {
      return res.status(400).json({
        error: `Invalid time slot. Must be one of: ${allSlots.join(", ")}`
      });
    }
    const conflictSql = `
      SELECT id
      FROM appointments
      WHERE id != ?
        AND date = ?
        AND time = ?
        AND status != 'canceled'
    `;
    db.get(conflictSql, [id, nextDate, nextTime], (conflictErr, conflictRow) => {
      if (conflictErr) {
        console.error("Failed to check conflict:", conflictErr);
        return res.status(500).json({
          error: "Database error while checking conflict",
        });
      }
      if (conflictRow) {
        return res.status(409).json({ error: "Time slot is already booked" });
      }
      const updateSql = `
        UPDATE appointments
        SET status = ?, date = ?, time = ?
        WHERE id = ?
      `;
      db.run(updateSql, [nextStatus, nextDate, nextTime, id], function (updateErr) {
        if (updateErr) {
          console.error("Failed to update appointment:", updateErr);
          return res.status(500).json({
            error: "Database error while updating appointment",
          });
        }
        // New JS object so the server will return as json to the client
        const updatedAppointment = {
          id: row.id,
          createdAt: row.created_at,
          status: nextStatus,
          name: row.name,
          phone: row.phone,
          mail: row.mail,
          date: nextDate,
          time: nextTime,
        };
        res.json(updatedAppointment);
      });
    });
  });
});


app.get("/api/slots", (req, res) => {
  const { date } = req.query;
  if (!date) {
    return res.status(400).json({ error: "Missing ?date=YYYY-MM-DD" });
  }
  const allSlots = buildSlotsForDay();
  const sql = `
    SELECT time
    FROM appointments
    WHERE date = ? AND status != 'canceled'
  `;
  db.all(sql, [date], (err, rows) => {
    if (err) {
      console.error("Failed to load slots:", err);
      return res.status(500).json({
        error: "Database error while loading slots",
      });
    }
    const taken = new Set(rows.map((row) => row.time));
    const available = allSlots.filter((time) => !taken.has(time));
    res.json({
      date,
      meetingMinutes: MEETING_MINUTES,
      available,
    });
  });
});


app.get("/api/appointments", requireAdminAuth, (req, res) => {
  const { status } = req.query;
  let sql = `
    SELECT id, created_at, status, name, phone, mail, date, time
    FROM appointments
  `;
  const params = [];
  if (status) {
    sql += " WHERE status = ?";
    params.push(status);
  }
  sql += " ORDER BY date ASC, time ASC";
  db.all(sql, params, (err, rows) => {
    if (err) {
      console.error("Failed to load appointments:", err);
      return res.status(500).json({
        error: "Database error while loading appointments",
      });
    }
    const appointments = rows.map((row) => ({
      id: row.id,
      createdAt: row.created_at,
      status: row.status,
      name: row.name,
      phone: row.phone,
      mail: row.mail,
      date: row.date,
      time: row.time,
    }));
    res.json(appointments);
  });
});


const PORT = 3000;
initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log("SQLite database is ready");
    });
  })
  .catch((err) => {
    console.error("Failed to initialize database:", err);
  });