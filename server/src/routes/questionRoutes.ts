import express from "express";
import { askQuestion } from "../controllers/questionController";
import userAuth from "../middleware/userAuth";
import fileUpload from "../middleware/fileUpload";

const questionRouter = express.Router();

questionRouter.post("/askQuestion", userAuth, fileUpload("questions").single("image"), askQuestion);

export default questionRouter;
