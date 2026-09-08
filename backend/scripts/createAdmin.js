const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

require("dotenv").config();
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("../models/User");

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const email = process.env.ADMIN_EMAIL || "admin@shivshakti.com";
    const password = process.env.ADMIN_PASSWORD || "Admin@123456";
    const name = process.env.ADMIN_NAME || "Shiv Shakti Admin";

    const existing = await User.findOne({ email });
    if (existing) {
      console.log("Admin already exists.");
      process.exit(0);
    }

    const hashed = await bcrypt.hash(password, 12);
    await User.create({ name, email, phone: "9999999999", password: hashed, role: "admin" });
    console.log(`Admin created: ${email}`);
    console.log(`Password: ${password}`);
    process.exit(0);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
})();