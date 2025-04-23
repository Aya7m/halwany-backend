import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const protect = async (req, res, next) => {
  try {
    const { token } = req.headers;
    console.log("🔑 Token received:", token);

    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("📜 Decoded token:", decoded);

    const user = await User.findById(decoded.id).select("email cartItems role");

    console.log("👤 User found:", user);

    if (!user) {
      return res.status(401).json({ message: "Unauthorized - User not found" });
    }

    req.user = user;
    next();

  } catch (error) {
    console.error("❌ Token error:", error.message);
    return res.status(401).json({ message: "Unauthorized - Invalid token" });
  }
};



export const adminProtect = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Access denied - Admins only" });
  }
};
