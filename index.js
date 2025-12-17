const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const connectDB = require("./db/connect");

// কনফিগারেশন লোড করা
dotenv.config();

const app = express();

// মিডলওয়্যার (Middleware)
app.use(express.json()); // রিকোয়েস্ট বডি থেকে JSON ডাটা পড়ার জন্য

// কানেকশন ফাংশন কল করা
connectDB();

// রাউট ইমপোর্ট করা
const authRoutes = require("./routes/v1/authRoutes");
app.use("/api/v1/auth", authRoutes);

// বেসিক রাউট (টেস্টিং এর জন্য)
app.get("/", (req, res) => {
  res.send("Welcome to Server!");
});

// সার্ভার লিসেনিং (Server Listening)
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
