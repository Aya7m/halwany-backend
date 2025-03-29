import { Router } from "express";

import { protect } from "../middleware/protectetRoute.js";
import { getProfile, registerUser, sendOTP, verifyOTP } from "../controllers/auth.controller.js";

const authRoute=Router()

authRoute.post('/register', registerUser); // راوت جديد لتسجيل المستخدم

authRoute.post('/send-otp',sendOTP)
authRoute.post('/verify-otp',verifyOTP)
authRoute.get('/profile',protect,getProfile)

export default authRoute