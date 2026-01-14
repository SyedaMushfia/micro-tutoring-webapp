import express from "express";
import userAuth from "../middleware/userAuth";
import { getTutorEarningsHistory } from "../controllers/earningController";

const earningRouter = express.Router();

earningRouter.get("/history", userAuth, getTutorEarningsHistory);

export default earningRouter;
