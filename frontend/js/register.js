const registerForm = document.getElementById("registerForm");
const registerMessage = document.getElementById("registerMessage");

registerForm.addEventListener("submit", async e => {
  e.preventDefault();
  registerMessage.textContent = "Creating account...";
  registerMessage.style.color = "#66758c";
  try {
    const data = await apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        name: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        className: Number(document.getElementById("className").value),
        password: document.getElementById("password").value
      })
    });
    localStorage.setItem("shivToken", data.token);
    localStorage.setItem("shivUser", JSON.stringify(data.user));
    window.location.href = "dashboard.html";
  } catch (error) {
    registerMessage.textContent = error.message;
    registerMessage.style.color = "#c0392b";
  }
});