const express = require("express");
const Lecture = require("../models/Lecture");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, async (req, res) => {
  try {
    const filter = { isPublished: true };
    if (req.user.role !== "admin") filter.className = req.user.className;
    const lectures = await Lecture.find(filter).sort({ createdAt: -1 });
    res.json({ lectures });
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const lecture = await Lecture.create(req.body);
    res.status(201).json({ lecture });
  } catch (error) { res.status(400).json({ message: error.message }); }
});

router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    await Lecture.findByIdAndDelete(req.params.id);
    res.json({ message: "Lecture deleted." });
  } catch (error) { res.status(500).json({ message: error.message }); }
});

module.exports = router;