import AppointmentForm from "../../components/AppointmentForm";

// formData- the date that the user fill
export default function AppointmentPage() {
  async function handleAppointmentSubmit(formData) {
    const res = await fetch("http://localhost:3000/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });


    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Server error ${res.status}: ${text}`);
    }

    const data = await res.json();
    console.log("Server said:", data);
    return data;
  }

  return (
    <div>
      <h2>קביעת תור</h2>
      <AppointmentForm onSubmit={handleAppointmentSubmit} />
    </div>
  );
}