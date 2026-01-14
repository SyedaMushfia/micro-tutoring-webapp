import mongoose, { Document, Model } from "mongoose";

const whiteboardSchema = new mongoose.Schema(
  {
    elements: { type: [Object], default: [] },
    participants: { type: [mongoose.Schema.Types.ObjectId], ref: "User", default: []},
    updatedAt: { type: Date, default: () => new Date()},
  },
  { _id: false }
);


interface Session extends Document {
  sessionId: string;
  tutorId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  questionId: mongoose.Types.ObjectId;
  subject: string;
  question: string;
  status: "Pending" | "Active" | "Completed" | "Expired";
  startedAt?: Date;
  endedAt?: Date;
  whiteboard?: {
    elements: any[];
    participants: mongoose.Types.ObjectId[];
    updatedAt: Date;
  }
}

const sessionSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true, unique: true },
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true },
    tutorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    subject: { type: String, required: true },
    question: { type: String, required: true },
    status: { type: String, enum: ["Pending", "Active", "Completed", "Expired"], default: 'Active' },
    startedAt: { type: Date, default: Date.now },
    endedAt: { type: Date },
    whiteboard: whiteboardSchema,
  },
  { timestamps: true }
);

const sessionModel: Model<Session> = mongoose.models.Session || mongoose.model<Session>("Session", sessionSchema);

export default sessionModel;
