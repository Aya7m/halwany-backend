import { Router } from "express";
import { addToCart, getCartProducts, removeAllFromCart, updateQuantity } from "../controllers/cart.controller.js";
import { protect } from "../middleware/protectetRoute.js";

const cartRouter=Router()

cartRouter.post('/',protect,addToCart)
cartRouter.delete('/',protect,removeAllFromCart)
cartRouter.put('/:id',protect,updateQuantity)
cartRouter.get('/',protect,getCartProducts)

export default cartRouter