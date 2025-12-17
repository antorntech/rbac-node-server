// controllers/authController.js
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ১. লগিন (শুধুমাত্র টোকেন রিটার্ন করবে)
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    // টোকেন জেনারেট
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // শুধুমাত্র টোকেন পাঠানো হচ্ছে
    res.json({
      message: "Login Successful",
      token: token,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ২. বর্তমান ইউজারের তথ্য পাওয়া (/get_user)
exports.getMe = async (req, res) => {
  try {
    // middleware এর মাধ্যমে req.user এ ডাটা সেট হয়ে আছে
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// ৩. নতুন ইউজার তৈরি (Role Based Creation)
exports.createUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  const requesterRole = req.user.role; // যিনি রিকোয়েস্ট করছেন তার রোল

  try {
    // লজিক: কে কাকে তৈরি করতে পারবে
    if (requesterRole === "admin" && role === "superadmin") {
      return res
        .status(403)
        .json({ message: "Admin cannot create Superadmin" });
    }
    if (requesterRole === "admin" && role === "admin") {
      return res
        .status(403)
        .json({ message: "Admin cannot create other Admin" });
    }
    // Superadmin চাইলে admin বা user বানাতে পারে, Admin শুধু user বানাতে পারে।

    // ডুপ্লিকেট চেকিং
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
    });

    await user.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
