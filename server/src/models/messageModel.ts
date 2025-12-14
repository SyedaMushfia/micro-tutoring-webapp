import mongoose, {Document, Model} from "mongoose";

interface Message extends Document {
    senderId: string;
    receiverId: string;
    text: string;
    image?: string;
    seen: boolean;
}

const messageSchema = new mongoose.Schema({
    senderId: {type: mongoose.Types.ObjectId, ref: "User", required: true},
    receiverId: {type: mongoose.Types.ObjectId, ref: "User", required: true},
    text: {type: String},
    image: {type: String},
    seen: {type: Boolean, default: false},
}, { timestamps: true });

const messageModel: Model<Message> = mongoose.model<Message>('Message', messageSchema);

export default messageModel;