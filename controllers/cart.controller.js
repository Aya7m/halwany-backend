import { Product } from "../models/product.model.js";


// export const addToCart = async (req, res) => {
// 	try {
//         const { productId } = req.body; 
//         const user = req.user; 

//         // ✅ تحقق من وجود `productId`
//         if (!productId) {
//             return res.status(400).json({ error: "Product ID is required" });
//         }

//         // ✅ جلب المنتج من قاعدة البيانات
//         const product = await Product.findById(productId);
//         if (!product) {
//             return res.status(404).json({ error: "Product not found" });
//         }

//         // ✅ تأكد أن `cartItems` موجودة وأنها مصفوفة
//         if (!user.cartItems || !Array.isArray(user.cartItems)) {
//             user.cartItems = [];
//         }

//         console.log("User cart items before adding:", user.cartItems);

//         // ✅ تصفية `null` أو `undefined` من `cartItems` لتجنب الأخطاء
//         user.cartItems = user.cartItems.filter(item => item && item.product);

//         // ✅ البحث عن المنتج في `cartItems` مع التأكد من أنه ليس `null`
//         const existingItem = user.cartItems.find((item) => item.product.toString() === productId);
        
//         if (existingItem) {
//             existingItem.quantity += 1;
//         } else {
//             user.cartItems.push({ product: product._id, quantity: 1 }); // ✅ إضافة المنتج ككائن وليس فقط ID
//         }

//         await user.save();
//         res.json(user.cartItems);
//     } catch (error) {
//         console.error("❌ Error in addToCart controller:", error.message);
//         res.status(500).json({ message: "Server error", error: error.message });
//     }
// };


// remove from cart



export const addToCart = async (req, res) => {
	try {
		const { productId } = req.params; // ← هنا التعديل
		const user = req.user;

		if (!productId) {
			return res.status(400).json({ error: "Product ID is required" });
		}

		const product = await Product.findById(productId);
		if (!product) {
			return res.status(404).json({ error: "Product not found" });
		}

		if (!user.cartItems || !Array.isArray(user.cartItems)) {
			user.cartItems = [];
		}

		user.cartItems = user.cartItems.filter(item => item && item.product);

		const existingItem = user.cartItems.find(
			(item) => item.product.toString() === productId
		);

		if (existingItem) {
			existingItem.quantity += 1;
		} else {
			user.cartItems.push({ product: product._id, quantity: 1 });
		}

		await user.save();
		res.json(user.cartItems);
	} catch (error) {
		console.error("❌ Error in addToCart controller:", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};


export const removeAllFromCart = async (req, res) => {
	try {
		const { productId } = req.body;
		const user = req.user;

		if (!productId) {
			// إذا لم يُرسل `productId`، يتم مسح السلة بالكامل
			user.cartItems = [];
		} else {
			// حذف المنتج المحدد من السلة
			user.cartItems = user.cartItems.filter((item) => item.product.toString() !== productId);
		}

		await user.save();
		res.json({ message: "Cart updated", cartItems: user.cartItems });
	} catch (error) {
		console.error("Error in removeAllFromCart controller:", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};






// update quantity
export const updateQuantity = async (req, res) => {
	try {
		const { id: productId } = req.params;
		const { quantity } = req.body;
		const user = req.user;

		// البحث عن المنتج داخل `cartItems`
		const existingItem = user.cartItems.find((item) => item.product.toString() === productId);

		if (!existingItem) {
			return res.status(404).json({ message: "Product not found in cart" });
		}

		// إذا كانت الكمية 0، نحذف العنصر من السلة
		if (quantity === 0) {
			user.cartItems = user.cartItems.filter((item) => item.product.toString() !== productId);
		} else {
			existingItem.quantity = quantity;
		}

		await user.save();
		res.json({ message: "Cart updated", cartItems: user.cartItems });
	} catch (error) {
		console.error("Error in updateQuantity controller:", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};





export const getCartProducts = async (req, res) => {

    try {
      
        const products = await Product.find({ _id: { $in: req.user.cartItems.map(item => item.product) } });

       
        const cartItems = products.map((product) => {
            const item = req.user.cartItems.find((cartItem) => cartItem.product.toString() === product._id.toString());
            return { ...product.toObject(), quantity: item.quantity };
        });

        res.json(cartItems);
    } catch (error) {
        console.log("Error in getCartProducts controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}
