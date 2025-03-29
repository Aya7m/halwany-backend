import { Product } from "../models/product.model.js";


export const addReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const { productId } = req.params;
        const userId = req.user._id; // 🛠️ استخراج `userId` من التوكن

        // 🛑 التأكد من أن المنتج موجود
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: "المنتج غير موجود" });

        // ✅ التحقق مما إذا كان المستخدم قد كتب مراجعة من قبل
        const alreadyReviewed = product.reviews.find((r) => r.user.toString() === userId.toString());
        if (alreadyReviewed) return res.status(400).json({ message: "لقد قمت بمراجعة هذا المنتج من قبل" });

        // ✅ إضافة المراجعة الجديدة
        const review = {
            user: userId,
            name: req.user.name, // 📝 اسم المستخدم
            rating: Number(rating),
            comment,
        };
        product.reviews.push(review);

        // 🔄 تحديث عدد التقييمات ومتوسط التقييم
        product.numReviews = product.reviews.length;
        product.rating =
            product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.numReviews;

        await product.save(); // حفظ التحديثات في قاعدة البيانات

        res.status(201).json({ message: "تمت إضافة المراجعة بنجاح" });
    } catch (error) {
        console.error("❌ خطأ في إضافة المراجعة:", error);
        res.status(500).json({ message: "حدث خطأ ما", error });
    }
};
