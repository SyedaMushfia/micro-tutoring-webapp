import mongoose, { Document, Model } from "mongoose";

export interface Message extends Document {
  sessionId: string;
  senderId: mongoose.Types.ObjectId;
  senderName: string;
  message?: string;
  image?: string;
  createdAt: Date;
}

const messageSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true, index: true },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    senderName: { type: String, required: true },
    message: { type: String },
    image: { type: String },
    createdAt: { type: Date, default: Date.now },
  }
);

const messageModel: Model<Message> = mongoose.models.Message || mongoose.model<Message>("Message", messageSchema);

export default messageModel;