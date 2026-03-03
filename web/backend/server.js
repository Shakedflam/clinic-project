const express = require("express"); // allows us to create a server and define routes
const cors = require("cors"); // allows get requests from other region (frontend)
const crypto = require("crypto"); // imports uuid - unique id

// the server instance
const app = express();

app.use(cors());

//Allows server to read JSON from request body
app.use(express.json());

let appointments = [];

// Handles POST method request
app.post("/api/appointments", (req, res) => {
  //new appointment object, with unique id, time of request and status. copies all properties from request body
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


const PORT = 3000;


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});