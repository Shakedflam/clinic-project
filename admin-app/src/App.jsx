import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLogin from "./pages/AdminLogin";
import AdminAppointments from "./pages/AdminAppointments";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminAppointments />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;