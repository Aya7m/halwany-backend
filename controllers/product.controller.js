import cloudinary from "../lib/cloudinary.js";
import { Product } from "../models/product.model.js";

export const createProduct = async (req, res) => {
	try {
		const { name, description, price, image, category } = req.body;
		let cloudinaryResponse = null;

		if (image) {
			// رفع الصورة في Cloudinary
			cloudinaryResponse = await cloudinary.uploader.upload(image, { folder: "products" });
		}

		// إنشاء المنتج في MongoDB
		const product = await Product.create({
			name,
			description,
			price,
			image: cloudinaryResponse?.secure_url ? cloudinaryResponse.secure_url : "",
			category,
		});

		// إرسال الاستجابة بسرعة
		res.status(201).json(product);

	} catch (error) {
		console.log("Error in createProduct controller", error);
		res.status(500).json({ message: "Internal Server Error" });
	}
}


export const getAllProducts = async (req, res) => {
	try {
		const products = await Product.find({});
		res.status(200).json(products);
	} catch (error) {
		console.log("Error in getAllProducts controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
}

// get featured products
export const getFeaturedProducts = async (req, res) => {
	try {
		const products = await Product.find({ isFeatured: true });
		res.status(200).json(products);
	} catch (error) {
		console.log("Error in getFeaturedProducts controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
}

// get product by category
export const getProductsByCategory = async (req, res) => {
	try {
		const { category } = req.params;
		const products = await Product.find({ category });
		res.status(200).json(products);
	} catch (error) {
		console.log("Error in getProductsByCategory controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
}

// get recommended products
export const getRecommendedProducts = async (req, res) => {
	try {
		const products = await Product.aggregate([
			{
				$sample: { size: 4 },
			},
			{
				$project: {
					_id: 1,
					name: 1,
					description: 1,
					image: 1,
					price: 1,
				},
			},
		]);

		res.json(products);
	} catch (error) {
		console.log("Error in getRecommendedProducts controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
}

// get best selling products
export const getBestSellingProducts = async (req, res) => {
	try {

		const products = await Product.find({ isBestSelling: true });
		res.status(200).json(products);
	} catch (error) {
		console.log("Error in getBestSellingProducts controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
}

// get product by name
export const getProductByName = async (req, res) => {
	try {
		const { name } = req.params;
		const product = await Product.findOne({ name });
		res.status(200).json(product);
	} catch (error) {
		console.log("Error in getProductByName controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
}

// delete product by id
export const deleteProductById = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);

		if (!product) {
			return res.status(404).json({ message: "Product not found" });
		}

		if (product.image) {
			const publicId = product.image.split("/").pop().split(".")[0];
			try {
				await cloudinary.uploader.destroy(`products/${publicId}`);
				console.log("deleted image from cloduinary");
			} catch (error) {
				console.log("error deleting image from cloduinary", error);
			}
		}

		await Product.findByIdAndDelete(req.params.id);

		res.json({ message: "Product deleted successfully" });
	} catch (error) {
		console.log("Error in deleteProductById controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
}

export const toggleFeaturedProduct = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);
		if (product) {
			product.isFeatured = !product.isFeatured;
			const updatedProduct = await product.save();
			await updateFeaturedProductsCache();
			res.json(updatedProduct);
		} else {
			res.status(404).json({ message: "Product not found" });
		}
	} catch (error) {
		console.log("Error in toggleFeaturedProduct controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

async function updateFeaturedProductsCache() {
	try {
		// The lean() method  is used to return plain JavaScript objects instead of full Mongoose documents. This can significantly improve performance

		const featuredProducts = await Product.find({ isFeatured: true }).lean();


	} catch (error) {
		console.log("error in update cache function");
	}
}

export const getProductById = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id).populate("reviews.user", "email name");
		if (!product) {
			return res.status(404).json({ message: "المنتج غير موجود" });
		}
		res.status(200).json(product);
	} catch (error) {
		console.error("❌ Error in getProductById controller:", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};
