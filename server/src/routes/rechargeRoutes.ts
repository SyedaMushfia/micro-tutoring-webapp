import express from "express";
import { createRecharge, getRechargeHistory } from "../controllers/rechargeController";
import userAuth from "../middleware/userAuth";

const rechargeRouter = express.Router();

rechargeRouter.post("/top-up", userAuth, createRecharge);
rechargeRouter.get("/topup-history", userAuth, getRechargeHistory)

export default rechargeRouter;
