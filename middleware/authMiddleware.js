// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ১. টোকেন ভেরিফিকেশন এবং ইউজার লোড করা
exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // টোকেন বের করা (Bearer <token>)
      token = req.headers.authorization.split(" ")[1];

      // ডিকোড করা
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // টোকেন থেকে id নিয়ে ডাটাবেস থেকে ইউজার বের করা (password ছাড়া)
      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

// ২. রোল পারমিশন চেক করা
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Role (${req.user?.role}) is not allowed to access this resource`,
      });
    }
    next();
  };
};
