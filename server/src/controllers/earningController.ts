import { Request, Response } from "../types/express";
import earningModel from "../models/earningModel";
import mongoose from "mongoose";

export const getTutorEarningsHistory = async (req: Request, res: Response) => {
  try {
    const tutorId = req.user?._id;

    if (!tutorId) {
      return res.json({ success: false, message: "Unauthorized" });
    }

    const history = await earningModel
      .find({ tutorId: new mongoose.Types.ObjectId(tutorId) })
      .sort({ createdAt: -1 })
      .select("questionId subject amount createdAt -_id");

    res.json({ success: true, history });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Server error" });
  }
};
