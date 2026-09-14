import mongoose, { Document, Model } from "mongoose";

export interface Review extends Document {
  sessionId: string;
  studentId: mongoose.Types.ObjectId;
  tutorId: mongoose.Types.ObjectId;
  rating: number;
  reviewText?: string;
  createdAt: Date;
}

const reviewSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true, unique: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    tutorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    reviewText: { type: String, default: "" },
  },
  { timestamps: true }
);

const reviewModel: Model<Review> = mongoose.models.Review || mongoose.model<Review>("Review", reviewSchema);

export default reviewModel;
