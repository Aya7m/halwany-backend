import { Product } from "../models/product.model.js";
import { User } from "../models/user.model.js";


export const addReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const { productId } = req.params;
        const userId = req.user._id;

        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: "المنتج غير موجود" });

        const alreadyReviewed = product.reviews.find(
            (r) => r.user.toString() === userId.toString()
        );
        if (alreadyReviewed) return res.status(400).json({ message: "لقد قمت بمراجعة هذا المنتج من قبل" });

        const review = {
            user: userId,
            name: req.user.email || "unknown@email.com", // 👈 الاسم = الإيميل
            rating: Number(rating),
            comment,
        };

        product.reviews.push(review);

        product.numReviews = product.reviews.length;
        product.rating =
            product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.numReviews;

        await product.save();

        res.status(201).json({ message: "تمت إضافة المراجعة بنجاح" });
    } catch (error) {
        console.error("❌ خطأ في إضافة المراجعة:", error);
        res.status(500).json({ message: "حدث خطأ ما", error });
    }
};

// get all reviews
export const getAllReviews = async (req, res) => {
    try {
        const { productId } = req.params;
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: "المنتج غير موجود" });
        res.status(200).json(product.reviews);
    } catch (error) {
        console.error("❌ خطاء في الحصول على جميع المراجعات:", error);
        res.status(500).json({ message: "حدث خطاء ما", error });
    }
};
