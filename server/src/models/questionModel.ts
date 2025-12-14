import mongoose, {Document, Model} from "mongoose";

interface Question extends Document {
    userId: string;
    subject: string;
    topic: string;
    question: string;
    image?: string;
    createdAt: Date;
}

const questionSchema = new mongoose.Schema({
    userId: {type: mongoose.Types.ObjectId, ref: "User", required: true},
    subject: {type: String, required: true},
    topic: {type: String, required: true},
    question: {type: String, required: true},
    image: { type: String, default: null },
}, { timestamps: true });

const questionModel: Model<Question> = mongoose.model<Question>('Question', questionSchema);

export default questionModel;