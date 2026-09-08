const mongoose = require("mongoose");

const lectureSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  subject: { type: String, required: true, trim: true },
  className: { type: Number, required: true, min: 1, max: 10 },
  teacher: { type: String, default: "" },
  videoUrl: { type: String, required: true },
  duration: { type: String, default: "" },
  isPublished: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model("Lecture", lectureSchema);