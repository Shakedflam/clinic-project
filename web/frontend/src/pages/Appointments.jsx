import AppointmentForm from "../components/AppointmentForm";

// formData- the date that the user fill
export default function AppointmentPage() {
  async function handleAppointmentSubmit(formData) {
    try {
      const res = await fetch("http://localhost:3000/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      console.log("Server said:", data);
      alert("נשלח לשרת בהצלחה!");
    } catch (err) {
      console.error(err);
      alert("משהו נכשל בשליחה לשרת");
    }
  }

  return (
    <div>
      <h2>קביעת תור</h2>
      <AppointmentForm onSubmit={handleAppointmentSubmit} />
    </div>
  );
}