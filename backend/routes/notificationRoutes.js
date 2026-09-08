const express = require("express");
const Notification = require("../models/Notification");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, async (req, res) => {
  try {
    const filter = { $or: [{ className: null }, { className: req.user.className }] };
    const notifications = await Notification.find(filter).sort({ createdAt: -1 }).limit(20);
    res.json({ notifications });
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const notification = await Notification.create(req.body);
    res.status(201).json({ notification });
  } catch (error) { res.status(400).json({ message: error.message }); }
});

router.patch("/:id/read", protect, async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { $addToSet: { readBy: req.user._id } });
    res.json({ message: "Notification marked as read." });
  } catch (error) { res.status(500).json({ message: error.message }); }
});

module.exports = router;