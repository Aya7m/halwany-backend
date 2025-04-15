import { Router } from "express";
import { addToCart, cleanCart, getCartProducts, removeAllFromCart, updateQuantity } from "../controllers/cart.controller.js";
import { protect } from "../middleware/protectetRoute.js";

const cartRouter=Router()

cartRouter.post('/:productId',protect,addToCart)
cartRouter.delete('/',protect,removeAllFromCart)
cartRouter.put('/:id',protect,updateQuantity)
cartRouter.delete('/delete',protect,cleanCart)
cartRouter.get('/',protect,getCartProducts)

export default cartRouter