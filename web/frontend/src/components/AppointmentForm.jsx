import { useState } from "react";

function AppointmentForm({ onSubmit }) {
const [form, setForm] = useState({
    name: "",
    phone: "",
    mail: "",
    date: "",
    time: "",
})
// Updates the specific field that changed in the form state
// name is the input field name attribute (one of name, phone ...)
// value - name's value
// ...prev keeps the previous form values
    function handleChange(e) {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    }

    // when the user press submit
    // we prevernt the def behaviour of html of reloading the page and lets react know that we make change
    // onsubmit?.(form)- if onsubmit exists- call it with the form format
    async function handleSubmit(e) {
      e.preventDefault();

      if (!form.name || !form.phone || !form.date || !form.time) {
        alert("נא למלא: שם, טלפון, תאריך וזמן.");
        return;
      }

      try {
        await onSubmit?.(form); 
        alert("נשלח לשרת בהצלחה!");

        // Reseting form after success

        setForm({ name: "", phone: "", mail: "", date: "", time: "" });
      } catch (err) {
        alert("משהו נכשל בשליחה לשרת");
      }
    }


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
        <input
          name="time"
          value={form.time}
          onChange={handleChange}
          type="time"
          required
        />
      </label>

      <button type="submit">שליחת בקשה</button>
    </form>
  );
}

export default AppointmentForm;