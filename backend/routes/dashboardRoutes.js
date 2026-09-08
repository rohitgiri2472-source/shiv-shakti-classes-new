const express = require("express");
const Lecture = require("../models/Lecture");
const Announcement = require("../models/Announcement");
const Notification = require("../models/Notification");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, async (req, res) => {
  try {
    const classFilter = { $or: [{ className: null }, { className: req.user.className }] };
    const [lectures, announcements, notifications] = await Promise.all([
      Lecture.find({ className: req.user.className, isPublished: true }).sort({ createdAt: -1 }),
      Announcement.find(classFilter).sort({ createdAt: -1 }).limit(10),
      Notification.find(classFilter).sort({ createdAt: -1 }).limit(10)
    ]);
    res.json({ user: req.user, lectures, announcements, notifications });
  } catch (error) { res.status(500).json({ message: error.message }); }
});

module.exports = router;