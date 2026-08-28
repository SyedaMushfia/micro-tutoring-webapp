import { Request, Response } from "../types/express";
import mongoose from "mongoose";
import reviewModel from "../models/reviewModel";
import sessionModel from "../models/sessionModel";

export const createReview = async (req: Request, res: Response) => {
  try {
    const studentId = req.user?._id;
    const { sessionId, rating } = req.body;
    const numericRating = Number(rating);

    if (!studentId || !sessionId || !Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({ success: false, message: "A rating from 1 to 5 is required" });
    }

    const session = await sessionModel.findOne({ sessionId, studentId });
    if (!session) {
      return res.status(404).json({ success: false, message: "Session not found" });
    }

    const review = await reviewModel.create({
      sessionId,
      studentId: new mongoose.Types.ObjectId(studentId),
      tutorId: session.tutorId,
      rating: numericRating,
    });

    const summary = await getTutorRatingSummary(session.tutorId.toString());
    res.status(201).json({ success: true, review, summary });
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: "This session has already been rated" });
    }
    console.error("Create review error:", error);
    res.status(500).json({ success: false, message: "Failed to submit rating" });
  }
};

export const getTutorRating = async (req: Request, res: Response) => {
  try {
    const tutorId = req.params.tutorId;
    if (!tutorId) return res.status(400).json({ success: false, message: "Tutor ID is required" });

    const summary = await getTutorRatingSummary(tutorId);
    res.json({ success: true, ...summary });
  } catch (error) {
    console.error("Get tutor rating error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch rating" });
  }
};

export const getTutorRatingSummary = async (tutorId: string) => {
  const [result] = await reviewModel.aggregate([
    { $match: { tutorId: new mongoose.Types.ObjectId(tutorId) } },
    { $group: { _id: "$tutorId", average: { $avg: "$rating" }, count: { $sum: 1 } } },
  ]);

  return {
    average: result ? Number(result.average.toFixed(1)) : 0,
    count: result?.count ?? 0,
  };
};
