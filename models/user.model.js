import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,

    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,

      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    otp: {
      type: String, // كود التحقق
      select: true,

    },
    otpExpires: {
      type: Date, // تاريخ انتهاء صلاحية الكود
      select: true

    },
    phone: {

      type: String
    },
    comment: String,

    cartItems: [
      {
        quantity: {
          type: Number,
          default: 1,
        },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
      },
    ],
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
