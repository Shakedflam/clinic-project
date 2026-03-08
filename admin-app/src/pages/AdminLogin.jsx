import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  function handleSubmit(e) {
  e.preventDefault();
  if (username === "roni" && password === "1234") {
    sessionStorage.setItem("roniAdminLoggedIn", "true");
    navigate("/admin");
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