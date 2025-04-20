import { Router } from "express";
import { createProduct, deleteProductById, getAllProducts, getBestSellingProducts, getFeaturedProducts, getProductById, getProductByName, getProductsByCategory, getRecommendedProducts, toggleFeaturedProduct } from "../controllers/product.controller.js";
import { adminProtect, protect } from "../middleware/protectetRoute.js";

const productRoute=Router()

productRoute.get('/all',protect,adminProtect,getAllProducts)
productRoute.get('/get',getAllProducts)
productRoute.get('/featured',getFeaturedProducts)
productRoute.get('/recommended',getRecommendedProducts)
productRoute.get('/best-selling',getBestSellingProducts)
productRoute.get('/category/:category',getProductsByCategory)
productRoute.get('/name/:name',getProductByName)

productRoute.post('/create',protect,adminProtect,createProduct)
productRoute.put('/:id',protect,adminProtect,toggleFeaturedProduct)
productRoute.delete('/:id',protect,adminProtect,deleteProductById)
productRoute.get('/:id',getProductById)


export default productRoute