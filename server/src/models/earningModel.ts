import mongoose, { Document, Model } from "mongoose";

export interface Earning extends Document {
  tutorId: mongoose.Types.ObjectId;
  sessionId: string;
  questionId: mongoose.Types.ObjectId;
  subject: string;
  amount: number;
  createdAt: Date;
}

const earningSchema = new mongoose.Schema(
  {
    tutorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    sessionId: { type: String, required: true },
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true },
    subject: { type: String, required: true },
    amount: { type: Number, required: true },
  },
  { timestamps: true }
);

const earningModel: Model<Earning> = mongoose.models.Earning || mongoose.model<Earning>("Earning", earningSchema);

export default earningModel;
