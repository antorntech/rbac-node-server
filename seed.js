// seed.js (Updated for Debugging)
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

dotenv.config();

const seedSuperAdmin = async () => {
  try {
    console.log("Connecting to:", process.env.MONGO_URI); // ১. ইউআরএল প্রিন্ট হবে

    await mongoose.connect(process.env.MONGO_URI);

    // ২. ডাটাবেসের নাম প্রিন্ট হবে (খুবই গুরুত্বপূর্ণ)
    console.log("Connected to Database Name:", mongoose.connection.name);

    // আগের ইউজার ডিলিট করা (ক্লিন স্লেট এর জন্য)
    await User.deleteMany({ email: "super@admin.com" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("123456", salt);

    const superAdmin = new User({
      name: "Super Admin",
      email: "super@admin.com",
      password: hashedPassword,
      role: "superadmin",
    });

    const savedUser = await superAdmin.save();

    // ৩. সেভ হওয়ার পর কনফার্মেশন এবং আইডি প্রিন্ট
    console.log("Superadmin created successfully!");
    console.log("User ID:", savedUser._id);
    console.log("Saved in Collection:", User.collection.name);

    process.exit();
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
};

seedSuperAdmin();
