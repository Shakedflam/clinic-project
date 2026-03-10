import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdmin, isAdminLoggedIn } from "../api/auth";

function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (isAdminLoggedIn()) {
      navigate("/appointments");
    }
  }, [navigate]);

  function handleSubmit(e) {
    e.preventDefault();
    if (loginAdmin(username, password)) {
      navigate("/appointments");
    } else {
      alert("שם משתמש או סיסמה שגויים");
}
}

  return (
    <div>
      <h2>כניסת מנהל</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>שם משתמש</label>
          <br />
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div>
          <label>סיסמה</label>
          <br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit">התחבר</button>
      </form>
    </div>
  );
}

export default AdminLogin;