import { Router } from "express";
import { getCoupon, validateCoupon } from "../controllers/coupen.controller.js";
import { protect } from "../middleware/protectetRoute.js";


const coupenRouter=Router()

coupenRouter.get('/',protect,getCoupon)
coupenRouter.post('/validate',protect,validateCoupon)

export default coupenRouter