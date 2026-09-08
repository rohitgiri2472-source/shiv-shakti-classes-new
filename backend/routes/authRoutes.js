const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

function makeToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

function safeUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    className: user.className,
    role: user.role
  };
}

router.post("/register", async (req, res) => {
  try {
    const { name, email, phone, className, password } = req.body;
    if (!name || !email || !phone || !className || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }
    if (password.length < 6) return res.status(400).json({ message: "Password must be at least 6 characters." });

    const exists = await User.findOne({ $or: [{ email: email.toLowerCase() }, { phone }] });
    if (exists) return res.status(409).json({ message: "Email or mobile number is already registered." });

    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({
      name, email: email.toLowerCase(), phone, className: Number(className), password: hashed, role: "student"
    });

    res.status(201).json({ token: makeToken(user._id), user: safeUser(user) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password) return res.status(400).json({ message: "Email/mobile and password are required." });

    const user = await User.findOne({
      $or: [{ email: identifier.toLowerCase() }, { phone: identifier }]
    });
    if (!user) return res.status(401).json({ message: "Invalid email/mobile or password." });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Invalid email/mobile or password." });

    res.json({ token: makeToken(user._id), user: safeUser(user) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;