const classes = Array.from({length: 10}, (_, i) => i + 1);
const classGrid = document.getElementById("classGrid");
if (classGrid) classGrid.innerHTML = classes.map(n => `<a class="class-card" href="login.html"><span>Class ${n}</span><span>→</span></a>`).join("");

const menuBtn = document.getElementById("menuBtn");
const navMenu = document.getElementById("navMenu");
if (menuBtn) menuBtn.addEventListener("click", () => navMenu.classList.toggle("open"));

async function loadPublicAnnouncements() {
  const box = document.getElementById("announcementList");
  if (!box) return;
  try {
    const data = await apiRequest("/announcements/public");
    box.innerHTML = data.announcements.length ? data.announcements.map(a => `
      <article class="announcement-item">
        <div class="announcement-icon">📢</div>
        <div><h3>${escapeHtml(a.title)}</h3><p>${escapeHtml(a.message)}</p><time>${new Date(a.createdAt).toLocaleDateString()}</time></div>
      </article>`).join("") : `<p class="muted">No announcements yet.</p>`;
  } catch {
    box.innerHTML = `<p class="muted">Announcements will appear here when the backend is connected.</p>`;
  }
}
function escapeHtml(value="") {
  return value.replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;" }[c]));
}
loadPublicAnnouncements();