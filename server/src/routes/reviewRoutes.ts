import express from "express";
import userAuth from "../middleware/userAuth";
import { createReview, getTutorRating } from "../controllers/reviewController";

const reviewRouter = express.Router();

reviewRouter.post("/", userAuth, createReview);
reviewRouter.get("/tutor/:tutorId", userAuth, getTutorRating);

export default reviewRouter;
