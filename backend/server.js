const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const skillRoutes = require("./routes/skillRoutes");
const requestRoutes = require("./routes/requestRoutes");
const messageRoutes = require("./routes/messageRoutes");
const seedData = require("./seedData");

dotenv.config();

const app = express();

// middleware
app.use(express.json());
app.use(cors());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/messages", messageRoutes);

// Seed route
app.get("/api/seed", async (req, res) => {
  try {
    const result = await seedData();
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: "Seeding failed", error: error.message });
  }
});

app.get("/", (req, res) => {
  res.send("SkillExchange Backend is Running 🚀");
});

// server start
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
