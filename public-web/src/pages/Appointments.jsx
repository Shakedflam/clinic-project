import AppointmentForm from "../components/AppointmentForm";
import { createAppointment } from "../api/appointments";

// formData- the date that the user fill
export default function AppointmentPage() {
  async function handleAppointmentSubmit(formData) {
    const data = await createAppointment(formData);
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