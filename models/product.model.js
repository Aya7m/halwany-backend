import mongoose from "mongoose";


const reviewSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // 🔗 ربط كل مراجعة بمستخدم معين
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5, // ✅ التقييم يكون بين 1 و 5
        },
        comment: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true, // ⏳ تسجيل وقت إنشاء المراجعة تلقائيًا
    }
);

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    price: {
        type: Number,
        required: true,
      
    },
    image: {
        type: String,
        required: true,
      
    },
    category: {
        type: String,
        required: true,
      
    },
    isFeatured: {
        type: Boolean,
        required: false,
        default: true, // ✅ القيمة الافتراضية هي false
      
    },
    isRecommended: {
        type: Boolean,
        required: false,
        default: false, // ✅ القيمة الافتراضية هي false
      
    },
    isBestSelling: {
        type: Boolean,
        required: false,
        default: false, // ✅ القيمة الافتراضية هي false
      
    },

    rating: { type: Number, default: 0 }, // ⭐ متوسط التقييم
    numReviews: { type: Number, default: 0 }, // 📊 عدد التقييمات
    reviews: [reviewSchema], // 📝 المراجعات
},
    {
        timestamps: true,
    }
);

export const Product = mongoose.model("Product", productSchema);