const adminToken = localStorage.getItem("shivToken");
const adminUser = JSON.parse(localStorage.getItem("shivUser") || "{}");
if (!adminToken || adminUser.role !== "admin") window.location.href = "login.html";

const form = document.getElementById("lectureForm");
const msg = document.getElementById("adminMessage");

form.addEventListener("submit", async e => {
  e.preventDefault();
  try {
    await apiRequest("/lectures", {
      method: "POST",
      body: JSON.stringify({
        title: document.getElementById("lectureTitle").value,
        subject: document.getElementById("lectureSubject").value,
        className: Number(document.getElementById("lectureClass").value),
        teacher: document.getElementById("lectureTeacher").value,
        videoUrl: document.getElementById("lectureUrl").value,
        duration: document.getElementById("lectureDuration").value
      })
    });
    msg.textContent = "Lecture added successfully.";
    msg.style.color = "#23834b";
    form.reset();
  } catch (error) { msg.textContent = error.message; msg.style.color = "#c0392b"; }
});

document.getElementById("announcementForm").addEventListener("submit", async e => {
  e.preventDefault();
  try {
    await apiRequest("/announcements", { method:"POST", body: JSON.stringify({
      title: document.getElementById("announcementTitle").value,
      message: document.getElementById("announcementMessage").value,
      className: Number(document.getElementById("announcementClass").value) || null,
      isPublic: document.getElementById("announcementPublic").checked
    })});
    document.getElementById("announcementMessageBox").textContent = "Announcement added successfully.";
    e.target.reset();
  } catch(error) { document.getElementById("announcementMessageBox").textContent = error.message; }
});

document.getElementById("notificationForm").addEventListener("submit", async e => {
  e.preventDefault();
  try {
    await apiRequest("/notifications", { method:"POST", body: JSON.stringify({
      title: document.getElementById("notificationTitle").value,
      message: document.getElementById("notificationText").value,
      className: Number(document.getElementById("notificationClass").value) || null
    })});
    document.getElementById("notificationMessageBox").textContent = "Notification sent.";
    e.target.reset();
  } catch(error) { document.getElementById("notificationMessageBox").textContent = error.message; }
});

document.getElementById("logoutBtn").addEventListener("click", () => { localStorage.clear(); location.href="login.html"; });