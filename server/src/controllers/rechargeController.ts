import { Request, Response } from "../types/express";
import rechargeModel from "../models/rechargeModel";
import userModel from "../models/userModel";
import mongoose from "mongoose";

const maskCardNumber = (cardNumber: string) => {
  const lastFourNumbers = cardNumber.slice(-4);
  return "**** **** **** " + lastFourNumbers;
};

export const createRecharge = async (req: Request, res: Response) => {
    try {
        const { cardName, cardNumber, expiry, amount } = req.body;

        if (!amount || amount <= 0) {
            return res.json({ success: false, message: "Amount must be greater than 0." });
        }

        const userId = req.user?._id; 
        if (!userId) {
            return res.json({ success: false, message: "Unauthorized." });
        }

        const user = await userModel.findById(userId);

        if (!user || !user.student) {
            return res.json({ success: false, message: "User not found." });
        }

        let usedCard;

        if (
          user.student?.savedCard &&
          user.student.savedCard.cardName &&
          user.student.savedCard.cardNumber &&
          user.student.savedCard.expiry
        ) {
          usedCard = user.student.savedCard;
        } else {
          if (!cardName || !cardNumber || !expiry) {
            return res.json({
              success: false,
              message: "All card fields are required."
            });
          }

          const maskedCardNumber = maskCardNumber(cardNumber);

          usedCard = {
            cardName,
            cardNumber: maskedCardNumber,
            expiry,
          };

          user.student!.savedCard = usedCard;
        }
        
        user.student!.balance = (user.student!.balance || 0) + Number(amount);
        await user.save();

        const recharge = new rechargeModel({ userId, amount: Number(amount), cardName: usedCard.cardName, cardNumber: usedCard.cardNumber, expiry: usedCard.expiry });

        await recharge.save();

        return res.json({ success: true, message: "Recharge successful", newBalance: user.student.balance, recharge });
    } catch (error: any) {
        console.error(error);
        return res.json({ success: false, message: error.message || "Server error." });
    }
};

export const getRechargeHistory = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.json({ success: false, message: "Unauthorized" });
    }

    const history = await rechargeModel.find({ userId: new mongoose.Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .select("amount cardNumber createdAt -_id");

    res.json({ success: true, history });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Server error" });
  }
};