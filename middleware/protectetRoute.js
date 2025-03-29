import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const protect = async (req, res, next) => {
  try {
    let token;

    // التأكد من وجود التوكن في الهيدر
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "غير مصرح بالوصول، لا يوجد توكن" });
    }

    // فك تشفير التوكن
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // جلب بيانات المستخدم بدون كلمة المرور
    req.user = await User.findById(decoded.id).select("-password");

    next();
  } catch (error) {
    res.status(401).json({ message: "توكن غير صالح" });
  }
};


export const adminProtect = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(401).json({ message: "غير مصرح بالوصول، لا يوجد توكن" });
  }
};
