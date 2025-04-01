import nodemailer from "nodemailer";
import crypto from "crypto";
import { User } from "../models/user.model.js";
import { generateToken } from "../middleware/generateToken.js";



// export const registerUser = async (req, res) => {
//     try {
//         const { email } = req.body;

//         // التحقق مما إذا كان المستخدم موجودًا بالفعل
//         let user = await User.findOne({ email });
//         if (user) return res.status(400).json({ message: "المستخدم مسجل بالفعل" });

//         // إنشاء مستخدم جديد
//         user = new User({ ...req.body });
//         await user.save();

//         res.status(201).json({ message: "تم تسجيل المستخدم بنجاح", user });
//     } catch (error) {
//         res.status(500).json({ message: "حدث خطأ ما", error });
//     }
// };

// export const sendOTP = async (req, res) => {
//     try {
//         const { email } = req.body;
//         const trimmedEmail = email.trim(); // إزالة المسافات فقط من الإيميل
//          // إزالة أي مسافات زائدة

//         const otp = Math.floor(100000 + Math.random() * 900000); // إنشاء OTP عشوائي
//         const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // انتهاء الصلاحية بعد 10 دقائق

//         // ✅ تحديث OTP مع تمكين `upsert` لإنشاء مستخدم إذا لم يكن موجودًا
//         const result = await User.updateOne(
//             { email },
//             { $set: { otp, otpExpires } },
//             { upsert: false } // ✅ التأكد من أنه لن يُنشئ مستخدمًا جديدًا
//         );

//         if (result.modifiedCount === 0) {
//             return res.status(404).json({ message: "المستخدم غير موجود" });
//         }

//         // ✅ استرجاع المستخدم بعد الحفظ للتحقق من القيم
//         const user = await User.findOne({ email }).select("+otp +otpExpires");
//         console.log("📌 User after saving OTP:", user);

//         // 🔹 التحقق من حفظ القيم
//         if (!user.otp) {
//             return res.status(500).json({ message: "فشل في حفظ كود OTP، حاول مرة أخرى." });
//         }

//         console.log(`✅ OTP (${otp}) saved successfully for ${email}`);

//         // ✅ إرسال الإيميل
//         const transporter = nodemailer.createTransport({
//             service: "gmail",
//             auth: {
//                 user: process.env.EMAIL_USER,
//                 pass: process.env.EMAIL_PASS,
//             },
//             tls: {
//                 rejectUnauthorized: false,
//             }
//         });

//         await transporter.sendMail({
//             from: process.env.EMAIL_USER,
//             to: email,
//             subject: "رمز التحقق (OTP)",
//             text: `رمز التحقق الخاص بك هو: ${otp}`,
//         });

//         return res.status(200).json({ message: "تم إرسال OTP إلى بريدك الإلكتروني", email,user });

//     } catch (error) {
//         console.error("❌ خطأ عام:", error);
//         return res.status(500).json({ message: "حدث خطأ ما", error });
//     }
// };


export const registerUserAndSendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        // 🔹 إزالة أي مسافات غير ضرورية من الإيميل
        const trimmedEmail = email.trim();

        // ✅ التحقق مما إذا كان المستخدم مسجلًا بالفعل
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "المستخدم مسجل بالفعل" });

        // ✅ إنشاء مستخدم جديد
        user = new User({ ...req.body });
        await user.save();

        // ✅ إنشاء OTP عشوائي وصلاحيته
        const otp = Math.floor(100000 + Math.random() * 900000);
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // انتهاء الصلاحية بعد 10 دقائق

        // ✅ تحديث المستخدم بإضافة OTP
        user.otp = otp;
        user.otpExpires = otpExpires;
        await user.save();

        console.log(`✅ OTP (${otp}) saved successfully for ${email}`);

        // ✅ إرسال OTP عبر البريد الإلكتروني
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            tls: {
                rejectUnauthorized: false,
            }
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "رمز التحقق (OTP)",
            text: `رمز التحقق الخاص بك هو: ${otp}`,
        });

        return res.status(201).json({ message: "تم تسجيل المستخدم وإرسال OTP", email, otp });

    } catch (error) {
        console.error("❌ خطأ عام:", error);
        return res.status(500).json({ message: "حدث خطأ ما", error });
    }
};

export const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        // ✅ جلب المستخدم مع كود OTP المخزن
        const user = await User.findOne({ email }).select("+otp +otpExpires");

        console.log("📌 User from DB (Before Validation):", user);

        if (!user) {
            return res.status(404).json({ message: "المستخدم غير موجود" });
        }

        if (!user.otp) {
            return res.status(400).json({ message: "لم يتم العثور على OTP، يرجى طلب كود جديد." });
        }

        console.log("🔹 Received OTP:", otp);
        console.log("🔹 Stored OTP:", user.otp);
        console.log("⌛ Expiry:", user.otpExpires);

        // 🔴 التحقق من تطابق الأكواد
        if (user.otp.toString().trim() !== otp.toString().trim()) {
            console.log("❌ عدم تطابق الأكواد!");
            return res.status(400).json({ message: "كود التحقق غير صحيح" });
        }

        // ✅ التحقق من انتهاء صلاحية OTP
        if (!user.otpExpires || new Date(user.otpExpires) < new Date()) {
            return res.status(400).json({ message: "كود التحقق منتهي الصلاحية" });
        }

        // ✅ مسح OTP بعد نجاح التحقق
        await User.updateOne(
            { email },
            { $unset: { otp: "", otpExpires: "" } }
        );

        // ✅ توليد التوكن
        const token = generateToken(user);
        return res.status(200).json({ message: "تم تسجيل الدخول بنجاح", token });

    } catch (error) {
        console.error("❌ خطأ عام:", error);
        return res.status(500).json({ message: "حدث خطأ ما", error });
    }
};


export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        res.status(200).json({ message: "تم جلب الملف الشخصي بنجاح", user });
    } catch (error) {
        res.status(500).json({ message: "حدث خطاء ما", error });
    }
};