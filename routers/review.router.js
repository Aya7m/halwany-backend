import { Router } from "express";
import { addReview } from "../controllers/review.controller.js";
import { protect } from "../middleware/protectetRoute.js";

const reviewRouter=Router()

reviewRouter.post('/create/:productId',protect,addReview)
reviewRouter.get('/get/:productId',protect,addReview)


export default reviewRouter