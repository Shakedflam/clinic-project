import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminLogin from "./pages/AdminLogin";
import AdminAppointments from "./pages/AdminAppointments";

function ProtectedAdminRoute({ children }) {
  const isLoggedIn = sessionStorage.getItem("roniAdminLoggedIn") === "true";
  return isLoggedIn ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<AdminLogin />} />
        <Route
          path="/appointments"
          element={
            <ProtectedAdminRoute>
              <AdminAppointments />
            </ProtectedAdminRoute>
          }
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
