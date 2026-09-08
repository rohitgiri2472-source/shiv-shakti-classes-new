document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("shivToken");

    // Student must be logged in
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    loadStudentInfo();
    loadLectures();
    loadAnnouncements();
    loadNotifications();

    // Logout
    const logoutBtn = document.getElementById("logoutBtn");

    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("shivToken");
            localStorage.removeItem("shivUser");
            window.location.href = "login.html";
        });
    }

    // Mobile sidebar
    const menuBtn = document.getElementById("dashboardMenu");
    const sidebar = document.getElementById("sidebar");

    if (menuBtn && sidebar) {
        menuBtn.addEventListener("click", () => {
            sidebar.classList.toggle("open");
        });
    }
});


// ===============================
// STUDENT INFORMATION
// ===============================

function loadStudentInfo() {
    const storedUser = localStorage.getItem("shivUser");

    if (!storedUser) {
        return;
    }

    try {
        const user = JSON.parse(storedUser);

        const name = user.name || "Student";
        const email = user.email || "—";
        const phone = user.phone || "—";
        const className = user.className || "—";

        document.getElementById("welcomeText").textContent =
            `Welcome back, ${name}!`;

        document.getElementById("studentName").textContent = name;
        document.getElementById("studentClass").textContent =
            `Class ${className}`;

        document.getElementById("profileName").textContent = name;
        document.getElementById("profileEmail").textContent = email;
        document.getElementById("profilePhone").textContent = phone;
        document.getElementById("profileClass").textContent =
            `Class ${className}`;

        const avatar = document.querySelector(".mini-avatar");

        if (avatar) {
            avatar.textContent = name.charAt(0).toUpperCase();
        }

    } catch (error) {
        console.error("Unable to read student information:", error);
    }
}


// ===============================
// ANNOUNCEMENTS
// ===============================

async function loadAnnouncements() {
    const announcementContainer =
        document.getElementById("dashboardAnnouncements");

    if (!announcementContainer) {
        return;
    }

    try {
        announcementContainer.innerHTML =
            '<p class="loading">Loading announcements...</p>';

        const data = await apiRequest("/announcements");

        const announcements = data.announcements || [];

        if (announcements.length === 0) {
            announcementContainer.innerHTML =
                '<p class="muted">No announcements available.</p>';
            return;
        }

        announcementContainer.innerHTML = announcements.map(announcement => {
            const date = announcement.createdAt
                ? new Date(announcement.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric"
                })
                : "";

            return `
                <div class="announcement-item">
                    <div class="announcement-content">
                        <h3>${escapeHTML(announcement.title || "Announcement")}</h3>
                        <p>${escapeHTML(announcement.message || "")}</p>
                        <small>${date}</small>
                    </div>
                </div>
            `;
        }).join("");

    } catch (error) {
        console.error("Announcement error:", error);

        announcementContainer.innerHTML =
            `<p class="muted">Unable to load announcements.</p>`;
    }
}


// ===============================
// LECTURES
// ===============================

async function loadLectures() {
    const lectureList = document.getElementById("lectureList");

    if (!lectureList) {
        return;
    }

    try {
        const data = await apiRequest("/lectures");

        const lectures = data.lectures || [];

        document.getElementById("lectureCount").textContent =
            lectures.length;

        if (lectures.length === 0) {
            lectureList.innerHTML =
                '<p class="muted">No lectures available yet.</p>';
            return;
        }

        lectureList.innerHTML = lectures.map(lecture => `
            <div class="lecture-card">
                <h3>${escapeHTML(lecture.title || "Lecture")}</h3>
                <p>${escapeHTML(lecture.description || "")}</p>
                ${
                    lecture.videoUrl
                    ? `<a href="${lecture.videoUrl}" target="_blank" class="btn btn-primary">Watch Lecture</a>`
                    : ""
                }
            </div>
        `).join("");

    } catch (error) {
        console.error("Lecture error:", error);

        lectureList.innerHTML =
            '<p class="muted">Unable to load lectures.</p>';
    }
}


// ===============================
// NOTIFICATIONS
// ===============================

async function loadNotifications() {
    const notificationList =
        document.getElementById("notificationList");

    if (!notificationList) {
        return;
    }

    try {
        const data = await apiRequest("/notifications");

        const notifications = data.notifications || [];

        const countElement =
            document.getElementById("notificationCount");

        if (countElement) {
            countElement.textContent = notifications.length;
        }

        if (notifications.length === 0) {
            notificationList.innerHTML =
                '<p class="muted">No notifications.</p>';
            return;
        }

        notificationList.innerHTML = notifications.map(notification => `
            <div class="notification-item">
                <strong>${escapeHTML(notification.title || "Notification")}</strong>
                <p>${escapeHTML(notification.message || "")}</p>
            </div>
        `).join("");

    } catch (error) {
        console.error("Notification error:", error);

        notificationList.innerHTML =
            '<p class="muted">Unable to load notifications.</p>';
    }
}


// ===============================
// SECURITY HELPER
// ===============================

function escapeHTML(value) {
    const div = document.createElement("div");
    div.textContent = value;
    return div.innerHTML;
}