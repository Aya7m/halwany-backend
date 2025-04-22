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
  
      const trimmedEmail = email.trim();
  
      // 🔍 البحث عن المستخدم
      let user = await User.findOne({ email });
  
      // ✅ إنشاء أو تحديث المستخدم
      if (!user) {
        user = new User({ ...req.body });
      }
  
      // ✅ إنشاء OTP وصلاحية
      const otp = Math.floor(100000 + Math.random() * 900000);
      const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
  
      user.otp = otp;
      user.otpExpires = otpExpires;
      await user.save();
  
      console.log(`✅ OTP (${otp}) saved successfully for ${email}`);
  
      // ✅ إرسال OTP عبر البريد
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
        tls: {
          rejectUnauthorized: false,
        },
      });
  
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "رمز التحقق (OTP)",
        text: `رمز التحقق الخاص بك هو: ${otp}`,
      });
  
      return res.status(200).json({
        message: user.isNew ? "تم تسجيل المستخدم وإرسال OTP" : "المستخدم مسجل بالفعل وتم إرسال OTP",
        user,
        otp,
      });
  
    } catch (error) {
      console.error("❌ خطأ عام:", error);
      return res.status(500).json({ message: "حدث خطأ ما", error });
    }
  };
  


  export const verifyOTP = async (req, res) => {
    try {
      const { otp } = req.body;
  
      const user = await User.findOne({ otp }).select("+otp +otpExpires");
  
      if (!user) {
        return res.status(404).json({ message: "OTP غير صحيح أو المستخدم غير موجود" });
      }
  
      if (!user.otpExpires || new Date(user.otpExpires) < new Date()) {
        return res.status(400).json({ message: "كود التحقق منتهي الصلاحية" });
      }
  
      // ✅ مسح OTP بعد التحقق
      await User.updateOne(
        { _id: user._id },
        { $unset: { otp: "", otpExpires: "" } }
      );
  
      const token = generateToken(user);
      return res.status(200).json({ message: "تم تسجيل الدخول بنجاح", user, token });
  
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

// send email

export const sendEmail = async (req, res) => {
    const { name, email, phone, comment } = req.body;
    if (!name || !email || !comment) {
        return res.status(400).json({ message: "All fields are required" });
    }

     // send email or store in DB
  try {
    // مثال على إرسال إيميل
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: email,
      to: process.env.EMAIL_USER,
      subject: `New Contact from ${name}`,
      text: `Phone: ${phone}\n\n${comment}`
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ message: 'Failed to send email' });
  }
}