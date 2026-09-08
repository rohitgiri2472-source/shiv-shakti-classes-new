const express = require("express");
const Announcement = require("../models/Announcement");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/public", async (req, res) => {
  try {
    const announcements = await Announcement.find({ isPublic: true }).sort({ createdAt: -1 }).limit(10);
    res.json({ announcements });
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.get("/", protect, async (req, res) => {
  try {
    const filter = { $or: [{ className: null }, { className: req.user.className }] };
    const announcements = await Announcement.find(filter).sort({ createdAt: -1 }).limit(20);
    res.json({ announcements });
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const announcement = await Announcement.create(req.body);
    res.status(201).json({ announcement });
  } catch (error) { res.status(400).json({ message: error.message }); }
});

module.exports = router;