import mongoose, { Document, Model } from "mongoose";

export interface Recharge extends Document {
  userId: mongoose.Types.ObjectId;
  amount: number;
  cardName: string;
  cardNumber: string;
  expiry: string;
  createdAt: Date;
}

const rechargeSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    cardName: { type: String, required: true },
    cardNumber: { type: String, required: true },
    expiry: { type: String, required: true },
  },
  { timestamps: true }
);

const rechargeModel: Model<Recharge> = mongoose.models.Recharge || mongoose.model<Recharge>("Recharge", rechargeSchema);

export default rechargeModel;
