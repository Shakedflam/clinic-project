const ADMIN_SESSION_KEY = "roniAdminLoggedIn";

export function loginAdmin(username, password) {
  if (username === "roni" && password === "1234") {
    sessionStorage.setItem(ADMIN_SESSION_KEY, "true");
    return true;
  }

  return false;
}

export function logoutAdmin() {
  sessionStorage.removeItem(ADMIN_SESSION_KEY);
}

export function isAdminLoggedIn() {
  return sessionStorage.getItem(ADMIN_SESSION_KEY) === "true";
}