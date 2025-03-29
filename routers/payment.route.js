import { Router } from "express";
import { checkoutSuccess, createCheckoutSession } from "../controllers/payment.controller.js";
import { protect } from "../middleware/protectetRoute.js";


const paymentRoute=Router()
paymentRoute.post('/create-checkout-session',protect,createCheckoutSession);
paymentRoute.post('/checkout-success',protect,checkoutSuccess);


export default paymentRoute