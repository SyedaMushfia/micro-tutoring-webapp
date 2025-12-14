import { Request, Response } from "../types/express";
import questionModel from "../models/questionModel";

export const askQuestion = async (req: Request, res: Response) => {
    try {
        const { subject, topic, question } = req.body;

        let image = null;

        if (req.file) {
            image = (req.file).path;
        }

        const userId = req.user?._id;

        const newQuestion = new questionModel({userId, subject, topic, question, image});

        await newQuestion.save();

        return res.json({ success: true, question: newQuestion })

    } catch (error: any) {
        return res.json({ success: false, message: error.message });
    }
}