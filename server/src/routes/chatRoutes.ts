import express from "express";
import userAuth from "../middleware/userAuth";
import fileUpload from "../middleware/fileUpload";
import { uploadChatImage } from "../controllers/chatController";

const chatRouter = express.Router();

chatRouter.post("/upload-image", userAuth, fileUpload("chat_images").single("image"), uploadChatImage);

export default chatRouter;
