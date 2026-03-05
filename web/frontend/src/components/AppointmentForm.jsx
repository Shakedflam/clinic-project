import { useEffect, useState } from "react";

function AppointmentForm({ onSubmit }) {
const [form, setForm] = useState({
    name: "",
    phone: "",
    mail: "",
    date: "",
    time: "",
})

const [slots, setSlots] = useState([]);
const [slotsLoading, setSlotsLoading] = useState(false);
const [slotsError, setSlotsError] = useState("");
// Updates the specific field that changed in the form state
// name is the input field name attribute (one of name, phone ...)
// value - name's value
// ...prev keeps the previous form values
    function handleChange(e) {
        const { name, value } = e.target;
        setForm(prev => {
      if (name === "date") {
        return { ...prev, date: value, time: "" }; 
      }
      return { ...prev, [name]: value };
      });
    }

    // load only aviable slots
    useEffect(() => {
      // calls backend API
    async function loadSlots() {
      // no date -> no slots
      if (!form.date) {
        setSlots([]);
        setSlotsError("");
        return;
      }

      setSlotsLoading(true);
      setSlotsError("");

      try {
        const res = await fetch(
          `http://localhost:3000/api/slots?date=${form.date}`
        );

        if (!res.ok) {
          // fail to fetch slot from server
          const text = await res.text();
          throw new Error(text || `Server error ${res.status}`);
        }
        // convert data to json
        const data = await res.json();

        const available = Array.isArray(data.available) ? data.available : [];
        // Save available slots, UI updates
        setSlots(available);

        // If current selected time is no longer available, clear it
        if (form.time && !available.includes(form.time)) {
          setForm((prev) => ({ ...prev, time: "" }));
        }
      } catch (err) {
        console.error(err);
        setSlots([]);
        setSlotsError("לא הצלחתי להביא שעות פנויות מהשרת");
        // Also clear time so user can't submit a stale value
        if (form.time) {
          setForm((prev) => ({ ...prev, time: "" }));
        }
      } finally {
        setSlotsLoading(false);
      }
    }

    loadSlots();
    // only rerun when date changes
  }, [form.date]); 

    // when the user press submit
    // we prevernt the def behaviour of html of reloading the page and lets react know that we make change
    // onsubmit?.(form)- if onsubmit exists- call it with the form format
    async function handleSubmit(e) {
      e.preventDefault();

      if (!form.name || !form.phone || !form.date || !form.time) {
        alert("נא למלא: שם, טלפון, תאריך וזמן.");
        return;
      }
      if (!slots.includes(form.time)) {
        alert("השעה שנבחרה לא פנויה. אנא בחר שעה מהרשימה.");
        return;
      }

      try {
        await onSubmit?.(form);
        alert("נשלח לשרת בהצלחה!");
        setForm({ name: "", phone: "", mail: "", date: "", time: "" });
        setSlots([]);
        setSlotsError("");
      } catch (err) {
        console.error(err);
        alert("משהו נכשל בשליחה לשרת");
      }
    }
    // !! convert to boolean, if empty- false, else true
    const canSubmit =
    !!form.name &&
    !!form.phone &&
    !!form.date &&
    !!form.time &&
    //send after load
    !slotsLoading &&
    slots.includes(form.time);


    // when submitted call handleSubmit 
    return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12, maxWidth: 400 }}>
      <label>
        שם מלא
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="שם: "
          required
        />
      </label>

      <label>
        טלפון
        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="05X-XXXXXXX"
          inputMode="numeric"
          required
        />
      </label>
      <label>
        אימייל (אופציונלי)
        <input
          name="mail"
          value={form.mail}
          onChange={handleChange}
          placeholder="name@example.com"
          type="email"
        />
      </label>

      <label>
        תאריך
        <input
          name="date"
          value={form.date}
          onChange={handleChange}
          type="date"
          required
        />
      </label>

      <label>
       שעה
        <select
          name="time"
          value={form.time}
          onChange={handleChange}
          required
          disabled={!form.date || slotsLoading || slots.length === 0}
        >
          <option value="">
            {!form.date
              ? "בחר תאריך קודם"
              : slotsLoading
              ? "טוען שעות..."
              : slots.length === 0
              ? "אין שעות פנויות"
              : "בחר שעה"}
          </option>

          {slots.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </label>

      {slotsError && (
        <div style={{ color: "crimson", fontSize: 14 }}>{slotsError}</div>
      )}

      <button type="submit" disabled={!canSubmit}>
        שליחת בקשה
      </button>
    </form>
  );
}

export default AppointmentForm;