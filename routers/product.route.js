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


// {"message":"تم تسجيل الدخول بنجاح","user":{"_id":"67f3e076f86f08828ee1578e","email":"yyoyo6987@gmail.com","role":"admin","cartItems":[],"createdAt":"2025-04-07T14:25:58.774Z","updatedAt":"2025-04-22T21:07:53.883Z","__v":0,"otp":"390303","otpExpires":"2025-04-22T21:17:53.877Z"},"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZjNlMDc2Zjg2ZjA4ODI4ZWUxNTc4ZSIsImVtYWlsIjoieXlveW82OTg3QGdtYWlsLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc0NTM1NjA5NywiZXhwIjoxNzQ3OTQ4MDk3fQ.Rn5Y7F-i8U1gxjiWE_U48cYadRzQ5erdzc1pkS5Q59s"}