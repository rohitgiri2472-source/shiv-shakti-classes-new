const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");
const password = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");

togglePassword.addEventListener("click", () => {
  const hidden = password.type === "password";
  password.type = hidden ? "text" : "password";
  togglePassword.textContent = hidden ? "Hide" : "Show";
});

loginForm.addEventListener("submit", async e => {
  e.preventDefault();
  loginMessage.textContent = "Logging in...";
  loginMessage.style.color = "#66758c";
  try {
    const identifier = document.getElementById("loginId").value.trim();
    const data = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ identifier, password: password.value })
    });
    localStorage.setItem("shivToken", data.token);
    localStorage.setItem("shivUser", JSON.stringify(data.user));
    window.location.href = data.user.role === "admin" ? "admin.html" : "dashboard.html";
  } catch (error) {
    loginMessage.textContent = error.message;
    loginMessage.style.color = "#c0392b";
  }
});

document.getElementById("forgotPassword").addEventListener("click", e => {
  e.preventDefault();
  alert("Password reset is not implemented in this starter. Add email OTP/reset-token flow later.");
});