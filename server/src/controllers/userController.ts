import { Request, Response } from "../types/express";
import userModel from "../models/userModel";

export const getUserData = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id; 

    if (!userId) {
      return res.json({ success: false, message: "Not authorized" });
    }

    const user = await userModel.findById(userId).select("firstName lastName role");

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      userData: user,
    });
  } catch (error: any) {
    res.json({ success: false, message: error.message });
  }
};

export const getOnlineTutorsBySubject = async (req: Request, res: Response) => {
  try {
    const { subject } = req.query;

    if (!subject) {
      return res.json({ success: false, message: "Subject is required" });
    }

    const tutors = await userModel.find({ role: 'tutor', isOnline: true, "tutor.subjects": subject }).select("firstName lastName tutor"); 
    
    res.json(tutors);
  } catch (err) {

    res.json({ success: false, message: 'Tutors unavailable. Please try again later!' });
  }
};
