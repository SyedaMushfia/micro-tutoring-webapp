import { Router } from "express";
import { getSessionById, getSessionCount, getSessionMessages, getStudentSessionHistory, getTutorSessionHistory } from "../controllers/sessionController";
import userAuth from "../middleware/userAuth";

const sessionRouter = Router();

sessionRouter.get("/:sessionId", getSessionById);
sessionRouter.get("/:sessionId/messages", getSessionMessages);
sessionRouter.get("/student/:studentId/history", getStudentSessionHistory);
sessionRouter.get("/tutor/:tutorId/history", getTutorSessionHistory);
sessionRouter.get("/count/me", userAuth, getSessionCount);

export default sessionRouter;
