// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const {
  loginUser,
  getMe,
  createUser,
  deleteUser,
} = require("../../controllers/authController");
const { protect, authorize } = require("../../middleware/authMiddleware");

// পাবলিক রাউট (সবাই এক্সেস করতে পারবে)
router.post("/login", loginUser);

// প্রাইভেট রাউট (লগিন করা থাকতে হবে) -> Get User Details
router.get("/get_user", protect, getMe);

// এডমিন রাউট (শুধুমাত্র Superadmin এবং Admin এক্সেস করতে পারবে)
// এখানে আমরা createUser কল করছি কিন্তু আগে চেক করছি সে কে
router.post(
  "/create_user",
  protect,
  authorize("superadmin", "admin"),
  createUser
);

// ডিলিট রাউট (অবশ্যই protect থাকতে হবে কারণ আমরা req.user ব্যবহার করছি)
router.delete("/delete_user/:id", protect, deleteUser);

module.exports = router;
