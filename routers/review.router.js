import { Router } from "express";
import { addReview, getAllReviews } from "../controllers/review.controller.js";
import { protect } from "../middleware/protectetRoute.js";

const reviewRouter=Router()

reviewRouter.post('/create/:productId',protect,addReview)
// get all reviews
reviewRouter.get('/get/:productId',getAllReviews)


export default reviewRouter