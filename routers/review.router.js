import { Router } from "express";
import { addReview } from "../controllers/review.controller.js";
import { protect } from "../middleware/protectetRoute.js";

const reviewRouter=Router()

reviewRouter.post('/create',protect,addReview)


export default reviewRouter