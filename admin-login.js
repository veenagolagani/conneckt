function handleLogin() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const adminCode = document.getElementById("adminCode").value.trim();
  const errorMsg = document.getElementById("error");

  const VALID_EMAIL = "admin@connekt.com";
  const VALID_PASSWORD = "admin123";
  const VALID_CODE = "ADM!N@2025";

  if (email === VALID_EMAIL && password === VALID_PASSWORD && adminCode === VALID_CODE) {
    window.location.href = "admin-dashboard.html";
  } else {
    errorMsg.textContent = "Invalid email, password, or admin code.";
  }
}
