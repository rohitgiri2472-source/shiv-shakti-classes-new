const dns = require("dns");

dns.setServers(["8.8.8.8", "1.1.1.1"]);
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const lectureRoutes = require("./routes/lectureRoutes");
const announcementRoutes = require("./routes/announcementRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const studentRoutes = require("./routes/studentRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
});
);



app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Shiv Shakti Classes API is running." });
});


app.use("/api/auth", authRoutes);
app.use("/api/lectures", lectureRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/fees", feeRoutes);
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || "Server error." });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});n54