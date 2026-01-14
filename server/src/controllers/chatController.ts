import { Request, Response } from "../types/express";

export const uploadChatImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.json({ success: false, message: "No image uploaded"});
    }

    return res.json({ success: true, imageUrl: req.file.path });

  } catch (error) {

    console.error("Chat image upload failed:", error);
    return res.json({ success: false, message: "Image upload failed" });
    
  }
};
